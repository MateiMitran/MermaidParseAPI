import { Knex } from "knex";

import ClassDiagram, { DesignPattern, Relation } from "./ClassDiagram";
import {
  getAccessibility,
  getClassifierMember,
  getClassifierMethod,
  getMemberName,
  getMemberReturnType,
  getMethodName,
  getMethodReturnType,
} from "./index";

import { initSingletonTable } from "./designPatterns/singleton";

export async function initDatabase(conn: Knex, classDiagram: ClassDiagram) {
  await createMethodsTable(conn);
  await createMembersTable(conn);
  await createClassesTable(conn);
  await createRelationsTable(conn);

  await insertMembersAndMethods(conn, classDiagram);

  //insert classes
  await insertArray(conn, "classes", classDiagram.getClasses());

  //insert relations
  await insertArray(conn, "relations", classDiagram.getRelations());

  await initSingletonTable(conn, classDiagram);
}

//get all relations
export async function getAllRelations(conn: Knex): Promise<Relation[]> {
  return getAll(conn, "relations");
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

export async function getAll(conn, tableName: String): Promise<any[]> {
  return conn
    .from(tableName)
    .select("*")
    .then((rows) => {
      console.log(rows);
      return rows;
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });
}

export async function createMethodsTable(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.createTable("methods", (table) => {
    table.increments("id").primary();
    table.string("returnType");
    table.string("name");
    table.string("accessibility");
    table.string("classifier");
    table.string("class");
  }).then(() => console.log(`methods created`))
  .catch((e) => {
    console.log(e);
    throw e;
  });;
}

export async function createMembersTable(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.createTable("members", (table) => {
    table.increments("id").primary();
    table.string("type");
    table.string("name");
    table.string("accessibility");
    table.string("classifier");
    table.string("class");
  }).then(() => console.log(`members created`))
  .catch((e) => {
    console.log(e);
    throw e;
  });;
}

export async function createClassesTable(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.createTable("classes", (table) => {
    table.string("id").primary();
    table.string("type");
    table.string("members");
    table.string("methods");
  }).then(() => console.log(`classes created`))
  .catch((e) => {
    console.log(e);
    throw e;
  });;
}

export function createRelationsTable(knex: Knex): Promise<void> {
  return knex.schema.createTable("relations", (table) => {
    table.increments("id").primary();
    table.string("first_class");
    table.string("relation");
    table.string("second_class");
  }).then(() => console.log(`relations created`))
  .catch((e) => {
    console.log(e);
    throw e;
  });;
}

export async function insertArray(conn: Knex, tableName: string, array: any[]): Promise<void> {
  return await conn(tableName)
    .insert(array)
    .then(() => console.log(`${tableName} inserted`))
    .catch((e) => {
      console.log(e);
      throw e;
    });
}

export async function insertMembersAndMethods(
  conn: Knex,
  classDiagram: ClassDiagram
): Promise<void> {
  //insert methods and members
  classDiagram.getClasses().forEach((_class) => {
    _class.members.forEach(async (member) => {
      await conn("members").insert({
        type: getMemberReturnType(member),
        name: getMemberName(member),
        accessibility: getAccessibility(member),
        classifier: getClassifierMember(member),
        class: _class.id,
      });
    });

    _class.methods.forEach(async (method) => {
     await conn("methods").insert({
        returnType:
          getMethodReturnType(method) !== ""
            ? getMethodReturnType(method)
            : "void",
        name: getMethodName(method),
        accessibility: getAccessibility(method),
        classifier: getClassifierMethod(method),
        class: _class.id,
      });
    });
  });
}
