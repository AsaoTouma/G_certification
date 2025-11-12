import { useEffect, useState } from 'react';
import type { TestResult } from '../types/question';
import { getTestResults, clearTestResults } from '../utils/storage';
import categoriesData from '../data/categories.json';

interface HistoryProps {
  onBack: () => void;
}

export default function History({ onBack }: HistoryProps) {
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    const allResults = getTestResults();
    setResults(allResults.sort((a, b) => b.date - a.date));
  }, []);

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return '全カテゴリー';
    const category = categoriesData.find(c => c.id === categoryId);
    return category?.name || '不明';
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleClearHistory = () => {
    if (confirm('学習履歴をすべて削除しますか？')) {
      clearTestResults();
      setResults([]);
    }
  };

  const averageScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.score / r.totalQuestions * 100), 0) / results.length)
    : 0;

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← 戻る
          </button>
          <h1 className="text-2xl font-bold text-gray-800">学習履歴</h1>
          <div className="w-16"></div>
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <p className="text-gray-600 mb-4">まだ学習履歴がありません</p>
            <button
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
            >
              学習を始める
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-gray-600 mb-2">総テスト回数</div>
                <div className="text-3xl font-bold text-blue-600">{results.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-gray-600 mb-2">平均スコア</div>
                <div className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>
                  {averageScore}点
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-6">
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="font-bold text-gray-800">テスト履歴</h2>
              </div>
              <div className="divide-y">
                {results.map((result) => {
                  const percentage = Math.round((result.score / result.totalQuestions) * 100);
                  return (
                    <div key={result.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-gray-800">
                            {result.mode === 'exam' ? '模擬試験' : getCategoryName(result.category)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(result.date)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                            {percentage}点
                          </div>
                          <div className="text-sm text-gray-600">
                            {result.score}/{result.totalQuestions}問
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleClearHistory}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              履歴をクリア
            </button>
          </>
        )}
      </div>
    </div>
  );
}
