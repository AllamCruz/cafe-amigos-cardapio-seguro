
import { Lock } from "lucide-react";
import { useState } from "react";
import { AdminLoginModal } from "./AdminLoginModal";

interface NavbarProps {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

export function Navbar({ isAdmin, setIsAdmin }: NavbarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-rustic-cream bg-opacity-95 border-b border-rustic-lightBrown shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src="/logo-placeholder.png" 
            alt="Café & Amigos Bistrô Bar" 
            className="h-12 w-auto hidden md:block" 
          />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-rustic-brown">
              Café & Amigos
            </h1>
            <p className="text-xs md:text-sm text-rustic-charcoal font-medium">
              Bistrô Bar
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="text-rustic-charcoal hover:text-rustic-terracotta transition-colors"
          aria-label="Admin Login"
        >
          <Lock size={18} />
        </button>
      </div>

      <AdminLoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        setIsAdmin={setIsAdmin}
        isAdmin={isAdmin}
      />
    </header>
  );
}
