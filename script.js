const preloader = document.getElementById("preloader");
const intro = document.getElementById("intro");
const mainContent = document.getElementById("mainContent");
const enterBtn = document.getElementById("enterBtn");
const bgMantra = document.getElementById("bgMantra");
const musicToggle = document.getElementById("musicToggle");
const petalsGlobal = document.getElementById("petalsGlobal");
const toTop = document.getElementById("toTop");
const langToggle = document.getElementById("langToggle");
const ganeshaMantra = document.getElementById("ganeshaMantra");

let hasStartedMusic = false;
let currentLang = "hi";
const MUSIC_PREF_KEY = "musicMuted";
const LANG_PREF_KEY = "siteLang";

/* BEGIN AI-generated */
function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function applyLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;

    document.documentElement.lang = lang;
    document.body.classList.toggle("lang-hi", lang === "hi");
    document.body.classList.toggle("lang-en", lang === "en");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const value = getNestedValue(TRANSLATIONS[lang], key);
        if (value !== undefined) {
            el.textContent = value;
        }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
        const pairs = el.getAttribute("data-i18n-attr").split(";");
        pairs.forEach((pair) => {
            const [attr, key] = pair.split(":").map((s) => s.trim());
            const value = getNestedValue(TRANSLATIONS[lang], key);
            if (value !== undefined && attr) {
                el.setAttribute(attr, value);
            }
        });
    });

    if (ganeshaMantra && typeof GANESHA_MANTRA !== "undefined") {
        ganeshaMantra.textContent = GANESHA_MANTRA;
    }

    if (langToggle) {
        langToggle.setAttribute("aria-checked", String(lang === "en"));
        const hiLabel = langToggle.querySelector(".lang-toggle-hi");
        const enLabel = langToggle.querySelector(".lang-toggle-en");
        if (hiLabel) hiLabel.classList.toggle("is-active", lang === "hi");
        if (enLabel) enLabel.classList.toggle("is-active", lang === "en");
    }

    updateMusicToggleLabel(bgMantra ? bgMantra.muted : false);

    try {
        localStorage.setItem(LANG_PREF_KEY, lang);
    } catch (error) {
        // Ignore storage failures.
    }
}

function initLanguage() {
    let lang = "hi";
    try {
        const stored = localStorage.getItem(LANG_PREF_KEY);
        if (stored === "en" || stored === "hi") {
            lang = stored;
        }
    } catch (error) {
        lang = "hi";
    }
    applyLanguage(lang);
}

function toggleLanguage() {
    applyLanguage(currentLang === "hi" ? "en" : "hi");
}
/* END AI-generated */

function updateMusicToggleLabel(isMuted) {
    if (!musicToggle || musicToggle.disabled) return;
    const t = TRANSLATIONS[currentLang].music;
    musicToggle.textContent = isMuted ? t.off : t.on;
    musicToggle.setAttribute(
        "aria-label",
        isMuted ? t.unmuteLabel : t.muteLabel,
    );
}

function setMusicUnavailable() {
    if (!musicToggle) return;
    musicToggle.disabled = true;
    musicToggle.textContent = TRANSLATIONS[currentLang].music.unavailable;
    musicToggle.classList.add("is-muted");
    musicToggle.setAttribute("aria-pressed", "true");
    musicToggle.setAttribute(
        "aria-label",
        TRANSLATIONS[currentLang].music.unavailableLabel,
    );
}

function setMuted(isMuted, persist = true) {
    if (bgMantra) {
        bgMantra.muted = isMuted;
    }

    if (musicToggle && !musicToggle.disabled) {
        updateMusicToggleLabel(isMuted);
        musicToggle.classList.toggle("is-muted", isMuted);
        musicToggle.setAttribute("aria-pressed", String(isMuted));
    }

    if (persist) {
        try {
            localStorage.setItem(MUSIC_PREF_KEY, String(isMuted));
        } catch (error) {
            // Ignore storage failures.
        }
    }
}

function initMusicPreference() {
    let isMuted = false;
    try {
        isMuted = localStorage.getItem(MUSIC_PREF_KEY) === "true";
    } catch (error) {
        isMuted = false;
    }
    setMuted(isMuted, false);
}

