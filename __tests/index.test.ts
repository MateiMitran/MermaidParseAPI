//@ts-ignore
import app from "../src/test.ts";
import request from "supertest";
//@ts-ignore
import Chart from "../src/Charts/Chart.ts";

describe("Server.ts tests", () => {
    test("Math test", () => {
      expect(2 + 2).toBe(4);
    });

   // test("API test", async () => {
     //   const res = await request(app).get("/");
    ////    expect(res.body).toEqual({ message: "X" });
    //  });

    test("Chart class methods", () => {
        const chart = new Chart(["A1","A2"],{start: "a1", end: "a2", line: "dotted"} );
       // expect(chart.getNodes()).toBe(["A1","A2"]);
       expect(chart.getNodes()).toStrictEqual(["A1","A2"]);
    });
  });
