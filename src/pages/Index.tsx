
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import CategoryTabs from "@/components/CategoryTabs";
import { EditItemModal } from "@/components/EditItemModal";
import { initialMenuItems } from "@/data/menuData";
import { MenuItem } from "@/types/menu";
import { toast } from "sonner";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
  };
  
  const handleSaveItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => 
      prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    toast.success("Item atualizado com sucesso!");
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary bg-[url('/wood-background.png')] bg-repeat">
      <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="rustic-container mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-rustic-brown mb-2 text-center">
            Café & Amigos Bistrô Bar
          </h1>
          <p className="text-rustic-charcoal text-center mb-6">
            Sabores autênticos em um ambiente acolhedor
          </p>
          
          {isAdmin && (
            <div className="bg-rustic-olive bg-opacity-10 border border-rustic-olive rounded-md p-4 mb-6">
              <p className="text-sm text-rustic-charcoal">
                <span className="font-bold">Modo Administrador:</span>{" "}
                Clique no ícone de edição nos itens para modificar o cardápio.
              </p>
            </div>
          )}
          
          <CategoryTabs 
            items={menuItems} 
            isAdmin={isAdmin} 
            onEditItem={handleEditItem} 
          />
        </div>
      </main>
      
      <footer className="bg-rustic-brown text-rustic-cream py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 font-semibold">Café & Amigos Bistrô Bar</p>
          <p className="text-sm opacity-80">© {new Date().getFullYear()} - Todos os direitos reservados</p>
        </div>
      </footer>
      
      <EditItemModal 
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveItem}
      />
    </div>
  );
};

export default Index;
