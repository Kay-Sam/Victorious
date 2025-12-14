document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const productCards = document.querySelectorAll(".col-md-4"); // each product card
  let notFoundMessage;
  let timeoutId;

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    let found = false;

    productCards.forEach((card) => {
      const category = card.dataset.category
        ? card.dataset.category.toLowerCase().replace(/-/g, ' ')
        : "";

      if (category.includes(searchTerm)) {
        card.style.display = "block";
        found = true;
      } else {
        card.style.display = "none";
      }
    });

    // NO PRODUCTS FOUND MESSAGE
    const container = document.querySelector(".container .row");

    if (!found) {
      if (!notFoundMessage) {
        notFoundMessage = document.createElement("div");
        notFoundMessage.id = "search-not-found";
        notFoundMessage.className = "alert alert-warning text-center mt-3 w-100";
        notFoundMessage.innerHTML = `<h5>No products found</h5>`;
        container.parentNode.insertBefore(notFoundMessage, container.nextSibling);

        // Remove message after 3 seconds
        timeoutId = setTimeout(() => {
          if (notFoundMessage) {
            notFoundMessage.remove();
            notFoundMessage = null;
          }
        }, 3000);
      }
    } else {
      // If products are found, remove message immediately
      if (notFoundMessage) {
        clearTimeout(timeoutId);
        notFoundMessage.remove();
        notFoundMessage = null;
      }
    }
  });
});
