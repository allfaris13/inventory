import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  CheckCircle2, 
  ChevronRight, 
  User, 
  ClipboardList, 
  Package 
} from 'lucide-react';

export function PinjamForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    institution: '',
    pic: '',
    phone: '',
    purpose: '',
    items: [] as string[]
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock items available for borrowing
  const availableItems = [
    "Saklar On/Off Mini",
    "Kabel Jumper AWG24",
    "Saklar Terakit",
    "Sensor Ultra Sonic",
    "Motor Servo SM-200",
    "Baterai Li-Po 2200mAh"
  ];

  const toggleItem = (item: string) => {
    if (formData.items.includes(item)) {
      setFormData({ ...formData, items: formData.items.filter(i => i !== item) });
    } else {
      setFormData({ ...formData, items: [...formData.items, item] });
    }
  };

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

      <div className="relative max-w-lg mx-auto p-6 pt-12">
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

        {/* Form Steps */}
        <div className="flex gap-2 mb-8">
           <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
           <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
           <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 3 ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          
          {step === 1 && (
            <div className="space-y-6">
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-indigo-400 mb-2">
                     <Building2 className="w-5 h-5" />
                     <span className="text-xs font-black uppercase tracking-widest">Data Institusi</span>
                  </div>
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
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tujuan Peminjaman</label>
                    <textarea 
                      required
                      placeholder="Contoh: Pelatihan Robotik Nasional"
                      className="w-full min-h-[120px] bg-slate-900 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none text-base font-medium placeholder:text-slate-600"
                      value={formData.purpose}
                      onChange={e => setFormData({...formData, purpose: e.target.value})}
                    />
                  </div>
               </div>
               <Button 
                type="button" 
                onClick={() => setStep(2)}
                disabled={!formData.institution || !formData.purpose}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 group"
               >
                 Lanjutkan
                 <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-indigo-400 mb-2">
                     <User className="w-5 h-5" />
                     <span className="text-xs font-black uppercase tracking-widest">Identitas Penanggung Jawab</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
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
               <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-14 border-slate-800 text-slate-400 rounded-2xl font-bold"
                  >
                    Kembali
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setStep(3)}
                    disabled={!formData.pic || !formData.phone}
                    className="flex-[2] h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20"
                  >
                    Lanjutkan
                  </Button>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-indigo-400 mb-2">
                     <ClipboardList className="w-5 h-5" />
                     <span className="text-xs font-black uppercase tracking-widest">Pilih Barang yang Dibutuhkan</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                     {availableItems.map(item => (
                       <div 
                        key={item}
                        onClick={() => toggleItem(item)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          formData.items.includes(item) 
                          ? 'bg-indigo-600/10 border-indigo-500 text-white' 
                          : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                       >
                         <span className="text-sm font-bold">{item}</span>
                         {formData.items.includes(item) && <CheckCircle2 size={18} className="text-indigo-400" />}
                       </div>
                     ))}
                  </div>
               </div>
               <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1 h-14 border-slate-800 text-slate-400 rounded-2xl font-bold"
                  >
                    Kembali
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={formData.items.length === 0}
                    className="flex-[2] h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-emerald-600/20"
                  >
                    Kirim Pengajuan
                  </Button>
               </div>
            </div>
          )}

        </form>

        <footer className="mt-20 pb-10 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">
          Powering Robotics Excellence — RoboEdu Logistics
        </footer>
      </div>
    </div>
  );
}

// Minimal Building2 icon if lucide doesn't have it in this version
function Building2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  )
}
