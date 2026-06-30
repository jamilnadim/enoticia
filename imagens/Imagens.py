import os
from PIL import Image
# Importa o plugin de suporte ao AVIF (garante a leitura do formato)
import pillow_avif  

def processar_imagens(largura_alvo=1920, qualidade=85):
    # Pega o local onde o script está salvo para não haver erro de caminho
    diretorio_atual = os.path.dirname(os.path.abspath(__file__))
    
    entrada = os.path.join(diretorio_atual, "fotos_originais")
    saida = os.path.join(diretorio_atual, "Assets", "noticias")
    
    # CRIA A PASTA DE ENTRADA CASO ELA NÃO EXISTA
    if not os.path.exists(entrada):
        os.makedirs(entrada)
        print(f"A pasta '{entrada}' foi criada. Coloque as fotos dentro dela e rode o script novamente.")
        return

    if not os.path.exists(saida):
        os.makedirs(saida)

    # ALTERAÇÃO AQUI: Adicionado '.jfif' na lista de extensões permitidas
    arquivos = [f for f in os.listdir(entrada) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.avif', '.jfif'))]
    
    if not arquivos:
        print("Nenhuma imagem encontrada na pasta 'fotos_originais'.")
        return

    for arquivo in arquivos:
        caminho_img = os.path.join(entrada, arquivo)
        
        # O Pillow abre o arquivo normalmente (.avif por plugin, .jfif nativamente)
        img = Image.open(caminho_img)
        
        # Converte para RGB caso a imagem esteja em outro modo (evita erros ao salvar em webp)
        # Expandido também para tratar possíveis canais estranhos vindos de arquivos da web
        if img.mode in ("RGBA", "P", "CMYK"):
            img = img.convert("RGB")
            
        w_percent = (largura_alvo / float(img.size[0]))
        h_size = int((float(img.size[1]) * float(w_percent)))
        
        img_redimensionada = img.resize((largura_alvo, h_size), Image.Resampling.LANCZOS)
        
        nome_final = os.path.splitext(arquivo)[0] + ".webp"
        img_redimensionada.save(os.path.join(saida, nome_final), "WEBP", quality=qualidade)
        print(f"Sucesso: {nome_final} processada e salva em Assets/noticias")

if __name__ == "__main__":
    processar_imagens()