const salaryInput = document.getElementById("salary");
const expenseNameInput = document.getElementById("expenseName");
const expenseAmountInput = document.getElementById("expenseAmount");
const addExpenseBtn = document.getElementById("addExpenseBtn");

const remainingBalance = document.getElementById("remainingBalance");
const expenseList = document.getElementById("expenseList");
const totalExpensesElement = document.getElementById("totalExpenses");
const warningMessage = document.getElementById("warningMessage");
const ctx = document.getElementById("expenseChart").getContext("2d");
const clearAllBtn = document.getElementById("clearAllBtn");
const darkModeBtn = document.getElementById("darkModeBtn");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

let expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40"
]
        }]
    }
});

const savedSalary = localStorage.getItem("salary");

if (savedSalary) {
    salaryInput.value = savedSalary;
}

let totalExpenses = 0;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
function renderExpenses() {

    expenseList.innerHTML = "";
    totalExpenses = 0;

    expenses.forEach((expense, index) => {

        totalExpenses += expense.amount;

        const li = document.createElement("li");

        li.innerHTML = `
    ${expense.name} - ₹${expense.amount}
    <button class="editBtn">Edit</button>
    <button class="deleteBtn">Delete</button>
`;
        const editBtn = li.querySelector(".editBtn");
        const deleteBtn = li.querySelector(".deleteBtn");

        editBtn.addEventListener("click", function () {

    expenseNameInput.value = expense.name;
    expenseAmountInput.value = expense.amount;

    expenses.splice(index, 1);

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    renderExpenses();
});

deleteBtn.addEventListener("click", function () {
    expenses.splice(index, 1);

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    renderExpenses();
});
expenseList.appendChild(li);
    });

    const salary = Number(salaryInput.value) || 0;

remainingBalance.textContent =
    `Remaining Balance: ₹${salary - totalExpenses}`;

    const balance = salary - totalExpenses;

if (balance < 0) {
    warningMessage.textContent =
        "❌ Expenses exceeded salary!";
}
else if (balance === 0) {
    warningMessage.textContent =
        "⚠️ Salary fully utilized!";
}
else if (salary > 0 && balance < salary * 0.1) {
    warningMessage.textContent =
        "⚠️ Warning: Balance is below 10% of salary!";
}
else {
    warningMessage.textContent = "";
}

expenseChart.data.labels = expenses.map(expense => expense.name);

expenseChart.data.datasets[0].data = expenses.map(expense => expense.amount);

expenseChart.update();

totalExpensesElement.textContent =
    `Total Expenses: ₹${totalExpenses}`;
    
}
renderExpenses();

addExpenseBtn.addEventListener("click", function () {

    const remainingBalance = document.getElementById("remainingBalance");
    const expenseList = document.getElementById("expenseList");
    const totalExpensesElement = document.getElementById("totalExpenses");
    const salary = Number(salaryInput.value);
    const expenseName = expenseNameInput.value;
    const expenseAmount = Number(expenseAmountInput.value);

    if (
    salary <= 0 ||
    expenseName.trim() === "" ||
    expenseAmount <= 0
) {
    alert("Please enter valid values");
    return;
}
if (!isNaN(expenseName)) {
    alert("Expense Name should contain only text");

    expenseNameInput.value = "";
    expenseAmountInput.value = "";

    return;
}

   const currentBalance = salary - totalExpenses;

if (expenseAmount > currentBalance) {
    alert("Expense exceeds remaining balance!");

    expenseNameInput.value = "";
    expenseAmountInput.value = "";

    return;
}
   
    localStorage.setItem("salary", salary);

    totalExpenses += expenseAmount;

expenses.push({
    name: expenseName,
    amount: expenseAmount
});

localStorage.setItem(
    "expenses",
    JSON.stringify(expenses)
);

renderExpenses();

expenseNameInput.value = "";
expenseAmountInput.value = "";
});
expenseAmountInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        addExpenseBtn.click();
    }

});
clearAllBtn.addEventListener("click", function () {

    if (confirm("Are you sure you want to delete all expenses?")) {

        expenses = [];
        totalExpenses = 0;

        localStorage.setItem(
            "expenses",
            JSON.stringify(expenses)
        );

        renderExpenses();
    }
});
darkModeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        darkModeBtn.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        darkModeBtn.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    darkModeBtn.textContent = "☀️";
}