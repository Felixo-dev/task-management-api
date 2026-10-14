
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

//register a user
it("should register a valid user", async () => {
  const email = `felix-${Date.now()}@example.com`;

  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Felix",
      email,
      password: "secret123",
    });

  expect(response.status).toBe(201);
  expect(response.body.user).toBeDefined();
  expect(response.body.user.email).toBe(email);
  expect(response.body.user.password).toBeUndefined();
});

//test duplicate email registration

it("should reject an email that is already registered", async () => {
  const email = `duplicate-${Date.now()}@example.com`;

  const firstResponse = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Felix",
      email,
      password: "secret123",
    });

  expect(firstResponse.status).toBe(201);

  const secondResponse = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Another User",
      email,
      password: "secret456",
    });

  expect(secondResponse.status).toBe(409);
  expect(secondResponse.body.message).toBe("Email already registered");
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
  
it("should log in a registered user with the correct password", async () => {
  const email = `login-${Date.now()}@example.com`;
  const password = "secret123";

  // Register the user first
  const registration = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Felix",
      email,
      password,
    });

  expect(registration.status).toBe(201);

  // Attempt to log in
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email,
      password,
    });

  expect(response.status).toBe(200);
  expect(response.body.token).toBeDefined();
  expect(response.body.user.email).toBe(email);
  expect(response.body.user.password).toBeUndefined();
});

//test incorrect password

it("should reject an incorrect password", async () => {
  const email = `wrong-password-${Date.now()}@example.com`;

  const registration = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Felix",
      email,
      password: "secret123",
    });

  expect(registration.status).toBe(201);

  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email,
      password: "wrong-password",
    });

  expect(response.status).toBe(401);
  expect(response.body.message).toBe("Invalid email or password");
});


});