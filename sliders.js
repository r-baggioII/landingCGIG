/* ============================================
   CGIC — Observador y Animaciones de Proyectos
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── IntersectionObserver: Reveal Escalonado ──
  const ejeBlocks = document.querySelectorAll('.eje-block');

  if (ejeBlocks.length) {
    const revealObs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Ya no animamos el contenedor, sino los .eje-anim internos escalonadamente
          const animElements = entry.target.querySelectorAll('.eje-anim');
          
          animElements.forEach((el, index) => {
            // El header y las tarjetas reciben un delay escalonado de 120ms
            setTimeout(() => {
              el.classList.add('eje-anim-visible');
            }, index * 120);
          });
          
          // Solo animamos una vez, dejamos de observar
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.15, // Se activa cuando entra un poco al viewport
      rootMargin: '0px'
    });

    ejeBlocks.forEach(b => revealObs.observe(b));
  }

});
