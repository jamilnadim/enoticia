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
                const htmlText = await resPatro.text();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlText;
                
                let banners = Array.from(tempDiv.querySelectorAll('.banner-link'));

                if (banners.length > 0) {
                    // Embaralha para mostrar alternadamente
                    banners.sort(() => Math.random() - 0.5);

                    // --- REGRA PARA LIMITAR EM 5 APENAS NA CATEGORIA ---
                    const ePaginaCategoria = document.getElementById('container-categoria');
                    const ePaginaNoticia = document.getElementById('titulo-pagina-noticia');

                    if (ePaginaCategoria || ePaginaNoticia) {
                        banners = banners.slice(0, 5);
                    }

                    const container = document.getElementById('patrocinadores-container');
                    if (container) {
                        container.innerHTML = '<h3>Patrocinadores</h3>';
                        banners.forEach(b => container.appendChild(b));
                    }
                }
            }
        } catch (e) { console.error("Erro nos patrocinadores:", e); }

            // --- NOVAS LINHAS PARA CONTATO E ANUNCIE ---
                    // Dentro da sua função inicializarPortal
            const divContato = document.getElementById('contato');
            if (divContato) { // SÓ ENTRA SE O ELEMENTO EXISTIR NA PÁGINA
                const resContato = await fetch(urlFrom('contato.html'));
                if (resContato.ok) divContato.innerHTML = await resContato.text();
            }

            const divAnuncie = document.getElementById('anuncieaqui');
            if (divAnuncie) { // SÓ ENTRA SE O ELEMENTO EXISTIR NA PÁGINA
                const resAnuncie = await fetch(urlFrom('anuncieaqui.html'));
                if (resAnuncie.ok) divAnuncie.innerHTML = await resAnuncie.text();
            }
        // ------------------------------------------ 

        

        // 3. Carregar Notícias do JSON
        try {
            const resNoticias = await fetch(urlFrom('noticias.json'), { cache: 'no-store' });
            const noticias = await resNoticias.json();

            noticias.sort((a, b) => b.id - a.id)

            

            // Parâmetros da URL
            const params = new URLSearchParams(window.location.search);
            const cat = params.get('cat');

            // --- NOVO: LÓGICA PARA PÁGINA DE CATEGORIA ---
            // --- LÓGICA PARA PÁGINA DE CATEGORIA ---
            // --- LOCALIZAR NO SCRIPT.JS (Por volta da linha 110) ---
            const containerCat = document.getElementById('container-categoria');
            const tituloCat = document.getElementById('titulo-categoria');

            if (cat && containerCat) {
                // DICIONÁRIO PARA NOMES BONITOS (OPCIONAL)
                const nomesAmigaveis = {
                    "noticia": "Notícias",
                    "politica": "Política",
                    "saude": "Saúde",
                    "policia": "Polícia",
                    "evento": "Eventos",
                    "esporte": "Esportes",
                    "historia": "História"
                };

                // Remove o prefixo e deixa a primeira letra maiúscula
                const nomeLimpo = nomesAmigaveis[cat.toLowerCase()] || (cat.charAt(0).toUpperCase() + cat.slice(1));
                
                if (tituloCat) tituloCat.innerText = nomeLimpo;

                const filtradas = noticias.filter(n => n.categoria.toLowerCase() === cat.toLowerCase());
                // ... restante do código de filtragem ...
                
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
                        </div>
                    `).join('');
                } else {
                    containerCat.innerHTML = `<p>Nenhuma notícia encontrada na categoria ${cat}.</p>`;
                }
                // REMOVEMOS O RETURN DAQUI PARA O RESTO DA PÁGINA CARREGAR
            }

            // --- RESTANTE DO CÓDIGO DA HOME (CARROSSEL, ETC) ---
            const track = document.getElementById('carouselTrack');
            const ticker = document.getElementById('tickerContent');
            const containerSidebar = document.getElementById('lista-sidebar-dinamica');
            const containerNoticia = document.getElementById('container-noticia');
            const containerPolitica = document.getElementById('container-politica');
            const containerSaude = document.getElementById('container-saude');
            const containerPolicia = document.getElementById('container-policia');
            const containerEvento = document.getElementById('container-evento');
            const containerHistoria = document.getElementById('container-historia');
            const containerSocial = document.getElementById('container-social');
            const containerEsporte = document.getElementById('container-esporte');

            let htmlCarrossel = "", htmlTicker = "", htmlSidebar = "";
            let cats = {
                politica: { destaque: "", lista: "" },
                saude: { destaque: "", lista: "" },
                policia: { destaque: "", lista: "" },
                noticia: { destaque: "", lista: "" },
                evento: { destaque: "", lista: "" },
                historia: { destaque: "", lista: "" },
                social: { destaque: "", lista: "" },
                esporte: { destaque: "", lista: "" }
            };

            // ADICIONE ESTA LINHA AQUI (para controlar o limite de 3):
            let contadores = { politica: 0, saude: 0, policia: 0, noticia: 0, evento: 0, historia: 0, social: 0, esporte: 0 };

            noticias.forEach((n, index) => {
                if (index < 5) {
                    htmlTicker += `<span><a href="${n.link}">● ${n.titulo}</a></span>`;
                }
                //htmlTicker += `<span><a href="${n.link}">● ${n.titulo}</a></span>`;
                if (n.noCarrossel) {
                    htmlCarrossel += `<div class="slide"><a href="${n.link}"><img src="${n.imagem}"><div class="slide-content"><h2>${n.titulo}</h2><p>${n.resumo}</p></div></a></div>`;
                }
                
                if (cats[n.categoria]) {
                    if (n.destaque) {
                        cats[n.categoria].destaque = `<article class="destaque"><a href="${n.link}"><img src="${n.imagem}"><h3>${n.titulo}</h3><p>${n.resumo}</p></a></article>`;
                    } else {
                        // VERIFICA SE JÁ EXISTEM 3 NOTÍCIAS NA LISTA DESTA CATEGORIA
                        if (contadores[n.categoria] < 3) {
                            cats[n.categoria].lista += `<li><a href="${n.link}"><img src="${n.imagem}"><span>${n.titulo}</span></a></li>`;
                            contadores[n.categoria]++; // Aumenta o contador para esta categoria
                        }
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
            if (containerEvento) containerEvento.innerHTML = cats.evento.destaque + `<ul class="editoria-lista">${cats.evento.lista}</ul>`;
            if (containerHistoria) containerHistoria.innerHTML = cats.historia.destaque + `<ul class="editoria-lista">${cats.historia.lista}</ul>`;
            if (containerSocial) containerSocial.innerHTML = cats.social.destaque + `<ul class="editoria-lista">${cats.social.lista}</ul>`;
            if (containerEsporte) containerEsporte.innerHTML = cats.esporte.destaque + `<ul class="editoria-lista">${cats.esporte.lista}</ul>`;

        } catch (e) { console.error("Erro ao processar notícias:", e); }
    }

   document.addEventListener('click', function (e) {
    const btn = e.target.closest('#menuToggle');
    if (btn) {
        const nav = document.getElementById('mainNav');
        if (nav) {
            nav.classList.toggle('active');
            console.log("Menu clicado! Classe active: " + nav.classList.contains('active'));
        }
    }
});

    document.addEventListener('DOMContentLoaded', inicializarPortal);
})();

// Função para Página de Notícia Individual (Mantida separada conforme seu original)
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

            // Navegação
            const antContainer = document.getElementById('noticia-anterior');
            const proxContainer = document.getElementById('proxima-noticia');

            // Dentro de carregarNoticiaIndividual no seu script.js

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

     