import type { Question } from '../types/question';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  showExplanation: boolean;
  onAnswer: (answerIndex: number) => void;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  showExplanation,
  onAnswer,
}: QuestionCardProps) {
  const getOptionClass = (index: number) => {
    const baseClass = 'w-full text-left p-4 rounded-lg transition duration-200 border-2 ';

    if (!showExplanation) {
      return baseClass + 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300';
    }

    if (index === question.correctAnswer) {
      return baseClass + 'bg-green-100 border-green-500';
    }

    if (selectedAnswer === index && index !== question.correctAnswer) {
      return baseClass + 'bg-red-100 border-red-500';
    }

    return baseClass + 'bg-gray-100 border-gray-300';
  };

  const getDifficultyBadge = () => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800',
    };
    const labels = {
      easy: '初級',
      medium: '中級',
      hard: '上級',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[question.difficulty]}`}>
        {labels[question.difficulty]}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="mb-4">
        {getDifficultyBadge()}
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
        {question.question}
      </h2>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            disabled={selectedAnswer !== null}
            className={getOptionClass(index)}
          >
            <div className="flex items-start">
              <span className="font-bold mr-3 text-gray-600">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="flex-1">{option}</span>
              {showExplanation && index === question.correctAnswer && (
                <span className="ml-2 text-green-600">✓</span>
              )}
              {showExplanation && selectedAnswer === index && index !== question.correctAnswer && (
                <span className="ml-2 text-red-600">✗</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className={`p-4 rounded-lg ${
          selectedAnswer === question.correctAnswer
            ? 'bg-green-50 border-2 border-green-200'
            : 'bg-red-50 border-2 border-red-200'
        }`}>
          <div className="flex items-center mb-2">
            {selectedAnswer === question.correctAnswer ? (
              <span className="text-green-600 font-bold text-lg">正解！</span>
            ) : (
              <span className="text-red-600 font-bold text-lg">不正解</span>
            )}
          </div>
          <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
