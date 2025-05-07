import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface AuthorSelectProps {
  onAuthorSelect: (author: string) => void;
}

const AuthorSelect: React.FC<AuthorSelectProps> = ({ onAuthorSelect }) => {
  const [authors, setAuthors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:5001/authors');
        setAuthors(response.data.authors);
        setLoading(false);
      } catch (err) {
        setError('Yazarlar yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <select
      onChange={(e) => onAuthorSelect(e.target.value)}
      className="border rounded-md p-2 w-64"
      defaultValue=""
    >
      <option value="" disabled>Yazar seçin</option>
      {authors.map((author) => (
        <option key={author} value={author}>
          {author}
        </option>
      ))}
    </select>
  );
};

export default AuthorSelect; 