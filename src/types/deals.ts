/**
 * Deal entity type definition
 * Shared across frontend services and components
 */
export interface Deal {
  id: string;
  title: string;
  price: number;
  currency: string;
  ticket: number;
  yield_percent: number;
  sold_percent: number;
  days_left: number | null;
  image_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}
