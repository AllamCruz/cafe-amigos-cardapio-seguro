
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MenuItem } from "@/types/menu";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";

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
      setEditedItem({ ...item });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedItem) {
      onSave(editedItem);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-rustic-cream border border-rustic-lightBrown">
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
              <Label htmlFor="price" className="text-rustic-charcoal">Preço (R$)</Label>
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
