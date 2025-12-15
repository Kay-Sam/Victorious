document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const productCards = document.querySelectorAll(".col-md-4");
  let notFoundMessage;
  let timeoutId;

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let found = false;

    productCards.forEach(card => {
      // 🔍 Collect searchable text
      const category = card.dataset.category
        ? card.dataset.category.toLowerCase()
        : "";

      const title = card.querySelector(".product-title")?.innerText.toLowerCase() || "";
      const description = card.querySelector("p")?.innerText.toLowerCase() || "";

      const searchableText = `${title} ${category} ${description}`;

      if (searchableText.includes(searchTerm)) {
        card.style.display = "block";
        found = true;
      } else {
        card.style.display = "none";
      }
    });

    const container = document.querySelector(".container .row");

    // ❌ No product found
    if (!found && searchTerm !== "") {
      if (!notFoundMessage) {
        notFoundMessage = document.createElement("div");
        notFoundMessage.id = "search-not-found";
        notFoundMessage.className =
          "alert alert-warning text-center mt-3 w-100";
        notFoundMessage.innerHTML = `
          <strong>No products found</strong><br>
          Try searching by name or keyword.
        `;

        container.parentNode.insertBefore(
          notFoundMessage,
          container.nextSibling
        );

        timeoutId = setTimeout(() => {
          notFoundMessage?.remove();
          notFoundMessage = null;
        }, 3000);
      }
    } else {
      if (notFoundMessage) {
        clearTimeout(timeoutId);
        notFoundMessage.remove();
        notFoundMessage = null;
      }
    }
  });
});
