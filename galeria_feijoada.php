<?php
// Configurações da Galeria
$total_fotos = 529;
$fotos_por_pagina = 70;
$total_paginas = ceil($total_fotos / $fotos_por_pagina);

// Recebe a página atual via URL (ex: galeria_feijoada.php?p=2), padrão = 1
$pagina = isset($_GET['p']) ? intval($_GET['p']) : 1;
if ($pagina < 1) $pagina = 1;
if ($pagina > $total_paginas) $pagina = $total_paginas;

$inicio = ($pagina - 1) * $fotos_por_pagina + 1;
$fim = min($pagina * $fotos_por_pagina, $total_fotos);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galeria de Fotos - FEIJOADA SUNSET 2026</title>

<!-- Meta Tags para Prévia no WhatsApp / Redes Sociais -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://enoticiasacramento.com.br/galeria_feijoada.php">
<meta property="og:title" content="Galeria de Fotos - FEIJOADA SUNSET 2026 | É Notícia">
<meta property="og:description" content="Confira a cobertura completa de fotos da Feijoada Sunset 2026 no portal É Notícia Sacramento.">

<!-- Apontando para o arquivo JPG com URL completa -->
<meta property="og:image" content="https://enoticiasacramento.com.br/Assets/noticias/feijoada2026.jpg">
<meta property="og:image:secure_url" content="https://enoticiasacramento.com.br/Assets/noticias/feijoada2026.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

    <!-- Fancybox 5 CSS (Biblioteca para Zoom e Efeitos de Galeria) -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css" />

    <!-- Otimização: Preload das primeiras 8 imagens para acelerar a renderização inicial -->
    <?php 
    $preload_limite = min($inicio + 7, $fim);
    for ($i = $inicio; $i <= $preload_limite; $i++): 
    ?>
        <link rel="preload" as="image" href="Assets/noticias/Feijoada2026/BANANAL 2026-<?php echo $i; ?>.webp" type="image/webp">
    <?php endfor; ?>

    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        
        /* Estilização e Animação do Banner de Cabeçalho */
        .banner-container {
            width: 100%;
            margin-bottom: 25px;
            overflow: hidden;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            animation: entradaSuave 1.2s ease-out;
        }

        .banner-cabecalho {
            width: 100%;
            height: auto;
            display: block;
            transition: transform 0.5s ease;
        }

        .banner-cabecalho:hover {
            transform: scale(1.015);
        }

        /* Animação Keyframes para o surgimento do cabeçalho */
        @keyframes entradaSuave {
            0% {
                opacity: 0;
                transform: translateY(-15px) scale(0.98);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .header-galeria { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
        .btn-voltar { display: inline-block; padding: 10px 18px; background: #6c757d; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; transition: background 0.2s; }
        .btn-voltar:hover { background: #5a6268; }

        /* Ajuste da Grid para Fotos Verticais */
        .grid-fotos { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); 
            gap: 12px; 
            margin-bottom: 30px; 
        }
        
        .grid-fotos a {
            display: block;
            overflow: hidden;
            border-radius: 8px;
            background-color: #e9ecef; /* Skeleton/placeholder suave enquanto carrega */
        }

        .grid-fotos img { 
            width: 100%; 
            height: 100%;
            aspect-ratio: 3 / 4; /* Força proporção vertical agradável */
            object-fit: cover; 
            display: block;
            cursor: pointer; 
            transition: transform 0.3s ease, filter 0.3s ease; 
        }

        .grid-fotos img:hover { 
            transform: scale(1.05); 
            filter: brightness(1.05);
        }

        /* Layout da Paginação com Separação dos Botões Liberais */
        .paginacao-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 25px;
            min-height: 40px;
        }

        .acoes-sociais-esquerda {
            position: absolute;
            left: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .paginacao { 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            gap: 6px; 
            flex-wrap: wrap; 
        }

        .paginacao a, .paginacao span { padding: 8px 14px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: bold; }
        .paginacao a { background: #f0f0f0; color: #007bff; transition: all 0.2s; }
        .paginacao a:hover { background: #007bff; color: #fff; }
        .paginacao .atual { background: #007bff; color: #fff; }
        .paginacao .desativado { background: #e9ecef; color: #adb5bd; }

        /* Botões Redondos de Ação */
        .btn-icon-redondo {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 36px !important;
            height: 36px !important;
            padding: 0 !important;
            border-radius: 50% !important;
            border: none;
            cursor: pointer;
            transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .btn-icon-redondo:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .btn-whatsapp-redondo {
            background-color: #25D366 !important;
            color: #fff !important;
        }

        .btn-whatsapp-redondo:hover {
            background-color: #1eb857 !important;
        }

        .btn-copiar-redondo {
            background-color: #4A5568 !important;
            color: #fff !important;
        }

        .btn-copiar-redondo:hover {
            background-color: #2D3748 !important;
        }

        .btn-copiar-redondo.copiado {
            background-color: #28a745 !important;
        }

        /* Ajustes específicos para telas de Celulares */
        @media (max-width: 768px) {
            body { padding: 10px; }
            .container { padding: 15px; }
            .grid-fotos { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 8px; }

            /* Em telas menores, alinha tudo ao centro para evitar sobreposição */
            .paginacao-wrapper {
                flex-direction: column;
                gap: 15px;
            }
            .acoes-sociais-esquerda {
                position: static;
                justify-content: center;
            }
        }
    </style>
</head>
<body>

<div class="container">
    <!-- Banner Responsivo: Alterna automaticamente entre Vertical (Celular) e Horizontal (PC) -->
    <div class="banner-container">
        <picture>
            <!-- Imagem Vertical para Dispositivos Móveis (até 768px) -->
            <source media="(max-width: 768px)" srcset="Assets/noticias/cabecalhofeijoadavertical.webp">
            <!-- Imagem Horizontal para Desktops/Notebooks (acima de 768px) -->
            <source media="(min-width: 769px)" srcset="Assets/noticias/cabecalhofeijoada.webp">
            <!-- Fallback padrão -->
            <img src="Assets/noticias/cabecalhofeijoada.webp" alt="Patrocinadores e Organizadores - Feijoada Sunset 2026" class="banner-cabecalho">
        </picture>
    </div>

    <div class="header-galeria">
        <div>
            <h2 style="margin: 0; color: #111;">Coletânea de Fotos - FEIJOADA SUNSET 2026</h2>
            <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Exibindo fotos <?php echo $inicio; ?> até <?php echo $fim; ?> (Página <?php echo $pagina; ?> de <?php echo $total_paginas; ?>)</p>
        </div>
        <a href="noticia.php?id=387" class="btn-voltar">← Voltar para a Matéria</a>
    </div>

    <!-- Grade de Fotos Verticais -->
    <div class="grid-fotos">
        <?php for ($i = $inicio; $i <= $fim; $i++): ?>
            <a data-fancybox="gallery" 
               data-caption="Foto <?php echo $i; ?> de <?php echo $total_fotos; ?>" 
               href="Assets/noticias/Feijoada2026/BANANAL 2026-<?php echo $i; ?>.webp">
                <img src="Assets/noticias/Feijoada2026/BANANAL 2026-<?php echo $i; ?>.webp" 
                     alt="Foto <?php echo $i; ?>" 
                     loading="lazy" 
                     decoding="async">
            </a>
        <?php endfor; ?>
    </div>

    <!-- Bloco da Paginação + Ações Sociais Separadas -->
    <div class="paginacao-wrapper">
        <!-- Ícones Sociais Alinhados à Esquerda -->
        <div class="acoes-sociais-esquerda">
            <!-- Ícone Redondo WhatsApp -->
            <a href="https://api.whatsapp.com/send?text=Confira%20as%20fotos%20da%20Feijoada%20Sunset%202026%3A%20https%3A%2F%2Fenoticiasacramento.com.br%2Fgaleria_feijoada.php" 
               target="_blank" 
               class="btn-icon-redondo btn-whatsapp-redondo" 
               title="Compartilhar no WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
            </a>

            <!-- Ícone Redondo Copiar Link -->
            <button type="button" 
                    class="btn-icon-redondo btn-copiar-redondo" 
                    id="btnCopiarLink" 
                    onclick="copiarLinkGaleria()" 
                    title="Copiar Link da Galeria">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            </button>
        </div>

        <!-- Navegação / Paginação Centralizada -->
        <div class="paginacao">
            <?php if ($pagina > 1): ?>
                <a href="galeria_feijoada.php?p=<?php echo $pagina - 1; ?>">« Anterior</a>
            <?php else: ?>
                <span class="desativado">« Anterior</span>
            <?php endif; ?>

            <?php for ($p = 1; $p <= $total_paginas; $p++): ?>
                <?php if ($p == $pagina): ?>
                    <span class="atual"><?php echo $p; ?></span>
                <?php else: ?>
                    <a href="galeria_feijoada.php?p=<?php echo $p; ?>"><?php echo $p; ?></a>
                <?php endif; ?>
            <?php endfor; ?>

            <?php if ($pagina < $total_paginas): ?>
                <a href="galeria_feijoada.php?p=<?php echo $pagina + 1; ?>">Próxima »</a>
            <?php else: ?>
                <span class="desativado">Próxima »</span>
            <?php endif; ?>
        </div>
    </div>
</div>

<!-- Fancybox 5 JS (Biblioteca de Visualização/Zoom) -->
<script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js"></script>
<script>
    // Inicialização do Fancybox
    Fancybox.bind('[data-fancybox="gallery"]', {
        Toolbar: {
            display: {
                left: ["infobar"],
                middle: [],
                right: ["slideshow", "fullscreen", "thumbs", "close"],
            },
        },
        Images: {
            zoom: true,
        },
        Thumbs: {
            autoStart: false,
        },
        Transition: "fade"
    });

    // Função para Copiar o Link Atual da Galeria
    function copiarLinkGaleria() {
        const url = window.location.href;
        const btn = document.getElementById('btnCopiarLink');

        navigator.clipboard.writeText(url).then(() => {
            btn.classList.add('copiado');

            setTimeout(() => {
                btn.classList.remove('copiado');
            }, 2500);
        }).catch(err => {
            console.error('Erro ao copiar link: ', err);
        });
    }
</script>

</body>
</html>