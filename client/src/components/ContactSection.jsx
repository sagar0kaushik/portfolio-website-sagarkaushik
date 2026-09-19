import React, { useState } from 'react';
import { Mail, Phone, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { api } from '../services/api';

export const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'submitting', message: '' });

    try {
      const res = await api.sendContact(formData);
      if (res.success) {
        setStatus({
          state: 'success',
          message: res.message || 'Thank you, Sagar has received your message and will respond promptly.'
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({
          state: 'error',
          message: res.message || 'Could not send message. Please email sagarkaushik.work@gmail.com directly.'
        });
      }
    } catch (err) {
      setStatus({
        state: 'error',
        message: 'Network issue. Please reach out to sagarkaushik.work@gmail.com directly.'
      });
    }
  };

  return (
    <section className="contact-section" id="contact">
      {/* Animated Graphic Orbit in Background */}
      <div className="contact-orbit animate-orbit-slow" aria-hidden="true" />

      {/* Heading & Form Container */}
      <div className="contact-heading">
        {/* Left: Info */}
        <div>
          <div className="section-label mb-4 flip-on-scroll">
            <span>05</span>
            <span>Contact</span>
          </div>

          <h2 className="flip-on-scroll reveal-stagger-1">
            Let’s build
            <br />
            <em>something useful.</em>
          </h2>

          <p className="flip-on-scroll reveal-stagger-2">
            Tell me what you’re building, what’s stuck, or what you want to make better.
          </p>

          <div className="contact-details flip-on-scroll reveal-stagger-3">
            <a
              href="mailto:sagarkaushik.work@gmail.com"
              data-testid="link-contact-email"
              className="hover:text-[var(--blue)]"
            >
              <Mail className="w-4 h-4 text-[var(--blue)] shrink-0" />
              <span>sagarkaushik.work@gmail.com</span>
            </a>

            <a
              href="tel:6377329766"
              className="hover:text-[var(--blue)]"
            >
              <Phone className="w-4 h-4 text-[var(--blue)] shrink-0" />
              <span>+91 6377329766</span>
            </a>

            <a
              href="https://github.com/sagar0kaushik"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--blue)]"
            >
              <Github className="w-4 h-4 text-[var(--blue)] shrink-0" />
              <span>github.com/sagar0kaushik</span>
              <ArrowUpRight className="w-3 h-3 text-[var(--ink-soft)]" />
            </a>

            <a
              href="https://www.linkedin.com/in/sagar-kaushik-21a833298/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--blue)]"
            >
              <Linkedin className="w-4 h-4 text-[var(--blue)] shrink-0" />
              <span>linkedin.com/in/sagar-kaushik</span>
              <ArrowUpRight className="w-3 h-3 text-[var(--ink-soft)]" />
            </a>
          </div>
        </div>

        {/* Right: Interactive Form */}
        <div className="flip-on-scroll reveal-stagger-2">
          {status.state === 'success' ? (
            <div className="p-8 bg-[var(--paper)] border border-emerald-300 rounded-lg space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold font-display text-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>Message Transmitted Successfully</span>
              </div>
              <p className="text-sm text-[var(--ink-soft)] font-body">
                {status.message}
              </p>
              <button
                type="button"
                onClick={() => setStatus({ state: 'idle', message: '' })}
                className="font-mono text-xs text-[var(--blue)] underline pt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              {status.state === 'error' && (
                <div className="p-4 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-mono rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{status.message}</span>
                </div>
              )}

              <div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="What are you looking to build or collaborate on?"
                />
              </div>

              <button
                type="submit"
                disabled={status.state === 'submitting'}
              >
                <span>{status.state === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
