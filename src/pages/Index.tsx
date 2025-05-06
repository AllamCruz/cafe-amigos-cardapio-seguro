
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import CategoryTabs from "@/components/CategoryTabs";
import { EditItemModal } from "@/components/EditItemModal";
import { AddItemModal } from "@/components/AddItemModal";
import { MenuItem } from "@/types/menu";
import { toast } from "sonner";
import { menuService } from "@/services/menuService";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAdmin(!!data.session);
    };
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAdmin(!!session);
      }
    );
    
    checkSession();
    
    // Load menu items
    fetchMenuItems();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const items = await menuService.getMenuItems();
      setMenuItems(items);
    } catch (error) {
      toast.error("Erro ao carregar o cardápio");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
  };
  
  const handleSaveItem = async (updatedItem: MenuItem) => {
    try {
      await menuService.updateMenuItem(updatedItem);
      setMenuItems(prev => 
        prev.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      toast.success("Item atualizado com sucesso!");
      setEditingItem(null);
    } catch (error) {
      toast.error("Erro ao atualizar o item");
      console.error(error);
    }
  };
  
  const handleAddItem = async (newItem: Omit<MenuItem, 'id'>) => {
    try {
      const addedItem = await menuService.addMenuItem(newItem);
      setMenuItems(prev => [...prev, addedItem]);
      toast.success("Item adicionado com sucesso!");
      setIsAddModalOpen(false);
    } catch (error) {
      toast.error("Erro ao adicionar o item");
      console.error(error);
    }
  };
  
  // Get unique categories
  const categories = [...new Set(menuItems.map(item => item.category))];

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
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm text-rustic-charcoal mb-3 sm:mb-0">
                  <span className="font-bold">Modo Administrador:</span>{" "}
                  Clique no ícone de edição nos itens para modificar o cardápio.
                </p>
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-rustic-brown hover:bg-rustic-terracotta text-white"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Novo Item
                </Button>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-8">Carregando cardápio...</div>
          ) : (
            <CategoryTabs 
              items={menuItems} 
              isAdmin={isAdmin} 
              onEditItem={handleEditItem} 
            />
          )}
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
      
      <AddItemModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddItem}
        categories={categories}
      />
    </div>
  );
};

export default Index;
