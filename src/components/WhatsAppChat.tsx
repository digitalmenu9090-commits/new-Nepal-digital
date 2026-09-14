import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, X, CheckCheck, Sparkles, Clock } from 'lucide-react';
import { PORTFOLIO_INFO } from '../data/portfolioData';
import { usePortfolioPhoto } from '../utils/photoState';

export const WhatsAppChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { photo } = usePortfolioPhoto();

  const presetMessages = [
    'Hi Aadrash, I need a website for my business!',
    'Hello! Inquiring about Branding & Graphics design.',
    'Hey, I need video editing and motion graphics.',
    'Hi! I would like to discuss a project with NEW NEPAL DIGITAL.'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const finalMsg = (textToSend || message).trim();
    const encoded = encodeURIComponent(
      finalMsg || 'Hi Aadrash, I saw your portfolio and would like to discuss a project!'
    );
    const url = `https://wa.me/977${PORTFOLIO_INFO.whatsappNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <div id="whatsapp-floating-widget" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* WhatsApp Chat Popup Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="mb-3 w-[330px] sm:w-[360px] max-w-[calc(100vw-2.5rem)] rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/30 bg-[#071318] text-slate-100 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-[#128C7E] p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={photo}
                    alt={PORTFOLIO_INFO.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border-2 border-white/80 shadow"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#128C7E]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-heading font-bold text-sm leading-tight">
                      {PORTFOLIO_INFO.name}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded-md bg-emerald-950/70 border border-emerald-300/40 text-[9px] font-mono font-bold tracking-wide text-emerald-200 uppercase">
                      24H OPEN
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100 font-mono flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    24 Hours Open • Replies instantly
                  </p>
                </div>
              </div>
              <button
                id="close-whatsapp-chat-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close WhatsApp chat popup"
                className="p-1 rounded-lg bg-black/20 hover:bg-black/30 text-white/90 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-[#0a181f] space-y-3 max-h-[320px] overflow-y-auto">
              {/* 24/7 Open Status Alert */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
                <span className="leading-tight">
                  <strong>24 Hours Open:</strong> Ready for client inquiries day & night!
                </span>
              </div>

              {/* Agent Bubble */}
              <div className="flex flex-col items-start max-w-[90%]">
                <div className="p-3 rounded-2xl rounded-tl-sm bg-[#182a32] border border-slate-800 text-xs text-slate-200 shadow space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-emerald-400 text-[11px]">
                      {PORTFOLIO_INFO.name}
                    </p>
                    <span className="text-[9px] font-mono text-emerald-300/90 bg-emerald-950/50 px-1.5 py-0.5 rounded">
                      24/7 Support
                    </span>
                  </div>
                  <p>
                    Namaste! 🙏 Welcome to NEW NEPAL DIGITAL. We are open 24 hours. How can I assist you with your project right now?
                  </p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-mono mt-1">
                    <span>Active now</span>
                    <CheckCheck className="w-3 h-3 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Quick Inquiries:
                </p>
                <div className="flex flex-col gap-1.5">
                  {presetMessages.map((msg, i) => (
                    <button
                      key={i}
                      id={`whatsapp-preset-${i}`}
                      onClick={() => handleSendMessage(msg)}
                      className="text-left text-xs p-2 rounded-xl bg-slate-900/90 hover:bg-emerald-950/70 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-all leading-snug"
                    >
                      {msg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-[#071318] border-t border-slate-800/80 flex items-center gap-2">
              <input
                id="whatsapp-custom-message-input"
                type="text"
                placeholder="Type your message anytime (24/7)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              <button
                id="send-whatsapp-message-button"
                onClick={() => handleSendMessage()}
                aria-label="Send WhatsApp message"
                className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <div className="relative flex items-center gap-3">
        {/* Callout Tooltip if closed */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/95 border border-emerald-500/50 text-emerald-400 text-xs font-mono shadow-xl backdrop-blur-md cursor-pointer hover:border-emerald-400 transition-colors"
          >
            <Clock className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="font-bold">24 Hours Open</span>
            <span className="text-slate-500">•</span>
            <span>Chat on WhatsApp</span>
          </motion.div>
        )}

        <motion.button
          id="whatsapp-toggle-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open WhatsApp Chat (24 Hours Open)"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.45)] border-2 border-white/20 transition-colors z-10"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          ) : (
            <MessageCircle className="w-7 h-7 text-slate-950 fill-slate-950 stroke-[1.5]" />
          )}

          {/* Glowing pulse ring */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full border-2 border-emerald-400/60 animate-ping pointer-events-none" />
          )}

          {/* 24h mini badge */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-mono font-black border-2 border-[#030712] shadow">
              24H
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
};
