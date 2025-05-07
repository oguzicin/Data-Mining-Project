import React from "react";

interface ButtonProps {
  onClick?: () => void;
  text?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, text = "Tahmin Et" }) => {
  return (
    <button
      className="bg-white text-blue-600 font-semibold px-4 py-2 rounded shadow hover:bg-blue-100"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;

