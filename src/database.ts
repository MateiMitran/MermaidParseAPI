import { Knex } from "../node_modules/knex/knex.js";
//fix

//create database structure diagram
export async function createClassesTable(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("classes", (table) => {
      table.increments("id").primary();
      table.string("name");
      //methods? fields?
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

// getAllSubclasses(), getAllBaseClasses(), ...
