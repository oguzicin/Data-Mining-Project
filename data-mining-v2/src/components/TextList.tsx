import { AuthorText } from "../types";

interface TextListProps {
  texts: AuthorText[];
  onTextSelect?: (text: AuthorText) => void;
}

const TextList: React.FC<TextListProps> = ({ texts, onTextSelect }) => {
  return (
    <div className="space-y-4 mt-4">
      {texts.map((text, index) => (
        <div
          key={index}
          className={`p-4 border rounded cursor-pointer hover:bg-blue-50 transition`}
          onClick={() => onTextSelect && onTextSelect(text)}
        >
          <h3 className="text-lg font-semibold">{text.title}</h3>
          <p className="text-sm text-gray-700">{text.content}</p>
        </div>
      ))}
    </div>
  );
};

export default TextList;
