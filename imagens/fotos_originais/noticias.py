import json

# Gera HTML estático puro para as 24 primeiras fotos de prévia (sem JS, sem PHP)
previa_24_fotos_html = "".join([
    f"<a data-fancybox='gallery' href='Assets/noticias/Feijoada2026/BANANAL 2026-{i}.webp' style='display: block; overflow: hidden; border-radius: 6px; background: #f1f5f9;'>"
    f"<img src='Assets/noticias/Feijoada2026/BANANAL 2026-{i}.webp' alt='Foto {i}' style='width: 100%; height: 110px; object-fit: cover; display: block; cursor: zoom-in;' loading='lazy'></a>"
    for i in range(1, 25)
])

secao_galeria_limpa = f"""
<div style='margin-top: 35px; padding: 20px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;'>
    <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;'>
        <h3 style='margin: 0; color: #1e293b; font-size: 18px; font-weight: bold;'>📸 Galeria de Fotos (Prévia)</h3>
        <span style='font-size: 13px; color: #64748b; font-weight: 600; background: #f1f5f9; padding: 4px 10px; border-radius: 15px;'>24 de 529 fotos</span>
    </div>
    
    <div style='display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; margin-bottom: 20px;'>
        {previa_24_fotos_html}
    </div>

    <a href='galeria_feijoada.php' style='display: inline-block; padding: 12px 24px; background: #007bff; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: bold; border-radius: 8px; transition: background 0.2s;'>
        Ver Todas as 529 Fotos na Galeria Completa »
    </a>
</div>
"""

# Conteúdo com diagramação limpa em parágrafos simples
conteudo_limpo = (
    "<article class='noticia-corpo' style='font-size: 16px; line-height: 1.7; color: #2d3748; text-align: justify;'>"
    "<p style='margin-bottom: 16px;'>A <strong>FEIJOADA SUNSET 2026</strong> foi um verdadeiro sucesso! Gente bonita, ambiente agradável, muita alegria, descontração e momentos inesquecíveis marcaram mais uma edição de um dos eventos mais aguardados de Sacramento e região.</p>"
    "<p style='margin-bottom: 16px;'>Há cerca de 30 anos, quando ainda pouco se falava na realização de grandes eventos, surgia a <strong>Bananal Eventos</strong>. De lá para cá, foram anos de dedicação, trabalho, desafios e, acima de tudo, muito amor pelo entretenimento e pela nossa cidade.</p>"
    "<p style='margin-bottom: 16px;'>No último dia 30, a Bananal Eventos proporcionou a Sacramento uma tarde que, sem dúvida, ficará marcada como um dos grandes eventos dos últimos tempos. Uma verdadeira celebração, reunindo amigos, famílias e visitantes de diversas cidades da região.</p>"
    
    "<p style='margin-bottom: 6px; font-weight: bold;'>Segundo a Bananal Eventos:</p>"
    "<blockquote style='margin: 0 0 18px 0; padding: 12px 18px; background: #f8fafc; border-left: 4px solid #007bff; border-radius: 0 6px 6px 0; font-style: italic; color: #475569;'>"
    "“Fazer parte dessa história é algo que me enche de orgulho. São anos e anos de dedicação até chegarmos até aqui. Cada evento realizado, cada desafio superado e cada sorriso do público nos motiva a continuar.”"
    "</blockquote>"

    "<p style='margin-bottom: 16px;'>E as novidades não param! A Bananal Eventos, em parceria com o <strong>Restaurante Recanto da Praça</strong> e o <strong>Restaurante Gruta dos Palhares</strong>, prepara uma nova proposta: o início de um <strong>BUFFET</strong>, que promete atender com qualidade, dedicação e muito sabor aos mais exigentes paladares.</p>"
    "<p style='margin-bottom: 16px;'>Aproveitamos este momento especial para agradecer, de coração, a todos os nossos clientes, amigos e colaboradores, pelo carinho e confiança. Um agradecimento mais do que especial também aos nossos patrocinadores, que acreditaram no projeto e contribuíram para que tudo isso fosse possível.</p>"
    "<p style='margin-bottom: 16px; font-weight: bold; color: #1e293b;'>Sem vocês, nada disso aconteceria!</p>"
    "<p style='margin-bottom: 16px;'>Esperamos continuar juntos nessa caminhada, fortalecendo os eventos, valorizando nossa cidade e mostrando que Sacramento não pode parar!</p>"
    "<p style='margin-bottom: 16px;'>A FEIJOADA SUNSET 2026 também contou com a presença de visitantes de diversas cidades, como Conquista, Rifaina, Franca, Uberaba, entre tantas outras localidades. Foi uma grande confraternização regional, onde pessoas de diferentes lugares se encontraram com um único objetivo: celebrar a alegria e viver uma experiência inesquecível.</p>"
    "<p style='margin-bottom: 16px;'>Outro grande destaque foi a participação do empresário Geraldo Magela, juntamente com o <strong>Prêmio TOP UAI</strong>, que todos os anos homenageia as melhores empresas e os melhores profissionais dos mais diversos segmentos, valorizando aqueles que contribuem para o desenvolvimento de nossa região.</p>"
    "<p style='margin-bottom: 16px;'>A decoração, como sempre, foi um espetáculo à parte e ficou sob responsabilidade da empresa <strong>ADRIANA ROSA DECORAÇÕES</strong>, que, com muito bom gosto, criatividade e dedicação, ajudou a transformar o ambiente em um cenário ainda mais especial.</p>"
    
    "<p style='margin-top: 24px; margin-bottom: 6px; font-weight: bold; text-transform: uppercase; color: #64748b;'>E se 2026 foi inesquecível...</p>"
    "<p style='margin-bottom: 12px; font-size: 18px; font-weight: bold; color: #007bff;'>2027 PROMETE SER AINDA MAIOR!</p>"
    "<p style='margin-bottom: 16px;'>A Bananal Eventos já começa a preparar novidades e uma nova edição com ainda mais qualidade, organização, dedicação e atrações para proporcionar momentos inesquecíveis a todos os visitantes.</p>"
    "<p style='margin-bottom: 12px; font-weight: bold;'>Muito obrigado a todos que fizeram parte dessa história!</p>"
    "<p style='margin-bottom: 20px; font-weight: bold; color: #007bff;'>QUE VENHA 2027! FEIJOADA SUNSET — UMA HISTÓRIA DE SUCESSO, ALEGRIA E TRADIÇÃO!</p>"

    "<p style='text-align: center; font-weight: bold; color: #64748b; font-size: 14px; margin-bottom: 10px;'>Realização: BANANAL EVENTOS</p>"
    + secao_galeria_limpa +
    "</article>"
)

noticia_387 = {
    "id": 387,
    "categoria": "social",
    "titulo": "FEIJOADA SUNSET 2026: UM SUCESSO QUE FICARÁ NA HISTÓRIA!",
    "resumo": "Uma verdadeira celebração reunindo gente bonita, ambiente agradável, muita alegria e momentos inesquecíveis em Sacramento e região",
    "imagem": "Assets/noticias/Feijoada 2026.webp",
    "estilo_imagem": "max-height: 100% !important; width: 100% !important; object-fit: contain !important; margin-bottom: 45px !important;",
    "conteudo": conteudo_limpo,
    "data": "2 de setembro de 2026",
    "link": "noticia.php?id=387",
    "noCarrossel": True,
    "destaque": True
}

with open("noticia_387.json", "w", encoding="utf-8") as f:
    json.dump(noticia_387, f, ensure_ascii=False, indent=2)

print("noticia_387.json atualizado com HTML puro e 24 fotos na prévia!")