/**
 * Ahmed Amr Portfolio - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {

    // Projects Carousel Logic
    const track = document.querySelector('.projects-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    // --- Hero Visual Tilt Animation ---
    const heroSection = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');

    if (heroSection && heroVisual) {
        heroSection.addEventListener('mousemove', (e) => {
            const { offsetWidth: width, offsetHeight: height } = heroSection;
            const { clientX: x, clientY: y } = e;

            const xPos = (x / width - 0.5) * 20; // Max rotation deg
            const yPos = (y / height - 0.5) * 20;

            heroVisual.style.transform = `perspective(1000px) rotateY(${xPos}deg) rotateX(${-yPos}deg)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            heroVisual.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
        });
    }

    if (track && prevBtn && nextBtn) {
        // Fixed card width 320px + 24px gap
        const SCROLL_AMOUNT = 344;

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (track.contains(document.activeElement) ||
                prevBtn === document.activeElement ||
                nextBtn === document.activeElement) {

                if (e.key === 'ArrowRight') {
                    nextBtn.click();
                } else if (e.key === 'ArrowLeft') {
                    prevBtn.click();
                }
            }
        });
    }

    // --- Projects Show More Logic ---
    const showMoreBtn = document.getElementById('show-more-btn');
    const hiddenProjects = document.getElementById('hidden-projects');

    if (showMoreBtn && hiddenProjects) {
        showMoreBtn.addEventListener('click', () => {
            const isVisible = hiddenProjects.classList.contains('visible');
            if (isVisible) {
                hiddenProjects.classList.remove('visible');
                hiddenProjects.setAttribute('aria-hidden', 'true');
                showMoreBtn.textContent = 'Show More Projects';
                document.querySelector('.projects-grid').scrollIntoView({ behavior: 'smooth' });
            } else {
                hiddenProjects.classList.add('visible');
                hiddenProjects.setAttribute('aria-hidden', 'false');
                showMoreBtn.textContent = 'Show Less Projects';
            }
        });
    }

    // --- Side Panel Logic ---
    const sidePanel = document.getElementById('project-side-panel');
    const closePanelBtn = document.getElementById('close-panel-btn');
    const panelTitle = document.getElementById('panel-title');
    const panelDesc = document.getElementById('panel-desc');
    const panelImg = document.getElementById('panel-img'); // New image element

    // Use delegation or re-query if buttons are dynamic (they are static here)
    const descButtons = document.querySelectorAll('.view-description-btn');

    const closePanel = () => {
        if (sidePanel) {
            sidePanel.classList.remove('open');
            sidePanel.setAttribute('aria-hidden', 'true');
        }
    };

    if (sidePanel) {
        descButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const title = btn.getAttribute('data-title');
                const desc = btn.getAttribute('data-desc');
                const imageSrc = btn.getAttribute('data-image'); // Get image

                if (panelTitle && panelDesc) {
                    panelTitle.textContent = title;
                    panelDesc.textContent = desc;

                    if (panelImg) {
                        if (imageSrc && imageSrc !== 'null') {
                            panelImg.src = imageSrc;
                            panelImg.style.display = 'block';
                        } else {
                            panelImg.style.display = 'none';
                        }
                    }

                    sidePanel.classList.add('open');
                    sidePanel.setAttribute('aria-hidden', 'false');
                }
            });
        });

        if (closePanelBtn) closePanelBtn.addEventListener('click', closePanel);

        document.addEventListener('click', (e) => {
            if (sidePanel.classList.contains('open') &&
                !sidePanel.contains(e.target) &&
                !e.target.classList.contains('view-description-btn')) {
                closePanel();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closePanel();
        });
    }

    // --- Certificates Show More Logic ---
    const showMoreCertsBtn = document.getElementById('show-more-certs-btn');
    const hiddenCerts = document.getElementById('hidden-certs');

    if (showMoreCertsBtn && hiddenCerts) {
        showMoreCertsBtn.addEventListener('click', () => {
            const isVisible = hiddenCerts.classList.contains('visible');
            if (isVisible) {
                hiddenCerts.classList.remove('visible');
                hiddenCerts.setAttribute('aria-hidden', 'true');
                showMoreCertsBtn.textContent = 'Show More Certificates';
                document.querySelector('.certificates-grid').scrollIntoView({ behavior: 'smooth' });
            } else {
                hiddenCerts.classList.add('visible');
                hiddenCerts.setAttribute('aria-hidden', 'false');
                showMoreCertsBtn.textContent = 'Show Less Certificates';
            }
        });
    }

    // --- Certificate Side Panel Logic ---
    const certSidePanel = document.getElementById('cert-side-panel');
    const closeCertPanelBtn = document.getElementById('close-cert-panel-btn');
    // Re-query dynamically or stick to delegation container if preferred, but static query works here
    // Note: hidden ones might need event delegation if they were dynamic, but they exist in DOM just hidden.

    // Delegation approach for robustness with hidden items
    const certificatesSection = document.getElementById('certificates');

    // Panel Elements
    const certPanelTitle = document.getElementById('cert-panel-title');
    const certPanelOrg = document.getElementById('cert-panel-org');
    const certPanelDate = document.getElementById('cert-panel-date');
    const certPanelDesc = document.getElementById('cert-panel-desc');
    const certPanelImg = document.getElementById('cert-panel-img');

    const closeCertPanel = () => {
        if (certSidePanel) {
            certSidePanel.classList.remove('open');
            certSidePanel.setAttribute('aria-hidden', 'true');
        }
    };

    if (certificatesSection && certSidePanel) {
        certificatesSection.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-cert-details')) {
                e.preventDefault();
                const btn = e.target;

                // Get data attributes
                const title = btn.getAttribute('data-title');
                const org = btn.getAttribute('data-org');
                const date = btn.getAttribute('data-date');
                const desc = btn.getAttribute('data-desc');
                const image = btn.getAttribute('data-image');

                // Populate panel
                if (certPanelTitle) certPanelTitle.textContent = title;
                if (certPanelOrg) certPanelOrg.textContent = org;
                if (certPanelDate) certPanelDate.textContent = date;
                if (certPanelDesc) certPanelDesc.textContent = desc;
                if (certPanelImg) {
                    certPanelImg.src = image || 'assets/cert-placeholder.jpg';
                    certPanelImg.style.display = 'block';
                }

                // Open panel
                certSidePanel.classList.add('open');
                certSidePanel.setAttribute('aria-hidden', 'false');
            }
        });

        if (closeCertPanelBtn) closeCertPanelBtn.addEventListener('click', closeCertPanel);

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (certSidePanel.classList.contains('open') &&
                !certSidePanel.contains(e.target) &&
                !e.target.classList.contains('btn-cert-details')) {
                closeCertPanel();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certSidePanel.classList.contains('open')) closeCertPanel();
        });
    }
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // Match CSS header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('[data-animate]');
    const sectionHeaders = document.querySelectorAll('.section-header');
    const skillCards = document.querySelectorAll('.skill-card');
    const projectCards = document.querySelectorAll('.project-card');
    const certItems = document.querySelectorAll('.cert-item');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, observerOptions);

    // Observe hero elements
    animatedElements.forEach(el => observer.observe(el));

    // Observe dynamic elements
    // Add animate class to dynamic lists for uniform handling
    const animateList = (elements) => {
        elements.forEach((el, index) => {
            el.setAttribute('data-animate', '');
            el.style.transitionDelay = `${index * 100}ms`; // Stagger effect
            observer.observe(el);
        });
    };

    sectionHeaders.forEach(header => {
        header.setAttribute('data-animate', '');
        observer.observe(header);
    });

    animateList(skillCards);
    animateList(projectCards);
    animateList(certItems);


    // --- Active Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Offset for header height
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Skills Toggle Functionality
    const skillsBtn = document.getElementById('skills-toggle-btn');
    const skillsExtended = document.getElementById('skills-extended');

    if (skillsBtn && skillsExtended) {
        skillsBtn.addEventListener('click', () => {
            const isExpanded = skillsBtn.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                // Collapse
                skillsBtn.setAttribute('aria-expanded', 'false');
                skillsExtended.setAttribute('aria-hidden', 'true');
                skillsExtended.classList.remove('visible');

                // Wait for transition to finish before hiding (optional, using CSS display)
                setTimeout(() => {
                    if (skillsBtn.getAttribute('aria-expanded') === 'false') {
                        skillsExtended.style.display = 'none';
                    }
                }, 400); // Match CSS transition

                skillsBtn.querySelector('span').textContent = 'View More Skills';
            } else {
                // Expand
                skillsExtended.style.display = 'block';
                // Small delay to allow display block to render before adding class for transition
                setTimeout(() => {
                    skillsBtn.setAttribute('aria-expanded', 'true');
                    skillsExtended.setAttribute('aria-hidden', 'false');
                    skillsExtended.classList.add('visible');
                }, 10);

                skillsBtn.querySelector('span').textContent = 'Show Less';
            }
        });
    }
    // --- Dynamic Copyright Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
