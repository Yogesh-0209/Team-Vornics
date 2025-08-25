export interface NavigationItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

export const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'login', label: 'Login', href: '/login' }
] as const;
