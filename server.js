const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const productsFilePath = path.join(__dirname, 'products.json');

const readProductsFromFile = () => {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return []; // Return empty array if the file does not exist or an error occurs
    }
};

const writeProductsToFile = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

app.get('/list-inventory', (req, res) => {
    try {
        const products = readProductsFromFile();
        res.json({ products });
    } catch (error) {
        console.error('Error reading products:', error);
        res.status(500).json({ message: 'Error fetching inventory' });
    }
});

app.post('/add-product', (req, res) => {
    const { name, sku, quantity, materials, category } = req.body;
    const newProduct = { id: Date.now(), name, sku, quantity, materials, category };

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

app.put('/edit-product', (req, res) => {
    const { id, name, sku, quantity, materials, category } = req.body;

    if (!id || !name || !sku || !quantity || !materials || !category) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const products = readProductsFromFile();
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        products[productIndex] = { id, name, sku, quantity, materials, category };
        writeProductsToFile(products);
        res.json({ message: 'Product updated successfully', product: products[productIndex] });
    } catch (error) {
        console.error('Error editing product:', error);
        res.status(500).json({ message: 'There was an error editing the product.' });
    }
});

app.delete('/delete-product/:id', (req, res) => {
    const { id } = req.params;

    try {
        let products = readProductsFromFile();
        products = products.filter(product => product.id != id);

        writeProductsToFile(products);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'There was an error deleting the product.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});