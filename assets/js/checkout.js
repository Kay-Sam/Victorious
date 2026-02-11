// ------------------ CART ------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart badge
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.getElementById("cart-count").textContent = totalItems;
}
updateCartCount();

// ------------------ PROMO ------------------
function calculateLocalPromo(cart) {
  let totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  let promoText = "";
  let discount = 0;

  if (totalQty >= 30) {
    promoText = "20% Festive Promo";
    discount = 0.2;
  } else if (totalQty >= 20) {
    promoText = "15% Festive Promo";
    discount = 0.15;
  }

  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discountedTotal = total - total * discount;

  return { total: discountedTotal, promoText };
}

// ------------------ RENDER CHECKOUT ------------------
function renderCheckout() {
  const container = document.getElementById("checkout-items");
  container.innerHTML = "";

  cart.forEach(item => {
    container.innerHTML += `
      <div class="d-flex justify-content-between mb-2">
        <div>${item.name} (x${item.quantity})</div>
        <div>₦${(item.price * item.quantity).toLocaleString()}</div>
      </div>
    `;
  });

  const { total, promoText } = calculateLocalPromo(cart);
  document.getElementById("checkout-total").textContent = total.toLocaleString();
  document.getElementById("checkout-promo").textContent = promoText ? `🎉 ${promoText}` : "";
}

renderCheckout();

// Helper validation functions
function isValidEmail(email) {
  // Simple regex for email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  // Nigeria numbers only (starts with 0 or +234, 10-13 digits)
  return /^(?:\+234|0)[789][01]\d{8}$/.test(phone);
}

// ------------------ PAYSTACK CHECKOUT ------------------
const payBtn = document.getElementById("pay-btn");
if (payBtn) {
  payBtn.addEventListener("click", async () => {
    const name = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("whatsapp").value.trim();
    const address = document.getElementById("address").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !phone || !address || !email) {
      alert("Fill all delivery details.");
      return;
    }
    if (!isValidEmail(email)) {
  alert("Please enter a valid email address.");
  return;
}

        if (!isValidPhone(phone)) {
        alert("Please enter a valid WhatsApp number.");
        return;
        }
    try {
  // 🔵 Show loading state
  payBtn.disabled = true;
  payBtn.innerHTML = "Connecting to payment... <span class='spinner-border spinner-border-sm'></span>";
      const res = await fetch("https://victoriouschips.onrender.com/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          customer: { name, phone, address, email }
        })
      });

      const data = await res.json();
      if (data.error) return alert(data.error);

      PaystackPop.setup({
        key: data.public_key,
        email: data.email,
        amount: data.amount,
        ref: data.reference,
        callback: function (response) {
          localStorage.removeItem("cart");
          window.location.href =
            `https://victoriouschips.onrender.com/payment-success/${response.reference}/${phone}`;
        }
      }).openIframe();

    } catch (err) {
      console.error(err);
      alert("Payment service unavailable. Try again.");
            // 🔴 Restore button
    payBtn.disabled = false;
    payBtn.innerHTML = "Pay Online";
    }
  });
}

// ------------------ WHATSAPP CHECKOUT ------------------
const waBtn = document.getElementById("whatsapp-btn");
if (waBtn) {
  waBtn.addEventListener("click", () => {
    const name = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("whatsapp").value.trim();
    const address = document.getElementById("address").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !phone || !address || !email) {
      alert("Please fill all delivery details.");
      return;
    }

    let message = `Hello! I want to place an order.\n\n`;
    message += `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}\n\nOrder:\n`;

    cart.forEach(item => {
      message += `- ${item.name} (x${item.quantity}) - ₦${(item.price * item.quantity).toLocaleString()}\n`;
    });

    const { total } = calculateLocalPromo(cart);
    message += `\nTotal: ₦${total.toLocaleString()}`;

    window.open(
      `https://wa.me/2348060886466?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  });
}
