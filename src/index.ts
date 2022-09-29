import express, {Request, Response} from "express";
const app = express();
const port = 8080; // default port to listen
import * as mermaid from "mermaid";

class Chart {
    
  nodes: {};
  relations: {}[];

  constructor(nodes: {}, relations: {}[]) {
      this.nodes = nodes;
      this.relations = relations;
  }

  getNodes(): {} {
      return this.nodes;
  }

  getRelations(): {}[] {
      return this.relations;
  }

}
// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );

app.post('/parse', (req: Request, res: Response)=> {

  const inputFlow = `
  flowchart TB
    c1-->a2
    a1-->a2
    b1-->b2
    c1-->c2
`;

const inputSequence =`
sequenceDiagram
par Alice to Bob
    Alice->>Bob: Go help John
and Alice to John
    Alice->>John: I want this done today
    par John to Charlie
        John->>Charlie: Can we do this today?
    and John to Diana
        John->>Diana: Can you help us today?
    end
end`

const inputClass = `classDiagram
classA --|> classB : implements
classC --* classD : composition
classE --o classF : aggregation
classG ..> classH 
`;

const inputState = `stateDiagram-v2
[*] --> First
First --> Second
First --> Third

state First {
    [*] --> fir
    fir --> [*]
}
state Second {
    [*] --> sec
    sec --> [*]
}
state Third {
    [*] --> thi
    thi --> [*]
}`;

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

    // @ts-ignore
    const temp = mermaid.default.mermaidAPI.parse(inputER).parser.yy;
    let stringArray: string[] = [];
    if (temp.graphType === "flowchart-v2") {
      const chart = new Chart(temp.getVertices(), temp.getEdges());
      chart.getRelations().forEach(object => {
        // @ts-ignore
        stringArray.push(`Start: ${object.start} ${object.type} End: ${object.end}`)
      })
      res.status(200).json(stringArray);
    } else if (temp.graphType === "sequence") {
      const chart = new Chart(temp.getActors(), temp.getMessages());
      chart.getRelations().forEach(object => {
        // @ts-ignore
        if (object.from && object.to) {
          // @ts-ignore
          stringArray.push(`From:${object.from} to ${object.to} with message :${object.message}`);
        }
      });
      res.status(200).json(stringArray);
    
    } else if (temp.graphType === "classDiagram") {
      const chart = new Chart(temp.getClasses(), temp.getRelations());
      //to do
      res.status(200).json(chart.getRelations());
    } else if (temp.graphType === "stateDiagram") {
      const chart = new Chart(temp.getClasses(), temp.getRelations());
      //methods dont work
      res.status(200).json(temp.getStates())
    } else if (temp.graphType === "er") {
      const chart = new Chart(temp.getEntities(), temp.getRelationships());
      chart.getRelations().forEach(object => {
        // @ts-ignore
        stringArray.push(`${object.relSpec.cardB} ${object.entityA} ${object.roleA} ${object.relSpec.cardA} ${object.entityB}`);
      })
      res.status(200).json(stringArray);
    } else {
      res.status(418).send({
        message: "Invalid diagram type!"
      })
    }
});