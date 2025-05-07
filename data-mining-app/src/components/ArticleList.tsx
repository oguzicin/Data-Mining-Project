import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Article {
  id: string;
  title: string;
  date: string;
}

interface ArticleListProps {
  author: string | null;
  onArticleSelect: (article: Article) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ author, onArticleSelect }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!author) {
        setArticles([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:5001/articles?author=${author}`);
        setArticles(response.data.articles);
      } catch (err) {
        setError('Yazılar yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [author]);

  if (!author) return null;
  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">{author} - Yazılar</h2>
      <div className="space-y-2">
        {articles.map((article) => (
          <div
            key={article.id}
            onClick={() => onArticleSelect(article)}
            className="p-4 border rounded-md cursor-pointer hover:bg-blue-50"
          >
            <h3 className="font-semibold">{article.title}</h3>
            <p className="text-sm text-gray-500">{article.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleList; 