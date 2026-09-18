/* =========================================
   OLABIS RESTAURANT
   CLEAN JAVASCRIPT
========================================= */


/* =========================================
   BACK TO TOP
========================================= */

const backToTop = document.getElementById("backToTop");

if (backToTop) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* =========================================
   GALLERY LIGHTBOX
========================================= */

const galleryItems = document.querySelectorAll(".gallery-item img");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let currentImage = 0;


/* Show selected image */

function showImage(index) {

    if (!galleryItems.length || !lightboxImage) {
        return;
    }

    currentImage =
        (index + galleryItems.length) % galleryItems.length;

    lightboxImage.src = galleryItems[currentImage].src;
}


/* Open lightbox */

galleryItems.forEach((image, index) => {

    image.addEventListener("click", () => {

        if (!lightbox) {
            return;
        }

        showImage(index);

        lightbox.classList.add("show");

        document.body.style.overflow = "hidden";
    });

});


/* Close lightbox */

function closeLightbox() {

    if (!lightbox) {
        return;
    }

    lightbox.classList.remove("show");

    document.body.style.overflow = "";
}


/* Close button */

if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
}


/* Close when clicking background */

if (lightbox) {

    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });

}


/* Previous image */

if (lightboxPrev) {

    lightboxPrev.addEventListener("click", (event) => {

        event.stopPropagation();

        showImage(currentImage - 1);

    });

}


/* Next image */

if (lightboxNext) {

    lightboxNext.addEventListener("click", (event) => {

        event.stopPropagation();

        showImage(currentImage + 1);

    });

}


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener("keydown", (event) => {

    if (!lightbox || !lightbox.classList.contains("show")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowLeft") {
        showImage(currentImage - 1);
    }

    if (event.key === "ArrowRight") {
        showImage(currentImage + 1);
    }

});


/* =========================================
   MOBILE LIGHTBOX SWIPE
========================================= */

let touchStartX = 0;
let touchEndX = 0;

if (lightbox) {

    lightbox.addEventListener("touchstart", (event) => {

        touchStartX = event.changedTouches[0].screenX;

    });


    lightbox.addEventListener("touchend", (event) => {

        touchEndX = event.changedTouches[0].screenX;

        handleSwipe();

    });

}


function handleSwipe() {

    const swipeDistance = touchEndX - touchStartX;

    /* Ignore tiny movements */

    if (Math.abs(swipeDistance) < 50) {
        return;
    }


    /* Swipe left = next */

    if (swipeDistance < 0) {
        showImage(currentImage + 1);
    }


    /* Swipe right = previous */

    else {
        showImage(currentImage - 1);
    }

}
/* =========================================
   ACTIVE NAVIGATION
========================================= */

const navLinks = document.querySelectorAll(".navbar nav a");
const sections = document.querySelectorAll("section[id]");

