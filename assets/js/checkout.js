document.addEventListener("DOMContentLoaded", () => {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-items");
    const totalDisplay = document.getElementById("total-amount");
  
    // Get the cart count element from the navbar
    const cartCountElement = document.getElementById("cart-count");
  
    // Function to render the cart items in the cart page
    function renderCart() {
      cartContainer.innerHTML = "";
      let total = 0;
  
      // Loop through the cart items and display them
      cartItems.forEach((item, index) => {
        const quantity = item.quantity || 1;
        const itemTotal = item.price * quantity;
        total += itemTotal;
  
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.name}</td>
          <td>₦${item.price.toFixed(2)}</td>
          <td>
            <button class="btn btn-secondary qty-btn decrease" data-index="${index}">-</button>
            <span class="mx-2">${quantity}</span>
            <button class="btn btn-secondary qty-btn increase" data-index="${index}">+</button>
          </td>
          <td>₦${itemTotal.toFixed(2)}</td>
          <td>
            <button class="btn btn-danger delete" data-index="${index}">Delete</button>
          </td>
        `;
        cartContainer.appendChild(row);
      });
  
      totalDisplay.textContent = total.toFixed(2);
  
      // Update cart count in navbar
      updateCartCount();
  
      localStorage.setItem("cart", JSON.stringify(cartItems));
      attachEvents();
    }
  
    // Function to update the cart count in the navbar
    function updateCartCount() {
      const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
      cartCountElement.textContent = totalItems;
    }
  
    // Attach events for quantity buttons and delete button
    function attachEvents() {
      document.querySelectorAll(".increase").forEach(btn => {
        btn.addEventListener("click", e => {
          const i = parseInt(e.target.dataset.index);
          cartItems[i].quantity = (cartItems[i].quantity || 1) + 1;
          renderCart();
        });
      });
  
      document.querySelectorAll(".decrease").forEach(btn => {
        btn.addEventListener("click", e => {
          const i = parseInt(e.target.dataset.index);
          if ((cartItems[i].quantity || 1) > 1) {
            cartItems[i].quantity -= 1;
          }
          renderCart();
        });
      });
  
      document.querySelectorAll(".delete").forEach(btn => {
        btn.addEventListener("click", e => {
          const i = parseInt(e.target.dataset.index);
          cartItems.splice(i, 1);
          renderCart();
        });
      });
    }
  
    // Event listener for checkout button
    document.getElementById("proceed-btn").addEventListener("click", () => {
      if (cartItems.length === 0) {
        alert("🛒 Your cart is empty.");
        return;
      }
    // Replace with your WhatsApp number (with country code, no + or leading zero)
const phoneNumber = "2349079459440"; 

// Compose the message
let message = "Hello! I'd like to place an order:\n\n";
cartItems.forEach((item, index) => {
  const quantity = item.quantity || 1;
  message += `${index + 1}. ${item.name} - ₦${item.price.toFixed(2)} x ${quantity} = ₦${(item.price * quantity).toFixed(2)}\n`;
});
message += `\nTotal: ₦${totalDisplay.textContent}\n\nMy name is: [Enter your name here]`;

// Encode the message for URL
const encodedMessage = encodeURIComponent(message);

// Redirect to WhatsApp
window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    });
  
    // Initial render
    renderCart();
  });
  
  function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " added to cart!");
  }
  // Function to add product to cart
function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }

  // Save updated cart in localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Update cart count on the navbar
  updateCartCount();

  // Alert the user
  alert(name + " added to cart!");
}

// Function to update the cart count in the navbar
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById('cart-count').textContent = totalItems;
}

// Update cart count on page load
window.onload = function() {
  updateCartCount();
};

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }