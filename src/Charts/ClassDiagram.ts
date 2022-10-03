// @ts-ignore
import Chart, { Relation } from "./Chart.ts";

function ClassDiagram(classes: {}, relations: Relation[]) {
    return new Chart(classes, relations);
}

export default ClassDiagram;