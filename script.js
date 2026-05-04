// Reveal on Scroll logic
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);

// Initial reveal check
reveal();

// Floating Petals Animation (Hibiscus Rain)
function createPetal() {
    const petals = ['🌺', '🌸', '🏵️'];
    const petal = document.createElement('div');
    petal.innerHTML = petals[Math.floor(Math.random() * petals.length)];
    petal.style.position = 'fixed';
    petal.style.top = '-50px';
    petal.style.left = Math.random() * window.innerWidth + 'px';
    petal.style.fontSize = (Math.random() * 30 + 15) + 'px';
    petal.style.zIndex = '1000';
    petal.style.pointerEvents = 'none';
    petal.style.opacity = Math.random() * 0.5 + 0.5;
    petal.style.filter = 'drop-shadow(0 2px 5px rgba(0,0,0,0.1))';
    
    document.body.appendChild(petal);

    const animation = petal.animate([
        { transform: `translateY(0) rotate(0deg) translateX(0)`, opacity: petal.style.opacity },
        { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 1000}deg) translateX(${Math.random() * 100 - 50}px)`, opacity: 0 }
    ], {
        duration: Math.random() * 8000 + 7000,
        easing: 'cubic-bezier(.37,0,.63,1)'
    });

    animation.onfinish = () => petal.remove();
}

// Create petals every 500ms for a gentle rain
setInterval(createPetal, 500);
