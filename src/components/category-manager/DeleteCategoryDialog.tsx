
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCategoryManager } from "./CategoryManagerContext";

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  categoryName: string | undefined;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCategoryDialog({
  isOpen,
  categoryName,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  const { categoryToDelete, setIsDeleteDialogOpen } = useCategoryManager();

  const handleConfirm = async () => {
    try {
      // The actual delete logic is now in the context
      await Promise.resolve(); // This is just to make it async for consistency
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error during category deletion:", error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a categoria "{categoryName}"?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            className="bg-destructive text-destructive-foreground"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
