// ---------- PAGE MEMORY & LOGIN STATE ----------
function setPage(page){
localStorage.setItem("activePage", page);
}

function setLoginState(isLoggedIn){
localStorage.setItem("isLoggedIn", isLoggedIn);
}
// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function(){
console.log("Page loaded - showing home page first");
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
console.log("isLoggedIn:", isLoggedIn);

// Always show home page first - login button will be shown/hidden based on login state
showHomePage();
showCartNav();
});

function showLoginPage(){
let container = document.getElementById("authContainer");
let nav = document.getElementById("mainNav");
let hero = document.getElementById("mainHero");
let dropdown = document.getElementById("dropdownMenu");

if(container) container.style.display = "block";
if(nav) nav.style.display = "none";
if(hero) hero.style.display = "none";
if(dropdown) dropdown.style.display = "none";
}

function showHomePage(){
let container = document.getElementById("authContainer");
let nav = document.getElementById("mainNav");
let hero = document.getElementById("mainHero");
let dropdown = document.getElementById("dropdownMenu");
let heroLoginBtn = document.getElementById("heroLoginBtn");
let navLoginBtn = document.getElementById("navLoginBtn");
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

if(container) container.style.display = "none";
if(nav) nav.style.display = "flex";
if(hero) hero.style.display = "block";

// Show/hide login button based on login state - hero section
if(heroLoginBtn){
heroLoginBtn.style.display = isLoggedIn ? "none" : "inline-block";
}

// Update nav bar button - only show "Log out" when logged in
if(navLoginBtn){
if(isLoggedIn){
navLoginBtn.textContent = "Log out";
navLoginBtn.style.display = "inline-block";
} else {
navLoginBtn.style.display = "none";
}
}

// Show dropdown when logged in
if(dropdown){
dropdown.style.display = "none"; // Keep hidden by default, show on logo click
}
}

// ---------- SWITCH ----------
function showLogin(){
document.getElementById("signupBox").classList.add("hidden");
document.getElementById("loginBox").classList.remove("hidden");
setPage("login");
}

function showSignup(){
document.getElementById("loginBox").classList.add("hidden");
document.getElementById("signupBox").classList.remove("hidden");
setPage("signup");
}

// ---------- SIGNUP ----------
function signup(){
let username = document.getElementById("username").value.trim();
let email = document.getElementById("email").value.trim();
let password = document.getElementById("password").value;
let confirm = document.getElementById("confirmPassword").value;
let signupMsg = document.getElementById("signupMsg");

console.log("SIGNUP ATTEMPT - Username:", username, "Email:", email);

// Validation
if(!username || !email || !password || !confirm){
signupMsg.innerHTML = "Please fill all fields!";
console.log("ERROR: Missing fields");
return;
}

if(password !== confirm){
signupMsg.innerHTML = "Passwords do not match!";
console.log("ERROR: Passwords don't match");
return;
}

// Get existing users
let users = JSON.parse(localStorage.getItem("users")) || [];
console.log("CURRENT USERS:", users);

// Check if user already exists
if(users.find(u => u.username === username || u.email === email)){
signupMsg.innerHTML = "Username or Email already exists!";
console.log("ERROR: User already exists");
return;
}

// Add new user
users.push({username: username, email: email, password: password});
localStorage.setItem("users", JSON.stringify(users));
console.log("USER SAVED! New user list:", users);

// Clear form
document.getElementById("username").value = "";
document.getElementById("email").value = "";
document.getElementById("password").value = "";
document.getElementById("confirmPassword").value = "";

signupMsg.innerHTML = "Account created! Redirecting to login...";

// Redirect after 1.5 seconds
setTimeout(() => {
console.log("Redirecting to login");
showLogin();
}, 1500);
}

