import request from "supertest";
import { Connection, SimpleConsoleLogger } from "typeorm";

import { app } from "../../../../app"
import createConnection from  "../../../../database"

let connection: Connection;

describe("Get statement operation", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to show a statement operation", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "test",
        email: "statement@operation.com",
        password: "test123"
      });

      const responseToken = await request(app).post("/api/v1/sessions")
      .send({
        email: "statement@operation.com",
        password: "test123",
      });
      const { token } = responseToken.body;

      const statement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 300,
        description: "Study"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
      const response = await request(app)
      .get(`/api/v1/statements/${statement.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });
      expect(response.body).toHaveProperty("id");
      expect(response.body.id).toEqual(statement.body.id);
  });
});
