
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Upload, Plus, Trash2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { MenuItem, MenuItemVariation } from "@/types/menu";
import { supabase } from "@/integrations/supabase/client";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<MenuItem, 'id'>) => void;
  categories: string[];
}

export function AddItemModal({ isOpen, onClose, onSave, categories }: AddItemModalProps) {
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    variations: []
  });
  
  const [uploadType, setUploadType] = useState<'url' | 'file'>('url');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Reset form state when the modal opens or categories change
  useEffect(() => {
    if (isOpen) {
      setNewItem({
        name: '',
        description: '',
        price: 0,
        category: categories[0] || '',
        imageUrl: '',
        variations: []
      });
      setFile(null);
      setUploadType('url');
    }
  }, [isOpen, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ 
      ...prev, 
      [name]: name === "price" ? parseFloat(value) || 0 : value 
    }));
  };

  const handleCategoryChange = (value: string) => {
    setNewItem(prev => ({ ...prev, category: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAddVariation = () => {
    setNewItem(prev => ({
      ...prev,
      variations: [
        ...(prev.variations || []),
        { name: "", price: 0 }
      ]
    }));
  };

  const handleVariationChange = (index: number, field: keyof MenuItemVariation, value: string | number) => {
    setNewItem(prev => {
      if (!prev.variations) return prev;
      
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
    setNewItem(prev => {
      if (!prev.variations) return prev;
      
      const updatedVariations = [...prev.variations];
      updatedVariations.splice(index, 1);
      
      return {
        ...prev,
        variations: updatedVariations
      };
    });
  };

  const handleImageUpload = async (): Promise<string | null> => {
    if (!file) return null;
    
    try {
      setIsUploading(true);
      
      // Generate a unique file name to prevent overwriting
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `menu_images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('menu_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded file
      const { data } = supabase.storage.from('menu_images').getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao fazer upload da imagem');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    if (!newItem.name || !newItem.description || newItem.price < 0 || !newItem.category) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    // Validate variations if any
    if (newItem.variations && newItem.variations.length > 0) {
      const invalidVariations = newItem.variations.filter(
        v => !v.name || v.price < 0
      );
      
      if (invalidVariations.length > 0) {
        toast.error("Todas as variações precisam ter nome e preço válido");
        return;
      }
    }
    
    let finalImageUrl = newItem.imageUrl;
    
    // If using file upload, process the upload
    if (uploadType === 'file' && file) {
      const uploadedUrl = await handleImageUpload();
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      }
    }
    
    // Submit the new item with the image URL
    onSave({
      ...newItem,
      imageUrl: finalImageUrl
    });
  };

  const hasVariations = newItem.variations && newItem.variations.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-rustic-cream border border-rustic-lightBrown max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-rustic-brown text-center text-2xl">
            Adicionar Novo Item ao Cardápio
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-rustic-charcoal">Nome*</Label>
            <Input
              id="name"
              name="name"
              value={newItem.name}
              onChange={handleChange}
              className="border-rustic-lightBrown"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-rustic-charcoal">Descrição*</Label>
            <Textarea
              id="description"
              name="description"
              value={newItem.description}
              onChange={handleChange}
              className="border-rustic-lightBrown min-h-[80px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-rustic-charcoal flex items-center">
                Preço Base (R$)*
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
                min="0.01"
                value={newItem.price || ''}
                onChange={handleChange}
                className="border-rustic-lightBrown"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-rustic-charcoal">Categoria*</Label>
              <Select
                value={newItem.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="border-rustic-lightBrown">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="nenhuma" disabled>
                      Nenhuma categoria disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
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
            
            {newItem.variations && newItem.variations.length > 0 ? (
              <div className="space-y-3">
                {newItem.variations.map((variation, index) => (
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
          
          <div className="space-y-2">
            <Label className="text-rustic-charcoal">Imagem</Label>
            <div className="flex space-x-4">
              <Button
                type="button"
                onClick={() => setUploadType('url')}
                variant={uploadType === 'url' ? 'default' : 'outline'}
                className={uploadType === 'url' ? 'bg-rustic-brown text-rustic-cream' : ''}
              >
                URL da Imagem
              </Button>
              <Button
                type="button"
                onClick={() => setUploadType('file')}
                variant={uploadType === 'file' ? 'default' : 'outline'}
                className={uploadType === 'file' ? 'bg-rustic-brown text-rustic-cream' : ''}
              >
                Upload de Arquivo
              </Button>
            </div>
            
            {uploadType === 'url' ? (
              <div className="pt-2">
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={newItem.imageUrl}
                  onChange={handleChange}
                  className="border-rustic-lightBrown"
                />
              </div>
            ) : (
              <div className="pt-2">
                <Label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-rustic-lightBrown rounded-md cursor-pointer bg-rustic-cream bg-opacity-50 hover:bg-opacity-30"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-rustic-brown" />
                    <p className="text-sm text-rustic-charcoal">
                      {file ? file.name : 'Clique para fazer upload da imagem'}
                    </p>
                  </div>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Label>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-rustic-brown hover:bg-rustic-terracotta"
              disabled={isUploading}
            >
              {isUploading ? 'Enviando...' : 'Adicionar Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