function updateActiveNav() {
    let currentSection = "home";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 180;

        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", updateActiveNav);

updateActiveNav();
/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements = document.querySelectorAll(
    ".menu-card, .about-image, .about-content, .gallery-item, .hours-card, .contact-card"
);

revealElements.forEach((element) => {
    element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});
/* =========================================
   OLABIS MULTI-ITEM ORDER CART
========================================= */

const foodSelect = document.getElementById("foodSelect");
const foodQuantity = document.getElementById("foodQuantity");
const addFoodBtn = document.getElementById("addFoodBtn");

const proteinSelect = document.getElementById("proteinSelect");
const proteinQuantity = document.getElementById("proteinQuantity");
const addProteinBtn = document.getElementById("addProteinBtn");

const orderItems = document.getElementById("orderItems");
const orderTotal = document.getElementById("orderTotal");

let orderCart = [];

/* COMPULSORY TAKEAWAY PACK */
const takeawayPackPrice = 200;


/* =========================================
   ADD FOOD
========================================= */

addFoodBtn.addEventListener("click", () => {

    const name =
        foodSelect.options[foodSelect.selectedIndex].value;

    const price =
        Number(
            foodSelect.options[foodSelect.selectedIndex]
            .dataset.price
        );

    const quantity =
        Math.max(1, Number(foodQuantity.value) || 1);

    addToCart(name, price, quantity, "food");
});


/* =========================================
   ADD PROTEIN
========================================= */

addProteinBtn.addEventListener("click", () => {

    const name =
        proteinSelect.options[proteinSelect.selectedIndex].value;

    const price =
        Number(
            proteinSelect.options[proteinSelect.selectedIndex]
            .dataset.price
        );

    const quantity =
        Math.max(1, Number(proteinQuantity.value) || 1);

    addToCart(name, price, quantity, "protein");
});


/* =========================================
   ADD ITEM TO CART
========================================= */

function addToCart(name, price, quantity, type) {

    const existingItem = orderCart.find(
        item => item.name === name
    );

    if (existingItem) {

        existingItem.quantity += quantity;

    } else {

        orderCart.push({
            name: name,
            price: price,
            quantity: quantity,
            type: type
        });

    }

    renderCart();
}


/* =========================================
   DISPLAY CART
========================================= */

function renderCart() {

    orderItems.innerHTML = "";

    let total = takeawayPackPrice;


    /* EMPTY ORDER MESSAGE */

    if (orderCart.length === 0) {

        orderItems.innerHTML = `
            <p class="empty-order">
                Your order is empty.
            </p>
        `;

    }


    /* DISPLAY FOOD + PROTEIN */

    orderCart.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `
            <div class="cart-item-info">

                <strong>${item.name}</strong>

                <span>
                    ${item.quantity} ×
                    ₦${item.price.toLocaleString()}
                </span>

            </div>

            <div class="cart-item-right">

                <strong>
                    ₦${itemTotal.toLocaleString()}
                </strong>

                <button
                    type="button"
                    class="remove-item"
                    data-index="${index}"
                    aria-label="Remove ${item.name}"
                >
                    ×
                </button>

            </div>
        `;


        orderItems.appendChild(cartItem);

    });


    /* =========================================
       COMPULSORY TAKEAWAY PACK
    ========================================= */

    const takeawayItem =
        document.createElement("div");

    takeawayItem.className =
        "cart-item compulsory-item";


    takeawayItem.innerHTML = `
        <div class="cart-item-info">

            <strong>Takeaway Pack</strong>

            <span>
                Compulsory
            </span>

        </div>

        <div class="cart-item-right">

            <strong>
                ₦200
            </strong>

        </div>
    `;


    orderItems.appendChild(takeawayItem);


    /* =========================================
       TOTAL
    ========================================= */

    orderTotal.textContent =
        `₦${total.toLocaleString()}`;


    /* =========================================
       REMOVE ITEMS
    ========================================= */

    document
        .querySelectorAll(".remove-item")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);

                orderCart.splice(index, 1);

                renderCart();

            });

        });

}


/* =========================================
   INITIAL CART
========================================= */

renderCart();
/* =========================================
   SEND CART TO WHATSAPP
========================================= */

const whatsappOrderBtn =
    document.getElementById("whatsappOrderBtn");

const customerName =
    document.getElementById("customerName");

const customerNote =
    document.getElementById("customerNote");


whatsappOrderBtn.addEventListener("click", () => {

    /* CHECK CART */

    if (orderCart.length === 0) {

        alert("Please add at least one item to your order.");

        return;
    }


    /* CUSTOMER DETAILS */

    const name =
        customerName.value.trim();

    const note =
        customerNote.value.trim();


    /* START MESSAGE */

    let message =
        "Hello OLABIS Restaurant, I'd like to place an order.\n\n";


    /* CUSTOMER NAME */

    if (name) {

        message +=
            `Name: ${name}\n\n`;

    }


    /* ORDER */

    message += "Order:\n";


    let total = 0;


    orderCart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;


        message +=
            `- ${item.quantity} × ${item.name} — ₦${itemTotal.toLocaleString()}\n`;

    });


    /* TAKEAWAY PACK */

    total += takeawayPackPrice;

    message +=
        `- Takeaway Pack — ₦${takeawayPackPrice.toLocaleString()}\n`;


    /* TOTAL */

    message +=
        `\nTotal: ₦${total.toLocaleString()}`;


    /* SPECIAL REQUEST */

    if (note) {

        message +=
            `\n\nSpecial Request: ${note}`;

    }


    message +=
        "\n\nThank you!";


    /* WHATSAPP URL */

    const whatsappURL =
        `https://wa.me/2348033594258?text=${encodeURIComponent(message)}`;


    /* OPEN WHATSAPP */

    window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );

});