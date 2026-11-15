
let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");

// Add transaction
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

    transactions.push(transaction);

    saveTransactions();
    displayTransactions();
    updateSummary();

    form.reset();
});

// Save transactions to Local Storage
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

        li.innerHTML = `
            <div>
                <strong>${transaction.title}</strong>
                <br>
                <small>${transaction.category} | ${transaction.date}</small>
            </div>

            <span>
                ${transaction.type === "income" ? "+" : "-"}
                ₹${transaction.amount}
            </span>

            <button onclick="deleteTransaction(${index})">
                Delete
            </button>
        `;

        transactionList.appendChild(li);
    });
}

// Delete transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);

    saveTransactions();
    displayTransactions();
    updateSummary();
}

// Update Income, Expense and Balance
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

    document.getElementById("total-income").innerText =
        "₹" + totalIncome;

    document.getElementById("total-expense").innerText =
        "₹" + totalExpense;

    document.getElementById("total-balance").innerText =
        "₹" + balance;
}

// Load saved transactions when page opens
displayTransactions();
updateSummary();
