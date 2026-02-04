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
 // --- FUNÇÃO MESTRE: CARREGA TUDO EM PARALELO (MODO TURBO) ---
    async function inicializarPortal() {
        
        try {
            // DISPARA TODOS OS PEDIDOS AO MESMO TEMPO (Gargalo zero)
            const promessaMenu = fetch(urlFrom('menu.html'));
            const promessaPatro = fetch(urlFrom('patrocinadores.html'));
            const promessaNoticias = fetch(urlFrom('noticias.json'), { cache: 'default' });
            const promessaContato = fetch(urlFrom('contato.html'));
            const promessaAnuncie = fetch(urlFrom('anuncieaqui.html'));

            // 1. Processa o Menu imediatamente ao chegar
            promessaMenu.then(res => res.ok && res.text()).then(html => {
                if (html) document.getElementById('menu-container').innerHTML = html;
            }).catch(e => console.error("Erro menu:", e));

            // 2. Processa Contato e Anuncie
            promessaContato.then(res => res.ok && res.text()).then(html => {
                const div = document.getElementById('contato');
                if (div && html) div.innerHTML = html;
            });
            promessaAnuncie.then(res => res.ok && res.text()).then(html => {
                const div = document.getElementById('anuncieaqui');
                if (div && html) div.innerHTML = html;
            });

            // 3. Processa Patrocinadores
            promessaPatro.then(res => res.ok && res.text()).then(html => {
                if (!html) return;
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                let banners = Array.from(tempDiv.querySelectorAll('.banner-link'));
                if (banners.length > 0) {
                    banners.sort(() => Math.random() - 0.5);
                    const ePaginaCategoria = document.getElementById('container-categoria');
                    const ePaginaNoticia = document.getElementById('titulo-pagina-noticia');
                    if (ePaginaCategoria || ePaginaNoticia) banners = banners.slice(0, 5);
                    const container = document.getElementById('patrocinadores-container');
                    if (container) {
                        container.innerHTML = '<h3>Patrocinadores</h3>';
                        banners.forEach(b => container.appendChild(b));
                    }
                }
            });

            // 4. Aguarda as Notícias e processa Categorias/Carrossel
            const resNoticias = await promessaNoticias;
            const noticias = await resNoticias.json();

            // Ordena por ID (mais nova primeiro)
            noticias.sort((a, b) => b.id - a.id);

            // --- LÓGICA DE CATEGORIA (CORREÇÃO DO TÍTULO) ---
            const params = new URLSearchParams(window.location.search);
            const cat = params.get('cat');
            const containerCat = document.getElementById('container-categoria');
            const tituloCat = document.getElementById('titulo-categoria');

            if (cat) {
                const nomesAmigaveis = {
                    "noticia": "Notícias",
                    "politica": "Política",
                    "saude": "Saúde",
                    "policia": "Polícia",
                    "evento": "Eventos",
                    "esporte": "Esportes",
                    "historia": "História",
                    "social": "Social"
                };

                const nomeExibicao = nomesAmigaveis[cat.toLowerCase()] || (cat.charAt(0).toUpperCase() + cat.slice(1));
                
                // Coloca o título na página
                if (tituloCat) tituloCat.innerText = nomeExibicao;

                // Lista as notícias da categoria se o container existir
                if (containerCat) {
                    const filtradas = noticias.filter(n => n.categoria.toLowerCase() === cat.toLowerCase());
                    if (filtradas.length > 0) {
                        containerCat.innerHTML = filtradas.map(n => `
                            <div class="noticia-card">
                                <a href="noticia.html?id=${n.id}" class="link-noticia">
                                    <img src="${n.imagem}" alt="${n.titulo}">
                                    <div class="card-content">
                                        <h3>${n.titulo}</h3>
                                        <p>${n.resumo || ""}</p>
                                    </div>
                                </a>
                            </div>`).join('');
                    } else {
                        containerCat.innerHTML = `<p>Nenhuma notícia encontrada em ${nomeExibicao}.</p>`;
                    }
                }
            }

            // --- SEÇÃO DA HOME (CARROSSEL E TICKER) ---
            const track = document.getElementById('carouselTrack');
            const ticker = document.getElementById('tickerContent');
            let htmlCarrossel = "", htmlTicker = "";
            let contadores = { politica: 0, saude: 0, policia: 0, noticia: 0, evento: 0, historia: 0, social: 0, esporte: 0 };
            let cats = { politica: { destaque: "", lista: "" }, saude: { destaque: "", lista: "" }, policia: { destaque: "", lista: "" }, noticia: { destaque: "", lista: "" }, evento: { destaque: "", lista: "" }, historia: { destaque: "", lista: "" }, social: { destaque: "", lista: "" }, esporte: { destaque: "", lista: "" } };

            let contadorCarrossel = 0;
            noticias.forEach((n, index) => {
                if (index < 5) htmlTicker += `<span><a href="${n.link}">● ${n.titulo}</a></span>`;
                
                // Carrossel limitado a 10
                if (n.noCarrossel === true && contadorCarrossel < 10) {
                    htmlCarrossel += `<div class="slide"><a href="${n.link}"><img src="${n.imagem}"><div class="slide-content"><h2>${n.titulo}</h2><p>${n.resumo}</p></div></a></div>`;
                    contadorCarrossel++;
                }
                
                if (cats[n.categoria]) {
                    if (n.destaque) {
                        cats[n.categoria].destaque = `<article class="destaque"><a href="${n.link}"><img src="${n.imagem}"><h3>${n.titulo}</h3><p>${n.resumo}</p></a></article>`;
                    } else if (contadores[n.categoria] < 3) {
                        cats[n.categoria].lista += `<li><a href="${n.link}"><img src="${n.imagem}"><span>${n.titulo}</span></a></li>`;
                        contadores[n.categoria]++;
                    }
                }
            });

            if (ticker) ticker.innerHTML = htmlTicker + htmlTicker;
            if (track) {
                track.innerHTML = htmlCarrossel;
                if (typeof setupCarousel === 'function') setupCarousel();
            }

            // Preenche as editorias na Home
            Object.keys(cats).forEach(c => {
                const container = document.getElementById(`container-${c}`);
                if (container) container.innerHTML = cats[c].destaque + `<ul class="editoria-lista">${cats[c].lista}</ul>`;
            });

        } catch (e) { console.error("Erro ao processar portal:", e); }
    }

    document.addEventListener('click', function (e) {
        const btn = e.target.closest('#menuToggle');
        if (btn) {
            const nav = document.getElementById('mainNav');
            if (nav) {
                nav.classList.toggle('active');
            }
        }
    });

    document.addEventListener('DOMContentLoaded', inicializarPortal);
})();

