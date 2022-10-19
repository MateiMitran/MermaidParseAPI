import express, {Request, Response} from "express";
const app = express();
const port = 8080; // default port to listen
import * as mermaid from "mermaid";
// @ts-ignore
import FlowChart from "./Charts/Flowchart.ts"; import ClassDiagram from "./Charts/ClassDiagram.ts"; import ERDiagram from "./Charts/ERDiagram.ts"; import SequenceDiagram from "./Charts/SequenceDiagram.ts"; import StateDiagram from "./Charts/StateDiagram.ts";
//@ts-ignore
import conn,{ createClassesTable, createRelationsTable, getAllRelations, getAllInheritanceRelations } from "./database.ts";

app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );

app.post('/parse', async (req: Request, res: Response)=> {

  try {
    console.log("Starting Parse...")
    const input = req.body.input;
    if (!input) {
      res.status(400).send({
        message: "No input found!"
      });
    }
    // @ts-ignore
    const temp = mermaid.default.mermaidAPI.parse(input).parser.yy;
    const graphType = temp.graphType;
    switch (graphType) {
      case "flowchart-v2":
        res.status(200).json({chart: new FlowChart(temp.getVertices(), temp.getEdges()), chartType: graphType});
        break;
      case "sequence":
        res.status(200).json({chart: new SequenceDiagram(temp.getActors(), temp.getMessages()), chartType: graphType});
        break;
      case "classDiagram":
        //to do
        let classDiagram: ClassDiagram = new ClassDiagram(temp.getClasses(), temp.getRelations());
        await createClassesTable(conn);
        await createRelationsTable(conn);
        await conn('relations').insert(classDiagram.getDesignPatternArray()).then(() => console.log("data inserted")).catch((e) => { console.log(e); throw e });
        
        res.status(200).json({chart: classDiagram, chartType: graphType, structure: classDiagram.getDesignPattern()});
        break;
      case "er":
        res.status(200).json({chart: new ERDiagram(temp.getEntities(), temp.getRelationships()), chartType: graphType});
        break;
      default:
        res.status(418).send({
          message: "Invalid diagram type!"
        })
        break;
    } } catch (e) {
      console.log(e);
    }
    
});


app.get('/class', async (req: Request, res: Response)=> {
  
 
});