// ---------- LOGIN ----------
function login(){
let userInput = document.getElementById("loginUser").value.trim();
let passInput = document.getElementById("loginPass").value;
let loginMsg = document.getElementById("loginMsg");

console.log("LOGIN ATTEMPT - User:", userInput, "Pass:", passInput);

if(!userInput || !passInput){
loginMsg.innerHTML = "Please fill all fields!";
console.log("ERROR: Missing fields");
return;
}

let users = JSON.parse(localStorage.getItem("users")) || [];
console.log("USERS IN STORAGE:", users);

let user = users.find(u => {
let usernameMatch = u.username === userInput;
let emailMatch = u.email === userInput;
let passwordMatch = u.password === passInput;
console.log("Checking user:", u.username, "username match:", usernameMatch, "email match:", emailMatch, "password match:", passwordMatch);
return (usernameMatch || emailMatch) && passwordMatch;
});

console.log("USER FOUND:", user);

if(user){
console.log("LOGIN SUCCESS! Setting login state...");
setLoginState("true");
setPage("home");
console.log("About to show home page");
showHomePage();
console.log("Home page shown");
loginMsg.innerHTML = "";
// Clear inputs
document.getElementById("loginUser").value = "";
document.getElementById("loginPass").value = "";
}else{
console.log("LOGIN FAILED - Invalid credentials");
loginMsg.innerHTML = "Invalid username/email or password!";
}
}

// ---------- LOGOUT ----------
function logout(){
setLoginState("false");
setPage("home");
showHomePage();
}

// ---------- SHOW LOGIN FROM HERO ----------
function showLoginFromHero(){
showLoginPage();
showLogin();
}

// ---------- HANDLE NAV LOGIN BUTTON ----------
function handleNavLoginBtn(){
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

if(isLoggedIn){
	// User is logged in - logout
	logout();
} else {
	// User is not logged in - show login page
	showLoginPage();
	showLogin();
}
}

// ---------- DROPDOWN ----------
function toggleMenu(event){
if(event) event.stopPropagation();

let menu = document.getElementById("dropdownMenu");
let logo = document.querySelector(".logo");

if(!menu) return;

// Get current computed display value
let currentDisplay = window.getComputedStyle(menu).display;

// Toggle the dropdown
if(currentDisplay === "none" || menu.style.display === "none" || menu.style.display === ""){
    // Show the dropdown - position it below the logo
    if(logo){
        menu.style.display = "block";
        menu.style.position = "absolute";
        
        // Get positions
        let logoRect = logo.getBoundingClientRect();
        let nav = document.getElementById("mainNav");
        let navRect = nav ? nav.getBoundingClientRect() : {left: 0, top: 0};
        
        // Position below the logo, aligned with left edge
        menu.style.left = (logoRect.left - navRect.left) + "px";
        menu.style.top = (logoRect.bottom - navRect.top + 5) + "px";
        menu.style.right = "auto";
    }
} else {
    // Hide the dropdown
    menu.style.display = "none";
}
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event){
let menu = document.getElementById("dropdownMenu");
let logo = document.querySelector(".logo");

if(menu && logo){
    // Check if click was outside both the menu and logo
    if(!menu.contains(event.target) && !logo.contains(event.target)){
        menu.style.display = "none";
    }
}
});

// ---------- ORDER MODAL ----------
function openOrderModal(){
	// Check if user is logged in before allowing to order
	let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
	if(!isLoggedIn){
		showToast('Please login to order products');
		showLoginPage();
		showLogin();
		return;
	}
	
	let modal = document.getElementById('orderModal');
	if(!modal) return;
	modal.classList.remove('hidden');
	document.body.style.overflow = 'hidden';
}

function closeOrderModal(){
	let modal = document.getElementById('orderModal');
	if(!modal) return;
	modal.classList.add('hidden');
	document.body.style.overflow = '';
}

// Close modal on Escape
document.addEventListener('keydown', function(e){
	if(e.key === 'Escape'){
		let modal = document.getElementById('orderModal');
		if(modal && !modal.classList.contains('hidden')) closeOrderModal();
		let contactModal = document.getElementById('contactModal');
		if(contactModal && !contactModal.classList.contains('hidden')) closeContactModal();
	}
});

