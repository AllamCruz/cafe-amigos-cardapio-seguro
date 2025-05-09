
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types/menu";
import { Edit, Trash2, Star, TrendingUp, DollarSign } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete?: () => void;
}

export default function MenuItemCard({ item, isAdmin, onEdit, onDelete }: MenuItemCardProps) {
  const { name, description, price, imageUrl, isPromotion, isPopular, variations } = item;
  
  const hasVariations = variations && variations.length > 0;
  
  // Get the minimum and maximum price if there are variations
  const priceDisplay = () => {
    if (!hasVariations) {
      return `R$ ${price.toFixed(2).replace('.', ',')}`;
    }
    
    const prices = variations.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) {
      return `R$ ${minPrice.toFixed(2).replace('.', ',')}`;
    }
    
    return `R$ ${minPrice.toFixed(2).replace('.', ',')} - ${maxPrice.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="rustic-card group relative transition-transform hover:scale-[1.01]">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageUrl || '/placeholder.svg'}
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {isAdmin && (
          <div className="absolute right-2 top-2 flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="bg-white bg-opacity-75 hover:bg-opacity-100"
              onClick={onEdit}
            >
              <Edit size={16} />
            </Button>
            {onDelete && (
              <Button 
                variant="outline" 
                size="icon"
                className="bg-white bg-opacity-75 hover:bg-opacity-100 hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        )}
        
        {/* Badges for promotion, popular items, and variations */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {isPromotion && (
            <div className="rounded bg-rustic-terracotta text-white px-2 py-1 text-xs font-medium flex items-center">
              <Star size={12} className="mr-1" /> Promoção
            </div>
          )}
          {isPopular && (
            <div className="rounded bg-rustic-olive text-white px-2 py-1 text-xs font-medium flex items-center">
              <TrendingUp size={12} className="mr-1" /> Mais Pedido
            </div>
          )}
          {hasVariations && (
            <div className="rounded bg-rustic-brown text-white px-2 py-1 text-xs font-medium flex items-center">
              <DollarSign size={12} className="mr-1" /> {variations.length} opções
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-rustic-charcoal">{name}</h3>
          <span className="font-semibold text-rustic-charcoal">
            {priceDisplay()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        {hasVariations && (
          <div className="mt-2 pt-2 border-t border-dashed border-rustic-lightBrown">
            <p className="text-xs text-muted-foreground mb-1">Opções disponíveis:</p>
            <div className="flex flex-wrap gap-1">
              {variations.map((v, idx) => (
                <span 
                  key={idx} 
                  className="text-xs px-1.5 py-0.5 bg-rustic-cream border border-rustic-lightBrown rounded"
                >
                  {v.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
