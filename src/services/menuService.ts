import { supabase } from "@/integrations/supabase/client";
import { MenuItem, MenuItemVariation, convertSupabaseMenuItem, prepareSupabaseMenuItem, prepareSupabaseVariation } from "@/types/menu";

// Verificar se o bucket para imagens existe
const createStorageBucketIfNotExists = async () => {
  const { data: buckets } = await supabase.storage.listBuckets();
  
  if (!buckets?.find(bucket => bucket.name === 'menu_images')) {
    await supabase.storage.createBucket('menu_images', {
      public: true,
      fileSizeLimit: 1024 * 1024 * 2 // 2MB
    });
  }
};

// Iniciar a verificação do bucket quando o serviço for carregado
createStorageBucketIfNotExists();

class MenuService {
  // Fetch all menu items with their variations
  async getMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category');
    
    if (error) {
      console.error("Error fetching menu items:", error);
      throw new Error(error.message);
    }
    
    // Fetch variations for all menu items
    const menuItems = await Promise.all(
      data.map(async (item) => {
        const variations = await this.getVariationsForMenuItem(item.id);
        return convertSupabaseMenuItem(item, variations);
      })
    );
    
    return menuItems;
  }

  // Get variations for a specific menu item
  async getVariationsForMenuItem(menuItemId: string) {
    const { data, error } = await supabase
      .from('menu_item_variations')
      .select('*')
      .eq('menu_item_id', menuItemId)
      .order('name');
    
    if (error) {
      console.error(`Error fetching variations for menu item ${menuItemId}:`, error);
      return [];
    }
    
    return data;
  }

  // Get items by category
  async getItemsByCategory(category: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category', category);
    
    if (error) {
      console.error("Error fetching items by category:", error);
      throw new Error(error.message);
    }
    
    // Fetch variations for the items in this category
    const menuItems = await Promise.all(
      data.map(async (item) => {
        const variations = await this.getVariationsForMenuItem(item.id);
        return convertSupabaseMenuItem(item, variations);
      })
    );
    
    return menuItems;
  }
  
  // Update menu item and its variations
  async updateMenuItem(item: MenuItem): Promise<MenuItem> {
    // First update the menu item
    const { data, error } = await supabase
      .from('menu_items')
      .update(prepareSupabaseMenuItem(item))
      .eq('id', item.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating menu item:", error);
      throw new Error(error.message);
    }
    
    // Handle variations - we'll use a transaction-like approach
    if (item.variations && item.variations.length > 0) {
      // First, delete all existing variations
      await this.deleteAllVariationsForMenuItem(item.id);
      
      // Then, add all new/updated variations
      const variations = await Promise.all(
        item.variations.map(variation => this.addVariation(variation, item.id))
      );
      
      return convertSupabaseMenuItem(data, variations);
    }
    
    return convertSupabaseMenuItem(data);
  }
  
  // Add a new variation to a menu item
  async addVariation(variation: MenuItemVariation, menuItemId: string) {
    const preparedVariation = prepareSupabaseVariation(variation, menuItemId);
    
    const { data, error } = await supabase
      .from('menu_item_variations')
      .insert(preparedVariation)
      .select()
      .single();
    
    if (error) {
      console.error("Error adding variation:", error);
      throw new Error(error.message);
    }
    
    return data;
  }
  
  // Delete all variations for a menu item
  async deleteAllVariationsForMenuItem(menuItemId: string) {
    const { error } = await supabase
      .from('menu_item_variations')
      .delete()
      .eq('menu_item_id', menuItemId);
    
    if (error) {
      console.error("Error deleting variations:", error);
      throw new Error(error.message);
    }
  }
  
  // Add new menu item with variations
  async addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const variations = item.variations || [];
    
    // First, add the menu item
    const { data, error } = await supabase
      .from('menu_items')
      .insert(prepareSupabaseMenuItem(item as MenuItem))
      .select()
      .single();
    
    if (error) {
      console.error("Error adding menu item:", error);
      throw new Error(error.message);
    }
    
    // Then, add variations if any
    if (variations.length > 0) {
      await Promise.all(
        variations.map(variation => this.addVariation(variation, data.id))
      );
    }
    
    // Fetch the complete item with variations
    return this.getMenuItemById(data.id);
  }
  
  // Get a single menu item by ID with variations
  async getMenuItemById(id: string): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching menu item:", error);
      throw new Error(error.message);
    }
    
    const variations = await this.getVariationsForMenuItem(id);
    return convertSupabaseMenuItem(data, variations);
  }
  
  // Delete menu item (and its variations via CASCADE)
  async deleteMenuItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting menu item:", error);
      throw new Error(error.message);
    }
  }
  
  // Get all categories with preserved order
  async getCategories(): Promise<string[]> {
    // We need to get all menu items to extract the categories in their current order
    const { data, error } = await supabase
      .from('menu_items')
      .select('category')
      .order('category');
    
    if (error) {
      console.error("Error fetching categories:", error);
      throw new Error(error.message);
    }
    
    // Extract unique categories while preserving order
    const categoriesSet = new Set<string>();
    data.forEach(item => categoriesSet.add(item.category));
    
    return Array.from(categoriesSet);
  }
  
  // Update category order
  async updateCategoryOrder(orderedCategories: string[]): Promise<void> {
    try {
      console.log("Updating category order to:", orderedCategories);
      
      // For each category in the new order, update all items in that category
      // with their new position using a prefix that we'll remove later
      for (let i = 0; i < orderedCategories.length; i++) {
        const categoryName = orderedCategories[i];
        const orderPrefix = `${i.toString().padStart(3, '0')}:`;
        
        console.log(`Updating ${categoryName} to position ${i} with prefix ${orderPrefix}`);
        
        // First update with a temporary prefix to ensure order
        const { error: updateError } = await supabase
          .from('menu_items')
          .update({ category: `${orderPrefix}${categoryName}` })
          .eq('category', categoryName);
        
        if (updateError) {
          console.error(`Error updating category ${categoryName} with prefix:`, updateError);
          throw new Error(updateError.message);
        }
      }
      
      // Now remove the prefixes
      for (let i = 0; i < orderedCategories.length; i++) {
        const categoryName = orderedCategories[i];
        const orderPrefix = `${i.toString().padStart(3, '0')}:`;
        
        const { error: cleanupError } = await supabase
          .from('menu_items')
          .update({ category: categoryName })
          .eq('category', `${orderPrefix}${categoryName}`);
        
        if (cleanupError) {
          console.error(`Error removing prefix for ${categoryName}:`, cleanupError);
          throw new Error(cleanupError.message);
        }
      }
      
      console.log("Category order updated successfully");
      
    } catch (error) {
      console.error("Error updating category order:", error);
      throw error;
    }
  }
  
  // Update category for multiple items
  async updateCategory(oldCategory: string, newCategory: string): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .update({ category: newCategory })
      .eq('category', oldCategory);
    
    if (error) {
      console.error("Error updating category:", error);
      throw new Error(error.message);
    }
  }
  
  // Create a new category (with a placeholder item if needed)
  async createCategory(categoryName: string): Promise<void> {
    // Check if category exists
    const categories = await this.getCategories();
    if (categories.includes(categoryName)) {
      return; // Category already exists
    }
    
    // Create a placeholder item if needed
    const placeholderItem = {
      name: `Novo Item em ${categoryName}`,
      description: 'Descrição do item',
      price: 0,
      category: categoryName,
      imageUrl: ''
    };
    
    await this.addMenuItem(placeholderItem);
  }
  
  // Delete a category by removing all items in that category
  async deleteCategory(categoryName: string): Promise<void> {
    const items = await this.getItemsByCategory(categoryName);
    
    for (const item of items) {
      await this.deleteMenuItem(item.id);
    }
  }
}

export const menuService = new MenuService();
