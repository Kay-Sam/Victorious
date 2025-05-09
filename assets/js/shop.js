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



window.addEventListener('scroll', function () {
  const header = document.getElementById('header');
  if (window.scrollY > 100) {
    header.classList.add('fixed');
  } else {
    header.classList.remove('fixed');
  }
});
window.addEventListener('scroll', function () {
    const floatBtn = document.querySelector('.floating');
    const aboutSection = document.querySelector('.container');
  
    const aboutTop = aboutSection.offsetTop;
  
    if (window.scrollY >= aboutTop - 50) {
      floatBtn.classList.add('show');
    } else {
      floatBtn.classList.remove('show');
    }
  });