import { Knex } from "knex";

import ClassDiagram, { Member, Method, Relation } from "./ClassDiagram";
import {
  getAccessibility,
  getClassifierMember,
  getClassifierMethod,
  getMemberName,
  getMemberReturnType,
  getMethodName,
  getMethodReturnType,
} from "./index";

export async function initDatabase(conn: any, classDiagram: ClassDiagram) {
  await createMethodsTable(conn);
  await createMembersTable(conn);
  await createClassesTable(conn);
  await createRelationsTable(conn);

  //insert methods and members
  classDiagram.getClasses().forEach(async (_class) => {
    _class.members.forEach(async (member) => {
      await conn("members")
        .insert({
          type: getMemberReturnType(member),
          name: getMemberName(member),
          accessibility: getAccessibility(member),
          classifier: getClassifierMember(member),
          class: _class.id,
        })
        .then()
        .catch((e) => {
          console.log(e);
          throw e;
        });
    });

    _class.methods.forEach(async (method) => {
      await conn("methods")
        .insert({
          returnType:
            getMethodReturnType(method) !== ""
              ? getMethodReturnType(method)
              : "void",
          name: getMethodName(method),
          accessibility: getAccessibility(method),
          classifier: getClassifierMethod(method),
          class: _class.id,
        })
        .then()
        .catch((e) => {
          console.log(e);
          throw e;
        });
    });
  });

  //insert classes
  await conn("classes")
    .insert(classDiagram.getClasses())
    .then(() => console.log("classes inserted"))
    .catch((e) => {
      console.log(e);
      throw e;
    });

  //insert relations
  await conn("relations")
    .insert(classDiagram.getRelations())
    .then(() => console.log("relations inserted"))
    .catch((e) => {
      console.log(e);
      throw e;
    });
}

export async function createMethodsTable(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("methods", (table) => {
      table.increments("id").primary();
      table.string("returnType");
      table.string("name");
      table.string("accessibility");
      table.string("classifier");
      table.string("class");
    })
    .then((res) => {
      console.log("Methods table created");
    });
}

export async function createMembersTable(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("members", (table) => {
      table.increments("id").primary();
      table.string("type");
      table.string("name");
      table.string("accessibility");
      table.string("classifier");
      table.string("class");
    })
    .then((res) => {
      console.log("Members table created");
    });
}

export async function createClassesTable(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("classes", (table) => {
      table.string("id").primary();
      table.string("type");
      table.string("members");
      table.string("methods");
    })
    .then((res) => {
      console.log("Classes table created");
    });
}

export async function createRelationsTable(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("relations", (table) => {
      table.increments("id").primary();
      table.string("first_class");
      table.string("relation");
      table.string("second_class");
    })
    .then((res) => {
      console.log("Relations table created");
    });
}


export async function createDesignPatternTable(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("design_patterns", (table) => {
      table.increments("id").primary();
      table.string("className");
      table.boolean("singleton");
    })
    .then((res) => {
      console.log("Design pattern table created");
    });
}

//get all relations
export async function getAllRelations(conn): Promise<Relation[]> {
  let relationsArray: Relation[] = [];

  await conn
    .from("relations")
    .select("*")
    .then((rows) => {
      rows.forEach((row) => {
        relationsArray.push(row);
      });
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return relationsArray;
}

export async function getAllWithRelation(
  relationName: string,
  conn
): Promise<Relation[]> {
  let relationsArray: Relation[] = [];

  await conn
    .from("relations")
    .select("*")
    .where({ relation: relationName })
    .then((rows) =>
      rows.forEach((row) => {
        relationsArray.push(row);
      })
    )
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return relationsArray;
}

export async function checkSingletonByName(
  className: string,
  conn
): Promise<boolean> {
  let classMembers: Member[] = [];
  let classMethods: Method[] = [];
  let allOtherMembers: Member[] = [];

  await conn
    .from("members")
    .select("*")
    .where({ class: className })
    .then((rows) => {
      rows.forEach((row) => {
        classMembers.push(row);
      });
    });

  await conn
    .from("methods")
    .select("*")
    .where({ class: className })
    .then((rows) => {
      rows.forEach((row) => {
        classMethods.push(row);
      });
    });

  await conn
    .from("members")
    .select("*")
    .whereNot({ class: className })
    .then((rows) => {
      rows.forEach((row) => {
        allOtherMembers.push(row);
      });
    });

  if (!classMembers.length) {
    return false;
  }

  //step 1 check for private static instance of class

  for (let i = 0; i < classMembers.length; i++) {
    if (
      classMembers[i].type === className &&
      classMembers[i].accessibility === "private" &&
      classMembers[i].classifier === "static"
    ) {
      break;
    } else {
      if (i == classMembers.length - 1) {
        return false;
      }
    }
  }

  //step 2 check for private constructor

  for (let i = 0; i < classMethods.length; i++) {
    if (
      classMethods[i].accessibility === "private" &&
      classMethods[i].name === className
    ) {
      break;
    } else {
      if (i == classMethods.length - 1) {
        return false;
      }
    }
  }

  //step 3 public method returning instance

  for (let i = 0; i < classMethods.length; i++) {
    if (
      classMethods[i].accessibility === "public" &&
      classMethods[i].returnType === className &&
      classMethods[i].classifier === "static"
    ) {
      break;
    } else {
      if (i == classMethods.length - 1) {
        return false;
      }
    }
  }

  //step 4 check other class members for singleton class instance

  allOtherMembers.forEach((member) => {
    if (member.type === className) {
      return false;
    }
  });

  return true;
}
