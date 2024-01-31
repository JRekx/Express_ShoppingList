const items = require("./fakeDb");

class Item {
    constructor(name, price) {
        this.name = name;
        this.price = price; // Fixed typo

        items.push(this);
    }

    static findAll() {
        return items;
    }

    static find(name) {
        const foundItem = items.find(v => v.name === name);
        if (foundItem === undefined) {
            throw new Error("Not Found", { status: 404 }); // Use Error object with additional properties
        }
        return foundItem;
    }

    static update(name, data) {
        let foundItem = Item.find(name); // Corrected method call to find
        if (!foundItem) {
            throw new Error("Not Found", { status: 404 });
        }
        foundItem.name = data.name ?? foundItem.name; // Update only if provided
        foundItem.price = data.price ?? foundItem.price; // Update only if provided

        return foundItem;
    }

    static remove(name) {
        let foundIdx = items.findIndex(v => v.name === name);
        if (foundIdx === -1) {
            throw new Error("Not Found", { status: 404 }); // Consistent error handling
        }
        items.splice(foundIdx, 1);
    }
}

module.exports = Item;
