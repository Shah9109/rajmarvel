import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import {
  FileText, CreditCard, Clock, CheckCircle,
  MessageCircle, PlusCircle, LogOut, Home,
  FolderOpen, X, User, ChevronRight, Phone, MapPin, IndianRupee
} from 'lucide-react';

const ADMIN_WHATSAPP = '919876543210'; // ← Replace with real admin WhatsApp number

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

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'projects');

  // Sync tab when URL param changes (from bottom nav)
  useEffect(() => {
    const t = searchParams.get('tab');
    if (t) setTab(t);
  }, [searchParams]);
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [requestForm, setRequestForm] = useState({
    title: '', description: '', personName: '', address: '', phone: '', agreedAmount: ''
  });
  const [payForm, setPayForm] = useState({ amount: '', method: 'upi', transactionId: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: projs } = await api.get('/projects/user');
      setProjects(projs);

      if (projs.length > 0) {
        // Fetch payments and bills for ALL projects
        const allPayments = [];
        const allBills = [];
        await Promise.all(projs.map(async (proj) => {
          try {
            const [pRes, bRes] = await Promise.all([
              api.get(`/payments/${proj._id}`),
              api.get(`/bills/${proj._id}`)
            ]);
            allPayments.push(...pRes.data);
            allBills.push(...bRes.data);
          } catch (err) {
            console.error(`Error fetching data for project ${proj._id}`, err);
          }
        }));
        // Sort by latest first
        setPayments(allPayments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setBills(allBills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // Re-fetch whenever user opens Bills or Payments tab to get fresh admin-generated data
  useEffect(() => {
    if (tab === 'bills' || tab === 'payments') {
      fetchData();
    }
  }, [tab]);

  // Download bill PDF with Bearer token authentication
  const handleDownloadBill = async (billId, shortId) => {
    try {
      const response = await api.get(`/bills/${billId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `RajMarvel-Invoice-${shortId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download. Please try again.');
    }
  };

  const handleRequest = async (e) => {

    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/projects/book', { ...requestForm, description: requestForm.description || 'Project Request' });
      setShowRequestModal(false);
      setRequestForm({ title: '', description: '', personName: '', address: '', phone: '', agreedAmount: '' });
      fetchData();
      alert('Project request submitted! We will contact you soon.');
    } catch { alert('Failed to submit request.'); }
    finally { setSubmitting(false); }
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/payments', {
        projectId: selectedProject._id,
        amount: payForm.amount,
        method: payForm.method,
        transactionId: payForm.transactionId
      });
      setShowPayModal(false);
      setPayForm({ amount: '', method: 'upi', transactionId: '' });
      fetchData();
      alert('Payment submitted for approval!');
    } catch { alert('Failed to submit payment.'); }
    finally { setSubmitting(false); }
  };

  const whatsappLink = (project, amount, txId) =>
    `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(`Hi, I made a payment of ₹${amount} for project "${project?.title}". Transaction ID: ${txId}. Please find the screenshot attached.`)}`;

  const steps = ['pending', 'planning', 'in_progress', 'completed'];

  const navItems = [
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'bills', label: 'Bills', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent flex flex-col md:flex-row">

      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden md:flex w-64 bg-secondary text-white flex-col shadow-xl">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Raj Marvel</h2>
          <p className="text-gray-400 text-xs mt-1">{user?.name}</p>
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
          <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-800 rounded-lg text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {tab === 'projects' && 'My Projects'}
              {tab === 'payments' && 'Payment History'}
              {tab === 'bills' && 'Bills & Invoices'}
              {tab === 'profile' && 'My Profile'}
            </h1>
          </div>
          {tab === 'projects' && (
            <button onClick={() => setShowRequestModal(true)}
              className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              <PlusCircle size={16} /> Request Project
            </button>
          )}
        </div>

        {/* ── PROJECTS TAB ── */}
        {tab === 'projects' && (
          <div className="space-y-5">
            {projects.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <Home size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Projects Yet</h3>
                <p className="text-gray-500 text-sm mb-5">Submit your first project request to get started.</p>
                <button onClick={() => setShowRequestModal(true)}
                  className="bg-primary text-white px-6 py-2.5 rounded-xl hover:bg-red-700 font-medium text-sm">
                  Request Project
                </button>
              </div>
            ) : projects.map((p) => (
              <div key={p._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{p.title}</h2>
                      {p.personName && (
                        <div className="flex flex-wrap gap-x-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><User size={11}/> {p.personName}</span>
                          <span className="flex items-center gap-1"><Phone size={11}/> {p.phone}</span>
                          {p.address && <span className="flex items-center gap-1"><MapPin size={11}/> {p.address}</span>}
                        </div>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${statusColor(p.status)}`}>
                      {p.status?.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center mb-5 overflow-x-auto">
                    {steps.map((step, idx) => {
                      const currentIdx = steps.indexOf(p.status);
                      const done = idx <= currentIdx;
                      return (
                        <div key={step} className="flex items-center flex-shrink-0">
                          <div className="flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                              ${done ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                              {done ? <CheckCircle size={14} /> : idx + 1}
                            </div>
                            <span className={`mt-1 text-[9px] font-semibold uppercase whitespace-nowrap
                              ${done ? 'text-primary' : 'text-gray-400'}`}>
                              {step.replace('_', ' ')}
                            </span>
                          </div>
                          {idx < steps.length - 1 && (
                            <div className={`h-0.5 w-8 md:w-14 mx-1 ${idx < currentIdx ? 'bg-primary' : 'bg-gray-200'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Progress */}
                  <div className="mb-5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-600">Project Progress</span>
                      <span className="font-bold text-primary">{p.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full transition-all duration-700"
                        style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-transparent p-3 rounded-xl border border-gray-100 text-center">
                      <p className="text-xs text-gray-500">Agreed</p>
                      <p className="font-bold text-gray-800 text-sm">₹{(p.agreedAmount || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-xl border border-green-100 text-center">
                      <p className="text-xs text-green-600">Paid</p>
                      <p className="font-bold text-green-800 text-sm">₹{p.amountPaid.toLocaleString()}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 text-center">
                      <p className="text-xs text-orange-600">Remaining</p>
                      <p className="font-bold text-orange-800 text-sm">₹{p.remainingAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {p.remainingAmount > 0 && (
                    <button onClick={() => { setSelectedProject(p); setShowPayModal(true); }}
                      className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <IndianRupee size={15} /> Pay Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PAYMENTS TAB ── */}
        {tab === 'payments' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {payments.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <CreditCard size={40} className="mx-auto mb-3 text-gray-300" />
                <p>No payments recorded yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {payments.map(pay => (
                  <div key={pay._id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-bold text-gray-900">₹{pay.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(pay.createdAt).toLocaleDateString('en-IN')} · {pay.method?.replace('_', ' ')}
                        {pay.transactionId && ` · ${pay.transactionId}`}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      pay.status === 'completed' ? 'bg-green-100 text-green-700' :
                      pay.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {pay.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BILLS TAB ── */}
        {tab === 'bills' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-sm">Bills & Invoices</h2>
              <button onClick={fetchData}
                className="flex items-center gap-1.5 text-xs text-primary font-semibold bg-red-50 px-3 py-1.5 rounded-lg hover:bg-pink-100 transition-colors">
                🔄 Refresh
              </button>
            </div>
            {bills.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <FileText size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No bills available yet.</p>
                <p className="text-xs mt-1 text-gray-300">Bills generated by admin will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {bills.map(bill => (
                  <div key={bill._id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-bold text-gray-900">Invoice #{bill._id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(bill.createdAt).toLocaleDateString('en-IN')} · ₹{bill.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">{bill.items?.length} item{bill.items?.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button
                      onClick={() => handleDownloadBill(bill._id, bill._id.slice(-8).toUpperCase())}
                      className="flex items-center gap-1.5 text-primary text-sm font-medium bg-red-50 px-3 py-1.5 rounded-lg hover:bg-pink-100 transition-colors whitespace-nowrap">
                      <FileText size={14} /> Download PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {tab === 'profile' && (
          <div className="space-y-4 max-w-lg">
            {/* Avatar Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-[#fbcfe8] flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-3xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-pink-100 text-red-700 text-xs font-bold rounded-full uppercase">
                {user?.role}
              </span>
            </div>

            {/* Info Cards */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {[
                { label: 'Full Name', value: user?.name, icon: User },
                { label: 'Email Address', value: user?.email, icon: MessageCircle },
                { label: 'Total Projects', value: projects.length, icon: FolderOpen },
                { label: 'Total Bills', value: bills.length, icon: FileText },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-primary">
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

            {/* Logout */}
            <button onClick={logout}
              className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-3.5 rounded-2xl font-semibold text-sm transition-colors border border-red-100">
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
              className={`flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors
                ${tab === id ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`p-1.5 rounded-xl transition-all ${tab === id ? 'bg-red-50' : ''}`}>
                <Icon size={20} />
              </div>
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* ─── REQUEST PROJECT MODAL ─── */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50">
          <div className="bg-white w-full md:max-w-lg md:rounded-2xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Request a Project</h3>
              <button onClick={() => setShowRequestModal(false)} className="text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
            </div>
            <form onSubmit={handleRequest} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Project Title *</label>
                <input required value={requestForm.title} onChange={e => setRequestForm({ ...requestForm, title: e.target.value })}
                  placeholder="e.g. Front Elevation Marble Work"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Your Name *</label>
                  <input required value={requestForm.personName} onChange={e => setRequestForm({ ...requestForm, personName: e.target.value })}
                    placeholder="Full name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Phone *</label>
                  <input required value={requestForm.phone} onChange={e => setRequestForm({ ...requestForm, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Site Address *</label>
                <input required value={requestForm.address} onChange={e => setRequestForm({ ...requestForm, address: e.target.value })}
                  placeholder="Full address of the project site"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Agreed Amount (₹) *</label>
                <input required type="number" value={requestForm.agreedAmount} onChange={e => setRequestForm({ ...requestForm, agreedAmount: e.target.value })}
                  placeholder="e.g. 250000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea rows={2} value={requestForm.description} onChange={e => setRequestForm({ ...requestForm, description: e.target.value })}
                  placeholder="Any specific requirements..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm">Cancel</button>
                <button type="submit" disabled={submitting}
                  className={`flex-1 py-3 bg-primary text-white rounded-xl font-semibold text-sm ${submitting ? 'opacity-70' : 'hover:bg-red-700'}`}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── PAY MODAL ─── */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50">
          <div className="bg-white w-full md:max-w-md md:rounded-2xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Submit Payment</h3>
              <button onClick={() => setShowPayModal(false)} className="text-gray-400 p-1"><X size={20} /></button>
            </div>
            <form onSubmit={handlePaySubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Amount (₹) *</label>
                <input required type="number" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Payment Method</label>
                <select value={payForm.method} onChange={e => setPayForm({ ...payForm, method: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm">
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Transaction ID *</label>
                <input required value={payForm.transactionId} onChange={e => setPayForm({ ...payForm, transactionId: e.target.value })}
                  placeholder="UTR / Reference Number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm" />
              </div>
              <a href={whatsappLink(selectedProject, payForm.amount, payForm.transactionId)} target="_blank" rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold text-sm">
                <MessageCircle size={16} /> Send Screenshot via WhatsApp
              </a>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowPayModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm">Cancel</button>
                <button type="submit" disabled={submitting}
                  className={`flex-1 py-3 bg-primary text-white rounded-xl font-semibold text-sm ${submitting ? 'opacity-70' : 'hover:bg-red-700'}`}>
                  {submitting ? 'Submitting...' : 'Submit Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
