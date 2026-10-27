### 3. Diretrizes de Engenharia de Prompt e Regras de Pronúncia
Sempre que eu solicitar correções de palavras, desenvolvimento de dicionários fonéticos ou scripts de áudio para o aplicativo, você deve aplicar rigorosamente as seguintes regras fonotáticas do Português Brasileiro (PB):

*   **Regra 1: Redução Vocálica de Vogais Átonas Finais**
    *   *O que é:* No final de palavras, as vogais "E" e "O" perdem força na fala natural e mudam de som.
    *   *Conversão:* "E" final não acentuado vira /i/ (*Dente* -> "denti"). "O" final não acentuado vira /u/ (*Gato* -> "gatu").
    *   *Erro a evitar:* Pronúncia travada ou artificial no final das palavras (*dentÊ*, *gatÓ*).
*   **Regra 2: Palatização de "T" e "D" (Africação)**
    *   *O que é:* Ocorre quando as letras "T" e "D" encontram o som de /i/ (seja a letra "I" ou o "E" reduzido no fim da palavra).
    *   *Conversão:* T + I/E vira som de "tch" (*Tia* -> "tchia"; *Noite* -> "noitchi"). D + I/E vira som de "dj" (*Dia* -> "djia"; *Cidade* -> "cidadji").
*   **Regra 3: Vocalização do "L" em Coda Silábica**
    *   *O que é:* O "L" posicionado no final de sílabas ou de palavras.
    *   *Conversão:* O "L" assume estritamente o som da semivogal /u/ (*Brasil* -> "Brasiu"; *Balde* -> "baudi").
    *   *Erro a evitar:* Articular o "L" encostando a língua no céu da boca (padrão europeu).
*   **Regra 4: O "S" Intervocálico**
    *   *O que é:* A letra "S" quando posicionada exatamente entre duas vogais.
    *   *Conversão:* Assume obrigatoriamente o som fonético sonoro de /z/ (*Casa* -> "caza"; *Rosa* -> "roza").
*   **Regra 5: O "R" Inicial e os Róticos**
    *   *O que é:* O comportamento da letra "R" dependendo da sua posição na sílaba.
    *   *Conversão:* "R" no início de palavras (`#R`) ou após consoante de outra sílaba (como em *genro*) vira o som forte/tenso de "RR" (*Rato* -> "Rrato"). "R" único entre vogais assume o som fraco/tepe (*Arara*).

---

Temos que desenvolver este aplicativo atuando como Linguística Computacional e TTS. As pronuncias de silabas e palvras devem focar nesses pontos:
1.  Ajudar a estruturar tabelas de mapeamento de palavras (Grafia vs. Som Esperado).
2.  Gerar marcações em formato **SSML** (usando tags `<phoneme>` com alfabeto IPA ou X-SAMPA) para corrigir os desvios da voz neural quando eu te fornecer uma lista de palavras difíceis.
3.  Propor dinâmicas textuais para o método fônico de soletração infantil.

Confirme que entendeu o contexto e as regras acadêmicas do projeto respondendo com um breve resumo de como você pode me ajudar a otimizar a lista de palavras do app daqui para frente.

---

## Referências Científicas de Suporte (Mapeamento Fonético-Ortográfico no PB)

*   **BAGNO, Marcos.** *Preconceito linguístico: o que é, como se faz.* São Paulo: Edições Loyola, 2015. (Fundamentação sobre variação linguística e a legitimidade dos dialetos falados no Brasil).
*   **BISOL, Leda (Org.).** *Introdução a estudos de fonologia do português brasileiro.* Porto Alegre: EDIPUCRS, 2005. (Mapeamento dos processos de redução vocálica e palatização das oclusivas alveolares /t/ e /d/).
*   **CRISTÓFARO-SILVA, Thaïs.** *Fonética e Fonologia do Português: roteiro de estudos e guia prático.* São Paulo: Contexto, 2010. (Descrição técnico-científica das regras contextuais regulares e distribuição dos fonemas /s/ e /r/).
*   **LEMLE, Miriam.** *Guia teórico do alfabetizador.* São Paulo: Ática, 2009. (Análise das correspondências regulares e irregulares entre grafemas e fonemas focada na alfabetização infantil).
*   **MORAIS, Artur Gomes de.** *Ortografia: ensinar e aprender.* São Paulo: Ática, 2003. (Classificação pedagógica das regras ortográficas em biunívocas, regulares contextuais e morfológicas).
*   **TEIXEIRA, Antônio; OLIVEIRA, Francisco.** *Conversão de Grafemas para Fonemas em Português.* Revista Linguamática, v. 3, n. 2, 2011. (Estudo computacional sobre as matrizes de regras fonotáticas aplicadas a sistemas de síntese de voz (TTS)).
