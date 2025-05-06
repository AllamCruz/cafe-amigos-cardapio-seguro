
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItem } from "@/types/menu";
import MenuItemCard from "./MenuItemCard";

interface CategoryTabsProps {
  items: MenuItem[];
  isAdmin: boolean;
  onEditItem: (item: MenuItem) => void;
}

export default function CategoryTabs({ items, isAdmin, onEditItem }: CategoryTabsProps) {
  // Get unique categories
  const categories = [...new Set(items.map(item => item.category))];

  return (
    <Tabs defaultValue={categories[0]} className="w-full">
      <div className="overflow-x-auto pb-2">
        <TabsList className="bg-rustic-cream border border-rustic-lightBrown">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="data-[state=active]:bg-rustic-brown data-[state=active]:text-rustic-cream"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
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
                />
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
