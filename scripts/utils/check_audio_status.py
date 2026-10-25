import os
import re

with open('src/data/worldsData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for id and syllables
pattern = re.compile(r"id:\s*['\"]([^'\"]+)['\"].*?displayName:\s*['\"]([^'\"]+)['\"].*?syllables:\s*\[([^\]]+)\]", re.DOTALL)
matches = pattern.findall(content)

print(f"Total items found: {len(matches)}")
for item_id, display_name, syls_str in matches:
    syllables = [s.strip(" '\"") for s in syls_str.split(',') if s.strip(" '\"")]
    missing = []
    for s in syllables:
        # Check syllable file
        p = os.path.join('public', 'audio', 'syllables', f"{s}.mp3")
        if not os.path.exists(p):
            missing.append(s)
    word_file = os.path.join('public', 'audio', 'words', f"{item_id}.mp3")
    item_file = os.path.join('public', 'audio', 'items', f"{item_id}.mp3")
    print(f"Item: {item_id:8} ({display_name:8}) | Syllables: {syllables} | Missing: {missing} | Word: {os.path.exists(word_file)} | ItemClip: {os.path.exists(item_file)}")
