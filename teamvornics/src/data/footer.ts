export interface FooterLink {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

export interface FooterSection {
  readonly id: string;
  readonly title: string;
  readonly links: FooterLink[];
}

export interface SocialLink {
  readonly id: string;
  readonly href: string;
  readonly icon: string;
}

export const footerSections: FooterSection[] = [
  {
    id: 'resources',
    title: 'Resources',
    links: [
      { id: 'documentation', label: 'Documentation', href: '#' },
      { id: 'api-reference', label: 'API Reference', href: '#' },
      { id: 'tutorials', label: 'Tutorials', href: '#' }
    ]
  },
  {
    id: 'company',
    title: 'Company',
    links: [
      { id: 'about-us', label: 'About Us', href: '#' },
      { id: 'careers', label: 'Careers', href: '#' },
      { id: 'contact', label: 'Contact', href: '#' }
    ]
  },
  {
    id: 'support',
    title: 'Support',
    links: [
      { id: 'help-center', label: 'Help Center', href: '#' },
      { id: 'community', label: 'Community', href: '#' },
      { id: 'status', label: 'Status', href: '#' }
    ]
  }
] as const;

export const socialLinks: SocialLink[] = [
  {
    id: 'social-1',
    href: '#',
    icon: "https://c.animaapp.com/me1o4g4zYBg550/assets/icon-16.svg"
  },
  {
    id: 'social-2',
    href: '#',
    icon: "https://c.animaapp.com/me1o4g4zYBg550/assets/icon-17.svg"
  },
  {
    id: 'social-3',
    href: '#',
    icon: "https://c.animaapp.com/me1o4g4zYBg550/assets/icon-18.svg"
  }
] as const;
