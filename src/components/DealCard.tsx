import { motion } from "framer-motion";

// Image map for deal cards
const imageMap: Record<string, string> = {};

interface DealCardProps {
  title: string;
  price: number;
  currency: string;
  ticket: number;
  yieldPercent: number;
  soldPercent: number;
  daysLeft: number | null;
  imageUrl: string;
  imageSrc?: string;
  index: number;
}

const formatPrice = (price: number, currency: string) => {
  return `${price.toLocaleString()} ${currency}`;
};

const DealCard = ({
  title,
  price,
  currency,
  ticket,
  yieldPercent,
  soldPercent,
  daysLeft,
  imageSrc,
  index,
}: DealCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer aspect-[4/3]"
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-display text-lg font-semibold mb-1">{title}</h3>
        <p className="text-gold-light text-sm font-semibold">{formatPrice(price, currency)}</p>
        
        <div className="flex items-center justify-between mt-2 text-xs text-white/70">
          <span>Ticket: {formatPrice(ticket, currency)}</span>
          <span>Yield {yieldPercent}%</span>
          <span className="text-gold">Sold {soldPercent}%</span>
        </div>
        
        {daysLeft !== null && (
          <p className="text-white/50 text-xs mt-1">Days left {daysLeft}</p>
        )}
      </div>
    </motion.div>
  );
};

export default DealCard;
