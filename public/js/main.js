// Function to show toast messages
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    toastContainer.innerHTML = message;

    // Show the toast
    setTimeout(() => {
        toastContainer.classList.add('show');
    }, 50);

    // Hide the toast after 3 seconds
    setTimeout(() => {
        toastContainer.classList.remove('show');
    }, 2900);
}

document.addEventListener('DOMContentLoaded', function () {
    // Existing code to fetch and display inventory
    getInventory();
    getCategories();
});

// Function to fetch and display the inventory
const getInventory = async () => {
    try {
        const response = await fetch('/list-inventory');
        const data = await response.json();
        const regularTableBody = document.querySelector('#regular-table tbody');
        const oopsieTableBody = document.querySelector('#oopsie-table tbody');
        regularTableBody.innerHTML = '';
        oopsieTableBody.innerHTML = '';

        // Sort the products alphabetically by name
        data.products.sort((a, b) => a.name.localeCompare(b.name));

        data.products.forEach(product => {
            const row = document.createElement('tr');

            // Determine the class for the quantity cell
            let quantityClass = '';
            if (product.quantity === 0) {
                quantityClass = 'out-of-stock';
            } else if (product.quantity > 0 && product.quantity <= 5) {
                quantityClass = 'low-stock';
            }
            
            row.innerHTML = `
                <td>
                    <div class="item-name">${product.name}</div>
                    <div class="item-sku">${product.sku}</div>
                </td>
                <td><div class="quantity-badge ${quantityClass}">${product.quantity}</div></td>
                <td>${product.category}</td>
                <td class="action-cell">
                    <button class="action-button" onclick="openEditProductModal(${product.id}, '${product.name}', '${product.sku}', ${product.quantity}, '${product.materials}', '${product.category}', '${product.type}')">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="action-button" onclick="deleteProduct(${product.id})"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            `;
            if (product.type === 'Regular') {
                regularTableBody.appendChild(row);
            } else if (product.type === 'Oopsie') {
                oopsieTableBody.appendChild(row);
            }
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        showToast('There was an error fetching the inventory.', 'error');
    }
};

// Function to fetch and display categories in the select inputs
const getCategories = async () => {
    try {
        const response = await fetch('/list-categories');
        const data = await response.json();

        if (!Array.isArray(data.categories)) {
            throw new Error('Categories is not an array');
        }

        const addCategorySelect = document.getElementById('category');
        const editCategorySelect = document.getElementById('editCategory');
        const filterCategorySelect = document.getElementById('filterCategory');

        // Clear current options
        addCategorySelect.innerHTML = '<option value="">Select category</option>';
        editCategorySelect.innerHTML = '<option value="">Select category</option>';
        filterCategorySelect.innerHTML = '<option value="">Filter category</option>';

        // Populate the select inputs with categories
        data.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            addCategorySelect.appendChild(option);
            editCategorySelect.appendChild(option.cloneNode(true));
            filterCategorySelect.appendChild(option.cloneNode(true));
        });

        // Add event listener to filter category on change
        filterCategorySelect.addEventListener('change', filterByCategory);

    } catch (error) {
        console.error('Error fetching categories:', error);
        showToast('There was an error fetching the categories.', 'error');
    }
};

