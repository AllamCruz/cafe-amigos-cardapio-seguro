
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItem } from "@/types/menu";
import MenuItemCard from "./MenuItemCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

interface CategoryTabsProps {
  items: MenuItem[];
  isAdmin: boolean;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem?: (id: string) => void;
}

export default function CategoryTabs({ items, isAdmin, onEditItem, onDeleteItem }: CategoryTabsProps) {
  // Get unique categories from items, preserving the order they appear in the data
  const getOrderedCategories = (): string[] => {
    const categoriesMap = new Map<string, boolean>();
    items.forEach(item => {
      if (!categoriesMap.has(item.category)) {
        categoriesMap.set(item.category, true);
      }
    });
    return Array.from(categoriesMap.keys());
  };
  
  const categories = getOrderedCategories();
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || "");

  // Reset active category when categories change
  useEffect(() => {
    if (categories.length > 0) {
      // If current active category is no longer in the list, reset to the first one
      if (!categories.includes(activeCategory)) {
        setActiveCategory(categories[0]);
      }
    }
  }, [categories, activeCategory]);

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-rustic-charcoal">
        Nenhuma categoria encontrada. {isAdmin && "Adicione itens ao cardápio para começar."}
      </div>
    );
  }

  console.log("CategoryTabs rendering with categories:", categories);

  return (
    <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
      <ScrollArea className="w-full">
        <div className={isMobile ? "pb-2 w-max min-w-full" : "w-full"}>
          <TabsList className={`
            bg-rustic-cream border border-rustic-lightBrown h-12
            ${isMobile ? "flex-nowrap w-max min-w-full" : "w-full"}
          `}>
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className={`
                  data-[state=active]:bg-rustic-brown 
                  data-[state=active]:text-rustic-cream
                  whitespace-nowrap px-4
                  ${isMobile ? "flex-shrink-0" : ""}
                `}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      {categories.map((category) => {
        const categoryItems = items.filter(item => item.category === category);
        
        return (
          <TabsContent key={category} value={category} className="mt-6">
            {categoryItems.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Nenhum item nesta categoria
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map(item => (
                  <MenuItemCard 
                    key={item.id} 
                    item={item} 
                    isAdmin={isAdmin}
                    onEdit={() => onEditItem(item)}
                    onDelete={onDeleteItem ? () => onDeleteItem(item.id) : undefined}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
