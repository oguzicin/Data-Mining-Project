import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface AuthorSelectProps {
  onAuthorSelect: (author: string) => void;
}

const AuthorSelect: React.FC<AuthorSelectProps> = ({ onAuthorSelect }) => {
  const [authors, setAuthors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<{ authors: string[] }>('http://localhost:5001/authors')
      .then(res => {
        setAuthors(res.data.authors);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Yükleniyor...</div>;

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
