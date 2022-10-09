// @ts-ignore
import FlowChart from "../src/Charts/Flowchart.ts";
// @ts-ignore
import Chart from "../src/Charts/Chart.ts";

describe("Flowchart tests", () => {

    const chart: Chart = new Chart(["A1","A2"],{start: "a1", end: "a2", line: "dotted"} );
    const flowchart: FlowChart = new FlowChart(["A1","A2"],{start: "a1", end: "a2", line: "dotted"});

    test("Test nodes", () => {
        expect(chart.getNodes()).toStrictEqual(flowchart.getVertices());
    });
    test("Test relations", ()=> {
        expect(chart.getRelations()).toStrictEqual(flowchart.getEdges());
    });

});