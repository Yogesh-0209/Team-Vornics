export interface TimelineEvent {
  readonly id: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'anchored',
    icon: '⚓',
    title: 'Anchored',
    description: 'Vessel arrives at port limits'
  },
  {
    id: 'cargo-loading',
    icon: '📦',
    title: 'Cargo Loading',
    description: 'Commenced cargo operations'
  },
  {
    id: 'shifting',
    icon: '🚢',
    title: 'Shifting',
    description: 'Movement within port'
  },
  {
    id: 'departed',
    icon: '🌊',
    title: 'Departed',
    description: 'Vessel leaves port limits'
  }
] as const;
