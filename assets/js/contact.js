document.getElementById("form-submit").addEventListener("click", function() {
    // Get all input values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const quantity = document.getElementById("quantity").value.trim();
    const deliveryDate = document.getElementById("delivery-date").value.trim();
    const type = document.getElementById("type").value.trim();
    const location = document.getElementById("location").value.trim();
    const message = document.getElementById("message").value.trim();

    // Simple validation
    if(!name || !phone || !quantity || !deliveryDate || !type || !location){
        alert("Please fill all required fields!");
        return;
    }

    // WhatsApp number (replace with your number)
    const whatsappNumber = "2348060886466";

    // Prepare the message
    let text = `Hello! I'd like to place an order:\n\n`;
    text += `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n`;
    text += `Product: ${type}\nQuantity: ${quantity}\nDelivery Date: ${deliveryDate}\n`;
    text += `Location: ${location}\nMessage: ${message}`;

    // Encode message
    const encodedMessage = encodeURIComponent(text);

    // Open WhatsApp
    const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(url, "_blank");
});
