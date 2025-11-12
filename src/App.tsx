import { useState } from 'react';
import Home from './components/Home';
import PracticeMode from './components/PracticeMode';
import ExamMode from './components/ExamMode';
import ReviewMode from './components/ReviewMode';
import Results from './components/Results';
import History from './components/History';
import type { TestResult } from './types/question';

type Screen = 'home' | 'practice' | 'exam' | 'review' | 'results' | 'history';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null);

  const handleStartPractice = (category: string) => {
    setSelectedCategory(category);
    setCurrentScreen('practice');
  };

  const handleStartExam = () => {
    setCurrentScreen('exam');
  };

  const handleStartReview = () => {
    setCurrentScreen('review');
  };

  const handleViewHistory = () => {
    setCurrentScreen('history');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedCategory('');
    setCurrentResult(null);
  };

  const handleTestComplete = (result: TestResult) => {
    setCurrentResult(result);
    setCurrentScreen('results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {currentScreen === 'home' && (
        <Home
          onStartPractice={handleStartPractice}
          onStartExam={handleStartExam}
          onStartReview={handleStartReview}
          onViewHistory={handleViewHistory}
        />
      )}
      {currentScreen === 'practice' && (
        <PracticeMode
          category={selectedCategory}
          onComplete={handleTestComplete}
          onBack={handleBackToHome}
        />
      )}
      {currentScreen === 'exam' && (
        <ExamMode
          onComplete={handleTestComplete}
          onBack={handleBackToHome}
        />
      )}
      {currentScreen === 'review' && (
        <ReviewMode
          onComplete={handleTestComplete}
          onBack={handleBackToHome}
        />
      )}
      {currentScreen === 'results' && currentResult && (
        <Results
          result={currentResult}
          onBack={handleBackToHome}
        />
      )}
      {currentScreen === 'history' && (
        <History onBack={handleBackToHome} />
      )}
    </div>
  );
}

export default App;
