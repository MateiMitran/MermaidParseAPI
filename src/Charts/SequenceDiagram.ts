// @ts-ignore
import Chart, { Relation } from "./Chart.ts";

function SequenceDiagram(actors: {}, messages: Relation[]) {
    return new Chart(actors, messages);
}

export default SequenceDiagram;