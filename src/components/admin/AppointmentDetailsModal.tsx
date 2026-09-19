import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Briefcase,
  Video,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock3,
  Trash2,
  ExternalLink,
  MessageCircle,
  Save,
  ShieldCheck
} from 'lucide-react';
import { Appointment } from '../../types/admin';

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Appointment['status'], notes?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  appointment,
  onClose,
  onUpdateStatus,
  onDelete
}) => {
  if (!appointment) return null;

  const [notes, setNotes] = useState(appointment.notes || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleStatusChange = async (newStatus: Appointment['status']) => {
    setIsUpdating(true);
    await onUpdateStatus(appointment.id, newStatus, notes);
    setIsUpdating(false);
  };

  const handleSaveNotes = async () => {
    setIsUpdating(true);
    await onUpdateStatus(appointment.id, appointment.status, notes);
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(appointment.id);
    setIsDeleting(false);
    onClose();
  };

  const cleanPhone = appointment.phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hi ${appointment.name}, this is Aadrash Kumar Sah from NEW NEPAL DIGITAL regarding your appointment for ${appointment.service}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-[#060e20] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-[#07152b] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Calendar className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-heading font-bold text-white">
                  Appointment Details
                </h2>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                    appointment.status === 'confirmed'
                      ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
                      : appointment.status === 'completed'
                      ? 'bg-blue-950/80 border border-blue-500/40 text-blue-400'
                      : appointment.status === 'cancelled'
                      ? 'bg-rose-950/80 border border-rose-500/40 text-rose-400'
                      : 'bg-amber-950/80 border border-amber-500/40 text-amber-400'
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                ID: {appointment.id} • Submitted on {new Date(appointment.createdAt).toLocaleDateString()} at {new Date(appointment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Customer Information Card */}
          <div className="rounded-xl p-4 bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-semibold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Customer Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-mono block text-[11px]">Full Name</span>
                <span className="font-semibold text-white text-sm">{appointment.name}</span>
              </div>

              <div>
                <span className="text-slate-400 font-mono block text-[11px]">Phone Number</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-white">{appointment.phone}</span>
                  <a
                    href={`tel:${appointment.phone}`}
                    className="p-1 rounded bg-slate-800 text-cyan-400 hover:text-white"
                    title="Call"
                  >
                    <Phone className="w-3 h-3" />
                  </a>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded bg-emerald-950 text-emerald-400 hover:text-white"
                    title="Open WhatsApp"
                  >
                    <MessageCircle className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-mono block text-[11px]">Email Address</span>
                {appointment.email ? (
                  <a
                    href={`mailto:${appointment.email}`}
                    className="font-mono text-cyan-400 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>{appointment.email}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ) : (
                  <span className="text-slate-500 font-mono">Not provided</span>
                )}
              </div>

              <div>
                <span className="text-slate-400 font-mono block text-[11px]">Requested Service</span>
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5 mt-0.5">
                  <Briefcase className="w-3 h-3 text-cyan-400" />
                  <span>{appointment.service}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Schedule & Meeting Details */}
          <div className="rounded-xl p-4 bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-semibold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Schedule & Appointment Type</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-mono block text-[11px]">Scheduled Date</span>
                <span className="font-semibold text-white text-sm mt-0.5 block">{appointment.date}</span>
              </div>

              <div>
                <span className="text-slate-400 font-mono block text-[11px]">Scheduled Time</span>
                <span className="font-semibold text-white text-sm mt-0.5 block">{appointment.time}</span>
              </div>

              <div>
                <span className="text-slate-400 font-mono block text-[11px]">Meeting Channel</span>
                <span className="font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <Video className="w-3 h-3" />
                  <span>{appointment.appointmentType}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Customer Message / Project Details */}
          <div className="rounded-xl p-4 bg-slate-900/60 border border-slate-800 space-y-2">
            <h3 className="text-xs font-mono font-semibold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Customer Message & Project Scope</span>
            </h3>
            <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-850 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {appointment.message || 'No additional project description provided.'}
            </div>
          </div>

          {/* Internal Owner Notes */}
          <div className="rounded-xl p-4 bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-mono font-semibold text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Internal Owner Notes</span>
              </h3>
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isUpdating}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <Save className="w-3 h-3" />
                <span>Save Notes</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add private studio notes, pricing agreements, or project links here..."
              className="w-full p-3 rounded-lg bg-slate-950/90 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {showConfirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-400 font-mono">Confirm delete?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold cursor-pointer"
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/80 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Delete Appointment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {appointment.status !== 'confirmed' && (
              <button
                type="button"
                onClick={() => handleStatusChange('confirmed')}
                disabled={isUpdating}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Appointment</span>
              </button>
            )}

            {appointment.status !== 'completed' && (
              <button
                type="button"
                onClick={() => handleStatusChange('completed')}
                disabled={isUpdating}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Completed</span>
              </button>
            )}

            {appointment.status !== 'cancelled' && (
              <button
                type="button"
                onClick={() => handleStatusChange('cancelled')}
                disabled={isUpdating}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 text-xs font-mono transition-all active:scale-95 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
