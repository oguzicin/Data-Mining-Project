import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Article {
  id: string;
  title: string;
  date: string;
}

interface ArticleViewProps {
  author: string | null;
  article: Article | null;
}

const ArticleView: React.FC<ArticleViewProps> = ({ author, article }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!author || !article) {
        setContent(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:5001/article?author=${author}&id=${article.id}`
        );
        setContent(response.data.content);
      } catch (err) {
        setError('Yazı içeriği yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [author, article]);

  if (!author || !article) return null;
  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-4 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
      <p className="text-gray-500 mb-4">{article.date}</p>
      <div className="prose max-w-none">
        {content?.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ArticleView; 