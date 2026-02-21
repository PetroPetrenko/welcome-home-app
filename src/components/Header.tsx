import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogOut, Menu, X, User } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-display font-bold text-card-foreground drop-shadow-lg">
          <span className="text-gradient-gold">InvestProp</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile")}
                className="text-foreground hover:text-gold backdrop-blur-sm bg-card/60"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-gold/40 text-foreground hover:bg-gold/10 backdrop-blur-sm bg-card/60"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                className="text-foreground hover:text-gold backdrop-blur-sm bg-card/60"
              >
                Log In
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/register")}
                className="bg-gradient-gold text-primary-foreground hover:opacity-90"
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-foreground p-2 backdrop-blur-sm bg-card/60 rounded-md"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-2 mx-4 p-4 rounded-lg backdrop-blur-lg bg-card/90 border border-border shadow-lg"
        >
          {user ? (
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => { navigate("/profile"); setMobileOpen(false); }}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="outline"
                className="w-full border-gold/40"
                onClick={() => { handleSignOut(); setMobileOpen(false); }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => { navigate("/login"); setMobileOpen(false); }}
              >
                Log In
              </Button>
              <Button
                className="w-full bg-gradient-gold text-primary-foreground"
                onClick={() => { navigate("/register"); setMobileOpen(false); }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
