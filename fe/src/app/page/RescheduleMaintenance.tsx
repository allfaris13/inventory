import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { ArrowLeft, Calendar, User, AlertCircle } from "lucide-react";
import { useState } from "react";

export function RescheduleMaintenance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newRepairDate, setNewRepairDate] = useState("");
  const [newReturnDate, setNewReturnDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!newRepairDate) {
      alert("Pilih tanggal perbaikan baru!");
      return;
    }
    setIsSaving(true);
    // Simulating API call
    setTimeout(() => {
      alert("Jadwal berhasil diperbarui!");
      navigate("/maintenance");
      setIsSaving(false);
    }, 1000);
  };

  const taskName = id === "1" ? "Array Sensor Lidar - Zona A" : id === "2" ? "Kontroler Lengan Robot - Zona B" : "Modul Kamera Visual";

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Button */}
      <button
        onClick={() => navigate("/maintenance")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-semibold mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Jadwal
      </button>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground tracking-tight uppercase italic">Reschedule Unit</h1>
        <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">ATUR ULANG DURASI PENGERJAAN UNTUK ID: MNT-{id}</p>
      </div>

      <Card className="p-8 border-border bg-card shadow-sm transition-colors rounded-[2.5rem]">
        <div className="space-y-8">
          {/* Current Task Info (ReadOnly) */}
          <div className="p-6 rounded-2xl bg-muted/20 border border-border border-l-4 border-l-indigo-500 space-y-1">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Aset Sedang Dikerjakan</p>
            <h4 className="text-xl font-black text-foreground">{taskName}</h4>
          </div>

          {/* Form Groups */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 ml-1">
                   <Calendar size={14} className="text-indigo-500" />
                   Tanggal Perbaikan
                 </label>
                 <input 
                   type="date" 
                   className="w-full bg-muted/10 border border-border rounded-xl px-4 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold shadow-sm"
                   value={newRepairDate}
                   onChange={(e) => setNewRepairDate(e.target.value)}
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                   <Calendar size={14} />
                   Estimasi Kembali
                 </label>
                 <input 
                   type="date" 
                   className="w-full bg-indigo-500/5 border border-indigo-500/20 rounded-xl px-4 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold shadow-sm"
                   value={newReturnDate}
                   onChange={(e) => setNewReturnDate(e.target.value)}
                 />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 ml-1">
                <User size={14} className="text-indigo-500" />
                Alasan Penundaan
              </label>
              <textarea 
                rows={4}
                placeholder="Berikan alasan logis mengapa pengembalian barang tertunda..."
                className="w-full bg-muted/10 border border-border rounded-xl px-4 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold resize-none text-sm shadow-sm"
              />
            </div>
          </div>

          {/* Warning Note */}
          <div className="flex gap-4 text-rose-500 bg-rose-500/5 p-5 rounded-2xl border border-rose-500/10 items-center">
            <AlertCircle size={24} className="shrink-0" />
            <p className="text-xs font-bold leading-relaxed">
              Unit dengan prioritas <span className="underline italic">Perbaikan Teknis</span> memerlukan koordinasi jadwal dengan Warehouse untuk sinkronisasi inventaris cadangan.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => navigate("/maintenance")}
              className="flex-1 border border-border text-muted-foreground font-black uppercase text-[10px] tracking-widest h-14 hover:bg-muted rounded-2xl active:scale-95 transition-all shadow-sm"
            >
              Batalkan
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-widest h-14 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all rounded-2xl disabled:opacity-50"
            >
              {isSaving ? "Menyimpan..." : "Update Jadwal"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
