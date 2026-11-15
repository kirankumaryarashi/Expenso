
let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");

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
    localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
);

    displayTransactions();
    updateSummary();

    form.reset();
});

function displayTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(function (transaction) {
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
        `;

        transactionList.appendChild(li);
    });
}


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

    let balance = totalIncome - totalExpense;

    document.getElementById("total-income").innerText =
        "₹" + totalIncome;

    document.getElementById("total-expense").innerText =
        "₹" + totalExpense;

    document.getElementById("total-balance").innerText =
        "₹" + balance;
}
displayTransactions();
updateSummary();
