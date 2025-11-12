import type { TestResult } from '../types/question';
import categoriesData from '../data/categories.json';

interface ResultsProps {
  result: TestResult;
  onBack: () => void;
}

export default function Results({ result, onBack }: ResultsProps) {
  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const isPassed = percentage >= 70;

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return null;
    const category = categoriesData.find(c => c.id === categoryId);
    return category?.name;
  };

  const getGrade = () => {
    if (percentage >= 90) return { text: 'S', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (percentage >= 80) return { text: 'A', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 70) return { text: 'B', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 60) return { text: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { text: 'D', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const grade = getGrade();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">テスト結果</h2>
          {result.category && (
            <p className="text-gray-600">{getCategoryName(result.category)}</p>
          )}
          {result.mode === 'exam' && (
            <p className="text-gray-600">模擬試験</p>
          )}
        </div>

        <div className="flex justify-center mb-8">
          <div className={`w-32 h-32 rounded-full ${grade.bg} flex items-center justify-center`}>
            <span className={`text-6xl font-bold ${grade.color}`}>{grade.text}</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-gray-800 mb-2">
            {percentage}点
          </div>
          <div className="text-xl text-gray-600">
            {result.score} / {result.totalQuestions} 問正解
          </div>
        </div>

        <div className={`p-6 rounded-lg mb-8 ${isPassed ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className={`text-center text-lg font-semibold ${isPassed ? 'text-green-800' : 'text-red-800'}`}>
            {isPassed ? '合格レベル！' : '復習して再挑戦しましょう'}
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-3">問題ごとの結果</h3>
            <div className="space-y-2">
              {result.answers.map((answer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white rounded"
                  >
                    <span className="text-gray-700">問題 {index + 1}</span>
                    <span className={answer.isCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                      {answer.isCorrect ? '○' : '×'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <button
          onClick={onBack}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-200"
        >
          ホームに戻る
        </button>
      </div>
    </div>
  );
}
