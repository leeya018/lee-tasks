export type CategoryColor = 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'purple' | 'pink';

export interface Category {
  id: string;
  name: string;
  color: CategoryColor;
}

export interface Task {
  id: string;
  categoryId: string;
  text: string;
  done: boolean;
}

export interface TasksByDate {
  [date: string]: Task[];
}

export interface TaskManagerData {
  categories: Category[];
  tasks: TasksByDate;
}

export const CATEGORY_COLORS: CategoryColor[] = [
  'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink'
];

export const COLOR_CLASSES: Record<CategoryColor, { bg: string; text: string; border: string }> = {
  red: { bg: 'bg-category-red', text: 'text-category-red', border: 'border-category-red' },
  orange: { bg: 'bg-category-orange', text: 'text-category-orange', border: 'border-category-orange' },
  yellow: { bg: 'bg-category-yellow', text: 'text-category-yellow', border: 'border-category-yellow' },
  green: { bg: 'bg-category-green', text: 'text-category-green', border: 'border-category-green' },
  teal: { bg: 'bg-category-teal', text: 'text-category-teal', border: 'border-category-teal' },
  blue: { bg: 'bg-category-blue', text: 'text-category-blue', border: 'border-category-blue' },
  purple: { bg: 'bg-category-purple', text: 'text-category-purple', border: 'border-category-purple' },
  pink: { bg: 'bg-category-pink', text: 'text-category-pink', border: 'border-category-pink' },
};