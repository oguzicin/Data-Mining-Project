import joblib
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from src.preprocessing import clean_text  # metin temizleme fonksiyonunu src/preprocessing.py'de tutacağız
from src.train_models import extract_tags

# Mutlak yolun garantilenmesi için BASE_DIR
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Flask uygulamasını başlat
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # React arayüzüne izin ver

# Model ve vectorizer dosyalarını yükle
model_path = os.path.join("models", "svm_model.pkl")
vectorizer_path = os.path.join("models", "tfidf_vectorizer.pkl")

try:
    model = joblib.load(model_path)
    vectorizer = joblib.load(vectorizer_path)
except Exception as e:
    raise RuntimeError(f"Model veya vectorizer yüklenemedi: {e}")

# Yazarları listele
@app.route("/authors", methods=["GET"])
def list_authors():
    data_path = os.path.join(BASE_DIR, "data", "dataset_authorship")
    authors = []
    for item in os.listdir(data_path):
        if os.path.isdir(os.path.join(data_path, item)):
            authors.append(item)
    return jsonify({"authors": sorted(authors)})

# Yazarın yazılarını listele
@app.route("/articles", methods=["GET"])
def list_articles():
    author = request.args.get("author")
    if not author:
        return jsonify({"error": "Yazar parametresi gerekli"}), 400
    
    author_path = os.path.join(BASE_DIR, "data", "dataset_authorship", author)
    if not os.path.exists(author_path):
        return jsonify({"error": "Yazar bulunamadı"}), 404
    
    articles = []
    for fname in sorted(os.listdir(author_path)):
        if fname.endswith(".txt"):
            with open(os.path.join(author_path, fname), encoding="utf-8") as f:
                # İlk 5 satırı oku (başlık için)
                lines = [line.strip() for line in f.readlines()[:5]]
                # Boş olmayan ilk satırı başlık olarak al
                title = next((line for line in lines if line), fname)
                articles.append({
                    "id": fname,
                    "title": title,
                    "date": fname.split(".")[0]  # 2012_09_15.txt -> 2012_09_15
                })
    
    return jsonify({"articles": articles})

# Yazının içeriğini getir
@app.route("/article", methods=["GET"])
def get_article():
    author = request.args.get("author")
    article_id = request.args.get("id")
    
    if not author or not article_id:
        return jsonify({"error": "Yazar ve yazı ID'si gerekli"}), 400
    
    file_path = os.path.join(BASE_DIR, "data", "dataset_authorship", author, article_id)
    if not os.path.exists(file_path):
        return jsonify({"error": "Yazı bulunamadı"}), 404
    
    with open(file_path, encoding="utf-8") as f:
        content = f.read()
    
    return jsonify({
        "content": content,
        "author": author,
        "id": article_id
    })

# Tahmin endpoint'i
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Lütfen JSON içinde 'text' alanını gönderin."}), 400

    raw_text = data["text"]
    cleaned_text = clean_text(raw_text)
    
    # Yazar tahmini
    vector = vectorizer.transform([cleaned_text])
    prediction = model.predict(vector)
    
    # Etiket çıkarma
    tags = extract_tags(raw_text)

    return jsonify({
        "prediction": prediction[0],
        "tags": tags
    })

if __name__ == "__main__":
    app.run(port=5001, debug=True)
