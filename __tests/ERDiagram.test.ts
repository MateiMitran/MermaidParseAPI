// @ts-ignore
import ERDiagram from "../src/Charts/ERDiagram.ts";

describe("ERDiagram tests", () => {

    const er = new ERDiagram([{attributes: []}],[{entityA:"CUSTOMER", roleA: "places", entityB: "ORDER"}]);
    
    test("Test entities", () => {
        expect(er.getEntities()).toStrictEqual([{attributes: []}]);
    });
    test("Test relationships", ()=> {
        expect(er.getRelationships()).toStrictEqual([{entityA:"CUSTOMER", roleA: "places", entityB: "ORDER"}]);
    });

});