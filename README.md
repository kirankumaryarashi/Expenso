# Expenso — Personal Expense Tracker

A simple and responsive web application for managing personal income and expenses, tracking monthly spending, and understanding financial activity through visual charts.

---

## 1. Project Overview

**Expenso** is a frontend-based personal expense tracking application developed using HTML, CSS, and JavaScript.

The application provides a central dashboard where users can record income and expense transactions, monitor their financial balance, organise transactions by category, and analyse spending patterns.

The project focuses on practical JavaScript concepts, client-side data management, responsive UI development, and data visualisation.

## 2. Key Features

- **Dashboard Overview:** Displays total income, total expenses, and available balance.
- **Transaction Management:** Add, edit, and delete income and expense records.
- **Search Transactions:** Find transactions using their titles.
- **Category Filtering:** Filter records based on transaction categories.
- **Type Filtering:** View income and expenses separately.
- **Monthly Expense Tracking:** Monitor expenses by month.
- **Expense Analytics:** Visualise category-wise spending and monthly expense trends.
- **CSV Export:** Export transaction history for external use.
- **Persistent Storage:** Retain transaction data using browser Local Storage.
- **Responsive Interface:** Supports desktop and mobile screen sizes.

## 3. Technology Stack

| Technology | Usage |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling and responsive layout |
| JavaScript (ES6+) | Application logic and DOM manipulation |
| Chart.js | Expense data visualisation |
| Font Awesome | Interface icons |
| Browser Local Storage | Client-side data persistence |
| Git | Version control |
| GitHub | Source code hosting |

## 4. Project Structure

The application follows a simple file-based frontend structure.

```text
Expenso/
│
├── index.html
│   └── Main application structure
│
├── style.css
│   └── Styling, layout and responsive design
│
├── script.js
│   └── Application logic and transaction management
│
└── README.md
    └── Project documentation
```

Each file has a specific responsibility, keeping the project organised and easy to maintain.

## 5. Application Architecture

Expenso currently follows a client-side architecture. The user interface, application logic, storage, and chart visualisation work together within the browser.

```text
              USER
                |
                v
          USER INTERFACE
            (HTML/CSS)
                |
                v
       APPLICATION LOGIC
           (JavaScript)
                |
        +-------+--------+
        |                |
        v                v
  LOCAL STORAGE       CHART.JS
  (Transaction       (Data
      Data)        Visualisation)
        |
        v
  DASHBOARD UPDATES
  AND TRANSACTION VIEW
```

### Application Workflow

1. The user interacts with the application through the dashboard.
2. JavaScript handles user actions and form submissions.
3. Transaction details are maintained in a JavaScript array.
4. Changes are saved to browser Local Storage.
5. Dashboard summaries are recalculated using transaction data.
6. Chart.js uses expense records to generate visual analytics.
7. The transaction history can be exported as a CSV file.

## 6. Transaction Data Structure

Each transaction is represented as a JavaScript object containing the following properties:

| Property | Data Type | Description |
|---|---|---|
| id | Number | Unique transaction identifier |
| title | String | Transaction name or description |
| amount | Number | Transaction amount |
| type | String | Income or expense |
| category | String | Transaction category |
| date | String | Transaction date in YYYY-MM-DD format |

### Example Transaction Object

```javascript
{
    id: 1712345678901,
    title: "Groceries",
    amount: 1500,
    type: "expense",
    category: "Food",
    date: "2026-11-17"
}
```

### Data Collection Structure

Multiple transaction objects are maintained in an array.

```javascript
let transactions = [
    {
        id: 1712345678901,
        title: "Monthly Salary",
        amount: 25000,
        type: "income",
        category: "Salary",
        date: "2026-11-01"
    },
    {
        id: 1712345678902,
        title: "Groceries",
        amount: 1500,
        type: "expense",
        category: "Food",
        date: "2026-11-17"
    }
];
```

## 7. Data Storage and Persistence

Expenso uses the browser's **Local Storage API** to maintain transaction records.

Transaction data is converted into JSON format before being saved.

```javascript
localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
);
```

When the application loads, the saved data is retrieved:

```javascript
let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];
```

This approach allows users to retain their transaction records across page refreshes without requiring a backend server or external database.

**Storage limitation:** Data is stored locally in the browser. It is not synchronised across devices or shared between different browsers.

## 8. Core Functionalities

### Transaction Management

The application supports basic CRUD operations:

- **Create:** Add new income or expense transactions.
- **Read:** Display saved transactions and dashboard summaries.
- **Update:** Modify existing transaction details.
- **Delete:** Remove unwanted transactions.

### Financial Calculations

The dashboard calculates:

- Total income from income transactions.
- Total expenses from expense transactions.
- Available balance by subtracting expenses from income.
- Monthly expense totals using transaction dates.

### Expense Analytics

Chart.js is used to visualise:

- Expense distribution by category.
- Monthly expense trends.

### CSV Export

Users can export their transaction history into a CSV file, making it easier to review records outside the application.

## 9. Installation and Setup

Follow these steps to run the project locally.

**Prerequisites**

- A modern web browser.
- Visual Studio Code.
- Git installed on your system.
- Live Server extension in VS Code.

**Step 1: Clone the repository**

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

**Step 2: Open the project folder**

```bash
cd Expenso
```

**Step 3: Open in Visual Studio Code**

```bash
code .
```

Alternatively, open the folder directly through VS Code.

**Step 4: Run the application**

Open `index.html`, right-click, and select **Open with Live Server**.

The application will open in your default browser.

## 10. Future Enhancements

The following improvements are planned for future versions:

- Backend integration using Node.js and Express.js.
- Database integration using MongoDB.
- User registration and authentication.
- Cloud-based transaction storage.
- Monthly budget planning.
- Advanced financial reports and analytics.

These enhancements are not part of the current implementation.

## 11. Learning Outcomes

Developing Expenso provided practical experience with:

- JavaScript fundamentals and DOM manipulation.
- Arrays, objects, and array methods.
- Event handling and form validation.
- CRUD operations.
- Browser Local Storage and JSON.
- Dynamic chart generation using Chart.js.
- Responsive web design.
- CSV file generation and export.
- Git version control and GitHub repository management.

## 12. Project Information

| Detail | Information |
|---|---|
| Project Name | Expenso |
| Project Type | Personal Expense Tracker |
| Application | Frontend Web Application |
| Development Status | Frontend implementation |
| Storage | Browser Local Storage |
| License | Not specified |

---

**Expenso** was developed as a personal learning and portfolio project to gain practical experience in frontend development and understand how different web technologies work together to build a functional application.