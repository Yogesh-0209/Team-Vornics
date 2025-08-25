export interface Language {
  readonly code: string;
  readonly name: string;
}

export interface ProcessStep {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English (EN)' },
  { code: 'fr', name: 'French (FR)' },
  { code: 'es', name: 'Spanish (ES)' }
] as const;

export const processSteps: ProcessStep[] = [
  {
    id: 'upload',
    title: 'File Upload',
    icon: "https://c.animaapp.com/me1o4g4zYBg550/assets/icon-2.svg"
  },
  {
    id: 'preprocessing',
    title: 'Preprocessing',
    icon: "https://c.animaapp.com/me1o4g4zYBg550/assets/icon-4.svg"
  },
  {
    id: 'extraction',
    title: 'Extraction',
    icon: "https://c.animaapp.com/me1o4g4zYBg550/assets/icon-5.svg"
  },
  {
    id: 'formatting',
    title: 'Output Formatting',
    icon: "https://c.animaapp.com/me1o4g4zYBg550/assets/icon-6.svg"
  }
] as const;
