import React, { useState } from 'react';
import { Linkedin, Instagram, Check } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const [focusedField, setFocusedField] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const contactInfo = {
    heading: "CONTACT",
    title: "Get In Touch",
    residing: {
      title: "Residing",
      location: "Daegu",
      country: "South Korea"
    },
    stateHome: {
      title: "State Side Home",
      location: "Minnesota",
      country: "USA"
    },
    email: "randon.sommars@gmail.com",
    kakao: "Kakao: RandonScott",
    social: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com"
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    
    // Validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first error field
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }
    
    // Handle form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      });
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 md:px-6">

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column - Contact Info */}
          <div className="space-y-12" role="complementary" aria-label="Contact information">
            {/* Header */}
            <div>
              <p className="text-gray-400 text-sm font-semibold tracking-widest mb-4 uppercase">
                {contactInfo.heading}
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                {contactInfo.title}
              </h1>
            </div>

            {/* Location Info */}
            <div className="grid sm:grid-cols-2 gap-8 pt-8">
              {/* Residing */}
              <div>
                <h2 className="text-xl font-bold mb-4">{contactInfo.residing.title}</h2>
                <p className="text-gray-300 mb-1">{contactInfo.residing.location}</p>
                <p className="text-gray-300">{contactInfo.residing.country}</p>
              </div>

              {/* State Side Home */}
              <div>
                <h2 className="text-xl font-bold mb-4">{contactInfo.stateHome.title}</h2>
                <p className="text-gray-300 mb-1">{contactInfo.stateHome.location}</p>
                <p className="text-gray-300">{contactInfo.stateHome.country}</p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 pt-8">
              <a 
                href={`mailto:${contactInfo.email}`}
                className="block text-gray-300 hover:text-white transition-colors text-lg"
                aria-label={`Email us at ${contactInfo.email}`}
              >
                {contactInfo.email}
              </a>
              <p className="text-gray-300 text-lg">{contactInfo.kakao}</p>
            </div>

            {/* Social Links */}
            {/* <div className="flex gap-4 pt-4">
              <a
                href={contactInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full border border-gray-700 hover:border-white flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Visit our LinkedIn profile"
              >
                <Linkedin size={20} aria-hidden="true" />
              </a>
              <a
                href={contactInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full border border-gray-700 hover:border-white flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Visit our Instagram profile"
              >
                <Instagram size={20} aria-hidden="true" />
              </a>
            </div> */}
          </div>

          {/* Right Column - Contact Form */}
          <div 
            className="space-y-8" 
            onKeyPress={handleKeyPress}
            role="form"
            aria-label="Contact form"
          >
            {/* Name Fields */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label 
                  htmlFor="firstName" 
                  className="sr-only"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('firstName')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="First Name"
                  aria-required="true"
                  aria-invalid={errors.firstName ? 'true' : 'false'}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  className={`w-full px-4 py-4 bg-transparent border rounded-lg text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white ${
                    errors.firstName 
                      ? 'border-red-500' 
                      : focusedField === 'firstName' 
                        ? 'border-white' 
                        : 'border-gray-700'
                  }`}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="text-red-500 text-sm mt-1" role="alert">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label 
                  htmlFor="lastName" 
                  className="sr-only"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('lastName')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Last Name"
                  aria-required="true"
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  className={`w-full px-4 py-4 bg-transparent border rounded-lg text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white ${
                    errors.lastName 
                      ? 'border-red-500' 
                      : focusedField === 'lastName' 
                        ? 'border-white' 
                        : 'border-gray-700'
                  }`}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="text-red-500 text-sm mt-1" role="alert">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="sr-only"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="Email"
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full px-4 py-4 bg-transparent border rounded-lg text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white ${
                  errors.email 
                    ? 'border-red-500' 
                    : focusedField === 'email' 
                      ? 'border-white' 
                      : 'border-gray-700'
                }`}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label 
                htmlFor="message" 
                className="sr-only"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                placeholder="Message"
                rows={6}
                aria-required="true"
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className={`w-full px-4 py-4 bg-transparent border rounded-lg text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white resize-none ${
                  errors.message 
                    ? 'border-red-500' 
                    : focusedField === 'message' 
                      ? 'border-white' 
                      : 'border-gray-700'
                }`}
              />
              {errors.message && (
                <p id="message-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitted}
                className={`px-8 py-4 border-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black min-w-[140px] ${
                  submitted
                    ? 'bg-white text-black border-white cursor-not-allowed'
                    : 'bg-transparent text-white border-white hover:bg-white hover:text-black'
                }`}
                aria-label={submitted ? "Message sent successfully" : "Submit contact form"}
              >
                {submitted ? 'Submitted' : 'Submit'}
              </button>

              {/* Success Message */}
              {submitted && (
                <div 
                  className="flex items-center gap-2 text-white"
                  role="status"
                  aria-live="polite"
                >
                  <Check size={18} aria-hidden="true" />
                  <span>Your submission was successful.</span>
                </div>
              )}
            </div>
          </div>

        </div>
    </div>
  );
};

export default Contact;