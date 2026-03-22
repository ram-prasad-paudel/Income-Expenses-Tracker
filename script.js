// Main data storage
let transactions = [];
let debts = []; 
let currentView = "All"; 
let editingTxId = null;
let editingDebtId = null;

// Security: Prevent XSS by escaping HTML special characters
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag]));
}

// Data Loading with error handling
try {
    const savedTransactions = localStorage.getItem("myFinances");
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    }

    const savedDebts = localStorage.getItem("myDebts");
    if (savedDebts) {
        debts = JSON.parse(savedDebts);
    }
} catch (error) {
    console.error("Storage Error:", error);
    transactions = [];
    debts = [];
}

// Sync current state to local browser storage
function saveToMemory() {
    localStorage.setItem("myFinances", JSON.stringify(transactions));
    localStorage.setItem("myDebts", JSON.stringify(debts));
}

// Helper to make category text look nicer
function getCategoryEmoji(category) {
    const emojis = {
        "Wage": "💰 Wage",
        "Family Support": "👨‍👩‍👧 Family Support",
        "Food": "🍔 Food & Drink",
        "Entertainment": "🎬 Entertainment",
        "Bills": "💡 Bills & Utilities"
    };
    return emojis[category] || "📦 Other";
}

// Navigation and Filtering logic
function setView(view) {
    if (currentView === view && view !== "All") currentView = "All";
    else currentView = view;

    document.getElementById("filter-category").value = "All";
    document.querySelectorAll('.stat-box').forEach(box => box.classList.remove('active'));
    
    // Highlight the active card
    const boxMap = { 'Income': 'box-income', 'Expense': 'box-expense', 'Lent': 'box-lent', 'Borrowed': 'box-borrowed', 'All': 'box-balance' };
    const activeBox = boxMap[currentView] || 'box-balance';
    document.getElementById(activeBox).classList.add('active');

    // Toggle visibility of table sections
    const txSection = document.getElementById("transactions-section");
    const debtSection = document.getElementById("debts-section");

    if (currentView === "Income" || currentView === "Expense") {
        txSection.style.display = "block";
        debtSection.style.display = "none"; 
    } else if (currentView === "Lent" || currentView === "Borrowed") {
        txSection.style.display = "none";   
        debtSection.style.display = "block";
    } else {
        txSection.style.display = "block";
        debtSection.style.display = "block";
    }

    drawTransactions();
    drawDebts();
}

// Logic for adding or updating Personal Transactions
function addTransaction(event) {
    event.preventDefault(); 
    
    const formData = {
        type: document.getElementById("type-input").value,
        date: document.getElementById("date-input").value,
        desc: document.getElementById("desc-input").value,
        amount: Number(document.getElementById("amount-input").value),
        category: document.getElementById("category-input").value
    };

    if (editingTxId) {
        const index = transactions.findIndex(t => t.id === editingTxId);
        transactions[index] = { id: editingTxId, ...formData };
        editingTxId = null;
        document.getElementById("tx-submit-btn").innerText = "Add Entry";
    } else {
        transactions.push({ id: Date.now(), ...formData });
    }

    saveToMemory();
    setView(formData.type); 
    event.target.reset();
}

