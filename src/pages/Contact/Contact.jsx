import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import ContactForm from './ContactForm';

const Contact = () => {
  const contactInfo = {
    heading: "CONTACT",
    title: "Get In Touch",
    residing: {
      title: "Residing",
      location: "Cairo",
      country: "Egypt"
    },
    email: "Mahmoudaboheussin57@gmail.com",
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-16 px-4 md:px-6">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
        
        {/* Left Column - Contact Info */}
        <div className="space-y-12" role="complementary" aria-label="Contact information">
          {/* Header */}
          <div>
            <p className="text-gray-400 text-sm font-semibold tracking-widest mb-4 uppercase">
              {contactInfo.heading}
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-white">
              Get In{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400">
                Touch
              </span>
            </h1>
          </div>

          {/* Location Info */}
          <div className="relative overflow-hidden rounded-2xl bg-space-850/80 transition-all">
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-space-900 border border-border flex items-center justify-center text-zinc-300 group-hover:border-zinc-400 group-hover:text-white transition-all duration-300 flex-shrink-0 shadow-sm">
                <MapPin className="w-5 h-5 text-zinc-300 group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              <div className="space-y-1.5 flex-1">
                <p className="text-2xl font-bold text-white tracking-wide">
                  {contactInfo.residing.location} / {contactInfo.residing.country}
                </p>

                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  Based in Cairo — collaborating with directors, agencies, and post-houses globally.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xl font-bold mb-1">Direct Inquiry</h2>
            <p className="text-gray-400 text-sm">
              Feel free to reach out directly for bookings, collaborations, or questions:
            </p>
            <a 
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-lg group pt-1"
              aria-label={`Email us at ${contactInfo.email}`}
            >
              <Mail size={20} className="text-zinc-400 group-hover:text-white transition-colors flex-shrink-0" aria-hidden="true" />
              <span>{contactInfo.email}</span>
            </a>
          </div>
        </div>

        {/* Right Column - Contact Form Component */}
        <ContactForm />

      </div>
    </div>
  );
};

export default Contact;