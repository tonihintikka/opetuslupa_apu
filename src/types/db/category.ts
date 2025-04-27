export interface Category {
  id?: string; // Auto-generated UUID if not provided
  name: string; // Name of the category
  description?: string; // Description of the category
  order: number; // Display order of the category
  active: boolean; // Whether the category is active in the app
  createdAt: Date; // When the category was created
}
