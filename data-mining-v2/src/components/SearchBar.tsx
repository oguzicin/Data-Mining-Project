import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar: React.FC = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (input.trim()) {
      navigate(`/author/${input.trim()}`);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        className="border px-2 py-1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search author..."
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-3 py-1 rounded">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
