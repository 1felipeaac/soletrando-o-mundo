import asyncio
import os
import sys
import edge_tts
import miniaudio
import numpy as np
import lameenc

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

VOICE = "pt-BR-FranciscaNeural"

# Sílabas especiais / acentuadas / codas necessárias para pronúncia fonética cristalina
# Regras fonéticas: S inicial tem som de Ç (/s/), S intervocálico tem som de Z (/z/), Til ÃO é ditongo [ɐ̃w̃]
SPECIAL_SYLLABLES = {
    # Sibilantes Canônicas (S inicial tem som de Ç /s/, nunca /z/)
    "SA": "Sá.",
    "SO": "Sô.",
    "SU": "Sú.",
    "SE": "Sé.",
    "SI": "Sí.",
    # Sibilantes Intervocálicas (S entre duas vogais ganha som de Z /z/)
    "SA_Z": "Zá.",
    "SO_Z": "Zó.",
    # Oposição Fonológica de Timbre Vocálico (Aberto /ɔ, ɛ/ vs. Fechado /o, e/)
    "BO": "Bô.",
    "BO_OPEN": "Bó.",
    "CO": "Cô.",
    "CO_OPEN": "Có.",
    "PO": "Pô.",
    "PO_OPEN": "Pó.",
    "RO": "Rô.",
    "RO_OPEN": "Ró.",
    "RE": "Rê.",
    "PE": "Pê.",
    "ME": "Mê.",
    "TE": "Tê.",
    # Ditongos Nasais Decrescentes (Til [ɐ̃w̃], sem monotongar em 'bom')
    "BÃO": "Bãum!",
    "UR": "Úr",
    "POR": "Pór",
    "JUR": "Júr",
    "FA": "Fá",
    "FÁ": "Fá",
    "ÇÃ": "Sã",
    "SA_TIL": "Sã",
    "GAR": "Gár",
    "FO": "Fó",
    "LO": "Lô",
    "NA": "Ná",
    # Sala
    "VRO": "Vrô",
    "QUA": "Quá",
    "DRO": "Drô",
    "LÓ": "Ló",
    "GIO": "Jio",
    "PLAN": "Plan",
    "COR": "Côr",
    "RÁ": "Rá",
    "DIO": "Diu",
    # Banheiro
    "LHA": "Lha",
    "ES": "És",
    "LHO": "Lho",
    "PEN": "Pên",
    "PEL": "Pél",
    "NHEI": "Nhei",
    # Jardim
    "ÁR": "Ár",
    "VO": "Vô",
    "GRA": "Grá",
    "DOR": "Dôr.",
    "LAN": "Lan",
    "ÇO": "Ssu",
    "CER": "Sér",
    "PÁS": "Pás",
    "BOR": "Bór",
    # Bônus
    "CHA": "Xá",
    "VAS": "Vás",
    "SOU": "Sou",
    "BAL": "Báu",
    "CHI": "Xí",
    "NÉ": "Né",
    "MEI": "Mei",
    # Distratores específicos
    "PU": "Pú",
    "RU": "Rú",
    "CU": "Cú",
}

