import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import AuthorSelect from '../components/AuthorSelect';
import Tags from '../components/Tags';
import Textinput from '../components/Textinput';
import axios from 'axios';
import os from 'os';

interface Article {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

interface PredictResponse {
  prediction: string;
  tags: string[];
}

const allTags = ['savaş', 'kadın', 'doğa', 'edebiyat', 'tarih', 'toplum', 'aşk', 'bilim', 'çocuk', 'şehir', 'siyaset'];

const TextClassificationPage: React.FC = () => {
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [originalArticles, setOriginalArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articleTags, setArticleTags] = useState<string[]>([]);
  const [articleLoading, setArticleLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [predictedTags, setPredictedTags] = useState<string[]>([]);
  const [freeTextLoading, setFreeTextLoading] = useState(false);
  const [authors, setAuthors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setArticles([]);
    setOriginalArticles([]);
    setSelectedArticle(null);
    setArticleTags([]);
    if (selectedAuthor) {
      axios.get<{ articles: { id: string; title: string; date: string }[] }>(`http://localhost:5001/articles?author=${selectedAuthor}`)
        .then(async res => {

          const articlesWithTags = await Promise.all(
            res.data.articles.map(async (article) => {
              try {
                const contentRes = await axios.get<{ content: string }>(`http://localhost:5001/article?author=${selectedAuthor}&id=${article.id}`);
                const predictRes = await axios.post<PredictResponse>("http://localhost:5001/predict", {
                  text: contentRes.data.content,
                });
                return {
                  id: article.id,
                  title: article.title,
                  content: contentRes.data.content,
                  tags: predictRes.data.tags
                };
              } catch (error) {
                return {
                  id: article.id,
                  title: article.title,
                  content: '',
                  tags: []
                };
              }
            })
          );
          setArticles(articlesWithTags);
          setOriginalArticles(articlesWithTags);
        });
    }
  }, [selectedAuthor]);


  const handlePredictArticleTags = async () => {
    if (!selectedArticle || !selectedArticle.content) return;
    setArticleLoading(true);
    setArticleTags([]);
    try {
      const res = await axios.post<PredictResponse>("http://localhost:5001/predict", {
        text: selectedArticle.content,
      });
      setArticleTags(res.data.tags);
    } catch {
      setArticleTags([]);
    } finally {
      setArticleLoading(false);
    }
  };


  const handlePredict = async () => {
    if (!inputText.trim()) return;
    setFreeTextLoading(true);
    setPredictedTags([]);
    try {
      const res = await axios.post<PredictResponse>("http://localhost:5001/predict", {
        text: inputText,
      });
      setPredictedTags(res.data.tags);
    } catch {
      setPredictedTags([]);
    } finally {
      setFreeTextLoading(false);
    }
  };


  const handleTagSelect = (selectedTag: string | null) => {
    if (!selectedTag) {
      setArticles(originalArticles);
      return;
    }
    const filteredArticles = originalArticles.filter(article => article.tags && article.tags.includes(selectedTag));
    setArticles(filteredArticles);
  };

  useEffect(() => {
    axios.get<{ authors: string[] }>('http://localhost:5001/authors')
      .then(res => {
        setAuthors(res.data.authors);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen">
      <BackButton />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Text Classification</h1>


        <div className="w-[500px] mb-6">
          <AuthorSelect onAuthorSelect={setSelectedAuthor} />
        </div>


        {selectedAuthor && (
          <div className="w-[500px] mb-6">
            <h2 className="text-xl font-semibold mb-2">Yazarın Yazıları</h2>
            <div className="space-y-2">
              {articles.map(article => (
                <div
                  key={article.id}
                  className={`p-2 border rounded cursor-pointer hover:bg-blue-50 transition ${selectedArticle?.id === article.id ? 'bg-blue-100' : ''}`}
                  onClick={() => setSelectedArticle(article)}
                >
                  {article.title}
                </div>
              ))}
            </div>
          </div>
        )}


        {selectedArticle && (
          <div className="w-[500px] mb-6">
            <h2 className="text-lg font-semibold mb-2">Yazı İçeriği</h2>
            <div className="bg-gray-50 p-2 rounded mb-2 max-h-40 overflow-y-auto text-sm">{selectedArticle.content}</div>
            <button
              onClick={handlePredictArticleTags}
              className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              disabled={articleLoading}
            >
              {articleLoading ? 'Tahmin Ediliyor...' : 'Etiketleri Tahmin Et'}
            </button>
            {articleTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {articleTags.map((tag) => (
                  <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}


        <div className="w-[500px] mb-6">
          <h2 className="text-xl font-semibold mb-2">Serbest Metin ile Etiket Tahmini</h2>
          <Textinput
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Metni buraya yapıştırın..."
          />
          <button
            onClick={handlePredict}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            disabled={freeTextLoading}
          >
            {freeTextLoading ? 'Tahmin Ediliyor...' : 'Etiketleri Tahmin Et'}
          </button>
          {predictedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {predictedTags.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{tag}</span>
              ))}
            </div>
          )}
        </div>


        <div className="w-[500px]">
          <h2 className="text-xl font-semibold mb-2">Etiketlere Göre Filtrele:</h2>
          <Tags allTags={allTags} onTagSelect={handleTagSelect} />
        </div>
      </div>
    </div>
  );
};

export default TextClassificationPage;