(function () {
    // --------- Helpers de base/URL ---------
    function getBasePath() {
      // Se existir <base href="...">, usa ele
      const baseEl = document.querySelector('base[href]');
      if (baseEl) {
        let href = baseEl.getAttribute('href');
        if (!href.endsWith('/')) href += '/';
        return href;
      }
      // GitHub Pages (user.github.io/projeto/)
      const parts = location.pathname.split('/').filter(Boolean);
      const first = parts[0] || '';
      const KNOWN_ROOTS = ['categorias', 'assets', 'Assets', 'css', 'js', 'img', 'images'];
      if (location.hostname.endsWith('github.io') && first && !KNOWN_ROOTS.includes(first)) {
        return `/${first}/`;
      }
      return '/';
    }
  
    const BASE = getBasePath();
  
    function urlFrom(path) {
      if (!path) return BASE;
      if (path.startsWith('/')) path = path.slice(1);
      return BASE + path;
    }
  
    function includeIfExists(targetId, relativePath, afterLoad) {
      const el = document.getElementById(targetId);
      if (!el) return; // não existe na página, segue em frente
      fetch(urlFrom(relativePath), { cache: 'no-store' })
        .then(r => (r.ok ? r.text() : Promise.reject(r.status)))
        .then(html => {
          el.innerHTML = html;
          if (typeof afterLoad === 'function') afterLoad(el);
        })
        .catch(err => console.warn(`Falha ao carregar ${relativePath}:`, err));
    }
  
    // --------- MENU ---------
    function setupMenu(container = document) {
      const toggle = container.querySelector('.menu-toggle');
      const nav = container.querySelector('nav');
    
      if (toggle && nav) {
        toggle.addEventListener('click', () => {
          nav.classList.toggle('active');
          toggle.setAttribute(
            'aria-expanded',
            String(nav.classList.contains('active'))
          );
        });
    
        // Fecha ao clicar em link no mobile
        nav.querySelectorAll('a').forEach(a =>
          a.addEventListener('click', () => nav.classList.remove('active'))
        );
      }
  
      // Marca link ativo
      const current = new URL(location.href);
      const normalize = p =>
        (p || '/').replace(/index\.html$/i, '').replace(/\/+$/, '/') || '/';
  
      const currentPath = normalize(current.pathname);
  
      container.querySelectorAll('nav a').forEach(a => {
        const linkPath = normalize(new URL(a.href, location.origin).pathname);
        if (currentPath === linkPath || (linkPath !== BASE && currentPath.startsWith(linkPath))) {
          a.classList.add('active');
          a.setAttribute('aria-current', 'page');
        }
      });
    }
  
    // Carrega o menu (injetado em #menu-container)
    includeIfExists('menu-container', 'menu.html', setupMenu);
  
    // --------- FRAGMENTS: contato / anuncie aqui ---------
    includeIfExists('contato', 'contato.html');          // raiz/contato.html
    includeIfExists('anuncieaqui', 'anuncieaqui.html');  // raiz/anuncieaqui.html
  
    // --------- CARROSSEL (só se existir na página) ---------
    const track = document.querySelector('.carousel-track');
    if (track) {
      const slides = Array.from(track.children);
      let currentIndex = 0;
  
      function updateSlidePosition() {
        const w = slides[0]?.getBoundingClientRect().width || 0;
        track.style.transform = `translateX(-${w * currentIndex}px)`;
      }
  
      function moveSlide(dir) {
        currentIndex = (currentIndex + dir + slides.length) % slides.length;
        updateSlidePosition();
      }
  
      window.addEventListener('resize', updateSlidePosition);
      updateSlidePosition();
      setInterval(() => moveSlide(1), 5000);
    }

        // Controles laterais do carrossel
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => moveSlide(-1));
      nextBtn.addEventListener('click', () => moveSlide(1));
    }

  
    // --------- Data e Hora (só se existir #datetime) ---------
    const dt = document.getElementById('datetime');
    if (dt) {
      function updateDateTime() {
        const now = new Date();
        const options = {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        };
        dt.textContent = now.toLocaleDateString('pt-BR', options);
      }
      updateDateTime();
      setInterval(updateDateTime, 1000);
    }
  })();
  
  // CÓDIGO POPUP
  // Exibir popup automaticamente ao carregar a página
// --------- POPUP ---------
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("popup");
  if (!popup) return;

  const closeBtn = popup.querySelector(".popup-close");

  // abre popup
  popup.style.display = "flex";

  // Fecha no X
  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  // Fecha clicando fora do conteúdo
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.style.display = "none";
    }
  });
});

// FIM CÓDIGO POPUP

// news ticker
fetch("ultimas.html")
  .then(res => res.text())
  .then(data => {
    // pega só os <li> de dentro do arquivo
    const temp = document.createElement("div");
    temp.innerHTML = data;
    const items = temp.querySelectorAll("li a");

    let html = "";
    items.forEach(el => {
      html += `<span>${el.textContent}</span>`;
    });

    document.getElementById("tickerContent").innerHTML = html;
  });


  // PATROCINADORES EM INDEX.HTML Ajusta a altura automaticamente ao carregar o conteúdo
  const iframe = document.getElementById("patrocinadores-frame");
  iframe.onload = function() {
    iframe.style.height = iframe.contentWindow.document.body.scrollHeight + "px";
  };



  