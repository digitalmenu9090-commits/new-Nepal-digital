import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Settings,
  ShieldCheck,
  LogOut,
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
  Menu,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  KeyRound,
  Sparkles,
  PhoneCall,
  Copy,
  Check,
  Lock,
  Camera,
  Upload,
  Globe,
  Image as ImageIcon,
  FolderKanban,
  Save,
  Trash2,
  Edit3,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { Appointment, AdminStats, StudioService, SystemLog } from '../../types/admin';
import { authFetch, clearStoredAuth, setStoredOwnerPassword } from '../../utils/adminAuth';
import { AppointmentDetailsModal } from './AppointmentDetailsModal';
import { NewAppointmentModal } from './NewAppointmentModal';
import { PasswordChangeModal } from './PasswordChangeModal';
import { usePortfolioContent, PortfolioContentData } from '../../utils/portfolioContent';
import { ProjectItem } from '../../types';

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
    'dashboard' | 'content' | 'images' | 'projects' | 'services' | 'appointments' | 'security'
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
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search & Filters for Appointments
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(initialMustChangePassword);

  // Live Portfolio Content State
  const { content, saveContent, uploadImage, isSaving: isContentSaving } = usePortfolioContent();
  const [editableInfo, setEditableInfo] = useState(content.info);
  const [editableProjects, setEditableProjects] = useState(content.projects);
  const [editableServices, setEditableServices] = useState(content.services);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Synchronize local editable form state when live content updates
  useEffect(() => {
    if (content?.info) setEditableInfo(content.info);
    if (content?.projects) setEditableProjects(content.projects);
    if (content?.services) setEditableServices(content.services);
  }, [content]);

  // Project Edit Modal State
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isAddingNewProject, setIsAddingNewProject] = useState(false);

  // Hidden File Input for Image Uploads
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [currentUploadTarget, setCurrentUploadTarget] = useState<{
    type: 'heroPortrait' | 'brandVisual' | 'mockupVisual' | 'project';
    id?: string;
  } | null>(null);
  const [uploadToast, setUploadToast] = useState('');

  // Owner Private Vault State
  const [ownerVaultInfo, setOwnerVaultInfo] = useState<{
    email?: string;
    username?: string;
    name?: string;
    currentPassword?: string;
    lastChanged?: string;
  } | null>(null);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [newDirectPassword, setNewDirectPassword] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{ success?: string; error?: string }>({});
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Live time ticker
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
        if (statsData.recentLogs) setSystemLogs(statsData.recentLogs);
      }

      // 2. Fetch appointments
      const aptsRes = await authFetch('/api/admin/appointments');
      if (aptsRes.ok) {
        const aptsData = await aptsRes.json();
        setAppointments(aptsData.appointments || []);
      }

      // 3. Fetch Owner Vault Credentials
      const vaultRes = await authFetch('/api/admin/vault-credentials');
      if (vaultRes.ok) {
        const vaultData = await vaultRes.json();
        setOwnerVaultInfo(vaultData);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  // Content Save Handler
  const handleSaveAllContent = async () => {
    const updated: PortfolioContentData = {
      ...content,
      info: editableInfo,
      projects: editableProjects,
      services: editableServices
    };
    const res = await saveContent(updated);
    if (res.success) {
      setSaveSuccessMsg('Website content & information saved successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } else {
      alert('Error saving content: ' + res.error);
    }
  };

  // Image Upload Trigger
  const handleTriggerUpload = (type: 'heroPortrait' | 'brandVisual' | 'mockupVisual' | 'project', id?: string) => {
    setCurrentUploadTarget({ type, id });
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
      imageInputRef.current.click();
    }
  };

  const handleImageFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUploadTarget) return;

    setUploadToast('Uploading image...');
    const res = await uploadImage(file, currentUploadTarget.type, currentUploadTarget.id);
    if (res.success && res.url) {
      setUploadToast('Image updated successfully!');
      setTimeout(() => setUploadToast(''), 3500);

      // Update local state preview
      if (currentUploadTarget.type === 'heroPortrait') {
        setEditableInfo((prev) => ({
          ...prev,
          images: { ...prev.images, heroPortrait: res.url! }
        }));
      } else if (currentUploadTarget.type === 'brandVisual') {
        setEditableInfo((prev) => ({
          ...prev,
          images: { ...prev.images, brandVisual: res.url! }
        }));
      } else if (currentUploadTarget.type === 'mockupVisual') {
        setEditableInfo((prev) => ({
          ...prev,
          images: { ...prev.images, mockupVisual: res.url! }
        }));
      } else if (currentUploadTarget.type === 'project' && currentUploadTarget.id) {
        setEditableProjects((prev) =>
          prev.map((p) => (p.id === currentUploadTarget.id ? { ...p, image: res.url! } : p))
        );
      }
    } else {
      setUploadToast('Failed to upload image: ' + (res.error || 'Unknown error'));
      setTimeout(() => setUploadToast(''), 4000);
    }
  };

  // Direct Password Update Handler
  const handleDirectPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeStatus({});

    if (!newDirectPassword || newDirectPassword.length < 2) {
      setPasswordChangeStatus({ error: 'Please enter a valid password (at least 2 characters).' });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const chosenPassword = newDirectPassword;

      // 1. Instantly save in local vault storage so the password is valid immediately
      setStoredOwnerPassword(chosenPassword);
      setOwnerVaultInfo((prev) => (prev ? { ...prev, currentPassword: chosenPassword } : null));
      setPasswordChangeStatus({
        success: 'New password updated successfully! Your account is secured.'
      });
      setNewDirectPassword('');

      // 2. Synchronize to server database
      try {
        const res = await authFetch('/api/admin/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword: chosenPassword })
        });
        if (res.ok) {
          loadData(true);
        }
      } catch (srvErr) {
        console.warn('Server password sync note:', srvErr);
      }
    } catch (err: any) {
      setPasswordChangeStatus({ error: err.message || 'Failed to update password.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Copy Password
  const handleCopyPassword = () => {
    const pwd = ownerVaultInfo?.currentPassword || '';
    if (!pwd) return;
    navigator.clipboard.writeText(pwd);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  // Appointment Status Updates
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await authFetch(`/api/admin/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus as any } : a))
        );
        loadData(true);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      const res = await authFetch(`/api/admin/appointments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        setSelectedAppointment(null);
        loadData(true);
      }
    } catch (err) {
      console.error('Error deleting appointment:', err);
    }
  };

  const handleCreateAppointment = async (newApt: any) => {
    try {
      const res = await authFetch('/api/admin/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApt)
      });
      if (res.ok) {
        setIsNewAppointmentModalOpen(false);
        loadData(true);
      }
    } catch (err) {
      console.error('Error creating appointment:', err);
    }
  };

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesSearch =
        apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.service.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatusFilter === 'all' || apt.status === selectedStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchQuery, selectedStatusFilter]);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'content', label: 'Website & Bio', icon: Globe },
    { id: 'images', label: 'All Images', icon: ImageIcon },
    { id: 'projects', label: 'Projects Showcase', icon: FolderKanban, count: editableProjects.length },
    { id: 'services', label: 'Services & Pricing', icon: Briefcase, count: editableServices.length },
    { id: 'appointments', label: 'Appointments & Leads', icon: Calendar, badge: stats.pending > 0 ? stats.pending : undefined },
    { id: 'security', label: 'Owner Password', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Hidden File Input for Universal Image Upload */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageFileSelected}
        accept="image/*"
        className="hidden"
      />

      {/* Global Modals */}
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

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#060c1d]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
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
                {editableInfo.brand || 'NEW NEPAL DIGITAL'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                Private Owner Vault
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              {editableInfo.name} • Master Control Dashboard
            </p>
          </div>
        </div>

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
            title="Refresh Data"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* View Website */}
          <button
            onClick={onViewWebsite}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>View Website</span>
            <ExternalLink className="w-3 h-3 text-cyan-400" />
          </button>

          {/* Owner Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20">
              AS
            </div>
            <button
              onClick={handleLogout}
              title="Logout from Owner Dashboard"
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-rose-950/80 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#050b18] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0 pt-16 lg:pt-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 space-y-1.5 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              Admin Controls
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

          {/* Sidebar Footer Security Status */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 space-y-2">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Protected Vault</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Hidden from public visitors. Only owner can enter.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#030712]">
          {/* Toast Notification */}
          {(saveSuccessMsg || uploadToast) && (
            <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-200 text-xs font-mono shadow-2xl animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveSuccessMsg || uploadToast}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                  Studio Overview & Analytics
                </h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Welcome, {editableInfo.name}! Control your entire digital presence from this private vault.
                </p>
              </div>

              {/* Quick Action Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab('content')}
                  className="p-5 rounded-2xl bg-[#070e20] border border-cyan-500/25 hover:border-cyan-500/50 cursor-pointer transition-all hover:-translate-y-0.5 group"
                >
                  <Globe className="w-6 h-6 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-heading font-bold text-white text-sm">Edit Website Content</h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">Change name, title, bio, phones, WhatsApp</p>
                </div>

                <div
                  onClick={() => setActiveTab('images')}
                  className="p-5 rounded-2xl bg-[#070e20] border border-blue-500/25 hover:border-blue-500/50 cursor-pointer transition-all hover:-translate-y-0.5 group"
                >
                  <ImageIcon className="w-6 h-6 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-heading font-bold text-white text-sm">Change All Images</h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">Upload real photo, brand visuals, projects</p>
                </div>

                <div
                  onClick={() => setActiveTab('projects')}
                  className="p-5 rounded-2xl bg-[#070e20] border border-purple-500/25 hover:border-purple-500/50 cursor-pointer transition-all hover:-translate-y-0.5 group"
                >
                  <FolderKanban className="w-6 h-6 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-heading font-bold text-white text-sm">Manage Projects ({editableProjects.length})</h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">Add, edit, or delete portfolio showcases</p>
                </div>

                <div
                  onClick={() => setActiveTab('security')}
                  className="p-5 rounded-2xl bg-[#070e20] border border-emerald-500/25 hover:border-emerald-500/50 cursor-pointer transition-all hover:-translate-y-0.5 group"
                >
                  <KeyRound className="w-6 h-6 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-heading font-bold text-white text-sm">Owner Password</h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">View or change your private password</p>
                </div>
              </div>

              {/* Appointment Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-2xl font-black text-white font-heading">{stats.total}</div>
                  <div className="text-xs text-slate-400 font-mono mt-1">Total Client Inquiries</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30">
                  <div className="text-2xl font-black text-amber-400 font-heading">{stats.pending}</div>
                  <div className="text-xs text-slate-400 font-mono mt-1">Pending Requests</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30">
                  <div className="text-2xl font-black text-emerald-400 font-heading">{stats.confirmed}</div>
                  <div className="text-xs text-slate-400 font-mono mt-1">Confirmed Bookings</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30">
                  <div className="text-2xl font-black text-cyan-400 font-heading">{stats.completed}</div>
                  <div className="text-xs text-slate-400 font-mono mt-1">Delivered Projects</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT WEBSITE CONTENT & BIO */}
          {activeTab === 'content' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                    Edit Website Content & Bio
                  </h1>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Change any text, name, tagline, or contact detail across the website.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAllContent}
                  disabled={isContentSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isContentSaving ? 'Saving Changes...' : 'Save Website Content'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Personal & Brand Info */}
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-heading font-bold text-cyan-400 uppercase tracking-wider font-mono">
                    1. Identity & Titles
                  </h3>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editableInfo.name}
                      onChange={(e) => setEditableInfo({ ...editableInfo, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Founder Title</label>
                    <input
                      type="text"
                      value={editableInfo.title}
                      onChange={(e) => setEditableInfo({ ...editableInfo, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={editableInfo.brand}
                      onChange={(e) => setEditableInfo({ ...editableInfo, brand: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Brand Tagline</label>
                    <input
                      type="text"
                      value={editableInfo.tagline}
                      onChange={(e) => setEditableInfo({ ...editableInfo, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Hero Heading</label>
                    <input
                      type="text"
                      value={editableInfo.heroHeading}
                      onChange={(e) => setEditableInfo({ ...editableInfo, heroHeading: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      Animated Cycling Titles (separated by commas)
                    </label>
                    <input
                      type="text"
                      value={editableInfo.animatedTitles.join(', ')}
                      onChange={(e) =>
                        setEditableInfo({
                          ...editableInfo,
                          animatedTitles: e.target.value.split(',').map((s) => s.trim())
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                {/* Contact & Availability Settings */}
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-heading font-bold text-cyan-400 uppercase tracking-wider font-mono">
                    2. Contact Numbers & Socials
                  </h3>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Primary Phone Number</label>
                    <input
                      type="text"
                      value={editableInfo.contactNumbers[0] || ''}
                      onChange={(e) => {
                        const copy = [...editableInfo.contactNumbers];
                        copy[0] = e.target.value;
                        setEditableInfo({ ...editableInfo, contactNumbers: copy });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Secondary Phone Number</label>
                    <input
                      type="text"
                      value={editableInfo.contactNumbers[1] || ''}
                      onChange={(e) => {
                        const copy = [...editableInfo.contactNumbers];
                        copy[1] = e.target.value;
                        setEditableInfo({ ...editableInfo, contactNumbers: copy });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">WhatsApp Number (Nepal)</label>
                    <input
                      type="text"
                      value={editableInfo.whatsappNumber}
                      onChange={(e) =>
                        setEditableInfo({
                          ...editableInfo,
                          whatsappNumber: e.target.value,
                          whatsappUrl: `https://wa.me/977${e.target.value}`
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Instagram Handle</label>
                    <input
                      type="text"
                      value={editableInfo.instagramHandle}
                      onChange={(e) => setEditableInfo({ ...editableInfo, instagramHandle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Instagram Profile URL</label>
                    <input
                      type="text"
                      value={editableInfo.instagramUrl}
                      onChange={(e) => setEditableInfo({ ...editableInfo, instagramUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Working Hours</label>
                    <input
                      type="text"
                      value={editableInfo.workingHours}
                      onChange={(e) => setEditableInfo({ ...editableInfo, workingHours: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                {/* Hero & About Descriptions */}
                <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-heading font-bold text-cyan-400 uppercase tracking-wider font-mono">
                    3. Bio & Narrative Text
                  </h3>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Hero Section Description</label>
                    <textarea
                      rows={2}
                      value={editableInfo.heroDescription}
                      onChange={(e) => setEditableInfo({ ...editableInfo, heroDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">About Me - Paragraph 1</label>
                    <textarea
                      rows={2}
                      value={editableInfo.aboutParagraphs[0] || ''}
                      onChange={(e) => {
                        const copy = [...editableInfo.aboutParagraphs];
                        copy[0] = e.target.value;
                        setEditableInfo({ ...editableInfo, aboutParagraphs: copy });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">About Me - Paragraph 2</label>
                    <textarea
                      rows={2}
                      value={editableInfo.aboutParagraphs[1] || ''}
                      onChange={(e) => {
                        const copy = [...editableInfo.aboutParagraphs];
                        copy[1] = e.target.value;
                        setEditableInfo({ ...editableInfo, aboutParagraphs: copy });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleSaveAllContent}
                  disabled={isContentSaving}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isContentSaving ? 'Saving Changes...' : 'Save Website Content'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ALL IMAGES MANAGEMENT */}
          {activeTab === 'images' && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                  All Website Images Management
                </h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Upload or replace any photograph, brand visual, or project picture with real-time preview and server storage.
                </p>
              </div>

              {/* Main Visuals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Founder Portrait */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/30 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 font-mono text-[10px] font-bold uppercase">
                      Hero & Profile Portrait
                    </span>
                    <h3 className="font-heading font-bold text-white text-base mt-2">Authentic Natural Photo</h3>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      Displayed on Hero Card, About Me, WhatsApp, and Admin.
                    </p>
                  </div>

                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img
                      src={editableInfo.images.heroPortrait}
                      alt="Aadrash Sah"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTriggerUpload('heroPortrait')}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Upload New Real Photo</span>
                  </button>
                </div>

                {/* 2. Brand Visual */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-blue-500/30 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 font-mono text-[10px] font-bold uppercase">
                      Studio Branding
                    </span>
                    <h3 className="font-heading font-bold text-white text-base mt-2">NEW NEPAL DIGITAL Brand Visual</h3>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      Displayed in Brand Showcase & Brand Identity popups.
                    </p>
                  </div>

                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img
                      src={editableInfo.images.brandVisual}
                      alt="Brand Visual"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTriggerUpload('brandVisual')}
                    className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Brand Visual</span>
                  </button>
                </div>

                {/* 3. Digital Mockup */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-purple-500/30 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-400 font-mono text-[10px] font-bold uppercase">
                      Digital Mockup
                    </span>
                    <h3 className="font-heading font-bold text-white text-base mt-2">Technology Mockup Visual</h3>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      Featured in Website Design & Digital Showcase cards.
                    </p>
                  </div>

                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img
                      src={editableInfo.images.mockupVisual}
                      alt="Digital Mockup"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTriggerUpload('mockupVisual')}
                    className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-500/20 active:scale-95 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Mockup Visual</span>
                  </button>
                </div>
              </div>

              {/* Projects Image Gallery */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading font-bold text-lg text-white">Project Showcase Images</h2>
                    <p className="text-xs text-slate-400 font-mono">
                      Change the image for each individual project in your portfolio.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {editableProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-3"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] text-cyan-400 font-mono uppercase">{proj.category}</div>
                        <h4 className="font-heading font-bold text-xs text-white truncate">{proj.title}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTriggerUpload('project', proj.id)}
                        className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950/80 border border-slate-700 hover:border-cyan-500/40 text-cyan-300 text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Change Image</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS SHOWCASE */}
          {activeTab === 'projects' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                    Projects Showcase Management
                  </h1>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Manage portfolio items, titles, descriptions, and categories.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const newProj: ProjectItem = {
                        id: `proj-${Date.now().toString().slice(-4)}`,
                        title: 'New Creative Project',
                        category: 'Websites',
                        description: 'Detailed project description tailored for digital growth.',
                        image: editableInfo.images.mockupVisual,
                        tags: ['Design', 'Creative'],
                        deliverables: ['Custom Concept', 'Final Export']
                      };
                      setEditableProjects([newProj, ...editableProjects]);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs cursor-pointer shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAllContent}
                    disabled={isContentSaving}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold font-mono text-xs cursor-pointer shadow-md transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Projects</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {editableProjects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
                              #{idx + 1} • {proj.category}
                            </span>
                          </div>
                          <h3 className="font-heading font-bold text-white text-base">{proj.title}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTriggerUpload('project', proj.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Change Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete "${proj.title}"?`)) {
                              setEditableProjects(editableProjects.filter((p) => p.id !== proj.id));
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/80 border border-rose-500/30 text-rose-400 text-xs cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                      <div>
                        <label className="text-[11px] font-mono text-slate-400 block mb-1">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditableProjects(
                              editableProjects.map((p) => (p.id === proj.id ? { ...p, title: val } : p))
                            );
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-slate-400 block mb-1">Category</label>
                        <select
                          value={proj.category}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setEditableProjects(
                              editableProjects.map((p) => (p.id === proj.id ? { ...p, category: val } : p))
                            );
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                        >
                          <option value="Websites">Websites</option>
                          <option value="Branding">Branding</option>
                          <option value="Graphic Design">Graphic Design</option>
                          <option value="Social Media">Social Media</option>
                          <option value="Video Editing">Video Editing</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-mono text-slate-400 block mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditableProjects(
                              editableProjects.map((p) => (p.id === proj.id ? { ...p, description: val } : p))
                            );
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SERVICES & PRICING */}
          {activeTab === 'services' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                    Services & Offerings
                  </h1>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Edit service titles, feature descriptions, tags, and pricing estimates.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAllContent}
                  disabled={isContentSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold font-mono text-xs cursor-pointer shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Services</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editableServices.map((srv) => (
                  <div key={srv.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 text-[10px] font-mono">
                        {srv.tag}
                      </span>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1">Service Title</label>
                      <input
                        type="text"
                        value={srv.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditableServices(
                            editableServices.map((s) => (s.id === srv.id ? { ...s, title: val } : s))
                          );
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1">Summary Description</label>
                      <textarea
                        rows={2}
                        value={srv.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditableServices(
                            editableServices.map((s) => (s.id === srv.id ? { ...s, description: val } : s))
                          );
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: APPOINTMENTS & CLIENT LEADS */}
          {activeTab === 'appointments' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                    Client Inquiries & Appointments
                  </h1>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Manage client consultation bookings submitted through your website.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewAppointmentModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs cursor-pointer shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Booking</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search client name, phone, or service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono w-full sm:w-auto"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Appointment Cards */}
              <div className="space-y-3">
                {filteredAppointments.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 font-mono text-xs text-slate-400">
                    No appointments found matching your criteria.
                  </div>
                ) : (
                  filteredAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      onClick={() => setSelectedAppointment(apt)}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-white text-sm">{apt.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                              apt.status === 'confirmed'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : apt.status === 'pending'
                                ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                                : apt.status === 'completed'
                                ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                                : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                          <span>{apt.service}</span>
                          <span>•</span>
                          <span>{apt.date} at {apt.time}</span>
                          <span>•</span>
                          <span className="text-cyan-400">{apt.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}`, '_blank');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-1.5"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 7: OWNER PASSWORD & SECURITY (ONLY ME NO ANY PERSON & HIDE THE) */}
          {activeTab === 'security' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                  Owner Password & Private Vault Security
                </h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Only you (Aadrash) have access to this dashboard. Completely hidden from public view.
                </p>
              </div>

              {/* Security Shield Card */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-[#061026] to-[#040814] border border-cyan-500/40 shadow-xl space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-white text-base">Owner Private Account</h3>
                      <p className="text-xs font-mono text-cyan-400">
                        {ownerVaultInfo?.email || 'videographics27@gmail.com'}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Active & Shielded
                  </span>
                </div>

                {/* Current Active Password Viewer */}
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">Current Active Password:</span>
                    <button
                      type="button"
                      onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                      className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {showOwnerPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showOwnerPassword ? 'Hide Password' : 'Show Password'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-sm font-bold text-white tracking-wider">
                      {showOwnerPassword
                        ? ownerVaultInfo?.currentPassword || 'newnepaldigitalNND'
                        : '••••••••••••••••••••'}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      className="px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Copy active password to clipboard"
                    >
                      {copiedPassword ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-300">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Change Password Form */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                    <span>Set New Custom Password</span>
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Type any new password below. It will update instantly so only you can enter.
                  </p>

                  <form onSubmit={handleDirectPasswordChange} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Type your new password here..."
                      value={newDirectPassword}
                      onChange={(e) => setNewDirectPassword(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      disabled={isUpdatingPassword || !newDirectPassword}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold font-mono text-xs cursor-pointer shadow-md transition-all shrink-0"
                    >
                      {isUpdatingPassword ? 'Saving Password...' : 'Save New Password'}
                    </button>
                  </form>

                  {passwordChangeStatus.success && (
                    <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                      {passwordChangeStatus.success}
                    </div>
                  )}

                  {passwordChangeStatus.error && (
                    <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono">
                      {passwordChangeStatus.error}
                    </div>
                  )}
                </div>
              </div>

              {/* How to Access the Hidden Dashboard Guide */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>How to Access Your Hidden Dashboard</span>
                </div>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  To protect your website from unauthorized visitors, all admin links have been hidden from public view. Only you can open this dashboard using any of these secret triggers:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                    <span className="text-cyan-400 font-bold block">1. Secret Click</span>
                    <span className="text-slate-400 text-[11px] block">
                      Triple-click the copyright text <em>"© 2026 Aadrash Sah"</em> at the footer of the site.
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                    <span className="text-cyan-400 font-bold block">2. Keyboard Shortcut</span>
                    <span className="text-slate-400 text-[11px] block">
                      Press <kbd className="px-1 bg-slate-800 rounded text-white">Ctrl</kbd> + <kbd className="px-1 bg-slate-800 rounded text-white">Shift</kbd> + <kbd className="px-1 bg-slate-800 rounded text-white">A</kbd> or simply type <strong>admin</strong> anywhere.
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                    <span className="text-cyan-400 font-bold block">3. Secret URL</span>
                    <span className="text-slate-400 text-[11px] block">
                      Add <strong>#admin</strong> or <strong>/admin</strong> or <strong>?admin=1</strong> to your website URL.
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Audit Logs */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="font-heading font-bold text-sm text-white">Security & Access Logs</h4>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                  {systemLogs.slice(0, 10).map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] font-mono flex items-center justify-between text-slate-400"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            log.level === 'SECURITY' ? 'bg-cyan-400' : 'bg-emerald-400'
                          }`}
                        />
                        <span className="text-slate-200 font-medium">{log.event}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 truncate max-w-xs sm:max-w-md">{log.details}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
