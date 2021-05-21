import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app"
import createConnection from  "../../../../database"

let connection: Connection;

describe("Create User controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("Should be able to create a new user", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "test",
        email: "test@email.com",
        password: "test123"
      });
    expect(response.status).toBe(201);
  });

  it("Shouldn't be able to create a new user when email is already taken", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "test",
        email: "test2@email.com",
        password: "test123"
      });
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "test",
        email: "test2@email.com",
        password: "test123"
      });
    expect(response.status).toBe(400);
  });
});
