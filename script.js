
let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");

const searchInput = document.getElementById("transaction-search");
const typeFilter = document.getElementById("filter-type");
const categoryFilter = document.getElementById("filter-category");

let categoryChart = null;
let comparisonChart = null;
let editingIndex = null;

const submitButton = form.querySelector('button[type="submit"]');

const cancelButton = document.createElement("button");
cancelButton.type = "button";
cancelButton.textContent = "Cancel Edit";
cancelButton.hidden = true;
form.appendChild(cancelButton);

// Add or update transaction
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const transaction = {
        title: document.getElementById("title").value,
        amount: Number(document.getElementById("amount").value),
        type: document.getElementById("type").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value
    };

    if (editingIndex === null) {
        transactions.push(transaction);
    } else {
        transactions[editingIndex] = transaction;
    }

    saveTransactions();
    displayTransactions();
    updateSummary();

    editingIndex = null;
    form.reset();
    submitButton.textContent = "Add Transaction";
    cancelButton.hidden = true;
});

// Save transactions
function saveTransactions() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

// Search and filter events
searchInput.addEventListener("input", displayTransactions);
typeFilter.addEventListener("change", displayTransactions);
categoryFilter.addEventListener("change", displayTransactions);

// Display filtered transactions
function displayTransactions() {
    transactionList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;
    const selectedCategory = categoryFilter.value;

    const filteredTransactions = transactions
        .map((transaction, index) => ({ transaction, index }))
        .filter(item => {
            const t = item.transaction;

            const matchesSearch =
                t.title.toLowerCase().includes(searchText);

            const matchesType =
                selectedType === "all" || t.type === selectedType;

            const matchesCategory =
                selectedCategory === "all" ||
                t.category === selectedCategory;

            return matchesSearch && matchesType && matchesCategory;
        });

    if (filteredTransactions.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No matching transactions found.";
        transactionList.appendChild(li);
        return;
    }

    filteredTransactions.forEach(function (item) {
        const transaction = item.transaction;
        const index = item.index;

        const li = document.createElement("li");

        const details = document.createElement("div");

        const title = document.createElement("strong");
        title.textContent = transaction.title;

        const info = document.createElement("small");
        info.textContent =
            transaction.category + " | " + transaction.date;

        details.appendChild(title);
        details.appendChild(document.createElement("br"));
        details.appendChild(info);

        const amount = document.createElement("span");
        amount.textContent =
            (transaction.type === "income" ? "+" : "-") +
            "₹" + transaction.amount;

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", function () {
            editTransaction(index);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            deleteTransaction(index);
        });

        li.appendChild(details);
        li.appendChild(amount);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        transactionList.appendChild(li);
    });
}

// Edit transaction
function editTransaction(index) {
    const transaction = transactions[index];

    document.getElementById("title").value = transaction.title;
    document.getElementById("amount").value = transaction.amount;
    document.getElementById("type").value = transaction.type;
    document.getElementById("category").value = transaction.category;
    document.getElementById("date").value = transaction.date;

    editingIndex = index;

    submitButton.textContent = "Update Transaction";
    cancelButton.hidden = false;

    form.scrollIntoView({ behavior: "smooth" });
}

// Cancel editing
cancelButton.addEventListener("click", function () {
    editingIndex = null;
    form.reset();

    submitButton.textContent = "Add Transaction";
    cancelButton.hidden = true;
});

// Delete transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);

    if (editingIndex === index) {
        editingIndex = null;
        form.reset();
        submitButton.textContent = "Add Transaction";
        cancelButton.hidden = true;
    } else if (editingIndex !== null && index < editingIndex) {
        editingIndex--;
    }

    saveTransactions();
    displayTransactions();
    updateSummary();
}

// Update summary
function updateSummary() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function (transaction) {
        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else if (transaction.type === "expense") {
            totalExpense += transaction.amount;
        }
    });

    document.getElementById("total-income").textContent =
        "₹" + totalIncome;

    document.getElementById("total-expense").textContent =
        "₹" + totalExpense;

    document.getElementById("total-balance").textContent =
        "₹" + (totalIncome - totalExpense);

        updateCharts(totalIncome, totalExpense);
}

function updateCharts(totalIncome, totalExpense) {

    // Calculate expenses category-wise
    const categoryTotals = {};

    transactions.forEach(function (transaction) {
        if (transaction.type === "expense") {
            const category = transaction.category;

            categoryTotals[category] =
                (categoryTotals[category] || 0) +
                transaction.amount;
        }
    });

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    // Create or update category chart
    if (categoryChart) {
        categoryChart.data.labels = categories;
        categoryChart.data.datasets[0].data = amounts;
        categoryChart.update();
    } else {
        categoryChart = new Chart(
            document.getElementById("categoryChart"),
            {
                type: "doughnut",
                data: {
                    labels: categories,
                    datasets: [{
                        label: "Expenses",
                        data: amounts
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true
                }
            }
        );
    }

    // Create or update income vs expense chart
    if (comparisonChart) {
        comparisonChart.data.datasets[0].data = [
            totalIncome,
            totalExpense
        ];
        comparisonChart.update();
    } else {
        comparisonChart = new Chart(
            document.getElementById("comparisonChart"),
            {
                type: "bar",
                data: {
                    labels: ["Income", "Expenses"],
                    datasets: [{
                        label: "Amount (₹)",
                        data: [totalIncome, totalExpense]
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }
        );
    }
}


// Load saved transactions
displayTransactions();
updateSummary();
