export interface ExpenseCategoryRecord {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  isSystem: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
