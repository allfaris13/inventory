import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Check, X, Clock, AlertTriangle } from 'lucide-react';

export function PrepareAdminManage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/prepare/requests');
      const data = await res.json();
      setRequests(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (requestId: number, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/prepare/requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, action })
      });
      const data = await res.json();
      if (res.ok) {
        fetchData();
      } else {
        alert(data.error || "Error updating status.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 p-2">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Manajemen Stok Prepare</h1>
        <p className="text-muted-foreground font-medium">Konfirmasi permintaan pengambilan stok dari tim lapangan / Prepare.</p>
      </div>

      <Card className="border-border shadow-xl bg-card overflow-hidden rounded-3xl">
        <div className="p-6 bg-muted/10 border-b border-border">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} />
            Antrian Permintaan Barang
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-left border-b border-border">
                <th className="p-4 text-[10px] font-black uppercase text-muted-foreground">Waktu</th>
                <th className="p-4 text-[10px] font-black uppercase text-muted-foreground">Oleh User</th>
                <th className="p-4 text-[10px] font-black uppercase text-muted-foreground">Nama Barang</th>
                <th className="p-4 text-[10px] font-black uppercase text-muted-foreground text-center">Jumlah</th>
                <th className="p-4 text-[10px] font-black uppercase text-muted-foreground">Status</th>
                <th className="p-4 text-[10px] font-black uppercase text-muted-foreground text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="p-12 text-center font-bold animate-pulse text-muted-foreground">Memuat...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center text-muted-foreground font-medium italic">Belum ada permintaan dari tim prepare.</td></tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-sm text-muted-foreground font-medium">{req.request_date}</td>
                    <td className="p-4 font-bold text-foreground flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-black uppercase">
                        {req.requester?.substring(0, 2)}
                      </div>
                      {req.requester}
                    </td>
                    <td className="p-4 font-bold text-foreground">{req.item_name}</td>
                    <td className="p-4 font-black text-center text-primary">{req.quantity}</td>
                    <td className="p-4">
                      <Badge variant={req.status === 'approved' ? 'default' : req.status === 'rejected' ? 'destructive' : 'secondary'} className="font-black uppercase text-[10px]">
                        {req.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      {req.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button 
                            onClick={() => handleAction(req.id, 'approve')}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"
                          >
                            <Check size={16} className="mr-1"/> Approve
                          </Button>
                          <Button 
                            onClick={() => handleAction(req.id, 'reject')}
                            size="sm"
                            variant="ghost"
                            className="text-rose-600 hover:bg-rose-100 rounded-xl"
                          >
                            <X size={16} className="mr-1"/> Tolak
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
