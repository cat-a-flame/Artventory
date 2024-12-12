function getInventory() {
    fetch('http://localhost:3000/list-inventory')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#inventory-table tbody');
            tableBody.innerHTML = ''; // Clear the table before adding items

            // Loop through the products and create table rows
            data.products.forEach(product => {
                const row = document.createElement('tr');

                // Create each table cell (td) and add data
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.sku}</td>
                    <td>${product.quantity}</td>
                    <td>${product.materials}</td>
                    <td>
                        <button onclick="openEditProductModal(${product.id}, '${product.name}', '${product.sku}', ${product.quantity}, '${product.materials}')">Edit</button>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching inventory:', error);
            alert('There was an error fetching the inventory.');
        });
}

// Open the Add Product modal
document.getElementById('openModalButton').onclick = () => {
    document.getElementById('addProductDialog').showModal();
};

// Close the Add Product modal
document.getElementById('closeDialogButton').onclick = () => {
    document.getElementById('addProductDialog').close();
};

// Handle adding a new product
document.getElementById('addProductForm').onsubmit = function (event) {
    event.preventDefault();

    const product = {
        name: document.getElementById('productName').value,
        sku: document.getElementById('sku').value,
        quantity: parseInt(document.getElementById('quantity').value),
        materials: document.getElementById('materials').value,
    };

    fetch('http://localhost:3000/add-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    })
        .then(response => response.json())
        .then(() => {
            document.getElementById('addProductDialog').close();
            getInventory();
        })
        .catch(error => console.error('Error adding product:', error));
};

// Open the Edit Product modal and pre-fill the fields
function openEditProductModal(id, name, sku, quantity, materials) {
    document.getElementById('editProductId').value = id;
    document.getElementById('editProductName').value = name;
    document.getElementById('editSku').value = sku;
    document.getElementById('editQuantity').value = quantity;
    document.getElementById('editMaterials').value = materials;
    document.getElementById('editProductDialog').showModal();
}

// Close the Edit Product modal
document.getElementById('closeEditDialogButton').onclick = () => {
    document.getElementById('editProductDialog').close();
};

// Handle editing a product
document.getElementById('editProductForm').onsubmit = function (event) {
    event.preventDefault();

    const updatedProduct = {
        id: parseInt(document.getElementById('editProductId').value),
        name: document.getElementById('editProductName').value,
        sku: document.getElementById('editSku').value,
        quantity: parseInt(document.getElementById('editQuantity').value),
        materials: document.getElementById('editMaterials').value,
    };

    fetch('http://localhost:3000/edit-product', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
    })
        .then(response => response.json())
        .then(() => {
            document.getElementById('editProductDialog').close();
            getInventory();
        })
        .catch(error => console.error('Error updating product:', error));
};

// Load inventory on page load
window.onload = getInventory;