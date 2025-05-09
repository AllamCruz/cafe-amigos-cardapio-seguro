
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
  variations?: MenuItemVariation[];
}

// Variation type for different sizes/options
export interface MenuItemVariation {
  id?: string;
  name: string;
  price: number;
}

// Type for working with Supabase menu items
export type SupabaseMenuItem = Database['public']['Tables']['menu_items']['Row'];

// Type for working with Supabase menu item variations
export type SupabaseMenuItemVariation = Database['public']['Tables']['menu_item_variations']['Row'];

// Function to convert Supabase menu item to our app's MenuItem format
export const convertSupabaseMenuItem = (
  item: SupabaseMenuItem, 
  variations: SupabaseMenuItemVariation[] = []
): MenuItem => ({
  id: item.id,
  name: item.name,
  description: item.description,
  price: Number(item.price),
  category: item.category,
  imageUrl: item.image_url || '',
  isPromotion: item.is_promotion || false,
  isPopular: item.is_popular || false,
  variations: variations.map(v => ({
    id: v.id,
    name: v.name,
    price: Number(v.price)
  }))
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

// Function to prepare variation for Supabase
export const prepareSupabaseVariation = (
  variation: MenuItemVariation, 
  menuItemId: string
) => ({
  menu_item_id: menuItemId,
  name: variation.name,
  price: variation.price
});
