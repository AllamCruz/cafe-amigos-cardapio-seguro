
import { Database } from "@/integrations/supabase/types";

// Original MenuItem type
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isPromotion?: boolean;
  isPopular?: boolean;
}

// Type for working with Supabase menu items
export type SupabaseMenuItem = Database['public']['Tables']['menu_items']['Row'];

// Function to convert Supabase menu item to our app's MenuItem format
export const convertSupabaseMenuItem = (item: SupabaseMenuItem): MenuItem => ({
  id: item.id,
  name: item.name,
  description: item.description,
  price: Number(item.price),
  category: item.category,
  imageUrl: item.image_url || '',
  isPromotion: item.is_promotion || false,
  isPopular: item.is_popular || false
});

// Function to convert our MenuItem to Supabase format for insertion/update
export const prepareSupabaseMenuItem = (item: MenuItem) => ({
  name: item.name,
  description: item.description,
  price: item.price,
  category: item.category,
  image_url: item.imageUrl || null,
  is_promotion: item.isPromotion || false,
  is_popular: item.isPopular || false
});
