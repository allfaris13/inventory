import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Plus, X, Search, Download, Eye, Filter, Package, Pencil } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import './Inventory.css';

interface InventoryItem {
  id: string; // Internal ID instead of SKU
  name: string;
  category: string;
  stock: number;
  maxStock: number;
  condition: string;
  location: string;
  type: 'mentah' | 'matang';
  unitPrice?: string;
  supplier?: string;
  image?: string;
  specifications?: Record<string, string>;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  { 
    id: '1', 
    name: 'Saklar On/Off Mini', 
    category: 'Elektronik', 
    stock: 120, 
    maxStock: 500, 
    condition: 'Baru', 
    location: 'Zona A - Laci 1', 
    type: 'mentah',
    image: 'https://images.unsplash.com/photo-1558002038-103792e01a8d?auto=format&fit=crop&q=80&w=200',
    specifications: { "Tipe": "Rocker Switch", "Rating": "3A 250V" }
  },
  { 
    id: '2', 
    name: 'Kabel Jumper AWG24 (Meter)', 
    category: 'Kelistrikan', 
    stock: 50, 
    maxStock: 200, 
    condition: 'Baru', 
    location: 'Zona B - Rak Kabel', 
    type: 'mentah', 
    image: 'https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&q=80&w=200' 
  },
  { 
    id: '3', 
    name: 'Saklar Terakit', 
    category: 'Perakitan', 
    stock: 15, 
    maxStock: 100, 
    condition: 'Baru', 
    location: 'Zona Matang - Rak 1', 
    type: 'matang', 
    image: 'https://images.unsplash.com/photo-1591485423007-765bde4139ef?auto=format&fit=crop&q=80&w=200' 
  }
];

