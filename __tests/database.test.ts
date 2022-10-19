//@ts-ignore
import conn,{ createClassesTable, createRelationsTable, getAllRelations, getAllInheritanceRelations } from "../src/database.ts";

const classes = [
    {id: 1, name: "Animal"},
    {id: 2, name: "Duck"},
    {id: 3, name: "Dog"},
    {id: 4, name: "Cat"}
];
  
const relations = [
    {id:1, first_class: "Duck", relation: "aggregation", second_class: "Animal"},
    {id:2, first_class: "Dog", relation: "extension", second_class: "Animal"},
    {id:3, first_class: "Cat", relation: "dependency", second_class: "Animal"},
];

describe('Database tests', () => {

  beforeAll(async ()=> {
    await createClassesTable(conn);
    await createRelationsTable(conn);
    await conn('classes').insert(classes).then(() => console.log("data inserted")).catch((e) => { console.log(e); throw e });
    await conn('relations').insert(relations).then(() => console.log("data inserted")).catch((e) => { console.log(e); throw e });
  });

  afterAll(async()=> {
    conn.destroy();
  })

  test("Get all relations", async () => {
    let i: number = 0;
    const allRelations = await getAllRelations().then((res)=> {
    res.forEach(relation => {
      expect(relation).toStrictEqual(relations[i]);
      i++;
      });
    });
  });

  test("Get all inheritance relations", async() => {
    const inheritanceRelations = await getAllInheritanceRelations().then((res) => {
      res.forEach(relation => {
        expect(relation).toStrictEqual(relations[1]);
        });
      });
  });
}); 