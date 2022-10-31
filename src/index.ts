import express, { Request, Response } from "express";
import * as mermaid from "mermaid";
const app = express();
const port = 8080;

import knex from "knex";
import ClassDiagram from "./Charts/classDiagram/ClassDiagram";

import {
  checkSingletonByName,
  getAllRelations,
  initDatabase,
} from "./Charts/classDiagram/database";

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

function sendResponse(res: Response, chart: any, chartType: string): void {
  res.status(200).json({
    chart: chart,
    chartType: chartType,
  });
  res.end();
  console.log("[Ending parse]");
}

app.post("/parse", async (req: Request, res: Response) => {
  try {
    console.log("[Starting Parse]");
    const input = req.body.input;

    if (!input) {
      res.status(400).send({
        message: "No input found!",
      });
    }

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
    const graphType = temp.graphType;

    let classDiagram: ClassDiagram = new ClassDiagram(
      temp.getClasses(),
      temp.getRelations()
    );
    if (classDiagram.getRelations().length > 0) {
      await initDatabase(conn, classDiagram);

      console.log("[RELATIONS]");

      await getAllRelations(conn).then((res) => {
        let i: number = 1;
        res.forEach((r) => {
          console.log(
            `[${i}] ${r.first_class} has a relation of ${r.relation} with ${r.second_class}`
          );
          i++;
        });
      });

      classDiagram.getClasses().forEach(async (_class) => {
        await checkSingletonByName(_class.id, conn).then((res) =>
          console.log(`Class with name ${_class.id} is singleton : ${res}`)
        );
      });
    }

    sendResponse(res, classDiagram, graphType);
  } catch (e) {
    console.log(e);
    throw e;
  }
});
