// Initialize inventory and profit
let inventory = JSON.parse(localStorage.getItem('inventory')) || {};
let stockHistory = JSON.parse(localStorage.getItem('stockHistory')) || [];
let profit = parseFloat(localStorage.getItem('profit')) || 0;

// Function to add clothing to inventory
function addClothing() {
    const name = document.getElementById('clothingName').value;
    const quantity = parseInt(document.getElementById('clothingQuantity').value);
    const price = parseFloat(document.getElementById('clothingPrice').value);
    const cost = parseFloat(document.getElementById('clothingCost').value);
    const lowStockAlert = parseInt(document.getElementById('lowStockAlert').value);
    const category = document.getElementById('category').value;

    if (name && quantity > 0 && price > 0 && cost > 0) {
        if (inventory[name]) {
            inventory[name].quantity += quantity;
        } else {
            inventory[name] = { quantity: quantity, price: price, cost: cost, lowStockAlert: lowStockAlert, category: category };
        }

        // Add to stock history
        stockHistory.push(`${quantity} of ${name} added to inventory`);
        saveInventory();
        updateInventoryTable();
        updateStockHistory();
        location.reload(); // Refresh page
    }
}

// Function to sell clothing
function sellClothing() {
    const name = document.getElementById('sellClothingName').value;
    const quantityToSell = parseInt(document.getElementById('sellClothingQuantity').value);

    if (name && quantityToSell > 0 && inventory[name] && inventory[name].quantity >= quantityToSell) {
        // Calculate profit from this sale
        const profitFromSale = (inventory[name].price - inventory[name].cost) * quantityToSell;
        profit += profitFromSale;

        // Save profit to localStorage
        localStorage.setItem('profit', profit);

        // Reduce the inventory quantity
        inventory[name].quantity -= quantityToSell;
        if (inventory[name].quantity === 0) delete inventory[name]; // Remove item if quantity reaches 0

        // Add to stock history
        stockHistory.push(`${quantityToSell} of ${name} sold, profit made: ₹${profitFromSale.toFixed(2)}`);
        saveInventory();
        updateInventoryTable();
        updateStockHistory();
        updateProfitDisplay(); // Update the profit display
        location.reload(); // Refresh page
    }
}

// Search functionality
function searchInventory() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    updateInventoryTable(input);
}

// Filter by category
function filterByCategory() {
    const category = document.getElementById('categoryFilter').value;
    updateInventoryTable(null, category);
}

// Save inventory to localStorage
function saveInventory() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('stockHistory', JSON.stringify(stockHistory));
}

// Update inventory table
function updateInventoryTable(searchTerm = '', filterCategory = 'All') {
    const table = document.getElementById('inventoryTable');
    table.innerHTML = '';

    for (let item in inventory) {
        if (item.toLowerCase().includes(searchTerm) && (filterCategory === 'All' || inventory[item].category === filterCategory)) {
            const row = `<tr class="${inventory[item].quantity <= inventory[item].lowStockAlert ? 'alert' : ''}">
                            <td>${item}</td>
                            <td>${inventory[item].quantity}</td>
                            <td>₹${inventory[item].price.toFixed(2)}</td>
                            <td>₹${inventory[item].cost.toFixed(2)}</td>
                            <td>${inventory[item].lowStockAlert}</td>
                            <td>${inventory[item].category}</td>
                            <td><button class="button" onclick="editClothing('${item}')">Edit</button></td>
                        </tr>`;
            table.innerHTML += row;
        }
    }
}

// Stock history
function updateStockHistory() {
    const historyList = document.getElementById('stockHistory');
    historyList.innerHTML = '';
    stockHistory.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        historyList.appendChild(listItem);
    });
}

// Function to update profit display
function updateProfitDisplay() {
    document.getElementById('profitValue').textContent = `₹${profit.toFixed(2)}`;
}

// Clear inventory and reset profit
function clearInventory() {
    if (confirm("Are you sure you want to clear all inventory?")) {
        inventory = {};
        stockHistory = [];
        profit = 0; // Reset profit
        localStorage.setItem('profit', profit); // Save reset profit
        saveInventory();
        updateInventoryTable();
        updateStockHistory();
        updateProfitDisplay();
        location.reload(); // Refresh page
    }
}

// Edit clothing function (placeholder, can implement full functionality)
function editClothing(itemName) {
    const item = inventory[itemName];
    document.getElementById('clothingName').value = itemName;
    document.getElementById('clothingQuantity').value = item.quantity;
    document.getElementById('clothingPrice').value = item.price;
    document.getElementById('clothingCost').value = item.cost;
    document.getElementById('lowStockAlert').value = item.lowStockAlert;
    document.getElementById('category').value = item.category;
    document.getElementById('clothingName').disabled = true; // Prevent editing name for now
}

// Handle window load to initialize inventory table and profit value
window.onload = function() {
    updateInventoryTable();
    updateProfitDisplay(); // Show profit on load
    updateStockHistory();
};
