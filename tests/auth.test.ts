
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("POST /api/auth/register", () => {
  it("should reject a password shorter than 6 characters", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Felix",
        email: "felix.test@example.com",
        password: "123",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid registration data");
    expect(response.body.errors).toBeDefined();
  });

  
it("should reject an invalid email address", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Felix",
      email: "not-an-email",
      password: "secret123",
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid registration data");
});

it("should reject a name shorter than 2 characters", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name: "F",
      email: "felix.test@example.com",
      password: "secret123",
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid registration data");
});
});

//Login Test

describe("POST /api/auth/login", () => {
  it("should reject an invalid email address", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "not-an-email",
        password: "secret123",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid login data");
  });
});