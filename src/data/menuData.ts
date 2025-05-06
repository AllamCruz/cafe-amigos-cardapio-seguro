
import { MenuItem } from "../types/menu";

export const initialMenuItems: MenuItem[] = [
  // Pizzas
  {
    id: "pizza-1",
    name: "Pizza Margherita",
    description: "Molho de tomate, mussarela fresca, manjericão e azeite extra virgem.",
    price: 39.90,
    category: "Pizzas",
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "pizza-2",
    name: "Calabresa Especial",
    description: "Molho de tomate, calabresa fatiada, cebola, azeitonas pretas e orégano.",
    price: 45.90,
    category: "Pizzas",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "pizza-3",
    name: "Frango com Catupiry",
    description: "Molho de tomate, frango desfiado, catupiry original, milho e orégano.",
    price: 49.90,
    category: "Pizzas",
    imageUrl: "https://images.unsplash.com/photo-1571066811602-716837d681de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "pizza-4",
    name: "Quatro Queijos",
    description: "Molho de tomate, mussarela, provolone, gorgonzola, parmesão e orégano.",
    price: 52.90,
    category: "Pizzas",
    imageUrl: "https://images.unsplash.com/photo-1600028068383-ea11a7a101f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  
  // Bebidas
  {
    id: "drink-1",
    name: "Caipirinha",
    description: "Cachaça artesanal, limão, açúcar e gelo.",
    price: 18.90,
    category: "Bebidas",
    imageUrl: "https://images.unsplash.com/photo-1615887381207-7814687600aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "drink-2",
    name: "Cerveja Artesanal IPA",
    description: "Cerveja artesanal estilo IPA, 500ml.",
    price: 22.90,
    category: "Bebidas",
    imageUrl: "https://images.unsplash.com/photo-1618183479302-1e0aa382c36b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "drink-3",
    name: "Gin Tônica",
    description: "Gin importado, água tônica, limão e especiarias.",
    price: 26.90,
    category: "Bebidas",
    imageUrl: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "drink-4",
    name: "Suco Natural",
    description: "Suco de frutas frescas da estação.",
    price: 12.90,
    category: "Bebidas",
    imageUrl: "https://images.unsplash.com/photo-1622597467836-f3e6732c281a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  
  // Sobremesas
  {
    id: "dessert-1",
    name: "Petit Gateau",
    description: "Bolo quente de chocolate com interior cremoso, servido com sorvete de baunilha.",
    price: 24.90,
    category: "Sobremesas",
    imageUrl: "https://images.unsplash.com/photo-1635146037526-a75e5f7ff5e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "dessert-2",
    name: "Tiramisu",
    description: "Sobremesa italiana com camadas de biscoito de champagne embebido em café, creme de mascarpone e cacau.",
    price: 22.90,
    category: "Sobremesas",
    imageUrl: "https://images.unsplash.com/photo-1586040140378-b5874f9823e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "dessert-3",
    name: "Cheesecake de Frutas Vermelhas",
    description: "Torta cremosa de queijo com base de biscoito e cobertura de calda de frutas vermelhas.",
    price: 19.90,
    category: "Sobremesas",
    imageUrl: "https://images.unsplash.com/photo-1548865294-333e8bee3595?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  
  // Entradas
  {
    id: "starter-1",
    name: "Bruschetta",
    description: "Fatias de pão italiano com tomate, manjericão, alho e azeite de oliva.",
    price: 24.90,
    category: "Entradas",
    imageUrl: "https://images.unsplash.com/photo-1532050422434-42ef304c2614?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "starter-2",
    name: "Tábua de Queijos e Frios",
    description: "Seleção de queijos especiais e frios, acompanhados de mel, geleia e frutas.",
    price: 59.90,
    category: "Entradas",
    imageUrl: "https://images.unsplash.com/photo-1546964053-d778fb7088e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];
