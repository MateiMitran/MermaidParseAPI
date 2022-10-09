// @ts-ignore
import { Relation } from "./Chart.ts";

export default class SequenceDiagram {
    actors: {};
    messages: Relation[];

    constructor(actors: {}, messages: Relation[]) {
        this.actors = actors;
        this.messages = messages;
        console.log(`Parsed sequence diagram with ${messages.length} messages.`)
    }
   
    getActors(): {} {
        return this.actors;
    }

    getMessages(): Relation[] {
        return this.messages;
    }
   
}