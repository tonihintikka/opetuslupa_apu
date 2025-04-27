export interface Skill {
  id?: string; // Auto-generated UUID if not provided
  name: string; // Name of the skill
  description?: string; // Description of the skill
  categoryId: string; // Reference to the category this skill belongs to
  required: boolean; // Whether this skill is required for licensing
  active: boolean; // Whether the skill is active in the app
  createdAt: Date; // When the skill was created
}
