<?php
/**
 * VERSÃO PROFISSIONAL - É NOTÍCIA SACRAMENTO
 * Este código garante a imagem no WhatsApp e estabilidade no layout.
 */

// 1. Captura o ID com segurança
$id_noticia = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// 2. Carrega o JSON de forma silenciosa (@) para não exibir erros na tela
$json_path = __DIR__ . '/noticias.json';
$noticia_meta = null;

if (file_exists($json_path)) {
    $dados = json_decode(file_get_contents($json_path), true);
    if ($dados) {
        foreach ($dados as $n) {
            if ($n['id'] == $id_noticia) {
                $noticia_meta = $n;
                break;
            }
        }
    }
}

// 3. Define as variáveis das redes sociais (Fallback se não achar a notícia)
$titulo_site = ($noticia_meta) ? $noticia_meta['titulo'] : "É Notícia Sacramento";
$resumo_site = ($noticia_meta) ? strip_tags($noticia_meta['resumo']) : "Acompanhe as últimas notícias de Sacramento e região.";
$imagem_site = "https://enoticiasacramento.com.br/Assets/logo_compartilhamento.jpg";

if ($noticia_meta && !empty($noticia_meta['imagem'])) {
    // Garante que o caminho da imagem seja absoluto para o WhatsApp
    $imagem_site = "https://enoticiasacramento.com.br/" . ltrim($noticia_meta['imagem'], '/');
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title><?php echo $titulo_site; ?></title>
    <meta name="description" content="<?php echo $resumo_site; ?>">
    <meta property="og:type" content="article">
    <meta property="og:title" content="<?php echo $titulo_site; ?>">
    <meta property="og:description" content="<?php echo $resumo_site; ?>">
    <meta property="og:image" content="<?php echo $imagem_site; ?>">
    <meta property="og:url" content="https://enoticiasacramento.com.br/noticia.php?id=<?php echo $id_noticia; ?>">
    <meta property="og:site_name" content="É Notícia Sacramento">

    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>
<body class="noticia-page">
    <header>
        <div class="logo">
            <a href="index.html">
                <img src="Assets/Patrocinio/logosite.png" alt="Logo É Notícia">
            </a>
        </div>
        <div id="menu-container"></div> 
    </header>

    <main class="layout">
        <article class="conteudo-principal">
            <h1 id="titulo-pagina-noticia"><?php echo ($noticia_meta) ? $noticia_meta['titulo'] : ""; ?></h1>
            <p id="data-publicacao" class="data-postagem"><?php echo ($noticia_meta) ? "Publicado em: " . $noticia_meta['data'] : ""; ?></p>
            <!--
            <img id="imagem-pagina-noticia" 
                 src="<?php echo ($noticia_meta) ? $noticia_meta['imagem'] : ""; ?>" 
                 alt="" 
                 style="width:100%; border-radius:8px; <?php echo (!$noticia_meta) ? 'display:none;' : ''; ?>">
                -->
            <img id="imagem-pagina-noticia" 
                src="<?php echo ($noticia_meta) ? $noticia_meta['imagem'] : ""; ?>" 
                alt="" 
                style="width:100%; border-radius:8px; <?php echo ($noticia_meta && isset($noticia_meta['estilo_imagem'])) ? $noticia_meta['estilo_imagem'] : ''; ?> <?php echo (!$noticia_meta) ? 'display:none;' : ''; ?>">
            
            <div id="texto-pagina-noticia" class="texto-noticia">
                <?php echo ($noticia_meta) ? $noticia_meta['conteudo'] : "Carregando..."; ?>
            </div>
            
            <div class="share-container">
    <span>Compartilhe:</span>
    
    <a href="https://api.whatsapp.com/send?text=<?php echo urlencode($titulo_site . " - " . "https://enoticiasacramento.com.br/noticia.php?id=" . $id_noticia); ?>" target="_blank" class="share-btn whatsapp">
        <i class="fab fa-whatsapp"></i>
    </a>

    <a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode("https://enoticiasacramento.com.br/noticia.php?id=" . $id_noticia); ?>" target="_blank" class="share-btn facebook">
        <i class="fab fa-facebook-f"></i>
    </a>

    <button onclick="copiarLink()" class="share-btn copy">
        <i class="fas fa-link"></i>
    </button>
</div>

            <div class="navegacao-noticia">
                <div id="noticia-anterior" class="nav-box"></div>
                <div id="proxima-noticia" class="nav-box"></div>
            </div>
        </article>

        <aside class="sidebar">
            <div id="patrocinadores-container"></div>
        </aside>
    </main>

    <script src="script.js"></script>
    <script src="script0.js"></script>
</body>
</html>