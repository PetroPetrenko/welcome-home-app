import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt="Dubai skyline"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 overlay-dark" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 leading-tight">
          The chemical{" "}
          <span className="text-gradient-gold">negatively charged</span>
        </h1>
        <p className="text-white/70 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Numerous calculations and experiments confirm, that the force field
          reflects the beam, while the mass defect is not formed. The chemical compound is
          negatively charged. Towards the mass defect is
        </p>
        <Button
          size="lg"
          onClick={() => navigate(user ? "/" : "/register")}
          className="bg-gradient-gold text-primary-foreground hover:opacity-90 px-8 py-3 text-base font-semibold rounded-md shadow-lg"
        >
          Get Started
        </Button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
