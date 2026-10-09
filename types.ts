export type CategoryId = 'transport' | 'essential' | 'variable' | 'virtual';

export interface ExpenseItem {
  id: string;
  name: string;
  value: number;
  date: string; // ISO Date string
  createdAt: string; // Time string HH:MM
  categoryId: CategoryId;
}

export interface CategoryDef {
  id: CategoryId;
  title: string;
  color: string; // Tailwind text color class, e.g., 'text-cyan-400'
  barColor: string; // Tailwind bg color class for bar
  limitEstimate: number; // Soft limit for the mini-bar visualization
}

export interface ModalState {
  type: 'add' | 'delete' | 'info' | null;
  categoryId?: CategoryId;
  itemId?: string;
}