// Edit existing transaction
function editTransaction(id) {
    const itemToEdit = transactions.find(t => t.id === id);
    if (!itemToEdit) return;

    document.getElementById("type-input").value = itemToEdit.type;
    document.getElementById("date-input").value = itemToEdit.date;
    document.getElementById("desc-input").value = itemToEdit.desc;
    document.getElementById("amount-input").value = itemToEdit.amount;
    document.getElementById("category-input").value = itemToEdit.category;

    editingTxId = id;
    document.getElementById("tx-submit-btn").innerText = "Update Entry";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteTransaction(id) {
    transactions = transactions.filter(item => item.id !== id);
    saveToMemory();
    drawTransactions();
}

// Render the Transaction History table
function drawTransactions() {
    const table = document.getElementById("transaction-list");
    table.innerHTML = ""; 
    const filterChoice = document.getElementById("filter-category").value;

    let filtered = transactions.filter(item => {
        let matchesDropdown = (filterChoice === "All" || item.category === filterChoice);
        let matchesView = (currentView === "All" || currentView === "Lent" || currentView === "Borrowed" || item.type === currentView);
        return matchesDropdown && matchesView;
    });

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filtered.length === 0) {
        table.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">📭 No data found.</td></tr>`;
    }

    filtered.forEach(item => {
        const row = document.createElement("tr");
        const colorClass = item.type === "Income" ? "income-text" : "expense-text";
        row.innerHTML = `
            <td>${item.date}</td>
            <td class="${colorClass}">${item.type}</td>
            <td>${escapeHTML(item.desc)}</td>
            <td>${getCategoryEmoji(item.category)}</td>
            <td class="${colorClass}">€${item.amount.toFixed(2)}</td>
            <td>
                <button class="edit-btn" onclick="editTransaction(${item.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTransaction(${item.id})">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });

    // Update Dashboard Stats
    let income = 0, expense = 0;
    transactions.forEach(t => t.type === "Income" ? income += t.amount : expense += t.amount);
    document.getElementById("total-income").innerText = income.toFixed(2);
    document.getElementById("total-expenses").innerText = expense.toFixed(2);
    document.getElementById("current-balance").innerText = (income - expense).toFixed(2);
}

// Logic for adding or updating Debt records
function addDebt(event) {
    event.preventDefault();
    const formData = {
        type: document.getElementById("debt-type").value,
        date: document.getElementById("debt-date").value,
        person: document.getElementById("person-input").value,
        contact: document.getElementById("contact-input").value, 
        remarks: document.getElementById("remarks-input").value,
        amount: Number(document.getElementById("debt-amount").value)
    };

    if (editingDebtId) {
        const index = debts.findIndex(d => d.id === editingDebtId);
        debts[index] = { id: editingDebtId, ...formData };
        editingDebtId = null;
        document.getElementById("debt-submit-btn").innerText = "Add Record";
    } else {
        debts.push({ id: Date.now(), ...formData });
    }

    saveToMemory();
    setView(formData.type); 
    event.target.reset();
}

function editDebt(id) {
    const item = debts.find(d => d.id === id);
    if (!item) return;
    document.getElementById("debt-type").value = item.type;
    document.getElementById("debt-date").value = item.date;
    document.getElementById("person-input").value = item.person;
    document.getElementById("contact-input").value = item.contact;
    document.getElementById("remarks-input").value = item.remarks;
    document.getElementById("debt-amount").value = item.amount;
    editingDebtId = id;
    document.getElementById("debt-submit-btn").innerText = "Update Record";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteDebt(id) {
    debts = debts.filter(item => item.id !== id);
    saveToMemory();
    drawDebts();
}

// Render the Debt History table
function drawDebts() {
    const table = document.getElementById("debt-list");
    table.innerHTML = "";
    let filtered = debts.filter(item => currentView === "All" || currentView === "Income" || currentView === "Expense" || item.type === currentView);

    filtered.forEach(item => {
        const row = document.createElement("tr");
        const isLent = item.type === "Lent";
        row.innerHTML = `
            <td>${item.date}</td>
            <td class="${isLent ? 'income-text' : 'expense-text'}">${isLent ? 'Lent' : 'Borrowed'}</td>
            <td><strong>${escapeHTML(item.person)}</strong><br><small>${escapeHTML(item.contact)}</small></td>
            <td>${escapeHTML(item.remarks)}</td>
            <td class="${isLent ? 'income-text' : 'expense-text'}">${isLent ? '+' : '-'}€${item.amount.toFixed(2)}</td>
            <td>
                <button class="edit-btn" onclick="editDebt(${item.id})">Edit</button>
                <button class="delete-btn" onclick="deleteDebt(${item.id})">Settled</button>
            </td>
        `;
        table.appendChild(row);
    });

    let lent = 0, borrowed = 0;
    debts.forEach(d => d.type === "Lent" ? lent += d.amount : borrowed += d.amount);
    document.getElementById("total-lent").innerText = lent.toFixed(2);
    document.getElementById("total-borrowed").innerText = borrowed.toFixed(2);
}

// Export logic
function exportToCSV() {
    let csv = "MAIN TRANSACTIONS\nDate,Type,Description,Category,Amount\n";
    transactions.forEach(i => csv += `${i.date},${i.type},"${i.desc}",${i.category},${i.amount}\n`);
    csv += "\nDEBTS\nDate,Type,Person,Contact,Remarks,Amount\n";
    debts.forEach(i => csv += `${i.date},${i.type},"${i.person}","${i.contact}","${i.remarks}",${i.amount}\n`);

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MyFinanceStatement.csv";
    a.click();
}

function clearAllData() {
    if (confirm("Delete everything? This cannot be undone!")) {
        transactions = []; debts = [];
        saveToMemory();
        setView("All");
    }
}

// Event Listeners
document.getElementById("transaction-form").addEventListener("submit", addTransaction);
document.getElementById("debt-form").addEventListener("submit", addDebt);
document.getElementById("filter-category").addEventListener("change", drawTransactions);
document.getElementById("clear-all-btn").addEventListener("click", clearAllData);
document.getElementById("export-csv-btn").addEventListener("click", exportToCSV);

// Initial call
setView("All");