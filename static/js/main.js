/* ============================================================
   main.js — JavaScript para Roberto Fausto Portfolio
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* --------------------------------------------------------
       1. Navbar — muda de transparente para sólida ao scrollar
    -------------------------------------------------------- */
    const navbar = document.getElementById('navbar');

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    /* --------------------------------------------------------
       2. Marca o link ativo na navbar baseado na URL atual
    -------------------------------------------------------- */
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
            link.classList.add('active');
        }
    });

    /* --------------------------------------------------------
       3. Menu Mobile (hamburger toggle)
    -------------------------------------------------------- */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', function () {
            const isOpen = mobileMenu.classList.contains('open');

            if (isOpen) {
                mobileMenu.classList.remove('open');
                hamburgerIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            } else {
                mobileMenu.classList.add('open');
                hamburgerIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
                hamburgerBtn.setAttribute('aria-expanded', 'true');
            }
        });

        // Fechar menu ao clicar em um link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('open');
                hamburgerIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function (e) {
            if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('open');
                hamburgerIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* --------------------------------------------------------
       4. Intersection Observer — fade-in ao scroll
    -------------------------------------------------------- */
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in, .stagger-item');

    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.dataset.delay || 0;

                    setTimeout(function () {
                        el.classList.add('visible');
                    }, parseInt(delay));

                    fadeObserver.unobserve(el);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeElements.forEach(function (el) {
            fadeObserver.observe(el);
        });
    }

    /* --------------------------------------------------------
       5. Animação das barras de progresso ao entrar na viewport
    -------------------------------------------------------- */
    const progressBars = document.querySelectorAll('.progress-bar-fill');

    if (progressBars.length > 0) {
        const progressObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.dataset.width || '0%';

                    setTimeout(function () {
                        bar.style.width = targetWidth;
                    }, 200);

                    progressObserver.unobserve(bar);
                }
            });
        }, {
            threshold: 0.2
        });

        progressBars.forEach(function (bar) {
            progressObserver.observe(bar);
        });
    }

    /* --------------------------------------------------------
       6. Animação stagger para cards em grid
    -------------------------------------------------------- */
    const staggerContainers = document.querySelectorAll('.stagger-container');

    staggerContainers.forEach(function (container) {
        const items = container.querySelectorAll('.stagger-item');
        const staggerObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    items.forEach(function (item, index) {
                        setTimeout(function () {
                            item.classList.add('visible');
                        }, index * 120);
                    });
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        staggerObserver.observe(container);
    });

    /* --------------------------------------------------------
       7. Smooth scroll para links internos (âncoras)
    -------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* --------------------------------------------------------
       8. Formulário de contato — feedback visual no envio
    -------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Enviando...
            `;
            submitBtn.disabled = true;

            setTimeout(function () {
                submitBtn.innerHTML = `
                    <svg class="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Mensagem Enviada!
                `;
                submitBtn.classList.remove('from-blue-600', 'to-purple-600');
                submitBtn.classList.add('from-green-600', 'to-emerald-600');

                setTimeout(function () {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('from-green-600', 'to-emerald-600');
                    submitBtn.classList.add('from-blue-600', 'to-purple-600');
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    /* --------------------------------------------------------
       9. Ano atual no footer
    -------------------------------------------------------- */
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

});
