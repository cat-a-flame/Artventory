const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files (e.g., HTML, CSS, JS) from the public folder
app.use(express.static('public'));

// Middleware to parse JSON request bodies
app.use(express.json());

// Path to the JSON file where products are stored
const productsFilePath = path.join(__dirname, 'products.json');

// Function to read products from the JSON file
function readProductsFromFile() {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return []; // Return empty array if the file does not exist or an error occurs
    }
}

// Function to write products to the JSON file
function writeProductsToFile(products) {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}

// Route to list all products (GET request)
app.get('/list-inventory', (req, res) => {
    try {
        const products = readProductsFromFile();
        res.json({ products });
    } catch (error) {
        console.error('Error reading products:', error);
        res.status(500).json({ message: 'Error fetching inventory' });
    }
});

// Route to add a new product (POST request)
app.post('/add-product', (req, res) => {
    const { name, sku, quantity, materials } = req.body;

    const newProduct = {
        id: Date.now(), // Use timestamp as a unique ID
        name,
        sku,
        quantity,
        materials,
    };

    try {
        const products = readProductsFromFile();
        products.push(newProduct);
        writeProductsToFile(products);
        res.json({ message: 'Product added successfully' });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'There was an error adding the product.' });
    }
});

// Route to edit an existing product (PUT request)
app.put('/edit-product', (req, res) => {
    const { id, name, sku, quantity, materials } = req.body;

    // Validate that all necessary fields are present
    if (!id || !name || !sku || !quantity || !materials) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const products = readProductsFromFile();
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Update the product details
        products[productIndex] = { id, name, sku, quantity, materials };
        writeProductsToFile(products);

        res.json({ message: 'Product updated successfully', product: products[productIndex] });
    } catch (error) {
        console.error('Error editing product:', error);
        res.status(500).json({ message: 'There was an error editing the product.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
