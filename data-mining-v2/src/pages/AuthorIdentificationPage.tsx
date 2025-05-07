import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Textinput from '../components/Textinput';
import axios from 'axios';

const AuthorIdentificationPage: React.FC = () => {
  const [text, setText] = useState('');
  const [predictedAuthor, setPredictedAuthor] = useState<string | null>(null);
  const [predictedTags, setPredictedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setPredictedAuthor(null);
    setPredictedTags([]);
    try {
      const res = await axios.post<{ prediction: string; tags: string[] }>(
        'http://localhost:5001/predict',
        { text }
      );
      setPredictedAuthor(res.data.prediction);
      setPredictedTags(res.data.tags);
    } catch (err) {
      setError('Tahmin sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <BackButton />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Author Identification</h1>
        <Textinput value={text} onChange={(e) => setText(e.target.value)} />
        <button
          onClick={handleSearch}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Tahmin Ediliyor...' : 'Tahmin Et'}
        </button>

        {/* Sonuçlar */}
        {predictedAuthor && (
          <div className="mt-6 p-4 border rounded bg-white shadow">
            <div className="text-lg font-semibold mb-2">Tahmin Edilen Yazar: <span className="text-blue-700">{predictedAuthor}</span></div>
            {predictedTags.length > 0 && (
              <div>
                <div className="font-semibold mb-1">Tahmin Edilen Etiketler:</div>
                <div className="flex flex-wrap gap-2">
                  {predictedTags.map((tag) => (
                    <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>
    </div>
  );
};

export default AuthorIdentificationPage;
