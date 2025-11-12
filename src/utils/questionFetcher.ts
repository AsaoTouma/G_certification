import type { Question } from '../types/question';

// 問題取得用の設定
const QUESTIONS_URL = import.meta.env.VITE_QUESTIONS_URL || '';
const CACHE_KEY = 'g-certification-questions-cache';
const CACHE_TIMESTAMP_KEY = 'g-certification-questions-timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24時間（ミリ秒）

/**
 * 現在年度を取得
 */
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

/**
 * キャッシュが有効かチェック
 */
const isCacheValid = (): boolean => {
  const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  if (!timestamp) return false;

  const cacheTime = parseInt(timestamp, 10);
  const now = Date.now();

  return now - cacheTime < CACHE_DURATION;
};

/**
 * キャッシュから問題を取得
 */
const getCachedQuestions = (): Question[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    return JSON.parse(cached) as Question[];
  } catch (error) {
    console.error('Failed to parse cached questions:', error);
    return null;
  }
};

/**
 * 問題をキャッシュに保存
 */
const cacheQuestions = (questions: Question[]): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(questions));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Failed to cache questions:', error);
  }
};

/**
 * 外部URLから問題を取得
 */
const fetchQuestionsFromURL = async (): Promise<Question[]> => {
  if (!QUESTIONS_URL) {
    throw new Error('Questions URL is not configured');
  }

  try {
    const response = await fetch(QUESTIONS_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.status}`);
    }

    const questions = await response.json() as Question[];
    return questions;
  } catch (error) {
    console.error('Error fetching questions from URL:', error);
    throw error;
  }
};

/**
 * 年度で問題をフィルタリング
 * @param questions - 問題リスト
 * @param year - フィルタする年度（デフォルトは現在年度）
 */
export const filterQuestionsByYear = (questions: Question[], year?: number): Question[] => {
  const targetYear = year || getCurrentYear();
  return questions.filter(q => q.year === targetYear);
};

/**
 * 問題を取得（キャッシュ優先、1日1回自動更新）
 * @param forceRefresh - 強制的に再取得する場合はtrue
 */
export const getQuestions = async (forceRefresh: boolean = false): Promise<Question[]> => {
  // 強制更新でない場合、キャッシュをチェック
  if (!forceRefresh && isCacheValid()) {
    const cached = getCachedQuestions();
    if (cached) {
      console.log('Using cached questions');
      return cached;
    }
  }

  // 外部URLが設定されている場合は取得を試みる
  if (QUESTIONS_URL) {
    try {
      console.log('Fetching questions from URL:', QUESTIONS_URL);
      const questions = await fetchQuestionsFromURL();
      cacheQuestions(questions);
      return questions;
    } catch (error) {
      console.warn('Failed to fetch from URL, falling back to local questions');
      // フォールバック: ローカルのquestions.jsonを使用
    }
  }

  // ローカルのquestions.jsonを読み込む（フォールバック）
  const localQuestions = await import('../data/questions.json');
  return localQuestions.default as Question[];
};

/**
 * キャッシュをクリア
 */
export const clearQuestionsCache = (): void => {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  console.log('Questions cache cleared');
};

/**
 * 最後の更新時刻を取得
 */
export const getLastUpdateTime = (): Date | null => {
  const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  if (!timestamp) return null;

  return new Date(parseInt(timestamp, 10));
};
