
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
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Clock3,
  MapPin,
  Video,
  Users,
  BookOpen,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Check,
  CheckCircle2,
  CalendarCheck,
  CalendarClock,
  Filter,
  ListFilter,
  GraduationCap,
  ExternalLink,
  Bell,
  LayoutGrid,
  CalendarRange,
  ArrowUpRight,
  Sparkles,
  AlertCircle,
  FileText,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */

const INITIAL_EVENTS = [
  {
    id: 1,
    title: "React Advanced Concepts",
    type: "Class",
    date: "2026-10-20",
    start: "09:00",
    end: "10:30",
    students: 28,
    location: "Online classroom",
    meetingLink: "https://meet.google.com/",
    description:
      "Hooks, performance optimization and reusable architecture.",
    status: "Scheduled",
    color: "violet",
  },
  {
    id: 2,
    title: "Frontend Project Review",
    type: "Review",
    date: "2026-10-20",
    start: "11:00",
    end: "12:00",
    students: 12,
    location: "Google Meet",
    meetingLink: "https://meet.google.com/",
    description:
      "Review student projects, code quality and implementation.",
    status: "Scheduled",
    color: "blue",
  },
  {
    id: 3,
    title: "DSA Doubt Session",
    type: "Doubt Session",
    date: "2026-10-20",
    start: "14:00",
    end: "15:00",
    students: 18,
    location: "Online classroom",
    meetingLink: "https://meet.google.com/",
    description:
      "Solve student doubts related to arrays and recursion.",
    status: "Scheduled",
    color: "emerald",
  },
  {
    id: 4,
    title: "Weekly Mentor Meeting",
    type: "Meeting",
    date: "2026-10-21",
    start: "10:00",
    end: "10:45",
    students: 6,
    location: "Google Meet",
    meetingLink: "https://meet.google.com/",
    description:
      "Weekly teaching updates and student progress discussion.",
    status: "Scheduled",
    color: "amber",
  },
  {
    id: 5,
    title: "JavaScript Fundamentals",
    type: "Class",
    date: "2026-10-22",
    start: "09:30",
    end: "11:00",
    students: 32,
    location: "Online classroom",
    meetingLink: "https://meet.google.com/",
    description:
      "Functions, objects, arrays and asynchronous JavaScript.",
    status: "Scheduled",
    color: "violet",
  },
  {
    id: 6,
    title: "Student Career Guidance",
    type: "Meeting",
    date: "2026-10-23",
    start: "12:00",
    end: "12:45",
    students: 8,
    location: "Google Meet",
    meetingLink: "https://meet.google.com/",
    description:
      "Career planning, resumes and interview preparation.",
    status: "Scheduled",
    color: "amber",
  },
  {
    id: 7,
    title: "Backend API Workshop",
    type: "Workshop",
    date: "2026-10-24",
    start: "10:00",
    end: "12:00",
    students: 24,
    location: "Online classroom",
    meetingLink: "https://meet.google.com/",
    description:
      "Build REST APIs and understand request-response flow.",
    status: "Scheduled",
    color: "blue",
  },
  {
    id: 8,
    title: "Assignment Evaluation",
    type: "Review",
    date: "2026-10-26",
    start: "15:00",
    end: "16:00",
    students: 16,
    location: "Online classroom",
    meetingLink: "https://meet.google.com/",
    description:
      "Evaluate submissions and share improvement feedback.",
    status: "Scheduled",
    color: "emerald",
  },
];

const EVENT_TYPES = [
  "Class",
  "Meeting",
  "Workshop",
  "Review",
  "Doubt Session",
];

const EVENT_STATUSES = ["Scheduled", "Completed", "Cancelled"];
const COLORS = ["violet", "blue", "emerald", "amber", "rose"];

const COLOR_STYLES = {
  violet: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    dot: "bg-violet-500",
    bar: "bg-violet-500",
    soft: "bg-violet-100",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
    bar: "bg-blue-500",
    soft: "bg-blue-100",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
    soft: "bg-emerald-100",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    soft: "bg-amber-100",
  },
  rose: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
    bar: "bg-rose-500",
    soft: "bg-rose-100",
  },
};

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const pad = (value) => String(value).padStart(2, "0");

const dateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseDate = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (value, options = {}) =>
  parseDate(value).toLocaleDateString("en-IN", options);

