import express, {Request, Response} from "express";
const app = express();
const port = 8080; // default port to listen
import * as mermaid from "mermaid";
// @ts-ignore
import FlowChart from "./Charts/Flowchart.ts"; import ClassDiagram from "./Charts/ClassDiagram.ts"; import ERDiagram from "./Charts/ERDiagram.ts"; import SequenceDiagram from "./Charts/SequenceDiagram.ts"; import StateDiagram from "./Charts/StateDiagram.ts";
const inputER = `erDiagram
CAR ||--o{ NAMED-DRIVER : allows
CAR {
    string registrationNumber
    string make
    string model
}
PERSON ||--o{ NAMED-DRIVER : is
PERSON {
    string firstName
    string lastName
    int age
}`;
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );

app.post('/parse', (req: Request, res: Response)=> {


    const input = req.body.input;
    // @ts-ignore
    const temp = mermaid.default.mermaidAPI.parse(input).parser.yy;
    switch (temp.graphType) {
      case "flowchart-v2":
        res.status(200).json(FlowChart(temp.getVertices(), temp.getEdges()));
        break;
      case "sequence":
        res.status(200).json(SequenceDiagram(temp.getActors(), temp.getMessages()));
        break;
      case "classDiagram":
        //to do
        res.status(200).json(ClassDiagram(temp.getClasses(), temp.getRelations()));
        break;
      case "stateDiagram":
        //methods dont work
        res.status(200).json(StateDiagram(temp.getClasses(), temp.getRelations()));
        break;
      case "er":
        res.status(200).json(ERDiagram(temp.getEntities(), temp.getRelationships()));
        break;
      default:
        res.status(418).send({
          message: "Invalid diagram type!"
        })
        break;
    }
});