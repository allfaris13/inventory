import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Building2, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  QrCode, 
  ExternalLink,
  Search,
  Filter,
  Package,
  Share2,
  Calendar,
  User,
  Download as DownloadIcon,
  ClipboardList
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

interface BorrowRequest {
  id: string;
  institution: string;
  pic: string;
  items: string[];
  purpose: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Borrowed' | 'Returned';
}

const INITIAL_REQUESTS: BorrowRequest[] = [
  {
    id: "REQ-001",
    institution: "SMA Negeri 1 Bandung",
    pic: "Bapak Ahmad",
    items: ["Saklar Terakit", "Kabel Jumper AWG24"],
    purpose: "Persiapan Lomba Robotik Nasional",
    date: "16 Apr 2026",
    status: "Pending"
  },
  {
    id: "REQ-002",
    institution: "Unit Robotika ITB",
    pic: "Sarah Wijaya",
    items: ["Sensor Ultra Sonic", "Motor Servo SM-200"],
    purpose: "Penelitian Tugas Akhir",
    date: "15 Apr 2026",
    status: "Borrowed"
  }
];

export function Peminjaman() {
  const [requests, setRequests] = useState<BorrowRequest[]>(INITIAL_REQUESTS);
  const [activeTab, setActiveTab] = useState<'Requests' | 'Active' | 'QR'>('Requests');
  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'Borrowed' } : req
    ));
  };

  const handleReject = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  const handleReturn = (id: string) => {
     setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'Returned' } : req
    ));
  };

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const activeLoans = requests.filter(r => r.status === 'Borrowed');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Manajemen Peminjaman</h1>
          <p className="text-muted-foreground mt-1 text-xs font-black tracking-widest uppercase">PEMANTAUAN PEMINJAMAN KOMPONEN OLEH LEMBAGA LUAR</p>
        </div>
        <div className="flex p-1 bg-muted/30 rounded-2xl border border-border">
          <button 
            onClick={() => setActiveTab('Requests')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'Requests' ? 'bg-card text-foreground shadow-lg border border-border' : 'text-muted-foreground'}`}
          >
            Pengajuan ({pendingRequests.length})
          </button>
          <button 
            onClick={() => setActiveTab('Active')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'Active' ? 'bg-card text-foreground shadow-lg border border-border' : 'text-muted-foreground'}`}
          >
            Aktif ({activeLoans.length})
          </button>
          <button 
            onClick={() => setActiveTab('QR')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'QR' ? 'bg-card text-foreground shadow-lg border border-border' : 'text-muted-foreground'}`}
          >
            BAGIKAN QR
          </button>
        </div>
      </div>

      {activeTab === 'Requests' && (
        <Card className="bg-card border-border shadow-2xl rounded-[2rem] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-8 border-b border-border flex justify-between items-center bg-muted/10">
             <div>
                <h3 className="text-xl font-black text-foreground uppercase tracking-tighter">Log Pengajuan Masuk</h3>
                <p className="text-xs text-muted-foreground mt-1 font-bold">DATA DARI FORM PEMINJAMAN PUBLIK</p>
             </div>
             <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-9 rounded-xl border-border text-[10px] font-black uppercase tracking-widest"><Filter size={14} className="mr-2" /> Filter</Button>
                <Button variant="outline" size="sm" className="h-9 rounded-xl border-border text-[10px] font-black uppercase tracking-widest"><DownloadIcon size={14} className="mr-2" /> Export</Button>
             </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[10px] font-black text-muted-foreground uppercase tracking-widest py-5 px-8">ID & Tanggal</TableHead>
                  <TableHead className="text-[10px] font-black text-muted-foreground uppercase tracking-widest py-5">Institusi / Sekolah</TableHead>
                  <TableHead className="text-[10px] font-black text-muted-foreground uppercase tracking-widest py-5">Penanggung Jawab</TableHead>
                  <TableHead className="text-[10px] font-black text-muted-foreground uppercase tracking-widest py-5">Barang & Kebutuhan</TableHead>
                  <TableHead className="text-[10px] font-black text-muted-foreground uppercase tracking-widest py-5">Keperluan / Deskripsi</TableHead>
                  <TableHead className="text-[10px] font-black text-muted-foreground uppercase tracking-widest py-5 text-right px-8">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                       <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <ClipboardList size={48} className="mb-4 opacity-20" />
                          <p className="font-bold uppercase tracking-widest text-xs">Belum ada data pengisian form</p>
                       </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingRequests.map((req) => (
                    <TableRow key={req.id} className="border-border hover:bg-muted/20 transition-colors group">
                      <TableCell className="py-6 px-8">
                        <p className="text-xs font-black text-indigo-500 mb-1">{req.id}</p>
                        <p className="text-[10px] font-bold text-muted-foreground">{req.date}</p>
                      </TableCell>
                      <TableCell className="py-6">
                        <p className="font-black text-foreground text-sm uppercase tracking-tight">{req.institution}</p>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                             <User size={14} />
                           </div>
                           <p className="text-sm font-bold text-foreground">{req.pic}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                         <div className="flex flex-wrap gap-1.5 min-w-[150px]">
                            {req.items.map(item => (
                              <Badge key={item} className="bg-muted text-foreground text-[9px] font-black px-2 py-0.5 border-none">
                                {item}
                              </Badge>
                            ))}
                         </div>
                      </TableCell>
                      <TableCell className="py-6">
                         <p className="text-[11px] text-muted-foreground max-w-[200px] leading-relaxed italic">"{req.purpose}"</p>
                      </TableCell>
                      <TableCell className="py-6 px-8 text-right">
                         <div className="flex justify-end gap-2">
                            <Button 
                              onClick={() => handleApprove(req.id)}
                              className="h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[9px] tracking-widest rounded-xl shadow-lg shadow-emerald-600/20"
                            >
                               Setujui
                            </Button>
                            <Button 
                              onClick={() => handleReject(req.id)}
                              variant="outline"
                              className="h-9 px-4 border-border text-muted-foreground hover:text-red-400 hover:border-red-400/30 font-black uppercase text-[9px] tracking-widest rounded-xl"
                            >
                               Tolak
                            </Button>
                         </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {activeTab === 'Active' && (
        <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
           {activeLoans.map(req => (
              <Card key={req.id} className="bg-card border-border shadow-xl p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="flex items-center gap-6 flex-1 w-full">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                       <Package size={32} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-foreground">{req.institution}</h3>
                       <div className="flex items-center gap-4 mt-1">
                          <p className="text-xs text-muted-foreground flex items-center gap-1 font-bold">
                             <Calendar size={12} /> {req.date}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 font-bold">
                             <User size={12} /> {req.pic}
                          </p>
                       </div>
                       <div className="mt-3 flex gap-2">
                          {req.items.map(i => <span key={i} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{i}</span>)}
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-3 w-full md:w-auto">
                    <Button 
                      onClick={() => handleReturn(req.id)}
                      className="flex-1 md:px-8 h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xl shadow-indigo-600/20"
                    >
                       Konfirmasi Kembali
                    </Button>
                 </div>
              </Card>
           ))}
        </div>
      )}

      {activeTab === 'QR' && (
        <div className="max-w-4xl mx-auto flex flex-col items-center animate-in zoom-in-95 duration-500">
           <Card className="p-12 bg-white text-slate-900 border-none shadow-2xl rounded-[3rem] text-center w-full max-w-md">
              <div className="flex items-center justify-center gap-2 mb-8">
                 <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Package className="text-white w-5 h-5" />
                 </div>
                 <h2 className="text-xl font-black uppercase tracking-tighter italic">RoboEdu</h2>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Form Peminjaman</h3>
              <p className="text-sm text-slate-500 font-medium mb-10">Scan kode QR di bawah untuk mengisi formulir peminjaman komponen.</p>

              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col items-center">
                 {/* QR CODE PLACEHOLDER - Using an external API for realism */}
                 <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-inner mb-6 flex items-center justify-center overflow-hidden border border-slate-200">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/pinjam')}`} 
                      alt="QR Code" 
                      className="w-full h-full object-contain"
                    />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Link Akses Langsung:</p>
                 <a 
                  href="/pinjam" 
                  target="_blank"
                  className="text-indigo-600 font-black text-xs hover:underline mt-1 flex items-center gap-1"
                >
                  {window.location.origin}/pinjam
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                 <Button variant="outline" className="border-slate-200 rounded-xl font-bold h-12">
                     Download JPG
                 </Button>
                 <Button className="bg-slate-900 text-white rounded-xl font-bold h-12">
                     Cetak QR
                 </Button>
              </div>
           </Card>
           
           <div className="mt-12 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl max-w-lg text-center">
              <p className="text-xs text-indigo-400 font-medium leading-relaxed">
                <span className="font-black uppercase tracking-widest block mb-2">Tips Peminjaman</span>
                Cetak Kode QR ini dan tempel di area logistik atau berikan kepada perwakilan sekolah. 
                Data pengajuan mereka akan muncul otomatis di tab "Pengajuan Baru".
              </p>
           </div>
        </div>
      )}
    </div>
  );
}
