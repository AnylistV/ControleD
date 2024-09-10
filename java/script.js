
// app.js
const expenseForm = document.getElementById('expense-form');
const expenseTableBody = document.getElementById('expense-table-body');
const totalExpensesElement = document.getElementById('total-expenses');

let expenses = [];

function loadExpensesFromStorage() {
  const storedExpenses = localStorage.getItem('expenses');
  if (storedExpenses) {
    expenses = JSON.parse(storedExpenses);
    renderExpenseTable();
    updateTotalExpenses();
  }
}

function saveExpensesToStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function renderExpenseTable() {
  expenseTableBody.innerHTML = '';

  for (let i = 0; i < expenses.length; i++) {
    const expense = expenses[i];
    const row = document.createElement('tr');

    const amountCell = document.createElement('td');
    amountCell.textContent = `R$${expense.amount}`;
    row.appendChild(amountCell);

    const categoryCell = document.createElement('td');
    categoryCell.textContent = expense.category;
    row.appendChild(categoryCell);

    const dateCell = document.createElement('td');
    dateCell.textContent = expense.date;
    row.appendChild(dateCell);

    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = expense.description || '-';
    row.appendChild(descriptionCell);

    const actionsCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.classList.add('edit-btn');
    editButton.addEventListener('click', () => editExpense(i));
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Deletar';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', () => deleteExpense(i));
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    row.appendChild(actionsCell);

    expenseTableBody.appendChild(row);
  }
}

function updateTotalExpenses() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalExpensesElement.textContent = `R$ ${total.toFixed(2)}`;
}

function addExpense(expense) {
  expenses.push(expense);
  saveExpensesToStorage();
  renderExpenseTable();
  updateTotalExpenses();
}

function editExpense(index) {
  const expense = expenses[index];
  document.getElementById('expense-amount').value = expense.amount;
  document.getElementById('expense-category').value = expense.category;
  document.getElementById('expense-date').value = expense.date;
  document.getElementById('expense-description').value = expense.description;

  expenseForm.addEventListener('submit', function handleEditSubmit(event) {
    event.preventDefault();
    expense.amount = parseFloat(document.getElementById('expense-amount').value);
    expense.category = document.getElementById('expense-category').value;
    expense.date = document.getElementById('expense-date').value;
    expense.description = document.getElementById('expense-description').value;
    saveExpensesToStorage();
    renderExpenseTable();
    updateTotalExpenses();
    expenseForm.removeEventListener('submit', handleEditSubmit);
  }, { once: true });
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  saveExpensesToStorage();
  renderExpenseTable();
  updateTotalExpenses();
}

expenseForm.addEventListener('submit', function handleSubmit(event) {
  event.preventDefault();
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const category = document.getElementById('expense-category').value;
  const date = document.getElementById('expense-date').value;
  const description = document.getElementById('expense-description').value;

  if (amount && category && date) {
    const newExpense = { amount, category, date, description };
    addExpense(newExpense);
    expenseForm.reset();
  }
});

loadExpensesFromStorage();