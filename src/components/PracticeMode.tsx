import { useState, useEffect } from 'react';
import type { Question, UserAnswer, TestResult } from '../types/question';
import questionsData from '../data/questions.json';
import QuestionCard from './QuestionCard';
import { saveTestResult } from '../utils/storage';

interface PracticeModeProps {
  category: string;
  onComplete: (result: TestResult) => void;
  onBack: () => void;
}

export default function PracticeMode({ category, onComplete, onBack }: PracticeModeProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    const filtered = (questionsData as Question[]).filter(q => q.category === category);
    setQuestions(filtered);
  }, [category]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">この問題がありません</p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      isCorrect,
      timestamp: Date.now(),
    };

    setAnswers([...answers, userAnswer]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const result: TestResult = {
        id: `practice-${Date.now()}`,
        date: Date.now(),
        mode: 'practice',
        category,
        questions: questions.map(q => q.id),
        answers,
        score: answers.filter(a => a.isCorrect).length + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0),
        totalQuestions: questions.length,
      };
      saveTestResult(result);
      onComplete(result);
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              ← 戻る
            </button>
            <span className="text-gray-600 font-semibold">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          showExplanation={showExplanation}
          onAnswer={handleAnswer}
        />

        {showExplanation && (
          <div className="mt-6">
            <button
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-200"
            >
              {currentIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
