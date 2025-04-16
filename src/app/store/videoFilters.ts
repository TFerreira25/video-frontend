import { create } from 'zustand';

interface VideoFiltersState {
  size: string | null;
  locale: string | null;
  setSize: (size: string | null) => void;
  setLocale: (locale: string | null) => void;
}

export const useVideoFilters = create<VideoFiltersState>((set) => ({
  size: null,
  locale: null,
  setSize: (size) => set({ size }),
  setLocale: (locale) => set({ locale }),
}));
