  // Pequeña animación suave al hacer clic en los enlaces del menú
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });


        //banner
          const images = [
    "Content/banner1.png",
    "Content/banner2.png",
    "Content/banner3.png"
];
let index = 0;
setInterval(() => {
    document.querySelector(".banner").style.backgroundImage = `url('${images[index]}')`;
    index = (index + 1) % images.length;
}, 4000);