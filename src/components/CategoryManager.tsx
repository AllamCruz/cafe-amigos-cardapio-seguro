
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { menuService } from "@/services/menuService";
import { AddCategoryForm } from "./category-manager/AddCategoryForm";
import { CategoryList } from "./category-manager/CategoryList";
import { DeleteCategoryDialog } from "./category-manager/DeleteCategoryDialog";

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onCategoriesUpdate: () => void;
}

export function CategoryManager({ 
  isOpen, 
  onClose, 
  categories: initialCategories, 
  onCategoriesUpdate 
}: CategoryManagerProps) {
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{index: number, name: string} | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Load categories when component mounts or when the dialog is opened
  useEffect(() => {
    if (isOpen) {
      setCategoryList(initialCategories);
    }
  }, [isOpen, initialCategories]);

  const handleAddCategory = (newCategoryName: string) => {
    if (!newCategoryName.trim()) {
      toast.error("Nome da categoria não pode estar vazio");
      return;
    }
    
    if (categoryList.includes(newCategoryName.trim())) {
      toast.error("Esta categoria já existe");
      return;
    }
    
    setCategoryList([...categoryList, newCategoryName.trim()]);
    toast.success("Categoria adicionada");
  };

  const handleEditCategory = async (index: number, editedCategory: string) => {
    if (!editedCategory.trim()) {
      toast.error("Nome da categoria não pode estar vazio");
      return;
    }
    
    if (categoryList.includes(editedCategory.trim()) && editedCategory.trim() !== categoryList[index]) {
      toast.error("Esta categoria já existe");
      return;
    }
    
    try {
      setLoading(true);
      const oldCategory = categoryList[index];
      const updatedList = [...categoryList];
      updatedList[index] = editedCategory.trim();
      
      // Update category in database
      await menuService.updateCategory(oldCategory, editedCategory.trim());
      
      setCategoryList(updatedList);
      toast.success("Categoria atualizada com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar categoria");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (index: number) => {
    setCategoryToDelete({index, name: categoryList[index]});
    setIsDeleteDialogOpen(true);
  };

  const deleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      setLoading(true);
      const categoryName = categoryList[categoryToDelete.index];
      
      // Check if category has items before deleting
      const itemsInCategory = await menuService.getItemsByCategory(categoryName);
      
      if (itemsInCategory.length > 0) {
        toast.error(`Esta categoria contém ${itemsInCategory.length} itens. Por favor, mova ou delete estes itens primeiro.`);
        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
        return;
      }
      
      const updatedList = categoryList.filter((_, i) => i !== categoryToDelete.index);
      setCategoryList(updatedList);
      
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      toast.success("Categoria removida");
    } catch (error) {
      toast.error("Erro ao remover categoria");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
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
      // In a real implementation, you would save the order of categories to the database
      onCategoriesUpdate();
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar alterações");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] bg-rustic-cream border border-rustic-lightBrown">
          <DialogHeader>
            <DialogTitle className="text-rustic-brown text-center text-2xl">
              Gerenciar Categorias
            </DialogTitle>
            <DialogDescription className="text-center text-rustic-charcoal">
              Adicione, edite ou remova categorias do cardápio
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <AddCategoryForm 
              onAdd={handleAddCategory} 
              existingCategories={categoryList}
              loading={loading}
            />
            
            <CategoryList 
              categories={categoryList}
              loading={loading}
              onEdit={handleEditCategory}
              onMove={moveCategory}
              onDelete={confirmDelete}
            />
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-rustic-brown hover:bg-rustic-terracotta"
                disabled={loading}
              >
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteCategoryDialog
        isOpen={isDeleteDialogOpen}
        categoryName={categoryToDelete?.name}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={deleteCategory}
      />
    </>
  );
}
