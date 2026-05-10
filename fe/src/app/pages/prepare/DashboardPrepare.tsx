import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { 
  Package, 
  ArrowDownCircle, 
  School, 
  Clock,
  Sparkles
} from 'lucide-react';

export function DashboardPrepare() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [distributions, setDistributions] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const prepareId = user?.id;

  useEffect(() => {
    if (!prepareId) return;

    const fetchData = async () => {
      try {
        const [invRes, distRes, reqRes] = await Promise.all([
          fetch(`/api/prepare/inventory?prepare_id=${prepareId}`),
          fetch(`/api/prepare/distributions?prepare_id=${prepareId}`),
          fetch(`/api/prepare/requests?requester_id=${prepareId}`)
        ]);

        const inv = await invRes.json();
        const dist = await distRes.json();
        const req = await reqRes.json();

        setInventory(inv || []);
        setDistributions(dist || []);
        setRequests(req || []);
      } catch (err) {
        console.error("Error loading prepare dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [prepareId]);

  const totalStock = inventory.reduce((acc, curr) => acc + (curr.stock || 0), 0);
  const activeRequests = requests.filter(r => r.status === 'pending').length;
  const schoolsServed = new Set(distributions.map(d => d.school_name)).size;

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Top Header Card with Purple Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-violet-700 to-indigo-900 text-white p-8 shadow-2xl shadow-purple-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-100 font-medium mb-2">
              <Sparkles size={16} />
              <span className="tracking-wide text-sm">Selamat Datang, Team Prepare</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">Dashboard Khusus Prepare</h1>
            <p className="text-purple-100/80 mt-2 font-medium text-lg">Kelola logistik alat peraga dan robotika antar unit gudang pusat dan sekolah.</p>
          </div>
          <div className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            Status Siap Berangkat
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-none shadow-xl bg-white dark:bg-neutral-900 group hover:scale-[1.02] transition-all duration-300 ring-1 ring-purple-500/5">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Stok di Tangan</p>
              <h3 className="text-4xl font-black text-purple-600 dark:text-purple-400">{totalStock} <span className="text-lg text-muted-foreground font-normal">Unit</span></h3>
            </div>
            <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20">
              <Package size={28} />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-none shadow-xl bg-white dark:bg-neutral-900 group hover:scale-[1.02] transition-all duration-300 ring-1 ring-purple-500/5">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Sekolah Terdistribusi</p>
              <h3 className="text-4xl font-black text-violet-600 dark:text-violet-400">{schoolsServed} <span className="text-lg text-muted-foreground font-normal">Lokasi</span></h3>
            </div>
            <div className="p-4 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/20">
              <School size={28} />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-none shadow-xl bg-white dark:bg-neutral-900 group hover:scale-[1.02] transition-all duration-300 ring-1 ring-purple-500/5">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Request Pending</p>
              <h3 className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{activeRequests} <span className="text-lg text-muted-foreground font-normal">Items</span></h3>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20">
              <ArrowDownCircle size={28} />
            </div>
          </div>
        </Card>
      </div>

      {/* Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Stock Table */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
              <div className="w-1 h-6 rounded bg-purple-600"></div>
              Stok yang Dibawa Saat Ini
            </h2>
          </div>
          <Card className="border-none shadow-lg bg-white dark:bg-neutral-900 overflow-hidden">
            {inventory.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground font-medium">
                Tidak ada stok di tangan saat ini.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {inventory.map((item, idx) => (
                  <div key={idx} className="p-4 flex justify-between items-center hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold border border-purple-200 dark:border-purple-800">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{item.item_name}</p>
                        <p className="text-xs text-muted-foreground">Item ID: #{item.item_id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-purple-600 dark:text-purple-400">{item.stock}</p>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">UNIT</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Distribution History Short */}
        <div className="space-y-4">
           <div className="flex justify-between items-center">
            <h2 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
              <div className="w-1 h-6 rounded bg-indigo-600"></div>
              Aktivitas Terakhir
            </h2>
          </div>
          <Card className="p-2 border-none shadow-lg bg-white dark:bg-neutral-900 space-y-1">
            {distributions.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground font-medium">
                Belum ada riwayat distribusi.
              </div>
            ) : (
              distributions.slice(0, 4).map((dist, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-indigo-500/5 transition-all group">
                  <div className="mt-1 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full border-2 border-indigo-600 group-hover:bg-indigo-600 transition-all"></div>
                    <div className="w-0.5 h-full bg-indigo-100 dark:bg-indigo-900/50 min-h-[20px]"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-foreground group-hover:text-indigo-600 transition-colors">{dist.school_name}</h4>
                        <p className="text-sm text-muted-foreground font-medium">{dist.item_name} &bull; {dist.quantity} Qty</p>
                      </div>
                      <div className="text-[10px] font-bold uppercase bg-muted text-muted-foreground px-2 py-1 rounded flex items-center gap-1">
                        <Clock size={10} />
                        {dist.dist_date?.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
