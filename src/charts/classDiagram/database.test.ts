import knex from "knex";
import {
  createClassesTable,
  createMembersTable,
  createMethodsTable,
  createRelationsTable,
  getAllRelations,
  getAllWithRelation,
} from "./database";

const classes = [
  {
    id: "Animal",
    type: "",
    members: "+int age, +String gender",
    methods: "+isMammal(), +mate()",
  },
  {
    id: "Duck",
    type: "",
    members: "+String beakColor",
    methods: "+swim(), +quack()",
  },
  { id: "Fish", type: "", members: "-int sizeInFeet", methods: "-canEat()" },
  { id: "Zebra", type: "", members: "+bool is_wild", methods: "+run()" },
  {
    id: "Singleton",
    type: "",
    members: "-Singleton singleton$",
    methods: "-Singleton(), +getInstance()$ Singleton",
  },
];

const relations = [
  {
    id: 1,
    first_class: "Duck",
    relation: "inheritance",
    second_class: "Animal",
  },
  {
    id: 2,
    first_class: "Fish",
    relation: "inheritance",
    second_class: "Animal",
  },
  {
    id: 3,
    first_class: "Zebra",
    relation: "inheritance",
    second_class: "Animal",
  },
  {
    id: 4,
    first_class: "Singleton",
    relation: "association",
    second_class: "Singleton",
  },
];

const methods = [
  {
    id: 1,
    returnType: "void",
    name: "isMammal",
    accessibility: "public",
    classifier: "none",
    class: "Animal",
  },
  {
    id: 2,
    returnType: "void",
    name: "mate",
    accessibility: "public",
    classifier: "none",
    class: "Animal",
  },
  {
    id: 3,
    returnType: "void",
    name: "swim",
    accessibility: "public",
    classifier: "none",
    class: "Duck",
  },
  {
    id: 4,
    returnType: "void",
    name: "quack",
    accessibility: "public",
    classifier: "none",
    class: "Duck",
  },
  {
    id: 5,
    returnType: "void",
    name: "canEat",
    accessibility: "private",
    classifier: "none",
    class: "Fish",
  },
  {
    id: 6,
    returnType: "void",
    name: "run",
    accessibility: "public",
    classifier: "none",
    class: "Zebra",
  },
  {
    id: 7,
    returnType: "void",
    name: "Singleton",
    accessibility: "private",
    classifier: "none",
    class: "Singleton",
  },
  {
    id: 8,
    returnType: "Singleton",
    name: "getInstance",
    accessibility: "public",
    classifier: "static",
    class: "Singleton",
  },
];

const members = [
  {
    id: 1,
    type: "int",
    name: "age",
    accessibility: "public",
    classifier: "none",
    class: "Animal",
  },
  {
    id: 2,
    type: "String",
    name: "gender",
    accessibility: "public",
    classifier: "none",
    class: "Animal",
  },
  {
    id: 3,
    type: "String",
    name: "beakColor",
    accessibility: "public",
    classifier: "none",
    class: "Duck",
  },
  {
    id: 4,
    type: "int",
    name: "sizeInFeet",
    accessibility: "private",
    classifier: "none",
    class: "Fish",
  },
  {
    id: 5,
    type: "bool",
    name: "is_wild",
    accessibility: "public",
    classifier: "none",
    class: "Zebra",
  },
  {
    id: 6,
    type: "Singleton",
    name: "singleton",
    accessibility: "private",
    classifier: "static",
    class: "Singleton",
  },
];

const patterns = [
  {
    id:1,
    className: "Singleton",
    singleton: "true"
  },
  {
    id:2,
    className: "Animal",
    singleton: "false"
  }
];

const conn = knex({
  client: "sqlite3",
  connection: {
    filename: ":memory:",
  },
  useNullAsDefault: true,
});

describe("Database tests", () => {
  beforeAll(async () => {
    await createClassesTable(conn);
    await createRelationsTable(conn);
    await createMembersTable(conn);
    await createMethodsTable(conn);
   // await createDesignPatternTable(conn);
    await conn("classes")
      .insert(classes)
      .then(() => console.log("classes inserted"))
      .catch((e) => {
        console.log(e);
        throw e;
      });
    await conn("relations")
      .insert(relations)
      .then(() => console.log("relations inserted"))
      .catch((e) => {
        console.log(e);
        throw e;
      });
    await conn("members")
      .insert(members)
      .then(() => console.log("members inseretd"))
      .catch((e) => {
        console.log(e);
        throw e;
      });
    await conn("methods")
      .insert(methods)
      .then(() => console.log("methods inseretd"))
      .catch((e) => {
        console.log(e);
        throw e;
      });
    await conn("patterns")
      .insert(patterns)
      .then(() => console.log("patterns inseretd"))
      .catch((e) => {
        console.log(e);
        throw e;
      });
  });

  afterAll(async () => {
    conn.destroy();
  });

  test("Get all relations", async () => {
    let i: number = 0;
    await getAllRelations(conn).then((res) => {
      res.forEach((relation) => {
        expect(JSON.stringify(relation)).toStrictEqual(
          JSON.stringify(relations[i])
        );
        i++;
      });
    });
  });

  test("Get all inheritance relations", async () => {
    await getAllWithRelation("inheritance", conn).then((res) => {
      res.forEach((relation) => {
        expect(relation.relation).toStrictEqual("inheritance");
      });
    });
  });
/** 
  test("Check correct singleton", async () => {
    await checkSingletonByName("Singleton", conn).then((res) => {
      expect(res).toStrictEqual(true);
    });
  });

  test("Check incorrect singleton", async () => {
    await checkSingletonByName("Duck", conn).then((res) => {
      expect(res).toStrictEqual(false);
    });
  });

  test("Check nonexistent singleton", async () => {
    await checkSingletonByName("X", conn).then((res) => {
      expect(res).toStrictEqual(false);
    });
  });

  test("Get all patterns", async () => {
    let i:number = 1;
    await getAllDesignPatterns(conn).then((res)=> {
      console.log(res);
        res.forEach(pattern => {
        expect(JSON.stringify(pattern)).toStrictEqual(JSON.stringify(patterns[i]));
        i++;
      });
    })
    });*/
});
