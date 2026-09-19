/* =========================================
   OLABIS RESTAURANT
   COMPLETE JAVASCRIPT
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


function showImage(index) {

    if (!galleryItems.length || !lightboxImage) {
        return;
    }

    currentImage =
        (index + galleryItems.length) % galleryItems.length;

    lightboxImage.src =
        galleryItems[currentImage].src;
}


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


function closeLightbox() {

    if (!lightbox) {
        return;
    }

    lightbox.classList.remove("show");

    document.body.style.overflow = "";
}


if (lightboxClose) {

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );

}


if (lightbox) {

    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });

}


if (lightboxPrev) {

    lightboxPrev.addEventListener("click", (event) => {

        event.stopPropagation();

        showImage(currentImage - 1);

    });

}


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

    if (
        !lightbox ||
        !lightbox.classList.contains("show")
    ) {
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

        touchStartX =
            event.changedTouches[0].screenX;

    });


    lightbox.addEventListener("touchend", (event) => {

        touchEndX =
            event.changedTouches[0].screenX;

        handleSwipe();

    });

}


function handleSwipe() {

    const swipeDistance =
        touchEndX - touchStartX;

    if (Math.abs(swipeDistance) < 50) {
        return;
    }

    if (swipeDistance < 0) {

        showImage(currentImage + 1);

    } else {

        showImage(currentImage - 1);

    }

}


/* =========================================
   ACTIVE NAVIGATION
========================================= */

const navLinks =
    document.querySelectorAll(".navbar nav a");

const sections =
    document.querySelectorAll("section[id]");


function updateActiveNav() {

    let currentSection = "home";

    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop - 180;

        if (window.scrollY >= sectionTop) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach((link) => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveNav
);

updateActiveNav();


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(
        ".menu-card, .about-image, .about-content, .gallery-item, .hours-card, .contact-card"
    );


revealElements.forEach((element) => {

    element.classList.add("reveal");

});


const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    revealObserver.unobserve(
                        entry.target
                    );

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
   ORDER BUILDER
========================================= */


/* =========================================
   FOOD
========================================= */

const foodSelect =
    document.getElementById("foodSelect");

const foodQuantity =
    document.getElementById("foodQuantity");

const addFoodBtn =
    document.getElementById("addFoodBtn");


/* =========================================
   PROTEIN
========================================= */

const proteinSelect =
    document.getElementById("proteinSelect");

const proteinQuantity =
    document.getElementById("proteinQuantity");

const addProteinBtn =
    document.getElementById("addProteinBtn");


/* =========================================
   SOUP
========================================= */

const soupSelect =
    document.getElementById("soupSelect");

const soupQuantity =
    document.getElementById("soupQuantity");

const addSoupBtn =
    document.getElementById("addSoupBtn");


/* =========================================
   CART
========================================= */

const orderItems =
    document.getElementById("orderItems");

const orderTotal =
    document.getElementById("orderTotal");


/* =========================================
   CUSTOMER DETAILS
========================================= */

const customerName =
    document.getElementById("customerName");

const customerNote =
    document.getElementById("customerNote");


/* =========================================
   WHATSAPP
========================================= */

const whatsappOrderBtn =
    document.getElementById("whatsappOrderBtn");


/* =========================================
   ORDER CART
========================================= */

let orderCart = [];


/* =========================================
   COMPULSORY TAKEAWAY PACK
========================================= */

const takeawayPackPrice = 200;


/* =========================================
   ADD FOOD
========================================= */

if (addFoodBtn) {

    addFoodBtn.addEventListener("click", () => {

        if (!foodSelect) {
            return;
        }

        const selectedOption =
            foodSelect.options[
                foodSelect.selectedIndex
            ];

        const name =
            selectedOption.value;

        const price =
            Number(selectedOption.dataset.price);

        const quantity =
            Math.max(
                1,
                Number(foodQuantity?.value) || 1
            );

        addToCart(
            name,
            price,
            quantity,
            "food"
        );

    });

}


/* =========================================
   ADD PROTEIN
========================================= */

if (addProteinBtn) {

    addProteinBtn.addEventListener("click", () => {

        if (!proteinSelect) {
            return;
        }

        const selectedOption =
            proteinSelect.options[
                proteinSelect.selectedIndex
            ];

        const name =
            selectedOption.value;

        const price =
            Number(selectedOption.dataset.price);

        const quantity =
            Math.max(
                1,
                Number(proteinQuantity?.value) || 1
            );

        addToCart(
            name,
            price,
            quantity,
            "protein"
        );

    });

}


/* =========================================
   ADD SOUP
========================================= */

if (addSoupBtn) {

    addSoupBtn.addEventListener("click", () => {

        if (!soupSelect) {
            return;
        }

        const selectedOption =
            soupSelect.options[
                soupSelect.selectedIndex
            ];

        const name =
            selectedOption.value;

        const price =
            Number(selectedOption.dataset.price);

        const quantity =
            Math.max(
                1,
                Number(soupQuantity?.value) || 1
            );

        addToCart(
            name,
            price,
            quantity,
            "soup"
        );

    });

}


/* =========================================
   ADD TO CART
========================================= */

function addToCart(
    name,
    price,
    quantity,
    type
) {

    const existingItem =
        orderCart.find(
            item => item.name === name
        );


    if (existingItem) {

        existingItem.quantity += quantity;

    } else {

        orderCart.push({
            name,
            price,
            quantity,
            type
        });

    }


    renderCart();

}


/* =========================================
   RENDER CART
========================================= */

function renderCart() {

    if (!orderItems || !orderTotal) {
        return;
    }


    orderItems.innerHTML = "";


    let total = takeawayPackPrice;


    /* EMPTY CART */

    if (orderCart.length === 0) {

        orderItems.innerHTML = `
            <p class="empty-order">
                Your order is empty.
            </p>
        `;

    }


    /* ORDER ITEMS */

    orderCart.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;


        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item";


        const priceDisplay =
            item.price === 0
                ? "FREE"
                : `₦${itemTotal.toLocaleString()}`;


        const quantityDisplay =
            item.price === 0
                ? `${item.quantity} × FREE`
                : `${item.quantity} × ₦${item.price.toLocaleString()}`;


        cartItem.innerHTML = `

            <div class="cart-item-info">

                <strong>
                    ${item.name}
                </strong>

                <span>
                    ${quantityDisplay}
                </span>

            </div>


            <div class="cart-item-right">

                <strong>
                    ${priceDisplay}
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


        orderItems.appendChild(
            cartItem
        );

    });


    /* TAKEAWAY PACK */

    const takeawayItem =
        document.createElement("div");

    takeawayItem.className =
        "cart-item compulsory-item";


    takeawayItem.innerHTML = `

        <div class="cart-item-info">

            <strong>
                Takeaway Pack
            </strong>

            <span>
                Compulsory
            </span>

        </div>


        <div class="cart-item-right">

            <strong>
                ₦${takeawayPackPrice.toLocaleString()}
            </strong>

        </div>

    `;


    orderItems.appendChild(
        takeawayItem
    );


    /* TOTAL */

    orderTotal.textContent =
        `₦${total.toLocaleString()}`;


    /* REMOVE ITEMS */

    document
        .querySelectorAll(".remove-item")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    orderCart.splice(
                        index,
                        1
                    );

                    renderCart();

                }
            );

        });

}


/* =========================================
   INITIAL CART
========================================= */

renderCart();
