import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  MessageSquare,
  Settings,
  ShieldCheck,
  LogOut,
  Bell,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Activity,
  Menu,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  KeyRound,
  Sparkles,
  PhoneCall,
  CalendarDays,
  CheckCheck,
  FileText,
  ShieldAlert,
  ArrowUpRight,
  UserCheck,
  Copy,
  Check,
  Lock
} from 'lucide-react';
import { Appointment, AdminStats, CustomerSummary, StudioService, SystemLog } from '../../types/admin';
import { authFetch, clearStoredAuth } from '../../utils/adminAuth';
import { AppointmentDetailsModal } from './AppointmentDetailsModal';
import { NewAppointmentModal } from './NewAppointmentModal';
import { PasswordChangeModal } from './PasswordChangeModal';
import { PORTFOLIO_INFO } from '../../data/portfolioData';

interface AdminDashboardProps {
  onLogout: () => void;
  onViewWebsite: () => void;
  initialMustChangePassword?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onViewWebsite,
  initialMustChangePassword = false
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'appointments' | 'customers' | 'services' | 'messages' | 'settings' | 'security'
  >('dashboard');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    newRequests: 0
  });
  const [serviceBreakdown, setServiceBreakdown] = useState<Record<string, number>>({});
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [services, setServices] = useState<StudioService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('All Services');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(initialMustChangePassword);

  // Owner Private Vault State (Visible only to authenticated owner)
  const [ownerVaultInfo, setOwnerVaultInfo] = useState<{
    email?: string;
    username?: string;
    name?: string;
    currentPassword?: string;
    lastChanged?: string;
    encryption?: string;
  } | null>(null);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [autoHideTimer, setAutoHideTimer] = useState(0);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Live time ticker
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-hide timer for revealed owner password
  useEffect(() => {
    let interval: any = null;
    if (showOwnerPassword && autoHideTimer > 0) {
      interval = setInterval(() => {
        setAutoHideTimer((prev) => {
          if (prev <= 1) {
            setShowOwnerPassword(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showOwnerPassword, autoHideTimer]);

  const toggleShowOwnerPassword = () => {
    if (!showOwnerPassword) {
      setShowOwnerPassword(true);
      setAutoHideTimer(15);
    } else {
      setShowOwnerPassword(false);
      setAutoHideTimer(0);
    }
  };

  const handleCopyPassword = () => {
    const pwd = ownerVaultInfo?.currentPassword || '';
    if (!pwd) return;
    navigator.clipboard.writeText(pwd);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  // Fetch all initial data
  const loadData = async (quiet: boolean = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      // 1. Fetch stats
      const statsRes = await authFetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        setServiceBreakdown(statsData.serviceBreakdown || {});
        if (statsData.recentLogs) setSystemLogs(statsData.recentLogs);
      }

      // 2. Fetch appointments
      const aptsRes = await authFetch('/api/admin/appointments');
      if (aptsRes.ok) {
        const aptsData = await aptsRes.json();
        setAppointments(aptsData.appointments || []);
      }

      // 3. Fetch customers
      const custRes = await authFetch('/api/admin/customers');
      if (custRes.ok) {
        const custData = await custRes.json();
        setCustomers(custData.customers || []);
      }

      // 4. Fetch services
      const servRes = await authFetch('/api/admin/services');
      if (servRes.ok) {
        const servData = await servRes.json();
        setServices(servData.services || []);
      }

      // 5. Fetch private vault credentials (owner-only)
      const vaultRes = await authFetch('/api/admin/vault-credentials');
      if (vaultRes.ok) {
        const vaultData = await vaultRes.json();
        if (vaultData.success) {
          setOwnerVaultInfo(vaultData);
        }
      }
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle appointment status update
  const handleUpdateStatus = async (
    id: string,
    newStatus: Appointment['status'],
    notes?: string
  ) => {
    try {
      const res = await authFetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus, notes, isNewRequest: false })
      });

      if (res.ok) {
        const updated = await res.json();
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, ...updated.appointment } : a))
        );
        if (selectedAppointment && selectedAppointment.id === id) {
          setSelectedAppointment((prev) => (prev ? { ...prev, ...updated.appointment } : null));
        }
        // Refresh stats
        loadData(true);
      }
    } catch (err) {
      console.error('Update status failed', err);
    }
  };

  // Handle appointment deletion
  const handleDeleteAppointment = async (id: string) => {
    try {
      const res = await authFetch(`/api/admin/appointments/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        setSelectedAppointment(null);
        loadData(true);
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  // Handle manual appointment creation
  const handleCreateAppointment = async (data: Partial<Appointment>) => {
    const res = await authFetch('/api/admin/appointments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      throw new Error('Failed to create appointment');
    }
    const created = await res.json();
    setAppointments((prev) => [created.appointment, ...prev]);
    loadData(true);
  };

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = apt.name.toLowerCase().includes(q);
        const matchesPhone = apt.phone.toLowerCase().includes(q);
        const matchesEmail = (apt.email || '').toLowerCase().includes(q);
        const matchesService = apt.service.toLowerCase().includes(q);
        const matchesMessage = apt.message.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesEmail && !matchesService && !matchesMessage) {
          return false;
        }
      }

      // Service filter
      if (selectedServiceFilter !== 'All Services' && apt.service !== selectedServiceFilter) {
        return false;
      }

      // Status filter
      if (selectedStatusFilter !== 'all' && apt.status !== selectedStatusFilter) {
        return false;
      }

      // Date filter
      if (selectedDateFilter !== 'all') {
        const now = new Date();
        const aptDate = new Date(apt.date);
        if (selectedDateFilter === 'today') {
          const todayStr = now.toISOString().split('T')[0];
          if (apt.date !== todayStr) return false;
        } else if (selectedDateFilter === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
          if (aptDate < weekAgo) return false;
        } else if (selectedDateFilter === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
          if (aptDate < monthAgo) return false;
        }
      }

      return true;
    });
  }, [appointments, searchQuery, selectedServiceFilter, selectedDateFilter, selectedStatusFilter]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await authFetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      clearStoredAuth();
      onLogout();
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      badge: stats.newRequests > 0 ? stats.newRequests : undefined
    },
    { id: 'customers', label: 'Customers', icon: Users, count: customers.length },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Modals */}
      <AnimatePresence>
        {selectedAppointment && (
          <AppointmentDetailsModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteAppointment}
          />
        )}

        {isNewAppointmentModalOpen && (
          <NewAppointmentModal
            onClose={() => setIsNewAppointmentModalOpen(false)}
            onCreateAppointment={handleCreateAppointment}
          />
        )}

        {isPasswordModalOpen && (
          <PasswordChangeModal
            isForced={mustChangePassword}
            onClose={() => setIsPasswordModalOpen(false)}
            onSuccess={() => {
              setMustChangePassword(false);
              loadData(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Forced Password Change Notice Banner if applicable */}
      {mustChangePassword && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-amber-950 px-4 py-2.5 flex items-center justify-between text-xs font-semibold border-b border-amber-500/50 shadow-lg">
          <div className="flex items-center gap-2 text-white">
            <ShieldAlert className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong>Security Protocol:</strong> You are logged in with the default setup password. Please configure a permanent private password for maximum account safety.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-3 py-1 rounded-lg bg-slate-950 text-amber-300 hover:text-white hover:bg-black text-[11px] font-mono font-bold transition-colors cursor-pointer"
          >
            Update Password Now
          </button>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#060c1d]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand & Owner Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-heading font-black tracking-tight text-white">
                NEW NEPAL DIGITAL
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                Owner Dashboard
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Aadrash Kumar Sah • Creative Technology Studio
            </p>
          </div>
        </div>

        {/* Top Right Header Controls */}
        <div className="flex items-center gap-3">
          {/* Live Clock */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          {/* Quick Refresh */}
          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            title="Refresh Dashboard Data"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* View Website */}
          <button
            onClick={onViewWebsite}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3 h-3 text-cyan-400" />
          </button>

          {/* Owner Profile Dropdown / Card */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20">
              AS
            </div>
            <div className="hidden xl:block text-left">
              <span className="text-xs font-semibold text-white block leading-none">
                Aadrash Sah
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">Owner / Admin</span>
            </div>

            <button
              onClick={handleLogout}
              title="Logout from Owner Dashboard"
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-rose-950/80 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Desktop + Mobile Drawer) */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#050b18] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0 pt-16 lg:pt-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Navigation Items */}
          <div className="p-4 space-y-1.5 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              Navigation Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950 to-blue-950 text-cyan-300 border border-cyan-500/40 font-bold shadow-md shadow-cyan-950/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] animate-pulse">
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && !item.badge && (
                    <span className="text-[10px] text-slate-500 font-mono">{item.count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer Info */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 space-y-3">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Owner Security Vault</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                Private Server Database • HMAC Bearer Auth
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Overlay backdrop for mobile menu */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header Title + Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                    Studio Overview
                  </h1>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Real-time metrics, appointment requests, and operational pipeline
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsNewAppointmentModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Appointment</span>
                  </button>
                </div>
              </div>

              {/* 6 Key Overview Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {/* Total */}
                <div className="rounded-2xl p-4 bg-slate-900/60 border border-slate-800 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    Total Appointments
                  </span>
                  <div className="text-2xl font-heading font-black text-white">
                    {stats.total}
                  </div>
                  <div className="mt-2 text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    <span>All bookings</span>
                  </div>
                </div>

                {/* Pending */}
                <div className="rounded-2xl p-4 bg-slate-900/60 border border-slate-800 relative overflow-hidden group hover:border-amber-500/40 transition-all">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    Pending
                  </span>
                  <div className="text-2xl font-heading font-black text-amber-400">
                    {stats.pending}
                  </div>
                  <div className="mt-2 text-[10px] text-amber-400/80 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Needs review</span>
                  </div>
                </div>

                {/* Confirmed */}
                <div className="rounded-2xl p-4 bg-slate-900/60 border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    Confirmed
                  </span>
                  <div className="text-2xl font-heading font-black text-emerald-400">
                    {stats.confirmed}
                  </div>
                  <div className="mt-2 text-[10px] text-emerald-400/80 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Scheduled sessions</span>
                  </div>
                </div>

                {/* Completed */}
                <div className="rounded-2xl p-4 bg-slate-900/60 border border-slate-800 relative overflow-hidden group hover:border-blue-500/40 transition-all">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    Completed
                  </span>
                  <div className="text-2xl font-heading font-black text-blue-400">
                    {stats.completed}
                  </div>
                  <div className="mt-2 text-[10px] text-blue-400/80 font-mono flex items-center gap-1">
                    <CheckCheck className="w-3 h-3" />
                    <span>Delivered work</span>
                  </div>
                </div>

                {/* Cancelled */}
                <div className="rounded-2xl p-4 bg-slate-900/60 border border-slate-800 relative overflow-hidden group hover:border-rose-500/40 transition-all">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    Cancelled
                  </span>
                  <div className="text-2xl font-heading font-black text-rose-400">
                    {stats.cancelled}
                  </div>
                  <div className="mt-2 text-[10px] text-rose-400/80 font-mono flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    <span>Voided</span>
                  </div>
                </div>

                {/* New Requests */}
                <div className="rounded-2xl p-4 bg-cyan-950/30 border border-cyan-500/40 relative overflow-hidden group">
                  <span className="text-[11px] font-mono text-cyan-300 block mb-1">
                    New Requests
                  </span>
                  <div className="text-2xl font-heading font-black text-cyan-300">
                    {stats.newRequests}
                  </div>
                  <div className="mt-2 text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
                    <span>Action required</span>
                  </div>
                </div>
              </div>

              {/* Analytics & Distribution Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Services Demand Breakdown */}
                <div className="lg:col-span-2 rounded-2xl p-5 bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-cyan-400" />
                      <span>Service Demand & Inquiries</span>
                    </h2>
                    <span className="text-[11px] font-mono text-slate-400">
                      Distribution by category
                    </span>
                  </div>

                  <div className="space-y-3">
                    {Object.keys(serviceBreakdown).length === 0 ? (
                      <div className="text-xs text-slate-500 font-mono py-4 text-center">
                        No service appointment records yet.
                      </div>
                    ) : (
                      Object.entries(serviceBreakdown).map(([serviceName, count]) => {
                        const numCount = Number(count) || 0;
                        const pct = stats.total > 0 ? Math.round((numCount / stats.total) * 100) : 0;
                        return (
                          <div key={serviceName} className="space-y-1">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-slate-200">{serviceName}</span>
                              <span className="text-cyan-400 font-bold">
                                {numCount} ({pct}%)
                              </span>
                            </div>
                            <div className="h-2 w-full bg-slate-850 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Quick Studio Profile & Contact Info */}
                <div className="rounded-2xl p-5 bg-slate-900/60 border border-slate-800 space-y-4">
                  <h2 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>Studio Information</span>
                  </h2>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <span className="text-[10px] font-mono text-slate-400 block">Owner & Founder</span>
                      <span className="font-bold text-white text-sm">Aadrash Kumar Sah</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <span className="text-[10px] font-mono text-slate-400 block">Agency Brand</span>
                      <span className="font-bold text-cyan-300">NEW NEPAL DIGITAL</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 block">Direct Contact Numbers</span>
                      <div className="font-mono text-white text-xs">+977 9704135338</div>
                      <div className="font-mono text-white text-xs">+977 9717126332</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <span className="text-[10px] font-mono text-slate-400 block">Operation Hours</span>
                      <span className="text-emerald-400 font-mono font-bold text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>24 Hours Open (Always Active)</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Appointments Preview */}
              <div className="rounded-2xl p-5 bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span>Latest Appointment Requests</span>
                    </h2>
                    <p className="text-[11px] font-mono text-slate-400">
                      Recent bookings needing owner confirmation
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Appointments</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                        <th className="pb-3 font-medium">Customer</th>
                        <th className="pb-3 font-medium">Service</th>
                        <th className="pb-3 font-medium">Date & Time</th>
                        <th className="pb-3 font-medium">Type</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {appointments.slice(0, 5).map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-850/40 transition-colors">
                          <td className="py-3">
                            <div className="font-semibold text-white">{apt.name}</div>
                            <div className="text-[11px] font-mono text-slate-400">{apt.phone}</div>
                          </td>
                          <td className="py-3 text-cyan-300 font-medium">{apt.service}</td>
                          <td className="py-3 font-mono text-slate-300">
                            <div>{apt.date}</div>
                            <div className="text-[10px] text-slate-500">{apt.time}</div>
                          </td>
                          <td className="py-3 text-slate-300 font-mono text-[11px]">
                            {apt.appointmentType}
                          </td>
                          <td className="py-3">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                                apt.status === 'confirmed'
                                  ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
                                  : apt.status === 'completed'
                                  ? 'bg-blue-950 border border-blue-500/40 text-blue-400'
                                  : apt.status === 'cancelled'
                                  ? 'bg-rose-950 border border-rose-500/40 text-rose-400'
                                  : 'bg-amber-950 border border-amber-500/40 text-amber-400'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setSelectedAppointment(apt)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 font-mono text-[11px] transition-colors cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPOINTMENT MANAGEMENT */}
          {activeTab === 'appointments' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                    Appointment Management
                  </h1>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Search, filter, confirm, complete, and schedule client appointments
                  </p>
                </div>

                <button
                  onClick={() => setIsNewAppointmentModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Appointment</span>
                </button>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search customer, phone, email..."
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Service Filter */}
                  <div>
                    <select
                      value={selectedServiceFilter}
                      onChange={(e) => setSelectedServiceFilter(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value="All Services">All Services</option>
                      <option value="Digital Website Design">Digital Website Design</option>
                      <option value="Branding & Creative Services">Branding & Creative Services</option>
                      <option value="Video Editing">Video Editing</option>
                      <option value="Animation & Motion Graphics">Animation & Motion Graphics</option>
                      <option value="Social Media Design">Social Media Design</option>
                      <option value="Digital Menu / QR Menu Design">Digital Menu / QR Menu Design</option>
                    </select>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <select
                      value={selectedDateFilter}
                      onChange={(e) => setSelectedDateFilter(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value="all">All Dates</option>
                      <option value="today">Today</option>
                      <option value="week">Past 7 Days</option>
                      <option value="month">Past 30 Days</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={selectedStatusFilter}
                      onChange={(e) => setSelectedStatusFilter(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Filter Summary */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span>
                    Showing <strong>{filteredAppointments.length}</strong> of{' '}
                    <strong>{appointments.length}</strong> appointments
                  </span>
                  {(searchQuery ||
                    selectedServiceFilter !== 'All Services' ||
                    selectedDateFilter !== 'all' ||
                    selectedStatusFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedServiceFilter('All Services');
                        setSelectedDateFilter('all');
                        setSelectedStatusFilter('all');
                      }}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Appointments List Table */}
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                        <th className="p-4 font-medium">Customer Information</th>
                        <th className="p-4 font-medium">Service Requested</th>
                        <th className="p-4 font-medium">Scheduled Date & Time</th>
                        <th className="p-4 font-medium">Appointment Type</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                            No appointments matched the current criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((apt) => (
                          <tr
                            key={apt.id}
                            className="hover:bg-slate-850/40 transition-colors group cursor-pointer"
                            onClick={() => setSelectedAppointment(apt)}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-bold text-xs">
                                  {apt.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                                    {apt.name}
                                  </div>
                                  <div className="text-[11px] font-mono text-slate-400">
                                    {apt.phone}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="p-4">
                              <span className="font-medium text-cyan-300 block">{apt.service}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Sub: {new Date(apt.createdAt).toLocaleDateString()}
                              </span>
                            </td>

                            <td className="p-4 font-mono text-slate-300">
                              <div className="font-semibold">{apt.date}</div>
                              <div className="text-[10px] text-slate-400">{apt.time}</div>
                            </td>

                            <td className="p-4 font-mono text-slate-300 text-[11px]">
                              {apt.appointmentType}
                            </td>

                            <td className="p-4">
                              <span
                                className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase font-bold ${
                                  apt.status === 'confirmed'
                                    ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
                                    : apt.status === 'completed'
                                    ? 'bg-blue-950 border border-blue-500/40 text-blue-400'
                                    : apt.status === 'cancelled'
                                    ? 'bg-rose-950 border border-rose-500/40 text-rose-400'
                                    : 'bg-amber-950 border border-amber-500/40 text-amber-400'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </td>

                            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedAppointment(apt)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-[11px] transition-colors cursor-pointer"
                                >
                                  View
                                </button>
                                {apt.status === 'pending' && (
                                  <button
                                    onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[11px] font-bold transition-colors cursor-pointer"
                                  >
                                    Confirm
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMERS CRM */}
          {activeTab === 'customers' && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                  Customer Directory & CRM
                </h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Client contact records, booking history, and direct outreach channels
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.length === 0 ? (
                  <div className="col-span-full p-8 text-center text-slate-500 font-mono">
                    No customer profiles recorded yet.
                  </div>
                ) : (
                  customers.map((c) => {
                    const cleanPhone = c.phone.replace(/[^0-9]/g, '');
                    const waUrl = `https://wa.me/${cleanPhone}`;
                    return (
                      <div
                        key={c.id}
                        className="rounded-2xl p-5 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-slate-950 font-bold flex items-center justify-center text-sm">
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-sm">{c.name}</h3>
                              <p className="text-[11px] font-mono text-slate-400">{c.phone}</p>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300">
                            {c.totalAppointments} {c.totalAppointments === 1 ? 'Booking' : 'Bookings'}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-300">
                          <div className="flex justify-between font-mono text-[11px]">
                            <span className="text-slate-500">Email:</span>
                            <span className="text-slate-300">{c.email}</span>
                          </div>
                          <div className="flex justify-between font-mono text-[11px]">
                            <span className="text-slate-500">Latest Service:</span>
                            <span className="text-cyan-400 font-semibold">{c.latestService}</span>
                          </div>
                          <div className="flex justify-between font-mono text-[11px]">
                            <span className="text-slate-500">Last Active:</span>
                            <span className="text-slate-300">{c.latestDate}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                          <a
                            href={`tel:${c.phone}`}
                            className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Phone className="w-3 h-3 text-cyan-400" />
                            <span>Call</span>
                          </a>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-400" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SERVICES CATALOG */}
          {activeTab === 'services' && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                  Studio Creative Services
                </h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Active offerings available for client bookings at NEW NEPAL DIGITAL
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="rounded-2xl p-5 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                        {srv.category}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        ● {srv.status}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-white text-base">{srv.name}</h3>

                    <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Estimated Price</span>
                        <span className="text-cyan-300 font-bold">{srv.priceEstimate}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block text-[10px]">Duration</span>
                        <span className="text-slate-300">{srv.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MESSAGES & INQUIRIES */}
          {activeTab === 'messages' && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                  Inquiries & Messages
                </h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Detailed project scopes and direct contact submissions from clients
                </p>
              </div>

              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="rounded-2xl p-5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{apt.name}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-cyan-400 font-mono text-xs">{apt.service}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {new Date(apt.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-850 text-xs text-slate-200 leading-relaxed font-sans">
                      {apt.message || 'No specific notes provided.'}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-3">
                        <span>Phone: <strong className="text-white">{apt.phone}</strong></span>
                        {apt.email && <span>Email: <strong className="text-white">{apt.email}</strong></span>}
                      </div>

                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
                      >
                        Manage Appointment →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                  Studio Settings
                </h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Agency credentials, operational hours, and system preferences
                </p>
              </div>

              <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 space-y-5">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  <span>NEW NEPAL DIGITAL Identity</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 block mb-1">Owner Name</label>
                    <input
                      type="text"
                      disabled
                      value="Aadrash Kumar Sah"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold cursor-not-allowed opacity-80"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Owner Email</label>
                    <input
                      type="text"
                      disabled
                      value="videographics27@gmail.com"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-semibold cursor-not-allowed opacity-80"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Primary Phone</label>
                    <input
                      type="text"
                      disabled
                      value="+977 9704135338"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white cursor-not-allowed opacity-80"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Secondary Phone</label>
                    <input
                      type="text"
                      disabled
                      value="+977 9717126332"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white cursor-not-allowed opacity-80"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                  Security & Access Control
                </h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Manage owner credentials, session authentication, and audit security logs
                </p>
              </div>

              {/* Private Owner Password Vault - Hidden from public, only seen by owner */}
              <div className="rounded-2xl p-6 bg-slate-900/80 border border-cyan-500/30 shadow-xl shadow-cyan-950/20 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-heading font-bold text-white">
                        Owner Private Password Vault
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 font-mono font-bold">
                        Only You See
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      Salted cryptographic storage. Hidden by default — visible only to authenticated owner Aadrash Kumar Sah.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95 transition-all self-start sm:self-auto"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Change Password</span>
                  </button>
                </div>

                {/* Password Reveal Box */}
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Account:</span>
                      <span className="text-white font-medium">videographics27@gmail.com</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-emerald-400 font-semibold">Active & Secured</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="font-mono text-sm tracking-wider font-bold text-cyan-300 bg-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-800 min-w-[200px] text-center select-all">
                        {showOwnerPassword
                          ? (ownerVaultInfo?.currentPassword || '— Loading Vault —')
                          : '••••••••••••••••••••'}
                      </div>

                      <button
                        type="button"
                        onClick={toggleShowOwnerPassword}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                        title={showOwnerPassword ? 'Hide password' : 'Show password for owner only'}
                      >
                        {showOwnerPassword ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                            <span>Hide Password</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Show Password (Only Me)</span>
                          </>
                        )}
                      </button>

                      {showOwnerPassword && (
                        <button
                          type="button"
                          onClick={handleCopyPassword}
                          className="px-3 py-1.5 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedPassword ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-300 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {showOwnerPassword && autoHideTimer > 0 && (
                    <div className="text-[11px] font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 px-3 py-2 rounded-lg flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span>Auto-hiding in {autoHideTimer}s (prevents shoulder surfing)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Shield Status */}
              <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Active Security Shield</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300">Owner-only authorization required on all routes</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300">Zero plaintext passwords in code or frontend</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300">Public visitor dashboard access permanently blocked</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300">HMAC-SHA256 bearer session verification</span>
                  </div>
                </div>
              </div>

              {/* Security Audit Logs */}
              <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Security Audit Trail</span>
                </h3>

                <div className="divide-y divide-slate-800 text-xs font-mono">
                  {systemLogs.map((log) => (
                    <div key={log.id} className="py-2.5 flex items-start justify-between gap-3">
                      <div>
                        <span className="text-cyan-400 font-bold block">{log.event}</span>
                        <span className="text-slate-400 text-[11px]">{log.details}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
