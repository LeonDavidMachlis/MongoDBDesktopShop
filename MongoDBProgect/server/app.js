const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const dbName = "shop";
const url = `mongodb://localhost:27017/${dbName}`;
const app = express();
app.use(express.json());
const client = new MongoClient(url);
let db;
async function connectToMongoDB() {
  try {
    console.log("Trying to connect to MongoDB");
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db(dbName);
  } catch (err) {
    console.error("Failed", err);
    throw err;
  }
}
const port = 3000;
app.listen(port, async () => {
  await connectToMongoDB();
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/api/products", async (req, res) => {
  try {
    const collection = db.collection(dbName);
    const nameFilter = req.query.name
      ? { name: { $regex: req.query.name, $options: "i" } }
      : {};
    const products = await collection.find(nameFilter).toArray();
    res.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const product = req.body;
    const collection = db.collection(dbName);
    const result = await collection.insertOne(product);
    res.status(201).json({
      message: "Product added successfully",
      productId: result.insertedId,
    });
  } catch (error) {
    console.error("Failed to add product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const collection = db.collection(dbName);
    const result = await collection.deleteOne({ _id: new ObjectId(productId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Failed to delete product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});
