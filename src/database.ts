import { Knex } from "../node_modules/knex/knex.js";
//fix

export async function createMethodsTable(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("methods", (table) => {
      table.increments("id").primary();
      table.string("returnType");
      table.string("name");
      table.string("accesibility");
      table.string("classifier");
    })
    .then(res => {
      console.log("Methods table created");
    })
}

export async function createMembersTable(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("members", (table) => {
      table.increments("id").primary();
      table.string("returnType");
      table.string("name");
      table.string("accessibility");
      table.string("classifier");
    })
    .then(res => {
      console.log("Members table created");
    })
}


export async function createClassesTable(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("classes", (table) => {
      table.string("id").primary();
      table.string("type");
      table.string("members");
      table.string("methods")
    })
    .then((res) => {
      console.log("Classes table created");
    });
}

export async function createRelationsTable(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("relations", (table) => {
      table.increments("id").primary();
      table.string("first_class")
      table.string("relation");
      table.string("second_class")
    })
    .then((res) => {
      console.log("Relations table created");
    });
}

//get all relations
export async function getAllRelations(conn): Promise<string[]> {
  let relationsArray: string[] = [];

  conn
    .from("relations")
    .select("*")
    .then((rows) =>
      rows.forEach((row) => {
        relationsArray.push(
          `${row["id"]} ${row["first_class"]} ${row["relation"]} ${row["second_class"]}`
        );
      })
    )
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return relationsArray;
}

export async function getAllWithRelation(
  relationName: string,
  conn
): Promise<string[]> {
  let relationsArray: string[] = [];

  conn
    .from("relations")
    .select("*")
    .where({ relation: relationName })
    .then((rows) =>
      rows.forEach((row) => {
        relationsArray.push(
          `${row["id"]} ${row["first_class"]} ${row["relation"]} ${row["second_class"]}`
        );
      })
    )
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return relationsArray;
}

export async function getAllMethods(conn): Promise<string[]> {

  let methods: string[] = [];

  conn
    .from("methods")
    .select("*")
    .then((rows) =>
      rows.forEach((row) => {
        methods.push(
          `${row["id"]} ${row["returnType"]} ${row["name"]} ${row["accessibility"]} ${row["classifier"]}`
        );
      })
    )
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return methods;
}

export async function getAllMembers(conn): Promise<string[]> {

  let members: string[] = [];

  conn
    .from("members")
    .select("*")
    .then((rows) =>
      rows.forEach((row) => {
        members.push(
          `${row["id"]} ${row["returnType"]} ${row["name"]} ${row["accessibility"]} ${row["classifier"]}`
        );
      })
    )
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return members;
}

export async function getAllClasses(conn): Promise<string[]> {
  let classes: string[] = [];

  conn
    .from("classes")
    .select("*")
    .then((rows) =>
      rows.forEach((row) => {
        classes.push(
          `${row["id"]} ${row["type"]} ${row["members"]} ${row["methods"]}`
        );
      })
    )
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return classes;
}

