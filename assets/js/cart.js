
document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartContainer = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("total-amount");
  const cartCountElement = document.getElementById("cart-count");
  const proceedButton = document.getElementById("proceed-btn");

function renderCart() {
  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const quantity = item.quantity || 1;
    const itemTotal = item.price * quantity;
    total += itemTotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div class="d-flex align-items-center">
          <img src="${item.image}" alt="${item.name}" class="cart-img me-2">
          <span>${item.name}</span>
        </div>
      </td>
      <td>₦${item.price.toFixed(2)}</td>
      <td>
        <button class="btn btn-secondary decrease" data-index="${index}">-</button>
        <span class="mx-2">${quantity}</span>
        <button class="btn btn-secondary increase" data-index="${index}">+</button>
      </td>
      <td>₦${itemTotal.toFixed(2)}</td>
      <td><button class="btn btn-danger delete" data-index="${index}">Delete</button></td>
    `;
    cartContainer.appendChild(row);
  });

  totalDisplay.textContent = total.toFixed(2);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  attachEvents();
}


  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
    }
  }

  function attachEvents() {
    document.querySelectorAll(".increase").forEach(btn => {
      btn.addEventListener("click", e => {
        const i = parseInt(e.target.dataset.index);
        cart[i].quantity = (cart[i].quantity || 1) + 1;
        renderCart();
      });
    });

    document.querySelectorAll(".decrease").forEach(btn => {
      btn.addEventListener("click", e => {
        const i = parseInt(e.target.dataset.index);
        if ((cart[i].quantity || 1) > 1) {
          cart[i].quantity -= 1;
        }
        renderCart();
      });
    });

    document.querySelectorAll(".delete").forEach(btn => {
      btn.addEventListener("click", e => {
        const i = parseInt(e.target.dataset.index);
        cart.splice(i, 1);
        renderCart();
      });
    });
  }

  if (proceedButton) {
    proceedButton.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("🛒 Your cart is empty.");
        return;
      }

      const phoneNumber = "2348060886466"; 
      let message = "Hello! I'd like to place an order:\n\n";
      cart.forEach((item, index) => {
        const quantity = item.quantity || 1;
        message += `${index + 1}. ${item.name} - ₦${item.price.toFixed(2)} x ${quantity} = ₦${(item.price * quantity).toFixed(2)}\n`;
      });
      message += `\nTotal: ₦${totalDisplay.textContent}\n\nMy name is: [Enter your name here]`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    });
  }

  renderCart();
});

// Global function to add product to cart
// Function to add product to cart (renamed from addToCart to handleAddToCart)
function handleAddToCart(name, price, image) {
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

  // Force a page reload to update the cart display
  location.reload();  // This will reload the page and reflect the changes

  // Optionally, alert the user
  // alert(name + " added to cart!");
}

// Make it accessible globally if needed in inline HTML
window.handleAddToCart = handleAddToCart;

// Global remove function if needed
function removeFromCart(name) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.name !== name);
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload(); // Reload to reflect changes
}
window.removeFromCart = removeFromCart;

// Update cart count on page load
window.onload = () => {
  updateCartCount();
};

// Helper for scroll-to-top button
function onscroll(el, listener) {
  el.addEventListener("scroll", listener);
}

// Back to top button
const backtotop = document.querySelector('.back-to-top');
if (backtotop) {
  const toggleBacktotop = () => {
    if (window.scrollY > 100) {
      backtotop.classList.add('active');
    } else {
      backtotop.classList.remove('active');
    }
  };
  window.addEventListener('load', toggleBacktotop);
  onscroll(document, toggleBacktotop);
}

