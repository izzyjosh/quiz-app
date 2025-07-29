import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Search from "../components/Search";
import Category from "../components/Category";

const Dashboard = () => {
  const categories = [
    { title: "Games", nQuiz: "200" },
    { title: "Science", nQuiz: "150" },
    { title: "Math", nQuiz: "180" },
    { title: "History", nQuiz: "120" }
  ];
  return (
    <div>
      <Header />
      <Hero />
      <Search />
      <div className="m-8">
        <h1 className="text-4xl font-bold mb-8">Categories</h1>
        <div className="flex justify-between flex-nowrap gap-4">
          {categories.map((cat, idx) => (
            <Category
              key={idx}
              title={cat.title}
              numberOfQuiz={cat.nQuiz}
              isOdd={idx % 2 === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
