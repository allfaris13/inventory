import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Plus,
  Users,
  X,
  Wrench,
  ShieldCheck
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";


export function Maintenance() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/maintenance')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const adapted = data.map(item => ({
            id: item.id,
            component: item.asset,
            type: item.task,
            priority: item.priority || 'Rutin',
            status: item.status || 'Dijadwalkan',
            scheduledDate: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            estimatedDuration: "2 jam",
            assignedTo: "Tim Teknis A"
          }));
          setTasks(adapted);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setIsLoading(false);
      });
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    component: '',
    type: '',
    priority: 'Rutin',
    scheduledDate: '',
    estimatedDuration: '',
    assignedTo: 'Tim Teknis A'
  });

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const id = tasks.length + 1;
    const newTaskEntry = {
      id,
      ...newTask,
      status: 'Dijadwalkan'
    };
    
    setTasks([newTaskEntry, ...tasks]);
    setIsModalOpen(false);
    setNewTask({
      component: '',
      type: '',
      priority: 'Rutin',
      scheduledDate: '',
      estimatedDuration: '',
      assignedTo: 'Tim Teknis A'
    });
  };

  const criticalTasks = tasks.filter(t => t.priority === 'Kritis').length;
  const pendingTasks = tasks.filter(t => t.status !== 'Selesai').length;
  const completedTasks = tasks.filter(t => t.status === 'Selesai').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 transition-colors">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="p-6 border-border bg-card shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/10 flex items-center justify-center text-rose-500">
              <AlertCircle size={24} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-wider">Tugas Kritis</p>
              <p className="text-3xl font-black text-foreground">{criticalTasks}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Calendar size={24} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-wider">Antrean</p>
              <p className="text-3xl font-black text-foreground">{pendingTasks}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={24} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-wider">Selesai</p>
              <p className="text-3xl font-black text-foreground">{completedTasks}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/10 flex items-center justify-center text-orange-500">
              <Clock size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-wider">Rata-rata</p>
              <p className="text-3xl font-black text-foreground">3.5j</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Maintenance List Section */}
      <Card className="p-8 border-border bg-card shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight uppercase">Pemeliharaan Mendatang</h2>
            <p className="text-muted-foreground font-bold mt-1 text-sm tracking-widest uppercase">TUGAS DAN KALIBRASI TERJADWAL</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 font-black shadow-[0_8px_24px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_32px_rgba(79,70,229,0.4)] active:scale-95 transition-all px-5 h-11 rounded-xl uppercase text-[10px] tracking-[0.2em] border border-indigo-400/20"
          >
            <Plus size={16} strokeWidth={3} />
            Jadwalkan Baru
          </Button>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed border-border animate-pulse">
               <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-4" />
               <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Menghubungkan ke Pusat Data...</p>
            </div>
          ) : tasks.map((task) => (
            <div
              key={task.id}
              className="p-7 bg-muted/20 rounded-3xl border border-border transition-all hover:bg-muted/30 hover:border-primary/30 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex-1 space-y-5">
                  <div className="flex gap-2">
                    <Badge className={`${task.priority === 'Kritis' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-primary/10 text-primary border-primary/20'} font-black text-[9px] uppercase tracking-[0.2em] py-1 px-4 h-6 border`}>
                      {task.priority}
                    </Badge>
                    <Badge className={`${task.status === 'Tertunda' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-primary/10 text-primary border-primary/20'} font-black text-[9px] uppercase tracking-[0.2em] py-1 px-4 h-6 border`}>
                      {task.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="text-2xl font-black text-foreground mb-1 group-hover:text-primary transition-colors">{task.component}</h4>
                    <p className="text-xs font-black text-muted-foreground tracking-[0.1em] uppercase">{task.type}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-2">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-muted-foreground" />
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Tanggal</span>
                         <span className="text-sm font-black text-foreground">{task.scheduledDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-muted-foreground" />
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Durasi</span>
                         <span className="text-sm font-black text-foreground">{task.estimatedDuration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users size={18} className="text-muted-foreground" />
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Tim</span>
                         <span className="text-sm font-black text-foreground">{task.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 p-1.5 bg-muted/20 rounded-2xl border border-border/50 shadow-inner">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/maintenance/reschedule/${task.id}`)}
                    className="border-amber-500/40 bg-card text-amber-600 dark:text-amber-400 font-black text-[10px] uppercase tracking-[0.2em] h-10 px-5 rounded-xl shadow-[0_4px_12px_rgba(245,158,11,0.1)] hover:bg-amber-500/10 active:scale-95 transition-all"
                  >
                    Jadwal Ulang
                  </Button>
                  <Button 
                    onClick={() => navigate(`/maintenance/${task.id}`)}
                    className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-[0.2em] h-10 px-5 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all border border-primary/20"
                  >
                    Lihat Detail
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {!isLoading && tasks.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-muted/10">
              <Wrench size={40} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-xs">Belum ada jadwal pemeliharaan</p>
            </div>
          )}
        </div>
      </Card>

      {/* New Maintenance Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg bg-card border-border shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-0 overflow-hidden animate-in zoom-in-95 rounded-[2rem]">
            <div className="p-8 border-b border-border flex justify-between items-center bg-muted/20">
              <div className="flex items-center gap-3 text-primary">
                <Wrench size={24} />
                <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Jadwal Baru</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Tutup"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveSchedule} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldCheck size={14} className="text-primary" />
                  Nama Komponen / Perangkat
                </label>
                <Input 
                  required 
                  placeholder="Contoh: Sensor Lidar Zona A" 
                  className="bg-muted/30 border-border h-12 text-foreground font-bold rounded-xl focus:ring-primary"
                  value={newTask.component}
                  onChange={e => setNewTask({...newTask, component: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Jenis Pekerjaan</label>
                  <Input 
                    required 
                    placeholder="Contoh: Kalibrasi" 
                    className="bg-muted/30 border-border h-12 text-foreground font-bold rounded-xl"
                    value={newTask.type}
                    onChange={e => setNewTask({...newTask, type: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Prioritas</label>
                  <select 
                    className="flex h-12 w-full rounded-xl border border-border bg-muted/30 px-4 py-1 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary font-bold"
                    value={newTask.priority}
                    onChange={e => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option className="bg-card">Rutin</option>
                    <option className="bg-card">Kritis</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Tanggal</label>
                  <Input 
                    type="date"
                    required 
                    className="bg-muted/30 border-border h-12 text-foreground font-bold rounded-xl"
                    value={newTask.scheduledDate}
                    onChange={e => setNewTask({...newTask, scheduledDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Durasi</label>
                  <Input 
                    placeholder="2 jam" 
                    className="bg-muted/30 border-border h-12 text-foreground font-bold rounded-xl"
                    value={newTask.estimatedDuration}
                    onChange={e => setNewTask({...newTask, estimatedDuration: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Tim</label>
                  <select 
                    className="flex h-12 w-full rounded-xl border border-border bg-muted/30 px-4 py-1 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary font-bold"
                    value={newTask.assignedTo}
                    onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                  >
                    <option className="bg-card">Tim A</option>
                    <option className="bg-card">Tim B</option>
                    <option className="bg-card">Tim C</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-14 border-border text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-muted"
                  onClick={() => setIsModalOpen(false)}
                >
                  BATAL
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  SIMPAN JADWAL
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
