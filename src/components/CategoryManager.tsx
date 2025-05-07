
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { menuService } from "@/services/menuService";

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onCategoriesUpdate: () => void;
}

export function CategoryManager({ isOpen, onClose, categories, onCategoriesUpdate }: CategoryManagerProps) {
  const [categoryList, setCategoryList] = useState<string[]>(categories);
  const [newCategory, setNewCategory] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedCategory, setEditedCategory] = useState("");

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
    }
  };

  const deleteCategory = async (index: number) => {
    // This is a simplified version - in a real app you would need to handle
    // what happens to menu items in this category
    try {
      const categoryToRemove = categoryList[index];
      
      // In a real implementation, you would either:
      // 1. Move items to another category
      // 2. Delete items in this category
      // 3. Prevent deletion if items exist
      // For now, we'll just remove it from our local list
      
      const updatedList = categoryList.filter((_, i) => i !== index);
      setCategoryList(updatedList);
      toast.success("Categoria removida");
    } catch (error) {
      toast.error("Erro ao remover categoria");
      console.error(error);
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

  const handleSave = () => {
    // In a real implementation, you would save the updated category order to the database
    // For now, we'll just close the dialog and refresh the categories
    onCategoriesUpdate();
    onClose();
  };

  return (
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
                      >
                        Salvar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={cancelEditing}
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
                          disabled={index === 0}
                        >
                          <ChevronUp size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveCategory(index, 'down')}
                          disabled={index === categoryList.length - 1}
                        >
                          <ChevronDown size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(index)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteCategory(index)}
                          className="text-destructive hover:bg-destructive/10"
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
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-rustic-brown hover:bg-rustic-terracotta"
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
