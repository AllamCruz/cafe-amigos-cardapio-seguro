
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddCategoryForm } from "./category-manager/AddCategoryForm";
import { CategoryList } from "./category-manager/CategoryList";
import { DeleteCategoryDialog } from "./category-manager/DeleteCategoryDialog";
import { CategoryManagerProvider, useCategoryManager } from "./category-manager/CategoryManagerContext";

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onCategoriesUpdate: () => void;
}

function CategoryManagerContent() {
  const { 
    categoryList, 
    loading, 
    handleEditCategory, 
    handleDeleteCategory, 
    handleMoveCategory, 
    handleSave,
    categoryToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen
  } = useCategoryManager();

  return (
    <>
      <div className="space-y-4 py-4">
        <AddCategoryForm />
        
        <CategoryList 
          categories={categoryList}
          loading={loading}
          onEdit={handleEditCategory}
          onMove={handleMoveCategory}
          onDelete={handleDeleteCategory}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            onClick={handleSave}
            className="bg-rustic-brown hover:bg-rustic-terracotta"
            disabled={loading}
          >
            Salvar Alterações
          </Button>
        </div>
      </div>

      <DeleteCategoryDialog
        isOpen={isDeleteDialogOpen}
        categoryName={categoryToDelete?.name}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}

export function CategoryManager({ isOpen, onClose, categories, onCategoriesUpdate }: CategoryManagerProps) {
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
        
        <CategoryManagerProvider 
          initialCategories={categories} 
          onClose={onClose} 
          onCategoriesUpdate={onCategoriesUpdate}
        >
          <CategoryManagerContent />
        </CategoryManagerProvider>
      </DialogContent>
    </Dialog>
  );
}
