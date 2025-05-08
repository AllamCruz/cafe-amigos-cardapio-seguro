
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
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = () => {
    setIsEditing(true);
    setEditedValue(category);
    setTimeout(() => {
      document.getElementById(`category-edit-${index}`)?.focus();
    }, 50);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedValue(category);
  };

  const handleSave = async () => {
    if (!editedValue.trim()) return;
    
    try {
      setIsSaving(true);
      await onEditSave(index, editedValue);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center justify-between p-3 bg-white">
        <div className="flex-1 flex gap-2">
          <Input
            id={`category-edit-${index}`}
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-rustic-lightBrown"
            autoFocus
          />
          <div className="flex gap-1">
            <Button
              onClick={handleSave}
              className="bg-rustic-brown hover:bg-rustic-terracotta"
              disabled={loading || isSaving || !editedValue.trim()}
            >
              Salvar
            </Button>
            <Button
              variant="outline"
              onClick={cancelEditing}
              disabled={loading || isSaving}
            >
              Cancelar
            </Button>
          </div>
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
          title="Mover para cima"
        >
          <ChevronUp size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMoveCategory(index, 'down')}
          disabled={index === totalItems - 1 || loading}
          title="Mover para baixo"
        >
          <ChevronDown size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={startEditing}
          disabled={loading}
          title="Editar categoria"
        >
          <Edit size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteRequest(index)}
          className="text-destructive hover:bg-destructive/10"
          disabled={loading}
          title="Remover categoria"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
