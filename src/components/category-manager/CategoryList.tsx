
import { CategoryListItem } from "./CategoryListItem";

interface CategoryListProps {
  categories: string[];
  loading: boolean;
  onEdit: (index: number, newValue: string) => Promise<void>;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onDelete: (index: number) => void;
}

export function CategoryList({ 
  categories, 
  loading, 
  onEdit, 
  onMove, 
  onDelete 
}: CategoryListProps) {
  return (
    <div className="border rounded-md border-rustic-lightBrown overflow-hidden">
      <div className="bg-muted py-2 px-4 font-medium flex justify-between items-center">
        <span>Categorias Existentes</span>
        <span className="text-sm text-muted-foreground">
          {categories.length} {categories.length === 1 ? 'categoria' : 'categorias'}
        </span>
      </div>
      <div className="divide-y">
        {categories.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Nenhuma categoria encontrada. Adicione uma nova categoria acima.
          </div>
        ) : (
          categories.map((category, index) => (
            <CategoryListItem
              key={`category-${index}-${category}`} // Use o valor da categoria no key para garantir re-renderização
              category={category}
              index={index}
              totalItems={categories.length}
              loading={loading}
              onEditSave={onEdit}
              onMoveCategory={onMove}
              onDeleteRequest={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
