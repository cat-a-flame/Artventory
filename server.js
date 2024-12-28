const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const productsFilePath = path.join(__dirname, 'products.json');
const categoriesFilePath = path.join(__dirname, 'categories.json');

let currentId = 1

const readProductsFromFile = () => {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return []; // Return empty array if the file does not exist or an error occurs
    }
};

const readCategoriesFromFile = () => {
    try {
        const data = fs.readFileSync(categoriesFilePath, 'utf-8');
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

app.get('/list-categories', (req, res) => {
    try {
        const categories = readCategoriesFromFile();
        res.json({ categories });
    } catch (error) {
        console.error('Error reading categories:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

app.get('/filter', (req, res) => {
    const { category } = req.query;
    if (!category) {
        return res.status(400).json({ message: 'Category is required' });
    }

    try {
        const products = readProductsFromFile();
        const filteredProducts = products.filter(product => product.category === category);
        res.json({ products: filteredProducts });
    } catch (error) {
        console.error('Error filtering products:', error);
        res.status(500).json({ message: 'Error filtering products' });
    }
});

app.post('/add-product', (req, res) => {
    const { name, sku, quantity, materials, category } = req.body;
    const newProduct = { id: currentId++, name, sku, quantity, materials, category };

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

    const asd = isNaN(parseInt(quantity));
    if ((!name || !materials || !category) || (!sku || asd)) {
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

app.get('/search', (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    try {
        const products = readProductsFromFile();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.sku.toLowerCase().includes(query.toLowerCase())
        );
        res.json({ products: filteredProducts });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Error searching products' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});