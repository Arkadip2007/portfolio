import React, { useState } from 'react';
import { Send, CheckCircle2, Mail, Sparkles, MapPin, UserCheck, Loader2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audio';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to transmit message. Please try again.');
      }

      soundFX.playBeep(1200, 0.15, 'sine');

      // Launch celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // fallback
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      soundFX.playBeep(300, 0.2, 'sawtooth');
      setErrorMessage(err.message || 'An error occurred while sending your message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 lg:px-12 max-w-5xl mx-auto relative z-10">
      
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <Mail className="w-4 h-4 text-cyan-400" />
          GET IN TOUCH
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Connect with <span className="text-cyan-400 glow-cyan">Arkadip</span>
        </h2>
        <p className="text-slate-300 text-sm">
          Interested in collaborating on Electronics, Raspberry Pi / ESP32 projects, AI models, or Physics research? Send a message!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Info Panel */}
        <div className="lg:col-span-5 glass-panel p-6 space-y-6">
          <h3 className="text-xl font-bold text-white font-heading">Contact Details</h3>

          <div className="space-y-4 text-sm font-mono">
            <div className="flex items-center gap-3 text-slate-300">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs text-slate-400">NAME</div>
                <div className="text-white font-bold">Arkadip Mahapatra</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <MapPin className="w-5 h-5 text-magenta-400" />
              <div>
                <div className="text-xs text-slate-400">EDUCATION</div>
                <div className="text-white font-bold">Class 12 Student</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs text-slate-400">INTERESTS</div>
                <div className="text-white">Electronics • AI • LHC Cosmos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Interactive Form */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,255,136,0.4)]">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-white font-heading">Message Transmitted!</h3>
              <p className="text-slate-300 text-sm max-w-sm mx-auto">
                Thank you for reaching out! Arkadip will get back to you soon.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-secondary text-xs mt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{errorMessage}</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">YOUR NAME</label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  disabled={isSubmitting}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">SUBJECT</label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="What's this about?"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">MESSAGE</label>
                <textarea
                  required
                  rows={4}
                  disabled={isSubmitting}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details about your project, idea, or questions..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors resize-none disabled:opacity-50"
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    TRANSMITTING...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    TRANSMIT MESSAGE
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>

    </section>
  );
};

