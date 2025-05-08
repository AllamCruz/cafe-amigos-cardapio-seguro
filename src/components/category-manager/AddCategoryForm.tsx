
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useCategoryManager } from "./CategoryManagerContext";

export function AddCategoryForm() {
  const [newCategory, setNewCategory] = useState("");
  const { handleAddCategory, loading, categoryList } = useCategoryManager();

  const onAddCategory = () => {
    if (newCategory.trim() && !categoryList.includes(newCategory.trim())) {
      handleAddCategory(newCategory.trim());
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
        onClick={onAddCategory}
        className="bg-rustic-brown hover:bg-rustic-terracotta"
        disabled={loading}
      >
        <Plus size={16} className="mr-2" /> Adicionar
      </Button>
    </div>
  );
}
