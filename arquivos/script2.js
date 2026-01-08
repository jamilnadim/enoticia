
        // Carrega o contato.html dentro da div #contato
        fetch("../../contato.html")
        .then(response => response.text())
        .then(data => {
          document.getElementById("contato").innerHTML = data;
        })
        .catch(error => console.error("Erro ao carregar o contato:", error));

        // Carrega o anuncieaqui.html dentro da div #contato
        fetch("../../anuncieaqui.html")
        .then(response => response.text())
        .then(data => {
          document.getElementById("anuncieaqui").innerHTML = data;
        })
        .catch(error => console.error("Erro ao carregar o contato:", error));
    
    /* SCRIPT PARA CARREGAR O MENU
    fetch('menu.html')
      .then(res => res.text())
      .then(data => {
        const placeholder = document.getElementById('menu-placeholder');
        placeholder.innerHTML = data;
        // Adiciona as classes do header original para manter o estilo
        placeholder.className = 'seu-header-class'; // Se você tiver uma classe específica no header, coloque aqui
      })
      .catch(error => console.error('Erro ao carregar o menu:', error));*/

      //CARREGA MENU NOVO
      (function() {
        const container = document.getElementById('menu-container');
      
        function afterMenuLoad() {
          // Liga o sanduíche
          const toggle = container.querySelector('.menu-toggle');
          const nav = container.querySelector('nav');
          if (toggle && nav) {
            toggle.addEventListener('click', () => {
              nav.classList.toggle('active');
              const expanded = toggle.getAttribute('aria-expanded') === 'true';
              toggle.setAttribute('aria-expanded', String(!expanded));
            });
          }
      
          // Define link ativo de forma robusta
          const currentPath = (location.pathname || '/')
            .replace(/\/+$/, '')               // remove barra no fim
            || '/';
      
          container.querySelectorAll('nav a').forEach(a => {
            const linkPath = new URL(a.getAttribute('href'), location.origin).pathname
              .replace(/\/+$/, '') || '/';
      
            const isHome =
              (currentPath === '/' || currentPath.endsWith('/')) &&
              (linkPath === '/' || linkPath.endsWith('/'));
      
            const isSame =
              linkPath === currentPath ||
              (currentPath !== '/' && currentPath.endsWith(linkPath));
      
            if (isHome || isSame) {
              a.classList.add('active');
              a.setAttribute('aria-current', 'page');
            }
          });
        }
      
        function loadMenu() {
          fetch('/menu.html', { cache: 'no-store' })
            .then(r => {
              if (!r.ok) throw new Error(r.statusText);
              return r.text();
            })
            .then(html => {
              container.innerHTML = html;
              afterMenuLoad();
            })
            .catch(() => {
              // Fallback se fetch falhar (ex.: abrindo com file://)
              container.innerHTML = `
                <div class="menu-toggle" aria-label="Abrir menu" aria-expanded="false">☰</div>
                <nav>
                  <a href="/index.html">Início</a>
                  <a href="categorias/noticias/">Notícias</a>
                  <a href="categorias/eventos/">Eventos</a>
                  <a href="categorias/historia/">História</a>
                  <a href="categorias/saude/">Saúde</a>
                  <a href="categorias/policia/">Polícia</a>
                  <a href="categorias/social/">Social</a>
                  <a href="categorias/politica/">Política</a>
                  <a href="categorias/esportes/">Esportes</a>
                  <a href="contatopage.html">Contato</a>
                </nav>
              `;
              afterMenuLoad();
            });
        }
      
        document.readyState === 'loading'
          ? document.addEventListener('DOMContentLoaded', loadMenu)
          : loadMenu();
      })();


    // SEUS SCRIPTS ORIGINAIS
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const totalSlides = slides.length;
    let currentIndex = 0;
  
    function updateSlidePosition() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    }
  
    function moveSlide(direction) {
      currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
      updateSlidePosition();
    }
  
    window.addEventListener('resize', updateSlidePosition);
    updateSlidePosition();
  
    setInterval(() => {
      moveSlide(1);
    }, 5000);

    // função data e hora
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
    const dateTimeStr = now.toLocaleDateString('pt-BR', options);
    document.getElementById('datetime').textContent = dateTimeStr;
  }

  updateDateTime(); // atualiza na carga
  setInterval(updateDateTime, 1000); // atualiza a cada segundo
 
