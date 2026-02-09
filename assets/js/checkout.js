// assets/js/checkout.js

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart badge
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.getElementById("cart-count").textContent = totalItems;
}
updateCartCount();

// Promo calculation
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

// Render checkout items
function renderCheckout() {
  let container = document.getElementById("checkout-items");
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
  document.getElementById("checkout-promo").textContent = promoText;
}

renderCheckout();

// Paystack online payment
document.getElementById("pay-online-btn").addEventListener("click", async () => {
  const payBtn = document.getElementById("pay-online-btn");
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

    const data = await res.json();
    if (data.error) throw new Error(data.error);

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

// WhatsApp checkout
document.getElementById("whatsapp-btn").addEventListener("click", () => {
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
    message += `- ${item.name} (x${item.quantity}) - ₦${item.price * item.quantity}\n`;
  });

  const { total } = calculateLocalPromo(cart);
  message += `\nTotal: ₦${total.toLocaleString()}`;

  const waLink = `https://wa.me/2348060886466?text=${encodeURIComponent(message)}`;
  window.open(waLink, "_blank");
});
