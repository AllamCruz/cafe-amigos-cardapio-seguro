
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import CategoryTabs from "@/components/CategoryTabs";
import { EditItemModal } from "@/components/EditItemModal";
import { AddItemModal } from "@/components/AddItemModal";
import { CategoryManager } from "@/components/CategoryManager";
import { MenuItem } from "@/types/menu";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle, LayoutList } from "lucide-react";
import { useMenu } from "@/hooks/use-menu";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  
  const { 
    menuItems, 
    loading, 
    categories, 
    refreshMenu, 
    handleEditItem, 
    handleAddItem, 
    handleDeleteItem 
  } = useMenu();
  
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
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const handleEditItemClick = (item: MenuItem) => {
    setEditingItem(item);
  };
  
  const handleSaveItem = async (updatedItem: MenuItem) => {
    const success = await handleEditItem(updatedItem);
    if (success) {
      setEditingItem(null);
    }
  };
  
  const handleAddItemSave = async (newItem: Omit<MenuItem, 'id'>) => {
    const success = await handleAddItem(newItem);
    if (success) {
      setIsAddModalOpen(false);
    }
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
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="text-sm text-rustic-charcoal mb-3 sm:mb-0">
                  <span className="font-bold">Modo Administrador:</span>{" "}
                  Clique no ícone de edição nos itens para modificar o cardápio.
                </p>
                <div className="flex gap-2 flex-wrap justify-center">
                  <Button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-rustic-brown hover:bg-rustic-terracotta text-white"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Novo Item
                  </Button>
                  <Button 
                    onClick={() => setIsCategoryManagerOpen(true)}
                    variant="outline"
                    className="border-rustic-brown text-rustic-brown hover:bg-rustic-brown hover:text-white"
                  >
                    <LayoutList className="mr-2 h-4 w-4" />
                    Gerenciar Categorias
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-8">Carregando cardápio...</div>
          ) : (
            <CategoryTabs 
              items={menuItems} 
              isAdmin={isAdmin} 
              onEditItem={handleEditItemClick}
              onDeleteItem={isAdmin ? handleDeleteItem : undefined} 
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
        onSave={handleAddItemSave}
        categories={categories}
      />
      
      <CategoryManager 
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        onCategoriesUpdate={refreshMenu}
      />
    </div>
  );
};

export default Index;