// Function to search products
const searchProducts = async () => {
    const query = document.getElementById('searchInput').value;
    if (!query) {
        showToast('Please enter a search query.', 'error');
        return;
    }

    try {
        const response = await fetch(`/search?query=${query}`);
        const data = await response.json();
        const regularTableBody = document.querySelector('#regular-table tbody');
        const oopsieTableBody = document.querySelector('#oopsie-table tbody');
        regularTableBody.innerHTML = '';
        oopsieTableBody.innerHTML = '';

        // Sort the products alphabetically by name
        data.products.sort((a, b) => a.name.localeCompare(b.name));

        data.products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="item-name">${product.name}</div>
                    <div class="item-sku">${product.sku}</div>
                </td>
                <td><div class="quantity-badge">${product.quantity}</div></td>
                <td>${product.category}</td>
                <td class="action-cell">
                    <button class="action-button" onclick="openEditProductModal(${product.id}, '${product.name}', '${product.sku}', ${product.quantity}, '${product.materials}', '${product.category}', '${product.type}')">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="action-button" onclick="deleteProduct(${product.id})"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            `;
            if (product.type === 'Regular') {
                regularTableBody.appendChild(row);
            } else if (product.type === 'Oopsie') {
                oopsieTableBody.appendChild(row);
            }
        });
    } catch (error) {
        console.error('Error searching products:', error);
        showToast('There was an error searching the inventory.', 'error');
    }
};

// Function to filter products by category
const filterByCategory = async () => {
    const category = document.getElementById('filterCategory').value;
    if (!category) {
        showToast('Please select a category to filter.', 'error');
        return;
    }

    try {
        const response = await fetch(`/filter?category=${category}`);
        const data = await response.json();
        const regularTableBody = document.querySelector('#regular-table tbody');
        const oopsieTableBody = document.querySelector('#oopsie-table tbody');
        regularTableBody.innerHTML = '';
        oopsieTableBody.innerHTML = '';

        // Sort the products alphabetically by name
        data.products.sort((a, b) => a.name.localeCompare(b.name));

        data.products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="item-name">${product.name}</div>
                    <div class="item-sku">${product.sku}</div>
                </td>
                <td><div class="quantity-badge">${product.quantity}</div></td>
                <td>${product.category}</td>
                <td class="action-cell">
                    <button class="action-button" onclick="openEditProductModal(${product.id}, '${product.name}', '${product.sku}', ${product.quantity}, '${product.materials}', '${product.category}', '${product.type}')">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="action-button" onclick="deleteProduct(${product.id})"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            `;
            if (product.type === 'Regular') {
                regularTableBody.appendChild(row);
            } else if (product.type === 'Oopsie') {
                oopsieTableBody.appendChild(row);
            }
        });
    } catch (error) {
        console.error('Error filtering products:', error);
        showToast('There was an error filtering the inventory.', 'error');
    }
};

// Function to reset search and filters
const resetSearch = async () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCategory').value = '';
    await getInventory();
};

// Function to delete a product
const deleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            const response = await fetch(`/delete-product/${id}`, { method: 'DELETE' });
            if (response.ok) {
                getInventory();
                showToast('<i class="fa-solid fa-check h-icon"></i> Product deleted successfully');
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
const openEditProductModal = (id, name, sku, quantity, materials, category, type) => {
    document.getElementById('editProductId').value = id;
    document.getElementById('editProductName').value = name;
    document.getElementById('editSku').value = sku;
    document.getElementById('editQuantity').value = quantity;
    document.getElementById('editMaterials').value = materials;
    document.getElementById('editCategory').value = category;
    document.getElementById('editType').value = type;
    document.getElementById('editProductDialog').showModal();
};

// Event listeners for modal buttons
document.getElementById('openModalButton').onclick = () => document.getElementById('addProductDialog').showModal();
document.getElementById('closeDialogButton').onclick = () => document.getElementById('addProductDialog').close();
document.getElementById('closeEditDialogButton').onclick = () => document.getElementById('editProductDialog').close();

// Event listener for search input to trigger search on Enter key press
document.getElementById('searchInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchProducts();
    }
});

// Handle adding a new product
document.getElementById('addProductForm').onsubmit = async (event) => {
    event.preventDefault();

    const product = {
        name: document.getElementById('productName').value,
        sku: document.getElementById('sku').value,
        quantity: parseInt(document.getElementById('quantity').value),
        materials: document.getElementById('materials').value,
        category: document.getElementById('category').value,
        type: document.getElementById('type').value,
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
            showToast('<i class="fa-solid fa-check h-icon"></i> Product added successfully');
            document.getElementById('addProductForm').reset();
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
        type: document.getElementById('editType').value,
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
            showToast('<i class="fa-solid fa-check h-icon"></i> Product updated successfully');
        } else {
            showToast('Error updating product', 'error');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        showToast('An error occurred while updating the product.', 'error');
    }
};

// Load inventory and categories on page load
window.onload = () => {
    getInventory();
    getCategories();
};