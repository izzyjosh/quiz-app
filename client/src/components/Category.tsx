import React from "react";
type CategoryProps = {
  title: string;
  numberOfQuiz: string;
  isOdd: boolean;
};

const Category: React.FC<CategoryProps> = ({ title, numberOfQuiz, isOdd }) => {
  return (
    <div className="relative w-1/5 h-[90px] rounded-xl shadow-[10px_20px_40px_#0000008c] overflow-hidden before:absolute before:top-[-50%] before:right-[-50%] before:left-[-50%] before:bottom-[-50%] before:bg-[conic-gradient(red,green,blue,yellow,purple,red)] before:content-[''] before:animate-spin before:blur-3xl">
      <div
        className={`absolute flex flex-col items-center justify-center p-6 bg-white ${
          isOdd ? "" : "shadow-[10px_10px_20px_#0000008c_inset]"
        } top-[5px] right-[5px] bottom-[5px] left-[5px] rounded-xl`}
      >
        <h3 className="text-xl font-bold">{title}</h3>
        <p>
          {numberOfQuiz} {`${numberOfQuiz === "1" ? "quiz" : "quizzes"}`}
        </p>
      </div>
    </div>
  );
};
export default Category;
