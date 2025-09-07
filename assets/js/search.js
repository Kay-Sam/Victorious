

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const productList = document.getElementById('product-list');
  const products = productList.getElementsByClassName('col-md-4');

  searchInput.addEventListener('keyup', function() {
    const searchText = this.value.toLowerCase();

    for (let i = 0; i < products.length; i++) {
      const productTitle = products[i].querySelector('.product-title').textContent.toLowerCase();
      const productDesc = products[i].querySelector('p').textContent.toLowerCase();

      if (productTitle.includes(searchText) || productDesc.includes(searchText)) {
        products[i].style.display = '';
      } else {
        products[i].style.display = 'none';
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // 🔍 SEARCH FUNCTIONALITY
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("keyup", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const productCards = document.querySelectorAll(".product-title");
    productCards.forEach((title) => {
      const card = title.closest(".card");
      if (title.textContent.toLowerCase().includes(searchTerm)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });

  // 🖼 MODAL IMAGE VIEW
  const modalImage = document.getElementById("modalImage");
  const clickableImages = document.querySelectorAll(".clickable-img");
  clickableImages.forEach((img) => {
    img.addEventListener("click", () => {
      modalImage.src = img.dataset.imgSrc || img.src;
    });
  });
});
