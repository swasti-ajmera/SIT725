// Handles DB connection + operations
//_________________________________________________________

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "mongodb+srv://swastiajmera246:U7us2derY0zTeLT6@cluster0.2tfi8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
let collection;

// mongo client setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    collection = client.db('test').collection('Cat');
    console.log("Connected to MongoDB and collection 'Cat'");
  } catch (ex) {
    console.error(ex);
  }
}

async function getAllCats() {
  try {
    return await collection.find({}).toArray();
  } catch (err) {
    throw new Error("Error fetching cats from database: " + err);
  }
}

async function addCat(cat) {
  try {
    const result = await collection.insertOne(cat);
    // Ensure the insert was acknowledged and has an insertedId
    if (result.acknowledged) {
      return result.insertedId.toString(); // Return the inserted document ID
    } else {
      throw new Error("Failed to insert cat into database.");
    }
  } catch (err) {
    throw new Error("Error inserting cat into database: " + err);
  }
}

module.exports = { connectDB, getAllCats, addCat };