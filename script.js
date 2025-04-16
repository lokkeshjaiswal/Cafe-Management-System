
let orderQueue = [];
let orderHistory = [];
let orderCounter = 0;
let totalRevenue = 0;

function showSection(id) {
  const sections = document.querySelectorAll(".section");
  sections.forEach(section => section.classList.add("hidden"));

  if (id === "admin") {
    const pwd = prompt("Enter admin password:");
    if (pwd !== "123") {
      alert("Incorrect password!");
      return;
    }
  }

  document.getElementById(id).classList.remove("hidden");
}

document.getElementById("order-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("customer-name").value;
  const item = document.getElementById("item").value;
  const quantity = parseInt(document.getElementById("quantity").value);
  const price = parseInt(document.querySelector("#item option:checked").dataset.price);
  const total = quantity * price;

  orderCounter++;
  totalRevenue += total;

  const order = { orderNumber: orderCounter, customerName: name, item, quantity, price, total };
  orderQueue.push(order);
  orderHistory.push(order);

  updateQueue();
  updateAdminPanel();
  showBill(order);
  this.reset();
});

function showBill(order) {
  const billContent = document.getElementById("bill-content");
  billContent.innerHTML = `
    <h3>Order No: ${order.orderNumber}</h3>
    <h3>Bill for ${order.customerName}</h3>
    <p>Item: ${order.item}</p>
    <p>Quantity: ${order.quantity}</p>
    <p>Total: Rs. ${order.total}</p>
  `;
  document.getElementById("bill").classList.remove("hidden");
  updateSummary();
}

function updateQueue() {
  const list = document.getElementById("order-queue");
  list.innerHTML = "";
  orderQueue.forEach(order => {
    const li = document.createElement("li");
    li.textContent = `Order #${order.orderNumber} - ${order.customerName} - ${order.item} x ${order.quantity}`;
    list.appendChild(li);
  });
}

function updateAdminPanel() {
  const list = document.getElementById("admin-orders");
  list.innerHTML = "<h3>All Orders</h3>";
  orderHistory.forEach(order => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>Order #${order.orderNumber} - ${order.customerName}</strong><br>
      Item: ${order.item}, Qty: ${order.quantity}, Total: Rs. ${order.total}
    `;
    list.appendChild(div);
  });
}

const menuData = {
  "Pizza": 150,
  "Burger": 100,
  "Sandwich": 80,
  "Pasta": 120,
  "Fries": 70,
  "Samosa": 30,
  "Noodles": 90,
  "Coffee": 60,
  "Tea": 20,
  "Ice Cream": 50,
  "Dosa": 110,
  "Thali": 200
};

function renderMenuOptions() {
  const itemSelect = document.getElementById("item");
  itemSelect.innerHTML = "";
  for (const [name, price] of Object.entries(menuData)) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.dataset.price = price;
    opt.textContent = `${name} - Rs. ${price}`;
    itemSelect.appendChild(opt);
  }
}
renderMenuOptions();

function addMenuItem() {
  const name = document.getElementById("new-item-name").value.trim();
  const price = parseInt(document.getElementById("new-item-price").value);
  if (!name || isNaN(price)) return alert("Enter valid item and price.");
  menuData[name] = price;
  renderMenuOptions();
  alert(`${name} added to menu.`);
}

function deleteMenuItem() {
  const name = document.getElementById("delete-item-name").value.trim();
  if (!menuData[name]) return alert("Item not found.");
  delete menuData[name];
  renderMenuOptions();
  alert(`${name} removed from menu.`);
}

function updateSummary() {
  const summaryDiv = document.getElementById("daily-summary");
  summaryDiv.innerHTML = `
    <h4>Daily Summary</h4>
    <p>Total Orders: ${orderCounter}</p>
    <p>Total Revenue: Rs. ${totalRevenue}</p>
  `;
}
