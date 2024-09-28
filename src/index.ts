import path from "path";
import envs from "dotenv";
envs.config({ path: path.join(__dirname, "../.env") });
import express, { Request, Response } from "express";

console.log(process.env.DB_HOST);

import { startConnection, pool } from "./PgConfig";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/v1/health", async (req: Request, res: Response) => {
  const response = {
    server: true,
    database: false,
  };

  try {
    await pool.query("SELECT 1");
    response.database = true;
  } catch (error) {
    console.log("Database error");
  }

  res.json({ status: "ok", ...response });
});

app.post("/api/v1/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email]);
    res.json({ status: "User created successfully" });
  } catch (error) {
    console.log("Database error");
    res.json({ status: "Error creating user" });
  }
});

app.get("/api/v1/users", async (req: Request, res: Response) => {
  let result;
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    result = rows;
    res.json({ status: "ok", result });
  } catch (error) {
    console.log("Database error");
    res.json({ status: "Error creating user" });
  }
});

app.listen(3000, async () => {
  console.log("Server is running on port 3000");
  await startConnection();
  await pool.query("create table if not exists users (id serial primary key, name varchar(255), email varchar(255))");
  console.log("Connection to database established");
});
