import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    AlertTriangle,
    Bell,
    Check,
    CheckCircle2,
    Globe,
    KeyRound,
    LockKeyhole,
    Mail,
    Monitor,
    RefreshCcw,
    ShieldCheck,
    Smartphone,
    SlidersHorizontal,
    X,
} from "lucide-react";

/* ======================== CONFIG ======================== */

const NOTIFICATIONS_KEY = "teachlive.trainerSettings.notifications.v1";
const PRIVACY_KEY = "teachlive.trainerSettings.privacy.v1";

const DEFAULT_NOTIFICATIONS = {
    emailUpdates: true,
    classReminders: true,
    assignmentUpdates: true,
    payoutUpdates: true,
    browserNotifications: false,
    productUpdates: false,
};

const DEFAULT_PRIVACY = {
    profileVisible: true,
    showEmail: false,
    usageDiagnostics: false,
};

const TABS = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & security", icon: ShieldCheck },
];

/* ======================== STORAGE ======================== */

function readSettings(key, defaults) {
    if (typeof window === "undefined") return defaults;

    try {
        const saved = JSON.parse(localStorage.getItem(key) || "null");

        if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
            return defaults;
        }

        return { ...defaults, ...saved };
    } catch {
        return defaults;
    }
}

function writeSettings(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}

/* ======================== REUSABLE UI ======================== */