// ---------- CONTACT MODAL ----------
function openContactModal(e){
	if(e) e.preventDefault();
	let modal = document.getElementById('contactModal');
	if(!modal) return;
	modal.classList.remove('hidden');
	document.body.style.overflow = 'hidden';
}

function closeContactModal(){
	let modal = document.getElementById('contactModal');
	if(!modal) return;
	modal.classList.add('hidden');
	document.body.style.overflow = '';
}

// ---------- ABOUT MODAL ----------
function openAboutModal(e){
	if(e) e.preventDefault();
	let modal = document.getElementById('aboutModal');
	if(!modal) return;
	modal.classList.remove('hidden');
	document.body.style.overflow = 'hidden';
}

function closeAboutModal(){
	let modal = document.getElementById('aboutModal');
	if(!modal) return;
	modal.classList.add('hidden');
	document.body.style.overflow = '';
}

// Close modal on Escape
document.addEventListener('keydown', function(e){
	if(e.key === 'Escape'){
		let modal = document.getElementById('orderModal');
		if(modal && !modal.classList.contains('hidden')) closeOrderModal();
		let contactModal = document.getElementById('contactModal');
		if(contactModal && !contactModal.classList.contains('hidden')) closeContactModal();
		let aboutModal = document.getElementById('aboutModal');
		if(aboutModal && !aboutModal.classList.contains('hidden')) closeAboutModal();
	}
});

// ---------- CART / TOAST ----------
// Product prices in Philippine Pesos (PHP)
const PRODUCT_PRICES = {
	'Blueberry bomb': 27.00,
	'Strawberry rush': 26.00,
	'Uberload': 28.00,
	'Pink lemon': 19.00,
	'Nanabites': 23.00,
	'mangGo': 29.00
};

function addToCart(itemName){
	if(!itemName) return;
	
	// Get the price for this specific product
	let itemPrice = PRODUCT_PRICES[itemName] || 0;
	
	let cart = JSON.parse(localStorage.getItem('cart')) || [];
	let existing = cart.find(i => i.name === itemName);
	if(existing){
		existing.qty = (existing.qty || 1) + 1;
	} else {
		cart.push({ name: itemName, qty: 1, price: itemPrice });
	}
	localStorage.setItem('cart', JSON.stringify(cart));
	showToast('Added to Cart Successfully');
	showCartNav();
}

function showToast(message, duration = 1800){
	let toast = document.getElementById('toast');
	if(!toast) return alert(message);
	toast.textContent = message;
	toast.classList.remove('hidden');
	toast.classList.add('visible');
	setTimeout(()=>{
		toast.classList.remove('visible');
		toast.classList.add('hidden');
	}, duration);
}

// Show/hide cart nav button based on cart contents OR successful order
function showCartNav(){
	let cart = JSON.parse(localStorage.getItem('cart')) || [];
	let hasOrdered = localStorage.getItem('hasOrdered') === 'true';
	let cartNavItem = document.getElementById('cartNavItem');
	if(cartNavItem){
		// Show Cart if there are items in Cart OR user has successfully ordered before
		if(cart.length > 0 || hasOrdered){
			cartNavItem.classList.remove('hidden');
		} else {
			cartNavItem.classList.add('hidden');
		}
	}
}

