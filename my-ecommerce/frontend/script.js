fetch("http://localhost:3000/api/products")
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById("products");

    container.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="category">${p.category}</p>
        <p class="price">₹${p.price}</p>

        <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})">
          Add to Cart
        </button>
      </div>
    `).join("");
  });

function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // check if item already in cart
  let existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
}
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cart-count").textContent = cart.length;
}

// Initialize cart count on page load
updateCartCount();
