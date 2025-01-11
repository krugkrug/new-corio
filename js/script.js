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

    // Cambiar el fondo del navbar después de desplazarse 300px
 document.addEventListener('DOMContentLoaded', () => {
    const proyectoColumnas = document.querySelectorAll('#proyecto-tabla td');

    proyectoColumnas.forEach(columna => {
        // Inicialmente ocultar el contenido de las columnas
        columna.style.opacity = '0';
        columna.style.transform = 'translateY(20px)'; // Mover hacia abajo

        // Agregar un evento de clic en el encabezado de la columna
        const header = columna.previousElementSibling; // Obtener el encabezado correspondiente
        header.addEventListener('click', () => {
            if (columna.style.opacity === '0') {
                columna.style.opacity = '1'; // Hacer visible
                columna.style.transform = 'translateY(0)'; // Volver a la posición original
                columna.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; // Agregar transición
            } else {
                columna.style.opacity = '0'; // Ocultar
                columna.style.transform = 'translateY(20px)'; // Mover hacia abajo
            }
        });
    });
});