# 48 Itens de Minha Casa (Quarto, Cozinha, Sala, Banheiro, Jardim, Bônus)
ITEMS_AUDIO = [
    # 🛏️ Mundo 1: O Quarto
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
        "spoken_name": "Ssô... fá! Sofá!",
        "hint": "Grande, confortável e macio no centro da sala para toda a família sentar."
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

    # 🍎 Mundo 2: A Cozinha
    {
        "id": "bolo",
        "clean_word": "Bolo.",
        "spoken_name": "Bô... lo! Bolo!",
        "hint": "Gostoso, fofinho e com velinhas de aniversário."
    },
    {
        "id": "suco",
        "clean_word": "Suco.",
        "spoken_name": "Ssú... co! Suco!",
        "hint": "Feito de frutas fresquinhas espremidas na jarra."
    },
    {
        "id": "sopa",
        "clean_word": "Sopa.",
        "spoken_name": "Ssô... pa! Sopa!",
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

    # 🛋️ Mundo 3: A Sala de Estar
    {
        "id": "livro",
        "clean_word": "Livro.",
        "spoken_name": "Li... vro! Livro!",
        "hint": "Guarda historinhas mágicas e desenhos coloridos para ler."
    },
    {
        "id": "quadro",
        "clean_word": "Quadro.",
        "spoken_name": "Qua... dro! Quadro!",
        "hint": "Uma pintura bonita pendurada na parede para enfeitar."
    },
    {
        "id": "janela",
        "clean_word": "Janela.",
        "spoken_name": "Ja... ne... la! Janela!",
        "hint": "Por onde entra a luz do sol quentinha e o vento fresco."
    },
    {
        "id": "relogio",
        "clean_word": "Relógio.",
        "spoken_name": "Re... ló... gio! Relógio!",
        "hint": "Faz tique-taque na parede para avisar as horas do dia."
    },
    {
        "id": "planta",
        "clean_word": "Planta.",
        "spoken_name": "Plan... ta! Planta!",
        "hint": "Tem folhinhas verdes no vasinho e adora um pouco de água."
    },
    {
        "id": "almofada",
        "clean_word": "Almofada.",
        "spoken_name": "Al... mo... fa... da! Almofada!",
        "hint": "Fofinha e macia no sofá para encostar as costas."
    },
    {
        "id": "cortina",
        "clean_word": "Cortina.",
        "spoken_name": "Côr... ti... na! Cortina!",
        "hint": "Tecido leve na janela que balança suave com o vento."
    },
    {
        "id": "radio",
        "clean_word": "Rádio.",
        "spoken_name": "Rá... dio! Rádio!",
        "hint": "Toca músicas alegres e historinhas para animar o dia."
    },

    # 🛁 Mundo 4: O Banheiro
    {
        "id": "pia",
        "clean_word": "Pia.",
        "spoken_name": "Pi... a! Pia!",
        "hint": "Onde lavamos as mãozinhas com sabão e escovamos os dentes."
    },
    {
        "id": "sabao",
        "clean_word": "Sabão.",
        "spoken_name": "Ssa... bãum! Sabão!",
        "hint": "Faz bolhas coloridas e deixa as mãozinhas limpas e cheirosas."
    },
    {
        "id": "toalha",
        "clean_word": "Toalha.",
        "spoken_name": "To... a... lha! Toalha!",
        "hint": "Macia e felpuda para secar o corpinho depois do banho."
    },
    {
        "id": "espelho",
        "clean_word": "Espelho.",
        "spoken_name": "Es... pe... lho! Espelho!",
        "hint": "Mostra o seu reflexo quando você sorri para ele."
    },
    {
        "id": "escova",
        "clean_word": "Escova.",
        "spoken_name": "Es... cô... va! Escova!",
        "hint": "Com cerdas macias para limpar os dentes com pasta."
    },
    {
        "id": "pente",
        "clean_word": "Pente.",
        "spoken_name": "Pen... te! Pente!",
        "hint": "Tem dentinhos alinhados para desembaraçar os fios de cabelo."
    },
    {
        "id": "banheira",
        "clean_word": "Banheira.",
        "spoken_name": "Ba... nhei... ra! Banheira!",
        "hint": "Cheia de água quentinha e espuma para um banho bem gostoso."
    },
    {
        "id": "pato",
        "clean_word": "Pato.",
        "spoken_name": "Pa... to! Pato!",
        "hint": "Amiguinho amarelo de borracha que boia na água da banheira."
    },

    # 🌳 Mundo 5: O Jardim
    {
        "id": "rosa",
        "clean_word": "Rosa.",
        "spoken_name": "Ró... za! Rosa!",
        "hint": "Flor perfumada com pétalas delicadas que cresce no canteiro."
    },
    {
        "id": "arvore",
        "clean_word": "Árvore.",
        "spoken_name": "Ár-vo-re! Árvore!",
        "hint": "Tem tronco forte de madeira e copa verde cheia de folhas e sombra."
    },
    {
        "id": "grama",
        "clean_word": "Grama.",
        "spoken_name": "Gra... ma! Grama!",
        "hint": "Tapete verde e macio da natureza onde pisamos descalços."
    },
    {
        "id": "regador",
        "clean_word": "Regador.",
        "spoken_name": "Re... ga... dôr! Regador!",
        "hint": "Tem bico com furinhos para dar banho de chuva nas plantinhas."
    },
    {
        "id": "balanco",
        "clean_word": "Balanço.",
        "spoken_name": "Ba... lan... ço! Balanço!",
        "hint": "Preso no galho da árvore para ir bem alto e sentir o vento no rosto."
    },
    {
        "id": "cerca",
        "clean_word": "Cerca.",
        "spoken_name": "Sér... ca! Cerca!",
        "hint": "Feita de tábuas de madeira branquinha contornando o quintal."
    },
    {
        "id": "passaro",
        "clean_word": "Pássaro.",
        "spoken_name": "Pás... sa... ro! Pássaro!",
        "hint": "Tem asinhas coloridas, canta bonito no galho e voa no céu."
    },
    {
        "id": "borboleta",
        "clean_word": "Borboleta.",
        "spoken_name": "Bor... bo... le... ta! Borboleta!",
        "hint": "Bate asas coloridas bem levinho e pousa suavemente nas flores."
    },

    # 🎒 Mundo 6: Bônus da Casa
    {
        "id": "chave",
        "clean_word": "Chave.",
        "spoken_name": "Chá... ve! Chave!",
        "hint": "De metal, gira na fechadura da porta para abrir e fechar a casa."
    },
    {
        "id": "sapato",
        "clean_word": "Sapato.",
        "spoken_name": "Ssa... pá... to! Sapato!",
        "hint": "Calçamos nos pezinhos com meias para passear com segurança."
    },
    {
        "id": "vassoura",
        "clean_word": "Vassoura.",
        "spoken_name": "Vas... sou... ra! Vassoura!",
        "hint": "Tem cerdas e cabo longo para varrer o chão e deixar tudo limpo."
    },
    {
        "id": "balde",
        "clean_word": "Balde.",
        "spoken_name": "Bál... de! Balde!",
        "hint": "Tem alça e serve para carregar água e ajudar na limpeza."
    },
    {
        "id": "mochila",
        "clean_word": "Mochila.",
        "spoken_name": "Mo... chi... la! Mochila!",
        "hint": "Colocamos nas costas com cadernos e estojo para ir à escola."
    },
    {
        "id": "bone",
        "clean_word": "Boné.",
        "spoken_name": "Bô... né! Boné!",
        "hint": "Tem aba na frente e protege a cabecinha do sol quente."
    },
    {
        "id": "casaco",
        "clean_word": "Casaco.",
        "spoken_name": "Ca... za... co! Casaco!",
        "hint": "Quentinho com mangas longas para vestir nos dias de frio."
    },
    {
        "id": "meia",
        "clean_word": "Meia.",
        "spoken_name": "Mêi... a! Meia!",
        "hint": "De algodão macio para esquentar os pés antes de calçar o sapato."
    },
    {
        "id": "pufe",
        "clean_word": "Pufe.",
        "spoken_name": "Pú... fe! Pufe!",
        "hint": "Assento baixinho e macio no cantinho para ler historinhas."
    },
    {
        "id": "vaso",
        "clean_word": "Vaso.",
        "spoken_name": "Vá... zo! Vaso!",
        "hint": "Feito de cerâmica para colocar plantinhas com água."
    },
    {
        "id": "foto",
        "clean_word": "Foto.",
        "spoken_name": "Fó... to! Foto!",
        "hint": "Um retrato de família sorrindo para enfeitar a parede."
    },
    {
        "id": "pote",
        "clean_word": "Pote.",
        "spoken_name": "Pó... te! Pote!",
        "hint": "Guarda creminho e xampu cheiroso para o banho."
    },
    {
        "id": "papel",
        "clean_word": "Papel.",
        "spoken_name": "Pa... pél! Papel!",
        "hint": "Rolinho branquinho e macio de papel para a higiene do banheiro."
    },
    {
        "id": "bacia",
        "clean_word": "Bacia.",
        "spoken_name": "Ba... cí... a! Bacia!",
        "hint": "Redondinha com água quentinha para lavar os pezinhos e brincar."
    },
    {
        "id": "gato",
        "clean_word": "Gato.",
        "spoken_name": "Gá... to! Gato!",
        "hint": "Amiguinho de quatro patas que sobe no muro e faz miau."
    },
    {
        "id": "muro",
        "clean_word": "Muro.",
        "spoken_name": "Mú-ro! Muro!",
        "hint": "Parede branquinha de tijolos que cerca o quintal."
    },
    {
        "id": "sapo",
        "clean_word": "Sapo.",
        "spoken_name": "Ssá... po! Sapo!",
        "hint": "Verdinho, pula bem alto perto das plantinhas do jardim."
    },
    {
        "id": "bota",
        "clean_word": "Bota.",
        "spoken_name": "Bó... ta! Bota!",
        "hint": "Calçado de cano alto para pular em poças de água na chuva."
    },
    {
        "id": "laco",
        "clean_word": "Laço.",
        "spoken_name": "Lá... so! Laço!",
        "hint": "De fita de cetim bonita para prender no cabelo ou no presente."
    },
    {
        "id": "sacola",
        "clean_word": "Sacola.",
        "spoken_name": "Ssa... có... la! Sacola!",
        "hint": "Com alças para carregar as comprinhas da feira ou brinquedos."
    },
]

async def generate_file(text: str, filepath: str, rate: str = "+0%"):
    communicate = edge_tts.Communicate(text, VOICE, rate=rate)
    await communicate.save(filepath)

def extract_tepe_from_file(input_mp3: str, start_ms_est: float, end_ms_est: float, output_mp3: str, lead_ms: float = 12.0, target_rms: float = 3500.0):
    """Extrai com precisão cirúrgica a oclusão e o burst do tepe alveolar [ɾ] (R brando) com re-encoding limpo LAME."""
    decoded = miniaudio.decode_file(input_mp3)
    sr = decoded.sample_rate
    channels = decoded.nchannels
    samples = np.array(decoded.samples, dtype=np.int16)

    if channels == 2:
        samples = samples.reshape(-1, 2)
    else:
        samples = samples.reshape(-1, 1)

    mono = samples.mean(axis=1) if channels == 2 else samples[:, 0]

    # Busca o ponto mínimo de energia (a oclusão do tepe) em torno da estimativa temporal
    search_start = max(0, int((start_ms_est - 30) / 1000.0 * sr))
    search_end = min(len(mono), int((start_ms_est + 30) / 1000.0 * sr))
    
    win_len = int(sr * 0.003)
    min_energy = float('inf')
    dip_idx = search_start
    for i in range(search_start, search_end - win_len, int(sr * 0.0005)):
        e = np.sum(mono[i : i + win_len].astype(np.float64) ** 2)
        if e < min_energy:
            min_energy = e
            dip_idx = i

    # O burst (soltura da língua dos alvéolos) ocorre logo após a oclusão
    burst_idx = dip_idx
    for k in range(dip_idx, min(len(mono), dip_idx + int(sr * 0.030))):
        if abs(mono[k]) > 500:
            burst_idx = k
            break

    # Ponto de início exatamente lead_ms antes do burst (preserva a oclusão do tepe sem a vogal anterior)
    ideal_start = max(0, burst_idx - int(sr * (lead_ms / 1000.0)))

    # Zero-crossing mais próximo para evitar clique
    cut_start = ideal_start
    for j in range(max(0, ideal_start - int(sr * 0.002)), min(len(mono) - 1, ideal_start + int(sr * 0.002))):
        if mono[j] * mono[j+1] <= 0:
            cut_start = j
            break

    cut_end = min(len(samples), int(end_ms_est / 1000.0 * sr))
    for j in range(max(0, cut_end - int(sr * 0.005)), cut_end):
        if 0 <= j < len(mono) - 1 and mono[j] * mono[j+1] <= 0:
            cut_end = j
            break

    sliced = samples[cut_start:cut_end].copy().astype(np.float32)

    # Fade-in suave de 3ms
    fade_in_len = int(sr * 0.003)
    fade_in = np.sin(np.linspace(0, np.pi / 2, fade_in_len)) ** 2
    for c in range(channels):
        sliced[:fade_in_len, c] *= fade_in

    # Fade-out suave de 25ms
    fade_out_len = int(sr * 0.025)
    fade_out = np.cos(np.linspace(0, np.pi / 2, fade_out_len)) ** 2
    for c in range(channels):
        sliced[-fade_out_len:, c] *= fade_out

    vowel_rms = np.sqrt(np.mean(sliced[:, 0] ** 2))
    if vowel_rms > 0:
        gain = target_rms / vowel_rms
        if 0.7 <= gain <= 1.5:
            sliced *= gain

    sliced_int16 = np.clip(sliced, -32768, 32767).astype(np.int16)

    encoder = lameenc.Encoder()
    encoder.set_bit_rate(48)
    encoder.set_in_sample_rate(sr)
    encoder.set_channels(channels)
    encoder.set_quality(2)
    mp3_data = encoder.encode(sliced_int16.tobytes())
    mp3_data += encoder.flush()

    with open(output_mp3, "wb") as f:
        f.write(mp3_data)

async def main():
    print("⚡ SINCRONIZANDO ÁUDIOS NEURAIS (Soletrando o Mundo - 48 Itens)")
    
    syllables_dir = os.path.join("public", "audio", "syllables")
    items_dir = os.path.join("public", "audio", "items")
    hints_dir = os.path.join("public", "audio", "hints")
    words_dir = os.path.join("public", "audio", "words")

    os.makedirs(syllables_dir, exist_ok=True)
    os.makedirs(items_dir, exist_ok=True)
    os.makedirs(hints_dir, exist_ok=True)
    os.makedirs(words_dir, exist_ok=True)

    force_all = "--force" in sys.argv
    phonetics_mode = force_all or "--phonetics" in sys.argv or True
    FORCE_REGENERATE_SYLLABLES = {
        "SA", "SO", "SU", "SE", "SI", "BÃO", "SA_Z", "SO_Z",
        "RO", "RO_OPEN", "RE",
        "BO", "BO_OPEN", "CO", "CO_OPEN", "PO", "PO_OPEN",
        "DOR", "COR", "PE", "ME", "TE"
    }
    FORCE_REGENERATE_ITEMS = {
        "sofa", "suco", "sopa", "sabao", "sapo", "sapato", "sacola", "muro", "arvore",
        "regador", "cortina", "escova", "bola", "bolo"
    }

    # 1. Sílabas Especiais / Faltantes
    print("\n📖 Verificando Sílabas Especiais...")
    for syl, spoken in SPECIAL_SYLLABLES.items():
        dest = os.path.join(syllables_dir, f"{syl}.mp3")
        should_gen = not os.path.exists(dest) or force_all or (phonetics_mode and syl in FORCE_REGENERATE_SYLLABLES)
        if should_gen:
            print(f"  + Gerando sílaba {syl} ('{spoken}')... ", end="", flush=True)
            await generate_file(spoken, dest)
            print("OK")
        else:
            print(f"  ✓ Sílaba {syl} já existe.")

    # 2. Áudios dos Itens (Cadência Legada)
    print("\n📦 Verificando Áudios dos Objetos...")
    for item in ITEMS_AUDIO:
        dest = os.path.join(items_dir, f"{item['id']}.mp3")
        should_gen = not os.path.exists(dest) or force_all or (phonetics_mode and item["id"] in FORCE_REGENERATE_ITEMS)
        if should_gen:
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

    # 5. Sílabas Específicas com Tepe Alveolar [ɾ] (R brando intervocálico em MURO e ÁRVORE)
    print("\n👅 Verificando Sílabas com Tepe Alveolar [ɾ]...")
    ro_tepe_dest = os.path.join(syllables_dir, "RO_TEPE.mp3")
    re_tepe_dest = os.path.join(syllables_dir, "RE_TEPE.mp3")
    muro_word = os.path.join(words_dir, "muro.mp3")
    arvore_word = os.path.join(words_dir, "arvore.mp3")

    if not os.path.exists(ro_tepe_dest) or force_all or phonetics_mode:
        print("  + Sintetizando e extraindo RO_TEPE [ɾo] de 'Muro.'... ", end="", flush=True)
        if not os.path.exists(muro_word):
            await generate_file("Muro.", muro_word, rate="-5%")
        extract_tepe_from_file(muro_word, 420, 580, ro_tepe_dest, lead_ms=12)
        print("OK")
    else:
        print("  ✓ Sílaba RO_TEPE já existe.")

    if not os.path.exists(re_tepe_dest) or force_all or phonetics_mode:
        print("  + Sintetizando e extraindo RE_TEPE [ɾe] de 'Árvore.'... ", end="", flush=True)
        if not os.path.exists(arvore_word):
            await generate_file("Árvore.", arvore_word, rate="-5%")
        extract_tepe_from_file(arvore_word, 585, 720, re_tepe_dest, lead_ms=12)
        print("OK")
    else:
        print("  ✓ Sílaba RE_TEPE já existe.")

    print("\n✨ Sincronização de todos os áudios concluída com sucesso!")

if __name__ == "__main__":
    asyncio.run(main())