// Função para Página de Notícia Individual
async function carregarNoticiaIndividual() {
    const params = new URLSearchParams(window.location.search);
    const idStr = params.get('id');
    if (!idStr) return; 
    const id = parseInt(idStr);

    try {
        const res = await fetch('noticias.json');
        const noticias = await res.json();
        const index = noticias.findIndex(item => parseInt(item.id) === id);
        const n = noticias[index];

        if (n) {
            document.getElementById('titulo-pagina-noticia').innerText = n.titulo;
            document.getElementById('imagem-pagina-noticia').src = n.imagem;
            document.getElementById('texto-pagina-noticia').innerHTML = n.conteudo || n.resumo;
            
            const elementoData = document.getElementById('data-publicacao');
            if (elementoData && n.data) elementoData.innerText = "Publicado em: " + n.data;

            const antContainer = document.getElementById('noticia-anterior');
            const proxContainer = document.getElementById('proxima-noticia');

            if (antContainer && index > 0) {
                const ant = noticias[index - 1];
                antContainer.innerHTML = `
                    <a href="noticia.html?id=${ant.id}">
                        <span><i class="fas fa-arrow-left" style="margin-right:8px"></i> Anterior</span>
                        <strong>${ant.titulo.substring(0, 38)}...</strong>
                    </a>`;
            }

            if (proxContainer && index < noticias.length - 1) {
                const prox = noticias[index + 1];
                proxContainer.innerHTML = `
                    <a href="noticia.html?id=${prox.id}">
                        <span>Próxima <i class="fas fa-arrow-right" style="margin-left:8px"></i></span>
                        <strong>${prox.titulo.substring(0, 38)}...</strong>
                    </a>`;
            }
        }
    } catch (e) { console.error("Erro:", e); }
}

document.addEventListener('DOMContentLoaded', carregarNoticiaIndividual);