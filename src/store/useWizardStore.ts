
import { create } from 'zustand';

interface WizardState {
  currentStep: number;
  answers: Record<string, string>;
  setCurrentStep: (step: number) => void;
  setAnswer: (questionId: string, answerValue: string) => void;
  reset: () => void;
}

export const useWizardStore = create<WizardState>((set, get) => ({
  currentStep: 0,
  answers: {},
  setCurrentStep: (step) => set({ currentStep: step }),
  setAnswer: (questionId, answerValue) => set(state => ({
    answers: { ...state.answers, [questionId]: answerValue }
  })),
  reset: () => set({ currentStep: 0, answers: {} }),
}));
