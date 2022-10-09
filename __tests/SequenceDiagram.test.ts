// @ts-ignore
import SequenceDiagram from "../src/Charts/SequenceDiagram.ts";

describe("Sequence Diagram tests", () => {

    const sequence: SequenceDiagram = new SequenceDiagram({Alice: {name:"Alice", Bob: {name:"Bob"}}},[{from: "Alice", to: "Bob", message: "Hello Bob!"}, {from:"Bob", to:"Alice", message: "Hello Alice!"}]);

    test("Test actors", () => {
        expect(sequence.getActors()).toStrictEqual({Alice: {name:"Alice", Bob: {name:"Bob"}}});
    });

    test("Test messages", () => {
        expect(sequence.getMessages()).toStrictEqual([{from: "Alice", to: "Bob", message: "Hello Bob!"}, {from:"Bob", to:"Alice", message: "Hello Alice!"}]);
    })
});