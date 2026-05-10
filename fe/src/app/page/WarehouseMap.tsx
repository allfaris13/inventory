import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MapPin, Package, AlertTriangle, Plus, Pencil, Trash2, X, LayoutGrid, Settings2 } from "lucide-react";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { useState, useEffect } from "react";

interface Zone {
  id: number;
  name: string;
  total_racks: number;
  color: string;
  description: string;
  occupiedRacks?: number;
  capacity?: number;
  items?: any[];
}

export function WarehouseMap() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    total_racks: 16,
    color: '#10b981',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch real zones from custom zones endpoint
      const zoneRes = await fetch('/api/warehouse-zones');
      const realZones = await zoneRes.json();
      
      // Fetch current inventory items to calculate placement
      const invRes = await fetch('/api/inventory');
      const inventory = await invRes.json();

      // Enrich zone data by matching inventory location names to zone names
      const enriched = realZones.map((z: any) => {
        const matchedItems = Array.isArray(inventory) 
          ? inventory.filter((item: any) => 
              item.location && item.location.toLowerCase().includes(z.name.toLowerCase())
            ) 
          : [];
        
        const occupiedCount = matchedItems.length;
        const cap = Math.min(100, Math.floor((occupiedCount / z.total_racks) * 100));
        
        return {
          ...z,
          occupiedRacks: occupiedCount,
          capacity: cap,
          items: matchedItems.slice(0, 5).map((m: any) => ({
            rack: m.location,
            sku: `INV-${m.id}`,
            name: m.name,
            quantity: m.stock
          }))
        };
      });

      setZones(enriched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingZone(null);
    setFormData({ name: '', total_racks: 16, color: '#10b981', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      total_racks: zone.total_racks,
      color: zone.color || '#10b981',
      description: zone.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus zona ini dari tata letak gudang?")) return;
    try {
      await fetch(`/api/warehouse-zones?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingZone ? 'PUT' : 'POST';
    const body = editingZone 
      ? { id: editingZone.id, ...formData }
      : formData;

    try {
      const res = await fetch('/api/warehouse-zones', {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const presetColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#64748b'];

  if (loading) return <div className="h-96 flex items-center justify-center animate-pulse text-muted-foreground">Memproses Blueprint Tata Letak...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(156, 163, 175, 0.6); }
      `}</style>
      {/* Interactive Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-3xl border border-border shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight uppercase italic">Tata Kelola Peta Gudang</h1>
          <p className="text-muted-foreground mt-1 font-medium text-sm flex items-center gap-2">
             <Settings2 size={16} />
             Kustomisasi zona, rack, dan pemetaan spasial sesuai kebutuhan Anda.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 rounded-2xl h-12 px-6 font-black uppercase text-xs tracking-widest active:scale-95 transition-all">
           <Plus size={18} className="mr-2" />
           Bangun Zona Baru
        </Button>
      </div>

      {/* Visual Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {zones.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground italic">Belum ada konfigurasi zona gudang tersimpan.</div>
        ) : zones.map((zone) => (
          <Card key={zone.id} className="relative overflow-hidden group p-6 border-none bg-white dark:bg-neutral-900 shadow-xl ring-1 ring-black/5 rounded-[2rem] transition-all hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.07] transition-all -mr-8 -mt-8 rounded-full" style={{ backgroundColor: zone.color }} />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md" style={{ backgroundColor: zone.color }}>
                   <LayoutGrid size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight">{zone.name}</h3>
                  <p className="text-xs font-medium text-muted-foreground">{zone.description || 'Area Gudang'}</p>
                </div>
              </div>
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => handleOpenEdit(zone)} className="p-2 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-muted-foreground transition-colors"><Pencil size={14} /></button>
                 <button onClick={() => handleDelete(zone.id)} className="p-2 bg-muted hover:bg-rose-100 hover:text-rose-600 rounded-lg text-muted-foreground transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-2 font-bold text-muted-foreground uppercase tracking-widest">
                  <span>Okupansi Rak</span>
                  <span className="text-foreground font-black">{(zone.occupiedRacks || 0)} / {zone.total_racks}</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                   <div className="h-full transition-all duration-1000 rounded-full" style={{ width: `${zone.capacity}%`, backgroundColor: zone.color }} />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                 <Badge className="font-black text-[9px] border-none" style={{ backgroundColor: `${zone.color}15`, color: zone.color }}>
                    {zone.capacity && zone.capacity > 80 ? "PADAT" : "TERTATA"}
                 </Badge>
                 <span className="font-black text-xl tracking-tighter text-foreground">{zone.capacity}%</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 2D Detailed Floor Grid */}
      {zones.length > 0 && (
      <Card className="p-8 bg-white dark:bg-neutral-900 border-none shadow-2xl rounded-[2.5rem] ring-1 ring-black/5">
        <div className="mb-8 flex items-center gap-3">
           <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-2xl"><MapPin size={24} /></div>
           <div>
             <h3 className="text-2xl font-black text-foreground tracking-tight">Render Blueprint Gudang 2D</h3>
             <p className="text-sm font-medium text-muted-foreground">Distribusi fisik item berdasarkan grid zona real-time</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {zones.map((zone) => (
            <div key={zone.id} className="flex flex-col">
              {/* Zone Bracket */}
              <div className="p-6 border-2 rounded-[2rem] flex-1 flex flex-col transition-all hover:shadow-lg hover:shadow-black/5" style={{ borderColor: `${zone.color}30` }}>
                 <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: zone.color }}></div>
                    <h4 className="font-black text-foreground uppercase tracking-wide text-sm">{zone.name}</h4>
                 </div>

                 {/* Render Logical Rack Matrix with Scrolling Container */}
                 <div className="flex-1 min-h-[180px] max-h-[240px] overflow-y-auto pr-2 custom-scrollbar relative">
                    <div className="grid grid-cols-4 gap-2 content-start">
                        {Array.from({ length: zone.total_racks > 0 ? zone.total_racks : 16 }).map((_, index) => {
                           const isOccupied = index < (zone.occupiedRacks || 0);
                           return (
                              <div 
                                 key={index} 
                                 className={`aspect-square rounded-lg transition-all shadow-sm ${
                                    isOccupied ? 'animate-in zoom-in-90 duration-500' : 'border border-dashed border-muted hover:border-muted-foreground/30 bg-muted/10'
                                 }`}
                                 style={{ backgroundColor: isOccupied ? zone.color : undefined }}
                                 title={isOccupied ? "Slot Terisi" : "Slot Kosong"}
                              />
                           );
                        })}
                    </div>
                 </div>
                 
                 <div className="mt-6 pt-4 border-t border-muted space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1">
                       <Package size={12} /> Isi Terkini di {zone.name}
                    </p>
                    {(zone.items || []).length === 0 ? (
                       <p className="text-xs text-muted-foreground italic">Kosong / Belum tertata.</p>
                    ) : (
                       zone.items?.map((it: any, i: number) => (
                          <div key={i} className="flex justify-between text-xs bg-muted/20 p-2 rounded-lg">
                             <span className="font-bold text-foreground truncate max-w-[150px]">{it.name}</span>
                             <span className="font-mono text-muted-foreground shrink-0">{it.quantity} u</span>
                          </div>
                       ))
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      )}

      {/* Upsert Modal */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-300">
            <Card className="w-full max-w-md bg-white dark:bg-neutral-900 shadow-2xl border-none rounded-[2.5rem] overflow-hidden animate-in zoom-in-95">
               <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
                  <h2 className="text-2xl font-black uppercase tracking-tight italic text-foreground">
                     {editingZone ? 'Modifikasi Zona' : 'Bangun Zona'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-xl text-muted-foreground"><X size={20} /></button>
               </div>

               <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nama Area (Harus Unik)</label>
                     <Input required placeholder="Contoh: Zona A" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl font-bold" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Slot / Rak</label>
                       <Input type="number" min={1} max={64} required value={formData.total_racks} onChange={e => setFormData({...formData, total_racks: parseInt(e.target.value) || 16})} className="h-12 rounded-xl font-bold text-center" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Visual Warna</label>
                       <div className="h-12 rounded-xl border border-input flex items-center px-3 gap-2 bg-card relative cursor-pointer">
                          <div className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: formData.color }} />
                          <span className="font-mono text-xs font-bold">{formData.color}</span>
                          <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                       </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                     {presetColors.map(c => (
                        <button key={c} type="button" onClick={() => setFormData({...formData, color: c})} className={`w-7 h-7 rounded-full border-2 transition-all ${formData.color === c ? 'scale-110 ring-2 ring-offset-2 ring-black/20' : ''}`} style={{ backgroundColor: c, borderColor: formData.color === c ? '#fff' : 'transparent' }} />
                     ))}
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Deskripsi Singkat</label>
                     <Input placeholder="Masukkan kegunaan area ini..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="h-12 rounded-xl font-medium" />
                  </div>

                  <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase text-sm tracking-widest bg-neutral-900 text-white hover:bg-black shadow-xl active:scale-95 transition-all">
                     {editingZone ? 'Simpan Perubahan' : 'Eksekusi Blueprint'}
                  </Button>
               </form>
            </Card>
         </div>
      )}
    </div>
  );
}
