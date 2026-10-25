"""
Agente de Arte e Cenários Dinâmico - Soletrando o Mundo
Lê os itens obrigatórios do worldsData.ts e gera prompts estruturados e 100% dinâmicos,
utilizando variáveis e templates paramétricos por categoria, tema e posicionamento.
Garante que objetos inanimados NUNCA tenham olhos ou boca (apenas animais/brinquedos de animal).
"""

import os
import re
import sys
import json

WORLDS_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "worldsData.ts")

# 1. Presets Dinâmicos de Ambientes por Tema
THEME_ENVIRONMENTS = {
    "casa": {
        "room_type": "bedroom or playroom",
        "walls": "soft pastel cyan-blue and butter-yellow walls with gentle trim",
        "floor": "clean light wooden parquet floor",
        "lighting": "gentle morning sunlight streaming through a white-framed window",
        "palette": "warm butter yellow, sky blue, cream, light oak wood"
    },
    "comida": {
        "room_type": "kitchen and snack dining area",
        "walls": "soft pastel mint-green and creamy-yellow walls with cute kitchen shelving",
        "floor": "warm checkered pastel tiled floor or light wooden floor",
        "lighting": "warm sunny morning light with soft ambient glow",
        "palette": "soft mint green, warm peach, lemon yellow, cream"
    },
    "sala": {
        "room_type": "cozy family living room",
        "walls": "soft pastel lavender and warm cream walls with cute wall shelves",
        "floor": "warm honey-toned wooden plank floor",
        "lighting": "gentle morning daylight shining softly through a window",
        "palette": "lavender, honey wood, warm cream, soft sage, butter yellow"
    },
    "banheiro": {
        "room_type": "bright and clean children bathroom",
        "walls": "soft pastel seafoam-blue tiles and warm white walls",
        "floor": "gentle light-teal checkered tile floor with soft bath mat",
        "lighting": "bright, soft morning light with clean pastel reflections",
        "palette": "seafoam blue, gentle cyan, clean white, pastel yellow"
    },
    "jardim": {
        "room_type": "sunny green backyard garden around the house",
        "walls": "soft wooden picket fence and gentle green foliage in the background",
        "floor": "lush soft green grass lawn and small pastel stone pathway",
        "lighting": "cheerful golden morning sunshine with soft breeze atmosphere",
        "palette": "meadow green, sky blue, buttercup yellow, soft terracotta"
    },
    "bonus": {
        "room_type": "welcoming home entryway and hall utility area",
        "walls": "soft warm peach and cream walls with charming wooden coat hooks and shelf",
        "floor": "clean polished light parquet wood floor",
        "lighting": "cozy warm ambient hallway lighting and daylight from the front door",
        "palette": "soft peach, warm terracotta, oatmeal cream, honey oak wood"
    },
    "natureza": {
        "room_type": "forest meadow clearing",
        "walls": "soft rolling pastel green grassy hills and gentle trees in the background",
        "floor": "lush soft mossy ground with tiny pastel flowers",
        "lighting": "dappled warm golden sunlight through tree canopies",
        "palette": "sage green, sky blue, blossom pink, warm earth"
    },
    "escola": {
        "room_type": "kindergarten playroom classroom",
        "walls": "soft pastel lavender and cream walls with cute educational wall decor",
        "floor": "smooth warm linoleum wood-look floor",
        "lighting": "bright cheerful daylight from a large playroom window",
        "palette": "soft primary pastels, warm wood, gentle sky blue"
    },
    "default": {
        "room_type": "cozy diorama room",
        "walls": "warm pastel colored walls with gentle details",
        "floor": "clean light wooden floor",
        "lighting": "gentle morning sunlight with soft diffused shadows",
        "palette": "warm pastel tones, cream, light wood"
    }
}

# 2. Templates Dinâmicos de Itens por Categoria
# REGRA FUNDAMENTAL: Apenas 'animal' ou brinquedos que representam animais possuem olhos/boca.
# Alimentos, móveis, ferramentas, plantas e roupas são estritamente inanimados (sem olhos/boca).
CATEGORY_TEMPLATES = {
    "furniture": "a cozy 3D clay {label} ({name}) with smooth rounded edges, strictly inanimate with NO eyes, NO mouth, NO face, positioned {placement}",
    "toy": "an adorable, friendly 3D clay toy {label} ({name}) with playful details, positioned {placement}",
    "food": "a delicious and appetizing 3D clay {label} ({name}) made for kids, strictly inanimate with NO eyes, NO mouth, NO face, placed {placement}",
    "decoration": "a charming 3D clay decorative {label} ({name}) with gentle warm accents, strictly inanimate with NO eyes, NO mouth, placed {placement}",
    "structure": "a welcoming 3D clay architectural {label} ({name}) with soft pastel trim, placed {placement}",
    "utensil": "a cute child-friendly 3D clay utensil {label} ({name}) with smooth rounded edges, strictly inanimate with NO eyes, NO mouth, NO face, placed {placement}",
    "animal": "an adorable friendly 3D clay {label} ({name}) with cute button eyes and gentle smile, positioned {placement}",
    "plant": "a sweet natural 3D clay {label} ({name}) with soft green leaves, strictly natural plant with NO eyes, NO mouth, placed {placement}",
    "clothing": "a cute 3D clay piece of clothing {label} ({name}) with NO eyes or face, neatly placed {placement}",
    "vehicle": "a cheerful toy 3D clay vehicle {label} ({name}) parked {placement}",
    "default": "a lovely 3D clay {label} ({name}) with stylized soft textures, strictly inanimate with NO eyes, NO mouth, NO face, positioned {placement}"
}

