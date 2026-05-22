// ======================
// CART
// ======================
let cart = {};
let currentModalProduct = null;

const cartBtn = document.getElementById("cart-btn");
const cartBox = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const clearBtn = document.querySelector(".clear-cart-btn");
const checkoutBtn = document.querySelector(".checkout-btn");

// cart
cartBtn.addEventListener("click", () => {
    cartBox.classList.toggle("show");
});

// clear cart
clearBtn.addEventListener("click", () => {
    cart = {};
    updateCart();
});

// оплата
checkoutBtn.addEventListener("click", () => {
    if (Object.keys(cart).length === 0) {
        alert("Cart is empty!");
        return;
    }

    const total = Object.values(cart).reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    alert(`Payment for goods in the amount of: €${total}`);
});

// ======================
// ADD / REMOVE CART
// ======================
function addToCart(button) {
    const product = button.closest(".product");
    const name = product.dataset.name;
    const price = Number(product.dataset.price);

    addByNameAndPrice(name, price);
}

function addByNameAndPrice(name, price) {
    if (!cart[name]) {
        cart[name] = {
            price: price,
            qty: 0
        };
    }

    cart[name].qty++;
    updateCart();
}

function removeOne(name) {
    if (!cart[name]) return;
    cart[name].qty--;
    if (cart[name].qty <= 0) {delete cart[name];}
    updateCart();
}

// ======================
// UPDATE CART
// ======================
function updateCart() {
    cartItems.innerHTML = "";

    let totalQty = 0;
    let totalSum = 0;

    for (let name in cart) {
        const item = cart[name];

        totalQty += item.qty;
        totalSum += item.price * item.qty;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            ${name} (${item.qty}) - €${item.price * item.qty}
            <span class="remove">×</span>
        `;

        cartItem.querySelector(".remove").addEventListener("click", () => removeOne(name));
        cartItems.appendChild(cartItem);
    }

    document.querySelector(".total").innerText = `Total: €${totalSum}`;

    document.getElementById("cart-count").innerText = totalQty;
}

// ======================
// PRODUCTS
// ======================
function renderProducts(list) {
    const container = document.getElementById("main-products");
    container.innerHTML = "";

    list.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product");

        card.dataset.name = product.name;
        card.dataset.brand = product.brand;
        card.dataset.category = product.category;
        card.dataset.price = product.price;

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>€${product.price}</p>
            <button class="buy">Buy</button>
        `;

        // open modal on card click
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("buy")) return;
            openProductModal(product);
        });

        // button Buy
        card.querySelector(".buy").addEventListener("click", () => {addByNameAndPrice(product.name,product.price);
            });

        container.appendChild(card);
    });
}

// ======================
// FILTERS
// ======================
let currentCategory = "all";
let currentBrand = "all";
let currentLaptopBrand = "all";
let searchQuery = "";

function selectCategory(category, btn) {
    currentCategory = category;
    currentBrand = "all";
    currentLaptopBrand = "all";

    // active category
    btn.parentElement
        .querySelectorAll("button")
        .forEach(button =>
            button.classList.remove("active")
        );

    btn.classList.add("active");

    // phone brands
    const brandMenu =document.getElementById("brand-menu");

    if (brandMenu) {brandMenu.style.display =
            category === "phones"
                ? "flex"
                : "none";

        brandMenu.querySelectorAll("button")
            .forEach(button =>
                button.classList.remove("active")
            );
        const firstBtn =
            brandMenu.querySelector("button");
        if (firstBtn) {firstBtn.classList.add("active");}
    }
    // laptop brands
    const laptopMenu = document.getElementById("laptop-brand-menu");
    if (laptopMenu) {laptopMenu.style.display =
        category === "laptops"
                ? "flex"
                : "none";
        laptopMenu.querySelectorAll("button").forEach(button =>button.classList.remove("active"));
        const firstLaptopBtn = laptopMenu.querySelector("button");
        if (firstLaptopBtn) {firstLaptopBtn.classList.add("active");}
    }
    applyFilters();
}

function selectBrand(brand, btn) {
    currentBrand = brand;
    btn.parentElement.querySelectorAll("button").forEach(button =>button.classList.remove("active"));
    btn.classList.add("active");
    applyFilters();
}

function selectLaptopBrand(brand, btn) {
    currentLaptopBrand = brand;
    btn.parentElement.querySelectorAll("button").forEach(button => button.classList.remove("active"));
    btn.classList.add("active");
    applyFilters();
}
// ======================
// SEARCH
// ======================
function handleSearch() {
    searchQuery =
        document.getElementById("search-input").value.toLowerCase();
        applyFilters();
}
// ======================
// APPLY FILTERS
// ======================
function applyFilters() {
    let filtered = products;
    // category
    if (currentCategory !== "all") {
        filtered = filtered.filter(product => product.category === currentCategory);
    }
    // phone brands
    if (
        currentCategory === "phones" &&
        currentBrand !== "all"
    ) {
        filtered = filtered.filter(product => product.brand === currentBrand);
    }
    // laptop brands
    if (
        currentCategory === "laptops" &&
        currentLaptopBrand !== "all"
    ) {
        filtered = filtered.filter(product =>product.brand ===  currentLaptopBrand);
    }
    // search
    if (searchQuery) {
        filtered = filtered.filter(product =>product.name.toLowerCase().includes(searchQuery));
    }

    renderProducts(filtered);
}
// ======================
// MODAL
// ======================
function openProductModal(product) {
    currentModalProduct = product;
    document.getElementById("modal-title").innerText = product.name;
    document.getElementById("modal-price").innerText = `€${product.price}`;
    document.getElementById("modal-description").innerText = `High-quality ${product.category} from ${product.brand}.`;
    const modalImg = document.getElementById("modal-img");

    if (product.image) {
        modalImg.src = product.image;
        modalImg.style.display = "block";
    } else {
        modalImg.style.display = "none";
    }

    document.getElementById("product-modal").style.display = "flex";
}
function closeProductModal() {
    document.getElementById(
        "product-modal"
    ).style.display = "none";

    currentModalProduct = null;
}
// ======================
// ADD PRODUCT MODAL
// ======================
function openAddProductModal() {
    const userModal = document.getElementById("add-product-modal");

    if (userModal) {userModal.style.display = "flex";
    }
}

function closeAddProductModal() {
    const userModal = document.getElementById("add-product-modal");
    if (userModal) {userModal.style.display = "none";
        document.getElementById("user-product-form")
            ?.reset();
    }
}

// ======================
// INIT
// ======================
document.addEventListener(
    "DOMContentLoaded",
    () => {
        // кнопка Add to Cart в модалке
        const modalBuyBtn = document.getElementById(
                "modal-buy-btn"
            );

        if (modalBuyBtn) {
            modalBuyBtn.addEventListener("click",() => {
                    if (currentModalProduct) {
                        addByNameAndPrice(currentModalProduct.name, currentModalProduct.price);
                    }
                }
            );
        }
        // первый рендер
        applyFilters();
    }
);
// закрытие модалки по фону
window.addEventListener("click",(event) => {
        const modal = document.getElementById("product-modal");
        if (event.target === modal){closeProductModal();}}
);;
