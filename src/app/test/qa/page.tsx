"use client";

import { useState } from "react";
import { lungQuestions } from "@/data/question-templates/lungs";
import { Question } from "@/types/question";
import Image from "next/image";

export default function QATestPage() {
  const [selected, setSelected] = useState<Question | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 py-8">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-center text-3xl font-bold text-indigo-900 mb-8">Question Template Tester</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">All Questions</h2>
          <ul className="divide-y divide-gray-200">
            {lungQuestions.map((q) => (
              <li key={q.id}>
                <button
                  className={`w-full text-left py-3 px-2 hover:bg-blue-50 focus:bg-blue-100 rounded transition ${selected?.id === q.id ? "bg-blue-100" : ""}`}
                  onClick={() => setSelected(q)}
                >
                  <span className="font-medium text-indigo-800">[{q.topic}]</span> {q.questionText}
                  <span className="ml-2 text-xs text-gray-500">(Difficulty: {q.difficulty})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {selected && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Question Details</h2>
            <div className="mb-2">
              <span className="font-medium text-indigo-800">Topic:</span> {selected.topic}
            </div>
            <div className="mb-2">
              <span className="font-medium text-indigo-800">Text:</span> {selected.questionText}
            </div>
            <div className="mb-2">
              <span className="font-medium text-indigo-800">Difficulty:</span> {selected.difficulty}
            </div>
            {selected.image && (
              <div className="mb-2">
                <span className="font-medium text-indigo-800">Image:</span>
                <div className="relative w-64 h-40 mt-2">
                  <Image
                    src={selected.image.path}
                    alt={selected.image.alt}
                    fill
                    className="object-contain rounded border"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">Position: {selected.image.position}</div>
              </div>
            )}
            {selected.type === "yes_no" && (
              <div className="mb-2">
                <span className="font-medium text-indigo-800">Correct Answer:</span> {selected.correctAnswer ? "Yes" : "No"}
                <div className="mt-1 text-gray-700">Explanation: {selected.explanation}</div>
              </div>
            )}
            {selected.type === "multiple_choice" && (
              <div className="mb-2">
                <span className="font-medium text-indigo-800">Answers:</span>
                <ul className="list-disc ml-6 mt-1">
                  {selected.answers.map((a, i) => (
                    <li key={i} className={a.isCorrect ? "text-green-700 font-semibold" : ""}>
                      {a.text}
                      {a.isCorrect && <span className="ml-2 text-xs text-green-600">(Correct)</span>}
                      <div className="text-xs text-gray-600">{a.explanation}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setSelected(null)}
            >
              Back to List
            </button>
          </div>
        )}
      </div>
    </main>
  );
} 