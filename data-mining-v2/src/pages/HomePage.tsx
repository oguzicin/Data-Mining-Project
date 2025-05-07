import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-32">
      <div>
        <h1 className="text-3xl">Data Mining Project</h1>
      </div>
      <div className="flex flex-row gap-10">
        <button
        className="w-[300px] h-[100px] bg-white text-gray-800 border-2 border-gray-400 hover:bg-gray-300 rounded-lg"
        onClick={() => navigate("/author-identification")}
      >
        Author Identification
      </button>
      <button
        className="w-[300px] h-[100px] bg-white text-gray-800 border-2 border-gray-400 hover:bg-gray-300 rounded-lg"  
        onClick={() => navigate("/text-classification")}
      >
        Text Classification
      </button>
      </div>
      
    </div>
  );
};

export default HomePage;
