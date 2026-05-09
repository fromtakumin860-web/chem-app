"use client";
import { useState } from "react";

const questions = [
  { question: "水の化学式は？", answer: "H2O" },
  { question: "二酸化炭素の化学式は？", answer: "CO2" },
  { question: "酸素の化学式は？", answer: "O2" },
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const check = () => {
    const correct = questions[index].answer.toLowerCase();
    const user = input.toLowerCase();

    if (correct === user) {
      setResult("⭕ 正解！");
    } else {
      setResult("❌ 不正解！ 正解: " + questions[index].answer);
    }
  };

  const next = () => {
    setIndex((index + 1) % questions.length);
    setInput("");
    setResult("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-6">
        {questions[index].question}
      </h1>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="答えを入力"
        className="border p-2 text-xl"
      />

      <div className="mt-4 space-x-4">
        <button onClick={check} className="bg-blue-500 text-white px-4 py-2">
          答える
        </button>

        <button onClick={next} className="bg-gray-500 text-white px-4 py-2">
          次へ
        </button>
      </div>

      <p className="mt-4 text-lg">{result}</p>
    </div>
  );
}