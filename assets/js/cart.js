document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartContainer = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("total-amount");
  const cartCountElement = document.getElementById("cart-count");
  let promoMessageContainer = document.getElementById("promo-message");
  const proceedButton = document.getElementById("proceed-btn");

  // --------------------- HANDLE ADD TO CART ---------------------
  window.handleAddToCart = function(name, price, image) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }
    saveAndRender();
  };

  // --------------------- PROCEED BUTTON ---------------------
  if (proceedButton) {
    proceedButton.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      window.location.href = "checkout.html"; // Redirect
    });
  }

  // --------------------- RENDER CART ---------------------
  function renderCart() {
    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted py-3">
            Your cart is empty <br><br>          
            <a href="shop.html" class="btn btn-orange">
              <i class="bi bi-cart"></i> Start Shopping
            </a>
          </td>
        </tr>
      `;
      totalDisplay.textContent = "0.00";
      updateCartCount();
      if (promoMessageContainer) promoMessageContainer.style.display = "none";
      return;
    }

    let total = 0;
    let totalQuantity = 0;

    cart.forEach((item, index) => {
      const quantity = item.quantity || 1;
      totalQuantity += quantity;
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
          <button class="btn btn-sm btn-secondary decrease" data-index="${index}">-</button>
          <span class="mx-2">${quantity}</span>
          <button class="btn btn-sm btn-secondary increase" data-index="${index}">+</button>
        </td>
        <td>₦${itemTotal.toFixed(2)}</td>
        <td><button class="btn btn-sm btn-danger delete" data-index="${index}">Delete</button></td>
      `;
      cartContainer.appendChild(row);
    });

    // --------------------- APPLY PROMO ---------------------
    let discount = 0;
    let promoText = "";

    // Promo only applies if quantity >= 20
    if (totalQuantity >= 20) {
      discount = total * 0.15;
      promoText = "🎉 Promo Applied: 15% Off!";
    }

    const finalTotal = total - discount;
    totalDisplay.textContent = finalTotal.toFixed(2);

    // Create promo message container if not exist
    if (!promoMessageContainer) {
      promoMessageContainer = document.createElement("tr");
      promoMessageContainer.id = "promo-message";
      promoMessageContainer.innerHTML = `<td colspan="5" class="text-center text-success"></td>`;
      cartContainer.insertBefore(promoMessageContainer, cartContainer.firstChild);
    }

    promoMessageContainer.querySelector("td").textContent = promoText;
    promoMessageContainer.style.display = promoText ? "table-row" : "none";

    updateCartCount();
    attachEvents();
  }

  // --------------------- UPDATE CART COUNT ---------------------
  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (cartCountElement) cartCountElement.textContent = totalItems;
  }

  // --------------------- BUTTON EVENTS ---------------------
  function attachEvents() {
    document.querySelectorAll(".increase").forEach(btn => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.index);
        cart[i].quantity += 1;
        saveAndRender();
      };
    });

    document.querySelectorAll(".decrease").forEach(btn => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.index);
        if (cart[i].quantity > 1) cart[i].quantity -= 1;
        saveAndRender();
      };
    });

    document.querySelectorAll(".delete").forEach(btn => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.index);
        cart.splice(i, 1);
        saveAndRender();
      };
    });
  }

  // --------------------- SAVE & RENDER ---------------------
  function saveAndRender() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  renderCart();
});
