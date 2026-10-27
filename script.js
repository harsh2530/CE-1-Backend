
const products = [
    {id:1, name:"Headphones", cat:"Electronics", price:1499, emoji:"🎧"},
    {id:2, name:"Smart Watch", cat:"Electronics", price:2499, emoji:"⌚"},
    {id:3, name:"Running Shoes", cat:"Fashion", price:1799, emoji:"👟"},
    {id:4, name:"Backpack", cat:"Fashion", price:899, emoji:"🎒"},
    {id:5, name:"Desk Lamp", cat:"Home", price:699, emoji:"💡"},
    {id:6, name:"Coffee Maker", cat:"Home", price:2199, emoji:"☕"}
];

let cart = [], coupon = false;
const $ = id => document.getElementById(id);

function showProducts() {
    let list = products.filter(p =>
        p.name.toLowerCase().includes($("search").value.toLowerCase()) &&
        ($("category").value === "All" || p.cat === $("category").value)
    );

    if ($("sort").value === "low") list.sort((a,b) => a.price-b.price);
    if ($("sort").value === "high") list.sort((a,b) => b.price-a.price);

    $("products").innerHTML = list.length ? list.map(p => `
        <div class="card">
            <div class="emoji">${p.emoji}</div>
            <h3>${p.name}</h3><small>${p.cat}</small>
            <p>₹${p.price}</p>
            <button onclick="add(${p.id})">+ Add to Cart</button>
        </div>`).join("") : "No products found.";
}

function add(id) {
    let item = cart.find(p => p.id === id);
    if (item) item.qty++;
    else cart.push({id, qty:1});
    showCart();
}

function change(id, n) {
    let item = cart.find(p => p.id === id);
    item.qty += n;
    if (item.qty <= 0) cart = cart.filter(p => p.id !== id);
    showCart();
}

function removeItem(id) {
    cart = cart.filter(p => p.id !== id);
    showCart();
}

function showCart() {
    $("count").textContent = cart.reduce((s,p) => s+p.qty, 0);

    $("items").innerHTML = cart.length ? cart.map(item => {
        let p = products.find(x => x.id === item.id);
        return `<div class="cart-item"><div><b>${p.name}</b><br>
        ₹${p.price*item.qty}<br>
        <button onclick="change(${p.id},-1)">−</button>
        ${item.qty}
        <button onclick="change(${p.id},1)">+</button></div>
        <button onclick="removeItem(${p.id})">Remove</button></div>`;
    }).join("") : "Your cart is empty.";

    if (!cart.length) coupon = false;

    let sub = cart.reduce((s,i) =>
        s + products.find(p => p.id === i.id).price*i.qty, 0);
    let discount = coupon ? sub*0.10 : 0;
    let delivery = sub === 0 || sub >= 1000 ? 0 : 50;

    $("subtotal").textContent = "₹"+sub.toFixed(2);
    $("discount").textContent = "₹"+discount.toFixed(2);
    $("delivery").textContent = delivery ? "₹"+delivery : "FREE";
    $("total").textContent = "₹"+(sub-discount+delivery).toFixed(2);
}

$("apply").onclick = () => {
    if (!cart.length) $("message").textContent = "Add products first!";
    else if ($("code").value.trim().toUpperCase() === "SAVE10") {
        coupon = true;
        $("message").textContent = "10% discount applied!";
    } else {
        coupon = false;
        $("message").textContent = "Invalid coupon!";
    }
    showCart();
};

$("checkout").onclick = () => {
    if (!cart.length) return alert("Your cart is empty!");

    $("summary").innerHTML = `
        <p>Subtotal <b>${$("subtotal").textContent}</b></p>
        <p>Discount <b>${$("discount").textContent}</b></p>
        <p>Delivery <b>${$("delivery").textContent}</b></p>
        <hr><p>Total <b>${$("total").textContent}</b></p>`;

    $("modal").style.display = "flex";
};

$("close").onclick = () => $("modal").style.display = "none";

$("place").onclick = () => {
    if (!$("customer").value.trim() || !$("address").value.trim())
        return alert("Please enter your name and address!");

    alert("Demo order placed successfully!");
    cart = [];
    coupon = false;
    $("code").value = "";
    $("message").textContent = "";
    $("customer").value = "";
    $("address").value = "";
    $("modal").style.display = "none";
    showCart();
};

$("search").oninput = showProducts;
$("category").onchange = showProducts;
$("sort").onchange = showProducts;

showProducts();
showCart();
