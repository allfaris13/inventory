import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Settings, 
  Zap, 
  Layers, 
  DollarSign, 
  Package,
  Plus,
  Trash2,
  X,
  Search,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface Component {
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  category: 'Elektronik' | 'Mekanik' | 'Aktuator' | 'Baterai';
}

interface Robot {
  id: string;
  name: string;
  model: string;
  image: string;
  components: Component[];
}

// Mock Database Gudang
const INVENTORY_SOURCE = [
  { name: 'Sensor Lidar LDR-500', sku: 'LDR-500-A', price: 18750000, category: 'Elektronik' as const },
  { name: 'Motor Stepper Industri', sku: 'SM-200-B', price: 4500000, category: 'Mekanik' as const },
  { name: 'Papan Kontrol CB-X1', sku: 'CB-X1-E', price: 12500000, category: 'Elektronik' as const },
  { name: 'Paket Baterai BP-3000', sku: 'BP-3000-D', price: 8200000, category: 'Baterai' as const },
  { name: 'Modul Kamera HD', sku: 'CAM-HD-G', price: 3200000, category: 'Elektronik' as const },
  { name: 'Perakit Gripper Robotik', sku: 'GRP-500-H', price: 24500000, category: 'Mekanik' as const },
  { name: 'Motor Servo SM-200', sku: 'SV-200-F', price: 7800000, category: 'Mekanik' as const },
  { name: 'Aktuator Pneumatik', sku: 'ACT-350-C', price: 5600000, category: 'Aktuator' as const },
  { name: 'Roda Omni Industri', sku: 'WHL-OM-90', price: 1250000, category: 'Mekanik' as const },
];

const INITIAL_ROBOTS: Robot[] = [
  {
    id: 'RBT-001',
    name: 'NeoCarrier X1',
    model: 'Autonomous Logistics Droid',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400',
    components: [
      { name: 'Sensor Lidar LDR-500', sku: 'LDR-500-A', quantity: 2, unitPrice: 18750000, category: 'Elektronik' },
      { name: 'Motor Stepper Industri', sku: 'SM-200-B', quantity: 4, unitPrice: 4500000, category: 'Mekanik' },
      { name: 'Papan Kontrol CB-X1', sku: 'CB-X1-E', quantity: 1, unitPrice: 12500000, category: 'Elektronik' },
      { name: 'Paket Baterai BP-3000', sku: 'BP-3000-D', quantity: 2, unitPrice: 8200000, category: 'Baterai' },
    ]
  },
  {
    id: 'RBT-002',
    name: 'TitanGrip G-500',
    model: 'Heavy Duty Assembly Arm',
    image: 'https://images.unsplash.com/photo-1563206767-5b18f218e7de?auto=format&fit=crop&q=80&w=400',
    components: [
      { name: 'Perakit Gripper Robotik', sku: 'GRP-500-H', quantity: 1, unitPrice: 24500000, category: 'Mekanik' },
      { name: 'Motor Servo SM-200', sku: 'SV-200-F', quantity: 6, unitPrice: 7800000, category: 'Mekanik' },
      { name: 'Aktuator Pneumatik', sku: 'ACT-350-C', quantity: 4, unitPrice: 5600000, category: 'Aktuator' },
    ]
  }
];

