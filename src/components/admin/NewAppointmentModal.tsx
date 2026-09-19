import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Calendar, User, Phone, Mail, Briefcase, Clock, Video, Plus, Check } from 'lucide-react';
import { Appointment } from '../../types/admin';

interface NewAppointmentModalProps {
  onClose: () => void;
  onCreateAppointment: (data: Partial<Appointment>) => Promise<void>;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  onClose,
  onCreateAppointment
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Digital Website Design',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    appointmentType: 'Google Meet (Online)',
    status: 'confirmed' as Appointment['status'],
    message: '',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const services = [
    'Digital Website Design',
    'Branding & Creative Services',
    'Video Editing',
    'Animation & Motion Graphics',
    'Social Media Design',
    'Digital Menu / QR Menu Design',
    'Advertisement Design',
    'Creative Tech Consultation'
  ];

  const meetingTypes = [
    'Google Meet (Online)',
    'WhatsApp Call',
    'Studio Meeting / In-person',
    'Phone Consultation'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide customer name and phone number.');
      return;
    }

    setIsLoading(true);
    try {
      await onCreateAppointment(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to schedule appointment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl bg-[#060e20] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]"
      >
        <div className="p-5 bg-gradient-to-r from-slate-900 to-[#07152b] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Plus className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-heading font-bold text-white">
                Schedule New Appointment
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Book client consultation for NEW NEPAL DIGITAL
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-mono mb-1">Customer Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Giri"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-mono mb-1">Phone / WhatsApp *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+977 98XXXXXXXX"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-mono mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="client@example.com"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-mono mb-1">Service Type</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              >
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-mono mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-mono mb-1">Time</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g. 11:30 AM"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-mono mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Appointment['status'] })
                }
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">Appointment Type / Channel</label>
            <select
              value={formData.appointmentType}
              onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
            >
              {meetingTypes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">Project Message / Client Goals</label>
            <textarea
              rows={2}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Project requirements discussed with customer..."
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">Internal Notes</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Budget, deliverables agreement, or special considerations..."
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-mono cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold font-mono flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Confirm & Save Appointment'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
