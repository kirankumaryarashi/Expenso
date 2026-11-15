
let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");

let editingIndex = null;

// Get the submit button
const submitButton = form.querySelector('button[type="submit"]');

// Create Cancel Edit button
const cancelButton = document.createElement("button");
cancelButton.type = "button";
cancelButton.textContent = "Cancel Edit";
cancelButton.hidden = true;
form.appendChild(cancelButton);

// Add or update transaction
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    const transaction = {
        title,
        amount,
        type,
        category,
        date
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

// Display transactions
function displayTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(function (transaction, index) {
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

    const balance = totalIncome - totalExpense;

    document.getElementById("total-income").textContent =
        "₹" + totalIncome;

    document.getElementById("total-expense").textContent =
        "₹" + totalExpense;

    document.getElementById("total-balance").textContent =
        "₹" + balance;
}

// Load saved transactions
displayTransactions();
updateSummary();
