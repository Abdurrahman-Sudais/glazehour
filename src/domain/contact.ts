export interface ContactForm {
  name: string;
  email: string;
  company: string;
  role: string;
  teamSize: string;
  message: string;
}

export const EMPTY_CONTACT: ContactForm = { name: '', email: '', company: '', role: '', teamSize: '', message: '' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(f: ContactForm): Partial<Record<keyof ContactForm, string>> {
  const e: Partial<Record<keyof ContactForm, string>> = {};
  if (f.name.trim().length < 2) e.name = 'Enter your name.';
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Enter a valid work email address.';
  if (f.company.trim().length < 2) e.company = 'Enter your company or facility.';
  if (!f.teamSize) e.teamSize = 'Select a team size.';
  if (f.message.trim().length < 20) e.message = 'Tell us a little more (at least 20 characters).';
  if (f.message.length > 2000) e.message = 'Keep your message under 2,000 characters.';
  return e;
}
