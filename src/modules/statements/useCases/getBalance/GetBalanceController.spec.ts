import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app"
import createConnection from  "../../../../database"

let connection: Connection;

describe("Get balance", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to show a user balance", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "test",
        email: "balance@balance.com",
        password: "test123"
      });

      const responseToken = await request(app).post("/api/v1/sessions")
      .send({
        email: "balance@balance.com",
        password: "test123",
      });
      const { token } = responseToken.body;

      await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 300,
        description: "Study"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

      const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });
      expect(response.body).toHaveProperty("balance");
      expect(response.body.balance).toEqual(300);
      expect(response.body.statement[0].type).toEqual("deposit");
  });
});
