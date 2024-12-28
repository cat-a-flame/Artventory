// Function to show toast messages
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.backgroundColor = type === 'success' ? '#4caf50' : '#f44336'; // Green for success, red for error
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Show the toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        toastContainer.removeChild(toast);
    }, 3100);
}

// Function to fetch and display the inventory
const getInventory = async () => {
    try {
        const response = await fetch('/list-inventory');
        const data = await response.json();
        const tableBody = document.querySelector('#inventory-table tbody');
        tableBody.innerHTML = '';

        data.products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.sku}</td>
                <td>${product.quantity}</td>
                <td>${product.materials}</td>
                <td>${product.category}</td>
                <td>
                    <button onclick="openEditProductModal(${product.id}, '${product.name}', '${product.sku}', ${product.quantity}, '${product.materials}', '${product.category}')">Edit</button>
                    <button onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        showToast('There was an error fetching the inventory.', 'error');
    }
};

// Function to delete a product
const deleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            const response = await fetch(`/delete-product/${id}`, { method: 'DELETE' });
            if (response.ok) {
                getInventory();
                showToast('Product deleted successfully');
            } else {
                showToast('Error deleting product', 'error');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            showToast('There was an error deleting the product.', 'error');
        }
    }
};

// Function to open the edit product modal and pre-fill the fields
const openEditProductModal = (id, name, sku, quantity, materials, category) => {
    document.getElementById('editProductId').value = id;
    document.getElementById('editProductName').value = name;
    document.getElementById('editSku').value = sku;
    document.getElementById('editQuantity').value = quantity;
    document.getElementById('editMaterials').value = materials;
    document.getElementById('editCategory').value = category;
    document.getElementById('editProductDialog').showModal();
};

// Event listeners for modal buttons
document.getElementById('openModalButton').onclick = () => document.getElementById('addProductDialog').showModal();
document.getElementById('closeDialogButton').onclick = () => document.getElementById('addProductDialog').close();
document.getElementById('closeEditDialogButton').onclick = () => document.getElementById('editProductDialog').close();

// Handle adding a new product
document.getElementById('addProductForm').onsubmit = async (event) => {
    event.preventDefault();

    const product = {
        name: document.getElementById('productName').value,
        sku: document.getElementById('sku').value,
        quantity: parseInt(document.getElementById('quantity').value),
        materials: document.getElementById('materials').value,
        category: document.getElementById('category').value,
    };

    try {
        const response = await fetch('/add-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });

        if (response.ok) {
            document.getElementById('addProductDialog').close();
            getInventory();
            showToast('Product added successfully');
        } else {
            showToast('Error adding product', 'error');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        showToast('An error occurred while adding the product.', 'error');
    }
};

// Handle editing a product
document.getElementById('editProductForm').onsubmit = async (event) => {
    event.preventDefault();

    const updatedProduct = {
        id: parseInt(document.getElementById('editProductId').value),
        name: document.getElementById('editProductName').value,
        sku: document.getElementById('editSku').value,
        quantity: parseInt(document.getElementById('editQuantity').value),
        materials: document.getElementById('editMaterials').value,
        category: document.getElementById('editCategory').value,
    };

    try {
        const response = await fetch('/edit-product', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct),
        });

        if (response.ok) {
            document.getElementById('editProductDialog').close();
            getInventory();
            showToast('Product updated successfully');
        } else {
            showToast('Error updating product', 'error');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        showToast('An error occurred while updating the product.', 'error');
    }
};

// Load inventory on page load
window.onload = getInventory;