import * as mermaid from "mermaid";

import knex from "knex";
import {
  ClassDiagram,
  DesignPattern,
  getAllClasses,
  getAllDesignPatterns,
  getAllRelations,
  initDatabase,
  Relation,
  _Class,
} from "./charts/classDiagram/index";

const input =
  "classDiagram\r\n  Singleton-->Singleton\r\n SecondSingleton-->SecondSingleton\r\n   Animal <|-- Duck\r\n    Animal <|-- Fish\r\n    Animal <|-- Zebra\r\n  Animal : +int age\r\n    Animal : +String gender\r\n    Animal: +isMammal()\r\n    Animal: +mate()\r\n    class Duck{\r\n        +String beakColor\r\n        +swim()\r\n        +quack()\r\n    }\r\n    class Fish{\r\n        -int sizeInFeet\r\n        -canEat()\r\n    }\r\n    class Zebra{\r\n        +bool is_wild\r\n        +run()\r\n    }\r\n    class Singleton{\r\n        -Singleton singleton$\r\n        -Singleton()\r\n        +getInstance()$ Singleton\r\n   }\r\n    class SecondSingleton{\r\n        -SecondSingleton singleton$\r\n        -SecondSingleton()\r\n        +getInstance()$ SecondSingleton\r\n   }";

//ParseidonJS
export async function MermaidInterpeter(
  input: string
): Promise<{
  classes: _Class[];
  relations: Relation[];
  designPatterns: DesignPattern[];
}> {
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
      let classes: _Class[] = await getAllClasses(conn);
      let relations: Relation[] = await getAllRelations(conn);
      let dPatterns: DesignPattern[] = await getAllDesignPatterns(conn);

      return {
        classes: classes,
        relations: relations,
        designPatterns: dPatterns,
      };
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}

await MermaidInterpeter(input).then((res) => console.log(res));
