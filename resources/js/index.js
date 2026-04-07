// typewriter effect header intro
function typeEffect(elementId, text, speed = 40) {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.textContent = ""; // clear previous text
    let i = 0;

    // Create blinking cursor
    const cursor = document.createElement("span");
    cursor.classList.add("cursor");
    el.appendChild(cursor);

    function typing() {
        if (i < text.length) {
            cursor.insertAdjacentText("beforebegin", text.charAt(i));
            i++;
            setTimeout(typing, speed);
        }
    }

    typing();
}

// scrolling for section navigation
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 20,
            behavior: 'smooth'
        });
    }
}

// DOM
document.addEventListener("DOMContentLoaded", () => {

    // set year in footer
    const yearSpan = document.getElementById("footeryear");
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;

    const container = document.querySelector(".certificates-wrapper");
    const toggleBtn = document.getElementById("toggleViewBtn");
    const scrollContent = document.querySelector(".scroll-content");

    if (scrollContent) {
        // Clone cards for infinite effect
        const clones = scrollContent.innerHTML;
        scrollContent.innerHTML += clones;

        // Mark cloned children
        const cards = scrollContent.children;
        for (let i = cards.length / 2; i < cards.length; i++) {
            cards[i].classList.add("clone");
        }
    }

    // typewriter header intro
    typeEffect("typewriter", "Hey there👋 I'm Jansen", 50);

    // Toggle grid / carousel view
    if (toggleBtn && container) {
        toggleBtn.addEventListener("click", () => {
            container.classList.toggle("grid");

            if (container.classList.contains("grid")) {
                toggleBtn.innerHTML = "<i class='fas fa-border-all'></i> Grid View";
            } else {
                toggleBtn.innerHTML = "<i class='fas fa-bars'></i> Carousel View";
            }
        });
    }

    const projectCards = document.querySelectorAll(".project-preview-card");
    const projectModal = document.getElementById("projectModal");

    if (projectCards.length && projectModal) {
        const modalTitle = document.getElementById("modalProjectTitle");
        const modalDescription = document.getElementById("modalProjectDescription");
        const modalTech = document.getElementById("modalProjectTech");
        const modalLinks = document.getElementById("modalProjectLinks");
        const modalImage = document.getElementById("modalProjectImage");
        const carouselCounter = document.getElementById("carouselCounter");
        const carouselPrev = document.getElementById("carouselPrev");
        const carouselNext = document.getElementById("carouselNext");
        const closeButtons = projectModal.querySelectorAll("[data-close-modal]");

        let galleryImages = [];
        let activeIndex = 0;

        const updateCarousel = () => {
            if (!galleryImages.length) return;
            modalImage.src = galleryImages[activeIndex];
            carouselCounter.textContent = `${activeIndex + 1} / ${galleryImages.length}`;
        };

        const openModal = (card) => {
            const {
                title = "",
                description = "",
                tech = "",
                repo = "",
                demo = "",
                gallery = ""
            } = card.dataset;

            const fallbackImage = card.querySelector(".project-image")?.src || "";

            galleryImages = gallery
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

            if (!galleryImages.length && fallbackImage) {
                galleryImages = [fallbackImage];
            }

            activeIndex = 0;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalTech.innerHTML = "";

            tech
                .split("|")
                .map((item) => item.trim())
                .filter(Boolean)
                .forEach((item) => {
                    const li = document.createElement("li");
                    li.textContent = item;
                    modalTech.appendChild(li);
                });

            modalLinks.innerHTML = "";

            if (repo) {
                modalLinks.insertAdjacentHTML(
                    "beforeend",
                    `<a class="bouncy-button primary link-button" href="${repo}" target="_blank" rel="noopener noreferrer" aria-label="Open project repository"><span class="shadow" aria-hidden="true"></span><span class="edge" aria-hidden="true"></span><span class="front"><i class="fab fa-github" aria-hidden="true"></i> Repository</span></a>`
                );
            }

            if (demo) {
                modalLinks.insertAdjacentHTML(
                    "beforeend",
                    `<a class="bouncy-button primary link-button" href="${demo}" target="_blank" rel="noopener noreferrer" aria-label="Open project live demo"><span class="shadow" aria-hidden="true"></span><span class="edge" aria-hidden="true"></span><span class="front"><i class="fa-solid fa-laptop-code" aria-hidden="true"></i> Live Demo</span></a>`
                );
            }

            if (!repo && !demo) {
                modalLinks.innerHTML = "<span class='project-modal-empty-link'>Links not available.</span>";
            }

            updateCarousel();
            projectModal.classList.add("show");
            projectModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
        };

        const closeModal = () => {
            projectModal.classList.remove("show");
            projectModal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");
        };

        projectCards.forEach((card) => {
            const trigger = card.querySelector(".project-open");
            if (!trigger) return;
            trigger.addEventListener("click", () => openModal(card));
        });

        if (carouselPrev) {
            carouselPrev.addEventListener("click", () => {
                if (!galleryImages.length) return;
                activeIndex = (activeIndex - 1 + galleryImages.length) % galleryImages.length;
                updateCarousel();
            });
        }

        if (carouselNext) {
            carouselNext.addEventListener("click", () => {
                if (!galleryImages.length) return;
                activeIndex = (activeIndex + 1) % galleryImages.length;
                updateCarousel();
            });
        }

        closeButtons.forEach((button) => {
            button.addEventListener("click", closeModal);
        });

        document.addEventListener("keydown", (event) => {
            if (!projectModal.classList.contains("show")) return;

            if (event.key === "Escape") {
                closeModal();
            }

            if (event.key === "ArrowLeft" && carouselPrev) {
                carouselPrev.click();
            }

            if (event.key === "ArrowRight" && carouselNext) {
                carouselNext.click();
            }
        });
    }
});


// randomly assign floating animations on different buttons
const buttons = document.querySelectorAll('.button-container .bouncy-button');
const animations = ['float1', 'float2', 'float3', 'float4', 'float5', 'float6'];

buttons.forEach(button => {
    // random animation
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    // Assign the animation as an inline style
    button.style.animation = `${randomAnimation} 3.5s ease-in-out infinite`;
});

// spam button that changes color
const spamButton = document.querySelector('.spam-button');
const spamEdge = document.querySelector('.edge.spam-button');
const spamFront = document.querySelector('.front.spam-button');

let colors = ['#3498db', '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#FF33D4']; // Lighter variants for front
let edgeColors = ['#00437A', '#DD4522', '#22DD46', '#2246DD', '#DD2290', '#9022DD', '#DD22C3']; // Darker variants for edges

let currentColorIndex = 0;
if (spamButton && spamFront && spamEdge) {
    spamButton.addEventListener('click', () => {
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        spamFront.style.backgroundColor = colors[currentColorIndex];
        spamEdge.style.backgroundColor = edgeColors[currentColorIndex];
        spamFront.style.color = '#fff';
        console.log(`Spam button color changed to ${colors[currentColorIndex]}`);
    });
}

// Initialize the spam button colors on page load
window.addEventListener('DOMContentLoaded', () => {
    if (spamFront && spamEdge) {
        // Set initial colors for the spam button
        spamFront.style.backgroundColor = colors[0]; // Using the first color in your array
        spamEdge.style.backgroundColor = edgeColors[0]; // Using the first edge color
        spamFront.style.color = '#fff';
    }
});

// ==========================================
// Journey Timeline Functionality
// ==========================================

// Scroll reveal animation for timeline items
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all timeline year groups
const timelineYearGroups = document.querySelectorAll('.timeline-year-group');
timelineYearGroups.forEach(group => {
    timelineObserver.observe(group);
});
