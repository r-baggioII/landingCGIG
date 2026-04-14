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
  const pmImages = document.getElementById('pm-images');
  const cards = document.querySelectorAll('.timeline-card');
  let activeImageLoadToken = 0;

  function clearModalImage(imgEl) {
    if (!imgEl) return;
    imgEl.style.display = 'none';
    imgEl.removeAttribute('src');
    imgEl.removeAttribute('srcset');
  }

  function loadModalImage(imgEl, src, token) {
    return new Promise(resolve => {
      if (!imgEl || !src) {
        clearModalImage(imgEl);
        resolve(false);
        return;
      }

      // Reinicia el elemento para evitar arrastre visual de una imagen previa.
      clearModalImage(imgEl);

      const preloader = new Image();
      preloader.decoding = 'async';

      preloader.onload = () => {
        if (token !== activeImageLoadToken) {
          resolve(false);
          return;
        }
        imgEl.src = src;
        imgEl.style.display = 'block';
        resolve(true);
      };

      preloader.onerror = () => {
        if (token !== activeImageLoadToken) {
          resolve(false);
          return;
        }
        clearModalImage(imgEl);
        resolve(false);
      };

      preloader.src = src;
    });
  }

  function setModalLoading(isLoading) {
    if (!pmImages) return;
    pmImages.classList.toggle('is-loading', isLoading);
  }

  // Precarga en segundo plano para que la apertura del modal sea más rápida.
  const warmupModalImages = () => {
    const uniqueSources = new Set();
    cards.forEach(card => {
      const src1 = card.getAttribute('data-img1');
      const src2 = card.getAttribute('data-img2');
      if (src1) uniqueSources.add(src1);
      if (src2) uniqueSources.add(src2);
    });

    uniqueSources.forEach(src => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(warmupModalImages, { timeout: 1500 });
  } else {
    setTimeout(warmupModalImages, 600);
  }

  if (modalOverlay) {
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const titleEl = card.querySelector('.timeline-card__title');
        const descEl = card.querySelector('.timeline-card__desc');
        const projectTitle = titleEl?.textContent?.trim() || '';
        
        if (titleEl) pmTitle.textContent = titleEl.textContent;
        if (descEl) pmDesc.textContent = descEl.textContent;
        
        const img1Src = card.getAttribute('data-img1');
        const img2Src = card.getAttribute('data-img2');
        activeImageLoadToken += 1;
        const currentToken = activeImageLoadToken;

        // Resetea siempre las imágenes antes de iniciar una nueva carga.
        clearModalImage(pmImg1);
        clearModalImage(pmImg2);
        setModalLoading(true);

        // Reset visual overrides before applying project-specific adjustments
        pmImg1.style.objectFit = 'cover';
        pmImg2.style.objectFit = 'cover';
        pmImg1.style.backgroundColor = 'transparent';
        pmImg2.style.backgroundColor = 'transparent';

        // Ajuste puntual de encuadre para Hub de Innovación dentro del mismo cuadro
        pmImg1.style.objectPosition = projectTitle === 'Hub de Innovación' ? 'center 35%' : 'center';
        pmImg2.style.objectPosition = 'center';

        // En Contención 360° y Mirada Glocal, bajamos un poco el encuadre de la primera imagen.
        if (projectTitle === 'Contención 360°' && img1Src?.includes('contencionA.jpeg')) {
          pmImg1.style.objectPosition = 'center 75%';
        }

        if (projectTitle === 'Mirada Glocal' && img1Src?.includes('miradaGlocal1.png')) {
          pmImg1.style.objectPosition = 'center 75%';
        }

        // En Acción del Sur Blockchain, priorizamos el lateral izquierdo de la imagen B2.
        if (projectTitle === 'Acción del Sur Blockchain' && img2Src?.includes('accionDelSurB2.png')) {
          pmImg2.style.objectPosition = 'left center';
        }

        // En Armar Hogar (imagen institucional), mostrar completa para que entren todos los logos
        if (projectTitle === 'Armar Hogar + Block Design' && img1Src?.includes('Presentación institucional CGIC - Armar Hogar.jpg')) {
          pmImg1.style.objectFit = 'contain';
          pmImg1.style.backgroundColor = 'rgba(10, 14, 26, 0.35)';
        }
        
        Promise.all([
          loadModalImage(pmImg1, img1Src, currentToken),
          loadModalImage(pmImg2, img2Src, currentToken)
        ]).finally(() => {
          if (currentToken !== activeImageLoadToken) return;
          setModalLoading(false);
        });
        
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      activeImageLoadToken += 1;
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      setModalLoading(false);
      clearModalImage(pmImg1);
      clearModalImage(pmImg2);
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

});
