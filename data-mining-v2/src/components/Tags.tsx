import React, { useState } from 'react';

interface TagsProps {
  allTags: string[];
  onTagSelect: (tag: string | null) => void;
}

const Tags: React.FC<TagsProps> = ({ allTags, onTagSelect }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      onTagSelect(null);
    } else {
      setSelectedTag(tag);
      onTagSelect(tag);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap mt-4">
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={`px-4 py-2 rounded-full transition
            ${selectedTag === tag ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
            ${selectedTag && selectedTag !== tag ? 'opacity-50' : 'opacity-100'}
          `}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default Tags;
