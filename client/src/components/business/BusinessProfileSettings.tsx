import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Globe2,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  Tags,
} from 'lucide-react';
import { ApiError } from '../../services/enquiry.api';
import { fetchBusinessProfile, updateBusinessProfile } from '../../services/businessProfile.api';
import type { BusinessProfile, UpdateBusinessProfilePayload, UserProfile } from '../../types';

interface BusinessProfileSettingsProps {
  currentUser: UserProfile;
}

type ProfileForm = UpdateBusinessProfilePayload;

const emptyForm: ProfileForm = {
  businessName: '',
  tagline: '',
  description: '',
  contact: { email: '', phone: '', website: '' },
  location: { address: '', city: '', state: '', postalCode: '', country: '' },
  categories: [],
};

function toForm(profile: BusinessProfile): ProfileForm {
  return {
    businessName: profile.businessName ?? '',
    tagline: profile.tagline ?? '',
    description: profile.description ?? '',
    contact: {
      email: profile.contact?.email ?? '',
      phone: profile.contact?.phone ?? '',
      website: profile.contact?.website ?? '',
    },
    location: {
      address: profile.location?.address ?? '',
      city: profile.location?.city ?? '',
      state: profile.location?.state ?? '',
      postalCode: profile.location?.postalCode ?? '',
      country: profile.location?.country ?? '',
    },
    categories: [...(profile.categories ?? [])],
  };
}

function validateForm(form: ProfileForm): string | null {
  if (form.businessName.trim().length < 2) return 'Business name must be at least 2 characters.';
  if (form.businessName.trim().length > 100) return 'Business name cannot exceed 100 characters.';
  if (form.tagline.trim().length > 150) return 'Tagline cannot exceed 150 characters.';
  if (form.description.trim().length > 2000) return 'Description cannot exceed 2000 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact.email.trim())) {
    return 'Enter a valid business contact email.';
  }
  if (form.contact.email.trim().length > 120) return 'Contact email cannot exceed 120 characters.';
  if (form.contact.phone.trim().length > 30) return 'Phone cannot exceed 30 characters.';
  if (form.contact.website.trim().length > 200) return 'Website cannot exceed 200 characters.';
  if (form.location.address.trim().length > 200) return 'Address cannot exceed 200 characters.';
  if (form.location.city.trim().length < 1 || form.location.city.trim().length > 100) {
    return 'City is required and cannot exceed 100 characters.';
  }
  if (form.location.state.trim().length > 100) return 'State cannot exceed 100 characters.';
  if (form.location.postalCode.trim().length > 20) return 'Postal code cannot exceed 20 characters.';
  if (form.location.country.trim().length > 100) return 'Country cannot exceed 100 characters.';
  if (form.categories.length < 1 || form.categories.length > 15) {
    return 'Add between 1 and 15 service categories.';
  }
  if (form.categories.some((category) => category.trim().length < 2 || category.trim().length > 50)) {
    return 'Each category must be between 2 and 50 characters.';
  }
  return null;
}

function messageForError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.statusCode === 401) return 'Your session has expired. Sign in again to manage this profile.';
    if (error.statusCode === 404) return 'No business profile is available for this account yet.';
    return error.serverMessage;
  }
  return error instanceof Error ? error.message : 'Could not reach the profile service. Try again.';
}

const inputClass =
  'mt-2 w-full rounded-xl border border-white/10 bg-[#080C1B] px-3.5 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-60';
const labelClass = 'block text-sm font-medium text-slate-200';

