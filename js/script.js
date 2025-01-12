document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('nav');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu li a');

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Ajuste para mejor precisión en móviles
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

    // Cerrar el menú al hacer clic en un enlace (para móviles)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navToggle = document.getElementById('nav-toggle');
            if (navToggle && navToggle.checked) {
                navToggle.checked = false;
            }
        });
    });

    // Asegurarse de que el enlace correcto esté destacado al cargar
    window.addEventListener('load', () => {
        const currentSection = document.querySelector('section:target') || sections[0];
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection.id) {
                link.classList.add('active');
            }
        });
    });

document.addEventListener('DOMContentLoaded', () => {
    const headers = document.querySelectorAll('#Datos .header'); // Selecciona los encabezados de las columnas

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const targetClass = header.getAttribute('data-target'); // Obtiene el nombre de la clase objetivo
            const targetColumn = document.querySelector(`.${targetClass}`); // Selecciona la columna objetivo

            // Alternar la visibilidad
            if (targetColumn.style.opacity === '0') {
                targetColumn.style.opacity = '1'; // Hacer visible
                targetColumn.style.transform = 'translateY(0)'; // Volver a la posición original
            } else {
                targetColumn.style.opacity = '0'; // Ocultar
                targetColumn.style.transform = 'translateY(20px)'; // Mover hacia abajo
            }

            // Aplicar la transición
            targetColumn.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; // Agregar transición
        });
    });
});