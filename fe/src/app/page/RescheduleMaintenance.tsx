import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft, Calendar, Clock, User, AlertCircle, Save, X } from "lucide-react";
import { useState } from "react";

export function RescheduleMaintenance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

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
        <h1 className="text-3xl font-bold text-foreground tracking-tight uppercase">Jadwal Ulang Pemeliharaan</h1>
        <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">ATUR ULANG WAKTU PELAKSANAAN UNTUK ID: MNT-{id}</p>
      </div>

      <Card className="p-8 border-border bg-card shadow-sm transition-colors rounded-[2rem]">
        <div className="space-y-8">
          {/* Current Task Info (ReadOnly) */}
          <div className="p-6 rounded-2xl bg-muted/20 border border-border space-y-3">
             <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Aset Sedang Dikerjakan</p>
             <h4 className="text-xl font-black text-foreground">{taskName}</h4>
          </div>

          {/* Form Groups */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} className="text-indigo-500" />
                Tanggal Pelaksanaan Baru
              </label>
              <input 
                type="date" 
                className="w-full bg-muted/10 border border-border rounded-xl px-4 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold shadow-sm"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} className="text-indigo-500" />
                Waktu Pelaksanaan
              </label>
              <input 
                type="time" 
                className="w-full bg-muted/10 border border-border rounded-xl px-4 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold shadow-sm"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <User size={14} className="text-indigo-500" />
                Alasan Penjadwalan Ulang
              </label>
              <textarea 
                rows={4}
                placeholder="Berikan alasan logis mengapa pemeliharaan harus ditunda atau diatur ulang..."
                className="w-full bg-muted/10 border border-border rounded-xl px-4 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold resize-none text-sm shadow-sm"
              />
            </div>
          </div>

          {/* Warning Note */}
          <div className="flex gap-3 text-orange-500 bg-orange-500/5 p-4 rounded-xl border border-orange-500/10">
             <AlertCircle size={20} className="shrink-0" />
             <p className="text-xs font-medium leading-relaxed">
               Melakukan jadwal ulang pada aset dengan prioritas **Kritis** dapat meningkatkan risiko kegagalan sistem. Pastikan tim teknis sudah dikonsultasikan.
             </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => navigate("/maintenance")}
              className="flex-1 border border-border text-muted-foreground font-black uppercase text-[10px] tracking-widest h-14 hover:bg-muted rounded-2xl active:scale-95 transition-all shadow-sm"
            >
              Batalkan
            </button>
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-widest h-14 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all rounded-2xl">
              Simpan Jadwal Baru
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
