
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split

def get_tfidf(X, y):
    vectorizer = TfidfVectorizer()
    X_tfidf = vectorizer.fit_transform(X)
    return train_test_split(X_tfidf, y, test_size=0.2, random_state=42), vectorizer
