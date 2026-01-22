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

        // 2. Carregar Patrocinadores
        try {
            const resPatro = await fetch(urlFrom('patrocinadores.html'));
            if (resPatro.ok) {
                const htmlPatro = await resPatro.text();
                const container = document.getElementById('patrocinadores-container');
                if (container) container.innerHTML = htmlPatro;
            }
        } catch (e) { console.error("Erro ao carregar patrocinadores:", e); }

        // 3. Carregar Notícias do JSON
        try {
            const resNoticias = await fetch(urlFrom('noticias.json'), { cache: 'no-store' });
            const noticias = await resNoticias.json();

            // Parâmetros da URL
            const params = new URLSearchParams(window.location.search);
            const cat = params.get('cat');

            // --- NOVO: LÓGICA PARA PÁGINA DE CATEGORIA ---
            const containerCat = document.getElementById('container-categoria');
            const tituloCat = document.getElementById('titulo-categoria');

            if (cat && containerCat) {
                if (tituloCat) tituloCat.innerText = "Notícias: " + cat;
                
                const filtradas = noticias.filter(n => n.categoria.toLowerCase() === cat.toLowerCase());
                
                if (filtradas.length > 0) {
                    containerCat.innerHTML = filtradas.map(n => `
                        <div class="noticia-card">
                            <img src="${n.imagem}" alt="${n.titulo}">
                            <div class="card-content">
                                <h3>${n.titulo}</h3>
                                <p>${n.resumo || ""}</p>
                                <a href="noticia.html?id=${n.id}" class="btn-leia">Leia mais</a>
                            </div>
                        </div>
                    `).join('');
                } else {
                    containerCat.innerHTML = `<p>Nenhuma notícia encontrada na categoria ${cat}.</p>`;
                }
                // Se for página de categoria, não precisamos processar o restante da home abaixo
                return; 
            }

            // --- RESTANTE DO CÓDIGO DA HOME (CARROSSEL, ETC) ---
            const track = document.getElementById('carouselTrack');
            const ticker = document.getElementById('tickerContent');
            const containerSidebar = document.getElementById('lista-sidebar-dinamica');
            const containerNoticia = document.getElementById('container-noticia');
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
                htmlTicker += `<span><a href="${n.link}">● ${n.titulo}</a></span>`;
                if (n.noCarrossel) {
                    htmlCarrossel += `<div class="slide"><a href="${n.link}"><img src="${n.imagem}"><div class="slide-content"><h2>${n.titulo}</h2><p>${n.resumo}</p></div></a></div>`;
                }
                if (index < 5) {
                    htmlSidebar += `<li><a href="${n.link}"><img src="${n.imagem}" style="width:50px;height:40px;object-fit:cover;border-radius:3px;"><span>${n.titulo}</span></a></li>`;
                }
                if (cats[n.categoria]) {
                    if (n.destaque) {
                        cats[n.categoria].destaque = `<article class="destaque"><a href="${n.link}"><img src="${n.imagem}"><h3>${n.titulo}</h3><p>${n.resumo}</p></a></article>`;
                    } else {
                        cats[n.categoria].lista += `<li><a href="${n.link}"><img src="${n.imagem}"><span>${n.titulo}</span></a></li>`;
                    }
                }
            });

            // Mais Lidas
            const containerMaisLidas = document.getElementById('lista-mais-lidas-dinamica');
            if (containerMaisLidas) {
                const noticiasOrdenadas = [...noticias].sort((a, b) => (b.views || 0) - (a.views || 0));
                const top4 = noticiasOrdenadas.slice(0, 3);
                let htmlMaisLidas = "";
                top4.forEach(n => {
                    htmlMaisLidas += `<li><a href="${n.link}"><span>${n.titulo}</span></a></li>`;
                });
                containerMaisLidas.innerHTML = htmlMaisLidas;
            }

            // Injeções Finais da Home
            if (ticker) ticker.innerHTML = htmlTicker + htmlTicker;
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

    document.addEventListener('click', function (e) {
        const btn = e.target.closest('#menuToggle');
        if (btn) {
            const nav = document.getElementById('mainNav');
            if (nav) nav.classList.toggle('active');
        }
    });

    document.addEventListener('DOMContentLoaded', inicializarPortal);
})();

// Função para Página de Notícia Individual (Mantida separada conforme seu original)
async function carregarNoticiaIndividual() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return; 

    try {
        const res = await fetch('noticias.json');
        const noticias = await res.json();
        const n = noticias.find(item => item.id == id);

        // --- LINHA NOVA PARA A DATA ---
            const elementoData = document.getElementById('data-publicacao');

        if (n) {
            const titulo = document.getElementById('titulo-pagina-noticia');
            const imagem = document.getElementById('imagem-pagina-noticia');
            const texto = document.getElementById('texto-pagina-noticia');

            if (titulo) titulo.innerText = n.titulo;
            if (imagem) imagem.src = n.imagem;
            if (texto) texto.innerHTML = n.conteudo || n.resumo;

            // --- INJETANDO A DATA DO JSON ---
            if (elementoData && n.data) {
                elementoData.innerText = "Publicado em: " + n.data;
            }
        }
    } catch (e) {
        console.error("Erro ao carregar a notícia:", e);
    }
}
document.addEventListener('DOMContentLoaded', carregarNoticiaIndividual);