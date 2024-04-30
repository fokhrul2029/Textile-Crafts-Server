const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

// MiddleWare
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zebesho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    app.get("/", (req, res) => {
      res.send("Hello World");
    });

    const database = client.db("TextileCrafts-Assignment-10");

    const all_items = database.collection("all_items");

    app.get("/all-data", async (req, res) => {
      const cursor = all_items.find();
      const result = (await cursor.toArray()).reverse();
      res.send(result);
    });

    app.get("/all-data/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = all_items.find({ _id: new ObjectId(id) });
      const result = await cursor.toArray();
      res.send(result);
    });

    const categories_data = database.collection("Categories_items");

    app.get("/categories-data", async (req, res) => {
      const cursor = categories_data.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/categories-data/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = categories_data.find({ _id: new ObjectId(id) });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/", async (req, res) => {
      const item = req.body;
      const docs = [
        {
          userObj: {
            userName: item.userName,
            userEmail: item.userEmail,
          },
          image: item.image,
          item_name: item.item_name,
          subcategory_Name: item.subcategory_Name,
          description: item.description,
          price: item.price,
          rating: item.rating,
          customization: item.customization,
          processing_time: item.processing_time,
          stockStatus: item.stockStatus,
        },
      ];
      const result = await all_items.insertMany(docs);
      res.send(result);
    });

    app.delete("/categories-data/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await all_items.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => console.log(`Application Runnig on ${port}`));
