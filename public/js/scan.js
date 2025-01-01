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

// Function to show the error dialog
function showErrorDialog(message) {
    const errorDialog = document.getElementById('errorDialog');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerHTML = message;
    errorDialog.showModal();
}

// Object to keep track of scanned items and their quantities
let scannedItems = {};
let totalScannedItems = 0; // Initialize the total number of scanned items

// Function to update the total number of scanned items in the HTML
function updateTotalScannedItems() {
    document.getElementById('totalScannedItems').innerHTML = `<span>Total items</span> ${totalScannedItems}`;
}

// Function to handle barcode input
async function handleBarcodeInput(barcode) {
    if (barcode) {
        try {
            const response = await fetch('/list-inventory');
            const data = await response.json();
            const item = data.products.find(product => product.sku === barcode);

            if (item) {
                if (item.quantity > 0) {
                    item.quantity -= 1;

                    // Call your backend to update the inventory
                    const updateResponse = await fetch(`/update-product/${item.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ quantity: item.quantity })
                    });

                    if (updateResponse.ok) {
                        // Update the scanned items list
                        if (scannedItems[item.name]) {
                            scannedItems[item.name]++;
                        } else {
                            scannedItems[item.name] = 1;
                        }
                        totalScannedItems++; // Increment the total number of scanned items
                        addScannedItem(item.name); // Update the scanned items list
                        updateTotalScannedItems(); // Update the total scanned items display
                    } else {
                        const errorMsg = await updateResponse.text();
                        showToast(`Failed to update the item quantity: ${errorMsg}`, 'error');
                    }
                } else {
                    showErrorDialog(`<strong>${item.name}</strong> is out of stock. Please update the quantity to proceed.`);
                }
            } else {
                console.error('Item not found:', barcode); // Debugging line
                showToast('Item not found', 'error');
            }
        } catch (error) {
            console.error('Error updating inventory:', error);
            showToast('There was an error updating the inventory.', 'error');
        }
    }
}

// Function to add a scanned item to the list
function addScannedItem(name) {
    const scannedItemsList = document.getElementById('scannedItemsList');
    const scannedItemsWrapper = document.getElementById('scannedItemsWrapper');
    const noScannedItems = document.getElementById('noScannedItems');
    let listItem = document.getElementById(`scanned-${name.replace(/\s+/g, '-')}`);

    if (listItem) {
        // Update the existing list item
        listItem.innerHTML = `<span>${name}</span> ${scannedItems[name]}`;
    } else {
        // Create a new list item
        scannedItemsWrapper.classList.add('h-show');
        noScannedItems.classList.add('h-hide');
        listItem = document.createElement('li');
        listItem.id = `scanned-${name.replace(/\s+/g, '-')}`;
        listItem.innerHTML = `<span>${name}</span> ${scannedItems[name]}`;
        scannedItemsList.appendChild(listItem);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const barcodeInput = document.getElementById('barcodeInput');

    // Use 'change' event to process the barcode after the user finishes typing
    barcodeInput.addEventListener('change', function (e) {
        const barcode = e.target.value.trim();
        handleBarcodeInput(barcode);

        // Clear the input field for the next scan
        e.target.value = '';
    });

    const closeErrorDialogButton = document.getElementById('closeErrorDialogButton');
    closeErrorDialogButton.onclick = () => document.getElementById('errorDialog').close();
});