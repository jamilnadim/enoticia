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
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header-galeria { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
        .btn-voltar { display: inline-block; padding: 10px 18px; background: #6c757d; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; }
        .grid-fotos { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; margin-bottom: 30px; }
        .grid-fotos img { width: 100%; height: 110px; object-fit: cover; border-radius: 6px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .grid-fotos img:hover { transform: scale(1.03); box-shadow: 0 4px 10px rgba(0,0,0,0.15); }
        .paginacao { display: flex; justify-content: center; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 20px; }
        .paginacao a, .paginacao span { padding: 8px 14px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: bold; }
        .paginacao a { background: #f0f0f0; color: #007bff; }
        .paginacao a:hover { background: #007bff; color: #fff; }
        .paginacao .atual { background: #007bff; color: #fff; }
        .paginacao .desativado { background: #e9ecef; color: #adb5bd; }
    </style>
</head>
<body>

<div class="container">
    <div class="header-galeria">
        <div>
            <h2 style="margin: 0; color: #111;">Coletânea de Fotos - FEIJOADA SUNSET 2026</h2>
            <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Exibindo fotos <?php echo $inicio; ?> até <?php echo $fim; ?> (Página <?php echo $pagina; ?> de <?php echo $total_paginas; ?>)</p>
        </div>
        <a href="noticia.php?id=387" class="btn-voltar">← Voltar para a Matéria</a>
    </div>

    <!-- Grade de Fotos -->
    <div class="grid-fotos">
        <?php for ($i = $inicio; $i <= $fim; $i++): ?>
            <a data-fancybox="gallery" href="Assets/noticias/Feijoada2026/BANANAL 2026-<?php echo $i; ?>.webp">
                <img src="Assets/noticias/Feijoada2026/BANANAL 2026-<?php echo $i; ?>.webp" alt="Foto <?php echo $i; ?>" loading="lazy">
            </a>
        <?php endfor; ?>
    </div>

    <!-- Navegação / Paginação -->
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

</body>
</html>
