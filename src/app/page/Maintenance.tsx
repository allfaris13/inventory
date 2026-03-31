import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Plus,
  Users
} from "lucide-react";
import { Button } from "../components/ui/button";

const maintenanceSchedule = [
  {
    id: 1,
    component: "Array Sensor Lidar - Zona A",
    type: "Kalibrasi Sensor",
    priority: "Kritis",
    status: "Tertunda",
    scheduledDate: "2 April 2026",
    estimatedDuration: "2 jam",
    assignedTo: "Tim Teknis A",
  },
  {
    id: 2,
    component: "Kontroler Lengan Robot - Zona B",
    type: "Pembaruan Firmware",
    priority: "Kritis",
    status: "Tertunda",
    scheduledDate: "3 April 2026",
    estimatedDuration: "4 jam",
    assignedTo: "Tim Teknis B",
  },
  {
    id: 3,
    component: "Modul Kamera Visual",
    type: "Pembersihan & Kalibrasi Lensa",
    priority: "Rutin",
    status: "Dijadwalkan",
    scheduledDate: "5 April 2026",
    estimatedDuration: "1.5 jam",
    assignedTo: "Tim Teknis A",
  }
];

export function Maintenance() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-slate-800/50 bg-slate-900/30">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <AlertCircle size={24} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tugas Kritis</p>
              <p className="text-3xl font-bold text-white">4</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-800/50 bg-slate-900/30">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Calendar size={24} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Minggu Ini</p>
              <p className="text-3xl font-bold text-white">6</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-800/50 bg-slate-900/30">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Selesai</p>
              <p className="text-3xl font-bold text-white">3</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-800/50 bg-slate-900/30">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Clock size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Durasi Rata-rata</p>
              <p className="text-3xl font-bold text-white">3.5j</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Maintenance List Section */}
      <Card className="p-8 border-slate-800/50 bg-slate-900/20 shadow-2xl">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Pemeliharaan Mendatang</h2>
            <p className="text-slate-400 font-medium mt-1">Tugas dan kalibrasi terjadwal</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 font-bold shadow-lg shadow-indigo-500/20">
            <Plus size={18} />
            Jadwalkan Baru
          </Button>
        </div>

        <div className="space-y-6">
          {maintenanceSchedule.map((task) => (
            <div
              key={task.id}
              className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800 transition-all hover:bg-white/[0.02] hover:border-slate-700"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex gap-2">
                    <Badge className={`${task.priority === 'Kritis' ? 'bg-rose-500/20 text-rose-500' : 'bg-indigo-500/20 text-indigo-400'} border border-current/20 font-bold text-[10px] uppercase py-0.5 px-3 h-5`}>
                      {task.priority}
                    </Badge>
                    <Badge className={`${task.status === 'Tertunda' ? 'bg-orange-500/20 text-orange-500' : 'bg-indigo-500/20 text-indigo-400'} border border-current/20 font-bold text-[10px] uppercase py-0.5 px-3 h-5`}>
                      {task.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">{task.component}</h4>
                    <p className="text-sm font-medium text-slate-500 tracking-tight">{task.type}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
                    <div className="flex items-center gap-2.5">
                      <Calendar size={16} className="text-slate-500" />
                      <span className="text-xs font-semibold text-slate-400">Tanggal:</span>
                      <span className="text-sm font-bold text-slate-200">{task.scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock size={16} className="text-slate-500" />
                      <span className="text-xs font-semibold text-slate-400">Durasi:</span>
                      <span className="text-sm font-bold text-slate-200">{task.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Users size={16} className="text-slate-500" />
                      <span className="text-xs font-semibold text-slate-400">Tim:</span>
                      <span className="text-sm font-bold text-slate-200">{task.assignedTo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/maintenance/reschedule/${task.id}`)}
                    className="border-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-800 h-9 px-5"
                  >
                    Jadwal Ulang
                  </Button>
                  <Button 
                    onClick={() => navigate(`/maintenance/${task.id}`)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-9 px-5"
                  >
                    Lihat Detail
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
