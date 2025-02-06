const scrollToTopButton = document.getElementById("scrollToTop");

// Update button progress on scroll
window.addEventListener("scroll", () => {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / scrollableHeight) * 100;
  scrollToTopButton.style.setProperty("--scroll", `${scrolled}%`);

  // Show or hide button based on scroll position
  if (window.scrollY > 200) {
    scrollToTopButton.classList.add("show");
  } else {
    scrollToTopButton.classList.remove("show");
  }
});

// Scroll to top when button is clicked
scrollToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
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


// Get the current year and update the span footer
const currentYear = new Date().getFullYear();
document.getElementById("year").textContent = currentYear;

 
//Typing js
var options = {
  strings: [
    "eguimos con tu legado.",
    "eguimos con tu legado.",
    "eguimos con tu legado.",
  ],
  typeSpeed: 50,
  backSpeed: 50,
  loop: true,
};
var typed = new Typed(".typing", options);

var options = {
  strings: ["@corioliscap.com", "@corioliscap.com", "@corioliscap.com"],
  typeSpeed: 50,
  backSpeed: 50,
  loop: true,
};
var typed = new Typed(".typing2", options);

// Select all dotlottie-player animations
const lottiePlayers = document.querySelectorAll(".lottie-animation");

// Pause all animations initially
lottiePlayers.forEach((player) => {
  player.addEventListener("load", () => {
    player.pause(); // Pause the animation as soon as it loads
  });
});

// Add hover play and pause functionality for each card
const cards = document.querySelectorAll(".valores__card");
cards.forEach((card) => {
  const lottiePlayer = card.querySelector(".lottie-animation");

  card.addEventListener("mouseenter", () => {
    lottiePlayer.stop(); // Reset animation to the start
    lottiePlayer.play(); // Play animation on hover
  });
});

AOS.init({
  once: true,
});
