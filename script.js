(function () {
    // --- Helpers de URL para o GitHub Pages ---
    function getBasePath() {
        const baseEl = document.querySelector('base[href]');
        if (baseEl) {
            let href = baseEl.getAttribute('href');
            if (!href.endsWith('/')) href += '/';
            return href;
        }
        const parts = location.pathname.split('/').filter(Boolean);
        const first = parts[0] || '';
        const KNOWN_ROOTS = ['categorias', 'assets', 'Assets', 'css', 'js', 'img', 'images'];
        if (location.hostname.endsWith('github.io') && first && !KNOWN_ROOTS.includes(first)) {
            return `/${first}/`;
        }
        return '/';
    }

    const BASE = getBasePath();
    const urlFrom = (path) => (path.startsWith('/') ? BASE + path.slice(1) : BASE + path);

    // --- FUNÇÃO MESTRE: CARREGA TUDO EM ORDEM ---
    async function inicializarPortal() {
        // 1. Carregar o Menu
        try {
            const resMenu = await fetch(urlFrom('menu.html'));
            if (resMenu.ok) {
                document.getElementById('menu-container').innerHTML = await resMenu.text();
            }
        } catch (e) { console.error("Erro ao carregar menu:", e); }

        // 2. Carregar Patrocinadores (Isso cria o espaço para a sidebar)
        try {
            const resPatro = await fetch(urlFrom('patrocinadores.html'));
            if (resPatro.ok) {
                const htmlPatro = await resPatro.text();
                // Injeta no local onde antes estava o iframe ou container
                const container = document.getElementById('patrocinadores-container');
                if (container) container.innerHTML = htmlPatro;
            }
        } catch (e) { console.error("Erro ao carregar patrocinadores:", e); }

        // 3. Carregar Notícias do JSON
        try {
            const resNoticias = await fetch(urlFrom('noticias.json'), { cache: 'no-store' });
            const noticias = await resNoticias.json();

            // Containers
            const track = document.getElementById('carouselTrack');
            const ticker = document.getElementById('tickerContent');
            const containerSidebar = document.getElementById('lista-sidebar-dinamica');
            const containerNoticia= document.getElementById('container-noticia');
            const containerPolitica = document.getElementById('container-politica');
            const containerSaude = document.getElementById('container-saude');
            const containerPolicia = document.getElementById('container-policia');

            let htmlCarrossel = "", htmlTicker = "", htmlSidebar = "";
            let cats = {
                politica: { destaque: "", lista: "" },
                saude: { destaque: "", lista: "" },
                policia: { destaque: "", lista: "" },
                noticia: { destaque: "", lista: "" }
            };

            noticias.forEach((n, index) => {
                // Letreiro
                htmlTicker += `<span><a href="${n.link}">● ${n.titulo}</a></span>`;

                // Carrossel
                if (n.noCarrossel) {
                    htmlCarrossel += `<div class="slide"><a href="${n.link}"><img src="${n.imagem}"><div class="slide-content"><h2>${n.titulo}</h2><p>${n.resumo}</p></div></a></div>`;
                }

                // Sidebar (Últimas 5)
                if (index < 5) {
                    htmlSidebar += `<li><a href="${n.link}"><img src="${n.imagem}" style="width:50px;height:40px;object-fit:cover;border-radius:3px;"><span>${n.titulo}</span></a></li>`;
                }

                // Categorias
                if (cats[n.categoria]) {
                    if (n.destaque) {
                        cats[n.categoria].destaque = `<article class="destaque"><a href="${n.link}"><img src="${n.imagem}"><h3>${n.titulo}</h3><p>${n.resumo}</p></a></article>`;
                    } else {
                        cats[n.categoria].lista += `<li><a href="${n.link}"><img src="${n.imagem}"><span>${n.titulo}</span></a></li>`;
                    }
                }

              // --- LÓGICA PARA AS MAIS LIDAS ---
const containerMaisLidas = document.getElementById('lista-mais-lidas-dinamica');
if (containerMaisLidas) {
    // 1. Criamos uma cópia das notícias e ordenamos pelo campo 'views'
    const noticiasOrdenadas = [...noticias].sort((a, b) => (b.views || 0) - (a.views || 0));
    
    // 2. Pegamos as 4 primeiras com mais views
    const top4 = noticiasOrdenadas.slice(0, 3);
    
    let htmlMaisLidas = "";
    top4.forEach(n => {
        htmlMaisLidas += `
            <li>
                <a href="${n.link}">
                    <span>${n.titulo}</span>
                </a>
            </li>`;
    });
    containerMaisLidas.innerHTML = htmlMaisLidas;
}

// --- LÓGICA PARA AS ÚLTIMAS NOTÍCIAS (SIDEBAR) ---
const containerUltimas = document.getElementById('lista-sidebar-dinamica');
if (containerUltimas) {
    // Aqui não ordenamos, pegamos as primeiras da lista (que costumam ser as novas)
    const ultimas5 = noticias.slice(0, 5);
    
    let htmlUltimas = "";
    ultimas5.forEach(n => {
        htmlUltimas += `
            <li>
                <a href="${n.link}">
                    <img src="${n.imagem}" style="width:50px; height:40px; object-fit:cover; border-radius:3px;">
                    <span>${n.titulo}</span>
                </a>
            </li>`;
    });
    containerUltimas.innerHTML = htmlUltimas;
}
            });

            // Injeções Finais
            if (ticker) ticker.innerHTML = htmlTicker + htmlTicker; // Duplicado para o loop
            if (track) {
                track.innerHTML = htmlCarrossel;
                if (typeof setupCarousel === 'function') setupCarousel();
            }
            if (containerSidebar) containerSidebar.innerHTML = htmlSidebar;
            
            if (containerPolitica) containerPolitica.innerHTML = cats.politica.destaque + `<ul class="editoria-lista">${cats.politica.lista}</ul>`;
            if (containerSaude) containerSaude.innerHTML = cats.saude.destaque + `<ul class="editoria-lista">${cats.saude.lista}</ul>`;
            if (containerPolicia) containerPolicia.innerHTML = cats.policia.destaque + `<ul class="editoria-lista">${cats.policia.lista}</ul>`;
            if (containerNoticia) containerNoticia.innerHTML = cats.noticia.destaque + `<ul class="editoria-lista">${cats.noticia.lista}</ul>`;

        } catch (e) { console.error("Erro ao processar notícias:", e); }
    }

    // --- Delegação de Evento para o Menu Mobile ---
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('#menuToggle');
        if (btn) {
            const nav = document.getElementById('mainNav');
            if (nav) nav.classList.toggle('active');
        }
    });

    // Iniciar tudo
    document.addEventListener('DOMContentLoaded', inicializarPortal);
})();