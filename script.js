/**
 * script.js — GreenEarth Interactive Logic
 * This script handles:
 * 1. Navbar effects (sticky header & highlighting active links)
 * 2. Mobile menu (toggle burger icon)
 * 3. Intersection Observer (fading sections in on scroll)
 * 4. Counters (numbers counting up)
 * 5. Back-to-top button
 * 6. Quote rotator & Image slider
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. NAVBAR & SCROLLING ---

    const scrollProgress = document.getElementById("scroll-progress");
    const header = document.getElementById('main-header');
    const links = document.querySelectorAll('.nav-links li a');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        // Sticky Header: add background when scrolled more than 50px
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back To Top: show button when scrolled more than 300px
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        // Scroll Progress Bar: calculate percentage of page scrolled
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + "%";

        // Active Link Highlighting (Scroll-Spy)
        let currentSectionId = "";
        const scrollPos = window.scrollY + 100; // Added offset for early trigger

        // If we reach the bottom of the page, highlight 'Contact'
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 20) {
            currentSectionId = "contact";
        } else {
            // Check each link's target section to see which one is currently in view
            links.forEach(link => {
                const id = link.getAttribute('href').substring(1);
                const section = document.getElementById(id);
                if (section && section.offsetTop <= scrollPos) {
                    currentSectionId = id;
                }
            });
        }

        // Update classes for all nav links
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    });

    // --- 2. MOBILE MENU ---

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Toggle menu when clicking the hamburger icon
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking any link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // --- 3. SCROLL ANIMATIONS (Fade In) ---

    // Uses IntersectionObserver to trigger animations once elements enter view
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target); // Animates only once
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

    // --- 4. ANIMATED COUNTERS ---

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target'); // Get final number
                    const increment = target / 120; // Speed of counting (approx 2s at 60fps)
                    let count = 0;

                    const updateCount = () => {
                        count += increment;
                        if (count < target) {
                            counter.innerText = Math.ceil(count).toLocaleString();
                            requestAnimationFrame(updateCount); // Smoothly repeat
                        } else {
                            counter.innerText = target.toLocaleString();
                        }
                    };
                    updateCount();
                });
                counterObserver.unobserve(entry.target); // Count only once
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) counterObserver.observe(statsSection);

    // --- 5. HELPERS ---

    // Back-to-top functionality
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Current Year for Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.innerText = new Date().getFullYear();

    // --- 6. INTERACTIVE WIDGETS ---

    // Quote Rotator
    const quotes = [
        "Nature does not hurry, yet everything is accomplished.",
        "In every walk with nature one receives far more than he seeks.",
        "The earth has music for those who listen.",
        "Look deep into nature, and then you will understand everything better."
    ];
    let qIndex = 0;
    const quoteEl = document.getElementById('quote');

    if (quoteEl) {
        setInterval(() => {
            quoteEl.style.opacity = 0; // Fade out
            setTimeout(() => {
                qIndex = (qIndex + 1) % quotes.length;
                quoteEl.innerText = `"${quotes[qIndex]}"`;
                quoteEl.style.opacity = 1; // Fade in
            }, 500);
        }, 5000);
    }

    // Image Comparison Slider
    const compSlider = document.getElementById('comp-slider');
    const beforeImg = document.querySelector('.before-img');
    const sliderLine = document.querySelector('.slider-line');
    const sliderBtn = document.querySelector('.slider-button');

    if (compSlider && beforeImg) {
        compSlider.addEventListener('input', (e) => {
            const value = e.target.value + "%";
            beforeImg.style.width = value;
            sliderLine.style.left = value;
            sliderBtn.style.left = value;
        });
    }
});
