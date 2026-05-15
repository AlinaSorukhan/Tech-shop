// ==== ДАННЫЕ ТОВАРОВ ====



// ==== CART ====
let cart = {};
let currentModalProduct = null; // Хранит активный товар в модальном окне
const cartBtn = document.getElementById("cart-btn");
const cartBox = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const clearBtn = document.querySelector(".clear-cart-btn");
const checkoutBtn = document.querySelector(".checkout-btn");

// Показ/скрытие корзины
cartBtn.onclick = () => cartBox.classList.toggle("show");

// Очистка корзины
clearBtn.onclick = () => { cart = {}; updateCart(); }

// Оплата
checkoutBtn.onclick = () => {
    if (Object.keys(cart).length === 0) { alert("Cart is empty!"); return; }
    let total = Object.values(cart).reduce((sum, item) => sum + item.price*item.qty, 0);
    alert("Payment for goods in the amount of: €" + total);
}

function selectLaptopBrand(brand, element) {
    document.querySelectorAll('#laptop-brand-menu button')
        .forEach(btn => btn.classList.remove('active'));

    element.classList.add('active');
    console.log("Selected laptop brand:", brand);
} 

// Добавление в корзину через кнопку на карточке
function addToCart(button){
    const product = button.closest('.product'); 
    const name = product.dataset.name;
    const price = Number(product.dataset.price);

    addByNameAndPrice(name, price);
}

// Универсальная функция добавления по имени и цене
function addByNameAndPrice(name, price) {
    if(!cart[name]) cart[name] = { price: price, qty: 0 };
    cart[name].qty++;
    updateCart();
}

// Привязка кнопки модального окна к добавлению в корзину
document.getElementById("modal-buy-btn").onclick = () => {
    if (currentModalProduct) {
        addByNameAndPrice(currentModalProduct.name, currentModalProduct.price);
    }
};

// Удаление из корзины
function removeOne(name){
    if(cart[name]){
        cart[name].qty--;
        if(cart[name].qty<=0) delete cart[name];
    }
    updateCart();
}

// Обновление корзины
function updateCart(){
    cartItems.innerHTML='';
    let totalQty=0, totalSum=0;
    for(let name in cart){
        const item = cart[name];
        totalQty+=item.qty;
        totalSum+=item.price*item.qty;
        cartItems.innerHTML += `
            <div class="cart-item">
                ${name} (${item.qty}) - €${item.price*item.qty}
                <span class="remove" onclick="removeOne('${name}')">x</span>
            </div>`;
    }
    document.querySelector(".total").innerText = "Total: €" + totalSum;
    document.getElementById("cart-count").innerText = totalQty;
}

// ==== RENDER PRODUCTS ====
function renderProducts(list){
    const container = document.getElementById('main-products');
    container.innerHTML='';
    list.forEach(p=>{
        const div = document.createElement('div');
        div.classList.add('product');
        div.dataset.name=p.name;
        div.dataset.brand=p.brand;
        div.dataset.category=p.category;
        div.dataset.price=p.price;
        div.innerHTML=`
          <img src="${p.image}" alt="${p.name}" />
          <h3>${p.name}</h3>
          <p>€${p.price}</p>
          <button class="buy">Buy</button>
        `;
        
        // Клик по всей карточке открывает модальное окно
        div.onclick = (e) => {
            // Если кликнули на саму кнопку "Buy", модалку открывать не нужно
            if (e.target.classList.contains('buy')) return;
            openProductModal(p);
        };
        
        container.appendChild(div);
    });
    document.querySelectorAll('.buy').forEach(b=>b.addEventListener('click', ()=>addToCart(b)));
}

// ==== FILTERS ====
let currentCategory = 'all';
let currentBrand = 'all';
let currentLaptopBrand = 'all'; // Добавлена переменная для бренда ноутбуков

