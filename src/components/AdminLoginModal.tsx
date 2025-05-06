
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsAdmin: (isAdmin: boolean) => void;
  isAdmin: boolean;
}

export function AdminLoginModal({ isOpen, onClose, setIsAdmin, isAdmin }: AdminLoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a simple mock authentication
    // In a real app, you should use a secure authentication system
    if (username === "admin" && password === "admin123") {
      setIsAdmin(true);
      toast.success("Login realizado com sucesso!");
      onClose();
    } else {
      toast.error("Usuário ou senha incorretos!");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    toast.success("Logout realizado com sucesso!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-rustic-cream border border-rustic-lightBrown">
        <DialogHeader>
          <DialogTitle className="text-rustic-brown text-center text-2xl">
            {isAdmin ? "Área Administrativa" : "Login Administrativo"}
          </DialogTitle>
        </DialogHeader>
        
        {isAdmin ? (
          <div className="space-y-4 py-4">
            <p className="text-center text-rustic-charcoal">
              Você está logado como administrador.
            </p>
            <div className="flex justify-center">
              <Button 
                variant="destructive"
                onClick={handleLogout}
                className="w-full"
              >
                Sair
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-rustic-charcoal">
                Usuário
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                className="border-rustic-lightBrown focus-visible:ring-rustic-terracotta"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-rustic-charcoal">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="border-rustic-lightBrown focus-visible:ring-rustic-terracotta"
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-rustic-brown hover:bg-rustic-terracotta"
            >
              Entrar
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
