const btnIncome = document.querySelector('button.add');
const btnExpense = document.querySelector('button.expense');
const dialog = document.querySelector('dialog.budget-modal');
const form = document.querySelector('dialog.budget-modal form');

let movements = [];

function Movement({ name, value, type }) {
	this.name = name;
	this.value = +value;
	this.type = type;
	this.id = Date.now().toString(16);
}

function openModal(e) {
	const modalButton = document.querySelector('.budget-modal button');
	e.target.textContent == 'Ingresar dinero'
		? (dialog.dataset.type = 'ingreso')
		: (dialog.dataset.type = 'gasto');

	const type = dialog.dataset.type;
	modalButton.classList.add(`${type === "ingreso" ? 'add' : 'expense'}`)
	modalButton.textContent = `Agregar ${type}`;
	dialog.setAttribute('open', true);
	form[0].focus();
}

function handleSubmit(e) {
	e.preventDefault();

	form[0].setAttribute('required', true);
	form[1].setAttribute('required', true);
	form[1].setAttribute('min', 1);

	const type = dialog.dataset.type;
	const formData = new FormData(form);
	const data = Object.fromEntries(formData);

	const newMovement = new Movement({ ...data, type });
	movements.push(newMovement);

	renderMovements();
	closeModal()
}

function removeItem(e) {
	movements = movements.filter(
		(movement) => e.target.dataset.movementId !== movement.id
	);
	renderMovements();
}

function renderMovements() {
	const list = document.querySelector('section.box ul');
	list.innerHTML = '';

	movements.forEach((movement) => {
		const li = document.createElement('li');
		li.classList.add(movement.type);

		const div = document.createElement('div');
		const movementName = document.createElement('p');
		movementName.textContent = movement.name;
		const movementValue = document.createElement('p');
		movementValue.textContent = toCurrency(movement.value);
		div.appendChild(movementName);
		div.appendChild(movementValue);

		const i = document.createElement('i');
		i.classList.add('bi');
		i.classList.add('bi-trash-fill');
		i.dataset.movementId = movement.id;
		i.addEventListener('click', removeItem);

		li.appendChild(div);
		li.appendChild(i);

		list.appendChild(li);
	});

	renderTotals();
}

function renderTotals() {
	const totalIngresos = movements.reduce((acc, cur) => {
		return (cur.type === 'ingreso' && acc + cur.value) || acc;
	}, 0);
	const totalGastos = movements.reduce((acc, cur) => {
		return (cur.type === 'gasto' && acc + cur.value) || acc;
	}, 0);

	console.log(totalIngresos, totalGastos);

	const totalSaldo = totalIngresos - totalGastos;

	const spendingPercent = (totalGastos * 100) / totalIngresos;

	const spendingField = document.getElementById('spendingPercent');
	const presupuestoField = document.getElementById('totalPresupuesto');
	const gastosField = document.getElementById('totalGastos');
	const saldoField = document.getElementById('totalSaldo');

	spendingField.textContent = `${spendingPercent > 100 ? 100 : Math.round(spendingPercent) || 0
		}%`;
	presupuestoField.textContent = toCurrency(totalIngresos);
	gastosField.textContent = toCurrency(totalGastos);
	saldoField.textContent = toCurrency(totalSaldo);
}

function escapeToExit(e) {
	e.key === 'Escape' && closeModal();
}

function closeModal() {
	const modalButton = document.querySelector('.budget-modal button');

	dialog.removeAttribute('open');
	modalButton.removeAttribute('class');

	form.reset();
}

function toCurrency(value) {
	const CLP = new Intl.NumberFormat('es-CL', {
		style: 'currency',
		currency: 'CLP',
	});

	return CLP.format(value);
}

dialog.addEventListener('keydown', escapeToExit);

btnIncome.addEventListener('click', openModal);
btnExpense.addEventListener('click', openModal);

form.addEventListener('submit', handleSubmit);