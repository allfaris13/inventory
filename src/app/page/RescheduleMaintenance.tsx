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
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Jadwal
      </button>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">Jadwal Ulang Pemeliharaan</h1>
        <p className="text-slate-400 font-medium">Atur ulang waktu pelaksanaan untuk ID: MNT-{id}</p>
      </div>

      <Card className="p-8 border-slate-800/50 bg-slate-900/40 shadow-2xl">
        <div className="space-y-8">
          {/* Current Task Info (ReadOnly) */}
          <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
             <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Aset Sedang Dikerjakan</p>
             <h4 className="text-lg font-bold text-white">{taskName}</h4>
          </div>

          {/* Form Groups */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} className="text-indigo-400" />
                Tanggal Pelaksanaan Baru
              </label>
              <input 
                type="date" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} className="text-indigo-400" />
                Waktu Pelaksanaan
              </label>
              <input 
                type="time" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <User size={14} className="text-indigo-400" />
                Alasan Penjadwalan Ulang
              </label>
              <textarea 
                rows={4}
                placeholder="Berikan alasan logis mengapa pemeliharaan harus ditunda atau diatur ulang..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium resize-none text-sm"
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
            <Button 
              variant="outline" 
              onClick={() => navigate("/maintenance")}
              className="flex-1 border-slate-800 text-slate-400 font-bold h-12 hover:bg-slate-800"
            >
              <X size={18} className="mr-2" />
              Batalkan
            </Button>
            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 shadow-lg shadow-indigo-500/20">
              <Save size={18} className="mr-2" />
              Simpan Jadwal Baru
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
