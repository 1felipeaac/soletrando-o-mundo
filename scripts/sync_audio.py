import asyncio
import os
import sys
import edge_tts

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

VOICE = "pt-BR-FranciscaNeural"

# Sílabas especiais / faltantes necessárias para o vocabulário
SPECIAL_SYLLABLES = {
    "UR": "Úr",
    "POR": "Pór",
    "JUR": "Júr",
    "FA": "Fá",
    "FÁ": "Fá",
    "ÇÃ": "Sã",
    "GAR": "Gár",
    "FO": "Fó",
    "LO": "Lô",
    "NA": "Ná",
}

# Itens dos Mundos 1 e 2
ITEMS_AUDIO = [
    # Mundo 1: O Quarto
    {
        "id": "cama",
        "clean_word": "Cama.",
        "spoken_name": "Cá... má! Cama!",
        "hint": "Onde você descansa, sonha e dorme quentinho à noite."
    },
    {
        "id": "mesa",
        "clean_word": "Mesa.",
        "spoken_name": "Mê... za! Mesa!",
        "hint": "Lugar onde colocamos o caderno para desenhar e estudar."
    },
    {
        "id": "sofa",
        "clean_word": "Sofá.",
        "spoken_name": "Só... fá! Sofá!",
        "hint": "Aquele assento macio e fofinho para ler uma história."
    },
    {
        "id": "bola",
        "clean_word": "Bola.",
        "spoken_name": "Bó... la! Bola!",
        "hint": "Redondinha, pula bastante no chão e diverte todo mundo."
    },
    {
        "id": "urso",
        "clean_word": "Urso.",
        "spoken_name": "Úr... so! Urso!",
        "hint": "Um amigo de pelúcia bem fofinho que mora na cama."
    },
    {
        "id": "porta",
        "clean_word": "Porta.",
        "spoken_name": "Pór... ta! Porta!",
        "hint": "Tem maçaneta, abre para receber os amigos e fecha na hora de dormir."
    },
    {
        "id": "tapete",
        "clean_word": "Tapete.",
        "spoken_name": "Ta... pê... te! Tapete!",
        "hint": "Fica estendido no chão para deixar o quarto quentinho."
    },
    {
        "id": "abajur",
        "clean_word": "Abajur.",
        "spoken_name": "A... ba... jur! Abajur!",
        "hint": "Uma luzinha suave na mesinha para afastar o medo do escuro."
    },
    # Mundo 2: A Cozinha
    {
        "id": "bolo",
        "clean_word": "Bolo.",
        "spoken_name": "Bô... lo! Bolo!",
        "hint": "Gostoso, fofinho e com velinhas de aniversário."
    },
    {
        "id": "suco",
        "clean_word": "Suco.",
        "spoken_name": "Sú... co! Suco!",
        "hint": "Feito de frutas fresquinhas espremidas na jarra."
    },
    {
        "id": "sopa",
        "clean_word": "Sopa.",
        "spoken_name": "Sô... pa! Sopa!",
        "hint": "Quentinha no prato fundo com legumes e macarrão."
    },
    {
        "id": "maca",
        "clean_word": "Maçã.",
        "spoken_name": "Ma... sã! Maçã!",
        "hint": "Fruta vermelhinha e crocante da árvore."
    },
    {
        "id": "copo",
        "clean_word": "Copo.",
        "spoken_name": "Có... po! Copo!",
        "hint": "Onde colocamos água fresca para beber quando temos sede."
    },
    {
        "id": "prato",
        "clean_word": "Prato.",
        "spoken_name": "Prá... to! Prato!",
        "hint": "Redondo, onde servimos a comida gostosa."
    },
    {
        "id": "garfo",
        "clean_word": "Garfo.",
        "spoken_name": "Gár... fo! Garfo!",
        "hint": "Tem dentinhos para espetar a comidinha e levar à boca."
    },
    {
        "id": "banana",
        "clean_word": "Banana.",
        "spoken_name": "Ba... na... na! Banana!",
        "hint": "Fruta amarela de casca fácil de puxar, o lanche favorito do macaco!"
    },
]

async def generate_file(text: str, filepath: str, rate: str = "+0%"):
    communicate = edge_tts.Communicate(text, VOICE, rate=rate)
    await communicate.save(filepath)

async def main():
    print("⚡ SINCRONIZANDO ÁUDIOS NEURAIS (Soletrando o Mundo)")
    
    syllables_dir = os.path.join("public", "audio", "syllables")
    items_dir = os.path.join("public", "audio", "items")
    hints_dir = os.path.join("public", "audio", "hints")
    words_dir = os.path.join("public", "audio", "words")

    os.makedirs(syllables_dir, exist_ok=True)
    os.makedirs(items_dir, exist_ok=True)
    os.makedirs(hints_dir, exist_ok=True)
    os.makedirs(words_dir, exist_ok=True)

    # 1. Sílabas Especiais / Faltantes
    print("\n📖 Verificando Sílabas Especiais...")
    for syl, spoken in SPECIAL_SYLLABLES.items():
        dest = os.path.join(syllables_dir, f"{syl}.mp3")
        if not os.path.exists(dest):
            print(f"  + Gerando sílaba {syl} ('{spoken}')... ", end="", flush=True)
            await generate_file(spoken, dest)
            print("OK")
        else:
            print(f"  ✓ Sílaba {syl} já existe.")

    # 2. Áudios dos Itens (Cadência Legada)
    print("\n📦 Verificando Áudios dos Objetos...")
    for item in ITEMS_AUDIO:
        dest = os.path.join(items_dir, f"{item['id']}.mp3")
        if not os.path.exists(dest):
            print(f"  + Gerando objeto {item['id']} ('{item['spoken_name']}')... ", end="", flush=True)
            await generate_file(item["spoken_name"], dest)
            print("OK")
        else:
            print(f"  ✓ Objeto {item['id']} já existe.")

    # 3. Áudios das Palavras Fechadas (Para Conclusão Acolhedora da Soletração)
    print("\n🏷️ Verificando Áudios das Palavras Finais...")
    for item in ITEMS_AUDIO:
        dest = os.path.join(words_dir, f"{item['id']}.mp3")
        if not os.path.exists(dest):
            print(f"  + Gerando palavra {item['id']} ('{item['clean_word']}')... ", end="", flush=True)
            await generate_file(item["clean_word"], dest, rate="-5%")
            print("OK")
        else:
            print(f"  ✓ Palavra {item['id']} já existe.")

    # 4. Áudios das Dicas (Voz Natural Acolhedora)
    print("\n💡 Verificando Áudios das Dicas...")
    for item in ITEMS_AUDIO:
        dest = os.path.join(hints_dir, f"{item['id']}.mp3")
        if not os.path.exists(dest):
            print(f"  + Gerando dica de {item['id']}... ", end="", flush=True)
            await generate_file(item["hint"], dest)
            print("OK")
        else:
            print(f"  ✓ Dica de {item['id']} já existe.")

    print("\n✨ Sincronização concluída com sucesso!")

if __name__ == "__main__":
    asyncio.run(main())
