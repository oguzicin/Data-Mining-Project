import React from "react";

interface Props {
  tag: string;
  isActive: boolean;
  toggleTag: (tag: string) => void;
}

const TagButton: React.FC<Props> = ({ tag, isActive, toggleTag }) => {
  return (
    <button
      onClick={() => toggleTag(tag)}
      className={`px-3 py-1 rounded-full border ${
        isActive ? "bg-blue-600 text-white" : "bg-gray-100"
      }`}
    >
      {tag}
    </button>
  );
};

export default TagButton;
