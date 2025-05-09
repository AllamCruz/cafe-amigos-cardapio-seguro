
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MenuItem, MenuItemVariation } from "@/types/menu";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface EditItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
}

export function EditItemModal({ item, isOpen, onClose, onSave }: EditItemModalProps) {
  const [editedItem, setEditedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (item) {
      // Make sure we have a variations array, even if empty
      setEditedItem({ 
        ...item,
        variations: item.variations || []
      });
    }
  }, [item]);

  if (!editedItem) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedItem(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        [name]: name === "price" ? parseFloat(value) || 0 : value 
      };
    });
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setEditedItem(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        [name]: checked
      };
    });
  };

  const handleAddVariation = () => {
    setEditedItem(prev => {
      if (!prev) return null;
      return {
        ...prev,
        variations: [
          ...(prev.variations || []),
          { name: "", price: 0 }
        ]
      };
    });
  };

  const handleVariationChange = (index: number, field: keyof MenuItemVariation, value: string | number) => {
    setEditedItem(prev => {
      if (!prev || !prev.variations) return prev;
      
      const updatedVariations = [...prev.variations];
      
      if (field === 'price') {
        updatedVariations[index] = {
          ...updatedVariations[index],
          price: typeof value === 'number' ? value : parseFloat(value) || 0
        };
      } else {
        updatedVariations[index] = {
          ...updatedVariations[index],
          [field]: value
        };
      }
      
      return {
        ...prev,
        variations: updatedVariations
      };
    });
  };

  const handleRemoveVariation = (index: number) => {
    setEditedItem(prev => {
      if (!prev || !prev.variations) return prev;
      
      const updatedVariations = [...prev.variations];
      updatedVariations.splice(index, 1);
      
      return {
        ...prev,
        variations: updatedVariations
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editedItem) {
      // Validate variations if any
      const invalidVariations = (editedItem.variations || []).filter(
        v => !v.name || v.price < 0
      );
      
      if (invalidVariations.length > 0) {
        toast.error("Todas as variações precisam ter nome e preço válido");
        return;
      }
      
      onSave(editedItem);
    }
  };

  const hasVariations = editedItem.variations && editedItem.variations.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-rustic-cream border border-rustic-lightBrown max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-rustic-brown text-center text-2xl">
            Editar Item do Cardápio
          </DialogTitle>
          <DialogDescription className="text-center text-rustic-charcoal">
            Modifique os detalhes do item conforme necessário
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-rustic-charcoal">Nome</Label>
            <Input
              id="name"
              name="name"
              value={editedItem.name}
              onChange={handleChange}
              className="border-rustic-lightBrown"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-rustic-charcoal">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={editedItem.description}
              onChange={handleChange}
              className="border-rustic-lightBrown min-h-[80px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-rustic-charcoal flex items-center">
                Preço Base (R$)
                {hasVariations && (
                  <span className="text-xs ml-2 text-muted-foreground">
                    (Aparece quando não há variações selecionadas)
                  </span>
                )}
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={editedItem.price}
                onChange={handleChange}
                className="border-rustic-lightBrown"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-rustic-charcoal">Categoria</Label>
              <Input
                id="category"
                name="category"
                value={editedItem.category}
                onChange={handleChange}
                className="border-rustic-lightBrown"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-rustic-charcoal">URL da Imagem</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={editedItem.imageUrl}
              onChange={handleChange}
              className="border-rustic-lightBrown"
            />
          </div>
          
          {/* Variations Section */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-rustic-brown font-medium">Variações (Tamanhos/Opções)</Label>
              <Button 
                type="button" 
                onClick={handleAddVariation}
                variant="outline" 
                className="text-rustic-brown border-rustic-lightBrown"
              >
                <Plus size={16} className="mr-1" /> Adicionar Variação
              </Button>
            </div>
            
            {editedItem.variations && editedItem.variations.length > 0 ? (
              <div className="space-y-3">
                {editedItem.variations.map((variation, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-md border-rustic-lightBrown bg-rustic-cream/50">
                    <div className="flex-1">
                      <Input 
                        placeholder="Nome da variação (ex: Pequena)"
                        value={variation.name}
                        onChange={(e) => handleVariationChange(index, 'name', e.target.value)}
                        className="border-rustic-lightBrown mb-2"
                        required
                      />
                    </div>
                    
                    <div className="w-[120px]">
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Preço"
                          value={variation.price}
                          onChange={(e) => handleVariationChange(index, 'price', e.target.value)}
                          className="border-rustic-lightBrown pl-7"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-rustic-terracotta hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleRemoveVariation(index)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 border border-dashed rounded-md border-rustic-lightBrown text-muted-foreground">
                Nenhuma variação adicionada. O item terá apenas o preço base.
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between space-x-2 border p-3 rounded-md border-rustic-lightBrown">
              <Label htmlFor="isPromotion" className="text-rustic-charcoal cursor-pointer">
                Item em Promoção
              </Label>
              <Switch
                id="isPromotion"
                checked={editedItem.isPromotion || false}
                onCheckedChange={handleSwitchChange('isPromotion')}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2 border p-3 rounded-md border-rustic-lightBrown">
              <Label htmlFor="isPopular" className="text-rustic-charcoal cursor-pointer">
                Item Mais Pedido
              </Label>
              <Switch
                id="isPopular"
                checked={editedItem.isPopular || false}
                onCheckedChange={handleSwitchChange('isPopular')}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-rustic-brown hover:bg-rustic-terracotta"
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
