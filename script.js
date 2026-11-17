
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
    const titleValue = document.getElementById("title").value.trim();
const amountValue = Number(document.getElementById("amount").value);
const dateValue = document.getElementById("date").value;

if (titleValue.length < 2) {
    alert("Transaction name must contain at least 2 characters.");
    return;
}

if (!Number.isFinite(amountValue) || amountValue <= 0) {
    alert("Please enter a valid amount greater than zero.");
    return;
}

if (!dateValue) {
    alert("Please select a transaction date.");
    return;
}

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
        li.className = "transaction-item";

        // Transaction details and amount
        const content = document.createElement("div");
        content.className = "transaction-content";

        const details = document.createElement("div");
        details.className = "transaction-details";

        const title = document.createElement("strong");
        title.textContent = transaction.title;

        const info = document.createElement("small");
        info.textContent =
            transaction.category + " | " + transaction.date;

        details.appendChild(title);
        details.appendChild(document.createElement("br"));
        details.appendChild(info);

        const amount = document.createElement("span");
        amount.className = "transaction-amount";
        amount.classList.add(
    transaction.type === "income" ? "income-amount" : "expense-amount"
);
        amount.textContent =
            (transaction.type === "income" ? "+" : "-") +
            "₹" + transaction.amount;

        content.appendChild(details);
        content.appendChild(amount);

        // Edit and Delete buttons
        const actions = document.createElement("div");
        actions.className = "transaction-actions";

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

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        li.appendChild(content);
        li.appendChild(actions);

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
    let monthlyExpense = 0;
    let previousMonthExpense = 0;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const previousMonthDate = new Date(
        currentYear,
        currentMonth - 1,
        1
    );

    const previousMonth = previousMonthDate.getMonth();
    const previousYear = previousMonthDate.getFullYear();

    transactions.forEach(function (transaction) {
        const amount = Number(transaction.amount);

        if (transaction.type === "income") {
            totalIncome += amount;
        } else if (transaction.type === "expense") {
            totalExpense += amount;

            const transactionDate = new Date(
                transaction.date + "T00:00:00"
            );

            const month = transactionDate.getMonth();
            const year = transactionDate.getFullYear();

            if (month === currentMonth && year === currentYear) {
                monthlyExpense += amount;
            }

            if (month === previousMonth && year === previousYear) {
                previousMonthExpense += amount;
            }
        }
    });

    document.getElementById("total-income").textContent =
        "₹" + totalIncome;

    document.getElementById("total-expense").textContent =
        "₹" + totalExpense;

    document.getElementById("total-balance").textContent =
        "₹" + (totalIncome - totalExpense);

    document.getElementById("monthly-expense").textContent =
        "₹" + monthlyExpense;

    const comparisonElement =
        document.getElementById("monthly-comparison");

    if (previousMonthExpense === 0) {
        comparisonElement.textContent =
            "No previous month data";
    } else {
        const percentage =
            ((monthlyExpense - previousMonthExpense) /
            previousMonthExpense) * 100;

        if (percentage > 0) {
            comparisonElement.textContent =
                percentage.toFixed(1) + "% increase";
        } else if (percentage < 0) {
            comparisonElement.textContent =
                Math.abs(percentage).toFixed(1) + "% decrease";
        } else {
            comparisonElement.textContent = "No change";
        }
    }

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

// =================================
// EXPORT TRANSACTIONS TO CSV
// =================================

const exportButton = document.getElementById("export-btn");

exportButton.addEventListener("click", function () {

    if (transactions.length === 0) {
        alert("No transactions available to export!");
        return;
    }

    const headers = ["Title", "Amount", "Type", "Category", "Date"];

    const rows = transactions.map(transaction => [
    transaction.title,
    transaction.amount,
    transaction.type,
    transaction.category,
    transaction.date
        ? String(transaction.date).split("-").reverse().join("/")
        : ""
]);

    const csvContent = [headers, ...rows]
        .map(row =>
            row.map(value =>
                `"${String(value ?? "").replace(/"/g, '""')}"`
            ).join(",")
        )
        .join("\n");

    const blob = new Blob(
        ["\uFEFF" + csvContent],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "expenso-transactions.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

});

