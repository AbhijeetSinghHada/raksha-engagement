const preloader = document.getElementById("preloader");
const intro = document.getElementById("intro");
const mainContent = document.getElementById("mainContent");
const enterBtn = document.getElementById("enterBtn");
const bgMantra = document.getElementById("bgMantra");
const musicToggle = document.getElementById("musicToggle");
const lanternsIntro = document.getElementById("lanternsIntro");
const petalsGlobal = document.getElementById("petalsGlobal");
const particles = document.getElementById("particles");
const copyHash = document.getElementById("copyHash");
const hashText = document.getElementById("hashText");
const toast = document.getElementById("toast");
const rsvpForm = document.getElementById("rsvpForm");
const thanksModal = document.getElementById("thanksModal");
const closeModal = document.getElementById("closeModal");
const toTop = document.getElementById("toTop");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");

let toastTimer;
let hasStartedMusic = false;
const MUSIC_PREF_KEY = "musicMuted";

function setMusicUnavailable() {
    if (!musicToggle) return;
    musicToggle.disabled = true;
    musicToggle.textContent = "Music unavailable";
    musicToggle.classList.add("is-muted");
    musicToggle.setAttribute("aria-pressed", "true");
    musicToggle.setAttribute("aria-label", "Background music unavailable");
}

function setMuted(isMuted, persist = true) {
    if (bgMantra) {
        bgMantra.muted = isMuted;
    }

    if (musicToggle) {
        musicToggle.textContent = isMuted ? "Music: Off" : "Music: On";
        musicToggle.classList.toggle("is-muted", isMuted);
        musicToggle.setAttribute("aria-pressed", String(isMuted));
        musicToggle.setAttribute(
            "aria-label",
            isMuted ? "Unmute background music" : "Mute background music",
        );
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

function setRsvpModalContent(attendValue) {
    if (!modalTitle || !modalMessage) return;

    if (attendValue === "yes") {
        modalTitle.textContent = "YAY!!";
        modalMessage.textContent = "We're officially excited now.";
        return;
    }

    modalTitle.textContent = "But...";
    modalMessage.textContent = "there will be dessert! 🥺";
}

function on(el, eventName, handler) {
    if (!el) return;
    el.addEventListener(eventName, handler);
}

async function copyTextSafe(text) {
    if (!text) return false;
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch (error) {
        // Fall through to legacy copy path.
    }

    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.focus();
    area.select();

    let copied = false;
    try {
        copied = document.execCommand("copy");
    } catch (error) {
        copied = false;
    }

    document.body.removeChild(area);
    return copied;
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

function createLanterns(container, count) {
    if (!container) return;
    for (let i = 0; i < count; i += 1) {
        const lantern = document.createElement("span");
        lantern.className = "lantern";
        lantern.style.left = `${Math.random() * 100}%`;
        lantern.style.top = `${4 + Math.random() * 86}%`;
        lantern.style.animationDuration = `${5 + Math.random() * 4}s`;
        lantern.style.animationDelay = `${Math.random() * -6}s`;
        lantern.style.opacity = `${0.72 + Math.random() * 0.26}`;
        lantern.style.transform = `scale(${0.8 + Math.random() * 0.7})`;
        container.appendChild(lantern);
    }
}

function updateCountdown() {
    const target = new Date("2026-04-21T19:00:00+05:30").getTime();
    const now = Date.now();
    const diff = target - now;

    const dayEl = document.getElementById("days");
    const hourEl = document.getElementById("hours");
    const minEl = document.getElementById("minutes");
    const secEl = document.getElementById("seconds");

    if (!dayEl || !hourEl || !minEl || !secEl) return;

    if (diff <= 0) {
        dayEl.textContent = "00";
        hourEl.textContent = "00";
        minEl.textContent = "00";
        secEl.textContent = "00";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    dayEl.textContent = String(days).padStart(2, "0");
    hourEl.textContent = String(hours).padStart(2, "0");
    minEl.textContent = String(minutes).padStart(2, "0");
    secEl.textContent = String(seconds).padStart(2, "0");
}

function showToast(message) {
    if (!toast) return;
    if (toastTimer) {
        clearTimeout(toastTimer);
    }
    toast.innerHTML = `${message} <span aria-hidden="true">&hearts;</span>`;
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1400);
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
                    { opacity: 0, filter: "blur(10px)", scale: 0.985 },
                    {
                        opacity: 1,
                        filter: "blur(0px)",
                        scale: 1,
                        duration: 0.9,
                        ease: "power2.out",
                    },
                )
                .from(
                    ["#coverArt", "#home .container", "#countdown .container"],
                    {
                        y: 24,
                        opacity: 0,
                        duration: 1.05,
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
        gsap.to(".intro", {
            scale: 1.03,
            opacity: 0,
            duration: 0.95,
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

    gsap.to(".intro", {
        scale: 1.03,
        duration: 14,
        ease: "none",
    });

    gsap.to(".cover-image", {
        scale: 1.015,
        yPercent: -1.4,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
    });

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
                start: "top 83%",
                once: true,
            },
        });
    });

    gsap.to(".mandala-hero", {
        y: 55,
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
        },
    });
}

