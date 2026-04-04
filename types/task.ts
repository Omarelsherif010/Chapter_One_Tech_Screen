/** Represents a single task in the task manager */
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

/** Filter options for the task list */
export type FilterType = 'all' | 'active' | 'completed';
