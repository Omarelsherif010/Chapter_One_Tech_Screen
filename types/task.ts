/** Priority levels ordered from highest to lowest urgency */
export type Priority = 'high' | 'medium' | 'low';

/** Numeric weights for sort ordering (lower = higher priority) */
export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

/** Represents a single task in the task manager */
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority: Priority;
}

/** Filter options for the task list */
export type FilterType = 'all' | 'active' | 'completed';
