'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, MessageCircle, HelpCircle, Building2 } from 'lucide-react';

const contactOptions = [
  {
    icon: HelpCircle,
    title: 'Support',
    description: 'Get help with technical issues or API questions',
    action: 'support@fairtradeworker.com',
    href: 'mailto:support@fairtradeworker.com'
  },
  {
    icon: Building2,
    title: 'Sales',
    description: 'Learn about Enterprise plans and partnerships',
    action: 'sales@fairtradeworker.com',
    href: 'mailto:sales@fairtradeworker.com'
  },
  {
    icon: MessageCircle,
    title: 'Press',
    description: 'Media inquiries and press kit requests',
    action: 'press@fairtradeworker.com',
    href: 'mailto:press@fairtradeworker.com'
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Get in{' '}
              <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you. Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact options */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactOptions.map((option) => (
              <a
                key={option.title}
                href={option.href}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary-200 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
                  <option.icon className="w-6 h-6 text-accent group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                <span className="text-accent font-medium">{option.action}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
            
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
                      placeholder="Acme Inc."
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="">Select a topic</option>
                      <option value="sales">Sales inquiry</option>
                      <option value="support">Technical support</option>
                      <option value="partnership">Partnership opportunity</option>
                      <option value="feedback">General feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-white py-3 px-6 rounded-lg font-semibold hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Additional info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <Mail className="w-6 h-6 text-accent mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Email</h3>
              <p className="text-gray-600">hello@fairtradeworker.com</p>
            </div>
            <div>
              <Phone className="w-6 h-6 text-accent mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Phone</h3>
              <p className="text-gray-600">+1 (888) 555-0123</p>
            </div>
            <div>
              <MapPin className="w-6 h-6 text-accent mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Office</h3>
              <p className="text-gray-600">Austin, TX</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
