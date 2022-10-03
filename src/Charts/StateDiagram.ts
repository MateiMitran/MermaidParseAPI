// @ts-ignore
import Chart, { Relation } from "./Chart.ts";

function StateDiagram(classes: {}, relations: Relation[]) {
    return new Chart(classes, relations);
}

export default StateDiagram;