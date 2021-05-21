import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app"
import createConnection from  "../../../../database"
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";

let connection: Connection;

describe("Authenticate User controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    const id = uuid();
    const password = await hash("1234", 8);
    await connection.query(
      `INSERT INTO users (
      id,
      name,
      email,
      password,
      created_at,
      updated_at)
      VALUES (
        '${id}',
        'Renata test Auth',
        'renata@auth.com',
        '${password}',
        'now()',
        'now()'
        )`
    );
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("Should be able to authenticate a user", async () => {
      const auth = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "renata@auth.com",
        password: "1234"
      });
    expect(auth.body).toHaveProperty("token");
  });

  it("Shouldn't be able to authenticate with wrong email", async () => {
    await request(app)
      const auth = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "fail1@email.com",
        password: "1234"
      })
    expect(auth.status).toBe(401);
  });

  it("Shouldn't be able to authenticate with wrong password", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "test",
        email: "fail2@email.com",
        password: "test123"
      });
      const auth = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "fail2@email.com",
        password: "fail123"
      });
    expect(auth.status).toBe(401);
  });
});
