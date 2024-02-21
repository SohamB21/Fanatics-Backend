const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

// middleware (to connect with the frontend)
app.use(cors());
app.use(express.json());

// aWPJ6X1owDmxAo1v

app.get("/", (req, res) => {
  res.send("Hello Fanatics!");
});

// mongodb config
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://fanatics-mern:aWPJ6X1owDmxAo1v@cluster0.boee5mt.mongodb.net/?retryWrites=true&w=majority";

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
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // create a collection of documents
    const jerseyCollections = client
      .db("JerseyInventory")
      .collection("jerseys");

    // insert a jersey to the collection using POST method
    app.post("/upload-jersey", async (req, res) => {
      const data = req.body;
      const result = await jerseyCollections.insertOne(data);
      res.send(result);
    });

    // // get all jerseys from the database using GET method
    // app.get("/all-jerseys", async (req, res) => {
    //   const jerseys = jerseyCollections.find();
    //   const result = await jerseys.toArray();
    //   res.send(result);
    // });

    // update jersey data in the database using PATCH method
    app.patch("/jersey/:id", async (req, res) => {
      const id = req.params.id;
      const updateJerseyData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateBody = {
        $set: {
          ...updateJerseyData,
        },
      };

      const result = await jerseyCollections.updateOne(
        filter,
        updateBody,
        options,
      );
      res.send(result);
    });

    // delete jersey data in the database using DELETE method
    app.delete("/jersey/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await jerseyCollections.deleteOne(filter);
      res.send(result);
    });

    // search a jersey according to category using Queries
    app.get("/all-jerseys", async (req, res) => {
      let query = {};
      if (req.query?.category) {
        query = { category: req.query.category };
      }
      const result = await jerseyCollections.find(query).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});