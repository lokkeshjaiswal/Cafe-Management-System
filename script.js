const menu = [
  { id: 1, name: "Burger", price: 60, image: "https://i.imgur.com/5K2os0f.jpg" },
  { id: 2, name: "Pizza", price: 120, image: "https://i.imgur.com/ZV7zWAv.jpg" },
  { id: 3, name: "Fries", price: 40, image: "https://i.imgur.com/oqL1bGz.jpg" },
  { id: 4, name: "Coffee", price: 30, image: "https://i.imgur.com/sW7r8A1.jpg" },
  { id: 5, name: "Sandwich", price: 50, image: "https://i.imgur.com/RFzK9gH.jpg" },
  { id: 6, name: "Pasta", price: 80, image: "https://i.imgur.com/hckgQ9S.jpg" },
  { id: 7, name: "Samosa", price: 15, image: "https://i.imgur.com/lqCU9aZ.jpg" },
  { id: 8, name: "Tea", price: 20, image: "https://i.imgur.com/zqqj3Cd.jpg" },
  { id: 9, name: "Dosa", price: 70, image: "https://i.imgur.com/2PKAoae.jpg" },
  { id: 10, name: "Chowmein", price: 90, image: "https://i.imgur.com/Gfwr0Qs.jpg" },
  { id: 11, name: "Ice Cream", price: 45, image: "https://i.imgur.com/VG4MJc3.jpg" },
  { id: 12, name: "Brownie", price: 55, image: "https://i.imgur.com/3VCOSzL.jpg" }
];

let orderQueue = [];
let orderHistory = [];

function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('visible'));
  document.getElementById(id).classList.add('visible');
}

function renderMenu() {
  const container = document.getElementById("menu-items");
  const select = document.getElementById("food-select");
  container.innerHTML = "";
  select.innerHTML = "";
  menu.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="card-body">
        <h3>${item.name}</h3>
        <p>Price: ₹${item.price}</p>
      </div>`;
    container.appendChild(card);

    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    select.appendChild(option);
  });
  renderAdminItems();
}

function renderAdminItems() {
  const adminList = document.getElementById("admin-items-list");
  adminList.innerHTML = "";
  menu.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - ₹${item.price}
      <button onclick="deleteItem(${index})">Delete</button>
      <button onclick="editItem(${index})">Edit</button>`;
    adminList.appendChild(li);
  });
}

function placeOrder(event) {
  event.preventDefault();
  const name = document.getElementById("customer-name").value;
  const foodId = parseInt(document.getElementById("food-select").value);
  const qty = parseInt(document.getElementById("quantity").value);
  const item = menu.find(i => i.id === foodId);
  const total = qty * item.price;
  const order = {
    id: Date.now(),
    customer: name,
    item: item.name,
    price: item.price,
    qty,
    total
  };
  orderQueue.push(order);
  orderHistory.push(order);
  renderQueue();
  renderHistory();
  document.getElementById("order-form").reset();
}

function renderQueue() {
  const list = document.getElementById("order-queue");
  list.innerHTML = "";
  orderQueue.forEach(order => {
    const li = document.createElement("li");
    li.textContent = `${order.customer} ordered ${order.qty} x ${order.item} = ₹${order.total}`;
    list.appendChild(li);
  });
}

function renderHistory() {
  const list = document.getElementById("order-history");
  list.innerHTML = "";
  orderHistory.forEach(order => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${order.customer} - ${order.qty} x ${order.item} = ₹${order.total}
      <button onclick="printBill(${order.id})">Print Bill</button>`;
    list.appendChild(li);
  });
}

function printBill(id) {
  const order = orderHistory.find(o => o.id === id);
  const win = window.open("", "Print");
  win.document.write(`<pre>
--- Cafeteria Bill ---
Customer: ${order.customer}
Item: ${order.item}
Quantity: ${order.qty}
Unit Price: ₹${order.price}
Total: ₹${order.total}
---------------------
Thank you!
</pre>`);
  win.print();
  win.close();
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function searchMenu() {
  const term = document.getElementById("search").value.toLowerCase();
  const cards = document.querySelectorAll("#menu-items .card");
  cards.forEach(card => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = name.includes(term) ? "block" : "none";
  });
}

function deleteItem(index) {
  if (confirm("Delete this item?")) {
    menu.splice(index, 1);
    renderMenu();
  }
}

function editItem(index) {
  const newName = prompt("New name:", menu[index].name);
  const newPrice = prompt("New price:", menu[index].price);
  const newImage = prompt("New image URL:", menu[index].image);
  if (newName && newPrice && newImage) {
    menu[index].name = newName;
    menu[index].price = parseInt(newPrice);
    menu[index].image = newImage;
    renderMenu();
  }
}

document.getElementById("order-form").addEventListener("submit", placeOrder);
document.getElementById("admin-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("new-item-name").value;
  const price = parseInt(document.getElementById("new-item-price").value);
  const image = document.getElementById("new-item-image").value;
  menu.push({ id: Date.now(), name, price, image });
  renderMenu();
  e.target.reset();
});

renderMenu();
