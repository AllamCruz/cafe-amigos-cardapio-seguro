
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useCategoryManager } from "./CategoryManagerContext";

export function AddCategoryForm() {
  const [newCategory, setNewCategory] = useState("");
  const { handleAddCategory, loading } = useCategoryManager();

  const onAddCategory = () => {
    if (newCategory.trim()) {
      handleAddCategory(newCategory);
      setNewCategory("");
    } else {
      // Add visual feedback for empty input
      const input = document.getElementById("new-category-input");
      input?.focus();
      input?.classList.add("border-red-500");
      setTimeout(() => {
        input?.classList.remove("border-red-500");
      }, 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddCategory();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        id="new-category-input"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nova categoria"
        className="border-rustic-lightBrown"
        disabled={loading}
      />
      <Button
        onClick={onAddCategory}
        className="bg-rustic-brown hover:bg-rustic-terracotta whitespace-nowrap"
        disabled={loading}
      >
        <Plus size={16} className="mr-2" /> Adicionar
      </Button>
    </div>
  );
}
