import pandas as pd
import string
from collections import Counter

def extract_custom_features(df: pd.DataFrame):
    author_features = []

    for author, group in df.groupby("author"):
        texts = group["text"]

        all_words = []
        text_lengths = []
        punctuation_count = 0
        total_chars = 0

        for text in texts:
            words = text.split()
            all_words.extend(words)
            text_lengths.append(len(words))
            total_chars += len(text)
            punctuation_count += sum(1 for c in text if c in string.punctuation)

        most_common_word, _ = Counter(all_words).most_common(1)[0]
        avg_length = sum(text_lengths) / len(text_lengths)
        punctuation_freq = punctuation_count / total_chars if total_chars > 0 else 0

        author_features.append({
            "Yazar": author,
            "En Sık Kelime": most_common_word,
            "Ortalama Uzunluk": round(avg_length, 2),
            "Noktalama Sıklığı": round(punctuation_freq, 4),
        })

    return pd.DataFrame(author_features)
