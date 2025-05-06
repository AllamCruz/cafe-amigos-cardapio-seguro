
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsAdmin: (isAdmin: boolean) => void;
  isAdmin: boolean;
}

export function AdminLoginModal({ isOpen, onClose, setIsAdmin, isAdmin }: AdminLoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success("Login realizado com sucesso!");
      setIsAdmin(true);
      onClose();
    } catch (error: any) {
      console.error("Error logging in:", error);
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      toast.success("Logout realizado com sucesso!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer logout");
    }
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
              <label htmlFor="email" className="text-sm font-medium text-rustic-charcoal">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
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
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