window.addEventListener("load", () => {
    initMusicPreference();

    if (bgMantra) {
        bgMantra.addEventListener("error", setMusicUnavailable);
    } else {
        setMusicUnavailable();
    }

    setTimeout(() => preloader.classList.add("hidden"), 900);
    createLanterns(lanternsIntro, 11);
    createFallingElements(petalsGlobal, "petal", 50);
    createFallingElements(particles, "spark", 48);
    updatePetalFallDistance();
    initGsap();
    updateCountdown();
    setInterval(updateCountdown, 1000);
});

window.addEventListener("resize", updatePetalFallDistance);

on(enterBtn, "click", enterInvitation);
on(enterBtn, "click", startMusicOnce);

on(musicToggle, "click", () => {
    if (!bgMantra || musicToggle.disabled) return;
    const nextMuted = !bgMantra.muted;
    setMuted(nextMuted, true);
    if (!nextMuted && (!hasStartedMusic || bgMantra.paused)) {
        startMusicOnce();
    }
});

on(copyHash, "click", async () => {
    const copied = await copyTextSafe(hashText.textContent.trim());
    showToast(copied ? "Copied" : "Copy failed");
});

on(rsvpForm, "submit", async (event) => {
    event.preventDefault();

    if (!rsvpForm.checkValidity()) {
        rsvpForm.reportValidity();
        return;
    }
    const submitBtn = rsvpForm.querySelector('button[type="submit"]');
    const formData = new FormData(rsvpForm);
    const attendValue = String(formData.get("attend") || "");
    setRsvpModalContent(attendValue);
    const encodedData = new URLSearchParams(formData).toString();

    try {
        if (submitBtn) submitBtn.disabled = true;
        const response = await fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: encodedData,
        });

        if (!response.ok) {
            throw new Error("Netlify form submission failed");
        }

        if (thanksModal) {
            thanksModal.classList.add("show");
            thanksModal.setAttribute("aria-hidden", "false");
        } else {
            showToast("RSVP sent");
        }
        rsvpForm.reset();
    } catch (error) {
        try {
            HTMLFormElement.prototype.submit.call(rsvpForm);
            showToast("RSVP sent");
            rsvpForm.reset();
        } catch (submitError) {
            showToast("RSVP failed");
        }
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
});

on(closeModal, "click", () => {
    if (!thanksModal) return;
    thanksModal.classList.remove("show");
    thanksModal.setAttribute("aria-hidden", "true");
});

on(thanksModal, "click", (event) => {
    if (!thanksModal) return;
    if (event.target === thanksModal) {
        thanksModal.classList.remove("show");
        thanksModal.setAttribute("aria-hidden", "true");
    }
});

on(toTop, "click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
