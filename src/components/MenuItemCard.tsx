
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types/menu";
import { Edit } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
  isAdmin: boolean;
  onEdit: () => void;
}

export default function MenuItemCard({ item, isAdmin, onEdit }: MenuItemCardProps) {
  const { name, description, price, imageUrl } = item;

  return (
    <div className="rustic-card group relative transition-transform hover:scale-[1.01]">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageUrl || '/placeholder.svg'}
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {isAdmin && (
          <Button 
            variant="outline" 
            size="icon"
            className="absolute right-2 top-2 bg-white bg-opacity-75 hover:bg-opacity-100"
            onClick={onEdit}
          >
            <Edit size={16} />
          </Button>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-rustic-charcoal">{name}</h3>
          <span className="font-semibold text-rustic-terracotta">
            R$ {price.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </div>
    </div>
  );
}
