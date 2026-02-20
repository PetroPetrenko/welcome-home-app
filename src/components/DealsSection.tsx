import { useEffect, useState } from "react";
import { dealsService } from "@/services/dealsService";
import DealCard from "@/components/DealCard";
import type { Deal } from "@/types/deals";
import marinaTorch from "@/assets/marina-torch.jpg";
import hhhrTower from "@/assets/hhhr-tower.jpg";
import oceanPeaks from "@/assets/ocean-peaks.jpg";
import alYaqoub from "@/assets/al-yaqoub.jpg";

const imageMap: Record<string, string> = {
  "/images/marina-torch.jpg": marinaTorch,
  "/images/hhhr-tower.jpg": hhhrTower,
  "/images/ocean-peaks.jpg": oceanPeaks,
  "/images/al-yaqoub.jpg": alYaqoub,
};

const DealsSection = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dealsService.getAll()
      .then(setDeals)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-display font-bold text-gold mb-6">Open Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6">
      <div className="container mx-auto">
        <h2 className="text-2xl font-display font-bold text-gold mb-6">Open Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deals.map((deal, index) => (
            <DealCard
              key={deal.id}
              title={deal.title}
              price={deal.price}
              currency={deal.currency}
              ticket={deal.ticket}
              yieldPercent={deal.yield_percent}
              soldPercent={deal.sold_percent}
              daysLeft={deal.days_left}
              imageUrl={deal.image_url ?? ""}
              imageSrc={imageMap[deal.image_url ?? ""] ?? undefined}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
