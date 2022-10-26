import { Knex } from "../node_modules/knex/knex.js";

import { Member, Method, Relation, _Class } from "./Charts/ClassDiagram.js";

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
      table.string("returnType");
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
  let ok: number = 0;

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

    //step 1 check for private static instance of class
  classMembers.forEach((member) => {
    if (
      member.returnType === className &&
      member.accessibility === "private" &&
      member.classifier === "static"
    ) {
      ok = 1;
    }
  });

  if (ok == 0) {
    return false;
  }

  //step 2 check for private constructor
  for (var method of classMethods) {
    if (method.accessibility === "private" && method.name === className) {
      ok = 1;
      break;
    } else {
      ok = 0;
    }
  }

  if (ok == 0) {
    return false;
  }

  //step 3 public method returning instance
  for (var method of classMethods) {
    if (
      method.accessibility === "public" &&
      method.returnType === className &&
      method.classifier === "static"
    ) {
      ok = 1;
      break;
    } else {
      ok = 0;
    }
  }

  if (ok == 0) {
    return false;
  }

  //step 4 check other class members for singleton class instance

  allOtherMembers.forEach(member => {
    if (member.returnType === className) {
      ok=0;
    }
  });
  
  if (ok==1) {return true;}
  else {return false;}
}

export async function getAllMethods(conn): Promise<Method[]> {
  let methods: Method[] = [];

  await conn
    .from("methods")
    .select("*")
    .then((rows) =>
      rows.forEach((row) => {
        methods.push(row);
      })
    )
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return methods;
}

export async function getAllMembers(conn): Promise<Member[]> {
  let members: Member[] = [];

  await conn
    .from("members")
    .select("*")
    .then((rows) =>
      rows.forEach((row) => {
        members.push(row);
      })
    )
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return members;
}

export async function getAllClasses(conn): Promise<_Class[]> {
  let classes: _Class[] = [];

  await conn
    .from("classes")
    .select("*")
    .then((rows) =>
      rows.forEach((row) => {
        classes.push(row);
      })
    )
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return classes;
}
