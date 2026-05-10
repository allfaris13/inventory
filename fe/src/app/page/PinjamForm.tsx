import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  CheckCircle2, 
  User, 
  ClipboardList, 
  Clock,
  Building2
} from 'lucide-react';
import { RoboLogo } from '../components/ui/RoboLogo';

export function PinjamForm() {
  const [formData, setFormData] = useState({
    institution: '',
    pic: '',
    phone: '',
    purpose: '',
    jenjang: '',
    materialNeeds: '',
    quantity: '',
    pickupDateTime: '',
    borrowerType: 'pengajar'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      institution: formData.institution,
      pic: formData.pic,
      phone: formData.phone,
      purpose: formData.purpose,
      jenjang: formData.jenjang,
      material_needs: formData.materialNeeds,
      quantity: formData.quantity,
      pickup_datetime: formData.pickupDateTime,
      borrower_type: formData.borrowerType
    };

    try {
      const res = await fetch('/api/borrowing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="animate-in zoom-in-95 duration-500 relative z-10">
           <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <CheckCircle2 className="text-emerald-600 w-12 h-12" />
           </div>
           <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic">Berhasil Terkirim</h1>
           <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
             Terima kasih **{formData.pic}**. Pengajuan peminjaman untuk **{formData.institution}** telah kami terima. Tim Logistik RoboEdu akan segera menghubungi Anda.
           </p>
           <Button 
            onClick={() => window.location.reload()}
            className="mt-10 bg-slate-900 hover:bg-slate-800 text-white border-none shadow-xl rounded-2xl px-8 h-12 font-bold"
           >
             Tutup
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
      {/* Tiled Watermark Pattern like BCA */}
      <div 
        className="fixed inset-0 pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='140' height='140' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.08' transform='rotate(-30, 90, 90)' fill='%233b82f6'%3E%3Cpath d='M95 28C92 25 93 20 97 18C101 16 106 18 107 22C108 26 104 29 101 27' stroke='%233b82f6' stroke-width='3'/%3E%3Cpath d='M40 115C60 120 100 118 122 112L110 38C85 32 60 35 45 45L40 115Z'/%3E%3Cpath d='M122 112L138 125L120 45L110 38L122 112Z' opacity='0.4'/%3E%3Cpath d='M65 120V150C65 162 95 162 95 150V120H65Z'/%3E%3Cpath d='M102 135C102 135 115 132 120 140C125 148 115 155 105 150'/%3E%3Cellipse cx='60' cy='78' rx='4' ry='8' fill='%23ffffff'/%3E%3Cellipse cx='85' cy='76' rx='4' ry='8' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '140px 140px',
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Subtle Background Gradients for Light Mode */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-100/50 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto p-6 pt-12 pb-20">
        {/* Header Form */}
        <div className="mb-12 text-center">
          <div className="flex flex-col items-center justify-center gap-3 mb-4">
             <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20 p-4 transition-transform hover:scale-105 cursor-pointer">
                <RoboLogo className="text-white w-full h-full" />
             </div>
             <h2 className="text-3xl font-black uppercase tracking-tighter italic text-indigo-600">RoboEdu</h2>
          </div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-widest">Form Peminjaman Barang</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Silakan lengkapi berkas untuk kebutuhan lembaga pembelajaran</p>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 animate-in slide-in-from-bottom-6 duration-700 bg-white/60 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
          
          {/* Section 1: Data Institusi */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
               <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
               </div>
               <span className="text-xs font-black uppercase tracking-widest">Data Institusi</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Sekolah / Lembaga</label>
                <Input 
                  required
                  placeholder="Contoh: SMA Negeri 1 Jakarta"
                  className="h-14 bg-slate-50/80 border-slate-200 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all"
                  value={formData.institution}
                  onChange={e => setFormData({...formData, institution: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Jenjang</label>
                <Input 
                  required
                  placeholder="Contoh: Beginner / Basic / Tema"
                  className="h-14 bg-slate-50/80 border-slate-200 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 focus-visible:ring-indigo-500 transition-all"
                  value={formData.jenjang}
                  onChange={e => setFormData({...formData, jenjang: e.target.value})}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tujuan Peminjaman</label>
                <textarea 
                  required
                  placeholder="Jelaskan keperluan peminjaman barang Anda secara rinci..."
                  className="w-full min-h-[100px] bg-slate-50/80 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none text-base font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                  value={formData.purpose}
                  onChange={e => setFormData({...formData, purpose: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Identitas Peminjam */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
               <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <User className="w-4 h-4" />
               </div>
               <span className="text-xs font-black uppercase tracking-widest">Identitas Peminjam</span>
            </div>

            {/* Selector Tipe Peminjam */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Tipe Peminjam</label>
              <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, borrowerType: 'pengajar'})}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                    formData.borrowerType === 'pengajar'
                      ? 'bg-white text-indigo-600 shadow-md scale-105'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  Pengajar
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, borrowerType: 'teknisi'})}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                    formData.borrowerType === 'teknisi'
                      ? 'bg-white text-indigo-600 shadow-md scale-105'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  Teknisi
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Nama {formData.borrowerType === 'pengajar' ? 'Pengajar' : 'Teknisi'}
                </label>
                <Input 
                  required
                  placeholder={formData.borrowerType === 'pengajar' ? 'Contoh: Budi Sudarsono' : 'Contoh: Hendra Wijaya'}
                  className="h-14 bg-slate-50/80 border-slate-200 rounded-2xl text-slate-900 font-bold transition-all"
                  value={formData.pic}
                  onChange={e => setFormData({...formData, pic: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nomor WhatsApp Aktif</label>
                <Input 
                  required
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  maxLength={13}
                  className="h-14 bg-slate-50/80 border-slate-200 rounded-2xl text-slate-900 font-bold font-mono"
                  value={formData.phone}
                  onChange={e => {
                    // Hanya mengizinkan angka dan maksimal 13 karakter
                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 13);
                    setFormData({...formData, phone: val});
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Detail Peminjaman */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
               <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4" />
               </div>
               <span className="text-xs font-black uppercase tracking-widest">Daftar Barang</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Komponen / Alat</label>
                <Input 
                  required
                  placeholder="Contoh: Motor DC, LDR, Arduino Uno"
                  className="h-14 bg-slate-50/80 border-slate-200 rounded-2xl text-slate-900 font-bold transition-all"
                  value={formData.materialNeeds}
                  onChange={e => setFormData({...formData, materialNeeds: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kuantitas Total</label>
                <Input 
                  required
                  placeholder="Contoh: 5 Pcs / 2 Unit"
                  className="h-14 bg-slate-50/80 border-slate-200 rounded-2xl text-slate-900 font-bold"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Rencana Waktu Pengambilan</label>
                <div className="relative">
                  <Input 
                    required
                    type="datetime-local"
                    className="h-14 bg-slate-50/80 border-slate-200 rounded-2xl text-slate-900 font-bold pl-12 pr-4 transition-all"
                    value={formData.pickupDateTime}
                    onChange={e => setFormData({...formData, pickupDateTime: e.target.value})}
                  />
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button 
              type="submit" 
              className="w-full h-16 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-black uppercase text-sm tracking-widest rounded-2xl shadow-2xl shadow-white-600/20 active:scale-[0.98] transition-all border-none"
            >
              Kirim Data Peminjaman
            </Button>
          </div>

        </form>


      </div>
    </div>
  );
}
