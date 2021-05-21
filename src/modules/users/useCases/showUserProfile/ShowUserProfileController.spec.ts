import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app"
import createConnection from  "../../../../database"

let connection: Connection;

describe("Show User Profile controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("Should be able to show a user profile", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "test",
        email: "profile@email.com",
        password: "test123"
      });
      const responseToken = await request(app).post("/api/v1/sessions")
      .send({
        email: "profile@email.com",
        password: "test123",
      });
      const { token } = responseToken.body;

      const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toEqual("test");
      expect(response.body.email).toEqual("profile@email.com");
  });

  it("Shouldn't be able to show a user profile with a non existent token authentication", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "test",
        email: "profile@auth.com",
        password: "test123"
      });
      const responseToken = await request(app).post("/api/v1/sessions")
      .send({
        email: "profile@auth.com",
        password: "test123",
      });
      const { token } = responseToken.body;

      const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}12s`,
      });
      expect(response.status).toBe(401);
  });

  it("Shouldn't be able to show a user profile without an authentication token", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "test",
        email: "profile@auth.com",
        password: "test123"
      });
      const responseToken = await request(app).post("/api/v1/sessions")
      .send({
        email: "profile@auth.com",
        password: "test123",
      });
      const { token } = responseToken.body;

      const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}12s`,
      });
      expect(response.status).toBe(401);
  });
});