function startMusicOnce() {
    if (!bgMantra || !musicToggle || musicToggle.disabled) return;
    if (bgMantra.error) {
        setMusicUnavailable();
        return;
    }

    bgMantra.volume = 0.42;
    const playPromise = bgMantra.play();

    if (playPromise && typeof playPromise.then === "function") {
        playPromise
            .then(() => {
                hasStartedMusic = true;
            })
            .catch(() => {
                hasStartedMusic = false;
            });
    } else {
        hasStartedMusic = true;
    }
}

function on(el, eventName, handler) {
    if (!el) return;
    el.addEventListener(eventName, handler);
}

function createFallingElements(container, className, count) {
    if (!container) return;
    for (let i = 0; i < count; i += 1) {
        const el = document.createElement("span");
        el.className = className;
        el.style.left = `${Math.random() * 100}%`;
        el.style.animationDuration = `${15 + Math.random() * 14}s`;
        el.style.animationDelay = `${Math.random() * -10}s`;
        el.style.setProperty("--tx", `${-45 + Math.random() * 90}px`);
        container.appendChild(el);
    }
}

function updatePetalFallDistance() {
    if (!petalsGlobal) return;
    const fullHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
    );
    petalsGlobal.style.setProperty("--fall-distance", `${fullHeight + 180}px`);
}

function enterInvitation() {
    if (!intro) return;
    intro.style.pointerEvents = "none";

    const complete = () => {
        intro.style.display = "none";
        document.body.classList.remove("intro-open");
        mainContent.classList.add("active");
        mainContent.setAttribute("aria-hidden", "false");
        window.scrollTo({ top: 0, behavior: "auto" });
        updatePetalFallDistance();
        if (window.gsap) {
            gsap.timeline()
                .fromTo(
                    "#mainContent",
                    { opacity: 0, filter: "blur(8px)", scale: 0.99 },
                    {
                        opacity: 1,
                        filter: "blur(0px)",
                        scale: 1,
                        duration: 0.9,
                        ease: "power2.out",
                    },
                )
                .from(
                    ["#welcome .container", "#mangalBela .mangal-bela-card"],
                    {
                        y: 24,
                        opacity: 0,
                        duration: 1,
                        stagger: 0.12,
                        ease: "power3.out",
                    },
                    "-=0.4",
                );
        }
        if (window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
        }
    };

    if (window.gsap) {
        gsap.to(".envelope-intro", {
            opacity: 0,
            scale: 1.02,
            duration: 0.85,
            ease: "power2.out",
            onComplete: complete,
        });
    } else {
        complete();
    }
}

function initGsap() {
    if (!window.gsap || !window.ScrollTrigger) {
        document
            .querySelectorAll(".reveal")
            .forEach((item) => item.classList.remove("reveal"));
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".gold-flourish", {
        width: "min(420px, 80vw)",
        repeat: -1,
        yoyo: true,
        duration: 2.8,
        ease: "sine.inOut",
    });

    document.querySelectorAll(".reveal").forEach((el) => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true,
            },
        });
    });

    gsap.to(".mandala-hero", {
        y: 40,
        scrollTrigger: {
            trigger: ".welcome",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
        },
    });
}

window.addEventListener("load", () => {
    initLanguage();
    initMusicPreference();

    if (bgMantra) {
        bgMantra.addEventListener("error", setMusicUnavailable);
    } else {
        setMusicUnavailable();
    }

    if (preloader) {
        setTimeout(() => preloader.classList.add("hidden"), 700);
    }

    createFallingElements(petalsGlobal, "petal", 40);
    updatePetalFallDistance();
    initGsap();
});

window.addEventListener("resize", updatePetalFallDistance);

on(enterBtn, "click", enterInvitation);
on(enterBtn, "click", startMusicOnce);

on(langToggle, "click", toggleLanguage);

on(musicToggle, "click", () => {
    if (!bgMantra || musicToggle.disabled) return;
    const nextMuted = !bgMantra.muted;
    setMuted(nextMuted, true);
    if (!nextMuted && (!hasStartedMusic || bgMantra.paused)) {
        startMusicOnce();
    }
});

on(toTop, "click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
