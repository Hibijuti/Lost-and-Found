/** University lost & found categories — used for posting and filtering */
export const ITEM_CATEGORIES = [
  'Electronics',
  'IDs & School Documents',
  'Clothing',
  'Accessories',
  'School Supplies',
  'Others',
] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];
