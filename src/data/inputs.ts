export interface SupportedInput {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
}

export const supportedInputs: SupportedInput[] = [
  {
    id: 'pdf',
    name: 'PDF',
    icon: "https://c.animaapp.com/me1o4g4zYBg550/assets/icon-10.svg"
  },
  {
    id: 'docx',
    name: 'DOCX',
    icon: "https://c.animaapp.com/me1o4g4zYBg550/assets/icon-10.svg"
  }
] as const;
