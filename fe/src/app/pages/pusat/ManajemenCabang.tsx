import { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Users, 
  Shield, 
  Building2, 
  Mail, 
  Lock, 
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  branch_id: number;
}

interface Branch {
  id: number;
  name: string;
  location: string;
}

export function ManajemenCabang() {
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Form state
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'admin_cabang',
    branch_id: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [uRes, bRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/branches')
      ]);
      const uData = await uRes.json();
      const bData = await bRes.json();
      setUsers(Array.isArray(uData) ? uData : []);
      setBranches(Array.isArray(bData) ? bData : []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        setMessage({ text: 'User berhasil ditambahkan!', type: 'success' });
        setIsModalOpen(false);
        fetchData();
        setNewUser({ email: '', password: '', full_name: '', role: 'admin_cabang', branch_id: 1 });
      } else {
        setMessage({ text: 'Gagal menambah user.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Terjadi kesalahan jaringan.', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const getBranchName = (id: number) => {
    return branches.find(b => b.id === id)?.name || 'Unknown';
  };

  return (
    <div className="preferences-container space-y-8 animate-in fade-in duration-500">
      <div className="preferences-header flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Manajemen Cabang</h1>
          <p className="text-xs text-muted-foreground mt-1 font-bold tracking-widest uppercase">PEMUATAN AKUN ADMIN CABANG DAN PENGATURAN AKSES WILAYAH</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white h-12 px-6 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20"
        >
          <UserPlus size={18} className="mr-2" />
          Tambah Admin Cabang
        </Button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-xs font-bold uppercase tracking-wider">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-card border-border flex items-center gap-4 rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total User</p>
            <p className="text-2xl font-black text-foreground">{users.length}</p>
          </div>
        </Card>
        <Card className="p-6 bg-card border-border flex items-center gap-4 rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Cabang</p>
            <p className="text-2xl font-black text-foreground">{branches.length}</p>
          </div>
        </Card>
        <Card className="p-6 bg-card border-border flex items-center gap-4 rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Super Admin</p>
            <p className="text-2xl font-black text-foreground">{users.filter(u => u.role === 'super_admin').length}</p>
          </div>
        </Card>
      </div>

      <Card className="border-border bg-card shadow-xl rounded-[2rem] overflow-hidden">
        <div className="p-8 border-b border-border bg-muted/10">
          <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Daftar Akun Sistem</h3>
          <p className="text-xs text-muted-foreground font-bold italic tracking-widest uppercase">Otoritas Akses Gudang Pusat & Cabang</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">User</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Lokasi Tugas</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-black">
                        {user.full_name[0]}
                      </div>
                      <p className="font-black text-sm text-foreground uppercase tracking-tight">{user.full_name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-muted-foreground">{user.email}</td>
                  <td className="px-8 py-6">
                    <Badge className={
                      user.role === 'super_admin' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                      user.role === 'prepare' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }>
                      {user.role === 'super_admin' ? 'SUPER ADMIN' : user.role === 'prepare' ? 'PREPARE' : 'ADMIN CABANG'}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <Building2 size={14} className="text-muted-foreground" />
                      {getBranchName(user.branch_id)}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Button variant="ghost" className="text-muted-foreground hover:text-rose-500 font-bold text-xs">Hapus</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Tambah User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-lg bg-card border-border shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="p-8 border-b border-border bg-muted/20 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-foreground leading-none uppercase italic">Akses Admin Cabang</h2>
                  <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mt-1">Buat Akses Baru untuk Admin Wilayah</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-muted rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Nama Lengkap</label>
                <div className="relative">
                  <Users className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                  <Input 
                    required 
                    placeholder="Masukkan nama lengkap..." 
                    className="pl-12 h-12 bg-muted/20 border-border font-bold rounded-xl"
                    value={newUser.full_name}
                    onChange={e => setNewUser({...newUser, full_name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Email Log In</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                  <Input 
                    type="email"
                    required 
                    placeholder="nama@robogudang.com" 
                    className="pl-12 h-12 bg-muted/20 border-border font-bold rounded-xl"
                    value={newUser.email}
                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Password Sementara</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                  <Input 
                    type="password"
                    required 
                    placeholder="••••••••" 
                    className="pl-12 h-12 bg-muted/20 border-border font-bold rounded-xl"
                    value={newUser.password}
                    onChange={e => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Role Jabatan</label>
                  <select 
                    className="w-full h-12 bg-muted/20 border border-border font-bold rounded-xl px-4 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newUser.role}
                    onChange={e => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin_cabang">Admin Cabang</option>
                    <option value="prepare">Prepare</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Penempatan</label>
                  <select 
                    className="w-full h-12 bg-muted/20 border border-border font-bold rounded-xl px-4 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newUser.branch_id}
                    onChange={e => setNewUser({...newUser, branch_id: parseInt(e.target.value)})}
                  >
                    <option value={0} disabled>-- Pilih Cabang --</option>
                    {Array.isArray(branches) && branches.length > 0 ? (
                      branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))
                    ) : (
                      <option disabled>Data kosong / Server offline</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-14 border-border text-muted-foreground font-black uppercase text-[10px] tracking-widest hover:bg-muted rounded-2xl"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  {loading ? 'Menyimpan...' : 'Buat Akun'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
