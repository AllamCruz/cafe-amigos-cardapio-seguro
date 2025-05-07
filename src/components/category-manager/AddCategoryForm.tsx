
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddCategoryFormProps {
  onAdd: (category: string) => void;
  existingCategories: string[];
  loading: boolean;
}

export function AddCategoryForm({ onAdd, existingCategories, loading }: AddCategoryFormProps) {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() && !existingCategories.includes(newCategory.trim())) {
      onAdd(newCategory.trim());
      setNewCategory("");
    }
  };

  return (
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
  );
}
