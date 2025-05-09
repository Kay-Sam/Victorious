document.addEventListener("DOMContentLoaded", function () {
        let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

        const cartItemsContainer = document.getElementById("cart-items");
        const totalAmountElement = document.getElementById("total-amount");

        function renderCartItems() {
            cartItemsContainer.innerHTML = "";

            let totalAmount = 0;

            cartItems.forEach((item, index) => {
                let quantity = item.quantity || 1;
                let itemTotal = item.price * quantity;
                totalAmount += itemTotal;

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <button class="decrease-btn" data-index="${index}">-</button>
                        <span class="quantity">${quantity}</span>
                        <button class="increase-btn" data-index="${index}">+</button>
                    </td>
                    <td>$${itemTotal.toFixed(2)}</td>
                    <td><button class="delete-btn" data-index="${index}">🗑</button></td>
                `;
                cartItemsContainer.appendChild(row);
            });

            totalAmountElement.textContent = totalAmount.toFixed(2);

            // Add event listeners
            document.querySelectorAll(".increase-btn").forEach(btn => {
                btn.addEventListener("click", function () {
                    const index = parseInt(this.dataset.index);
                    cartItems[index].quantity = (cartItems[index].quantity || 1) + 1;
                    localStorage.setItem("cart", JSON.stringify(cartItems));
                    renderCartItems();
                });
            });

            document.querySelectorAll(".decrease-btn").forEach(btn => {
                btn.addEventListener("click", function () {
                    const index = parseInt(this.dataset.index);
                    cartItems[index].quantity = Math.max(1, (cartItems[index].quantity || 1) - 1);
                    localStorage.setItem("cart", JSON.stringify(cartItems));
                    renderCartItems();
                });
            });

            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", function () {
                    const index = parseInt(this.dataset.index);
                    cartItems.splice(index, 1);
                    localStorage.setItem("cart", JSON.stringify(cartItems));
                    renderCartItems();
                });
            });
        }

        renderCartItems();

        const proceedBtn = document.getElementById("proceed-btn");
        if (proceedBtn) {
            proceedBtn.addEventListener("click", function () {
                if (cartItems.length === 0) {
                    alert("Your cart is empty. Please add items before proceeding.");
                } else {
                    window.location.href = '/payment'; // Replace with actual payment URL
                }
            });
        }
   

    
    // Function to generate WhatsApp order message
    function generateWhatsAppMessage(cartItems) {
        let message = "Order Details:\n\n";
        let totalAmount = 0;

        cartItems.forEach((item) => {
            const quantity = item.quantity || 1;
            const itemTotal = item.price * quantity;
            totalAmount += itemTotal;

            message += `${item.name} - ${quantity} x $${item.price.toFixed(2)} = $${itemTotal.toFixed(2)}\n`;
        });

        message += `\nTotal: $${totalAmount.toFixed(2)}\n\nPlease proceed with payment.`;
        return message;
    }
 });


