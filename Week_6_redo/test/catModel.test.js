// test/catmodel.test.js
let chai, io, expect, http;
const { connectDB, getAllCats, addCat } = require("../models/catModel");
let client;

before(async function () {
  this.timeout(8000);
  // Dynamically import modules
  chai = (await import("chai")).default || (await import("chai"));
  io = (await import("socket.io-client")).io;
  http = (await import("http")).default || require("http");

  // Configure Chai
  expect = chai.expect;

  // Ensure DB connection is established once before tests
  client = await connectDB();
});

beforeEach(function () {
  // Setup a sample cat object before each test
  this.cat = {
    name: "Sagar",
    age: 23,
    branch: "Siesmic studies",
  };
});

describe("Student category Model Tests", function () {
  it("should connect to the MongoDB database", async function () {
    try {
      expect(client).to.not.be.null; // Ensure the client is connected
      console.log("MongoDB client connection established successfully.");
    } catch (err) {
      expect.fail("Failed to connect to MongoDB");
    }
  });

  it('should add a student category to the database', async () => {
    const newCat = { name: "Fatima", age: 22, branch: "Performing arts" };
  
    const result = await addCat(newCat);
  
    // Expecting the insertedId, not 1
    expect(result).to.not.be.undefined;
    expect(result).to.be.a('string'); // The insertedId should be a string
  });
  

  it("should retrieve all categories from the database", async function () {
    try {
      await addCat(this.cat); // Add a cat before querying
      const cats = await getAllCats();
      expect(cats.length).to.be.greaterThan(0);
      expect(cats[0].name).to.equal("Ajay");
      console.log("Fetched categories successfully");
    } catch (err) {
      expect.fail("Error fetching cats from database: " + err.message);
    }
  });
});
