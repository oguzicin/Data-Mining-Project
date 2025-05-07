
from transformers import BertTokenizer, BertModel
import torch
import numpy as np
from tqdm import tqdm

# BERT tokenizer ve modelini yükle
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
model = BertModel.from_pretrained("bert-base-uncased")

# Metinleri BERT vektörüne dönüştüren fonksiyon
def get_bert_embeddings(texts):
    embeddings = []
    for text in tqdm(texts, desc="BERT Embedding"):
        inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
        with torch.no_grad():
            outputs = model(**inputs)
        cls_embedding = outputs.last_hidden_state[:, 0, :].squeeze().numpy()
        embeddings.append(cls_embedding)
    return np.array(embeddings)
