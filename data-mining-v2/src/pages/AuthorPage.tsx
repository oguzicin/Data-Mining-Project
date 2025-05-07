import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAuthorTexts } from "../api";
import { AuthorText } from "../types";
import TagButton from "../components/TagButton";
import TextList from "../components/TextList";
import axios from "axios";

const AuthorPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [texts, setTexts] = useState<AuthorText[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<AuthorText | null>(null);
  const [predictedTags, setPredictedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (name) {
      fetchAuthorTexts(name).then(setTexts);
    }
  }, [name]);

  const toggleTag = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag);
  };

  const handleTextSelect = async (text: AuthorText) => {
    setSelectedText(text);
    setPredictedTags([]);
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post<{ tags: string[] }>(
        "http://localhost:5001/predict",
        { text: text.content }
      );
      setPredictedTags(res.data.tags);
    } catch (err) {
      setError("Etiket tahmini sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const tags = Array.from(new Set(texts.flatMap(t => t.tags)));
  const filteredTexts = activeTag
    ? texts.filter(t => t.tags.includes(activeTag))
    : texts;

  return (
    <div className="p-4">
      <button onClick={() => navigate("/")} className="text-blue-500 mb-4">← Home</button>
      <h1 className="text-3xl font-bold mb-4">{name}</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map(tag => (
          <TagButton key={tag} tag={tag} isActive={activeTag === tag} toggleTag={toggleTag} />
        ))}
      </div>

      <TextList texts={filteredTexts} onTextSelect={handleTextSelect} />

      {/* Seçilen metnin etiket tahmini */}
      {selectedText && (
        <div className="mt-6 p-4 border rounded bg-white shadow">
          <div className="font-semibold mb-2">Seçilen Metin:</div>
          <div className="mb-2 text-gray-700">{selectedText.content}</div>
          {loading && <div className="text-blue-600">Etiketler tahmin ediliyor...</div>}
          {error && <div className="text-red-600">{error}</div>}
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
    </div>
  );
};

export default AuthorPage;
