import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    AlertCircle,
    BookOpen,
    Check,
    CheckCircle2,
    ChevronDown,
    CircleHelp,
    Clock3,
    CreditCard,
    FileText,
    Filter,
    LifeBuoy,
    MessageCircle,
    Search,
    Send,
    ShieldCheck,
    SlidersHorizontal,
    Ticket,
    X,
} from "lucide-react";

/* ======================== CONFIG ======================== */

const TICKETS_KEY = "teachlive.trainerSupportTickets.v1";

const TOPICS = [
    "All topics",
    "Payments",
    "Sessions",
    "Students",
    "Account",
    "Technical",
];

const TICKET_TOPICS = TOPICS.filter(
    (topic) => topic !== "All topics",
).map((topic) => ({
    value: topic,
    label: topic,
}));

const PRIORITIES = [
    { value: "Normal", label: "Normal priority" },
    { value: "High", label: "High priority" },
];

const FAQS = [
    {
        id: "faq-1",
        category: "Payments",
        question: "Where can I check my earnings and payouts?",
        answer:
            "Open Payments & earnings from your trainer dashboard. You can review transaction records, payout history and the available balance. The current demo page uses sample data; real payout details require backend integration.",
    },
    {
        id: "faq-2",
        category: "Payments",
        question: "Why is a payout marked as pending?",
        answer:
            "Pending means the request has not been marked as completed. In a live system, check the payout details and contact support if the status does not update. Demo requests created in this browser do not transfer money.",
    },
    {
        id: "faq-3",
        category: "Sessions",
        question: "How can I review my upcoming classes?",
        answer:
            "Open your trainer schedule or availability page to review session times and the availability you have configured. If a class is missing, verify its schedule and contact support with the relevant details.",
    },
    {
        id: "faq-4",
        category: "Students",
        question: "Where can I check student progress?",
        answer:
            "Open the student progress area in your trainer workspace. Select the relevant student or batch to review the progress information available to your account.",
    },
    {
        id: "faq-5",
        category: "Account",
        question: "How do I update my trainer profile?",
        answer:
            "Open Settings and edit the profile fields available there. In this frontend demo, changes are saved in your current browser only; a connected account service is needed to update a server-side profile.",
    },
    {
        id: "faq-6",
        category: "Technical",
        question: "What should I do if a page does not load?",
        answer:
            "Refresh the page, check your internet connection and try signing in again if needed. If the issue continues, submit a support request with the page name, what you were doing and any visible error message. Do not include passwords or OTPs.",
    },
    {
        id: "faq-7",
        category: "Account",
        question: "Can I change my password from this page?",
        answer:
            "Password changes should be handled through a secure, authenticated account flow. Do not send your current password, OTP, recovery codes or other credentials through a support ticket.",
    },
];

const EMPTY_FORM = {
    name: "",
    email: "",
    category: "Technical",
    priority: "Normal",
    subject: "",
    message: "",
};

/* ======================== STORAGE ======================== */

function readTickets() {
    if (typeof window === "undefined") return [];

    try {
        const data = JSON.parse(
            localStorage.getItem(TICKETS_KEY) || "[]",
        );

        if (!Array.isArray(data)) return [];

        return data.filter(
            (item) =>
                item &&
                typeof item.id === "string" &&
                typeof item.subject === "string" &&
                typeof item.message === "string",
        );
    } catch {
        return [];
    }
}

/* ======================== PREMIUM DROPDOWN ======================== */

