// index.js

// typewriter effect for hero name
function typeEffect(elementId, text, speed = 55) {
    const el = document.getElementById(elementId);
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = text;
        return;
    }

    el.textContent = "";
    let i = 0;

    const cursor = document.createElement("span");
    cursor.classList.add("cursor");
    cursor.setAttribute("aria-hidden", "true");
    el.appendChild(cursor);
    el.setAttribute("aria-label", text);

    function typing() {
        if (i < text.length) {
            cursor.insertAdjacentText("beforebegin", text.charAt(i));
            i++;
            setTimeout(typing, speed);
        }
    }

    typing();
}

document.addEventListener("DOMContentLoaded", () => {

    // footer year
    const yearSpan = document.getElementById("footeryear");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // hero typewriter
    typeEffect("typewriter", "Jansen Lee", 65);

    // ---------- Theme switcher ----------
    const THEMES = ["light", "dark", "system", "retro", "brutalist"];
    const themeTrigger = document.getElementById("themeTrigger");
    const themeMenu = document.getElementById("themeMenu");
    const themeOptions = document.querySelectorAll(".theme-option");

    const applyTheme = (choice) => {
        if (choice === "system") {
            document.documentElement.removeAttribute("data-theme");
        } else {
            document.documentElement.setAttribute("data-theme", choice);
        }
        themeOptions.forEach((btn) => {
            btn.setAttribute("aria-checked", btn.dataset.themeChoice === choice ? "true" : "false");
        });
        try { localStorage.setItem("jl-theme", choice); } catch (e) {}
    };

    const getStoredTheme = () => {
        try {
            return localStorage.getItem("jl-theme") || "system";
        } catch (e) {
            return "system";
        }
    };

    applyTheme(getStoredTheme());

    if (themeTrigger && themeMenu) {
        const closeMenu = () => {
            themeMenu.classList.remove("open");
            themeTrigger.setAttribute("aria-expanded", "false");
        };
        const toggleMenu = () => {
            const isOpen = themeMenu.classList.toggle("open");
            themeTrigger.setAttribute("aria-expanded", String(isOpen));
        };

        themeTrigger.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        themeOptions.forEach((btn) => {
            btn.addEventListener("click", () => {
                applyTheme(btn.dataset.themeChoice);
                closeMenu();
            });
        });

        document.addEventListener("click", (e) => {
            if (!themeMenu.contains(e.target) && e.target !== themeTrigger) closeMenu();
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeMenu();
        });
    }

    // ---------- Scroll progress bar ----------
    const scrollProgress = document.getElementById("scrollProgress");
    if (scrollProgress) {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = pct + "%";
        };
        window.addEventListener("scroll", updateProgress, { passive: true });
        window.addEventListener("resize", updateProgress);
        updateProgress();
    }

    // ---------- Live local time ----------
    const statusClock = document.getElementById("statusClock");
    if (statusClock) {
        const updateClock = () => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, "0");
            const m = String(now.getMinutes()).padStart(2, "0");
            statusClock.textContent = `${h}:${m}`;
        };
        updateClock();
        setInterval(updateClock, 1000 * 15);
    }

    // ---------- Certification horizontal scroller ----------
    const certScroller = document.getElementById("certScroller");
    const certPrev = document.getElementById("certPrev");
    const certNext = document.getElementById("certNext");
    const certWrap = document.getElementById("certWrap");
    const toggleViewBtn = document.getElementById("toggleViewBtn");

    if (certScroller && certPrev && certNext) {
        const scrollByCard = (direction) => {
            const card = certScroller.querySelector(".cert-card");
            const distance = card ? card.getBoundingClientRect().width + 16 : 260;
            certScroller.scrollBy({ left: direction * distance, behavior: "smooth" });
        };
        certPrev.addEventListener("click", () => scrollByCard(-1));
        certNext.addEventListener("click", () => scrollByCard(1));
    }

    if (toggleViewBtn && certWrap) {
        toggleViewBtn.addEventListener("click", () => {
            const isGrid = certWrap.classList.toggle("grid-mode");
            toggleViewBtn.innerHTML = isGrid
                ? '<i class="fas fa-grip-lines" aria-hidden="true"></i> Carousel view'
                : '<i class="fas fa-border-all" aria-hidden="true"></i> Grid view';
        });
    }

    // ---------- Scroll-reveal ----------
    const revealTargets = document.querySelectorAll("[data-reveal]");
    if (revealTargets.length) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
            revealTargets.forEach((el) => el.classList.add("is-visible"));
        } else {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

            revealTargets.forEach((el) => revealObserver.observe(el));
        }
    }

    // ---------- Project card tilt (pointer-fine devices only) ----------
    const tiltCards = document.querySelectorAll("[data-tilt]");
    const canTilt = window.matchMedia("(pointer: fine)").matches
        && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (canTilt && tiltCards.length) {
        tiltCards.forEach((card) => {
            const strength = 6;
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width - 0.5;
                const py = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `translate(-4px, -4px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(px * strength).toFixed(2)}deg)`;
            });
            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
            });
        });
    }

    // ---------- Interactive terminal ----------
    const consoleBody = document.getElementById("consoleBody");
    const consoleTyped = document.getElementById("consoleTyped");
    const heroConsole = document.getElementById("heroConsole");

    if (consoleBody && consoleTyped) {
        let buffer = "";
        let historyIdx = -1;
        const history = [];
        const consoleGhost = document.getElementById("consoleGhost");
        const consoleHintKey = document.getElementById("consoleHintKey");

        const printLine = (html) => {
            const p = document.createElement("p");
            p.className = "console-out";
            p.innerHTML = html;
            consoleBody.insertBefore(p, consoleBody.querySelector(".console-input-line"));
        };

        const printCommand = (cmd) => {
            const p = document.createElement("p");
            p.innerHTML = `<span class="console-prompt">jansen@portfolio:~$</span> ${cmd}`;
            consoleBody.insertBefore(p, consoleBody.querySelector(".console-input-line"));
        };

        const scrollToBottom = () => { consoleBody.scrollTop = consoleBody.scrollHeight; };

        const COMMANDS = {
            help: () => {
                const rows = [
                    ["whoami", "who you're talking to"],
                    ["about", "short bio"],
                    ["stack", "tech stack"],
                    ["projects", "jump to work"],
                    ["certs", "jump to certifications"],
                    ["experience", "jump to experience"],
                    ["contact", "jump to contact"],
                    ["theme &lt;name&gt;", "light | dark | system | retro | brutalist"],
                    ["neofetch", "system info, dev-style"],
                    ["ls", "list projects"],
                    ["date", "current date &amp; time"],
                    ["resume", "open the CV"],
                    ["joke", "random dev joke"],
                    ["motivation", "random pep talk"],
                    ["brew", "☕ support the site"],
                    ["clear", "clear the screen"],
                    ["help", "show this list"]
                ];
                const grid = rows
                    .map(([cmd, desc]) => `<div><span class="kv-key">${cmd}</span></div><div><span class="kv-val">${desc}</span></div>`)
                    .join("");
                return `available commands:<div class="console-kv">${grid}</div>`;
            },
            whoami: () => "jesus_jansen_lee — full-stack Laravel developer",
            about: () => "Backend-heavy web systems: POS, medical imaging, lab tracking. Laravel, PHP, Flutter.",
            stack: () => "Laravel · PHP · Livewire · MySQL · Flutter · Dart · JavaScript",
            neofetch: () => {
                const rows = [
                    ["OS", "PortfolioOS v2.0"],
                    ["Host", "github.com/senzj"],
                    ["Shell", "fake-bash 1.0"],
                    ["Stack", "Laravel, PHP, Livewire, Flutter"],
                    ["Certs", "09 earned"],
                    ["Projects", "08 shipped"],
                    ["Status", "open to work"]
                ];
                const grid = rows
                    .map(([k, v]) => `<div><span class="kv-key">${k}</span></div><div><span class="kv-val">${v}</span></div>`)
                    .join("");
                return `jansen@portfolio<div class="console-kv">${grid}</div>`;
            },
            ls: () => {
                const dirs = ["MVS/", "PACS/", "LIMS/", "FitGroove/", "CapstoneCompass/", "Trailventure/", "Bleep/", "ExpenseTracker/"];
                return `<div class="console-list">${dirs.join("&nbsp;&nbsp;")}</div>`;
            },
            date: () => new Date().toString(),
            resume: () => {
                window.open("assets/files/LEE_CV.pdf", "_blank");
                return "→ opening resume.pdf…";
            },
            cv: () => COMMANDS.resume(),
            projects: () => {
                document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
                return "→ scrolling to projects…";
            },
            certs: () => {
                document.getElementById("certifications")?.scrollIntoView({ behavior: "smooth" });
                return "→ scrolling to certifications…";
            },
            experience: () => {
                document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
                return "→ scrolling to experience…";
            },
            contact: () => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                return "→ scrolling to contact…";
            },
            joke: () => {
                const jokes = [
                    "there are 10 kinds of people: those who understand binary, and those who don't.",
                    "it's not a bug — it's an undocumented feature.",
                    "why do programmers prefer dark mode? because light attracts bugs.",
                    "99 little bugs in the code, 99 little bugs — take one down, patch it around, 127 little bugs in the code.",
                    "the only true wisdom is in knowing you know nothing.",
                    "why do Java developers wear glasses? because they don't C#.",
                    "a SQL query walks into a bar, walks up to two tables and asks: 'can I join you?'",
                    "there are only two hard things in computer science: cache invalidation and naming things.",
                    "why did the programmer quit his job? because he didn't get arrays.",
                    "i would tell you a UDP joke, but you might not get it.",
                    "why do web developers hate to use Windows? because they can't find the 'start' button.",
                    "why did the developer go broke? because he used up all his cache.",
                    "it's not a bug, it's a feature."
                ];
                return jokes[Math.floor(Math.random() * jokes.length)];
            },
            motivation: () => {
                const motivations = [
                    "believe in yourself and all that you are.",
                    "the only way to do great work is to love what you do.",
                    "don't watch the clock; do what it does. keep going.",
                    "the future belongs to those who believe in the beauty of their dreams.",
                    "success is not final, failure is not fatal: it is the courage to continue that counts.",
                    "even when the day seems dark, the sun will rise again.",
                    "the only limit to our realization of tomorrow will be our doubts of today.",
                    "don't be pushed around by the fears in your mind. be led by the dreams in your heart.",
                    "it does not matter how slowly you go as long as you do not stop.",
                    "the best way to predict the future is to create it.",
                    "your time is limited, so don't waste it living someone else's life."
                ];
                return motivations[Math.floor(Math.random() * motivations.length)];
            },
            brew: () => '<span class="console-success">☕ brewing…</span> if this site\'s worth a coffee, <a class="console-link" href="https://ko-fi.com/W4L222FTY3" target="_blank" rel="noopener noreferrer">buy me one on Ko-fi</a>.',
            sudo: () => "nice try. permission denied.",
            clear: () => "__CLEAR__"
        };

        const ALL_COMMANDS = Object.keys(COMMANDS).concat(["theme"]).sort();

        const getSuggestion = (buf) => {
            if (!buf) return "";
            const parts = buf.toLowerCase().split(" ");
            if (parts.length === 1 && parts[0]) {
                const match = ALL_COMMANDS.find((c) => c.startsWith(parts[0]) && c !== parts[0]);
                return match ? match.slice(parts[0].length) : "";
            }
            if (parts.length === 2 && parts[0] === "theme" && parts[1]) {
                const match = THEMES.find((t) => t.startsWith(parts[1]) && t !== parts[1]);
                return match ? match.slice(parts[1].length) : "";
            }
            return "";
        };

        const renderBuffer = () => {
            consoleTyped.textContent = buffer;
            const suggestion = getSuggestion(buffer);
            if (consoleGhost) consoleGhost.textContent = suggestion;
            if (consoleHintKey) consoleHintKey.classList.toggle("show", Boolean(suggestion));
        };

        const acceptSuggestion = () => {
            const suggestion = getSuggestion(buffer);
            if (suggestion) {
                buffer += suggestion;
                renderBuffer();
            }
        };

        const runCommand = (raw) => {
            const cmd = raw.trim();
            printCommand(cmd || "&nbsp;");
            if (!cmd) return;

            history.push(cmd);
            historyIdx = history.length;

            const [name, ...args] = cmd.toLowerCase().split(/\s+/);

            if (name === "clear") {
                consoleBody.querySelectorAll(".console-out, p:not(.console-input-line):not(.console-hint)").forEach((el) => {
                    if (!el.classList.contains("console-input-line")) el.remove();
                });
                return;
            }

            if (name === "theme") {
                const choice = args[0];
                if (THEMES.includes(choice)) {
                    document.querySelector(`.theme-option[data-theme-choice="${choice}"]`)?.click();
                    printLine(`theme set to <b>${choice}</b>.`);
                } else {
                    printLine(`usage: theme &lt;${THEMES.join("|")}&gt;`);
                }
                scrollToBottom();
                return;
            }

            if (Object.prototype.hasOwnProperty.call(COMMANDS, name)) {
                const output = COMMANDS[name]();
                if (output) printLine(output);
            } else {
                printLine(`<span class="console-error">command not found:</span> ${name} — type <b>help</b>`);
            }
            scrollToBottom();
        };

        consoleBody.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                runCommand(buffer);
                buffer = "";
                renderBuffer();
            } else if (e.key === "Tab") {
                e.preventDefault();
                acceptSuggestion();
            } else if (e.key === "Backspace") {
                e.preventDefault();
                buffer = buffer.slice(0, -1);
                renderBuffer();
            } else if (e.key === "ArrowRight") {
                if (buffer.length === 0 || getSuggestion(buffer)) {
                    e.preventDefault();
                    acceptSuggestion();
                }
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (history.length && historyIdx > 0) {
                    historyIdx--;
                    buffer = history[historyIdx];
                    renderBuffer();
                }
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                if (historyIdx < history.length - 1) {
                    historyIdx++;
                    buffer = history[historyIdx];
                } else {
                    historyIdx = history.length;
                    buffer = "";
                }
                renderBuffer();
            } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                buffer += e.key;
                renderBuffer();
            }
        });

        // Swipe-right-to-accept on touch devices
        let touchStartX = 0;
        let touchStartY = 0;
        consoleBody.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].clientX;
            touchStartY = e.changedTouches[0].clientY;
        }, { passive: true });

        consoleBody.addEventListener("touchend", (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            if (dx > 40 && Math.abs(dy) < 30 && getSuggestion(buffer)) {
                acceptSuggestion();
                consoleBody.focus();
            }
        }, { passive: true });

        consoleBody.addEventListener("click", () => consoleBody.focus());
    }

    // ---------- Project modal ----------
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
        let lastFocused = null;

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
                    `<a class="btn btn-ghost link-button" href="${repo}" target="_blank" rel="noopener noreferrer" aria-label="Open project repository"><i class="fab fa-github" aria-hidden="true"></i> Repository</a>`
                );
            }

            if (demo) {
                modalLinks.insertAdjacentHTML(
                    "beforeend",
                    `<a class="btn btn-primary link-button" href="${demo}" target="_blank" rel="noopener noreferrer" aria-label="Open project live demo"><i class="fa-solid fa-laptop-code" aria-hidden="true"></i> Live Demo</a>`
                );
            }

            if (!repo && !demo) {
                modalLinks.innerHTML = "<span class='project-modal-empty-link'>Private project — code not publicly available.</span>";
            }

            updateCarousel();
            lastFocused = document.activeElement;
            projectModal.classList.add("show");
            projectModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
            projectModal.querySelector(".project-modal-close")?.focus();
        };

        const closeModal = () => {
            projectModal.classList.remove("show");
            projectModal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");
            if (lastFocused) lastFocused.focus();
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

            if (event.key === "Escape") closeModal();
            if (event.key === "ArrowLeft" && carouselPrev) carouselPrev.click();
            if (event.key === "ArrowRight" && carouselNext) carouselNext.click();
        });
    }

    // ---------- Copy email to clipboard ----------
    const emailCopy = document.getElementById("emailCopy");
    if (emailCopy) {
        const emailText = emailCopy.querySelector(".email-text");
        const emailIcon = emailCopy.querySelector(".email-icon");
        const email = emailCopy.dataset.email;

        emailCopy.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(email);
                const original = emailText.textContent;
                emailIcon.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';
                emailText.textContent = "Copied to clipboard";
                setTimeout(() => {
                    emailText.textContent = original;
                    emailIcon.innerHTML = '<i class="fas fa-copy" aria-hidden="true"></i>';
                }, 1800);
            } catch (err) {
                window.location.href = `mailto:${email}`;
            }
        });
    }
});