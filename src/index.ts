import express, { Request, Response } from "express";
import * as mermaid from "mermaid";
const app = express();
const port = 8080;
// @ts-ignore
import knex from "../node_modules/knex/knex.js";import ClassDiagram from "./Charts/ClassDiagram.ts";import ERDiagram from "./Charts/ERDiagram.ts";import FlowChart from "./Charts/Flowchart.ts";import SequenceDiagram from "./Charts/SequenceDiagram.ts";
//@ts-ignore
import { createClassesTable, createRelationsTable } from "./database.ts";
//@ts-ignore
import {checkSingleton} from "./patternChecker.ts";

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
    // @ts-ignore parse input
    const temp = mermaid.default.mermaidAPI.parse(input).parser.yy;
    const graphType = temp.graphType;
    switch (graphType) {
      case "flowchart-v2":
        sendResponse(res,new FlowChart(temp.getVertices(), temp.getEdges()), graphType);
        break;
      case "sequence":
        sendResponse(res, new SequenceDiagram(temp.getActors(), temp.getMessages()), graphType);
        break;
      case "classDiagram":
        let classDiagram: ClassDiagram = new ClassDiagram(
          temp.getClasses(),
          temp.getRelations()
        );
        if (classDiagram.getRelations().length > 0) {
        await createClassesTable(conn);
        await createRelationsTable(conn);
        await conn("relations")
          .insert(classDiagram.getRelations())
          .then(() => console.log("data inserted"))
          .catch((e) => {
            console.log(e);
            throw e;
          });
        }
        console.log(checkSingleton(classDiagram,'Singleton'));
        sendResponse(res,classDiagram,graphType);
        break;
      case "er":
        sendResponse(res, new ERDiagram(temp.getEntities(), temp.getRelationships()), graphType);
        break;
      default:
        res.status(418).send({
          message: "Invalid diagram type!",
        });
        break;
    }
  } catch (e) {
    console.log(e);
  }
});
