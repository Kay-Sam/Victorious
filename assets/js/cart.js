// cart.js
function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.name === name);
  
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(name + " has been added to the cart!");
  }
  
  // Expose it globally
  window.addToCart = addToCart;
  