const Item = require('../item');
const express = require('express');

const router = express.Router();

// Get all items
router.get('', (req, res, next) => {
    try {
        return res.json({ items: Item.findAll() });
    } catch(err) {
        return next(err);
    }
});

// Create a new item
router.post('', (req, res, next) => {
    try {
        let newItem = new Item(req.body.name, req.body.price); // Corrected variable name
        return res.status(201).json({ item: newItem }); // Using HTTP 201 status code and corrected key to singular
    } catch(err) {
        return next(err);
    }
});

// Get a single item by name
router.get('/:name', (req, res, next) => {
    try {
        let foundItem = Item.find(req.params.name);
        if (!foundItem) {
            // If the item is not found, return a 404 status code
            return res.status(404).json({ message: "Item not found" });
        }
        return res.json({ item: foundItem });
    } catch(err) {
        return next(err);
    }
});

// Update an item by name
router.patch('/:name', (req, res, next) => {
    try {
        let foundItem = Item.update(req.params.name, req.body);
        if (!foundItem) {
            // If the item to update is not found, return a 404 status code
            return res.status(404).json({ message: "Item not found" });
        }
        return res.json({ item: foundItem });
    } catch(err) {
        return next(err);
    }
});

// Delete an item by name
router.delete('/:name', (req, res, next) => {
    try {
        let deletionResult = Item.remove(req.params.name);
        if (!deletionResult) {
            // If the item to delete is not found, return a 404 status code
            return res.status(404).json({ message: "Item not found" });
        }
        return res.status(204).send(); // Using HTTP 204 status code for no content
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
