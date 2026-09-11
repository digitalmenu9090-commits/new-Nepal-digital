import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PhoneCall,
  Instagram,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Sparkles,
  Phone,
  Clock
} from 'lucide-react';
import { PORTFOLIO_INFO } from '../data/portfolioData';

interface ContactSectionProps {
  initialService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialService }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    projectType: 'Digital Website Design',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedState, setSubmittedState] = useState<'idle' | 'success'>('idle');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, projectType: initialService }));
    }
  }, [initialService]);

  const projectTypes = [
    'Digital Website Design',
    'Graphic Design',
    'Video Editing',
    'Social Media Design',
    'Branding & Creative Services',
    'Advertisement Design',
    'Animation & Motion Graphics',
    'Digital Menu / QR Menu Design',
    'Other Creative Inquiry'
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = 'Please enter your full name';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Please provide your phone or WhatsApp number';
    } else if (formData.phone.trim().length < 7) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please provide brief details about your idea or project';
    } else if (formData.message.trim().length < 5) {
      errs.message = 'Message should be at least 5 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedState('success');
    }, 600);
  };

  const generateWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hi Aadrash,\nI saw your portfolio! My name is ${formData.name}.\nProject: ${formData.projectType}\nPhone: ${formData.phone}\nMessage: ${formData.message}`
    );
    return `https://wa.me/9779704135338?text=${text}`;
  };

  const copySummaryToClipboard = () => {
    const text = `Name: ${formData.name}\nProject: ${formData.projectType}\nPhone: ${formData.phone}\nMessage: ${formData.message}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#030611] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-2.5 flex-wrap mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>START A COLLABORATION</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="font-bold">24 HOURS OPEN (24/7)</span>
            </div>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Let's Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Something Great</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
            Have an idea or project? We are open 24 hours — connect anytime day or night to turn your vision into reality.
          </p>
        </motion.div>

        {/* Top: Separate Animated Phone Cards & Social Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {/* Phone Card 1: 9704135338 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl glass-panel glass-panel-hover border border-cyan-500/20 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:glow-cyan transition-all">
                <PhoneCall className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                PRIMARY LINE
              </span>
              <h3 className="font-heading font-black text-xl text-white mb-4">
                9704135338
              </h3>
            </div>
            <a
              href="tel:9704135338"
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/30 text-xs font-semibold font-mono flex items-center justify-center gap-2 transition-all glow-cyan"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call 9704135338</span>
            </a>
          </motion.div>

          {/* Phone Card 2: 9717126332 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl glass-panel glass-panel-hover border border-blue-500/20 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:glow-blue transition-all">
                <PhoneCall className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                SECONDARY LINE
              </span>
              <h3 className="font-heading font-black text-xl text-white mb-4">
                9717126332
              </h3>
            </div>
            <a
              href="tel:9717126332"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-500/15 hover:bg-blue-500 text-blue-300 hover:text-black border border-blue-500/30 text-xs font-semibold font-mono flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call 9717126332</span>
            </a>
          </motion.div>

          {/* Instagram Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl glass-panel glass-panel-hover border border-pink-500/20 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all">
                <Instagram className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                OFFICIAL INSTAGRAM
              </span>
              <h3 className="font-heading font-black text-xl text-white mb-4">
                @black_snow35
              </h3>
            </div>
            <a
              href={PORTFOLIO_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-pink-500/15 hover:bg-pink-500 text-pink-300 hover:text-black border border-pink-500/30 text-xs font-semibold font-mono flex items-center justify-center gap-2 transition-all"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Open Instagram</span>
            </a>
          </motion.div>

          {/* WhatsApp Direct Chat Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 rounded-2xl glass-panel glass-panel-hover border border-emerald-500/20 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>24 HOURS OPEN</span>
              </div>
              <h3 className="font-heading font-black text-xl text-white mb-4">
                Instant Response
              </h3>
            </div>
            <a
              href={PORTFOLIO_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/30 text-xs font-semibold font-mono flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </motion.div>
        </div>

        {/* 24 Hours Open Operating Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-2xl mx-auto p-4 rounded-2xl bg-[#06141a]/90 border border-emerald-500/30 shadow-xl backdrop-blur-md flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-white font-heading">
                  Operating Hours: 24 Hours Open (24/7)
                </h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live & Available
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                Immediate response on Call & WhatsApp: 9704135338 / 9717126332
              </p>
            </div>
          </div>
          <a
            href={PORTFOLIO_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-mono font-bold hover:bg-emerald-400 transition-colors shrink-0 shadow"
          >
            <span>Message 24/7</span>
          </a>
        </motion.div>

        {/* Contact Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto rounded-3xl glass-panel border border-cyan-500/30 p-6 sm:p-10 shadow-2xl relative"
        >
          <div className="mb-6">
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mb-2">
              Send a Direct Project Brief
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Fill out this quick form. You will be connected directly with Aadrash Sah without automated hurdles.
            </p>
          </div>

          {submittedState === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 py-4"
            >
              <div className="p-5 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading font-bold text-base text-white mb-1">
                    Your Brief is Ready!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Thank you, <span className="text-cyan-300 font-semibold">{formData.name}</span>. Since this is a client-side direct creator portfolio with no middleman backend, dispatch your message directly to Aadrash Sah:
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-xl font-heading font-bold text-xs sm:text-sm text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:shadow-lg hover:shadow-emerald-400/20 flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Direct via WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={copySummaryToClipboard}
                  className="w-full py-3 px-5 rounded-xl font-heading font-medium text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Brief to Clipboard'}</span>
                </button>

                <button
                  onClick={() => setSubmittedState('idle')}
                  className="w-full text-center text-xs text-slate-400 hover:text-white pt-2 transition-colors"
                >
                  ← Edit message or submit another
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Sharma"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-cyan-400 focus:outline-none text-white text-sm transition-colors placeholder:text-slate-600"
                />
                {errors.name && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 98XXXXXXXX or WhatsApp number"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-cyan-400 focus:outline-none text-white text-sm transition-colors placeholder:text-slate-600"
                />
                {errors.phone && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Project Type
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-cyan-400 focus:outline-none text-white text-sm transition-colors"
                >
                  {projectTypes.map((type) => (
                    <option key={type} value={type} className="bg-slate-900 text-white">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Message & Requirements *
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your vision, timeline, or requirements..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-cyan-400 focus:outline-none text-white text-sm transition-colors placeholder:text-slate-600 resize-none"
                />
                {errors.message && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.message}
                  </p>
                )}
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-heading font-bold text-sm text-black bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400 font-mono pt-1">
                Direct creator communication. No spam, no bot filters.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
