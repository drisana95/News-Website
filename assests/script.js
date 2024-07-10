const API_KEY ="72ce62ef957e454b901591146f149a85";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => {
    displayUserInfo(null); // Initialize with no user logged in
    fetchNews("India");
});

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

const subscribeButton = document.getElementById("subscribe-button");
const subscribeEmail = document.getElementById("subscribe-email");

subscribeButton.addEventListener("click", () => {
    const email = subscribeEmail.value;
    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    // Handle subscription logic here (e.g., send email to server, show confirmation message)
    alert(`Subscribing email: ${email}`);
    subscribeEmail.value = ""; // Clear the input field after subscription
});

function isValidEmail(email) {
    // Simple email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");

// Temporary storage for user data
const users = {};

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const signupName = document.querySelector("#signup-name").value;
    const signupEmail = document.querySelector("#signup-email").value;
    const signupPassword = document.querySelector("#signup-password").value;
    
    if (!signupName || !signupEmail || !signupPassword) {
        alert("Please fill in all fields.");
        return;
    }
    
    try {
        // Store user data in the users object
        const user = {
            name: signupName,
            email: signupEmail,
            password: signupPassword
        };

        // Store user data in the users object
        users[signupEmail] = user;
        
        console.log("User created:", user);
        alert("Account created successfully! Please log in.");
        
        // Clear form fields
        signupForm.reset();
        
    } catch (error) {
        console.error("Error creating account:", error.message);
        alert("Failed to create account. Please try again.");
    }
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const loginEmail = document.querySelector("#login-email").value;
    const loginPassword = document.querySelector("#login-password").value;
    
    if (!loginEmail || !loginPassword) {
        alert("Please fill in all fields.");
        return;
    }
    
    try {
        // Fetch user from the users object
        const user = users[loginEmail];
        
        if (user && user.password === loginPassword) {
            console.log("User logged in:", user);
            alert("Login successful!");
            
            // Clear form fields
            loginForm.reset();
            
            // Display user name in navigation bar
            displayUserName(user.name);
        } else {
            alert("Invalid email or password.");
        }
        
    } catch (error) {
        console.error("Error logging in:", error.message);
        alert("Failed to log in. Please check your credentials and try again.");
    }
});

function displayUserName(name) {
    const userInfo = document.getElementById("user-info");
    userInfo.innerHTML = `<span>Welcome, ${name}</span>`;
}

function reload() {
    window.location.reload();
}
