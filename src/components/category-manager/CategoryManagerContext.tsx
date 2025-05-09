
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { menuService } from "@/services/menuService";

type CategoryManagerContextType = {
  categoryList: string[];
  loading: boolean;
  handleAddCategory: (newCategoryName: string) => void;
  handleEditCategory: (index: number, editedCategory: string) => Promise<void>;
  handleDeleteCategory: (index: number) => void;
  confirmDeleteCategory: () => Promise<void>;
  handleMoveCategory: (index: number, direction: 'up' | 'down') => void;
  handleSave: () => Promise<void>;
  categoryToDelete: {index: number, name: string} | null;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  isDeleteDialogOpen: boolean;
};

const CategoryManagerContext = createContext<CategoryManagerContextType | undefined>(undefined);

export function CategoryManagerProvider({ 
  children,
  initialCategories,
  onClose,
  onCategoriesUpdate
}: { 
  children: ReactNode;
  initialCategories: string[];
  onClose: () => void;
  onCategoriesUpdate: () => void;
}) {
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [originalCategories, setOriginalCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{index: number, name: string} | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Load categories when component mounts
  useEffect(() => {
    setOriginalCategories([...initialCategories]);
    setCategoryList([...initialCategories]);
  }, [initialCategories]);

  const handleAddCategory = (newCategoryName: string) => {
    if (!newCategoryName.trim()) {
      toast.error("Nome da categoria não pode estar vazio");
      return;
    }
    
    if (categoryList.includes(newCategoryName.trim())) {
      toast.error("Esta categoria já existe");
      return;
    }
    
    setCategoryList(prev => [...prev, newCategoryName.trim()]);
    toast.success("Categoria adicionada localmente. Clique em 'Salvar Alterações' para confirmar.");
  };

  const handleEditCategory = async (index: number, editedCategory: string) => {
    if (!editedCategory.trim()) {
      toast.error("Nome da categoria não pode estar vazio");
      return Promise.reject("Nome vazio");
    }
    
    if (categoryList.includes(editedCategory.trim()) && editedCategory.trim() !== categoryList[index]) {
      toast.error("Esta categoria já existe");
      return Promise.reject("Categoria duplicada");
    }
    
    const updatedList = [...categoryList];
    updatedList[index] = editedCategory.trim();
    setCategoryList(updatedList);
    toast.success("Categoria atualizada localmente. Clique em 'Salvar Alterações' para confirmar.");
    return Promise.resolve();
  };

  const handleDeleteCategory = (index: number) => {
    setCategoryToDelete({index, name: categoryList[index]});
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return Promise.reject("Nenhuma categoria selecionada");
    
    try {
      setLoading(true);
      const categoryName = categoryList[categoryToDelete.index];
      
      // Check if category has items before deleting
      const itemsInCategory = await menuService.getItemsByCategory(categoryName);
      
      if (itemsInCategory.length > 0) {
        toast.error(`Esta categoria contém ${itemsInCategory.length} itens. Por favor, mova ou delete estes itens primeiro.`);
        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
        return Promise.reject("Categoria contém itens");
      }
      
      const updatedList = categoryList.filter((_, i) => i !== categoryToDelete.index);
      setCategoryList(updatedList);
      
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      toast.success("Categoria removida localmente. Clique em 'Salvar Alterações' para confirmar.");
      return Promise.resolve();
    } catch (error) {
      toast.error("Erro ao remover categoria");
      console.error(error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === categoryList.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedList = [...categoryList];
    [updatedList[index], updatedList[newIndex]] = [updatedList[newIndex], updatedList[index]];
    
    setCategoryList(updatedList);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Find categories to add and remove by comparing to original list
      const categoriesToAdd = categoryList.filter(cat => !originalCategories.includes(cat));
      const categoriesToRemove = originalCategories.filter(cat => !categoryList.includes(cat));
      
      console.log("Saving categories:", { categoryList, originalCategories, categoriesToAdd, categoriesToRemove });
      
      // Add new categories
      for (const category of categoriesToAdd) {
        await menuService.createCategory(category);
      }
      
      // Remove deleted categories
      for (const category of categoriesToRemove) {
        await menuService.deleteCategory(category);
      }
      
      // Update the order of categories
      if (JSON.stringify(categoryList) !== JSON.stringify(originalCategories)) {
        await menuService.updateCategoryOrder(categoryList);
      }
      
      // Update the application state
      toast.success("Categorias salvas com sucesso");
      onCategoriesUpdate();
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar alterações");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    categoryList,
    loading,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    confirmDeleteCategory,
    handleMoveCategory,
    handleSave,
    categoryToDelete,
    setIsDeleteDialogOpen,
    isDeleteDialogOpen
  };

  return (
    <CategoryManagerContext.Provider value={value}>
      {children}
    </CategoryManagerContext.Provider>
  );
}

export function useCategoryManager() {
  const context = useContext(CategoryManagerContext);
  if (context === undefined) {
    throw new Error("useCategoryManager must be used within a CategoryManagerProvider");
  }
  return context;
}
