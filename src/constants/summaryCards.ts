import { type SummaryCard } from '@/types/SummaryCard'

export const SUMMARY_CARDS: SummaryCard[] = [
  { id: 'tags', title: 'dashboard.tags' },
  { id: 'states', title: 'dashboard.states' },
  { id: 'priorities', title: 'dashboard.priorities' },
  { id: 'projects', title: 'dashboard.projects' },
]

export interface SummarySlide {
  id: string
  title: string
  cardIds: string[]
}

/** Two fixed slides: stats on the left, tags/projects on the right */
export const SUMMARY_SLIDES: SummarySlide[] = [
  {
    id: 'stateAndPriority',
    title: 'dashboard.stateAndPriority',
    cardIds: ['states', 'priorities'],
  },
  { id: 'tagAndProject', title: 'dashboard.tagAndProject', cardIds: ['tags', 'projects'] },
]
