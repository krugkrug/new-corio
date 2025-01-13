document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('nav');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu li a');
    const headers = document.querySelectorAll('#Datos .header');

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
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

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navToggle = document.getElementById('nav-toggle');
            if (navToggle && navToggle.checked) {
                navToggle.checked = false;
            }
        });
    });

    const currentSection = document.querySelector('section:target') || sections[0];
    navLinks
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection.id) {
            link.classList.add('active');
        }
    });


    headers.forEach(header => {
        header.addEventListener('click', () => {
            const targetClass = header.getAttribute('data-target'); // Obtiene el nombre de la clase objetivo
            const targetColumn = document.querySelector(`.${targetClass}`); // Selecciona la columna objetivo

            // Alternar la visibilidad
            if (targetColumn.style.opacity === '0,5' || targetColumn.style.opacity === '') {
                targetColumn.style.opacity = '0,5'; // Hacer visible
                targetColumn.style.transform = 'translateY(50px)'; // Volver a la posición original
            } else {
                targetColumn.style.opacity = '1'; // Ocultar
                targetColumn.style.transform = 'translateY(0px)'; // Mover hacia abajo
            }

            // Aplicar la transición
            targetColumn.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; // Agregar transición
        });
    });
});
document.addEventListener("DOMContentLoaded", function() {
    // Selecciona todos los elementos de encabezado de columna
    var headers = document.querySelectorAll("td.header");

    headers.forEach(function(header) {
        // Obtiene la clase de la columna correspondiente desde el atributo data-target
        var targetClass = header.getAttribute("data-target");
        // Selecciona el elemento de contenido correspondiente
        var contentElement = document.querySelector("." + targetClass + ".hidden");

        // Añade un evento de clic al elemento de encabezado
        header.addEventListener("click", function() {
            // Alterna la clase 'hidden' en el elemento de contenido
            if (contentElement.classList.contains("hidden")) {
                contentElement.classList.remove("hidden");
                contentElement.style.opacity = '1'; // Asegura que la opacidad esté en 1
                contentElement.style.transform = 'translateY(0)'; // Asegura la posición original
                header.style.transform = 'translateY(0)'; // Restablece la posición del encabezado
            } else {
                contentElement.classList.add("hidden");
                contentElement.style.opacity = '0'; // Oculta el contenido
                contentElement.style.transform = 'translateY(20px)'; // Mueve hacia abajo
                header.style.transform = 'translateY(0)'; // Restablece la posición del encabezado
            }
        });
    });
});