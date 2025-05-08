
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface CategoryListItemProps {
  category: string;
  index: number;
  totalItems: number;
  loading: boolean;
  onEditSave: (index: number, newValue: string) => Promise<void>;
  onMoveCategory: (index: number, direction: 'up' | 'down') => void;
  onDeleteRequest: (index: number) => void;
}

export function CategoryListItem({
  category,
  index,
  totalItems,
  loading,
  onEditSave,
  onMoveCategory,
  onDeleteRequest,
}: CategoryListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(category);

  const startEditing = () => {
    setIsEditing(true);
    setEditedValue(category);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedValue(category);
  };

  const handleSave = async () => {
    await onEditSave(index, editedValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center justify-between p-3 bg-white">
        <div className="flex-1 flex gap-2">
          <Input
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className="border-rustic-lightBrown"
          />
          <Button
            onClick={handleSave}
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
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-white">
      <span className="flex-1">{category}</span>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMoveCategory(index, 'up')}
          disabled={index === 0 || loading}
        >
          <ChevronUp size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMoveCategory(index, 'down')}
          disabled={index === totalItems - 1 || loading}
        >
          <ChevronDown size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={startEditing}
          disabled={loading}
        >
          <Edit size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteRequest(index)}
          className="text-destructive hover:bg-destructive/10"
          disabled={loading}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
