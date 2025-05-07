
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItem } from "@/types/menu";
import MenuItemCard from "./MenuItemCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface CategoryTabsProps {
  items: MenuItem[];
  isAdmin: boolean;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem?: (id: string) => void;
}

export default function CategoryTabs({ items, isAdmin, onEditItem, onDeleteItem }: CategoryTabsProps) {
  // Get unique categories
  const categories = [...new Set(items.map(item => item.category))];
  const isMobile = useIsMobile();

  return (
    <Tabs defaultValue={categories[0]} className="w-full">
      <ScrollArea className="w-full border-b border-rustic-lightBrown pb-1">
        <div className={`${isMobile ? "pb-2 w-max min-w-full" : "w-full"}`}>
          <TabsList className="bg-rustic-cream border border-rustic-lightBrown h-12 w-full flex flex-nowrap">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-rustic-brown data-[state=active]:text-rustic-cream flex-1 whitespace-nowrap px-4"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </ScrollArea>
      
      {categories.map((category) => (
        <TabsContent key={category} value={category} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items
              .filter(item => item.category === category)
              .map(item => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  isAdmin={isAdmin}
                  onEdit={() => onEditItem(item)}
                  onDelete={onDeleteItem ? () => onDeleteItem(item.id) : undefined}
                />
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
