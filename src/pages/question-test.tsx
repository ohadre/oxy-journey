import React, { useState, useEffect } from 'react';
import { fetchAndResolveQuestions } from '../lib/questionService';
import { DisplayQuestion, LanguageCode } from '../types/question.types';

export default function QuestionTestPage() {
  const [englishQuestions, setEnglishQuestions] = useState<DisplayQuestion[]>([]);
  const [hebrewQuestions, setHebrewQuestions] = useState<DisplayQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const enQuestions = await fetchAndResolveQuestions('en');
        setEnglishQuestions(enQuestions);

        const heQuestions = await fetchAndResolveQuestions('he');
        setHebrewQuestions(heQuestions);

      } catch (err) {
        console.error("Failed to load questions for test page:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
      setIsLoading(false);
    };

    loadQuestions();
  }, []);

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Loading questions...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error loading questions: {error}</div>;
  }

  return (
    <div style={{ display: 'flex', padding: '20px', fontFamily: 'sans-serif', color: '#FFF' }}>
      <div style={{ marginRight: '40px' }}>
        <h2>English Questions (Loaded: {englishQuestions.length})</h2>
        {englishQuestions.length > 0 ? (
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {englishQuestions.map(q => (
              <li key={q.id} style={{ marginBottom: '15px', border: '1px solid #eee', padding: '10px' }}>
                <strong>ID:</strong> {q.id} <br />
                <strong>Topic:</strong> {q.topic} <br />
                <strong>Type:</strong> {q.type} <br />
                <strong>Text:</strong> {q.text} <br />
                {q.options && (
                  <>
                    <strong>Options:</strong>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px'}}>
                      {q.options.map((opt, index) => (
                        <li key={`${q.id}-opt-${index}`}>{opt.text} {opt.isCorrect ? '(Correct)' : ''}</li>
                      ))}
                    </ul>
                  </>
                )}
                {q.explanation && (
                  <>
                    <strong>Explanation:</strong> {q.explanation}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No English questions loaded.</p>
        )}
      </div>

      <div>
        <h2>Hebrew Questions (Loaded: {hebrewQuestions.length})</h2>
        {hebrewQuestions.length > 0 ? (
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {hebrewQuestions.map(q => (
              <li key={q.id} style={{ marginBottom: '15px', border: '1px solid #eee', padding: '10px' }}>
                <strong>ID:</strong> {q.id} <br />
                <strong>Topic:</strong> {q.topic} <br />
                <strong>Type:</strong> {q.type} <br />
                <strong>Text (HE):</strong> {q.text} <br />
                {q.options && (
                  <>
                    <strong>Options (HE):</strong>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px'}}>
                      {q.options.map((opt, index) => (
                        <li key={`${q.id}-opt-${index}-he`}>{opt.text} {opt.isCorrect ? '(נכון)' : ''}</li> // Example for Hebrew correct indicator
                      ))}
                    </ul>
                  </>
                )}
                {q.explanation && (
                  <>
                    <strong>Explanation (HE):</strong> {q.explanation}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Hebrew questions loaded.</p>
        )}
      </div>
    </div>
  );
} 