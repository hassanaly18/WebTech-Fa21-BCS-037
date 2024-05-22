// script.js
document.addEventListener("DOMContentLoaded", function () {
    const itemsPerPage = 5; // Maximum number of items per page
    let currentPage = 1; // Current page number
    const items = [
        "Item 1", "Item 2", "Item 3", "Item 4", "Item 5",
        "Item 6", "Item 7", "Item 8", "Item 9", "Item 10",
        "Item 11", "Item 12", "Item 13", "Item 14", "Item 15"
    ];

    // Function to render items for the current page
    function renderItems(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = items.slice(start, end);

        const container = document.getElementById("content-container");
        container.innerHTML = "";
        paginatedItems.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.className = "item";
            itemElement.textContent = item;
            container.appendChild(itemElement);
        });
    }

    // Function to render pagination controls
    function renderPagination() {
        const totalPages = Math.ceil(items.length / itemsPerPage);
        const paginationContainer = document.getElementById("pagination");
        paginationContainer.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.className = "pagination-button";
            button.textContent = i;
            button.addEventListener("click", () => {
                currentPage = i;
                update();
            });
            if (i === currentPage) {
                button.classList.add("active");
            }
            paginationContainer.appendChild(button);
        }
    }

    // Function to update the page content and pagination controls
    function update() {
        renderItems(currentPage);
        renderPagination();
    }

    // Initial call to update the content and pagination controls
    update();
});
