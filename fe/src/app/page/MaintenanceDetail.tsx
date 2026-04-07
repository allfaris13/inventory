import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  ArrowLeft, 
  Wrench, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertTriangle,
  ClipboardList,
  Wrench as ToolsIcon
} from "lucide-react";

const maintenanceData = {
  1: {
    id: "MNT-2394",
    component: "Array Sensor Lidar - Zona A",
    sku: "LDR-500-A",
    type: "Kalibrasi Berkala",
    priority: "Kritis",
    status: "Dalam Proses",
    technician: "Budi Santoso",
    scheduledOn: "2 April 2026",
    estimatedTime: "2 Jam",
    progress: 45,
    steps: [
      { id: 1, title: "Inisialisasi sistem diagnostik", status: "finished" },
      { id: 2, title: "Pembersihan fisik unit sensor", status: "finished" },
      { id: 3, title: "Kalibrasi titik nol derajat", status: "active" },
      { id: 4, title: "Verifikasi data output terhadap standar", status: "pending" },
      { id: 5, title: "Uji coba operasional penuh", status: "pending" },
    ],
    tools: ["Calibration Kit L-Series", "Cleaning Fluid X1", "Software LidarConnect v4.2"],
    notes: "Sensor menunjukkan drift sekitar 2% pada suhu tinggi. Perlu perhatian ekstra pada titik kalibrasi 90 derajat."
  }
};

export function MaintenanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Use first item as fallback
  const task = maintenanceData[Number(id) as keyof typeof maintenanceData] || maintenanceData[1];

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
            <h1 className="text-4xl font-bold text-white tracking-tight">{task.component}</h1>
            <div className="flex items-center gap-3">
               <p className="text-slate-400 font-medium">Order ID: {task.id}</p>
               <span className="text-slate-800">•</span>
               <p className="text-slate-400 font-medium">SKU: {task.sku}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/maintenance/reschedule/${id}`)}
              className="border-slate-800 text-slate-200 hover:bg-slate-800 font-bold h-10"
            >
              Jadwal Ulang
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-10 px-6">
              Mulai Servis
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Progress and Steps */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 border-slate-800/50 bg-slate-900/20">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <ClipboardList className="text-indigo-400" />
                  Alur Kerja Pemeliharaan
               </h3>
               <div className="text-right">
                  <p className="text-sm font-bold text-slate-500 mb-1">PROGRES TOTAL</p>
                  <p className="text-2xl font-black text-indigo-400">{task.progress}%</p>
               </div>
            </div>
            
            <Progress value={task.progress} className="h-2 bg-slate-800 mb-10" />

            <div className="space-y-4">
              {task.steps.map((step) => (
                <div 
                  key={step.id} 
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all ${step.status === 'finished' ? 'bg-emerald-500/5 border-emerald-500/20' : step.status === 'active' ? 'bg-indigo-500/10 border-indigo-500/50 ring-1 ring-indigo-500/20' : 'bg-slate-900/40 border-slate-800 opacity-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step.status === 'finished' ? 'bg-emerald-500 text-slate-950' : step.status === 'active' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      {step.status === 'finished' ? <CheckCircle2 size={18} /> : step.id}
                    </div>
                    <span className={`font-semibold ${step.status === 'active' ? 'text-white' : 'text-slate-300'}`}>
                       {step.title}
                    </span>
                  </div>
                  {step.status === 'active' && (
                     <Badge className="bg-indigo-500 text-white animate-pulse">Sedang Dikerjakan</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 border-slate-800/50 bg-slate-900/20">
             <h3 className="text-xl font-bold text-white mb-6">Catatan Teknisi</h3>
             <div className="p-5 rounded-xl bg-orange-500/5 border border-orange-500/20 flex gap-4">
                <AlertTriangle className="text-orange-500 shrink-0" size={24} />
                <p className="text-slate-300 text-sm leading-relaxed font-medium">
                   {task.notes}
                </p>
             </div>
          </Card>
        </div>

        {/* Right Column - Task Metadata */}
        <div className="space-y-6">
          <Card className="p-6 border-slate-800/50 bg-slate-900/40 space-y-8">
            <h3 className="text-lg font-bold text-white">Detail Penugasan</h3>
            
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                     <Wrench size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Jenis Pemeliharaan</p>
                     <p className="text-sm font-bold text-slate-200">{task.type}</p>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                     <User size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Teknisi Penanggung Jawab</p>
                     <p className="text-sm font-bold text-slate-200">{task.technician}</p>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                     <Calendar size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Jadwal Pelaksanaan</p>
                     <p className="text-sm font-bold text-slate-200">{task.scheduledOn}</p>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                     <Clock size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Estimasi Waktu</p>
                     <p className="text-sm font-bold text-slate-200">{task.estimatedTime}</p>
                  </div>
               </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
               <p className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Peralatan Dibutuhkan</p>
               <div className="flex flex-wrap gap-2">
                  {task.tools.map(tool => (
                     <Badge key={tool} variant="outline" className="border-slate-800 text-slate-400 bg-slate-900/50">
                        {tool}
                     </Badge>
                  ))}
               </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-800/50 bg-slate-900/60 flex flex-col items-center text-center gap-4">
             <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <ToolsIcon size={32} />
             </div>
             <div>
                <h4 className="font-bold text-white">Butuh Bantuan?</h4>
                <p className="text-xs text-slate-500 mt-1">Hubungi departemen mekanik melalui sistem internal</p>
             </div>
             <Button variant="outline" className="w-full border-slate-800 text-white font-bold h-10">Laporkan Isu</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
