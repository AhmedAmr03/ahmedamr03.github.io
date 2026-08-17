// Ahmed Amr Portfolio - Vanilla JS Script

document.addEventListener("DOMContentLoaded", () => {
    initNavbarScroll();
    initMobileMenu();
    generateFloatingDots();
    initContactForm();
    initLightbox();
});

/**
 * Adds sticky glassmorphism styling to navbar when page is scrolled
 */
function initNavbarScroll() {
    const header = document.getElementById("navbar-header");
    if (!header) return;

    let isScrolled = false;
    let ticking = false;

    const updateNavbar = () => {
        const shouldBeScrolled = window.scrollY > 50;
        if (shouldBeScrolled !== isScrolled) {
            isScrolled = shouldBeScrolled;
            if (isScrolled) {
                header.classList.remove("bg-transparent", "py-5");
                header.classList.add("glass-strong", "py-3");
            } else {
                header.classList.remove("glass-strong", "py-3");
                header.classList.add("bg-transparent", "py-5");
            }
        }
        ticking = false;
    };

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });

    // Initial check in case page starts scrolled
    updateNavbar();
}

/**
 * Controls opening and closing of mobile navigation menu
 */
function initMobileMenu() {
    const menuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    if (!menuBtn || !mobileMenu) return;

    const menuIconOpen = document.getElementById("menu-icon-open");
    const menuIconClose = document.getElementById("menu-icon-close");

    menuBtn.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.contains("hidden");

        if (isOpen) {
            mobileMenu.classList.remove("hidden");
            mobileMenu.classList.add("flex");
            menuIconOpen.classList.add("hidden");
            menuIconClose.classList.remove("hidden");
        } else {
            mobileMenu.classList.add("hidden");
            mobileMenu.classList.remove("flex");
            menuIconOpen.classList.remove("hidden");
            menuIconClose.classList.add("hidden");
        }
    });

    // Close menu when clicking link
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.add("hidden");
            mobileMenu.classList.remove("flex");
            menuIconOpen.classList.remove("hidden");
            menuIconClose.classList.add("hidden");
        });
    });
}

/**
 * Dynamically generates background floating green dots inside Hero section
 */
function generateFloatingDots() {
    const container = document.getElementById("green-dots-container");
    if (!container) return;

    const numberOfDots = 30;
    for (let i = 0; i < numberOfDots; i++) {
        const dot = document.createElement("div");
        dot.className = "absolute rounded-full opacity-60 pointer-events-none";

        // Styling matching Hero.jsx
        dot.style.width = "6px";
        dot.style.height = "6px";
        dot.style.backgroundColor = "#20B2A6";
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = `${Math.random() * 100}%`;

        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * 5;

        dot.style.animation = `slowDrift ${duration}s ease-in-out infinite`;
        dot.style.animationDelay = `${delay}s`;

        container.appendChild(dot);
    }
}

/**
 * Handles contact form validation and submission via Vercel Serverless Function (with local dev fallback)
 */
function initContactForm() {
    const form = document.getElementById("contact-form");
    const statusDiv = document.getElementById("submit-status");
    const statusText = document.getElementById("status-text");
    const statusIconSuccess = document.getElementById("status-icon-success");
    const statusIconError = document.getElementById("status-icon-error");
    const submitBtn = document.getElementById("submit-btn");
    const btnText = document.getElementById("submit-btn-text");
    const btnLoader = document.getElementById("submit-btn-loader");

    if (!form || !statusDiv) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Get Form Data
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        // Reset Status
        statusDiv.classList.add("hidden");
        statusDiv.classList.remove("bg-green-500/10", "border-green-500/20", "text-green-400", "bg-red-500/10", "border-red-500/20", "text-red-400");
        statusIconSuccess.classList.add("hidden");
        statusIconError.classList.add("hidden");

        // Loading State
        submitBtn.disabled = true;
        btnText.classList.add("hidden");
        btnLoader.classList.remove("hidden");

        try {
            // Local fallback if opened directly in browser via file:// protocol
            if (window.location.protocol === 'file:') {
                console.log("Running locally via file:// protocol. Simulating email submission.");
                await new Promise(resolve => setTimeout(resolve, 1500));

                statusDiv.classList.remove("hidden");
                statusDiv.classList.add("bg-green-500/10", "border-green-500/20", "text-green-400");
                statusIconSuccess.classList.remove("hidden");
                statusText.textContent = "Demo Submit: Message sent successfully! (Deploy to Vercel and configure env variables to receive real emails).";

                form.reset();
                return;
            }

            // Real submission via Vercel Serverless Function
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                statusDiv.classList.remove("hidden");
                statusDiv.classList.add("bg-green-500/10", "border-green-500/20", "text-green-400");
                statusIconSuccess.classList.remove("hidden");
                statusText.textContent = "Message sent successfully! I'll get back to you soon.";
                form.reset();
            } else {
                throw new Error(result.error || "Failed to send message.");
            }
        } catch (error) {
            console.error("Form submit error:", error);
            statusDiv.classList.remove("hidden");
            statusDiv.classList.add("bg-red-500/10", "border-red-500/20", "text-red-400");
            statusIconError.classList.remove("hidden");
            statusText.textContent = error.message || "Failed to send message. Please check Vercel environment variables.";
        } finally {
            // Revert Button State
            submitBtn.disabled = false;
            btnText.classList.remove("hidden");
            btnLoader.classList.add("hidden");
        }
    });
}

/**
 * Initializes lightbox functionality for images in certificates and awards sections
 */
function initLightbox() {
    const lightbox = document.getElementById("image-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    if (!lightbox || !lightboxImg) return;

    // Select all certificate and award images
    const images = document.querySelectorAll(".cert-slide img, #awards img");

    images.forEach(img => {
        // Add cursor pointer indicating it is clickable
        img.classList.add("cursor-pointer");

        img.addEventListener("click", () => {
            // Do not click if the image is hidden (e.g. onerror triggered and fell back to text)
            if (img.style.display === "none") return;

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || "Enlarged view";

            lightbox.classList.remove("hidden");
            // Trigger animation transition
            setTimeout(() => {
                lightbox.classList.remove("opacity-0");
                lightboxImg.classList.remove("scale-95");
                lightboxImg.classList.add("scale-100");
            }, 20);
        });
    });

    const closeLightbox = () => {
        lightbox.classList.add("opacity-0");
        lightboxImg.classList.remove("scale-100");
        lightboxImg.classList.add("scale-95");
        setTimeout(() => {
            lightbox.classList.add("hidden");
            lightboxImg.src = "";
        }, 300);
    };

    // Close on click of container or button
    lightbox.addEventListener("click", (e) => {
        if (e.target !== lightboxImg) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !lightbox.classList.contains("hidden")) {
            closeLightbox();
        }
    });
}
