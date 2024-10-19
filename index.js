const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mango:mango12345@cluster0.fwhk0w8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect to MongoDB once when the server starts
    await client.connect();
    console.log("Connected to MongoDB");

    const DB = client.db("mangoDB");
    const fruitCollection = DB.collection('mango');

    // POST route to insert fruit
    app.post('/fruit', async (req, res) => {
      try {
        const fruit = req.body;
        const result = await fruitCollection.insertOne(fruit);
        res.send(result);
      } catch (err) {
        console.error("Error inserting fruit:", err);
        res.status(500).send({ error: 'Failed to insert fruit' });
      }
    });

    // GET route for ping
    app.get('/', (req, res) => {
      res.send('Mongo Server is running!!!');
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
