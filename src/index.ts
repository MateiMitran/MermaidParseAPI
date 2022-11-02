import * as mermaid from "mermaid";

import knex from "knex";
import ClassDiagram, { Relation } from "./charts/classDiagram/ClassDiagram";

import { initDatabase } from "./charts/classDiagram/database";

import { getAllDesignPatterns } from "./charts/classDiagram/designPatterns/singleton";

const input =
  "classDiagram\r\n    Animal <|-- Duck\r\n    Animal <|-- Fish\r\n    Animal <|-- Zebra\r\n    Singleton --> Singleton\r\n    Animal : +int age\r\n    Animal : +String gender\r\n    Animal: +isMammal()\r\n    Animal: +mate()\r\n    class Duck{\r\n        +String beakColor\r\n        +swim()\r\n        +quack()\r\n    }\r\n    class Fish{\r\n        -int sizeInFeet\r\n        -canEat()\r\n    }\r\n    class Zebra{\r\n        +bool is_wild\r\n        +run()\r\n    }\r\n    class Singleton{\r\n        -Singleton singleton$\r\n        -Singleton()\r\n        +getInstance()$ Singleton\r\n   }";

async function MermaidInterpeter(
  input: string
): Promise<{ relations: Relation[] /*, designPattern: DesignPattern[] */ }> {
  try {
    console.log("[Starting Parse]");
    //establish database connection
    const conn = knex({
      client: "sqlite3",
      connection: {
        filename: ":memory:",
      },
      useNullAsDefault: true,
    });

    //clear parser
    mermaid.default.mermaidAPI.parse(input).parser.yy.clear();
    //parse input
    const temp = mermaid.default.mermaidAPI.parse(input).parser.yy;

    let classDiagram: ClassDiagram = new ClassDiagram(
      temp.getClasses(),
      temp.getRelations()
    );
    if (classDiagram.getRelations().length > 0) {
      await initDatabase(conn, classDiagram);

      //  console.log("[RELATIONS]");

      //await getAllRelations(conn).then((res) => {
      //   let i: number = 1;
      //  res.forEach((r) => {
      //    console.log(
      //       `[${i}] ${r.first_class} has a relation of ${r.relation} with ${r.second_class}`
      //      );
      //      i++;
      //    });
      //  });

        await getAllDesignPatterns(conn).then(res => console.log(res))


      return {
        relations: classDiagram.getRelations(),
        //designPattern:
      };
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}

MermaidInterpeter(input);
