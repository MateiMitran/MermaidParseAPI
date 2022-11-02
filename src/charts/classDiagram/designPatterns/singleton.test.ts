import * as mermaid from "mermaid";

import knex, {Knex} from "knex";

import { initSingletonTable, createDesignPatternTable, insertDesignPatterns } from "./singleton";
import ClassDiagram from "../ClassDiagram";
import { initDatabase } from "../database";

const input = "classDiagram\r\n    Animal <|-- Duck\r\n    Animal <|-- Fish\r\n    Animal <|-- Zebra\r\n    Singleton --> Singleton\r\n    Animal : +int age\r\n    Animal : +String gender\r\n    Animal: +isMammal()\r\n    Animal: +mate()\r\n    class Duck{\r\n        +String beakColor\r\n        +swim()\r\n        +quack()\r\n    }\r\n    class Fish{\r\n        -int sizeInFeet\r\n        -canEat()\r\n    }\r\n    class Zebra{\r\n        +bool is_wild\r\n        +run()\r\n    }\r\n    class Singleton{\r\n        -Singleton singleton$\r\n        -Singleton()\r\n        +getInstance()$ Singleton\r\n   }";

const conn = knex({
    client: "sqlite3",
    connection: {
      filename: ":memory:",
    },
    useNullAsDefault: true,
  });

const temp = mermaid.default.mermaidAPI.parse(input).parser.yy;

let classDiagram: ClassDiagram = new ClassDiagram(temp.getClasses(), temp.getRelations());

describe("Singleton tests", () => {


    beforeAll(async () => {
    //clear parser
    mermaid.default.mermaidAPI.parse(input).parser.yy.clear();
    await initDatabase(conn, classDiagram);
    });

    test("Testing creating design pattern table", () => {
       // await createDesignPatternTable(conn);
        //expect(Knex.schema.hasTable)
    })


})