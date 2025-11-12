import { useState, useEffect } from 'react';
import categories from '../data/categories.json';
import { getQuestions, getLastUpdateTime, getCurrentYear } from '../utils/questionFetcher';

interface HomeProps {
  onStartPractice: (category: string) => void;
  onStartExam: () => void;
  onStartReview: () => void;
  onViewHistory: () => void;
}

export default function Home({ onStartPractice, onStartExam, onStartReview, onViewHistory }: HomeProps) {
  const [showCategories, setShowCategories] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setLastUpdate(getLastUpdateTime());
    // 起動時に問題を取得（キャッシュがあればキャッシュを使用）
    getQuestions().catch(console.error);
  }, []);

  const handleUpdateQuestions = async () => {
    setIsUpdating(true);
    try {
      await getQuestions(true); // 強制更新
      setLastUpdate(new Date());
      alert('問題を更新しました！');
    } catch (error) {
      console.error('Failed to update questions:', error);
      alert('問題の更新に失敗しました');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">G検定学習アプリ</h1>
          <p className="text-gray-600">スマホで手軽にG検定対策</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>対象年度: {getCurrentYear()}年</p>
            {lastUpdate && (
              <p className="mt-1">
                最終更新: {lastUpdate.toLocaleString('ja-JP')}
              </p>
            )}
          </div>
          <button
            onClick={handleUpdateQuestions}
            disabled={isUpdating}
            className="mt-3 text-sm bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? '更新中...' : '問題を更新'}
          </button>
        </div>

        {!showCategories ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowCategories(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
            >
              <div className="text-xl mb-1">問題演習</div>
              <div className="text-sm opacity-90">カテゴリー別に学習</div>
            </button>

            <button
              onClick={onStartExam}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
            >
              <div className="text-xl mb-1">模擬試験</div>
              <div className="text-sm opacity-90">本番形式で実力チェック</div>
            </button>

            <button
              onClick={onStartReview}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
            >
              <div className="text-xl mb-1">復習</div>
              <div className="text-sm opacity-90">間違えた問題を確認</div>
            </button>

            <button
              onClick={onViewHistory}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
            >
              <div className="text-xl mb-1">学習履歴</div>
              <div className="text-sm opacity-90">これまでの成績を確認</div>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">カテゴリー選択</h2>
              <button
                onClick={() => setShowCategories(false)}
                className="text-gray-600 hover:text-gray-800 font-semibold"
              >
                戻る
              </button>
            </div>
            <div className="space-y-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onStartPractice(category.id)}
                  className="w-full text-left bg-blue-50 hover:bg-blue-100 p-4 rounded-lg transition duration-200 border-2 border-transparent hover:border-blue-300"
                >
                  <div className="font-bold text-blue-900 mb-1">{category.name}</div>
                  <div className="text-sm text-gray-600">{category.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>このアプリはPWAに対応しています</p>
          <p className="mt-1">ホーム画面に追加していつでもアクセス可能</p>
        </div>
      </div>
    </div>
  );
}