# 3. Master Templates Paramétricos
SCENE_MASTER_TEMPLATE = (
    "Cozy, calm 3D isometric children {room_type} miniature diorama for an educational app. "
    "Soft clay and stylized low-poly render aesthetic with gentle rounded corners. "
    "Low-stimulation sensory design: palette of {palette}. "
    "{walls}, {floor}, {lighting}, soft diffused ambient occlusion shadows, peaceful atmosphere, high quality 3d render. "
    "Strict rule: Inanimate objects, furniture, tools, plants, and food MUST be natural stylized objects without faces, eyes, or mouths. "
    "Only animals or toys representing an animal may have eyes or faces. "
    "The scene MUST visibly and harmoniously include all of the following {item_count} items: {items_sentence}. "
    "All items are colorful, clean, beautifully detailed, welcoming and easy for a 5-year-old child to spot."
)

ISOLATED_ITEM_MASTER_TEMPLATE = (
    "A stylized 3D clay {name} ({label}), cozy claymation aesthetic with smooth tactile clay texture, "
    "{faceless_clause}"
    "isolated on pure clean neutral white background, soft diffused morning studio lighting, "
    "gentle ambient contact shadow underneath, high quality 3D children educational illustration, 1:1 aspect ratio single object."
)


def load_worlds_data():
    """Lê e parseia dinamicamente os mundos e itens do worldsData.ts"""
    if not os.path.exists(WORLDS_DATA_PATH):
        print(f"Error: Could not find {WORLDS_DATA_PATH}")
        return []

    with open(WORLDS_DATA_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # Divide os mundos pelos blocos id: 1, id: 2, etc.
    world_sections = re.split(r'\n\s*\{\s*\n\s*id:\s*(\d+)', content)
    worlds = []

    for i in range(1, len(world_sections), 2):
        wid = int(world_sections[i])
        body = world_sections[i + 1]

        title_m = re.search(r"title:\s*['\"]([^'\"]+)['\"]", body)
        short_m = re.search(r"shortName:\s*['\"]([^'\"]+)['\"]", body)
        theme_m = re.search(r"theme:\s*['\"]([^'\"]+)['\"]", body)

        # Localiza o bloco de items
        items_match = re.search(r"items:\s*\[(.*?)\]\s*,\s*(\n\s*\}|\n\s*items|\n\s*color|\Z)", body, re.DOTALL)
        if not items_match:
            items_match = re.search(r"items:\s*\[(.*)", body, re.DOTALL)

        items_raw = items_match.group(1) if items_match else ""

        # Divide os itens por blocos
        item_chunks = re.split(r'\n\s*\{\s*\n\s*id:\s*', "\n" + items_raw)
        items = []

        for chunk in item_chunks:
            if not chunk.strip():
                continue
            chunk = "id: " + chunk
            iid_m = re.search(r"id:\s*['\"]([^'\"]+)['\"]", chunk)
            name_m = re.search(r"name:\s*['\"]([^'\"]+)['\"]", chunk)
            disp_m = re.search(r"displayName:\s*['\"]([^'\"]+)['\"]", chunk)
            cat_m = re.search(r"category:\s*['\"]([^'\"]+)['\"]", chunk)
            hint_m = re.search(r"hint:\s*['\"]([^'\"]+)['\"]", chunk)
            label_m = re.search(r"label:\s*['\"]([^'\"]+)['\"]", chunk)
            desc_m = re.search(r"description:\s*['\"]([^'\"]+)['\"]", chunk)
            vprompt_m = re.search(r"visualPrompt:\s*['\"]([^'\"]+)['\"]", chunk)

            if iid_m and disp_m:
                items.append({
                    "id": iid_m.group(1),
                    "name": name_m.group(1) if name_m else iid_m.group(1),
                    "displayName": disp_m.group(1),
                    "category": cat_m.group(1) if cat_m else "default",
                    "hint": hint_m.group(1) if hint_m else "",
                    "label": label_m.group(1) if label_m else disp_m.group(1),
                    "placement": desc_m.group(1) if desc_m else "in the scene",
                    "visualPrompt": vprompt_m.group(1) if vprompt_m else None
                })

        worlds.append({
            "id": wid,
            "title": title_m.group(1) if title_m else f"Mundo {wid}",
            "shortName": short_m.group(1) if short_m else f"Mundo {wid}",
            "theme": theme_m.group(1) if theme_m else "default",
            "items": items
        })

    return worlds


def build_item_visual_description(item):
    """Gera a descrição visual do item de forma dinâmica a partir de suas variáveis e metadados."""
    if item.get("visualPrompt"):
        return item["visualPrompt"]

    category = item.get("category", "default")
    template = CATEGORY_TEMPLATES.get(category, CATEGORY_TEMPLATES["default"])

    label = item.get("label") or item.get("displayName") or item.get("name")
    name = item.get("name") or item.get("id")
    placement = item.get("placement") or "in the scene"

    return template.format(
        label=label,
        name=name,
        placement=placement
    )


def build_isolated_item_prompt(item):
    """Gera o prompt para o render individual 1:1 do item garantindo ausência de olhos/boca em inanimados."""
    category = item.get("category", "default")
    is_animal_related = category == "animal" or item.get("id") in ["urso", "pato", "passaro", "borboleta"]

    is_natural_food_or_plant = category in ["plant"] or item.get("id") in ["maca", "banana", "uva", "laranja", "pera", "cenoura", "tomate", "rosa", "arvore", "grama"]

    if is_animal_related:
        faceless_clause = "adorable friendly design with cute button eyes and sweet gentle expression, "
    elif is_natural_food_or_plant:
        faceless_clause = "strictly natural fruit, vegetable, or plant with NO eyes, NO mouth, NO face, clean organic stylized shape, "
    else:
        # Objetos manufaturados: o objeto em si não é humanizado, mas pode ter estampas/logomarcas infantis decorativas (ex: nuvenzinha no copo)
        faceless_clause = "inanimate stylized object, no anthropomorphic face on the object itself (any cute face motif allowed only as small printed graphic decal or brand logo decoration), "

    label = item.get("label") or item.get("displayName") or item.get("name")
    name = item.get("name") or item.get("id")

    return ISOLATED_ITEM_MASTER_TEMPLATE.format(
        name=name,
        label=label,
        faceless_clause=faceless_clause
    )


def generate_scene_prompts(world_id=1):
    """Constrói os prompts da cena completa para o mundo especificado."""
    worlds = load_worlds_data()
    target_world = next((w for w in worlds if w["id"] == world_id), None)
    if not target_world:
        print(f"World {world_id} not found!")
        return None

    theme_key = target_world.get("theme", "default")
    env = THEME_ENVIRONMENTS.get(theme_key, THEME_ENVIRONMENTS["default"])

    items = target_world["items"]
    item_descriptions = [build_item_visual_description(it) for it in items]
    items_sentence = ", ".join(item_descriptions)

    full_prompt = SCENE_MASTER_TEMPLATE.format(
        room_type=env["room_type"],
        palette=env["palette"],
        walls=env["walls"],
        floor=env["floor"],
        lighting=env["lighting"],
        item_count=len(items),
        items_sentence=items_sentence
    )

    return {
        "world_id": world_id,
        "title": target_world["title"],
        "shortName": target_world["shortName"],
        "theme": theme_key,
        "items": [it["id"] for it in items],
        "item_details": [
            {
                "id": it["id"],
                "displayName": it["displayName"],
                "category": it["category"],
                "description": desc,
                "isolated_prompt": build_isolated_item_prompt(it)
            }
            for it, desc in zip(items, item_descriptions)
        ],
        "full_scene_prompt": full_prompt
    }


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--all":
        worlds = load_worlds_data()
        for w in worlds:
            prompts = generate_scene_prompts(w["id"])
            if prompts:
                print(f"\n{'='*60}")
                print(f" MUNDO {prompts['world_id']}: {prompts['title']} ({prompts['theme']})")
                print(f" Itens ({len(prompts['items'])}): {', '.join(prompts['items'])}")
                print(f"{'='*60}\n")
                print(">> FULL SCENE PROMPT:\n", prompts["full_scene_prompt"])
    else:
        world_id = int(sys.argv[1]) if len(sys.argv) > 1 else 1
        prompts = generate_scene_prompts(world_id)
        if prompts:
            print(f"\n{'='*60}")
            print(f" AGENTE DE CENÁRIOS DINÂMICO: {prompts['title']} (Mundo {prompts['world_id']})")
            print(f" Tema: {prompts['theme']} | Itens ({len(prompts['items'])}): {', '.join(prompts['items'])}")
            print(f"{'='*60}\n")
            print("--- ITENS GERADOS DINAMICAMENTE A PARTIR DAS VARIÁVEIS ---")
            for it in prompts["item_details"]:
                print(f" * [{it['category'].upper()}] {it['displayName']}: {it['description']}")
            print(f"\n--- PROMPT CENA COMPLETA (FULL SCENE) ---")
            print(prompts["full_scene_prompt"])
            print(f"\n{'='*60}")
