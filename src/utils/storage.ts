import type { TestResult } from '../types/question';

const STORAGE_KEY = 'g-certification-results';

export const saveTestResult = (result: TestResult): void => {
  try {
    const results = getTestResults();
    results.push(result);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch (error) {
    console.error('Failed to save test result:', error);
  }
};

export const getTestResults = (): TestResult[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get test results:', error);
    return [];
  }
};

export const clearTestResults = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear test results:', error);
  }
};

export const getIncorrectQuestionIds = (): Set<number> => {
  const results = getTestResults();
  const incorrectIds = new Set<number>();

  results.forEach(result => {
    result.answers.forEach(answer => {
      if (!answer.isCorrect) {
        incorrectIds.add(answer.questionId);
      }
    });
  });

  return incorrectIds;
};