const ASSEMBLY_RECIPES = [
  {
    productName: 'Saklar Terakit',
    components: [
      { nameMatch: 'Saklar On/Off', qty: 1 },
      { nameMatch: 'Kabel Jumper', qty: 1 }
    ]
  }
];

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'mentah' | 'matang'>('mentah');
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<InventoryItem>({
    id: '',
    name: '',
    category: 'Elektronik',
    stock: 0,
    maxStock: 0,
    condition: 'Baru',
    location: '',
    type: 'mentah',
    unitPrice: '',
    supplier: '',
    image: '',
    specifications: {}
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [specList, setSpecList] = useState<{key: string, value: string}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/inventory')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Adapt DB fields to UI interface
          const adapted = data.map(item => ({
            id: item.id.toString(),
            name: item.name,
            category: item.category,
            stock: item.stock,
            maxStock: 100, 
            condition: item.status || 'Baru',
            location: item.location,
            image: '',
            type: item.type || 'mentah'
          }));
          setItems(adapted);
        }
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);
  
  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua Kategori' || item.category === selectedCategory;
    const matchesTab = item.type === activeTab;
    return matchesSearch && matchesCategory && matchesTab;
  });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Elektronik': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'Mekanik': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Aktuator': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Baterai': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getConditionBadgeClass = (condition: string) => {
    switch (condition) {
      case 'Baru': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Rekondisi': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'Dalam Perbaikan': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const lowStockCount = items.filter((i: InventoryItem) => (i.stock / i.maxStock) < 0.25).length;
  const inRepairCount = items.filter((i: InventoryItem) => i.condition === 'Dalam Perbaikan').length;

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const specs: Record<string, string> = {};
    specList.forEach(s => {
      if (s.key && s.value) specs[s.key] = s.value;
    });

    const itemToSave = { ...newItem, specifications: specs };

    // Logic for automatic stock deduction if it's a "Matang" item being added (not edited)
    if (!editingId && newItem.type === 'matang') {
      const updatedItems = [...items];
      const qty = newItem.stock || 1;

      // Dynamic Assembly Deductions
      const recipe = ASSEMBLY_RECIPES.find(r => 
        newItem.name.toLowerCase().includes(r.productName.toLowerCase())
      );

      if (recipe) {
        recipe.components.forEach(comp => {
          updatedItems.forEach(item => {
            if (item.name.toLowerCase().includes(comp.nameMatch.toLowerCase()) && item.type === 'mentah') {
              item.stock = Math.max(0, item.stock - (comp.qty * qty));
            }
          });
        });
      }
      
      setItems([{ ...itemToSave, id: Date.now().toString() }, ...updatedItems]);
    } else if (editingId) {
      setItems(items.map(item => item.id === editingId ? itemToSave : item));
    } else {
      setItems([{ ...itemToSave, id: Date.now().toString() }, ...items]);
    }
    
    closeModal();
  };

  const openAddModal = (type: 'mentah' | 'matang') => {
    setEditingId(null);
    setNewItem({
      id: '',
      name: '',
      category: type === 'mentah' ? 'Elektronik' : 'Robotik',
      stock: 0,
      maxStock: 0,
      condition: 'Baru',
      location: '',
      type: type,
      unitPrice: '',
      supplier: '',
      image: '',
      specifications: {}
    });
    setSpecList([]);
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingId(item.id);
    setNewItem(item);
    
    // Map specifications object to specList array for the form
    const specs = item.specifications || {};
    setSpecList(Object.entries(specs).map(([key, value]) => ({ key, value })));
    
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addSpecField = () => {
    setSpecList([...specList, { key: '', value: '' }]);
  };

  const updateSpecField = (index: number, field: 'key' | 'value', value: string) => {
    const newList = [...specList];
    newList[index][field] = value;
    setSpecList(newList);
  };

  const removeSpecField = (index: number) => {
    setSpecList(specList.filter((_, i) => i !== index));
  };





  return (
    <div className="inventory-wrapper space-y-6 animate-in fade-in duration-500 transition-colors">
      {/* Header with Export & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Manajemen Inventaris</h1>
          <p className="text-xs md:text-sm text-muted-foreground font-medium">Telusuri dan kelola inventaris gudang</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {activeTab === 'mentah' ? (
            <button 
              onClick={() => openAddModal('mentah')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Plus size={16} />
              Beli Barang Baru
            </button>
          ) : (
            <button 
              onClick={() => openAddModal('matang')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg font-bold text-xs transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              <Plus size={16} />
              Catat Rakit Baru
            </button>
          )}
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-4 py-2.5 rounded-lg font-bold text-xs transition-all border border-border active:scale-95">
            <Download size={16} />
            Ekspor
          </button>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex p-1 bg-muted/30 rounded-2xl w-full max-w-md border border-border">
        <button
          onClick={() => setActiveTab('mentah')}
          className={`flex-1 py-3 px-6 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all ${activeTab === 'mentah' ? 'bg-card text-foreground shadow-lg border border-border' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Barang Mentah
        </button>
        <button
          onClick={() => setActiveTab('matang')}
          className={`flex-1 py-3 px-6 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all ${activeTab === 'matang' ? 'bg-card text-foreground shadow-lg border border-border' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Barang Matang
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 bg-muted/30 border border-border p-2 md:p-3 rounded-2xl md:rounded-xl transition-colors">
        <div className="flex-1 flex items-center gap-3 px-3 bg-card lg:bg-transparent rounded-xl lg:rounded-none h-12 lg:h-auto border border-border lg:border-none shadow-sm lg:shadow-none">
          <Search size={18} className="text-muted-foreground shrink-0" />
          <input 
            type="text" 
            placeholder="Cari nama barang..."
            className="bg-transparent border-none outline-none text-foreground text-sm w-full font-medium placeholder:text-muted-foreground/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-3 group bg-card lg:bg-transparent rounded-xl lg:rounded-none h-12 lg:h-auto border border-border lg:border-none shadow-sm lg:shadow-none min-w-[160px]">
          <Filter size={18} className="text-muted-foreground shrink-0 group-focus-within:text-primary transition-colors" />
          <select 
            className="bg-transparent border-none outline-none text-foreground font-bold text-sm cursor-pointer hover:text-primary transition-colors w-full"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option className="bg-card">Semua Kategori</option>
            <option className="bg-card">Elektronik</option>
            <option className="bg-card">Mekanik</option>
            <option className="bg-card">Aktuator</option>
            <option className="bg-card">Baterai</option>
          </select>
        </div>
      </div>

      {/* Inventory Table Card */}
      <Card className="p-0 border-border overflow-hidden shadow-sm bg-card transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest min-w-[80px]">Foto</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Nama Barang</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Kategori</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Jumlah Stok</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Kondisi</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Lokasi</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item: InventoryItem) => {
                const percentage = Math.round((item.stock / item.maxStock) * 100);
                const isCritical = percentage < 25;

                return (
                  <tr key={item.id} className="group hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-5">
                      <div className="w-12 h-12 rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={20} className="text-muted-foreground/30" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-foreground">{item.name}</td>
                    <td className="px-6 py-5 text-sm">
                      <Badge className={`${getCategoryBadgeClass(item.category)} text-[10px] uppercase font-bold py-1 px-3 border`}>
                        {item.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 min-w-[160px]">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={`text-xs font-black ${isCritical ? 'text-rose-500' : 'text-foreground'}`}>
                          {item.stock} / {item.maxStock}
                        </span>
                        <span className="text-[10px] font-black text-muted-foreground">{percentage}%</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className={`h-1.5 ${isCritical ? '[&>div]:bg-rose-500' : '[&>div]:bg-primary shadow-[0_0_8px_rgba(99,102,241,0.3)]'}`} 
                      />
                    </td>
                    <td className="px-6 py-5">
                      <Badge className={`${getConditionBadgeClass(item.condition)} text-[10px] font-bold py-1 px-3 border`}>
                        {item.condition}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-muted-foreground">{item.location}</td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => navigate(`/inventory/${item.id}`)}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                          title="Lihat"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary Stats Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-border bg-card space-y-4 shadow-sm transition-colors">
          <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Total Barang</p>
          <p className="text-4xl font-black text-foreground tracking-tight">{items.length}</p>
        </Card>
        <Card className="p-6 border-border bg-card space-y-4 shadow-sm transition-colors">
          <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Barang Stok Rendah</p>
          <p className="text-4xl font-black text-rose-500 tracking-tight">{lowStockCount}</p>
        </Card>
        <Card className="p-6 border-border bg-card space-y-4 shadow-sm transition-colors">
          <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Dalam Perbaikan</p>
          <p className="text-4xl font-black text-foreground tracking-tight">{inRepairCount}</p>
        </Card>
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md bg-card border-border shadow-2xl animate-in zoom-in-95 duration-200 rounded-[2rem]">
            <div className="flex justify-between items-center p-8 border-b border-border bg-muted/20">
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight">
                {editingId ? 'Edit Barang' : (newItem.type === 'mentah' ? 'Tambah Barang Mentah' : 'Catat Barang Matang')}
              </h2>
              <button 
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Tutup"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveItem} className="flex flex-col max-h-[82vh]">
              <div className="p-10 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Kategori</label>
                    <select 
                      className="flex h-12 w-full rounded-xl border border-border bg-card px-3 py-1 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary font-bold shadow-sm"
                      value={newItem.category}
                      onChange={e => setNewItem({...newItem, category: e.target.value})}
                    >
                      {newItem.type === 'mentah' ? (
                        <>
                          <option className="bg-card">Elektronik</option>
                          <option className="bg-card">Mekanik</option>
                          <option className="bg-card">Aktuator</option>
                          <option className="bg-card">Baterai</option>
                        </>
                      ) : (
                        <option className="bg-card">Robotik</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nama Barang</label>
                  <Input 
                    required 
                    placeholder="Masukkan nama barang lengkap..." 
                    className="bg-card border-border h-12 font-bold text-foreground rounded-xl shadow-sm"
                    value={newItem.name}
                    onChange={e => setNewItem({...newItem, name: e.target.value})}
                  />
                  {!editingId && newItem.type === 'matang' && newItem.name && ASSEMBLY_RECIPES.some(r => newItem.name.toLowerCase().includes(r.productName.toLowerCase())) && (
                    <div className="mt-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl animate-in slide-in-from-top-2 duration-300">
                       <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                         Auto-Deduction Terdeteksi
                       </p>
                       <p className="text-[11px] text-muted-foreground mt-1">
                         Menyimpan barang ini akan memotong stok <b>Saklar</b> dan <b>Kabel</b> di tab Mentah secara otomatis.
                       </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Stok Saat Ini</label>
                    <Input 
                      type="number" 
                      required 
                      className="bg-card border-border h-12 font-bold text-foreground text-center rounded-xl shadow-sm"
                      value={newItem.stock}
                      onChange={e => setNewItem({...newItem, stock: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Stok Maksimal</label>
                    <Input 
                      type="number" 
                      required 
                      className="bg-card border-border h-12 font-bold text-foreground text-center rounded-xl shadow-sm"
                      value={newItem.maxStock}
                      onChange={e => setNewItem({...newItem, maxStock: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Kondisi</label>
                    <select 
                      className="flex h-12 w-full rounded-xl border border-border bg-card px-3 py-1 text-sm text-foreground outline-none font-bold shadow-sm"
                      value={newItem.condition}
                      onChange={e => setNewItem({...newItem, condition: e.target.value})}
                    >
                      <option className="bg-card">Baru</option>
                      <option className="bg-card">Rekondisi</option>
                      <option className="bg-card">Dalam Perbaikan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Lokasi</label>
                    <Input 
                      placeholder="Zona A - Rak 1" 
                      className="bg-card border-border h-12 font-bold text-foreground font-mono rounded-xl shadow-sm"
                      value={newItem.location}
                      onChange={e => setNewItem({...newItem, location: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Harga Satuan</label>
                    <Input 
                      placeholder="Rp 0" 
                      className="bg-card border-border h-12 font-bold text-foreground rounded-xl shadow-sm"
                      value={newItem.unitPrice}
                      onChange={e => setNewItem({...newItem, unitPrice: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pemasok</label>
                    <Input 
                      placeholder="Nama Vendor" 
                      className="bg-card border-border h-12 font-bold text-foreground rounded-xl shadow-sm"
                      value={newItem.supplier}
                      onChange={e => setNewItem({...newItem, supplier: e.target.value})}
                    />
                  </div>
                </div>

                {/* Technical Specifications Section */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">Spesifikasi</span>
                    <button 
                      type="button"
                      onClick={addSpecField}
                      className="text-[9px] font-bold text-indigo-400 flex items-center gap-1 hover:text-indigo-300 transition-colors"
                    >
                      <Plus size={10} />
                      Tambah Baris
                    </button>
                  </div>
                  
                  {specList.length > 0 && (
                    <div className="space-y-3">
                      {specList.map((spec, index) => (
                        <div key={index} className="flex gap-2 items-center animate-in slide-in-from-right-2 duration-200">
                          <Input 
                            placeholder="Fitur" 
                            className="bg-card border-border h-10 text-xs font-bold flex-1 rounded-lg"
                            value={spec.key}
                            onChange={e => updateSpecField(index, 'key', e.target.value)}
                          />
                          <Input 
                            placeholder="Nilai" 
                            className="bg-card border-border h-10 text-xs font-bold flex-1 rounded-lg"
                            value={spec.value}
                            onChange={e => updateSpecField(index, 'value', e.target.value)}
                          />
                          <button 
                            type="button"
                            onClick={() => removeSpecField(index)}
                            className="text-muted-foreground hover:text-rose-500 transition-colors p-2"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden shadow-inner group cursor-pointer relative">
                      {newItem.image ? (
                        <img src={newItem.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <Plus className="text-muted-foreground/30" size={24} />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col gap-2">
                         <input 
                          type="file" 
                          accept="image/*"
                          id="image-upload-new"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <label 
                          htmlFor="image-upload-new"
                          className="bg-muted hover:bg-muted-foreground/10 text-foreground px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all border border-border text-center active:scale-95"
                        >
                          Pilih Foto
                        </label>
                        <p className="text-[10px] text-muted-foreground font-medium">Format: JPG, PNG (Max 2MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-border flex gap-4 bg-muted/10">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 bg-transparent border-border text-muted-foreground hover:text-foreground h-14 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all"
                  onClick={closeModal}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white h-14 font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  {editingId ? 'Simpan Perubahan' : 'Simpan Barang'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
