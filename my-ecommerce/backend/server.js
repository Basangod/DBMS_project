import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const app = express();
app.use(express.json());
app.use(cors());

// LowDB setup
const adapter = new JSONFile("db.json");
const db = new Low(adapter, { products: [] });

await db.read();

// GET products
app.get("/api/products", async (req, res) => {
  res.json(db.data.products);
});

// POST product
app.post("/api/products", async (req, res) => {
  db.data.products.push(req.body);
  await db.write();
  res.json({ message: "Product added successfully!" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
