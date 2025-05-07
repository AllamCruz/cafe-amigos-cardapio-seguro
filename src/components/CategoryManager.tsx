
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { menuService } from "@/services/menuService";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onCategoriesUpdate: () => void;
}

export function CategoryManager({ isOpen, onClose, categories: initialCategories, onCategoriesUpdate }: CategoryManagerProps) {
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedCategory, setEditedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{index: number, name: string} | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Load categories when component mounts or when the dialog is opened
  useEffect(() => {
    if (isOpen) {
      setCategoryList(initialCategories);
    }
  }, [isOpen, initialCategories]);

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Nome da categoria não pode estar vazio");
      return;
    }
    
    if (categoryList.includes(newCategory.trim())) {
      toast.error("Esta categoria já existe");
      return;
    }
    
    setCategoryList([...categoryList, newCategory.trim()]);
    setNewCategory("");
    toast.success("Categoria adicionada");
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditedCategory(categoryList[index]);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditedCategory("");
  };

  const saveEditing = async (index: number) => {
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
      setEditingIndex(null);
      setEditedCategory("");
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
      
      // In a real implementation, you need to decide how to handle items in this category
      // For example, move them to another category or delete them
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
      // For now, we'll just close the dialog and refresh the categories
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
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nova categoria"
                className="border-rustic-lightBrown"
              />
              <Button
                onClick={handleAddCategory}
                className="bg-rustic-brown hover:bg-rustic-terracotta"
                disabled={loading}
              >
                <Plus size={16} className="mr-2" /> Adicionar
              </Button>
            </div>
            
            <div className="border rounded-md border-rustic-lightBrown overflow-hidden">
              <div className="bg-muted py-2 px-4 font-medium">
                Categorias Existentes
              </div>
              <div className="divide-y">
                {categoryList.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white">
                    {editingIndex === index ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={editedCategory}
                          onChange={(e) => setEditedCategory(e.target.value)}
                          className="border-rustic-lightBrown"
                        />
                        <Button
                          onClick={() => saveEditing(index)}
                          className="bg-rustic-brown hover:bg-rustic-terracotta"
                          disabled={loading}
                        >
                          Salvar
                        </Button>
                        <Button
                          variant="outline"
                          onClick={cancelEditing}
                          disabled={loading}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1">{category}</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveCategory(index, 'up')}
                            disabled={index === 0 || loading}
                          >
                            <ChevronUp size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveCategory(index, 'down')}
                            disabled={index === categoryList.length - 1 || loading}
                          >
                            <ChevronDown size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(index)}
                            disabled={loading}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete(index)}
                            className="text-destructive hover:bg-destructive/10"
                            disabled={loading}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {categoryList.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhuma categoria encontrada
                  </div>
                )}
              </div>
            </div>
            
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "{categoryToDelete?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCategory} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
