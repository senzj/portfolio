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
    
    // Clone cards for infinite effect
    const clones = scrollContent.innerHTML;
    scrollContent.innerHTML += clones;

    // Mark cloned children
    const cards = scrollContent.children;
    for (let i = cards.length / 2; i < cards.length; i++) {
        cards[i].classList.add("clone");
    }

    // typewriter header intro
    typeEffect("typewriter", "Hey there👋 I'm Jansen", 50);

    // Toggle grid / carousel view
    toggleBtn.addEventListener("click", () => {
        container.classList.toggle("grid");

        if (container.classList.contains("grid")) {
        toggleBtn.innerHTML = "<i class='fas fa-border-all'></i> Grid View";
        } else {
        toggleBtn.innerHTML = "<i class='fas fa-bars'></i> Carousel View";
        }
    });
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
spamButton.addEventListener('click', () => {
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    spamFront.style.backgroundColor = colors[currentColorIndex];
    spamEdge.style.backgroundColor = edgeColors[currentColorIndex];
    spamFront.style.color = '#fff';
    console.log(`Spam button color changed to ${colors[currentColorIndex]}`);
});

// Initialize the spam button colors on page load
window.addEventListener('DOMContentLoaded', () => {
    // Set initial colors for the spam button
    spamFront.style.backgroundColor = colors[0]; // Using the first color in your array
    spamEdge.style.backgroundColor = edgeColors[0]; // Using the first edge color
    spamFront.style.color = '#fff';
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
