// assets/js/checkout.js

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ------------------ UPDATE CART BADGE ------------------
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = totalItems;
}
updateCartCount();

// ------------------ PROMO CALCULATION ------------------
function calculateLocalPromo(cart) {
  let totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  let promoText = "";
  let discount = 0;

  if (totalQty >= 30) {
    promoText = "🎉 15% Special Offer Sale";
    discount = 0.15;
  }

  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discountedTotal = total - total * discount;

  return { total: discountedTotal, promoText };
}

// ------------------ RENDER CHECKOUT ------------------
function renderCheckout() {
  const container = document.getElementById("checkout-items");
  if (!container) return;

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
  const totalElem = document.getElementById("checkout-total");
  const promoElem = document.getElementById("checkout-promo");
  if (totalElem) totalElem.textContent = total.toLocaleString();
  if (promoElem) promoElem.textContent = promoText;
}
renderCheckout();

// ------------------ PAYSTACK ONLINE PAYMENT ------------------
const payBtn = document.getElementById("pay-online-btn");
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

    payBtn.innerHTML = "Connecting to payment...";
    payBtn.disabled = true;

    try {
      const res = await fetch("/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, customer: { name, phone, address, email } })
      });

      // Read response text first
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("Server did not return valid JSON. Response: " + text);
      }

      if (data.error) throw new Error(data.error);

      // Paystack setup
      if (typeof PaystackPop === "undefined") throw new Error("Paystack not loaded");

      PaystackPop.setup({
        key: data.public_key,
        email: data.email,
        amount: data.amount,
        ref: data.reference,
        callback: function(response) {
          localStorage.removeItem("cart");
          window.location.href = `/payment-success/${response.reference}/${phone}`;
        },
        onClose: function() {
          payBtn.innerHTML = "Pay Online <i class='bi bi-shield-check ms-2'></i>";
          payBtn.disabled = false;
        }
      }).openIframe();

    } catch (err) {
      console.error(err);
      alert(err.message || "Payment service unavailable. Try again.");
      payBtn.innerHTML = "Pay Online <i class='bi bi-shield-check ms-2'></i>";
      payBtn.disabled = false;
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
    message += `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}\n\n`;
    message += `Order:\n`;

    cart.forEach(item => {
      message += `- ${item.name} (x${item.quantity}) - ₦${(item.price * item.quantity).toLocaleString()}\n`;
    });

    const { total } = calculateLocalPromo(cart);
    message += `\nTotal: ₦${total.toLocaleString()}`;

    const waLink = `https://wa.me/2348060886466?text=${encodeURIComponent(message)}`;
    window.open(waLink, "_blank");
  });
}
