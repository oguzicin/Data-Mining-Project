import os
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from .preprocessing import clean_text
from collections import Counter
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import numpy as np

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')

# Önceden tanımlanmış kategoriler ve anahtar kelimeleri
CATEGORIES = {
    'savaş': ['savaş', 'çatışma', 'barış', 'silah', 'ordu', 'asker', 'terör', 'güvenlik'],
    'kadın': ['kadın', 'feminizm', 'eşitlik', 'hak', 'toplumsal cinsiyet', 'kadın hakları'],
    'doğa': ['doğa', 'çevre', 'iklim', 'ekoloji', 'yeşil', 'sürdürülebilirlik'],
    'edebiyat': ['edebiyat', 'kitap', 'roman', 'şiir', 'yazar', 'okuma', 'kültür'],
    'tarih': ['tarih', 'geçmiş', 'tarihi', 'olay', 'dönem', 'çağ'],
    'toplum': ['toplum', 'sosyal', 'insan', 'toplumsal', 'grup', 'kültür'],
    'aşk': ['aşk', 'sevgi', 'romantik', 'duygu', 'kalp'],
    'bilim': ['bilim', 'teknoloji', 'araştırma', 'keşif', 'bilimsel'],
    'çocuk': ['çocuk', 'eğitim', 'okul', 'öğrenme', 'genç'],
    'şehir': ['şehir', 'kent', 'urban', 'metropol', 'yaşam'],
    'siyaset': ['siyaset', 'politik', 'hükümet', 'meclis', 'parti', 'seçim', 'cumhurbaşkanı', 'başbakan', 'milletvekili', 'anayasa', 'demokrasi', 'politikacı', 'politikalar', 'devlet', 'yasa', 'kanun', 'parlamento', 'oy', 'koalisyon', 'iktidar', 'muhalefet']
}

def calculate_category_scores(text, vectorizer):
    """Metni kategorilere göre puanla."""
    # Metni temizle ve vektöre dönüştür
    cleaned_text = clean_text(text)
    text_vector = vectorizer.transform([cleaned_text])
    
    # Her kategori için puan hesapla
    scores = {}
    for category, keywords in CATEGORIES.items():
        # Kategori anahtar kelimelerinin TF-IDF skorlarını topla
        category_score = 0
        for keyword in keywords:
            try:
                keyword_idx = vectorizer.vocabulary_[keyword]
                category_score += text_vector[0, keyword_idx]
            except KeyError:
                continue
        scores[category] = category_score
    
    return scores

def extract_tags(text, top_n=3):
    """Metinden en uygun etiketleri çıkar."""
    # TF-IDF vectorizer oluştur
    vectorizer = TfidfVectorizer(max_features=1000)
    
    # Tüm kategorilerin anahtar kelimelerini birleştir
    all_keywords = []
    for keywords in CATEGORIES.values():
        all_keywords.extend(keywords)
    
    # Vectorizer'ı eğit
    vectorizer.fit(all_keywords)
    
    # Kategori skorlarını hesapla
    category_scores = calculate_category_scores(text, vectorizer)
    
    # En yüksek skorlu kategorileri seç
    sorted_categories = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)
    selected_tags = [category for category, score in sorted_categories[:top_n] if score > 0]
    
    return selected_tags

# 1. Veriyi yükle
data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "dataset_authorship")
texts = []
authors = []

for author in os.listdir(data_path):
    author_path = os.path.join(data_path, author)
    if os.path.isdir(author_path):
        for fname in os.listdir(author_path):
            with open(os.path.join(author_path, fname), encoding="utf-8") as f:
                text = f.read()
                texts.append(clean_text(text))
                authors.append(author)

# 2. TF-IDF vectorizer
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)
y = authors

# 3. Model eğit
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = SVC(kernel='linear')
model.fit(X_train, y_train)

# 4. Kaydet
os.makedirs("models", exist_ok=True)
joblib.dump(model, os.path.join("models", "svm_model.pkl"))
joblib.dump(vectorizer, os.path.join("models", "tfidf_vectorizer.pkl"))

print("Model ve vectorizer başarıyla kaydedildi.")
