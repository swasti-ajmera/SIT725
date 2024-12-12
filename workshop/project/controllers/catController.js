// The controller will handle requests, interact with the model, and respond with data

const Cat = require('../models/catModel');

async function getCats(req, res) {
  try {
    const cats = await Cat.getAllCats();
    res.json(cats);
  } catch (error) {
    res.status(500).send("Error fetching cats: " + error.message);
  }
}

async function addCat(req, res) {
  try {
    const newCat = req.body;
    const result = await Cat.addCat(newCat);
    res.status(201).json({ message: "Cat added successfully", data: result });
  } catch (error) {
    res.status(500).send("Error adding cat: " + error.message);
  }
}

module.exports = { getCats, addCat };