function openCartModal(e){
	if(e) e.preventDefault();
	let cart = JSON.parse(localStorage.getItem('cart')) || [];
	let cartItemsDiv = document.getElementById('cartItems');
	
	if(!cartItemsDiv) return;
	
	if(cart.length === 0){
		cartItemsDiv.innerHTML = '<p style="text-align: center; color: #999; padding: 30px; font-size: 1.05rem;">Your cart is empty</p>';
		document.getElementById('checkoutBtn').disabled = true;
		document.getElementById('grandTotal').textContent = '₱0.00';
	} else {
		let html = '';
		let total = 0;
		cart.forEach((item, index) => {
			let itemTotal = (item.price || 0) * (item.qty || 1);
			total += itemTotal;
			html += `
				<div class="cart-item">
					<div class="cart-item-name-qty">${item.name} <span class="qty-symbol">×${item.qty}</span></div>
					<div class="cart-item-right">
						<div class="cart-item-price">₱${itemTotal.toFixed(2)}</div>
						<button class="cancel-btn" onclick="removeFromCart(${index})" title="Cancel">Cancel</button>
					</div>
				</div>
			`;
		});
		cartItemsDiv.innerHTML = html;
		document.getElementById('grandTotal').textContent = '₱' + total.toFixed(2);
		document.getElementById('checkoutBtn').disabled = false;
		// Store total for checkout
		localStorage.setItem('orderTotal', total.toFixed(2));
	}
	
	let modal = document.getElementById('cartModal');
	if(modal) {
		modal.classList.remove('hidden');
		document.body.style.overflow = 'hidden';
	}
}

function closeCartModal(){
	let modal = document.getElementById('cartModal');
	if(modal) {
		modal.classList.add('hidden');
		document.body.style.overflow = '';
	}
}

// Remove item from cart
function removeFromCart(index){
	let cart = JSON.parse(localStorage.getItem('cart')) || [];
	if(index >= 0 && index < cart.length){
		let removedItem = cart[index];
		cart.splice(index, 1);
		localStorage.setItem('cart', JSON.stringify(cart));
		showToast('Removed: ' + removedItem.name);
		showCartNav();
		// Re-render the cart modal
		openCartModal();
	}
}

function proceedToCheckout(){
	closeCartModal();
	let checkoutModal = document.getElementById('checkoutModal');
	if(checkoutModal) {
		checkoutModal.classList.remove('hidden');
		document.body.style.overflow = 'hidden';
	}
}

function closeCheckoutModal(){
	let modal = document.getElementById('checkoutModal');
	if(modal) {
		modal.classList.add('hidden');
		document.body.style.overflow = '';
	}
}

function submitOrder(e){
	e.preventDefault();
	
	let name = document.getElementById('customerName').value.trim();
	let address = document.getElementById('customerAddress').value.trim();
	let phone = document.getElementById('customerPhone').value.trim();
	
	// Validate all fields
	if(!name || !address || !phone){
		showToast('Please fill in all fields');
		return;
	}
	
	// Generate random Order ID between 1001-9999
	let orderId = '#' + (Math.floor(Math.random() * 8999) + 1001);
	
	// Store order info
	let orderInfo = {
		id: orderId,
		name: name,
		address: address,
		phone: phone,
		date: new Date().toLocaleString(),
		items: JSON.parse(localStorage.getItem('cart')) || [],
		total: localStorage.getItem('orderTotal') || '0.00'
	};
	
	// Save to localStorage
	let orders = JSON.parse(localStorage.getItem('orders')) || [];
	orders.push(orderInfo);
	localStorage.setItem('orders', JSON.stringify(orders));
	
	// Set flag to show cart in navigation after successful order
	localStorage.setItem('hasOrdered', 'true');
	
	// Show success screen
	closeCheckoutModal();
	showSuccessScreen(orderId);
	
	// Clear cart but keep the hasOrdered flag
	localStorage.removeItem('cart');
	localStorage.removeItem('orderTotal');
	showCartNav();
}

function showSuccessScreen(orderId){
	document.getElementById('generatedOrderId').textContent = orderId;
	let successModal = document.getElementById('successModal');
	if(successModal) {
		successModal.classList.remove('hidden');
		document.body.style.overflow = 'hidden';
	}
}

function backToHome(){
	let successModal = document.getElementById('successModal');
	if(successModal) {
		successModal.classList.add('hidden');
		document.body.style.overflow = '';
	}
	// Clear any open forms
	document.getElementById('checkoutForm').reset();
}