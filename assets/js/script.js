// Botón "volver arriba" con indicador de progreso de lectura
const scrollToTopButton = document.getElementById("scrollToTop");

if (scrollToTopButton) {
  window.addEventListener(
    "scroll",
    () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled =
        scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
      scrollToTopButton.style.setProperty("--scroll", `${scrolled}%`);
      scrollToTopButton.classList.toggle("show", window.scrollY > 200);
    },
    { passive: true }
  );

  scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Resalta en la navegación la sección visible en pantalla
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = Array.from(
    document.querySelectorAll("header .nav-item .nav-link")
  );
  // Compensa la altura de la barra fija, igual que scroll-padding-top en el CSS
  const OFFSET_NAVBAR = 90;

  const secciones = navLinks
    .map((link) => ({ link, seccion: document.querySelector(link.hash || "") }))
    .filter((par) => par.seccion);

  if (!secciones.length) return;

  function setActiveLink() {
    const posicion = window.scrollY + OFFSET_NAVBAR + 1;
    const activa = secciones.find(({ seccion }) => {
      const top = seccion.offsetTop;
      return posicion >= top && posicion < top + seccion.offsetHeight;
    });

    secciones.forEach(({ link }) =>
      link.classList.toggle("active", activa != null && link === activa.link)
    );
  }

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();
});

// Año del pie
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Efecto máquina de escribir del titular y del email
function iniciarTyped(selector, texto) {
  if (!document.querySelector(selector)) return;
  new Typed(selector, {
    strings: [texto, texto],
    typeSpeed: 50,
    backSpeed: 50,
    loop: true,
  });
}

iniciarTyped(".typing", "eguimos con tu legado.");
iniciarTyped(".typing2", "@corioliscap.com");

// Las animaciones Lottie arrancan solo al pasar el cursor por la tarjeta
document.querySelectorAll(".valores__card").forEach((card) => {
  const lottiePlayer = card.querySelector(".lottie-animation");
  if (!lottiePlayer) return;

  lottiePlayer.addEventListener("load", () => lottiePlayer.pause());
  card.addEventListener("mouseenter", () => {
    lottiePlayer.stop();
    lottiePlayer.play();
  });
});

if (window.AOS) {
  AOS.init({ once: true });
}
