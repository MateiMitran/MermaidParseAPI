import express, {Request, Response} from "express";
const app = express();
const port = 8080; // default port to listen
import * as mermaid from "mermaid";
// @ts-ignore
import Chart from "./Chart.ts";

app.use(express.json());


// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );

app.post('/parse', (req: Request, res: Response)=> {


    const input = req.body.input;
    // @ts-ignore
    const temp = mermaid.default.mermaidAPI.parse(input).parser.yy;
    let stringArray: string[] = [];
    if (temp.graphType === "flowchart-v2") {
      stringArray.length = 0;
      const chart = new Chart(temp.getVertices(), temp.getEdges());
      chart.getRelations().forEach(object => {
        stringArray.push(`Start: ${object.start} ${object.type} End: ${object.end}`)
      })
      res.status(200).json(stringArray);
    } else if (temp.graphType === "sequence") {
      stringArray.length = 0;
      const chart = new Chart(temp.getActors(), temp.getMessages());
      chart.getRelations().forEach(object => {
        if (object.from && object.to) {
          stringArray.push(`From:${object.from} to ${object.to} with message :${object.message}`);
        }
      });
      res.status(200).json(stringArray);
    
    } else if (temp.graphType === "classDiagram") {
      stringArray.length = 0;
      const chart = new Chart(temp.getClasses(), temp.getRelations());
      //to do
      res.status(200).json(chart.getRelations());
    } else if (temp.graphType === "stateDiagram") { //to do
      stringArray.length = 0;
      const chart = new Chart(temp.getClasses(), temp.getRelations());
      //methods dont work
      res.status(200).json(temp)
    } else if (temp.graphType === "er") {
      stringArray.length = 0;
      const chart = new Chart(temp.getEntities(), temp.getRelationships());
      chart.getRelations().forEach(object => {
        stringArray.push(`${object.relSpec.cardB} ${object.entityA} ${object.roleA} ${object.relSpec.cardA} ${object.entityB}`);
      })
      res.status(200).json(stringArray);
    } else {
      res.status(418).send({
        message: "Invalid diagram type!"
      })
    }
});