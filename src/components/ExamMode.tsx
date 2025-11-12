import { useState, useEffect } from 'react';
import type { Question, UserAnswer, TestResult } from '../types/question';
import questionsData from '../data/questions.json';
import QuestionCard from './QuestionCard';
import { saveTestResult } from '../utils/storage';

interface ExamModeProps {
  onComplete: (result: TestResult) => void;
  onBack: () => void;
}

const EXAM_QUESTION_COUNT = 10;
const TIME_LIMIT = 600; // 10分

export default function ExamMode({ onComplete, onBack }: ExamModeProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (!isStarted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted]);

  const handleStart = () => {
    const shuffled = [...questionsData as Question[]]
      .sort(() => Math.random() - 0.5)
      .slice(0, EXAM_QUESTION_COUNT);
    setQuestions(shuffled);
    setIsStarted(true);
  };

  const handleTimeUp = () => {
    const result: TestResult = {
      id: `exam-${Date.now()}`,
      date: Date.now(),
      mode: 'exam',
      questions: questions.map(q => q.id),
      answers,
      score: answers.filter(a => a.isCorrect).length,
      totalQuestions: questions.length,
    };
    saveTestResult(result);
    onComplete(result);
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">模擬試験</h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <span className="text-blue-600 font-bold mr-3">•</span>
              <p className="text-gray-700">問題数: {EXAM_QUESTION_COUNT}問</p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 font-bold mr-3">•</span>
              <p className="text-gray-700">制限時間: {TIME_LIMIT / 60}分</p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 font-bold mr-3">•</span>
              <p className="text-gray-700">全カテゴリーからランダムに出題</p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 font-bold mr-3">•</span>
              <p className="text-gray-700">解答後すぐに正解と解説を表示</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleStart}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-200"
            >
              試験を開始
            </button>
            <button
              onClick={onBack}
              className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition duration-200"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

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
        id: `exam-${Date.now()}`,
        date: Date.now(),
        mode: 'exam',
        questions: questions.map(q => q.id),
        answers,
        score: answers.filter(a => a.isCorrect).length + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0),
        totalQuestions: questions.length,
      };
      saveTestResult(result);
      onComplete(result);
    }
  };

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-600 font-semibold">
              問題 {currentIndex + 1} / {questions.length}
            </div>
            <div className={`text-xl font-bold ${timeRemaining < 60 ? 'text-red-600' : 'text-gray-800'}`}>
              残り {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-200"
            >
              {currentIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