export function BusinessProfileSettings({ currentUser }: BusinessProfileSettingsProps) {
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [categoriesText, setCategoriesText] = useState('');

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setSaved(false);
    try {
      const profile = await fetchBusinessProfile();
      if (profile.businessId !== currentUser.businessId) {
        throw new Error('The profile response did not match the signed-in business. Sign in again and retry.');
      }
      const nextForm = toForm(profile);
      setForm(nextForm);
      setCategoriesText(nextForm.categories.join(', '));
    } catch (error) {
      setLoadError(messageForError(error));
    } finally {
      setLoading(false);
    }
  }, [currentUser.businessId]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const setField = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setSaveError(null);
    setValidationError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(false);
    setSaveError(null);
    const categories = categoriesText
      .split(/[\n,]/)
      .map((category) => category.trim())
      .filter(Boolean);
    const payload: ProfileForm = { ...form, categories };
    const validation = validateForm(payload);
    if (validation) {
      setValidationError(validation);
      return;
    }

    setValidationError(null);
    setSaving(true);
    try {
      const confirmedProfile = await updateBusinessProfile(payload);
      const confirmedForm = toForm(confirmedProfile);
      setForm(confirmedForm);
      setCategoriesText(confirmedForm.categories.join(', '));
      setSaved(true);
    } catch (error) {
      setSaveError(messageForError(error));
    } finally {
      setSaving(false);
    }
  };

  const updateContact = (key: keyof ProfileForm['contact'], value: string) => {
    setForm((current) => ({ ...current, contact: { ...current.contact, [key]: value } }));
    setSaved(false);
    setSaveError(null);
    setValidationError(null);
  };

  const updateLocation = (key: keyof ProfileForm['location'], value: string) => {
    setForm((current) => ({ ...current, location: { ...current.location, [key]: value } }));
    setSaved(false);
    setSaveError(null);
    setValidationError(null);
  };

  return (
    <section aria-labelledby="business-profile-title" className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-[#171633] via-[#10152D] to-[#0D1126] p-5 sm:p-7 shadow-card">
        <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Workspace settings</p>
            <h2 id="business-profile-title" className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Business profile</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Keep your service details and contact information current for your team.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
            <Building2 className="h-4 w-4 text-violet-300" aria-hidden="true" />
            <span className="max-w-[200px] truncate">{currentUser.businessName}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div role="status" className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#0D1126] text-sm text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-violet-300" aria-hidden="true" />
          Loading your business profile…
        </div>
      ) : loadError ? (
        <div role="alert" className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-rose-100">Profile could not be loaded</h3>
              <p className="mt-1 text-sm text-rose-200/80">{loadError}</p>
              <button type="button" onClick={() => void loadProfile()} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-300/20 px-3 text-sm font-medium text-rose-100 hover:bg-rose-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-300">
                <RefreshCw className="h-4 w-4" aria-hidden="true" /> Try again
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-[#0D1126] p-5 sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-white/[0.07] pb-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300"><Building2 className="h-5 w-5" aria-hidden="true" /></span>
              <div><h3 className="font-semibold text-white">Business details</h3><p className="mt-1 text-sm text-slate-400">The basics your team uses to represent the business.</p></div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className={labelClass}>Business name <span className="text-rose-300" aria-hidden="true">*</span>
                <input className={inputClass} value={form.businessName} onChange={(e) => setField('businessName', e.target.value)} maxLength={100} required autoComplete="organization" />
              </label>
              <label className={labelClass}>Tagline <span className="font-normal text-slate-500">(optional)</span>
                <input className={inputClass} value={form.tagline} onChange={(e) => setField('tagline', e.target.value)} maxLength={150} placeholder="A short description of your services" />
              </label>
              <label className={`${labelClass} md:col-span-2`}>Description <span className="font-normal text-slate-500">(optional)</span>
                <textarea className={`${inputClass} min-h-28 resize-y`} value={form.description} onChange={(e) => setField('description', e.target.value)} maxLength={2000} rows={4} />
                <span className="mt-1 block text-right text-xs text-slate-500">{form.description.length}/2000</span>
              </label>
              <label className={`${labelClass} md:col-span-2`}>
                <span className="inline-flex items-center gap-2"><Tags className="h-4 w-4 text-cyan-300" aria-hidden="true" /> Service categories</span>
                <textarea className={`${inputClass} min-h-20 resize-y`} value={categoriesText} onChange={(e) => { setCategoriesText(e.target.value); setSaved(false); setSaveError(null); setValidationError(null); }} rows={2} placeholder="Repairs, Installation, Maintenance" aria-describedby="categories-help" />
                <span id="categories-help" className="mt-1 block text-xs font-normal text-slate-500">Separate categories with commas or new lines. Add 1–15 categories.</span>
              </label>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#0D1126] p-5 sm:p-7">
              <div className="mb-6 flex items-start gap-3 border-b border-white/[0.07] pb-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300"><Globe2 className="h-5 w-5" aria-hidden="true" /></span>
                <div><h3 className="font-semibold text-white">Contact information</h3><p className="mt-1 text-sm text-slate-400">How customers or partners can reach your business.</p></div>
              </div>
              <div className="space-y-4">
                <label className={labelClass}>Contact email
                  <input type="email" className={inputClass} value={form.contact.email} onChange={(e) => updateContact('email', e.target.value)} maxLength={120} required autoComplete="email" />
                </label>
                <label className={labelClass}><span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" aria-hidden="true" /> Phone</span>
                  <input type="tel" className={inputClass} value={form.contact.phone} onChange={(e) => updateContact('phone', e.target.value)} maxLength={30} autoComplete="tel" />
                </label>
                <label className={labelClass}>Website
                  <input type="url" className={inputClass} value={form.contact.website} onChange={(e) => updateContact('website', e.target.value)} maxLength={200} placeholder="https://example.com" autoComplete="url" />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0D1126] p-5 sm:p-7">
              <div className="mb-6 flex items-start gap-3 border-b border-white/[0.07] pb-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300"><MapPin className="h-5 w-5" aria-hidden="true" /></span>
                <div><h3 className="font-semibold text-white">Business location</h3><p className="mt-1 text-sm text-slate-400">Your primary service area details.</p></div>
              </div>
              <div className="space-y-4">
                <label className={labelClass}>Street address <span className="font-normal text-slate-500">(optional)</span>
                  <input className={inputClass} value={form.location.address} onChange={(e) => updateLocation('address', e.target.value)} maxLength={200} autoComplete="street-address" />
                </label>
                <label className={labelClass}>City / service area <span className="text-rose-300" aria-hidden="true">*</span>
                  <input className={inputClass} value={form.location.city} onChange={(e) => updateLocation('city', e.target.value)} maxLength={100} required autoComplete="address-level2" />
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className={labelClass}>State / region
                    <input className={inputClass} value={form.location.state} onChange={(e) => updateLocation('state', e.target.value)} maxLength={100} autoComplete="address-level1" />
                  </label>
                  <label className={labelClass}>Postal code
                    <input className={inputClass} value={form.location.postalCode} onChange={(e) => updateLocation('postalCode', e.target.value)} maxLength={20} autoComplete="postal-code" />
                  </label>
                </div>
                <label className={labelClass}>Country / region
                  <input className={inputClass} value={form.location.country} onChange={(e) => updateLocation('country', e.target.value)} maxLength={100} autoComplete="country-name" />
                </label>
              </div>
            </div>
          </div>

          {(validationError || saveError) && (
            <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{validationError ?? saveError}</span>
            </div>
          )}
          {saved && (
            <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-sm text-emerald-200">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Profile saved. The server confirmed your changes.
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">Profile details are saved to your business account only.</p>
            <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
              {saving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
