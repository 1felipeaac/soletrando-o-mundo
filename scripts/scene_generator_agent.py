"""
Agente de Arte e Cenários - Soletrando o Mundo
Lê os itens obrigatórios do worldsData.ts e gera prompts padronizados no Design System do jogo:
- 3D Isometric Miniature Diorama
- Textura suave de argila/low-poly (soft clay)
- Paleta pastel calma (baixa estimulação sensorial)
- Presença obrigatória de 100% dos itens cadastrados no cômodo
"""

import os
import re
import sys

WORLDS_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "worldsData.ts")

# Art Bible / Design System Guidelines
DESIGN_SYSTEM_STYLE = (
    "Cozy, calm 3D isometric children miniature diorama room for an educational app. "
    "Soft clay and stylized low-poly render aesthetic with gentle rounded corners. "
    "Low-stimulation sensory design: warm pastel palette (soft butter yellow, sky blue, sage green, cream, light wood). "
    "Gentle morning sunlight streaming through a cozy window, soft diffused ambient occlusion shadows, peaceful atmosphere, high quality 3d render."
)

ITEM_VISUAL_DESCRIPTIONS = {
    # Quarto (Bedroom)
    "cama": "a cozy wooden children bed with a colorful pastel patchwork quilt and fluffy white pillow in the room",
    "mesa": "a cute wooden children study desk table with a little drawer and colorful drawing supplies on it",
    "sofa": "a comfortable soft yellow/terracotta children armchair sofa with a cute pastel cushion",
    "bola": "a colorful round toy bouncing ball on the floor",
    "urso": "an adorable plush teddy bear with friendly button eyes sitting happily",
    "porta": "a warm wooden children room door with a white frame and golden round door handle on the wall",
    "tapete": "a soft woven striped oval rug resting on the clean wooden parquet floor",
    "abajur": "a warm glowing bedside table lamp (abajur) with tiny star perforations on its shade",
    
    # Cozinha (Kitchen)
    "bolo": "a delicious round birthday cake with pastel frosting, sprinkles and a candle on a plate",
    "suco": "a cute orange fruit juice box or glass with a bent striped straw",
    "sopa": "a warm ceramic bowl of vegetable soup with a small wooden spoon resting inside",
    "maca": "a shiny red apple with a tiny green leaf on its stem",
    "copo": "a clear drinking cup with fresh water beside the plate",
    "prato": "a colorful ceramic dining plate placed neatly on the table",
    "garfo": "a small friendly children dining fork beside the plate",
    "banana": "a ripe yellow sweet banana ready for snack time",
}

def load_worlds_data():
    if not os.path.exists(WORLDS_DATA_PATH):
        print(f"Error: Could not find {WORLDS_DATA_PATH}")
        return []

    with open(WORLDS_DATA_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # Extrai blocos de cômodos
    world_blocks = re.findall(r'id:\s*(\d+),\s*title:\s*[\'"]([^\'"]+)[\'"].*?items:\s*\[(.*?)\n\s*\]', content, re.DOTALL)
    worlds = []

    for wid, title, items_raw in world_blocks:
        items = []
        item_matches = re.finditer(r'id:\s*[\'"]([^\'"]+)[\'"].*?displayName:\s*[\'"]([^\'"]+)[\'"].*?hint:\s*[\'"]([^\'"]+)[\'"]', items_raw, re.DOTALL)
        for im in item_matches:
            items.append({
                "id": im.group(1),
                "displayName": im.group(2),
                "hint": im.group(3)
            })
        worlds.append({
            "id": int(wid),
            "title": title,
            "items": items
        })

    return worlds

def generate_scene_prompts(world_id=1):
    worlds = load_worlds_data()
    target_world = next((w for w in worlds if w["id"] == world_id), None)
    if not target_world:
        print(f"World {world_id} not found!")
        return None

    items = target_world["items"]
    item_ids = [it["id"] for it in items]
    item_descriptions = []
    for it in items:
        iid = it["id"]
        desc = ITEM_VISUAL_DESCRIPTIONS.get(iid, f"a cute {iid}")
        item_descriptions.append(desc)

    items_sentence = ", ".join(item_descriptions)

    # 1. Prompt da Cena Completa (Full Scene)
    full_prompt = (
        f"{DESIGN_SYSTEM_STYLE} "
        f"The room MUST visibly include all of the following items in harmonious positions: {items_sentence}. "
        f"All items are colorful, clean, beautifully detailed, welcoming and easy for a 5-year-old child to spot."
    )

    # 2. Prompt da Cena Sombreada / Mistério (Shadowed Mystery Scene)
    shadowed_prompt = (
        f"Isometric view of the exact same room diorama, with the same walls, clean wooden parquet floor, and warm sunlight from the window. "
        f"CRITICAL DETAIL: Every single one of the {len(items)} items ({', '.join(item_ids)}) is replaced by a dark neutral mystery silhouette/shadow shape in its exact position on the floor and walls, "
        f"creating an inviting puzzle mystery for children to guess where each object belongs. "
        f"Clean minimal, soft clay render style, soft ambient occlusion shadows, peaceful and safe atmosphere."
    )

    return {
        "world_id": world_id,
        "title": target_world["title"],
        "items": item_ids,
        "full_scene_prompt": full_prompt,
        "shadowed_scene_prompt": shadowed_prompt
    }

if __name__ == "__main__":
    world_id = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    prompts = generate_scene_prompts(world_id)
    if prompts:
        print(f"\\n=======================================================")
        print(f" AGENTE DE CENÁRIOS: {prompts['title']} (Mundo {prompts['world_id']})")
        print(f" Itens Obrigatórios ({len(prompts['items'])}): {', '.join(prompts['items'])}")
        print(f"=======================================================\\n")
        print("--- PROMPT CENA COMPLETA (FULL SCENE) ---")
        print(prompts["full_scene_prompt"])
        print("\\n--- PROMPT CENA SOMBREADA (SHADOWED SCENE) ---")
        print(prompts["shadowed_scene_prompt"])
        print("\\n=======================================================")
