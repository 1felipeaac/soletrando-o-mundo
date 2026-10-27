"""
Gera os 8 itens de massinha 3D do Bônus da Casa utilizando o SDK oficial google-genai
e a sua GEMINI_API_KEY.

Modelos suportados:
- imagen-3.0-generate-002 (padrão de estúdio fotorrealista de massinha)
- imagen-4.0-generate-001
"""

import os
import io
import sys
from PIL import Image
from google import genai
from google.genai import types

# Carrega .env manualmente se existir
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if not api_key:
    if len(sys.argv) > 1:
        api_key = sys.argv[1]
    else:
        print("ERRO: Nenhuma chave GEMINI_API_KEY encontrada no ambiente, .env ou argumento.")
        print("Uso: python scripts/generate_bonus_with_gemini.py <SUA_CHAVE_API>")
        sys.exit(1)

client = genai.Client(api_key=api_key)
output_dir = os.path.join(os.path.dirname(__file__), "..", "public", "images")
os.makedirs(output_dir, exist_ok=True)

ITEMS = [
    {
        "id": "sapato",
        "prompt": "A stylized 3D clay pair of colorful children sneakers with pastel accents and neat clay laces, smooth clay texture, strictly inanimate footwear with NO eyes, NO mouth, NO face, isolated on pure clean neutral white background, soft studio lighting, subtle contact shadow underneath, 1:1 single object."
    },
    {
        "id": "bota",
        "prompt": "A stylized 3D clay pair of bright sunny yellow rubber rain boots with sturdy textured soles, smooth clay texture, strictly inanimate footwear with NO eyes, NO mouth, NO face, isolated on pure clean neutral white background, soft studio lighting, subtle contact shadow underneath, 1:1 single object."
    },
    {
        "id": "laco",
        "prompt": "A stylized 3D clay beautiful satin ribbon bow in pastel pink with elegant loops and tails, smooth clay texture, strictly inanimate with NO eyes, NO mouth, NO face, isolated on pure clean neutral white background, soft studio lighting, subtle contact shadow underneath, 1:1 single object."
    },
    {
        "id": "sacola",
        "prompt": "A stylized 3D clay reusable shopping tote bag in pastel canvas with sturdy loop handles, smooth clay texture, strictly inanimate bag with NO anthropomorphic face (subtle printed leaf logo decal allowed), isolated on pure clean neutral white background, soft studio lighting, subtle contact shadow underneath, 1:1 single object."
    },
    {
        "id": "bone",
        "prompt": "A stylized 3D clay children baseball cap in pastel teal and coral with a curved brim, smooth clay texture, strictly inanimate clothing with NO eyes, NO mouth, NO face, isolated on pure clean neutral white background, soft studio lighting, subtle contact shadow underneath, 1:1 single object."
    },
    {
        "id": "casaco",
        "prompt": "A stylized 3D clay cozy hooded winter duffle coat in warm oatmeal clay with wooden toggle buttons, smooth clay texture, strictly inanimate clothing with NO eyes, NO mouth, NO face, isolated on pure clean neutral white background, soft studio lighting, subtle contact shadow underneath, 1:1 single object."
    },
    {
        "id": "meia",
        "prompt": "A stylized 3D clay pair of folded striped pastel cotton socks, smooth knitted clay texture, strictly inanimate clothing with NO eyes, NO mouth, NO face, isolated on pure clean neutral white background, soft studio lighting, subtle contact shadow underneath, 1:1 single object."
    },
    {
        "id": "chave",
        "prompt": "A stylized 3D clay golden brass house key with a circular head on a cute round key ring, smooth clay texture, strictly inanimate utility with NO eyes, NO mouth, NO face, isolated on pure clean neutral white background, soft studio lighting, subtle contact shadow underneath, 1:1 single object."
    }
]

print(f"Iniciando geracao de {len(ITEMS)} itens com Imagen 3.0 via Gemini API...")

for item in ITEMS:
    item_id = item["id"]
    target_path = os.path.join(output_dir, f"{item_id}.jpg")
    print(f"\n-> Gerando '{item_id}'...")
    try:
        response = client.models.generate_images(
            model="imagen-3.0-generate-002",
            prompt=item["prompt"],
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="1:1",
                output_mime_type="image/jpeg"
            )
        )
        if response.generated_images:
            img_bytes = response.generated_images[0].image.image_bytes
            image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
            image.save(target_path, "JPEG", quality=95)
            print(f"   [SUCESSO] Salvo em {target_path} ({os.path.getsize(target_path)} bytes)")
        else:
            print(f"   [AVISO] Nenhuma imagem retornada para '{item_id}'")
    except Exception as e:
        print(f"   [ERRO] Falha ao gerar '{item_id}': {e}")

print("\nProcessamento concluido!")
