import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  CheckCircle2, 
  User, 
  ClipboardList, 
  Package,
  Clock,
  Building2
} from 'lucide-react';

export function PinjamForm() {
  const [formData, setFormData] = useState({
    institution: '',
    pic: '',
    phone: '',
    purpose: '',
    jenjang: '',
    materialNeeds: '',
    quantity: '',
    pickupDateTime: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log("Submitting Loan Request:", formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="animate-in zoom-in-95 duration-500">
           <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="text-emerald-500 w-12 h-12" />
           </div>
           <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 italic">Berhasil Terkirim</h1>
           <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">
             Terima kasih **{formData.pic}**. Pengajuan peminjaman untuk **{formData.institution}** telah kami terima. Tim Logistik RoboEdu akan segera menghubungi Anda.
           </p>
           <Button 
            onClick={() => window.location.reload()}
            className="mt-10 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-2xl px-8 h-12 font-bold"
           >
             Tutup
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative max-w-2xl mx-auto p-6 pt-12 pb-20">
        {/* Header Form */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Package className="text-white w-6 h-6" />
             </div>
             <h2 className="text-2xl font-black uppercase tracking-tighter italic">RoboEdu</h2>
          </div>
          <h1 className="text-base font-black text-white uppercase tracking-widest">Form Peminjaman Barang</h1>
          <p className="text-xs text-slate-500 mt-2 font-medium">Khusus Sekolah & Lembaga Pembelajaran</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Section 1: Data Institusi */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-400 mb-2">
               <Building2 className="w-5 h-5" />
               <span className="text-xs font-black uppercase tracking-widest">Data Institusi</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Sekolah / Lembaga</label>
                <Input 
                  required
                  placeholder="Contoh: SMA Negeri 1 Jakarta"
                  className="h-14 bg-slate-900 border-slate-800 rounded-2xl focus:ring-indigo-500 text-base font-bold"
                  value={formData.institution}
                  onChange={e => setFormData({...formData, institution: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Jenjang</label>
                <Input 
                  required
                  placeholder="Contoh: Beginner / Basic / Tema"
                  className="h-14 bg-slate-900 border-slate-800 rounded-2xl text-base font-bold"
                  value={formData.jenjang}
                  onChange={e => setFormData({...formData, jenjang: e.target.value})}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tujuan Peminjaman</label>
                <textarea 
                  required
                  placeholder="Contoh: Pelatihan Robotik Nasional"
                  className="w-full min-h-[100px] bg-slate-900 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none text-base font-medium placeholder:text-slate-600 transition-all"
                  value={formData.purpose}
                  onChange={e => setFormData({...formData, purpose: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Identitas Pengajar */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-400 mb-2">
               <User className="w-5 h-5" />
               <span className="text-xs font-black uppercase tracking-widest">Identitas Pengajar</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Pengajar</label>
                <Input 
                  required
                  placeholder="Contoh: Budi Sudarsono"
                  className="h-14 bg-slate-900 border-slate-800 rounded-2xl text-base font-bold"
                  value={formData.pic}
                  onChange={e => setFormData({...formData, pic: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                <Input 
                  required
                  type="tel"
                  placeholder="0812-xxxx-xxxx"
                  className="h-14 bg-slate-900 border-slate-800 rounded-2xl text-base font-bold"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Detail Peminjaman */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-400 mb-2">
               <ClipboardList className="w-5 h-5" />
               <span className="text-xs font-black uppercase tracking-widest">Detail Peminjaman Barang</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kebutuhan Bahan</label>
                <Input 
                  required
                  placeholder="Jenis bahan yang dipinjam..."
                  className="h-14 bg-slate-900 border-slate-800 rounded-2xl text-base font-bold"
                  value={formData.materialNeeds}
                  onChange={e => setFormData({...formData, materialNeeds: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Jumlah</label>
                <Input 
                  required
                  placeholder="Jumlah barang..."
                  className="h-14 bg-slate-900 border-slate-800 rounded-2xl text-base font-bold"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tanggal dan Jam Ambil</label>
                <div className="relative">
                  <Input 
                    required
                    type="datetime-local"
                    className="h-14 bg-slate-900 border-slate-800 rounded-2xl text-base font-bold pl-12 pr-4 text-slate-200 [color-scheme:dark]"
                    value={formData.pickupDateTime}
                    onChange={e => setFormData({...formData, pickupDateTime: e.target.value})}
                  />
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Button 
              type="submit" 
              className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-sm tracking-widest rounded-3xl shadow-2xl shadow-emerald-600/20 active:scale-95 transition-all"
            >
              Kirim Pengajuan Peminjaman
            </Button>
          </div>

        </form>

        <footer className="mt-20 pb-10 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">
          Powering Robotics Excellence — RoboEdu Logistics
        </footer>
      </div>
    </div>
  );
}


