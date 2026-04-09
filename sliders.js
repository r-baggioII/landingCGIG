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

  // ── Modal de Proyectos ──
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('project-modal-close');
  const pmTitle = document.getElementById('pm-title');
  const pmDesc = document.getElementById('pm-desc');
  const pmImg1 = document.getElementById('pm-img1');
  const pmImg2 = document.getElementById('pm-img2');
  const cards = document.querySelectorAll('.timeline-card');

  if (modalOverlay) {
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const titleEl = card.querySelector('.timeline-card__title');
        const descEl = card.querySelector('.timeline-card__desc');
        
        if (titleEl) pmTitle.textContent = titleEl.textContent;
        if (descEl) pmDesc.textContent = descEl.textContent;
        
        const img1Src = card.getAttribute('data-img1');
        const img2Src = card.getAttribute('data-img2');
        
        if (img1Src) {
            pmImg1.src = img1Src;
            pmImg1.style.display = 'block';
        } else {
            pmImg1.style.display = 'none';
            pmImg1.src = '';
        }
        
        if (img2Src) {
            pmImg2.src = img2Src;
            pmImg2.style.display = 'block';
        } else {
            pmImg2.style.display = 'none';
            pmImg2.src = '';
        }
        
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

});
