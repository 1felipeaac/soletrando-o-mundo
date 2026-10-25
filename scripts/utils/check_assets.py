import re
import os

repo = r'c:\Users\felip\Documents\Projetos\soletrando-o-mundo'
with open(os.path.join(repo, 'src/data/worldsData.ts'), 'r', encoding='utf-8') as f:
    text = f.read()

syllable_lists = re.findall(r'(?:syllables|distractors):\s*\[([^\]]+)\]', text)
all_syls = set()
for sl in syllable_lists:
    items = [x.strip().strip('\'"') for x in sl.split(',') if x.strip()]
    all_syls.update(items)

print(f'Total syllables/distractors: {len(all_syls)}')
for s in sorted(all_syls):
    print(f'{s}: {[ord(c) for c in s]}')

item_ids = re.findall(r'id:\s*\'([a-z0-9_]+)\'', text)
print(f'Item ids: {item_ids}')

# Check which audio files exist
syllable_dir = os.path.join(repo, 'public/audio/syllables')
words_dir = os.path.join(repo, 'public/audio/words')
existing_syls = set(os.listdir(syllable_dir))
existing_words = set(os.listdir(words_dir))

missing_syls = []
for s in all_syls:
    clean = s.strip().upper()
    possible = [f'{clean}.mp3', f'{clean.normalize("NFD").replace(chr(771), "") if hasattr(clean, "normalize") else clean}.mp3']
    if clean == 'ÇÃ':
        possible.append('SA_TIL.mp3')
    if clean == 'LÓ':
        possible.append('LO.mp3')
    if clean == 'FÁ':
        possible.append('FA.mp3')
    found = any(p in existing_syls for p in possible)
    if not found:
        missing_syls.append(s)

print(f'Missing syllables: {missing_syls}')

missing_words = [item for item in item_ids if f'{item}.mp3' not in existing_words]
print(f'Missing words: {missing_words}')
