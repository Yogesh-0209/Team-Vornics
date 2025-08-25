
export interface Benefit {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

export const keyBenefits: Benefit[] = [
  {
    id: 'zero-manual',
    title: 'Zero Manual Entry',
    description: 'Eliminate time-consuming manual data extraction from SoF documents, eliminating tedious and error-prone manual input.',
    icon: "https://c.animaapp.com/me1o4g4zYBg550/assets/icon-9.svg"
  },
  {
    id: 'faster-claims',
    title: 'Faster Claims Processing',
    description: 'Expedite claims calculations and claim processing with instant access to structured event data.',
    icon: "https://c.animaapp.com/me1o4g4zYBg550/assets/icon-13.svg"
  },
  {
    id: 'audit-ready',
    title: 'Audit-ready Data',
    description: 'Generate consistent and transparent records for auditing and compliance needs.',
    icon: "https://c.animaapp.com/me1o4g4zYBg550/assets/icon-14.svg"
  },
  {
    id: 'global-compatibility',
    title: 'Global Template Compatibility',
    description: 'Process SoF documents from various templates and formats with high accuracy.',
    icon: "https://c.animaapp.com/me1o4g4zYBg550/assets/icon-15.svg"
  }
] as const;
