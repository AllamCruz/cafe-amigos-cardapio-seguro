
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

export const menuService = {
  // Fetch all menu items
  async getMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*');
    
    if (error) {
      console.error("Error fetching menu items:", error);
      throw new Error(error.message);
    }
    
    return data.map(convertSupabaseMenuItem);
  },
  
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
  },
  
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
  },
  
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
};
