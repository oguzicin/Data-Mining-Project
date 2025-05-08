# 🧠 Author Classification & Text Tagging Web App

This full-stack web application allows users to input text and receive the **predicted author** and **relevant keyword tags** using advanced natural language processing and machine learning models.

Built with:
- 🖥️ **Frontend**: React + TypeScript
- 🧠 **Backend**: Flask + Scikit-learn/BERT
- ☁️ Deployed via: [Heroku / Your platform here]

---

## 📦 Features

### 📝 Text Input & Author Prediction
Users can paste any piece of text into the input field. After submitting, the backend processes the text and predicts the most likely author using machine learning models trained on TF-IDF, N-gram, and BERT embeddings.

### 🏷 Keyword Tagging
In addition to authorship, the app also extracts and displays relevant **tags** (keywords) summarizing the topic/content of the text.

### 📊 Visual Analysis (Future Scope)
Graphing tools to visualize author prediction confidence and tag frequency are planned for future versions.

---

## 🔐 Log In System (Optional)
If OAuth or account-based use is enabled:
- Users log in via Google Account (OAuth 2.0)
- User sessions are stored to track prediction history (optional)

---

