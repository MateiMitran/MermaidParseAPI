// @ts-ignore
import Chart, { Relation } from "./Chart.ts";

function FlowChart(vertices: {}, edges: Relation[]) {
    return new Chart(vertices, edges);
}

export default FlowChart;