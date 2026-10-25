import type { AppState } from '../types';

const STORAGE_KEY = 'student_expense_tracker_data';

const defaultState: AppState = {
  transactions: [],
  initialBalance: 0,
  budget: { amount: 10000, enabled: false },
  isSetupComplete: false,
};

export const loadData = (): AppState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultState;
  } catch (error) {
    console.error('Failed to load data from localStorage', error);
    return defaultState;
  }
};

export const saveData = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save data to localStorage', error);
  }
};

export const clearData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear data from localStorage', error);
  }
};
