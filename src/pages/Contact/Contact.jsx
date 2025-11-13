import React, { useState } from 'react';
import { Mail, Send, X } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    topic: '',
    message: ''
  });

  const [focusedField, setFocusedField] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.topic || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Handle form submission here
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        company: '',
        topic: '',
        message: ''
      });
    }, 3000);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      company: '',
      topic: '',
      message: ''
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl">
        
        {/* Contact Form Card */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Mail className="text-white" size={24} aria-hidden="true" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Contact Spectra Post
              </h1>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              aria-label="Close and reset form"
            >
              <X size={18} aria-hidden="true" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 space-y-6" onKeyPress={handleKeyPress}>
            
            {/* Full Name */}
            <div className="space-y-2">
              <label 
                htmlFor="fullName" 
                className="block text-sm font-medium text-gray-300"
              >
                Full name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField(null)}
                required
                className={`w-full px-4 py-3 bg-gray-950 border rounded-xl text-white placeholder-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  focusedField === 'fullName' ? 'border-blue-500' : 'border-gray-800'
                }`}
                placeholder="Enter your full name"
                aria-required="true"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-300"
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
                required
                className={`w-full px-4 py-3 bg-gray-950 border rounded-xl text-white placeholder-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  focusedField === 'email' ? 'border-blue-500' : 'border-gray-800'
                }`}
                placeholder="your.email@example.com"
                aria-required="true"
              />
            </div>

            {/* Company (Optional) */}
            <div className="space-y-2">
              <label 
                htmlFor="company" 
                className="block text-sm font-medium text-gray-300"
              >
                Company (optional)
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                onFocus={() => setFocusedField('company')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 bg-gray-950 border rounded-xl text-white placeholder-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  focusedField === 'company' ? 'border-blue-500' : 'border-gray-800'
                }`}
                placeholder="Your company name"
              />
            </div>

            {/* Topic */}
            <div className="space-y-2">
              <label 
                htmlFor="topic" 
                className="block text-sm font-medium text-gray-300"
              >
                Topic
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                onFocus={() => setFocusedField('topic')}
                onBlur={() => setFocusedField(null)}
                required
                className={`w-full px-4 py-3 bg-gray-950 border rounded-xl text-white placeholder-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  focusedField === 'topic' ? 'border-blue-500' : 'border-gray-800'
                }`}
                placeholder="What would you like to discuss?"
                aria-required="true"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label 
                htmlFor="message" 
                className="block text-sm font-medium text-gray-300"
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
                required
                rows={6}
                className={`w-full px-4 py-3 bg-gray-950 border rounded-xl text-white placeholder-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  focusedField === 'message' ? 'border-blue-500' : 'border-gray-800'
                }`}
                placeholder="Tell us more about your project..."
                aria-required="true"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitted}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  submitted
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/50'
                }`}
                aria-label="Send message"
              >
                {submitted ? (
                  <>
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                    <span>Message sent!</span>
                  </>
                ) : (
                  <>
                    <Send size={18} aria-hidden="true" />
                    <span>Send message</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-400 text-sm">
            We typically respond within 24 hours during business days
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <a 
              href="mailto:inquiries@spectrapost.com" 
              className="hover:text-gray-300 transition-colors"
              aria-label="Email us at inquiries@spectrapost.com"
            >
              inquiries@spectrapost.com
            </a>
            <span aria-hidden="true">•</span>
            <a 
              href="tel:+15551234567" 
              className="hover:text-gray-300 transition-colors"
              aria-label="Call us at +1 (555) 123-4567"
            >
              +1 (555) 123-4567
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;