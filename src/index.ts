import express, { Request, Response } from "express";
import * as mermaid from "mermaid";
const app = express();
const port = 8080;

import knex from "knex";
import ClassDiagram from "./Charts/ClassDiagram.js";
import ERDiagram from "./Charts/ERDiagram.js";
import FlowChart from "./Charts/Flowchart.js";
import SequenceDiagram from "./Charts/SequenceDiagram.js";

import {
  checkSingletonByName,
  createClassesTable,
  createMembersTable,
  createMethodsTable,
  createRelationsTable,
} from "./database.js";

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
    switch (graphType) {
      case "flowchart-v2":
        sendResponse(
          res,
          new FlowChart(temp.getVertices(), temp.getEdges()),
          graphType
        );
        break;
      case "sequence":
        sendResponse(
          res,
          new SequenceDiagram(temp.getActors(), temp.getMessages()),
          graphType
        );
        break;
      case "classDiagram":
        let classDiagram: ClassDiagram = new ClassDiagram(
          temp.getClasses(),
          temp.getRelations()
        );
        if (classDiagram.getRelations().length > 0) {
          await initDatabase(conn);

          //insert methods and members
          classDiagram.getClasses().forEach(async (_class) => {
            _class.members.forEach(async (member) => {
              await conn("members")
                .insert({
                  returnType: getMemberReturnType(member),
                  name: getMemberName(member),
                  accessibility: getAccesibility(member),
                  classifier: getClassifierMember(member),
                  class: _class.id,
                })
                .then()
                .catch((e) => {
                  console.log(e);
                  throw e;
                });
            });

            _class.methods.forEach(async (method) => {
              await conn("methods")
                .insert({
                  returnType: getMethodReturnType(method),
                  name: getMethodName(method),
                  accessibility: getAccesibility(method),
                  classifier: getClassifierMethod(method),
                  class: _class.id,
                })
                .then()
                .catch((e) => {
                  console.log(e);
                  throw e;
                });
            });
          });

          //insert classes
          await conn("classes")
            .insert(classDiagram.getClasses())
            .then(() => console.log("classes inserted"))
            .catch((e) => {
              console.log(e);
              throw e;
            });

          //insert relations
          await conn("relations")
            .insert(classDiagram.getRelations())
            .then(() => console.log("relations inserted"))
            .catch((e) => {
              console.log(e);
              throw e;
            });

          classDiagram.getClasses().forEach(async (_class) => {
            await checkSingletonByName(_class.id, conn).then((res) =>
              console.log(`Class with name ${_class.id} is singleton : ${res}`)
            );
          });
        }

        sendResponse(res, classDiagram, graphType);
        break;
      case "er":
        sendResponse(
          res,
          new ERDiagram(temp.getEntities(), temp.getRelationships()),
          graphType
        );
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

  async function initDatabase(conn: any) {
    await createMethodsTable(conn);
    await createMembersTable(conn);
    await createClassesTable(conn);
    await createRelationsTable(conn);
  }
});

function getAccesibility(member: string): string {
  let char: string = member.charAt(0);

  switch (char) {
    case "+":
      return "public";
    case "-":
      return "private";
    case "#":
      return "protected";
    case "~":
      return "package";
    default:
      return "none";
  }
}

function getClassifierMember(member: string): string {
  let char: string = member.charAt(member.length - 1);
  switch (char) {
    case "$":
      return "static";
    case "*":
      return "abstract";
    default:
      return "none";
  }
}

function getClassifierMethod(method: string): string {
  let char: string = method.substring(method.indexOf(")") + 1).charAt(0);
  switch (char) {
    case "$":
      return "static";
    case "*":
      return "abstract";
    default:
      return "none";
  }
}

function getMemberReturnType(member: string): string {
  if (getAccesibility(member) === "none") {
    return member.substring(0, member.indexOf(" "));
  } else {
    return member.substring(1, member.indexOf(" "));
  }
}

function getMemberName(member: string) {
  if (getClassifierMember(member) !== "none") {
    return member
      .substring(member.indexOf(" ") + 1)
      .trim()
      .slice(0, -1);
  } else {
    return member.substring(member.indexOf(" ") + 1).trim();
  }
}

function getMethodReturnType(method: string): string {
  if (getClassifierMethod(method) !== "none") {
    return method
      .substring(method.indexOf(")") + 1)
      .substring(1)
      .trim();
  } else {
    return method.substring(method.indexOf(")") + 1).trim();
  }
}

function getMethodName(method: string): string {
  if (getAccesibility(method) === "none") {
    return method.substring(0, method.indexOf("("));
  } else {
    return method.substring(1, method.indexOf("("));
  }
}