function PremiumDropdown({
    value,
    options,
    onChange,
    icon: Icon = Filter,
    label = "Select option",
    ariaLabel = "Select option",
}) {
    const triggerRef = useRef(null);
    const menuRef = useRef(null);
    const optionRefs = useRef([]);

    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState(null);

    const normalizedOptions = useMemo(
        () =>
            options.map((option) =>
                typeof option === "string"
                    ? { value: option, label: option }
                    : option,
            ),
        [options],
    );

    const selectedIndex = Math.max(
        0,
        normalizedOptions.findIndex(
            (option) => option.value === value,
        ),
    );

    const selected = normalizedOptions[selectedIndex];

    const updatePosition = useCallback(() => {
        const rect = triggerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const padding = 12;
        const gap = 8;

        const below = window.innerHeight - rect.bottom - padding;
        const above = rect.top - padding;

        const placement =
            below >= 210 || below >= above ? "bottom" : "top";

        const availableSpace = Math.max(
            90,
            placement === "bottom" ? below : above,
        );

        const width = Math.min(
            Math.max(rect.width, 240),
            window.innerWidth - 16,
        );

        const left = Math.max(
            8,
            Math.min(rect.left, window.innerWidth - width - 8),
        );

        setPosition({
            left,
            width,
            maxHeight: Math.min(300, availableSpace),
            top: rect.bottom + gap,
            bottom: window.innerHeight - rect.top + gap,
            placement,
        });
    }, []);

    useLayoutEffect(() => {
        if (!open) return undefined;

        updatePosition();

        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [open, updatePosition]);

    useEffect(() => {
        if (!open) return undefined;

        const handlePointerDown = (event) => {
            const target = event.target;

            if (
                !triggerRef.current?.contains(target) &&
                !menuRef.current?.contains(target)
            ) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener(
                "pointerdown",
                handlePointerDown,
            );
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    useEffect(() => {
        if (open) {
            optionRefs.current[selectedIndex]?.focus();
        }
    }, [open, selectedIndex]);

    const moveFocus = (currentIndex, direction) => {
        const nextIndex =
            (currentIndex + direction + normalizedOptions.length) %
            normalizedOptions.length;

        optionRefs.current[nextIndex]?.focus();
    };

    return (
        <>
            {/* Dropdown trigger */}

            <button
                ref={triggerRef}
                type="button"
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
                onKeyDown={(event) => {
                    if (event.key === "ArrowDown" && !open) {
                        event.preventDefault();
                        setOpen(true);
                    }
                }}
                className={`group flex min-h-[48px] w-full items-center gap-2.5 rounded-xl border bg-white px-3.5 py-2.5 text-left outline-none transition duration-200 focus-visible:ring-4 focus-visible:ring-emerald-100 ${open
                    ? "border-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.08)]"
                    : "border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md"
                    }`}
            >
                <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${open
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-50 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-700"
                        }`}
                >
                    <Icon size={16} />
                </span>

                <span className="min-w-0 flex-1">
                    <span className="block truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {label}
                    </span>

                    <span className="mt-0.5 block truncate text-sm font-semibold text-slate-800">
                        {selected?.label ?? String(value)}
                    </span>
                </span>

                <ChevronDown
                    size={16}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180 text-emerald-600" : ""
                        }`}
                />
            </button>

            {/* Dropdown portal */}

            {typeof document !== "undefined" &&
                createPortal(
                    <AnimatePresence>
                        {open && position && (
                            <motion.div
                                key="premium-dropdown"
                                ref={menuRef}
                                role="listbox"
                                aria-label={ariaLabel}
                                initial={{
                                    opacity: 0,
                                    y: position.placement === "top" ? 7 : -7,
                                    scale: 0.98,
                                }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.16 }}
                                style={{
                                    position: "fixed",
                                    zIndex: 9999,
                                    left: position.left,
                                    width: position.width,
                                    maxHeight: position.maxHeight,
                                    top:
                                        position.placement === "bottom"
                                            ? position.top
                                            : undefined,
                                    bottom:
                                        position.placement === "top"
                                            ? position.bottom
                                            : undefined,
                                    transformOrigin:
                                        position.placement === "top" ? "bottom" : "top",
                                }}
                                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.28)] ring-1 ring-black/[0.03]"
                            >
                                {/* Menu header */}

                                <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-gradient-to-r from-emerald-50/90 to-white px-4 py-3">
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-800">
                                            {label}
                                        </p>

                                        <p className="mt-0.5 text-[11px] text-slate-400">
                                            Choose an option
                                        </p>
                                    </div>

                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                                        <SlidersHorizontal size={14} />
                                    </span>
                                </div>

                                {/* Options: GREEN SCROLLBAR */}

                                <div
                                    className="teachlive-dropdown-green-scrollbar overflow-y-auto p-2"
                                    style={{
                                        maxHeight: Math.max(
                                            40,
                                            position.maxHeight - 62,
                                        ),
                                    }}
                                >
                                    {normalizedOptions.map((option, index) => {
                                        const active = option.value === value;

                                        return (
                                            <button
                                                ref={(element) => {
                                                    optionRefs.current[index] = element;
                                                }}
                                                key={option.value}
                                                type="button"
                                                role="option"
                                                aria-selected={active}
                                                tabIndex={0}
                                                onClick={() => {
                                                    onChange(option.value);
                                                    setOpen(false);
                                                    triggerRef.current?.focus();
                                                }}
                                                onKeyDown={(event) => {
                                                    if (event.key === "ArrowDown") {
                                                        event.preventDefault();
                                                        moveFocus(index, 1);
                                                    } else if (event.key === "ArrowUp") {
                                                        event.preventDefault();
                                                        moveFocus(index, -1);
                                                    } else if (event.key === "Home") {
                                                        event.preventDefault();
                                                        optionRefs.current[0]?.focus();
                                                    } else if (event.key === "End") {
                                                        event.preventDefault();
                                                        optionRefs.current[
                                                            normalizedOptions.length - 1
                                                        ]?.focus();
                                                    } else if (
                                                        event.key === "Enter" ||
                                                        event.key === " "
                                                    ) {
                                                        event.preventDefault();
                                                        onChange(option.value);
                                                        setOpen(false);
                                                        triggerRef.current?.focus();
                                                    }
                                                }}
                                                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition duration-150 focus-visible:ring-2 focus-visible:ring-emerald-400 ${active
                                                    ? "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-100"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                                                    }`}
                                            >
                                                <span
                                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${active
                                                        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                                                        : "bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-700"
                                                        }`}
                                                >
                                                    {active ? (
                                                        <Check size={15} />
                                                    ) : (
                                                        <span className="text-[10px] font-bold">
                                                            {String(index + 1).padStart(2, "0")}
                                                        </span>
                                                    )}
                                                </span>

                                                <span className="min-w-0 flex-1">
                                                    <span
                                                        className={`block truncate text-sm ${active ? "font-bold" : "font-medium"
                                                            }`}
                                                    >
                                                        {option.label}
                                                    </span>

                                                    {active && (
                                                        <span className="mt-0.5 block text-[10px] font-semibold text-emerald-600">
                                                            Currently selected
                                                        </span>
                                                    )}
                                                </span>

                                                {active && (
                                                    <CheckCircle2
                                                        size={16}
                                                        className="shrink-0 text-emerald-600"
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </>
    );
}

/* ======================== REUSABLE UI ======================== */

function Field({ label, hint, children }) {
    return (
        <div className="min-w-0">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>

            {children}

            {hint && (
                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                    {hint}
                </p>
            )}
        </div>
    );
}

function SupportStat({ icon: Icon, title, description }) {
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon size={19} />
            </div>

            <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                    {description}
                </p>
            </div>
        </div>
    );
}

/* ======================== MAIN PAGE ======================== */

export default function TrainerHelpSupportPage() {
    const reduceMotion = useReducedMotion();

    const [query, setQuery] = useState("");
    const [activeTopic, setActiveTopic] = useState("All topics");
    const [expandedFAQ, setExpandedFAQ] = useState("faq-1");
    const [form, setForm] = useState(EMPTY_FORM);
    const [tickets, setTickets] = useState(readTickets);
    const [toast, setToast] = useState("");

    useEffect(() => {
        try {
            localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
        } catch {
            // Keep the page usable when local storage is unavailable.
        }
    }, [tickets]);

    useEffect(() => {
        if (!toast) return undefined;

        const timer = window.setTimeout(() => setToast(""), 3200);
        return () => window.clearTimeout(timer);
    }, [toast]);

    const filteredFAQs = useMemo(() => {
        const term = query.trim().toLowerCase();

        return FAQS.filter((faq) => {
            const matchesTopic =
                activeTopic === "All topics" ||
                faq.category === activeTopic;

            const matchesQuery =
                !term ||
                `${faq.question} ${faq.answer} ${faq.category}`
                    .toLowerCase()
                    .includes(term);

            return matchesTopic && matchesQuery;
        });
    }, [query, activeTopic]);

    const updateForm = (key, value) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const submitTicket = (event) => {
        event.preventDefault();

        const name = form.name.trim();
        const email = form.email.trim();
        const subject = form.subject.trim();
        const message = form.message.trim();

        if (!name || !email || !subject || !message) {
            setToast("Please complete all required fields.");
            return;
        }

        const ticket = {
            id: `TL-${Date.now().toString(36).toUpperCase()}`,
            name,
            email,
            category: form.category,
            priority: form.priority,
            subject,
            message,
            status: "Received locally",
            createdAt: new Date().toISOString(),
        };

        setTickets((current) => [ticket, ...current].slice(0, 20));
        setForm(EMPTY_FORM);
        setToast(`Demo ticket ${ticket.id} saved in this browser.`);
    };

    return (
        <div className="min-h-screen min-w-0 bg-[#f5faf8] text-slate-800">
            {/* GREEN SCROLLBAR CSS: dropdown list only */}

            <style>{`
        .teachlive-dropdown-green-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #10b981 #ecfdf5;
          scrollbar-gutter: stable;
        }

        .teachlive-dropdown-green-scrollbar::-webkit-scrollbar {
          width: 9px;
          height: 9px;
        }

        .teachlive-dropdown-green-scrollbar::-webkit-scrollbar-track {
          background: #ecfdf5;
          border-radius: 999px;
        }

        .teachlive-dropdown-green-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            #34d399 0%,
            #059669 100%
          );
          border: 2px solid #ecfdf5;
          border-radius: 999px;
          min-height: 35px;
        }

        .teachlive-dropdown-green-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #047857;
        }

        .teachlive-dropdown-green-scrollbar::-webkit-scrollbar-corner {
          background: #ecfdf5;
        }
      `}</style>

            <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
                {/* Header */}


                {/* Intro panel */}

                <section className="mb-7 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 p-6 text-white sm:p-8">
                    <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
                        <div>
                            <p className="text-sm font-semibold text-emerald-100">
                                Weâ€™re here to help
                            </p>

                            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                                What can we help you with?
                            </h2>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/90">
                                Search the help articles or submit details about an issue
                                so you can keep your teaching workflow organised.
                            </p>
                        </div>

                        <div className="hidden h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-white/10 md:flex">
                            <MessageCircle size={42} strokeWidth={1.5} />
                        </div>
                    </div>
                </section>

                {/* Quick help cards */}

                <section className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <SupportStat
                        icon={BookOpen}
                        title="Help articles"
                        description="Search common questions and answers."
                    />

                    <SupportStat
                        icon={CreditCard}
                        title="Payments"
                        description="Understand earnings and payout statuses."
                    />

                    <SupportStat
                        icon={ShieldCheck}
                        title="Account safety"
                        description="Keep credentials and account information private."
                    />

                    <SupportStat
                        icon={Ticket}
                        title="Support requests"
                        description="Create and review demo tickets saved locally."
                    />
                </section>

                <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    {/* FAQ area */}

                    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 p-5 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                    <CircleHelp size={20} />
                                </div>

                                <div>
                                    <h2 className="font-bold text-slate-950">
                                        Frequently asked questions
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Search by topic or keyword.
                                    </p>
                                </div>
                            </div>

                            <div className="relative mt-5">
                                <Search
                                    size={17}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Search help articles..."
                                    aria-label="Search help articles"
                                    autoComplete="off"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                />

                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => setQuery("")}
                                        aria-label="Clear search"
                                        className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200"
                                    >
                                        <X size={15} />
                                    </button>
                                )}
                            </div>

                            {/* FAQ topic chips */}

                            <div className="mt-4 flex flex-wrap gap-2">
                                {TOPICS.map((topic) => {
                                    const active = topic === activeTopic;

                                    return (
                                        <button
                                            key={topic}
                                            type="button"
                                            aria-pressed={active}
                                            onClick={() => setActiveTopic(topic)}
                                            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${active
                                                ? "border-emerald-600 bg-emerald-600 text-white"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                                                }`}
                                        >
                                            {topic}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* FAQ list */}

                        <div className="divide-y divide-slate-100 px-4 sm:px-5">
                            {filteredFAQs.map((faq) => {
                                const expanded = expandedFAQ === faq.id;

                                return (
                                    <article key={faq.id} className="py-1">
                                        <button
                                            type="button"
                                            aria-expanded={expanded}
                                            onClick={() =>
                                                setExpandedFAQ(expanded ? "" : faq.id)
                                            }
                                            className="flex w-full items-center gap-3 py-4 text-left"
                                        >
                                            <span
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${expanded
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "bg-slate-100 text-slate-500"
                                                    }`}
                                            >
                                                <FileText size={17} />
                                            </span>

                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-semibold leading-5 text-slate-800">
                                                    {faq.question}
                                                </span>

                                                <span className="mt-1 block text-[11px] font-medium text-emerald-700">
                                                    {faq.category}
                                                </span>
                                            </span>

                                            <ChevronDown
                                                size={17}
                                                className={`shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-180 text-emerald-600" : ""
                                                    }`}
                                            />
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {expanded && (
                                                <motion.div
                                                    initial={
                                                        reduceMotion
                                                            ? false
                                                            : { opacity: 0, height: 0 }
                                                    }
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={
                                                        reduceMotion
                                                            ? undefined
                                                            : { opacity: 0, height: 0 }
                                                    }
                                                    className="overflow-hidden"
                                                >
                                                    <p className="pb-5 pl-12 pr-2 text-sm leading-6 text-slate-500">
                                                        {faq.answer}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </article>
                                );
                            })}

                            {filteredFAQs.length === 0 && (
                                <div className="py-12 text-center">
                                    <Search
                                        size={24}
                                        className="mx-auto text-slate-300"
                                    />

                                    <h3 className="mt-3 font-bold text-slate-800">
                                        No articles found
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Try a different search term or topic.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setQuery("");
                                            setActiveTopic("All topics");
                                        }}
                                        className="mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                                    >
                                        Reset search
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Support ticket form */}

                    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-slate-100 p-5 sm:p-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                <Send size={19} />
                            </div>

                            <div>
                                <h2 className="font-bold text-slate-950">
                                    Submit a support request
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Describe your issue with the relevant details.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submitTicket} className="space-y-4 p-5 sm:p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Your name">
                                    <input
                                        required
                                        maxLength={80}
                                        value={form.name}
                                        onChange={(event) =>
                                            updateForm("name", event.target.value)
                                        }
                                        placeholder="Enter your name"
                                        autoComplete="name"
                                        className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                                    />
                                </Field>

                                <Field label="Email address">
                                    <input
                                        required
                                        type="email"
                                        maxLength={254}
                                        value={form.email}
                                        onChange={(event) =>
                                            updateForm("email", event.target.value)
                                        }
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                                    />
                                </Field>

                                <Field label="Topic">
                                    <PremiumDropdown
                                        value={form.category}
                                        options={TICKET_TOPICS}
                                        onChange={(value) =>
                                            updateForm("category", value)
                                        }
                                        icon={BookOpen}
                                        label="Support topic"
                                        ariaLabel="Select support topic"
                                    />
                                </Field>

                                <Field label="Priority">
                                    <PremiumDropdown
                                        value={form.priority}
                                        options={PRIORITIES}
                                        onChange={(value) =>
                                            updateForm("priority", value)
                                        }
                                        icon={AlertCircle}
                                        label="Request priority"
                                        ariaLabel="Select request priority"
                                    />
                                </Field>
                            </div>

                            <Field label="Subject">
                                <input
                                    required
                                    maxLength={120}
                                    value={form.subject}
                                    onChange={(event) =>
                                        updateForm("subject", event.target.value)
                                    }
                                    placeholder="Briefly describe the issue"
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                                />
                            </Field>

                            <Field
                                label="How can we help?"
                                hint="Do not include passwords, OTPs, full bank details or other secrets."
                            >
                                <textarea
                                    required
                                    rows={5}
                                    maxLength={3000}
                                    value={form.message}
                                    onChange={(event) =>
                                        updateForm("message", event.target.value)
                                    }
                                    placeholder="Explain what happened and what you expected..."
                                    className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm leading-6 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                                />

                                <p className="mt-1 text-right text-[11px] text-slate-400">
                                    {form.message.length}/3000
                                </p>
                            </Field>

                            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                                <p className="flex items-start gap-2 text-xs leading-5 text-amber-800">
                                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                                    Demo mode: this request is saved in this browser. It is
                                    not sent to a support team or delivered by email.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100"
                            >
                                <Send size={16} />
                                Create support ticket
                            </button>
                        </form>
                    </section>
                </div>

                {/* Recent tickets */}

                <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col justify-between gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
                        <div>
                            <h2 className="font-bold text-slate-950">
                                Recent support requests
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Tickets saved in this browser only.
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                            <Ticket size={13} />
                            {tickets.length} saved
                        </span>
                    </div>

                    {tickets.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:p-6"
                                >
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-bold text-emerald-700">
                                                {ticket.id}
                                            </span>

                                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                                                {ticket.category}
                                            </span>

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${ticket.priority === "High"
                                                    ? "bg-rose-50 text-rose-700"
                                                    : "bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                {ticket.priority} priority
                                            </span>
                                        </div>

                                        <h3 className="mt-2 break-words text-sm font-bold text-slate-900">
                                            {ticket.subject}
                                        </h3>

                                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                                            {ticket.message}
                                        </p>

                                        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                                            <Clock3 size={12} />
                                            {formatTicketDate(ticket.createdAt)}
                                        </p>
                                    </div>

                                    <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
                                        <CheckCircle2 size={13} />
                                        Saved locally
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-5 py-12 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                <Ticket size={22} />
                            </div>

                            <h3 className="mt-3 text-sm font-bold text-slate-900">
                                No support requests yet
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Your locally saved tickets will appear here.
                            </p>
                        </div>
                    )}
                </section>
            </div>

            {/* Toast */}

            <AnimatePresence>
                {toast && (
                    <motion.div
                        key={toast}
                        role="status"
                        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="fixed bottom-4 left-4 right-4 z-[120] mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xl sm:left-auto sm:right-6"
                    >
                        <CheckCircle2
                            size={19}
                            className="mt-0.5 shrink-0 text-emerald-600"
                        />

                        <p className="min-w-0 flex-1 text-sm font-semibold text-slate-800">
                            {toast}
                        </p>

                        <button
                            type="button"
                            onClick={() => setToast("")}
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

/* ======================== DATE FORMAT ======================== */

function formatTicketDate(value) {
    const date = new Date(value);

    if (!value || Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}
