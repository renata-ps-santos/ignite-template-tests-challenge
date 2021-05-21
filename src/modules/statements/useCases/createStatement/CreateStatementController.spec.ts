import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app"
import createConnection from  "../../../../database"

let connection: Connection;

describe("Create statements", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to make a deposit", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "test",
        email: "deposit@deposit.com",
        password: "test123"
      });

      const responseToken = await request(app).post("/api/v1/sessions")
      .send({
        email: "deposit@deposit.com",
        password: "test123",
      });
      const { token } = responseToken.body;

      const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 300,
        description: "Study"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
      expect(response.body).toHaveProperty("id");
      expect(response.body.type).toEqual("deposit");
      expect(response.body.amount).toEqual(300);
  });

  it("Should be able to make a withdraw", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "test",
        email: "withdraw@withdraw.com",
        password: "test123"
      });

      const responseToken = await request(app).post("/api/v1/sessions")
      .send({
        email: "withdraw@withdraw.com",
        password: "test123",
      });
      const { token } = responseToken.body;

      await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 400,
        description: "Study"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
      const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 300,
        description: "Food"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
      expect(response.body).toHaveProperty("id");
      expect(response.body.type).toEqual("withdraw");
      expect(response.body.amount).toEqual(300);
  });


  it("Shouldn't be able to a non existent user make a withdraw when there's no enough balance", async () => {
    await request(app)
    .post("/api/v1/users")
    .send({
      name: "test",
      email: "fail@withdraw.com",
      password: "test123"
    });

    const responseToken = await request(app).post("/api/v1/sessions")
    .send({
      email: "fail@withdraw.com",
      password: "test123",
    });
    const { token } = responseToken.body;

    await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 400,
      description: "Study"
    })
    .set({
      Authorization: `Bearer ${token}`,
    });
    const response = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 500,
      description: "Food"
    })
    .set({
      Authorization: `Bearer ${token}`,
    });
    expect(response.status).toBe(400)
  });
});
