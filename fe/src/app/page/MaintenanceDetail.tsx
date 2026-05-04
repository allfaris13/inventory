import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertTriangle,
  ClipboardList,
  Wrench as ToolsIcon
} from "lucide-react";

export function MaintenanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/maintenance')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
           const found = data.find((t: any) => t.id == id);
           setTask(found);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
     return <div className="p-8 text-white">Loading...</div>;
  }

  if (!task) {
     return <div className="p-8 text-white">Data tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Back Button and Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/maintenance")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Jadwal
        </button>

        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-white tracking-tight">{task.task_name}</h1>
            <div className="flex items-center gap-3">
               <p className="text-slate-400 font-medium tracking-widest text-xs uppercase">ID: {task.id}</p>
               <span className="text-slate-800">•</span>
               <Badge className={`font-black text-[9px] uppercase tracking-widest py-1 px-3 ${task.priority === 'Perbaikan Teknis' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                 {task.priority}
               </Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/maintenance/reschedule/${id}`)}
              className="border-slate-800 text-slate-200 hover:bg-slate-800 font-bold h-10 rounded-xl"
            >
              Jadwal Ulang
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-10 px-6 rounded-xl shadow-lg shadow-indigo-600/20">
              Selesaikan Pengerjaan
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Progress and Steps */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 border-slate-800/50 bg-slate-900/40 rounded-[2rem]">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <ClipboardList className="text-indigo-400" />
                  Status Pengerjaan Teknisi
               </h3>
               <div className="text-right">
                  <p className="text-sm font-bold text-slate-500 mb-1">PROGRES</p>
                  <p className="text-2xl font-black text-indigo-400">{task.progress}%</p>
               </div>
            </div>
            
            <Progress value={50} className="h-2 bg-slate-800 mb-10" />

            <div className="space-y-4">
              {[1, 2, 3].map((stepId) => (
                <div 
                  key={stepId} 
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all ${stepId === 1 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-900/40 border-slate-800 opacity-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${stepId === 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                      {stepId === 1 ? <CheckCircle2 size={18} /> : stepId}
                    </div>
                    <span className={`font-semibold ${stepId === 1 ? 'text-white' : 'text-slate-300'}`}>
                       Step {stepId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 border-slate-800/50 bg-slate-900/20 rounded-[2rem]">
             <h3 className="text-xl font-bold text-white mb-6">Catatan Kerusakan</h3>
             <div className="p-5 rounded-xl bg-orange-500/5 border border-orange-500/20 flex gap-4">
                <AlertTriangle className="text-orange-500 shrink-0" size={24} />
                <p className="text-slate-300 text-sm leading-relaxed font-medium italic">
                   "{task.notes || 'Tidak ada catatan tambahan.'}"
                </p>
             </div>
          </Card>
        </div>

        {/* Right Column - Task Metadata */}
        <div className="space-y-6">
          <Card className="p-6 border-slate-800/50 bg-slate-900/60 space-y-8 rounded-[2rem]">
            <h3 className="text-lg font-bold text-white px-2">Logistik & Penugasan</h3>
            
            <div className="space-y-6">
               <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                     <User size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Teknisi</p>
                     <p className="text-sm font-bold text-slate-200">{task.technician}</p>
                  </div>
               </div>

               <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                     <Calendar size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tanggal Perbaikan</p>
                     <p className="text-sm font-bold text-slate-200">{task.schedule_date}</p>
                  </div>
               </div>

               <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                     <CheckCircle2 size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Target Kembali</p>
                     <p className="text-sm font-bold text-slate-200">-</p>
                  </div>
               </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
               <p className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest px-2">Sparepart Dibutuhkan</p>
               <div className="flex flex-wrap gap-2 px-2">
                  {(task.tools || []).map((tool: string) => (
                     <Badge key={tool} variant="outline" className="border-slate-800 text-slate-400 bg-slate-900/50 font-medium">
                        {tool}
                     </Badge>
                  ))}
               </div>
            </div>
          </Card>

          <Card className="p-8 border-slate-800/50 bg-indigo-600/10 flex flex-col items-center text-center gap-4 rounded-[2rem] border-dashed">
             <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-xl shadow-indigo-500/10">
                <ToolsIcon size={32} />
             </div>
             <div>
                <h4 className="font-bold text-white">Butuh Bantuan?</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">Hubungi admin Warehouse jika stok pengganti tidak tersedia di rak cadangan.</p>
             </div>
             <Button variant="outline" className="w-full border-slate-800 text-slate-300 hover:text-white font-bold h-11 rounded-xl">Laporkan Isu Stok</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
