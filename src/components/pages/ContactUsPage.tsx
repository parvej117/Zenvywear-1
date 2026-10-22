import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setSent(true);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/8801712345678?text=Hello%20ZenvyWear%20Concierge,%20I%20would%20like%20to%20inquire%20about%20your%20collection.', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#D4AF66]/40 text-[#D4AF66] text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Concierge & Client Care
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-tight">
            Contact ZenvyWear
          </h1>

          <div className="w-16 h-0.5 bg-[#D4AF66] mx-auto" />

          <p className="text-xs sm:text-sm text-neutral-400">
            Visit our private atelier studio in Banani, Dhaka or connect directly with our styling concierge.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Contact Cards & Studio Address */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Showroom card */}
            <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-3 text-[#D4AF66]">
                <MapPin className="w-5 h-5 shrink-0" />
                <h3 className="font-cinzel font-bold text-white text-base">
                  Banani Flagship Studio
                </h3>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                House 42, Road 11, Block D, Banani (Near Kemal Ataturk Ave), Dhaka-1213, Bangladesh.
              </p>
              <div className="text-xs text-neutral-400 pt-1 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#D4AF66]" />
                <span>Sat - Thu: 10:00 AM – 9:00 PM | Fri: 2:00 PM – 9:00 PM</span>
              </div>
            </div>

            {/* Direct Channels */}
            <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 space-y-4 text-xs">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-neutral-300">
                  <Phone className="w-4 h-4 text-[#D4AF66]" />
                  <span>Customer Support Hotline: <strong>+880 1712-345678</strong></span>
                </div>
                <div className="flex items-center space-x-3 text-neutral-300">
                  <Mail className="w-4 h-4 text-[#D4AF66]" />
                  <span>Email: <strong>concierge@zenvywear.com</strong></span>
                </div>
              </div>

              {/* WhatsApp instant button */}
              <button
                onClick={openWhatsApp}
                className="w-full py-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/50 text-[#25D366] rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp (+880 1712-345678)</span>
              </button>
            </div>

            {/* Quick Assurance */}
            <div className="bg-[#151515] p-4 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
              <span className="font-semibold text-white block mb-1">bKash/Nagad Payment Support:</span>
              If your payment verification is pending for more than 2 hours, please message us directly with your Order ID and TrxID for priority check.
            </div>

          </div>

          {/* Right Column: Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-cinzel font-bold text-white">
                Send an Inquiry or Custom Tailoring Request
              </h2>

              {sent ? (
                <div className="bg-[#182315] border border-emerald-500/50 rounded-xl p-8 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-base font-cinzel font-bold text-white">
                    Message Received
                  </h3>
                  <p className="text-xs text-neutral-300 max-w-sm mx-auto">
                    Thank you, {name}. Our styling concierge will contact you via WhatsApp or phone ({phone}) within 2 hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-xs text-[#D4AF66] underline pt-2"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-neutral-300 uppercase tracking-wider text-[11px] font-medium">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Samira Rahman"
                        className="w-full bg-[#181818] border border-neutral-700 focus:border-[#D4AF66] rounded-xl px-4 py-2.5 text-white outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-300 uppercase tracking-wider text-[11px] font-medium">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full bg-[#181818] border border-neutral-700 focus:border-[#D4AF66] rounded-xl px-4 py-2.5 text-white outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-300 uppercase tracking-wider text-[11px] font-medium">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Custom Bridal Size Inquiry / Order Verification"
                      className="w-full bg-[#181818] border border-neutral-700 focus:border-[#D4AF66] rounded-xl px-4 py-2.5 text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-300 uppercase tracking-wider text-[11px] font-medium">
                      Message Details *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your sizing, preferred fabric, or order inquiry..."
                      className="w-full bg-[#181818] border border-neutral-700 focus:border-[#D4AF66] rounded-xl px-4 py-2.5 text-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gold-gradient text-black font-cinzel font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:scale-[1.01] transition flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Atelier</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
