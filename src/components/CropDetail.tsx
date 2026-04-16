import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Thermometer, Lightbulb, Droplets, Calendar, CheckCircle, Info, Zap } from 'lucide-react';

export default function CropDetail({ onBack }: { onBack: () => void }) {
  return (
    <div className="pb-32 pt-4 space-y-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-accent text-on-accent text-[10px] font-bold tracking-widest uppercase rounded-full">Superfood</span>
          </div>
          <h2 className="text-5xl font-extrabold text-on-surface leading-tight tracking-tighter mb-6">Germogli di <br/><span className="text-primary">Broccolo</span></h2>
          <p className="text-on-surface-variant leading-relaxed text-sm">Brassica oleracea var. italica — Una delle fonti più potenti di antiossidanti naturali disponibili in un diario di campo digitale.</p>
        </div>
        
        <div className="relative aspect-square md:aspect-auto h-[400px] w-full bento-card overflow-hidden p-0 border-none">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRxzlWWO4kwlFgO7VNIQCY0VpLBCtoi4iSnGfkN_KmmvBgDN_m86T_4b9SKIfOorDgtj-nJlbdN4isHHsxj885gOudTIiWjyJh2ndbYtXbVLMu45EQddjreQ9e1D6VtqTkbP4iedqeHF3X0JErPFhd9iV5qhM5fIkfYIGIbCSxNRAnpmc7qzD4MHNj2CfJJYNye0fKut1YgYbugNOz_m3zlfQYfIavqIUDUL0bE-oOU51Anltu7dA5zdZ8pXvALzb_rr3zU_v7tg" 
            alt="Broccoli Sprouts" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Floating Nutri Badge */}
          <div className="absolute bottom-6 right-6 z-20 bento-card-accent p-6 max-w-xs shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-on-accent fill-on-accent" />
              <span className="font-headline font-extrabold text-lg">Sulforafano</span>
            </div>
            <p className="text-[10px] font-bold text-on-accent/80 leading-tight">Contiene fino a 50 volte più glucorafanina rispetto ai broccoli maturi.</p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <DetailStat icon={<Thermometer className="w-4 h-4" />} label="Temperatura" value="18°C - 24°C" />
        <DetailStat icon={<Lightbulb className="w-4 h-4" />} label="Luce" value="Indiretta" />
        <DetailStat icon={<Droplets className="w-4 h-4" />} label="Irrigazione" value="2-3x al Giorno" />
        <DetailStat icon={<Calendar className="w-4 h-4" />} label="Raccolto" value="5-7 Giorni" />
      </section>

      {/* Culinary & Health */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-8">Guida Culinaria</h3>
          <div className="space-y-4">
            <RecipeItem 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuD2xncqOEzq8NGY8p1Fus9smUnqKTw1b-lxOzKX0gMUxe9uA0mGauAXo5StBxZ5PrTg_7so10vXUhDZFM5RlHIHrjrfS2Sm6AZ-qA_sqOUwq-r08nZO4ibfDqQKAAWcAYGeEgqg_GBVFU-XSAHxzR6h9CB_bqdqimf2YVP5oXzj-pfAUYkyikGsitYvtmTH8smUtqb05iMMzwB-2xE2UjeQZb3vZED7FQXarR8FCgc8NItk2cowIedSBA9NcT-dOSKNq6IvddV0fA"
              title="Insalata Verde Vitalità"
              description="Mescola germogli freschi con cavolo riccio e quinoa."
            />
            <RecipeItem 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuALgrxoXj8WUsTkrfS-USoWeiP8m9135peDyjdmFhxNYxSg49hYf_LWMdRS8gIVN87gCZ3I3UNFFagMfOCdWhgd1KsF7cRTTnxvMwrVajwbz5g67bIzWfZTwV7J3ntbsQzeM82AZUKZ-OcbHBSf_xRa-WBQseR3k4b3PNcgE8KnQ7X2eKn_HoQLgtwSjri-Vt6xIrgxSLja0au3PFnMdbr00NxTBlsZLcZoQV9eituU3X2hQkvlTbmMLopXk4gRgs_zIiHPawe0FA"
              title="Detox Blast Mattutino"
              description="Frulla i germogli in uno smoothie verde con ananas."
            />
          </div>
        </div>

        <div className="bento-card-large p-10 relative overflow-hidden">
          <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-8">Consigli degli Esperti</h3>
          <ul className="space-y-6">
            <ExpertTip text="Non cuocere mai i germogli. Il calore elevato distrugge l'enzima mirosinasi." />
            <ExpertTip text="Consumali con una fonte di polvere di semi di senape per aumentare l'assorbimento." />
            <ExpertTip text="Conservali in frigo con carta assorbente; restano freschi fino a 5 giorni." />
          </ul>
          <button className="mt-10 w-full py-4 bg-accent text-on-accent font-bold rounded-xl text-xs hover:opacity-90 transition-all">
            Inizia Nuovo Lotto
          </button>
        </div>
      </section>

      {/* Nutritional Profile */}
      <section className="space-y-8">
        <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Profilo Nutrizionale</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bento-card-accent p-8">
            <div>
              <span className="text-6xl font-black text-on-accent mb-2 block">100%</span>
              <span className="font-bold uppercase tracking-widest text-[10px] text-on-accent/60">Nutrienti Bio-Disponibili</span>
            </div>
            <p className="mt-6 text-on-accent/80 text-sm max-w-md">Ricchi di Vitamina C, K e folati. Supportano la salute del cuore e riducono l'infiammazione.</p>
          </div>
          <div className="bento-card p-8 gap-6">
            <NutriRow label="Proteine" value="2.3g" progress={45} />
            <NutriRow label="Fibre" value="1.8g" progress={60} />
            <div className="flex justify-between items-center mt-auto">
              <span className="text-xs font-bold">Senza Glutine</span>
              <CheckCircle className="w-5 h-5 text-accent" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DetailStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bento-card hover:bg-surface-container-high">
      <div className="text-primary mb-2">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">{label}</span>
      <span className="text-lg font-bold text-primary">{value}</span>
    </div>
  );
}

function RecipeItem({ image, title, description }: { image: string; title: string; description: string }) {
  return (
    <div className="bento-card flex-row gap-4 items-center hover:bg-surface-container-high p-4">
      <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
      <div>
        <h4 className="font-bold text-sm text-primary">{title}</h4>
        <p className="text-[10px] text-on-surface-variant leading-tight">{description}</p>
      </div>
    </div>
  );
}

function ExpertTip({ text }: { text: string }) {
  return (
    <li className="flex gap-4 items-start">
      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0"></div>
      <p className="text-xs text-white/80 leading-relaxed">{text}</p>
    </li>
  );
}

function NutriRow({ label, value, progress }: { label: string; value: string; progress: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold">{label}</span>
        <span className="text-xs font-bold text-primary">{value}</span>
      </div>
      <div className="w-full bg-outline-variant h-1.5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="bg-primary h-full"
        ></motion.div>
      </div>
    </div>
  );
}

function Sprout(props: any) {
  return <Info {...props} />; // Fallback icon
}
