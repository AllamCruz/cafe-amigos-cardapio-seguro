
import { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '@/types/menu';
import { menuService } from '@/services/menuService';
import { toast } from 'sonner';

export function useMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      const items = await menuService.getMenuItems();
      setMenuItems(items);
      
      // Extract unique categories
      setCategories([...new Set(items.map(item => item.category))]);
    } catch (error) {
      toast.error("Erro ao carregar o cardápio");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handleEditItem = async (updatedItem: MenuItem) => {
    try {
      await menuService.updateMenuItem(updatedItem);
      setMenuItems(prev => 
        prev.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      toast.success("Item atualizado com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao atualizar o item");
      console.error(error);
      return false;
    }
  };
  
  const handleAddItem = async (newItem: Omit<MenuItem, 'id'>) => {
    try {
      const addedItem = await menuService.addMenuItem(newItem);
      setMenuItems(prev => [...prev, addedItem]);
      toast.success("Item adicionado com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao adicionar o item");
      console.error(error);
      return false;
    }
  };
  
  const handleDeleteItem = async (id: string) => {
    try {
      await menuService.deleteMenuItem(id);
      setMenuItems(prev => prev.filter(item => item.id !== id));
      toast.success("Item removido com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao remover o item");
      console.error(error);
      return false;
    }
  };

  return {
    menuItems,
    loading,
    categories,
    refreshMenu: fetchMenuItems,
    handleEditItem,
    handleAddItem,
    handleDeleteItem
  };
}