function SettingsSection({ icon: Icon, title, description, children }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start gap-3 border-b border-slate-100 p-5 sm:p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon size={19} />
                </div>

                <div className="min-w-0">
                    <h2 className="font-bold text-slate-950">{title}</h2>
                    {description && (
                        <p className="mt-1 text-sm leading-5 text-slate-500">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <div className="p-5 sm:p-6">{children}</div>
        </section>
    );
}

function Field({ label, hint, children }) {
    return (
        <div className="min-w-0">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>
            {children}
            {hint && (
                <p className="mt-1.5 text-xs leading-5 text-slate-500">{hint}</p>
            )}
        </div>
    );
}

function Toggle({ label, description, checked, onChange }) {
    return (
        <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
            <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                    {description}
                </p>
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={label}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 ${checked ? "bg-emerald-600" : "bg-slate-300"
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-1"
                        }`}
                />
            </button>
        </div>
    );
}

function Notice({ children, tone = "blue" }) {
    const styles = {
        blue: "border-sky-100 bg-sky-50 text-sky-800",
        amber: "border-amber-100 bg-amber-50 text-amber-800",
        green: "border-emerald-100 bg-emerald-50 text-emerald-800",
    };

    return (
        <div className={`flex items-start gap-2 rounded-xl border p-3 text-xs leading-5 ${styles[tone]}`}>
            <ShieldCheck size={15} className="mt-0.5 shrink-0" />
            <p>{children}</p>
        </div>
    );
}

/* ======================== MAIN PAGE ======================== */

export default function TrainerSettingsPage() {
    const reduceMotion = useReducedMotion();

    const [notifications, setNotifications] = useState(() =>
        readSettings(NOTIFICATIONS_KEY, DEFAULT_NOTIFICATIONS),
    );

    const [privacy, setPrivacy] = useState(() =>
        readSettings(PRIVACY_KEY, DEFAULT_PRIVACY),
    );

    const [activeTab, setActiveTab] = useState("notifications");
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = window.setTimeout(() => setToast(null), 3000);
        return () => window.clearTimeout(timer);
    }, [toast]);

    useEffect(() => {
        writeSettings(NOTIFICATIONS_KEY, notifications);
    }, [notifications]);

    useEffect(() => {
        writeSettings(PRIVACY_KEY, privacy);
    }, [privacy]);

    const notify = (message, tone = "success") => {
        setToast({ id: Date.now(), message, tone });
    };

    const resetSettings = () => {
        const confirmed = window.confirm(
            "Reset notification and privacy preferences to their defaults? Your profile will remain unchanged.",
        );

        if (!confirmed) return;

        setNotifications(DEFAULT_NOTIFICATIONS);
        setPrivacy(DEFAULT_PRIVACY);
        notify("Notification and privacy preferences reset.");
    };

    return (
        <div className="min-h-screen min-w-0 bg-[#f5faf8] text-slate-800">
            <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
                {/* Header */}
{/* Tabs */}

                <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                    {TABS.map(({ id, label, icon: Icon }) => {
                        const active = activeTab === id;

                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setActiveTab(id)}
                                aria-pressed={active}
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${active
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                                    }`}
                            >
                                <Icon size={17} />
                                {label}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                    {/* ================= NOTIFICATIONS ================= */}

                    {activeTab === "notifications" && (
                        <motion.div
                            key="notifications"
                            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
                            className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_0.7fr]"
                        >
                            <SettingsSection
                                icon={Bell}
                                title="Notification preferences"
                                description="Choose which updates you want to receive."
                            >
                                <div className="divide-y divide-slate-100">
                                    <Toggle
                                        label="Email updates"
                                        description="Receive account and workspace updates by email."
                                        checked={notifications.emailUpdates}
                                        onChange={(value) =>
                                            setNotifications((current) => ({
                                                ...current,
                                                emailUpdates: value,
                                            }))
                                        }
                                    />

                                    <Toggle
                                        label="Class reminders"
                                        description="Keep reminders for upcoming teaching sessions enabled."
                                        checked={notifications.classReminders}
                                        onChange={(value) =>
                                            setNotifications((current) => ({
                                                ...current,
                                                classReminders: value,
                                            }))
                                        }
                                    />

                                    <Toggle
                                        label="Assignment updates"
                                        description="Stay informed about student submissions and reviews."
                                        checked={notifications.assignmentUpdates}
                                        onChange={(value) =>
                                            setNotifications((current) => ({
                                                ...current,
                                                assignmentUpdates: value,
                                            }))
                                        }
                                    />

                                    <Toggle
                                        label="Payout updates"
                                        description="Track payout status and earnings activity."
                                        checked={notifications.payoutUpdates}
                                        onChange={(value) =>
                                            setNotifications((current) => ({
                                                ...current,
                                                payoutUpdates: value,
                                            }))
                                        }
                                    />

                                    <Toggle
                                        label="Browser notifications"
                                        description="Save your preference for browser alerts."
                                        checked={notifications.browserNotifications}
                                        onChange={(value) =>
                                            setNotifications((current) => ({
                                                ...current,
                                                browserNotifications: value,
                                            }))
                                        }
                                    />

                                    <Toggle
                                        label="Product announcements"
                                        description="Optional feature updates and platform announcements."
                                        checked={notifications.productUpdates}
                                        onChange={(value) =>
                                            setNotifications((current) => ({
                                                ...current,
                                                productUpdates: value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="mt-5 flex items-start gap-2 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
                                    <CheckCircle2
                                        size={15}
                                        className="mt-0.5 shrink-0 text-emerald-600"
                                    />
                                    Preferences save automatically in this browser. Actual
                                    delivery depends on the email service and browser permissions
                                    being implemented.
                                </div>
                            </SettingsSection>

                            <div className="space-y-6">
                                <SettingsSection
                                    icon={Mail}
                                    title="Delivery channels"
                                    description="Understand where notifications would be delivered."
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                                <Mail size={18} />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-slate-800">Email</p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Requires a configured email service.
                                                </p>
                                            </div>
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                                                Not connected
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                                                <Monitor size={18} />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-slate-800">Browser</p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Requires permission and notification logic.
                                                </p>
                                            </div>
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                                                Not connected
                                            </span>
                                        </div>
                                    </div>
                                </SettingsSection>

                                <Notice tone="amber">
                                    Switching on a preference stores your choice; it does not
                                    send real emails or browser notifications until the delivery
                                    services are integrated.
                                </Notice>
                            </div>
                        </motion.div>
                    )}

                    {/* ================= PRIVACY & SECURITY ================= */}

                    {activeTab === "privacy" && (
                        <motion.div
                            key="privacy"
                            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
                            className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_0.7fr]"
                        >
                            <div className="space-y-6">
                                <SettingsSection
                                    icon={ShieldCheck}
                                    title="Privacy preferences"
                                    description="Manage the display and optional data-sharing preferences."
                                >
                                    <div className="divide-y divide-slate-100">
                                        <Toggle
                                            label="Show profile to students"
                                            description="Preference for whether your trainer profile should be visible to students."
                                            checked={privacy.profileVisible}
                                            onChange={(value) =>
                                                setPrivacy((current) => ({
                                                    ...current,
                                                    profileVisible: value,
                                                }))
                                            }
                                        />

                                        <Toggle
                                            label="Display email on profile"
                                            description="Preference for displaying your email in a public-facing profile."
                                            checked={privacy.showEmail}
                                            onChange={(value) =>
                                                setPrivacy((current) => ({
                                                    ...current,
                                                    showEmail: value,
                                                }))
                                            }
                                        />

                                        <Toggle
                                            label="Share anonymous diagnostics"
                                            description="Preference for optional, non-identifying product diagnostics."
                                            checked={privacy.usageDiagnostics}
                                            onChange={(value) =>
                                                setPrivacy((current) => ({
                                                    ...current,
                                                    usageDiagnostics: value,
                                                }))
                                            }
                                        />
                                    </div>

                                    <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
                                        These switches are saved locally and are not enforced by a
                                        server. Visibility and data collection controls must also
                                        be validated by the backend.
                                    </p>
                                </SettingsSection>

                                <SettingsSection
                                    icon={LockKeyhole}
                                    title="Account security"
                                    description="Recommended safeguards for your TeachLive account."
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                                <KeyRound size={17} />
                                            </span>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Password management
                                                </p>
                                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                                    Password changes must go through a secure
                                                    server-verified flow. This demo does not change or
                                                    store passwords.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                                                <ShieldCheck size={17} />
                                            </span>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Sign-in protection
                                                </p>
                                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                                    Use a strong, unique password and enable
                                                    multi-factor authentication when your account
                                                    provider supports it.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                                                <Smartphone size={17} />
                                            </span>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Active sessions
                                                </p>
                                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                                    Session listing and remote sign-out require backend
                                                    session management and are not available in this
                                                    frontend demo.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </SettingsSection>
                            </div>

                            <div className="space-y-6">
                                <SettingsSection
                                    icon={Globe}
                                    title="Privacy overview"
                                    description="Review how these demo preferences are stored."
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                                            <span className="text-sm text-slate-600">Profile preferences</span>
                                            <span className="text-xs font-bold text-emerald-700">Browser</span>
                                        </div>

                                        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                                            <span className="text-sm text-slate-600">Notification preferences</span>
                                            <span className="text-xs font-bold text-emerald-700">Browser</span>
                                        </div>

                                        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                                            <span className="text-sm text-slate-600">Privacy preferences</span>
                                            <span className="text-xs font-bold text-emerald-700">Browser</span>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-xs leading-5 text-slate-500">
                                        Anyone with access to this browser profile may be able to
                                        inspect locally stored preferences. Do not store secrets
                                        or sensitive financial details here.
                                    </p>
                                </SettingsSection>

                                <section className="overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-sm">
                                    <div className="flex items-start gap-3 border-b border-rose-100 bg-rose-50/70 p-5">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-600 ring-1 ring-rose-100">
                                            <AlertTriangle size={19} />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-slate-900">Reset preferences</h2>
                                            <p className="mt-1 text-sm leading-5 text-slate-500">
                                                Restore notification and privacy preferences to their
                                                default values.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <p className="text-xs leading-5 text-slate-500">
                                            Your profile information and payment records will not be
                                            changed by this action.
                                        </p>

                                        <button
                                            type="button"
                                            onClick={resetSettings}
                                            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                                        >
                                            <RefreshCcw size={15} />
                                            Reset preferences
                                        </button>
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Toast */}

            <AnimatePresence>
                {toast && (
                    <motion.div
                        key={toast.id}
                        role="status"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className={`fixed bottom-4 left-4 right-4 z-[120] mx-auto flex max-w-md items-start gap-3 rounded-2xl border bg-white p-4 shadow-2xl sm:left-auto sm:right-6 ${toast.tone === "error"
                            ? "border-rose-200"
                            : "border-emerald-200"
                            }`}
                    >
                        <CheckCircle2
                            size={19}
                            className="mt-0.5 shrink-0 text-emerald-600"
                        />

                        <p className="min-w-0 flex-1 text-sm font-semibold text-slate-800">
                            {toast.message}
                        </p>

                        <button
                            type="button"
                            onClick={() => setToast(null)}
                            aria-label="Dismiss message"
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                        >
                            <X size={15} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

