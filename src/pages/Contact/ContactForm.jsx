import React, { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui';
import { submitContactMessage } from '../../services/contact';

const ContactForm = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [errors, setErrors] = useState({});

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
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Saves to Supabase 'contact_messages'
      // 2. Sends HTML notification email via Resend to Mahmoudaboheussin57@gmail.com
      await submitContactMessage({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });

      setSubmitted(true);
      
      // Reset form fields after 4 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          message: ''
        });
      }, 4000);
    } catch (err) {
      console.error('Contact submission error:', err);
      setSubmitError(
        err?.message || 'Unable to deliver your message at this time. Please try again or email directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`space-y-8 ${className}`} 
      onKeyDown={handleKeyPress}
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
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={errors.firstName ? 'true' : 'false'}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            className={`w-full px-4 py-4 bg-transparent border rounded-lg text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 ${
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
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={errors.lastName ? 'true' : 'false'}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            className={`w-full px-4 py-4 bg-transparent border rounded-lg text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 ${
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
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={`w-full px-4 py-4 bg-transparent border rounded-lg text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 ${
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
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={`w-full px-4 py-4 bg-transparent border rounded-lg text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white resize-none disabled:opacity-50 ${
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

      {/* Error Banner */}
      {submitError && (
        <div 
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm"
          role="alert"
        >
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex flex-col items-end gap-4 pt-4">
        <Button
          type="submit"
          variant="outline"
          size="lg"
          isLoading={isSubmitting}
          disabled={submitted || isSubmitting}
          className="min-w-[140px]"
          aria-label={submitted ? "Message sent successfully" : "Submit contact form"}
        >
          {submitted ? 'Submitted' : 'Submit'}
        </Button>

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
    </form>
  );
};

export default ContactForm;
