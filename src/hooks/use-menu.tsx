
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
      
      // Get categories in the correct order
      const orderedCategories = await menuService.getCategories();
      setCategories(orderedCategories);
    } catch (error) {
      toast.error("Erro ao carregar o cardápio");
      console.error("Error fetching menu items:", error);
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
      console.error("Error updating menu item:", error);
      return false;
    }
  };
  
  const handleAddItem = async (newItem: Omit<MenuItem, 'id'>) => {
    try {
      console.log("Adding new item:", newItem);
      const addedItem = await menuService.addMenuItem(newItem);
      console.log("Added item response:", addedItem);
      setMenuItems(prev => [...prev, addedItem]);
      toast.success("Item adicionado com sucesso!");
      
      // Update categories if new category was added
      if (!categories.includes(newItem.category)) {
        setCategories(prev => [...prev, newItem.category]);
      }
      
      return true;
    } catch (error) {
      toast.error("Erro ao adicionar o item");
      console.error("Error adding menu item:", error);
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
      console.error("Error deleting menu item:", error);
      return false;
    }
  };

  const updateCategoryOrder = async (orderedCategories: string[]) => {
    try {
      console.log("Updating category order to:", orderedCategories);
      await menuService.updateCategoryOrder(orderedCategories);
      setCategories(orderedCategories);
      toast.success("Ordem das categorias atualizada com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao atualizar a ordem das categorias");
      console.error("Error updating category order:", error);
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
    handleDeleteItem,
    updateCategoryOrder
  };
}
