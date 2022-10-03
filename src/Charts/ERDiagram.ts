// @ts-ignore
import Chart, { Relation } from "./Chart.ts";

function ERDiagram(entities: {}, relationships: Relation[]) {
    return new Chart(entities, relationships);
}

export default ERDiagram;