function selectCategory(category, btn){
    currentCategory = category;
    currentBrand = 'all';
    currentLaptopBrand = 'all'; // Сбрасываем бренд ноутбуков
    
    // Переключение активности в меню категорий
    btn.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Управление меню брендов СМАРТФОНОВ
    const brandMenu = document.getElementById("brand-menu");
    if (brandMenu) {
        brandMenu.style.display = category === 'phones' ? 'flex' : 'none';
        brandMenu.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        const firstBrandBtn = brandMenu.querySelector("button");
        if (firstBrandBtn) firstBrandBtn.classList.add("active");
    }

    // Управление меню брендов НОУТБУКОВ
    const laptopMenu = document.getElementById("laptop-brand-menu");
    if (laptopMenu) {
        laptopMenu.style.display = category === 'laptops' ? 'flex' : 'none';
        laptopMenu.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        const firstLaptopBtn = laptopMenu.querySelector("button");
        if (firstLaptopBtn) firstLaptopBtn.classList.add("active");
    }

    applyFilters();
}

function selectBrand(brand, btn){
    currentBrand = brand;
    btn.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilters();
}

function selectLaptopBrand(brand, btn) {
    currentLaptopBrand = brand;
    btn.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilters();
} 

function applyFilters(){
    let filtered = products;
    
    // 1. Фильтр по категории
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    // 2. Фильтр по брендам телефонов
    if (currentCategory === 'phones' && currentBrand !== 'all') {
        filtered = filtered.filter(p => p.brand === currentBrand);
    }
    
    // 3. Фильтр по брендам ноутбуков
    if (currentCategory === 'laptops' && currentLaptopBrand !== 'all') {
        filtered = filtered.filter(p => p.brand === currentLaptopBrand);
    }
    
    renderProducts(filtered);
}

// ==== MODAL CONTROL ====
function openProductModal(product) {
    currentModalProduct = product; 
    
    document.getElementById('modal-title').innerText = product.name;
    document.getElementById('modal-price').innerText = `€${product.price}`;
    document.getElementById('modal-description').innerText = `High-quality ${product.category} from ${product.brand}.`;
    
    const modalImg = document.getElementById('modal-img');
    if (product.image) {
        modalImg.src = product.image;
        modalImg.style.display = 'block';
    } else {
        modalImg.style.display = 'none';
    }
    
    document.getElementById('product-modal').style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
    currentModalProduct = null;
}

// Безопасное назначение клика на кнопку модального окна после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
    const modalBuyBtn = document.getElementById("modal-buy-btn");
    if (modalBuyBtn) {
        modalBuyBtn.onclick = () => {
            if (currentModalProduct) {
                addByNameAndPrice(currentModalProduct.name, currentModalProduct.price);
            }
        };
    }
    
    // Запуск фильтров при старте страницы
    applyFilters();
});

// Закрытие при клике на область вокруг карточки или крестик
window.onclick = function(event) {
    const modal = document.getElementById('product-modal');
    if (event.target === modal) {
        closeProductModal();
    }
};
let searchQuery = '';

function handleSearch() {
    searchQuery = document.getElementById('search-input').value.toLowerCase();
    applyFilters(); // Перезапускаем фильтрацию с учетом поиска
}

// Теперь обновите вашу существующую функцию applyFilters() в script.js, добавив туда строку поиска:
function applyFilters(){
    let filtered = products;
    
    if (currentCategory !== 'all') filtered = filtered.filter(p => p.category === currentCategory);
    if (currentCategory === 'phones' && currentBrand !== 'all') filtered = filtered.filter(p => p.brand === currentBrand);
    if (currentCategory === 'laptops' && currentLaptopBrand !== 'all') filtered = filtered.filter(p => p.brand === currentLaptopBrand);
    
    // НОВАЯ СТРОКА: фильтр по поисковому запросу
    if (searchQuery) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery));
    }
    
    renderProducts(filtered);
}
// Функция открытия модального окна добавления товара
function openAddProductModal() {
    const userModal = document.getElementById('add-product-modal');
    if (userModal) {
        userModal.style.display = 'flex';
    } else {
        console.error("Error: Element with ID 'add-product-modal' was not found in HTML!");
    }
}

// Функция закрытия модального окна
function closeAddProductModal() {
    const userModal = document.getElementById('add-product-modal');
    if (userModal) {
        userModal.style.display = 'none';
        document.getElementById('user-product-form').reset();
    }
}


// Инициализация отображения при загрузке
applyFilters();
