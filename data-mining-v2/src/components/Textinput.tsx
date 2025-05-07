import React from "react";

interface TextinputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  w?: string;
  h?: string;
  placeholder?: string;
}

const Textinput: React.FC<TextinputProps> = ({
  value = "",
  onChange,
  w = "w-96",
  h = "h-48",
  placeholder = "Write your text here...",
}) => {
  return (
    <textarea
      className={`border rounded-md p-2 ${w} ${h}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Textinput;

