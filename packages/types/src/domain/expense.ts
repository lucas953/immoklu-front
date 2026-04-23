export interface ExpenseRecord {
  id: string;
  propertyId: string | null;
  categoryId: string | null;
  property: {
    id: string;
    name: string;
  } | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  amount: string;
  currency: string;
  expenseDate: string;
  vendorPayee: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
