export default class SequenceDiagram {
    actors: {};
    messages: any[];

    constructor(actors: {}, messages: any[]) {
        this.actors = actors;
        this.messages = messages;
        console.log(`Parsed sequence diagram with ${messages.length} messages.`)
    }
   
    getActors(): {} {
        return this.actors;
    }

    getMessages(): any[] {
        return this.messages;
    }
   
}