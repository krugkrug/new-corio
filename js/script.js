         document.addEventListener('DOMContentLoaded', () => {
            const navbar = document.querySelector('nav');
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-menu li a');

            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.3 // Adjusted threshold to ensure better accuracy on mobile
            };

            const observer = new IntersectionObserver((entries) => {
                let activeSectionId = null;

                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        activeSectionId = entry.target.id;
                    }
                });

                if (activeSectionId) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').substring(1) === activeSectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            }, options);

            sections.forEach(section => {
                observer.observe(section);
            });

            // Close the menu when a link is clicked (for mobile)
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    const navToggle = document.getElementById('nav-toggle');
                    if (navToggle && navToggle.checked) {
                        navToggle.checked = false;
                    }
                });
            });

            // Ensuring the correct link is highlighted on load
            window.addEventListener('load', () => {
                const currentSection = document.querySelector('section:target') || sections[0];
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === currentSection.id) {
                        link.classList.add('active');
                    }
                });
            });

            // Change navbar background after scrolling 100px
            window.addEventListener('scroll', () => {
                if (window.scrollY > 600) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        });
 
