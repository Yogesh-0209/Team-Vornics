export interface Feature {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

export const keyFeatures: Feature[] = [
  {
    id: 'ai-extraction',
    title: 'AI-Based Extraction',
    description: 'Leverage advanced AI and machine learning to accurately parse and extract critical information from Statement of Facts documents.',
    icon: "https://c.animaapp.com/me1o4g4zYBg550/assets/icon-7.svg"
  },
  {
    id: 'structured-output',
    title: 'Structured Data Output',
    description: 'Transform unstructured document data into organized formats like CSV, JSON, and XML for seamless integration with existing systems.',
    icon: "https://c.animaapp.com/me1o4g4zYBg550/assets/icon-8.svg"
  },
  {
    id: 'template-agnostic',
    title: 'Template-Agnostic Parsing',
    description: 'Our AI understands various SoF formats, eliminating the need for pre-defined templates and accommodating different document types.',
    icon: "https://c.animaapp.com/me1o4g4zYBg550/assets/icon-9.svg"
  }
] as const;
