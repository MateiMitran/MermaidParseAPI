import { Knex } from "knex";
import ClassDiagram, { DesignPattern, Member, Method } from "../ClassDiagram";
import { getAll } from "../database";

export async function initSingletonTable(
  conn: Knex,
  classDiagram: ClassDiagram
) {
  await createDesignPatternTable(conn).then(
    async () =>
      await insertDesignPatterns(conn, classDiagram).then((res) =>
        console.log("inserted patterns")
      )
  );
}

export async function createDesignPatternTable(
  knex: Knex
): Promise<Knex.SchemaBuilder> {
  return knex.schema
    .createTable("patterns", (table) => {
      table.increments("id").primary();
      table.string("className");
      table.boolean("singleton");
    });
knex
  }

export async function insertDesignPatterns(
  conn: Knex,
  classDiagram: ClassDiagram
) {
  classDiagram.getClasses().forEach(async (_class) => {
    await checkSingletonByName(_class.id, conn).then(async (res) => {
      await conn("patterns")
        .insert({ className: _class.id, singleton: res })
        .then((res) => console.log("Inserted row in pattern collumn" + res));
    });
  });
}

export async function checkSingletonByName(
  className: string,
  conn: Knex
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

export async function getAllDesignPatterns(
  conn: Knex
): Promise<DesignPattern[]> {
  return getAll(conn, "patterns");
}