const formatTime = (value) => {
  if (!value) return "";

  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const monthLabel = (date) =>
  date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

const getToday = () => dateKey(new Date());

const makeEmptyEvent = (date) => ({
  id: null,
  title: "",
  type: "Class",
  date: date || getToday(),
  start: "09:00",
  end: "10:00",
  students: 20,
  location: "Online classroom",
  meetingLink: "",
  description: "",
  status: "Scheduled",
  color: "violet",
});

/* -------------------------------------------------------------------------- */
/* PREMIUM SELECT                                                             */
/* Uses a portal so dropdowns aren't clipped by cards, modals or overflow.    */
/* -------------------------------------------------------------------------- */

function PremiumSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  icon: Icon,
  id,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState(null);

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const optionRefs = useRef([]);
  const typeaheadRef = useRef("");
  const typeaheadTimerRef = useRef(null);

  const normalizedOptions = useMemo(
    () =>
      options.map((option) =>
        typeof option === "string"
          ? { label: option, value: option }
          : option,
      ),
    [options],
  );

  const selectedIndex = normalizedOptions.findIndex(
    (option) => option.value === value,
  );

  const selectedOption =
    selectedIndex >= 0 ? normalizedOptions[selectedIndex] : null;

  const calculatePosition = useCallback(() => {
    const trigger = triggerRef.current;

    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const gap = 8;
    const edge = 12;

    const width = Math.min(
      Math.max(rect.width, 180),
      viewportWidth - edge * 2,
    );

    const spaceBelow = viewportHeight - rect.bottom - gap - edge;
    const spaceAbove = rect.top - gap - edge;

    const openAbove =
      spaceBelow < 220 && spaceAbove > spaceBelow;

    const availableHeight = Math.max(
      100,
      Math.min(
        320,
        openAbove ? spaceAbove : spaceBelow,
        viewportHeight - edge * 2,
      ),
    );

    const left = Math.min(
      Math.max(edge, rect.left),
      viewportWidth - width - edge,
    );

    setPosition({
      left,
      width,
      maxHeight: availableHeight,
      ...(openAbove
        ? { bottom: viewportHeight - rect.top + gap, top: "auto" }
        : { top: Math.min(rect.bottom + gap, viewportHeight - edge), bottom: "auto" }),
      transformOrigin: openAbove ? "bottom center" : "top center",
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return undefined;

    calculatePosition();

    const handleScrollOrResize = () => calculatePosition();

    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    return () => {
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [open, calculatePosition]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (
        !rootRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open || normalizedOptions.length === 0) return;

    const frame = window.requestAnimationFrame(() => {
      optionRefs.current[activeIndex]?.focus({ preventScroll: true });
      optionRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, activeIndex, normalizedOptions.length]);

  useEffect(
    () => () => {
      if (typeaheadTimerRef.current) {
        window.clearTimeout(typeaheadTimerRef.current);
      }
    },
    [],
  );

  const openMenu = () => {
    if (disabled) return;

    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setPosition(null);
    setOpen(true);
  };

  const closeMenu = (returnFocus = false) => {
    setOpen(false);

    if (returnFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  const selectOption = (option) => {
    if (!option || option.disabled) return;

    onChange(option.value);
    closeMenu(true);
  };

  const moveActive = (startIndex, direction) => {
    const count = normalizedOptions.length;
    if (!count) return;

    let nextIndex = startIndex;

    for (let attempt = 0; attempt < count; attempt += 1) {
      nextIndex = (nextIndex + direction + count) % count;

      if (!normalizedOptions[nextIndex]?.disabled) {
        setActiveIndex(nextIndex);
        return;
      }
    }
  };

  const handleTriggerKeyDown = (event) => {
    if (disabled) return;

    if (
      ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key) &&
      !open
    ) {
      event.preventDefault();
      openMenu();
      return;
    }

    if (event.key === "Escape" && open) {
      event.preventDefault();
      closeMenu(true);
    }
  };

  const handleOptionKeyDown = (event, index) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(index, 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(index, -1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      const firstEnabled = normalizedOptions.findIndex(
        (option) => !option.disabled,
      );
      if (firstEnabled >= 0) setActiveIndex(firstEnabled);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();

      for (let i = normalizedOptions.length - 1; i >= 0; i -= 1) {
        if (!normalizedOptions[i]?.disabled) {
          setActiveIndex(i);
          break;
        }
      }

      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption(normalizedOptions[index]);
      return;
    }

    if (event.key === "Tab") {
      closeMenu(false);
      return;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      typeaheadRef.current += event.key.toLowerCase();

      if (typeaheadTimerRef.current) {
        window.clearTimeout(typeaheadTimerRef.current);
      }

      typeaheadTimerRef.current = window.setTimeout(() => {
        typeaheadRef.current = "";
      }, 650);

      const matchIndex = normalizedOptions.findIndex(
        (option) =>
          !option.disabled &&
          String(option.label)
            .toLowerCase()
            .startsWith(typeaheadRef.current),
      );

      if (matchIndex >= 0) {
        event.preventDefault();
        setActiveIndex(matchIndex);
      }
    }
  };

  return (
    <div ref={rootRef} className="relative w-full min-w-0">
      <button
        id={id}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-label={placeholder || "Select option"}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        className={`group flex min-h-[42px] w-full items-center gap-2.5 rounded-xl border bg-white px-3.5 py-2.5 text-left text-sm outline-none transition-all duration-200 focus-visible:ring-4 focus-visible:ring-violet-100 ${disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
          : open
            ? "border-violet-400 shadow-[0_0_0_4px_rgba(139,92,246,0.10)]"
            : "border-slate-200 shadow-sm hover:border-violet-300 hover:shadow-md"
          }`}
      >
        {Icon && (
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${open
              ? "bg-violet-100 text-violet-700"
              : "bg-slate-100 text-slate-500 group-hover:bg-violet-50 group-hover:text-violet-600"
              }`}
          >
            <Icon size={15} />
          </span>
        )}

        <span
          className={`min-w-0 flex-1 truncate font-medium ${selectedOption ? "text-slate-800" : "text-slate-500"
            }`}
        >
          {selectedOption?.label || placeholder || "Select option"}
        </span>

        <ChevronRight
          size={16}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "-rotate-90 text-violet-600" : "rotate-90"
            }`}
        />
      </button>

      {open &&
        position &&
        typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={menuRef}
              key="premium-select-menu"
              initial={{ opacity: 0, y: position.bottom === "auto" ? -5 : 5, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                position: "fixed",
                left: position.left,
                top: position.top,
                bottom: position.bottom,
                width: position.width,
                maxHeight: position.maxHeight,
                zIndex: 9999,
                transformOrigin: position.transformOrigin,
              }}
              className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/[0.03]"
            >
              <div className="mb-1 flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-2">
                <span className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {placeholder || "Choose an option"}
                </span>
                <span className="shrink-0 rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-semibold text-violet-600">
                  {normalizedOptions.length} options
                </span>
              </div>

              <div
                role="listbox"
                aria-label={placeholder || "Options"}
                className="overflow-y-auto overscroll-contain"
                style={{
                  maxHeight: Math.max(70, position.maxHeight - 70),
                }}
              >
                {normalizedOptions.map((option, index) => {
                  const selected = option.value === value;
                  const active = index === activeIndex;

                  return (
                    <button
                      key={option.value}
                      ref={(node) => {
                        optionRefs.current[index] = node;
                      }}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      disabled={option.disabled}
                      tabIndex={active ? 0 : -1}
                      onClick={() => selectOption(option)}
                      onMouseEnter={() => {
                        if (!option.disabled) setActiveIndex(index);
                      }}
                      onKeyDown={(event) =>
                        handleOptionKeyDown(event, index)
                      }
                      className={`my-0.5 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150 focus:outline-none ${option.disabled
                        ? "cursor-not-allowed opacity-40"
                        : selected
                          ? "bg-violet-50 font-semibold text-violet-700"
                          : active
                            ? "bg-slate-50 text-slate-900"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${selected
                          ? "bg-violet-100 text-violet-700"
                          : "bg-slate-100 text-slate-400"
                          }`}
                      >
                        {selected ? (
                          <Check size={15} />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        )}
                      </span>

                      <span className="min-w-0 flex-1 truncate">
                        {option.label}
                      </span>

                      {selected && (
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-violet-500">
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })}

                {normalizedOptions.length === 0 && (
                  <p className="px-3 py-5 text-center text-sm text-slate-400">
                    No options available
                  </p>
                )}
              </div>

              <div className="mt-1 border-t border-slate-100 px-3 py-2">
                <p className="text-[10px] text-slate-400">
                  Select an option to update your view
                </p>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STAT CARD                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  tone,
  delay,
  reduceMotion,
}) {
  const tones = {
    violet: "bg-violet-100 text-violet-700",
    blue: "bg-blue-100 text-blue-700",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: reduceMotion ? 0 : delay }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tones[tone] || tones.violet
            }`}
        >
          <Icon size={21} />
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* EVENT CARD                                                                 */
/* -------------------------------------------------------------------------- */

function EventCard({
  event,
  onEdit,
  onDelete,
  onStatusChange,
  reduceMotion,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const style = COLOR_STYLES[event.color] || COLOR_STYLES.violet;

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (pointerEvent) => {
      if (!menuRef.current?.contains(pointerEvent.target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (keyEvent) => {
      if (keyEvent.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const handleAction = (callback) => {
    setMenuOpen(false);
    callback?.();
  };

  const menuItemClass =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400";

  return (
    <motion.article
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22 }}
      className="group relative min-w-0 overflow-visible rounded-2xl border border-slate-200 bg-white p-4 transition duration-200 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50 sm:p-5"
    >
      <div
        className={`absolute bottom-4 left-0 top-4 w-1 rounded-r-full ${style.bar}`}
      />

      <div className="flex min-w-0 items-start gap-3 pl-2">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.bg} ${style.text}`}
        >
          {event.type === "Class" ? (
            <BookOpen size={19} />
          ) : event.type === "Meeting" ? (
            <Users size={19} />
          ) : event.type === "Workshop" ? (
            <GraduationCap size={19} />
          ) : event.type === "Review" ? (
            <CheckCircle2 size={19} />
          ) : (
            <AlertCircle size={19} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-lg px-2 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
            >
              {event.type}
            </span>

            <span
              className={`rounded-lg px-2 py-1 text-xs font-semibold ${event.status === "Completed"
                ? "bg-emerald-50 text-emerald-700"
                : event.status === "Cancelled"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-blue-50 text-blue-700"
                }`}
            >
              {event.status}
            </span>
          </div>

          <h3 className="mt-2 break-words text-base font-bold text-slate-900">
            {event.title}
          </h3>

          {event.description && (
            <p className="mt-1 line-clamp-2 break-words text-sm leading-5 text-slate-500">
              {event.description}
            </p>
          )}
        </div>

        <div ref={menuRef} className="relative shrink-0">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={`Actions for ${event.title}`}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${menuOpen
              ? "border-violet-200 bg-violet-50 text-violet-700 shadow-sm"
              : "border-transparent text-slate-400 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700"
              }`}
          >
            <MoreHorizontal size={20} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                role="menu"
                initial={
                  reduceMotion ? false : { opacity: 0, scale: 0.96, y: -6 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, scale: 0.96, y: -6 }
                }
                transition={{ duration: 0.16, ease: "easeOut" }}
                style={{ transformOrigin: "top right" }}
                className="absolute right-0 top-11 z-50 w-56 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl shadow-slate-900/10 ring-1 ring-black/[0.02]"
              >
                <div className="mb-1 border-b border-slate-100 px-3 pb-2 pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Event actions
                  </p>
                  <p className="mt-1 truncate text-xs font-semibold text-slate-600">
                    {event.title}
                  </p>
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleAction(() => onEdit(event))}
                  className={`${menuItemClass} text-slate-700 hover:bg-violet-50 hover:text-violet-700`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                    <Pencil size={15} />
                  </span>
                  <span className="flex-1">Edit event</span>
                  <ChevronRight size={15} className="text-slate-400" />
                </button>

                {event.status !== "Completed" && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      handleAction(() =>
                        onStatusChange(event.id, "Completed"),
                      )
                    }
                    className={`${menuItemClass} text-slate-700 hover:bg-emerald-50 hover:text-emerald-700`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <Check size={15} />
                    </span>
                    <span className="flex-1">Mark completed</span>
                    <CheckCircle2 size={15} className="text-emerald-500" />
                  </button>
                )}

                {event.status !== "Cancelled" && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      handleAction(() =>
                        onStatusChange(event.id, "Cancelled"),
                      )
                    }
                    className={`${menuItemClass} text-slate-700 hover:bg-amber-50 hover:text-amber-700`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                      <X size={15} />
                    </span>
                    <span className="flex-1">Cancel event</span>
                  </button>
                )}

                <div className="my-1.5 border-t border-slate-100" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleAction(() => onDelete(event))}
                  className={`${menuItemClass} text-rose-600 hover:bg-rose-50 hover:text-rose-700`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                    <Trash2 size={15} />
                  </span>
                  <span className="flex-1">Delete event</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
          <Clock3 size={15} className="shrink-0 text-slate-400" />
          <span className="truncate">
            {formatTime(event.start)} – {formatTime(event.end)}
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
          <Users size={15} className="shrink-0 text-slate-400" />
          <span>{event.students} students</span>
        </div>

        <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600 sm:col-span-2">
          <MapPin size={15} className="shrink-0 text-slate-400" />
          <span className="truncate">
            {event.location || "Location not set"}
          </span>
        </div>
      </div>

      {event.meetingLink && event.status !== "Cancelled" && (
        <div className="mt-4">
          <a
            href={event.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex max-w-full items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <Video size={16} />
            <span>Open meeting</span>
            <ExternalLink size={13} />
          </a>
        </div>
      )}
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/* CREATE / EDIT MODAL                                                        */
/* -------------------------------------------------------------------------- */

function EventModal({ event, onClose, onSave, reduceMotion }) {
  const [form, setForm] = useState(() => ({ ...event }));
  const [error, setError] = useState("");
  const titleRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    titleRef.current?.focus();

    const handleEscape = (eventKey) => {
      if (eventKey.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError("");
  };

  const submit = (eventSubmit) => {
    eventSubmit.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter an event title.");
      return;
    }

    if (!form.date || !form.start || !form.end) {
      setError("Please fill in the date and both time fields.");
      return;
    }

    if (form.end <= form.start) {
      setError("End time must be later than start time.");
      return;
    }

    const studentCount = Number(form.students);

    if (
      !Number.isInteger(studentCount) ||
      studentCount < 0 ||
      studentCount > 10000
    ) {
      setError("Students must be a whole number between 0 and 10000.");
      return;
    }

    if (form.meetingLink.trim()) {
      try {
        const url = new URL(form.meetingLink.trim());

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid URL");
        }
      } catch {
        setError("Please enter a valid meeting URL starting with https://");
        return;
      }
    }

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      meetingLink: form.meetingLink.trim(),
      students: studentCount,
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.22 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
              Schedule management
            </p>
            <h2
              id="event-modal-title"
              className="mt-1 text-xl font-bold text-slate-900"
            >
              {form.id ? "Edit event" : "Create new event"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5 p-5 sm:p-7">
          <div>
            <label
              htmlFor="event-title"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Event title <span className="text-rose-500">*</span>
            </label>
            <input
              ref={titleRef}
              id="event-title"
              autoFocus
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="e.g. React Advanced Concepts"
              maxLength={120}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="event-type"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Event type
              </label>
              <PremiumSelect
                id="event-type"
                value={form.type}
                onChange={(value) => update("type", value)}
                options={EVENT_TYPES}
                placeholder="Select event type"
              />
            </div>

            <div>
              <label
                htmlFor="event-status"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Status
              </label>
              <PremiumSelect
                id="event-status"
                value={form.status}
                onChange={(value) => update("status", value)}
                options={EVENT_STATUSES}
                placeholder="Select status"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="event-date"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="event-date"
              type="date"
              required
              value={form.date}
              onChange={(event) => update("date", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="event-start"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Start time <span className="text-rose-500">*</span>
              </label>
              <input
                id="event-start"
                type="time"
                required
                value={form.start}
                onChange={(event) => update("start", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="event-end"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                End time <span className="text-rose-500">*</span>
              </label>
              <input
                id="event-end"
                type="time"
                required
                value={form.end}
                onChange={(event) => update("end", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="event-students"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Students
              </label>
              <input
                id="event-students"
                type="number"
                min="0"
                max="10000"
                step="1"
                value={form.students}
                onChange={(event) => update("students", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="event-location"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Location
              </label>
              <input
                id="event-location"
                value={form.location}
                onChange={(event) => update("location", event.target.value)}
                maxLength={120}
                placeholder="Online classroom"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="event-link"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Meeting URL
            </label>
            <input
              id="event-link"
              type="url"
              value={form.meetingLink}
              onChange={(event) => update("meetingLink", event.target.value)}
              placeholder="https://meet.google.com/..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <div>
            <label
              htmlFor="event-description"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Description
            </label>
            <textarea
              id="event-description"
              value={form.description}
              onChange={(event) =>
                update("description", event.target.value)
              }
              maxLength={600}
              rows={3}
              placeholder="What will this session cover?"
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">
              Event accent
            </p>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((color) => {
                const style = COLOR_STYLES[color];

                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => update("color", color)}
                    aria-label={`${color} event color`}
                    aria-pressed={form.color === color}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 transition ${form.color === color
                      ? "border-slate-900 ring-4 ring-slate-100"
                      : "border-transparent hover:border-slate-300"
                      }`}
                  >
                    <span className={`h-5 w-5 rounded-full ${style.dot}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
            >
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Discard
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 active:scale-[0.98]"
            >
              <Check size={17} />
              {form.id ? "Save changes" : "Create event"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* DELETE CONFIRMATION                                                        */
/* -------------------------------------------------------------------------- */

function ConfirmModal({ title, message, onCancel, onConfirm, reduceMotion }) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <Trash2 size={22} />
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Keep event
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Delete event
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN PAGE                                                                  */
/* -------------------------------------------------------------------------- */

export default function TrainerSchedulePage() {
  const reduceMotion = useReducedMotion();

  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [view, setView] = useState("week");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [sortBy, setSortBy] = useState("time");
  const [modalEvent, setModalEvent] = useState(null);
  const [deleteEvent, setDeleteEvent] = useState(null);
  const [toast, setToast] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const toastTimerRef = useRef(null);

  const notify = useCallback((message, tone = "success") => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast({ message, tone });

    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3000);
  }, []);

  useEffect(
    () => () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    },
    [],
  );

  const today = getToday();
  const selectedDateObject = parseDate(selectedDate);

  const monthEvents = useMemo(
    () =>
      events.filter((event) => {
        const date = parseDate(event.date);

        return (
          date.getFullYear() === visibleMonth.getFullYear() &&
          date.getMonth() === visibleMonth.getMonth()
        );
      }),
    [events, visibleMonth],
  );

  const selectedDayEvents = useMemo(() => {
    let result = events.filter((event) => event.date === selectedDate);

    if (typeFilter !== "All types") {
      result = result.filter((event) => event.type === typeFilter);
    }

    if (statusFilter !== "All statuses") {
      result = result.filter((event) => event.status === statusFilter);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((event) =>
        [
          event.title,
          event.type,
          event.location,
          event.description,
          event.status,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query)),
      );
    }

    return [...result].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "type") return a.type.localeCompare(b.type);
      return a.start.localeCompare(b.start);
    });
  }, [
    events,
    selectedDate,
    typeFilter,
    statusFilter,
    search,
    sortBy,
  ]);

  const stats = useMemo(() => {
    const dayEvents = events.filter(
      (event) => event.date === selectedDate,
    );

    return {
      total: dayEvents.length,
      scheduled: dayEvents.filter(
        (event) => event.status === "Scheduled",
      ).length,
      completed: dayEvents.filter(
        (event) => event.status === "Completed",
      ).length,
      students: dayEvents
        .filter((event) => event.status !== "Cancelled")
        .reduce((sum, event) => sum + (Number(event.students) || 0), 0),
    };
  }, [events, selectedDate]);

  const changeMonth = (offset) => {
    setVisibleMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + offset,
          1,
        ),
    );
  };

  const goToToday = () => {
    const value = getToday();
    const date = parseDate(value);

    setSelectedDate(value);
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const selectDay = (date) => {
    const value = dateKey(date);

    setSelectedDate(value);

    if (
      date.getMonth() !== visibleMonth.getMonth() ||
      date.getFullYear() !== visibleMonth.getFullYear()
    ) {
      setVisibleMonth(
        new Date(date.getFullYear(), date.getMonth(), 1),
      );
    }
  };

  const saveEvent = (event) => {
    if (event.id) {
      setEvents((current) =>
        current.map((item) => (item.id === event.id ? event : item)),
      );
      notify("Event updated successfully.");
    } else {
      const newEvent = { ...event, id: Date.now() };

      setEvents((current) => [...current, newEvent]);
      setSelectedDate(newEvent.date);

      const date = parseDate(newEvent.date);
      setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));

      notify("New event added to your schedule.");
    }

    setModalEvent(null);
  };

  const updateStatus = (id, status) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === id ? { ...event, status } : event,
      ),
    );

    notify(`Event marked as ${status.toLowerCase()}.`);
  };

  const confirmDelete = () => {
    if (!deleteEvent) return;

    setEvents((current) =>
      current.filter((event) => event.id !== deleteEvent.id),
    );

    notify("Event deleted from your schedule.");
    setDeleteEvent(null);
  };

  const exportSchedule = () => {
    const rows = [
      [
        "Title",
        "Type",
        "Date",
        "Start",
        "End",
        "Students",
        "Location",
        "Status",
        "Meeting URL",
        "Description",
      ],
      ...selectedDayEvents.map((event) => [
        event.title,
        event.type,
        event.date,
        event.start,
        event.end,
        event.students,
        event.location,
        event.status,
        event.meetingLink,
        event.description,
      ]),
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = rows
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `trainer-schedule-${selectedDate}.csv`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("Schedule exported as CSV.");
  };

  const copyMeetingLink = async (event) => {
    if (!event.meetingLink) {
      notify("This event does not have a meeting URL.", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(event.meetingLink);
      notify("Meeting link copied.");
    } catch {
      notify("Clipboard access is unavailable in this browser.", "error");
    }
  };

  const weekDays = useMemo(() => {
    const first = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      1,
    );

    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [visibleMonth]);

  const calendarDays = useMemo(() => {
    if (view === "month") return weekDays;

    const start = new Date(selectedDateObject);
    start.setDate(start.getDate() - start.getDay());

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [view, weekDays, selectedDateObject]);

  const isMonthView = view === "month";

  return (
    <div className="min-h-screen min-w-0 bg-[#f7f8fc] text-slate-800">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
        {/* Page header */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-center"
        >
          

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={exportSchedule}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              <FileText size={17} />
              Export day
            </button>

            <button
              type="button"
              onClick={() => setModalEvent(makeEmptyEvent(selectedDate))}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 active:scale-[0.98]"
            >
              <Plus size={18} />
              Create event
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={CalendarDays}
            label="Events on selected day"
            value={stats.total}
            detail={formatDate(selectedDate, {
              day: "numeric",
              month: "short",
            })}
            tone="violet"
            delay={0}
            reduceMotion={reduceMotion}
          />

          <StatCard
            icon={CalendarClock}
            label="Upcoming / scheduled"
            value={stats.scheduled}
            detail="Awaiting session completion"
            tone="blue"
            delay={0.05}
            reduceMotion={reduceMotion}
          />

          <StatCard
            icon={CalendarCheck}
            label="Completed sessions"
            value={stats.completed}
            detail="For the selected date"
            tone="emerald"
            delay={0.1}
            reduceMotion={reduceMotion}
          />

          <StatCard
            icon={Users}
            label="Student seats"
            value={stats.students}
            detail="Across non-cancelled events"
            tone="amber"
            delay={0.15}
            reduceMotion={reduceMotion}
          />
        </div>

        <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          {/* Calendar panel */}
          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-slate-900">
                    Calendar
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose a date to view your sessions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={goToToday}
                  className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                >
                  Today
                </button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <h3 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                  {view === "week"
                    ? `Week of ${formatDate(dateKey(calendarDays[0]), {
                      day: "numeric",
                      month: "short",
                    })}`
                    : monthLabel(visibleMonth)}
                </h3>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (view === "week") {
                        const date = new Date(selectedDateObject);
                        date.setDate(date.getDate() - 7);
                        selectDay(date);
                      } else {
                        changeMonth(-1);
                      }
                    }}
                    aria-label="Previous period"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (view === "week") {
                        const date = new Date(selectedDateObject);
                        date.setDate(date.getDate() + 7);
                        selectDay(date);
                      } else {
                        changeMonth(1);
                      }
                    }}
                    aria-label="Next period"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setView("week")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${view === "week"
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  <CalendarRange size={16} />
                  Week
                </button>

                <button
                  type="button"
                  onClick={() => setView("month")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${view === "month"
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  <LayoutGrid size={16} />
                  Month
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-5">
              <div className="mb-2 grid grid-cols-7">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="py-2 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              <div
                className={`grid grid-cols-7 ${isMonthView ? "gap-y-1" : "gap-1.5 sm:gap-2"
                  }`}
              >
                {calendarDays.map((date) => {
                  const key = dateKey(date);
                  const dayEvents = events.filter(
                    (event) => event.date === key,
                  );
                  const active = key === selectedDate;
                  const todayDate = key === today;
                  const outsideMonth =
                    date.getMonth() !== visibleMonth.getMonth();

                  return (
                    <motion.button
                      key={key}
                      type="button"
                      onClick={() => selectDay(date)}
                      whileTap={
                        reduceMotion ? undefined : { scale: 0.95 }
                      }
                      aria-label={`${formatDate(key, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}, ${dayEvents.length} events`}
                      aria-pressed={active}
                      className={`relative flex min-w-0 flex-col items-center rounded-xl border transition ${isMonthView
                        ? "min-h-[61px] py-2 sm:min-h-[75px]"
                        : "min-h-[74px] py-3 sm:min-h-[92px]"
                        } ${active
                          ? "border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                          : todayDate
                            ? "border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-400"
                            : "border-transparent bg-slate-50/70 text-slate-700 hover:border-slate-200 hover:bg-slate-100"
                        } ${outsideMonth && isMonthView ? "opacity-45" : ""
                        }`}
                    >
                      <span
                        className={`text-sm font-bold ${todayDate && !active ? "text-violet-700" : ""
                          }`}
                      >
                        {date.getDate()}
                      </span>

                      {todayDate && !active && (
                        <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-violet-600">
                          Today
                        </span>
                      )}

                      <div className="mt-2 flex h-1.5 items-center justify-center gap-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <span
                            key={event.id}
                            className={`h-1.5 w-1.5 rounded-full ${active
                              ? "bg-white/90"
                              : COLOR_STYLES[event.color]?.dot ||
                              "bg-violet-500"
                              }`}
                          />
                        ))}

                        {dayEvents.length > 3 && (
                          <span
                            className={`text-[8px] font-bold ${active ? "text-white" : "text-slate-500"
                              }`}
                          >
                            +{dayEvents.length - 3}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
                    <CalendarDays size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">
                      {formatDate(selectedDate, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-600">
                      {stats.total === 0
                        ? "Your calendar is clear for this day. Add an event whenever you need."
                        : `${stats.total} event${stats.total === 1 ? "" : "s"} planned with ${stats.students} student seats.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Daily agenda */}
          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.14 }}
            className="min-w-0"
          >
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-900">
                  Daily agenda
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {formatDate(selectedDate, {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                {selectedDayEvents.length} shown
              </span>
            </div>

            <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search title, type or location..."
                  aria-label="Search events"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowFilters((current) => !current)
                  }
                  aria-expanded={showFilters}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${showFilters
                    ? "border-violet-200 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <Filter size={15} />
                  Filters
                  <ChevronRight
                    size={14}
                    className={`transition-transform ${showFilters ? "rotate-90" : ""
                      }`}
                  />
                </button>

                <div className="flex min-w-0 items-center gap-2">
                  <ListFilter
                    size={15}
                    className="shrink-0 text-slate-400"
                  />

                  <div className="w-32 sm:w-36">
                    <PremiumSelect
                      value={sortBy}
                      onChange={setSortBy}
                      options={[
                        { label: "Sort by time", value: "time" },
                        { label: "Sort by title", value: "title" },
                        { label: "Sort by type", value: "type" },
                      ]}
                      placeholder="Sort by"
                    />
                  </div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {showFilters && (
                  <motion.div
                    initial={
                      reduceMotion ? false : { height: 0, opacity: 0 }
                    }
                    animate={{ height: "auto", opacity: 1 }}
                    exit={
                      reduceMotion ? undefined : { height: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.2 }}
                    className="overflow-visible"
                  >
                    <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                          Event type
                        </label>

                        <PremiumSelect
                          value={typeFilter}
                          onChange={setTypeFilter}
                          options={["All types", ...EVENT_TYPES]}
                          placeholder="All types"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                          Status
                        </label>

                        <PremiumSelect
                          value={statusFilter}
                          onChange={setStatusFilter}
                          options={["All statuses", ...EVENT_STATUSES]}
                          placeholder="All statuses"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setTypeFilter("All types");
                        setStatusFilter("All statuses");
                        setSearch("");
                      }}
                      className="mt-3 text-xs font-bold text-violet-700 hover:text-violet-900"
                    >
                      Reset all filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {selectedDayEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={(item) => setModalEvent({ ...item })}
                    onDelete={(item) => setDeleteEvent(item)}
                    onStatusChange={updateStatus}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </AnimatePresence>

              {selectedDayEvents.length === 0 && (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <CalendarDays size={25} />
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    No events found
                  </h3>

                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                    There are no matching sessions on this date. Try another
                    date or adjust your filters.
                  </p>

                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTypeFilter("All types");
                        setStatusFilter("All statuses");
                        setSearch("");
                      }}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Clear filters
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setModalEvent(makeEmptyEvent(selectedDate))
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                    >
                      <Plus size={16} />
                      Add event
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Bell size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    Schedule tip
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Keep your meeting links and session details updated so
                    students can join without confusion.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Upcoming events */}
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="mt-7 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Upcoming sessions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your next scheduled events across the calendar.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const upcoming = events
                  .filter(
                    (event) =>
                      event.date >= today &&
                      event.status === "Scheduled",
                  )
                  .sort((a, b) =>
                    `${a.date}T${a.start}`.localeCompare(
                      `${b.date}T${b.start}`,
                    ),
                  )[0];

                if (upcoming) {
                  selectDay(parseDate(upcoming.date));
                  notify("Showing your next scheduled session.");
                } else {
                  notify("No upcoming scheduled events.", "error");
                }
              }}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              Next session
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {events
              .filter(
                (event) =>
                  event.date >= today && event.status === "Scheduled",
              )
              .sort((a, b) =>
                `${a.date}T${a.start}`.localeCompare(
                  `${b.date}T${b.start}`,
                ),
              )
              .slice(0, 3)
              .map((event, index) => {
                const style =
                  COLOR_STYLES[event.color] || COLOR_STYLES.violet;

                return (
                  <motion.button
                    key={event.id}
                    type="button"
                    initial={
                      reduceMotion ? false : { opacity: 0, y: 8 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: reduceMotion ? 0 : index * 0.05,
                    }}
                    onClick={() => selectDay(parseDate(event.date))}
                    className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-violet-200 hover:bg-violet-50/40"
                  >
                    <div
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.bg} ${style.text}`}
                    >
                      <CalendarClock size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-bold text-slate-900">
                        {event.title}
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {formatDate(event.date, {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        · {formatTime(event.start)}
                      </p>

                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700">
                        View day
                        <ArrowUpRight size={13} />
                      </p>
                    </div>
                  </motion.button>
                );
              })}

            {events.filter(
              (event) =>
                event.date >= today && event.status === "Scheduled",
            ).length === 0 && (
                <div className="col-span-full rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                  No upcoming scheduled sessions.
                </div>
              )}
          </div>
        </motion.section>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={
              reduceMotion ? false : { opacity: 0, y: 16, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }
            }
            className={`fixed bottom-4 left-4 right-4 z-[130] mx-auto flex max-w-md items-center gap-3 rounded-2xl border p-4 shadow-2xl sm:bottom-6 sm:left-auto sm:right-6 ${toast.tone === "error"
              ? "border-rose-200 bg-white text-rose-700"
              : "border-emerald-200 bg-white text-slate-800"
              }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toast.tone === "error"
                ? "bg-rose-50 text-rose-600"
                : "bg-emerald-50 text-emerald-600"
                }`}
            >
              {toast.tone === "error" ? (
                <AlertCircle size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
            </div>

            <p className="min-w-0 flex-1 text-sm font-semibold">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => {
                setToast(null);

                if (toastTimerRef.current) {
                  window.clearTimeout(toastTimerRef.current);
                  toastTimerRef.current = null;
                }
              }}
              aria-label="Dismiss notification"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create / edit modal */}
      <AnimatePresence>
        {modalEvent && (
          <EventModal
            key={modalEvent.id || "new-event"}
            event={modalEvent}
            onClose={() => setModalEvent(null)}
            onSave={saveEvent}
            reduceMotion={reduceMotion}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteEvent && (
          <ConfirmModal
            key={deleteEvent.id}
            title="Delete this event?"
            message={`"${deleteEvent.title}" will be removed from this schedule. This action cannot be undone.`}
            onCancel={() => setDeleteEvent(null)}
            onConfirm={confirmDelete}
            reduceMotion={reduceMotion}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
