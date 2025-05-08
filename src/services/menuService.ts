
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, convertSupabaseMenuItem, prepareSupabaseMenuItem } from "@/types/menu";

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
  // Fetch all menu items
  async getMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category');
    
    if (error) {
      console.error("Error fetching menu items:", error);
      throw new Error(error.message);
    }
    
    return data.map(convertSupabaseMenuItem);
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
    
    return data.map(convertSupabaseMenuItem);
  }
  
  // Update menu item
  async updateMenuItem(item: MenuItem): Promise<MenuItem> {
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
    
    return convertSupabaseMenuItem(data);
  }
  
  // Add new menu item
  async addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(prepareSupabaseMenuItem(item as MenuItem))
      .select()
      .single();
    
    if (error) {
      console.error("Error adding menu item:", error);
      throw new Error(error.message);
    }
    
    return convertSupabaseMenuItem(data);
  }
  
  // Delete menu item
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
  
  // Get all categories
  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('category');
    
    if (error) {
      console.error("Error fetching categories:", error);
      throw new Error(error.message);
    }
    
    // Extract unique categories
    return [...new Set(data.map(item => item.category))].sort();
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
