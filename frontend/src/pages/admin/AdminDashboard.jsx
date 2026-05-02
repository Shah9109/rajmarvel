import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import {
  LayoutDashboard, FolderKanban, CreditCard, LogOut,
  DollarSign, Users, CheckCircle, XCircle, FileText,
  Plus, TrendingUp, Clock, X, Trash2, User, ChevronRight, MessageCircle
} from 'lucide-react';

const statusColor = (s) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-700',
    planning: 'bg-pink-100 text-red-700',
    in_progress: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    on_hold: 'bg-gray-100 text-gray-600'
  };
  return map[s] || 'bg-gray-100 text-gray-600';
};

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'overview');

  // Sync tab when URL param changes (from bottom nav)
  useEffect(() => {
    const t = searchParams.get('tab');
    if (t) setTab(t);
  }, [searchParams]);
  const [stats, setStats] = useState({ totalProjects: 0, activeProjects: 0, pendingProjects: 0, totalRevenue: 0 });
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showBillModal, setShowBillModal] = useState(false);
  const [billProjectId, setBillProjectId] = useState(null);
  const [billItems, setBillItems] = useState([{ name: '', quantity: 1, price: 0 }]);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, projRes, payRes] = await Promise.all([
        api.get('/projects/stats'),
        api.get('/projects/all'),
        api.get('/payments'),
      ]);
      setStats(statsRes.data);
      setProjects(projRes.data);
      setPayments(payRes.data);
    } catch (e) { console.error('Admin fetch error', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const updateProject = async (id, updates) => {
    try { await api.put(`/projects/${id}`, updates); fetchData(); }
    catch { alert('Failed to update project'); }
  };

  const updatePayment = async (id, status) => {
    try { await api.put(`/payments/${id}/status`, { status }); fetchData(); }
    catch { alert('Failed to update payment'); }
  };

  const openBillModal = (projectId) => {
    setBillProjectId(projectId);
    setBillItems([{ name: '', quantity: 1, price: 0 }]);
    setShowBillModal(true);
  };

  const handleBillChange = (idx, field, val) => {
    const updated = [...billItems];
    updated[idx][field] = field === 'name' ? val : Number(val);
    setBillItems(updated);
  };

  const billTotal = billItems.reduce((acc, i) => acc + i.quantity * i.price, 0);

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      await api.post('/bills', { projectId: billProjectId, items: billItems, totalAmount: billTotal });
      setShowBillModal(false);
      alert('Bill generated successfully!');
    } catch { alert('Failed to generate bill'); }
    finally { setIsGenerating(false); }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500">Loading admin panel...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent flex flex-col md:flex-row">

      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden md:flex w-64 bg-secondary text-white flex-col shadow-xl">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-gray-400 text-sm mt-1">{user?.name}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${tab === id ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg text-sm">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        <div className="mb-5">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {tab === 'overview' && 'Dashboard Overview'}
            {tab === 'projects' && 'All Projects'}
            {tab === 'payments' && 'Manage Payments'}
            {tab === 'profile' && 'Admin Profile'}
          </h1>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, bg: 'bg-green-100', text: 'text-green-700' },
                { label: 'Total Projects', value: stats.totalProjects, icon: FolderKanban, bg: 'bg-pink-100', text: 'text-red-700' },
                { label: 'Active', value: stats.activeProjects, icon: TrendingUp, bg: 'bg-purple-100', text: 'text-purple-700' },
                { label: 'Pending', value: stats.pendingProjects, icon: Clock, bg: 'bg-orange-100', text: 'text-orange-700' },
              ].map(({ label, value, icon: Icon, bg, text }) => (
                <div key={label} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className={`w-10 h-10 rounded-xl ${bg} ${text} flex items-center justify-center mb-3`}>
                    <Icon size={20} />
                  </div>
                  <p className="text-gray-500 text-xs font-medium">{label}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
                </div>
              ))}
            </div>

            {/* Pending Bookings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">Pending Bookings</h2>
                <button onClick={() => setTab('projects')} className="text-primary text-sm">View All →</button>
              </div>
              {projects.filter(p => p.status === 'pending').length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No pending bookings</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {projects.filter(p => p.status === 'pending').map(p => (
                    <div key={p._id} className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{p.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{p.personName} · {p.phone}</p>
                          <p className="text-xs text-gray-500">{p.address}</p>
                          <p className="text-xs font-semibold text-primary mt-1">₹{(p.agreedAmount || 0).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateProject(p._id, { status: 'planning' })}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-green-100 text-green-700 py-2 rounded-lg font-semibold hover:bg-green-200">
                          <CheckCircle size={13} /> Accept
                        </button>
                        <button onClick={() => updateProject(p._id, { status: 'rejected' })}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-red-100 text-red-700 py-2 rounded-lg font-semibold hover:bg-red-200">
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PROJECTS TAB ── */}
        {tab === 'projects' && (
          <div className="space-y-4">
            {projects.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-400">No projects yet.</div>
            )}
            {projects.map(p => (
              <div key={p._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{p.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{p.userId?.name} · {p.personName} · {p.phone}</p>
                      {p.address && <p className="text-xs text-gray-400">📍 {p.address}</p>}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${statusColor(p.status)}`}>
                      {p.status?.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Financial Summary */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="bg-transparent p-2 rounded-lg">
                      <p className="text-xs text-gray-400">Agreed</p>
                      <p className="text-xs font-bold text-gray-700">₹{(p.agreedAmount||0).toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg">
                      <p className="text-xs text-green-500">Paid</p>
                      <p className="text-xs font-bold text-green-700">₹{p.amountPaid.toLocaleString()}</p>
                    </div>
                    <div className="bg-orange-50 p-2 rounded-lg">
                      <p className="text-xs text-orange-500">Due</p>
                      <p className="text-xs font-bold text-orange-700">₹{p.remainingAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-bold text-primary">{p.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-[120px]">
                      <label className="text-xs text-gray-400 block mb-1">Status</label>
                      <select value={p.status} onChange={e => updateProject(p._id, { status: e.target.value })}
                        className="w-full text-sm border border-gray-200 rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-primary bg-white">
                        <option value="pending">Pending</option>
                        <option value="planning">Planning</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Progress %</label>
                      <input type="number" min="0" max="100" defaultValue={p.progress}
                        onBlur={e => updateProject(p._id, { progress: Number(e.target.value) })}
                        className="w-20 text-sm border border-gray-200 rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <button onClick={() => openBillModal(p._id)}
                      className="flex items-center gap-1.5 bg-primary hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors">
                      <FileText size={14} /> Generate Bill
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PAYMENTS TAB ── */}
        {tab === 'payments' && (
          <div className="space-y-3">
            {payments.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-400">No payments yet.</div>
            ) : payments.map(pay => (
              <div key={pay._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{pay.projectId?.title || '—'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {pay.userId?.name || '—'} · {pay.method?.replace('_', ' ')}
                      {pay.transactionId && ` · ${pay.transactionId}`}
                    </p>
                    <p className="text-lg font-bold text-red-700 mt-1">₹{pay.amount.toLocaleString()}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase flex-shrink-0 ${
                    pay.status === 'completed' ? 'bg-green-100 text-green-700' :
                    pay.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {pay.status}
                  </span>
                </div>
                {pay.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => updatePayment(pay._id, 'completed')}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-green-100 text-green-700 py-2 rounded-lg font-semibold hover:bg-green-200">
                      <CheckCircle size={15} /> Confirm
                    </button>
                    <button onClick={() => updatePayment(pay._id, 'failed')}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-red-100 text-red-700 py-2 rounded-lg font-semibold hover:bg-red-200">
                      <XCircle size={15} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {tab === 'profile' && (
          <div className="space-y-4 max-w-lg">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-[#fbcfe8] flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-3xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase">
                Administrator
              </span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {[
                { label: 'Full Name', value: user?.name, icon: User },
                { label: 'Email Address', value: user?.email, icon: MessageCircle },
                { label: 'Total Projects', value: projects.length, icon: FolderKanban },
                { label: 'Pending Bookings', value: projects.filter(p => p.status === 'pending').length, icon: Clock },
                { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                      <Icon size={17} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="text-sm font-semibold text-gray-900">{value}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              ))}
            </div>

            <button onClick={logout}
              className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-3.5 rounded-2xl font-semibold text-sm border border-red-100">
              <LogOut size={17} /> Logout
            </button>
          </div>
        )}
      </main>

      {/* ─── Mobile Bottom Navigation ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40">
        <div className="grid grid-cols-4 h-16">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors
                ${tab === id ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`p-1.5 rounded-xl transition-all ${tab === id ? 'bg-red-50' : ''}`}>
                <Icon size={20} />
              </div>
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* ─── BILL MODAL ─── */}
      {showBillModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50">
          <div className="bg-white w-full md:max-w-2xl md:rounded-2xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Generate Bill / Invoice</h3>
              <button onClick={() => setShowBillModal(false)} className="text-gray-400 p-1"><X size={20} /></button>
            </div>
            <form onSubmit={handleGenerateBill} className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase px-1">
                  <span className="col-span-5">Item Name</span>
                  <span className="col-span-2 text-center">Qty</span>
                  <span className="col-span-3 text-center">Price (₹)</span>
                  <span className="col-span-2 text-right">Total</span>
                </div>
                {billItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <input required type="text" value={item.name}
                      onChange={e => handleBillChange(idx, 'name', e.target.value)}
                      placeholder="e.g. Marble, Labour"
                      className="col-span-5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
                    <input required type="number" min="1" value={item.quantity}
                      onChange={e => handleBillChange(idx, 'quantity', e.target.value)}
                      className="col-span-2 px-2 py-2.5 border border-gray-200 rounded-xl text-sm text-center outline-none focus:ring-2 focus:ring-primary" />
                    <input required type="number" min="0" value={item.price}
                      onChange={e => handleBillChange(idx, 'price', e.target.value)}
                      className="col-span-3 px-2 py-2.5 border border-gray-200 rounded-xl text-sm text-center outline-none focus:ring-2 focus:ring-primary" />
                    <div className="col-span-2 flex items-center justify-end gap-1">
                      <span className="text-sm font-semibold text-gray-600">{(item.quantity * item.price).toLocaleString()}</span>
                      {idx > 0 && (
                        <button type="button" onClick={() => setBillItems(billItems.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-600 ml-1"><Trash2 size={14} /></button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => setBillItems([...billItems, { name: '', quantity: 1, price: 0 }])}
                className="flex items-center gap-1.5 text-primary text-sm font-medium">
                <Plus size={15} /> Add Line Item
              </button>

              <div className="flex items-center justify-between bg-red-50 p-4 rounded-xl border border-red-100">
                <span className="font-bold text-gray-700">Grand Total:</span>
                <span className="text-2xl font-bold text-red-700">₹{billTotal.toLocaleString()}</span>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowBillModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm">Cancel</button>
                <button type="submit" disabled={isGenerating}
                  className={`flex-1 py-3 bg-primary text-white rounded-xl font-semibold text-sm ${isGenerating ? 'opacity-70' : 'hover:bg-red-700'}`}>
                  {isGenerating ? 'Generating...' : 'Generate & Save Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
