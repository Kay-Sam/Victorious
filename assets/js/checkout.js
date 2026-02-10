

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