export function RobotHPP() {
  const [robots, setRobots] = useState<Robot[]>(INITIAL_ROBOTS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // States for New Robot Form
  const [newRobot, setNewRobot] = useState<Omit<Robot, 'id' | 'components'>>({
    name: '',
    model: 'New Prototype v1.0',
    image: 'https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&q=80&w=400'
  });
  const [newBOM, setNewBOM] = useState<Component[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<typeof INVENTORY_SOURCE>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateHPP = (robot: Robot | { components: Component[] }) => {
    return robot.components.reduce((acc, comp) => acc + (comp.quantity * comp.unitPrice), 0);
  };

  const currentTotalHPP = calculateHPP({ components: newBOM });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Elektronik': return <Cpu size={14} />;
      case 'Mekanik': return <Settings size={14} />;
      case 'Aktuator': return <Zap size={14} />;
      case 'Baterai': return <Layers size={14} />;
      default: return <Package size={14} />;
    }
  };

  const handleSearchComponent = (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const matches = INVENTORY_SOURCE.filter(i => 
        i.name.toLowerCase().includes(query.toLowerCase()) || 
        i.sku.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const addComponentFromSource = (sourceItem: typeof INVENTORY_SOURCE[0]) => {
    const existingIdx = newBOM.findIndex(c => c.sku === sourceItem.sku);
    if (existingIdx >= 0) {
      const updated = [...newBOM];
      updated[existingIdx].quantity += 1;
      setNewBOM(updated);
    } else {
      setNewBOM([...newBOM, {
        name: sourceItem.name,
        sku: sourceItem.sku,
        unitPrice: sourceItem.price,
        quantity: 1,
        category: sourceItem.category
      }]);
    }
    setSearchQuery('');
    setSuggestions([]);
  };

  const removeBOMRow = (idx: number) => {
    setNewBOM(newBOM.filter((_, i) => i !== idx));
  };

  const updateBOMQty = (idx: number, qty: number) => {
    const updated = [...newBOM];
    updated[idx].quantity = Math.max(1, qty);
    setNewBOM(updated);
  };

  const handleSaveRobot = () => {
    if (!newRobot.name || newBOM.length === 0) {
      alert("Lengkapi Nama Robot dan minimal 1 Komponen!");
      return;
    }
    const robotToSave: Robot = {
      ...newRobot,
      id: `RBT-${String(robots.length + 1).padStart(3, '0')}`,
      components: newBOM
    };
    setRobots([robotToSave, ...robots]);
    setIsModalOpen(false);
    setNewBOM([]);
    setNewRobot({ name: '', model: 'New Prototype v1.0', image: 'https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&q=80&w=400' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                <DollarSign size={28} />
             </div>
             Transparansi HPP Robot
          </h1>
          <p className="text-muted-foreground font-medium mt-2 italic">Audit biaya material murni (Zero Corruption Policy)</p>
        </div>
        <div className="flex gap-3">
           <Card className="px-5 py-3 border-emerald-500/20 bg-emerald-500/5 flex items-center gap-4">
              <ShieldCheck size={28} className="text-emerald-500" />
              <div>
                 <p className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest leading-none mb-1">Total Aset Komponen</p>
                 <p className="text-2xl font-black text-foreground">{formatCurrency(robots.reduce((acc, r) => acc + calculateHPP(r), 0))}</p>
              </div>
           </Card>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 px-6 h-16 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
           >
              <Plus size={20} />
              Daftarkan Robot Baru
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {robots.map((robot) => {
          const isExpanded = expandedId === robot.id;
          const totalHPP = calculateHPP(robot);
          
          return (
            <Card 
              key={robot.id} 
              className={`overflow-hidden border-border transition-all duration-300 ${isExpanded ? 'ring-2 ring-primary/20 shadow-2xl' : 'hover:border-primary/30 hover:shadow-lg'}`}
            >
              <div 
                className="p-6 cursor-pointer flex flex-col lg:flex-row items-center gap-8 relative"
                onClick={() => setExpandedId(isExpanded ? null : robot.id)}
              >
                <div className="w-full lg:w-40 h-40 rounded-2xl overflow-hidden border border-border shrink-0 bg-muted">
                   <img src={robot.image} alt={robot.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                </div>

                <div className="flex-1 space-y-4 w-full">
                   <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black tracking-widest uppercase">
                            {robot.id}
                          </Badge>
                          <span className="text-xs font-bold text-muted-foreground font-mono italic">{robot.model}</span>
                        </div>
                        <h2 className="text-3xl font-black text-foreground tracking-tight uppercase italic">{robot.name}</h2>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Biaya Material</p>
                         <p className="text-4xl font-black text-emerald-500 tracking-tighter">{formatCurrency(totalHPP)}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                         {robot.components.slice(0, 4).map((_, i) => (
                           <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                              <Package size={14} className="text-primary/40" />
                           </div>
                         ))}
                      </div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                         Terdiri dari {robot.components.length} Komponen Vital
                      </p>
                      <div className="flex-1" />
                      <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                         {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                      </div>
                   </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-border bg-muted/20 animate-in slide-in-from-top-4 duration-500">
                   <div className="p-8">
                      <div className="flex items-center justify-between mb-8 px-2">
                         <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-3">
                            <Layers size={18} className="text-primary" />
                            Bill of Materials (BOM)
                         </h3>
                         <div className="flex items-center gap-4 text-emerald-500 bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10">
                            <ShieldCheck size={16} />
                            <p className="text-[10px] font-black uppercase tracking-widest">Data Terverifikasi Gudang</p>
                         </div>
                      </div>

                      <div className="overflow-x-auto rounded-[2rem] border border-border bg-card shadow-xl">
                         <table className="w-full text-left border-collapse">
                            <thead>
                               <tr className="bg-muted/50 border-b border-border">
                                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Komponen Dasar</th>
                                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Kategori</th>
                                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center">Qty</th>
                                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Harga Satuan</th>
                                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Accumulated Cost</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                               {robot.components.map((comp, idx) => (
                                  <tr key={idx} className="hover:bg-primary/5 transition-colors group">
                                     <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                           <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-primary/30 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                              {getCategoryIcon(comp.category)}
                                           </div>
                                           <div>
                                              <p className="text-sm font-black text-foreground uppercase tracking-tight">{comp.name}</p>
                                              <p className="text-xs font-mono text-muted-foreground font-medium">{comp.sku}</p>
                                           </div>
                                        </div>
                                     </td>
                                     <td className="px-8 py-5">
                                        <Badge className="bg-muted border-border text-muted-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1">
                                           {comp.category}
                                        </Badge>
                                     </td>
                                     <td className="px-8 py-5 text-center">
                                        <span className="inline-flex items-center font-black text-sm text-foreground">
                                           x{comp.quantity}
                                        </span>
                                     </td>
                                     <td className="px-8 py-5 text-right text-sm font-bold text-muted-foreground">
                                        {formatCurrency(comp.unitPrice)}
                                     </td>
                                     <td className="px-8 py-5 text-right text-lg font-black text-foreground">
                                        {formatCurrency(comp.quantity * comp.unitPrice)}
                                     </td>
                                  </tr>
                               ))}
                            </tbody>
                            <tfoot>
                               <tr className="bg-emerald-500/5">
                                  <td colSpan={4} className="px-8 py-8 text-right text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em]">
                                     Total Nilai Aset Produksi (HPP)
                                  </td>
                                  <td className="px-8 py-8 text-right text-3xl font-black text-emerald-500 italic">
                                     {formatCurrency(totalHPP)}
                                  </td>
                               </tr>
                            </tfoot>
                         </table>
                      </div>
                   </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* MODAL: TAMBAH ROBOT BARU */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
           <Card className="w-full max-w-4xl bg-card border-slate-800 shadow-2xl rounded-[3rem] overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-border bg-muted/20 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                       <Plus size={24} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black text-foreground leading-none uppercase italic">Registrasi Unit Robot</h2>
                       <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mt-1">Manual Pendaftaran & Audit Komponen</p>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-muted rounded-2xl transition-all">
                    <X size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar grid grid-cols-1 lg:grid-cols-12 gap-10">
                 {/* Left Column: Basic Info */}
                 <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Nama Robot</label>
                       <Input 
                         placeholder="e.g. RoboX-Alpha" 
                         className="h-14 border-border bg-muted/20 text-lg font-black uppercase rounded-2xl italic shadow-inner"
                         value={newRobot.name}
                         onChange={e => setNewRobot({...newRobot, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Model / Versi</label>
                       <Input 
                         placeholder="v1.0 Standard" 
                         className="h-12 border-border bg-muted/20 font-bold rounded-xl"
                         value={newRobot.model}
                         onChange={e => setNewRobot({...newRobot, model: e.target.value})}
                       />
                    </div>
                    
                    <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center justify-center text-center">
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2">Estimasi HPP Terkini</p>
                        <p className="text-2xl font-black text-foreground italic break-all leading-tight">
                           {formatCurrency(currentTotalHPP)}
                        </p>
                        <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground italic">
                           <ShieldCheck size={12} className="text-emerald-500" />
                           Audit Material Aktif
                        </div>
                    </div>
                 </div>

                 {/* Right Column: BOM Table */}
                 <div className="lg:col-span-8 space-y-6">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 block">Tambah Komponen dari Gudang</label>
                       <div className="relative group">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" size={20} />
                          <Input 
                            placeholder="Cari Nama Komponen atau SKU..." 
                            className="h-14 pl-12 border-indigo-500/30 bg-indigo-500/5 focus:ring-4 focus:ring-indigo-500/10 text-sm font-bold rounded-2xl transition-all"
                            value={searchQuery}
                            onChange={e => handleSearchComponent(e.target.value)}
                          />
                          
                          {/* Search Suggestions */}
                          {suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                               {suggestions.map((item, i) => (
                                 <div 
                                   key={i} 
                                   onClick={() => addComponentFromSource(item)}
                                   className="p-4 hover:bg-indigo-500/10 cursor-pointer flex justify-between items-center group transition-colors"
                                 >
                                    <div>
                                       <p className="text-sm font-black text-foreground group-hover:text-indigo-400">{item.name}</p>
                                       <p className="text-[10px] font-mono text-muted-foreground">{item.sku}</p>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-xs font-black text-foreground">{formatCurrency(item.price)}</p>
                                       <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.category}</p>
                                    </div>
                                 </div>
                               ))}
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="border border-border rounded-[2.5rem] overflow-hidden bg-muted/10">
                       <table className="w-full text-left text-xs">
                          <thead className="bg-muted/40 border-b border-border">
                             <tr>
                                <th className="px-6 py-4 font-black text-slate-500 uppercase">Item</th>
                                <th className="px-6 py-4 font-black text-slate-500 uppercase text-center w-24">Qty</th>
                                <th className="px-6 py-4 font-black text-slate-500 uppercase text-right">Subtotal</th>
                                <th className="px-6 py-4 w-12 text-center"></th>
                             </tr>
                          </thead>
                          <tbody>
                             {newBOM.length === 0 ? (
                               <tr>
                                  <td colSpan={4} className="px-6 py-12 text-center">
                                     <div className="flex flex-col items-center gap-3 opacity-30">
                                        <Package size={32} />
                                        <p className="font-bold">Belum ada komponen terpilih</p>
                                     </div>
                                  </td>
                               </tr>
                             ) : (
                               newBOM.map((comp, idx) => (
                                 <tr key={idx} className="border-b border-border/50 animate-in slide-in-from-right-4 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                                    <td className="px-6 py-4">
                                       <p className="font-black text-foreground uppercase">{comp.name}</p>
                                       <p className="text-[10px] font-mono text-muted-foreground">{formatCurrency(comp.unitPrice)} / Unit</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                       <input 
                                         type="number"
                                         value={comp.quantity}
                                         onChange={e => updateBOMQty(idx, parseInt(e.target.value) || 1)}
                                         className="w-16 h-10 bg-card border border-border text-center font-black rounded-xl text-sm"
                                       />
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-foreground">
                                       {formatCurrency(comp.quantity * comp.unitPrice)}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                       <button 
                                         onClick={() => removeBOMRow(idx)}
                                         className="text-muted-foreground hover:text-rose-500 transition-colors"
                                       >
                                          <Trash2 size={16} />
                                       </button>
                                    </td>
                                 </tr>
                               ))
                             )}
                          </tbody>
                       </table>
                    </div>

                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                       <AlertCircle size={20} className="text-orange-500 shrink-0" />
                       <p className="text-[10px] font-bold text-orange-500 leading-normal uppercase">
                          Setiap penambahan komponen akan tercatat di log audit dan tidak dapat diubah harganya (Fixed at Library price) untuk keamanan data.
                       </p>
                    </div>
                 </div>
              </div>

              <div className="px-10 py-8 border-t border-border bg-muted/30 flex gap-4">
                 <button 
                   onClick={() => setIsModalOpen(false)}
                   className="flex-1 bg-transparent hover:bg-muted text-muted-foreground font-black uppercase text-xs tracking-[0.2em] h-16 rounded-2xl transition-all"
                 >
                    Batalkan Registrasi
                 </button>
                 <button 
                   onClick={handleSaveRobot}
                   className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs tracking-[0.2em] h-16 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                 >
                    Terbitkan Data & Simpan HPP
                 </button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
