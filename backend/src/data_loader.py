
import os
import pandas as pd

def load_data_from_folders(base_path):
    data = []
    for author in os.listdir(base_path):
        author_path = os.path.join(base_path, author)
        if os.path.isdir(author_path):
            for file in os.listdir(author_path):
                file_path = os.path.join(author_path, file)
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    text = f.read()
                    data.append({"text": text, "author": author})
    return pd.DataFrame(data)

if __name__ == "__main__":
    base_path = "../data/dataset_authorship"
    df = load_data_from_folders(base_path)
    df.to_csv("../data/author_dataset.csv", index=False)
    print("CSV dosyası oluşturuldu.")
