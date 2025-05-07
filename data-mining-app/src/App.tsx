import React, { useState } from "react";
import Textinput from "./components/Textinput";
import Button from "./components/Button";
import AuthorSelect from "./components/AuthorSelect";
import ArticleList from "./components/ArticleList";
import ArticleView from "./components/ArticleView";
import axios from "axios";

interface Article {
  id: string;
  title: string;
  date: string;
}

function App() {
  const [inputText, setInputText] = useState("");
  const [predictedAuthor, setPredictedAuthor] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const handlePredict = async () => {
    if (!inputText.trim()) return;

    try {
      const res = await axios.post("http://localhost:5001/predict", {
        text: inputText,
      });
      setPredictedAuthor(res.data.prediction);
    } catch (err) {
      console.error("API Hatası:", err);
      setPredictedAuthor("Tahmin yapılamadı.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-400 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white font-serif text-center mb-12">
          Author Identifier
        </h1>

        <div className="grid grid-cols-2 gap-8">
          {/* Sol taraf: Yazar tahmini */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Yazar Tahmini</h2>
            <div className="space-y-4">
              <Textinput
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <Button onClick={handlePredict} text="Tahmin Et" />
                {predictedAuthor && (
                  <div className="text-lg">
                    Tahmin: <span className="font-bold">{predictedAuthor}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sağ taraf: Yazar yazıları */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Yazar Yazıları</h2>
            <AuthorSelect onAuthorSelect={setSelectedAuthor} />
            <ArticleList
              author={selectedAuthor}
              onArticleSelect={setSelectedArticle}
            />
          </div>
        </div>

        {/* Seçilen yazının içeriği */}
        {selectedArticle && (
          <div className="mt-8 bg-white rounded-lg shadow-lg">
            <ArticleView author={selectedAuthor} article={selectedArticle} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
