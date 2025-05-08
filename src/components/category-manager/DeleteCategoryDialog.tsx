
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
  const { confirmDeleteCategory, loading } = useCategoryManager();

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
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmDeleteCategory} 
            className="bg-destructive text-destructive-foreground"
            disabled={loading}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
