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
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarOff,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Coffee,
  Download,
  Globe2,
  Info,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";

/* CONSTANTS */

const STORAGE_KEY = "teachlive.trainerAvailability.v1";
const DURATIONS = [30, 45, 60, 90, 120];
const BUFFERS = [0, 5, 10, 15, 20, 30];

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const TIME_ZONES = [
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
  { value: "Asia/Singapore", label: "Singapore Time (SGT)" },
  { value: "Europe/London", label: "United Kingdom (London)" },
  { value: "Europe/Berlin", label: "Central European Time" },
  { value: "America/New_York", label: "Eastern Time (New York)" },
  { value: "America/Los_Angeles", label: "Pacific Time (Los Angeles)" },
  { value: "UTC", label: "Coordinated Universal Time (UTC)" },
];

const DEFAULT_WEEKLY_SCHEDULE = Object.fromEntries(
  DAYS.map(({ key }, index) => [
    key,
    {
      enabled: index < 6,
      start: index === 5 ? "10:00" : "09:00",
      end: index === 5 ? "14:00" : "17:00",
      breakEnabled: index < 5,
      breakStart: "13:00",
      breakEnd: "14:00",
    },
  ]),
);

const createDefaultConfig = () => ({
  timeZone: "Asia/Kolkata",
  sessionDuration: 60,
  bufferMinutes: 15,
  weeklySchedule: JSON.parse(JSON.stringify(DEFAULT_WEEKLY_SCHEDULE)),
  exceptions: [],
});

/* HELPERS */

const pad = (n) => String(n).padStart(2, "0");

const getDateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const getTodayKey = () => getDateKey(new Date());

const getTomorrowKey = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return getDateKey(date);
};

const parseDateKey = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
};

const formatDate = (
  value,
  options = { day: "numeric", month: "short", year: "numeric" },
) => {
  const date = parseDateKey(value);
  return date
    ? date.toLocaleDateString("en-IN", options)
    : "Invalid date";
};

const formatSavedDate = (value) => {
  if (!value) return "Not saved yet";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not saved yet"
    : date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
};

const parseTime = (value) => {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value || "");

  return match
    ? Number(match[1]) * 60 + Number(match[2])
    : null;
};

const formatClock = (value) => {
  const minutes = typeof value === "number" ? value : parseTime(value);

  if (minutes === null || minutes < 0 || minutes >= 1440) return "--";

  const hours = Math.floor(minutes / 60);

  return `${hours % 12 || 12}:${pad(minutes % 60)} ${hours >= 12 ? "PM" : "AM"
    }`;
};

const formatDuration = (minutes) =>
  `${Math.floor(minutes / 60)}h ${pad(minutes % 60)}m`;

const normalizeConfig = (raw) => {
  const defaults = createDefaultConfig();
  const source = raw && typeof raw === "object" ? raw : {};
  const sourceDays = source.weeklySchedule || {};

  const weeklySchedule = Object.fromEntries(
    DAYS.map(({ key }) => {
      const saved = sourceDays[key] || {};
      const fallback = defaults.weeklySchedule[key];

      return [
        key,
        {
          ...fallback,
          ...saved,
          enabled:
            typeof saved.enabled === "boolean"
              ? saved.enabled
              : fallback.enabled,
          breakEnabled:
            typeof saved.breakEnabled === "boolean"
              ? saved.breakEnabled
              : fallback.breakEnabled,
        },
      ];
    }),
  );

  return {
    timeZone: TIME_ZONES.some((z) => z.value === source.timeZone)
      ? source.timeZone
      : defaults.timeZone,

    sessionDuration: DURATIONS.includes(Number(source.sessionDuration))
      ? Number(source.sessionDuration)
      : defaults.sessionDuration,

    bufferMinutes: BUFFERS.includes(Number(source.bufferMinutes))
      ? Number(source.bufferMinutes)
      : defaults.bufferMinutes,

    weeklySchedule,

    exceptions: Array.isArray(source.exceptions)
      ? source.exceptions
        .filter(
          (e) =>
            e &&
            parseDateKey(e.date) &&
            ["unavailable", "custom"].includes(e.type),
        )
        .map((e, i) => ({
          id: String(e.id || `${e.date}-${i}`),
          date: e.date,
          type: e.type,
          start: e.start || "10:00",
          end: e.end || "15:00",
          note: typeof e.note === "string" ? e.note : "",
        }))
      : [],
  };
};

const readStoredAvailability = () => {
  const fallback = createDefaultConfig();

  try {
    if (typeof window === "undefined") {
      return { config: fallback, savedAt: null };
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) return { config: fallback, savedAt: null };

    const parsed = JSON.parse(saved);

    return {
      config: normalizeConfig(parsed.config || parsed),
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : null,
    };
  } catch {
    return { config: fallback, savedAt: null };
  }
};

/* SESSION CALCULATIONS */

const getSlotsForDay = (rule, config) => {
  if (!rule?.enabled) return [];

  const start = parseTime(rule.start);
  const end = parseTime(rule.end);

  if (start === null || end === null || end <= start) return [];

  const duration = config.sessionDuration;
  const buffer = config.bufferMinutes;

  const breakStart = rule.breakEnabled
    ? parseTime(rule.breakStart)
    : null;

  const breakEnd = rule.breakEnabled
    ? parseTime(rule.breakEnd)
    : null;

  const slots = [];
  let cursor = start;

  while (cursor + duration <= end && slots.length < 500) {
    const slotEnd = cursor + duration;

    const overlapsBreak =
      rule.breakEnabled &&
      breakStart !== null &&
      breakEnd !== null &&
      cursor < breakEnd &&
      slotEnd > breakStart;

    if (overlapsBreak) {
      cursor = Math.max(cursor + 1, breakEnd);
      continue;
    }

    slots.push({ start: cursor, end: slotEnd });
    cursor += duration + buffer;
  }

  return slots;
};

const getNetMinutesForDay = (rule) => {
  if (!rule?.enabled) return 0;

  const start = parseTime(rule.start);
  const end = parseTime(rule.end);

  if (start === null || end === null || end <= start) return 0;

  let minutes = end - start;

  if (rule.breakEnabled) {
    const bs = parseTime(rule.breakStart);
    const be = parseTime(rule.breakEnd);

    if (
      bs !== null &&
      be !== null &&
      bs >= start &&
      be <= end &&
      be > bs
    ) {
      minutes -= be - bs;
    }
  }

  return Math.max(0, minutes);
};

const validateConfig = (config) => {
  const errors = [];

  if (!DAYS.some(({ key }) => config.weeklySchedule[key].enabled)) {
    errors.push("Enable at least one working day before saving.");
  }

  DAYS.forEach(({ key, label }) => {
    const rule = config.weeklySchedule[key];

    if (!rule.enabled) return;

    const start = parseTime(rule.start);
    const end = parseTime(rule.end);

    if (start === null || end === null || end <= start) {
      errors.push(`${label}: end time must be later than start time.`);
      return;
    }

    if (!rule.breakEnabled) return;

    const bs = parseTime(rule.breakStart);
    const be = parseTime(rule.breakEnd);

    if (bs === null || be === null || be <= bs) {
      errors.push(`${label}: enter a valid break time.`);
    } else if (bs < start || be > end) {
      errors.push(`${label}: break must fall within working hours.`);
    }
  });

  return errors;
};

/* PREMIUM DROPDOWN */

function PremiumDropdown({
  id,
  value,
  onChange,
  options,
  placeholder = "Select option",
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const optionRefs = useRef([]);

  const selectedIndex = options.findIndex(
    (option) => String(option.value) === String(value),
  );

  const selected = options[selectedIndex];
  const hasPosition = Boolean(position);

  const calculatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const edge = 12;
    const gap = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const availableWidth = Math.max(1, viewportWidth - edge * 2);

    const width = Math.min(Math.max(rect.width, 220), availableWidth);

    const below =
      viewportHeight - rect.bottom - gap - edge;

    const above = rect.top - gap - edge;
    const openAbove = below < 220 && above > below;

    const maxHeight = Math.max(
      100,
      Math.min(
        320,
        openAbove ? above : below,
        viewportHeight - edge * 2,
      ),
    );

    const nextPosition = {
      left: Math.max(
        edge,
        Math.min(rect.left, viewportWidth - width - edge),
      ),
      width,
      maxHeight,
      top: openAbove
        ? "auto"
        : Math.min(rect.bottom + gap, viewportHeight - edge),
      bottom: openAbove
        ? viewportHeight - rect.top + gap
        : "auto",
      openAbove,
    };

    setPosition((current) => {
      const unchanged =
        current &&
        Object.keys(nextPosition).every(
          (key) => current[key] === nextPosition[key],
        );

      return unchanged ? current : nextPosition;
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return undefined;

    calculatePosition();

    const updatePosition = (event) => {
      // Do not recalculate when scrolling the dropdown's own list.
      // This prevents focus and scrolling glitches.
      if (menuRef.current?.contains(event.target)) return;

      calculatePosition();
    };

    window.addEventListener("resize", calculatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, calculatePosition]);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (
        !rootRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !hasPosition || !options.length) return undefined;

    const frame = window.requestAnimationFrame(() => {
      const option = optionRefs.current[activeIndex];
      option?.focus({ preventScroll: true });
      option?.scrollIntoView({ block: "nearest" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, activeIndex, options.length, hasPosition]);

  const openMenu = () => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setPosition(null);
    setOpen(true);
  };

  const closeMenu = (restoreFocus = false) => {
    setOpen(false);

    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  const selectOption = (option) => {
    onChange(option.value);
    closeMenu(true);
  };

  const handleOptionKeyDown = (event, index) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      const direction = event.key === "ArrowDown" ? 1 : -1;

      setActiveIndex(
        (index + direction + options.length) % options.length,
      );
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption(options[index]);
    } else if (event.key === "Tab") {
      closeMenu();
    }
  };

  return (
    <div ref={rootRef} className="relative w-full min-w-0">
      <button
        id={id}
        ref={triggerRef}
        type="button"
        aria-label={placeholder}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={(event) => {
          if (
            !open &&
            ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)
          ) {
            event.preventDefault();
            openMenu();
          }
        }}
        className={`group mt-1.5 flex min-h-[44px] w-full items-center gap-3 rounded-xl border bg-white px-3.5 py-2.5 text-left text-sm outline-none transition-all duration-200 focus-visible:ring-4 focus-visible:ring-emerald-100 ${open
          ? "border-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]"
          : "border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md"
          }`}
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${open
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600"
            }`}
        >
          <span className="h-2 w-2 rounded-full bg-current" />
        </span>

        <span
          className={`min-w-0 flex-1 truncate font-semibold ${selected ? "text-slate-800" : "text-slate-400"
            }`}
        >
          {selected?.label || placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180 text-emerald-600" : ""
            }`}
        />
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && position && (
              <motion.div
                key={`premium-${id}`}
                ref={menuRef}
                initial={{
                  opacity: 0,
                  y: position.openAbove ? 5 : -5,
                  scale: 0.98,
                }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                style={{
                  position: "fixed",
                  left: position.left,
                  top: position.top,
                  bottom: position.bottom,
                  width: position.width,
                  maxHeight: position.maxHeight,
                  zIndex: 9999,
                  transformOrigin: position.openAbove
                    ? "bottom center"
                    : "top center",
                }}
                className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/[0.03]"
              >
                <div className="mb-1 flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-2.5">
                  <span className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {placeholder}
                  </span>
                  <span className="shrink-0 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                    {options.length} options
                  </span>
                </div>

                <div
                  role="listbox"
                  aria-label={placeholder}
                  className="tl-dropdown-scrollbar overflow-y-auto overscroll-contain"
                  style={{
                    maxHeight: Math.max(55, position.maxHeight - 52),
                  }}
                >
                  {options.map((option, index) => {
                    const isSelected =
                      String(option.value) === String(value);

                    const isActive = index === activeIndex;

                    return (
                      <button
                        key={String(option.value)}
                        ref={(node) => {
                          optionRefs.current[index] = node;
                        }}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => selectOption(option)}
                        onMouseEnter={() => setActiveIndex(index)}
                        onKeyDown={(event) =>
                          handleOptionKeyDown(event, index)
                        }
                        className={`my-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors focus:outline-none ${isSelected
                          ? "bg-emerald-50 font-semibold text-emerald-800"
                          : isActive
                            ? "bg-sky-50 text-slate-900"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isSelected
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-400"
                            }`}
                        >
                          {isSelected ? (
                            <Check size={15} />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          )}
                        </span>

                        <span className="min-w-0 flex-1 break-words">
                          {option.label}
                        </span>

                        {isSelected && (
                          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                            Selected
                          </span>
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
    </div>
  );
}

/* SHARED STYLES */

const inputClass =
  "mt-1.5 block w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

const labelClass = "block text-xs font-semibold text-slate-600";

/* STAT CARD */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  tone = "green",
  reduceMotion,
}) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    teal: "bg-teal-50 text-teal-700 ring-teal-100",
  };

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.25 }}
      className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${tones[tone]}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </motion.article>
  );
}

/* TIME INPUT */

function TimeInput({ id, label, value, onChange }) {
  return (
    <label htmlFor={id} className={labelClass}>
      {label}
      <input
        id={id}
        type="time"
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </label>
  );
}

/* WEEKLY DAY CARD */

function AvailabilityDayCard({
  dayMeta,
  rule,
  slots,
  onPatch,
  reduceMotion,
}) {
  return (
    <motion.article
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`min-w-0 overflow-hidden rounded-2xl border bg-white transition ${rule.enabled
        ? "border-emerald-100 shadow-sm"
        : "border-slate-200/80 bg-slate-50/60"
        }`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${rule.enabled
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-400"
              }`}
          >
            <CalendarDays size={18} />
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-slate-900">{dayMeta.label}</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {rule.enabled ? `${slots.length} estimated sessions` : "Day off"}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={rule.enabled}
          aria-label={`Enable ${dayMeta.label}`}
          onClick={() =>
            onPatch(dayMeta.key, { enabled: !rule.enabled })
          }
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 ${rule.enabled ? "bg-emerald-600" : "bg-slate-300"
            }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${rule.enabled ? "translate-x-6" : "translate-x-1"
              }`}
          />
        </button>
      </div>

      <div className="space-y-4 p-4">
        {rule.enabled ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <TimeInput
                id={`${dayMeta.key}-start`}
                label="Start time"
                value={rule.start}
                onChange={(value) => onPatch(dayMeta.key, { start: value })}
              />
              <TimeInput
                id={`${dayMeta.key}-end`}
                label="End time"
                value={rule.end}
                onChange={(value) => onPatch(dayMeta.key, { end: value })}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-3 transition hover:bg-emerald-50/50">
              <input
                type="checkbox"
                checked={rule.breakEnabled}
                onChange={(event) =>
                  onPatch(dayMeta.key, {
                    breakEnabled: event.target.checked,
                  })
                }
                className="h-4 w-4 accent-emerald-600"
              />
              <Coffee size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                Add break time
              </span>
            </label>

            {rule.breakEnabled && (
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-sky-50/70 p-3">
                <TimeInput
                  id={`${dayMeta.key}-break-start`}
                  label="Break starts"
                  value={rule.breakStart}
                  onChange={(value) =>
                    onPatch(dayMeta.key, { breakStart: value })
                  }
                />
                <TimeInput
                  id={`${dayMeta.key}-break-end`}
                  label="Break ends"
                  value={rule.breakEnd}
                  onChange={(value) =>
                    onPatch(dayMeta.key, { breakEnd: value })
                  }
                />
              </div>
            )}

            <div className="border-t border-slate-100 pt-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  Session preview
                </span>
                <span className="text-xs font-semibold text-emerald-700">
                  {slots.length} slots
                </span>
              </div>

              {slots.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {slots.slice(0, 4).map((slot) => (
                    <span
                      key={`${slot.start}-${slot.end}`}
                      className="rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-1.5 text-[11px] font-semibold text-emerald-800"
                    >
                      {formatClock(slot.start)}
                    </span>
                  ))}
                  {slots.length > 4 && (
                    <span className="rounded-lg bg-slate-100 px-2 py-1.5 text-[11px] font-semibold text-slate-500">
                      +{slots.length - 4} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
                  No complete session fits these hours.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex min-h-[145px] flex-col items-center justify-center py-5 text-center">
            <CalendarOff size={23} className="text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-500">
              Not available
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Enable this day to accept sessions.
            </p>
          </div>
        )}
      </div>
    </motion.article>
  );
}

/* DATE EXCEPTION MODAL */

function ExceptionModal({ onClose, onSave, existingDates, reduceMotion }) {
  const [form, setForm] = useState({
    date: getTomorrowKey(),
    type: "unavailable",
    start: "10:00",
    end: "15:00",
    note: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const submit = (event) => {
    event.preventDefault();

    if (!parseDateKey(form.date) || form.date < getTodayKey()) {
      setError("Select a valid date that is today or in the future.");
      return;
    }

    if (existingDates.includes(form.date)) {
      setError("An exception already exists for this date.");
      return;
    }

    if (form.type === "custom") {
      const start = parseTime(form.start);
      const end = parseTime(form.end);

      if (start === null || end === null || end <= start) {
        setError("End time must be later than start time.");
        return;
      }
    }

    onSave({
      id:
        window.crypto?.randomUUID?.() ||
        `exception-${Date.now()}`,
      ...form,
      note: form.note.trim(),
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
        initial={
          reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exception-title"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">
              Schedule management
            </p>
            <h2 id="exception-title" className="mt-1 text-xl font-bold text-slate-950">
              Add date exception
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5 p-5 sm:p-6">
          <div>
            <label htmlFor="exception-date" className={labelClass}>Date</label>
            <input
              id="exception-date"
              type="date"
              required
              min={getTodayKey()}
              value={form.date}
              onChange={(event) => update("date", event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="exception-type" className={labelClass}>
              Availability type
            </label>
            <PremiumDropdown
              id="exception-type"
              placeholder="Select availability type"
              value={form.type}
              onChange={(value) => update("type", value)}
              options={[
                { value: "unavailable", label: "Unavailable for the entire day" },
                { value: "custom", label: "Special working hours" },
              ]}
            />
          </div>

          {form.type === "custom" && (
            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:grid-cols-2">
              <TimeInput
                id="exception-start"
                label="Start time"
                value={form.start}
                onChange={(value) => update("start", value)}
              />
              <TimeInput
                id="exception-end"
                label="End time"
                value={form.end}
                onChange={(value) => update("end", value)}
              />
              <p className="text-xs leading-5 text-slate-500 sm:col-span-2">
                These hours are saved as a date-specific exception.
              </p>
            </div>
          )}

          <div>
            <label htmlFor="exception-note" className={labelClass}>
              Note (optional)
            </label>
            <textarea
              id="exception-note"
              rows={3}
              maxLength={160}
              value={form.note}
              onChange={(event) => update("note", event.target.value)}
              placeholder="Personal appointment or special workshop"
              className={`${inputClass} resize-y`}
            />
            <p className="mt-1 text-right text-xs text-slate-400">
              {form.note.length}/160
            </p>
          </div>

          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <Plus size={17} />
              Add exception
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* MAIN PAGE */

export default function TrainerAvailabilityPage() {
  const reduceMotion = useReducedMotion();
  const [initialData] = useState(readStoredAvailability);
  const [config, setConfig] = useState(initialData.config);
  const [savedSnapshot, setSavedSnapshot] = useState(
    JSON.stringify(initialData.config),
  );
  const [savedAt, setSavedAt] = useState(initialData.savedAt);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [toast, setToast] = useState(null);

  const isDirty = JSON.stringify(config) !== savedSnapshot;

  const notify = useCallback((message, tone = "success") => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const updateConfig = useCallback((field, value) => {
    setConfig((current) => ({ ...current, [field]: value }));
    setValidationErrors([]);
  }, []);

  const updateDay = useCallback((dayKey, patch) => {
    setConfig((current) => ({
      ...current,
      weeklySchedule: {
        ...current.weeklySchedule,
        [dayKey]: { ...current.weeklySchedule[dayKey], ...patch },
      },
    }));
    setValidationErrors([]);
  }, []);

  const weeklyStats = useMemo(() => {
    let workingDays = 0;
    let workingMinutes = 0;
    let estimatedSessions = 0;

    DAYS.forEach(({ key }) => {
      const rule = config.weeklySchedule[key];
      if (!rule.enabled) return;

      workingDays += 1;
      workingMinutes += getNetMinutesForDay(rule);
      estimatedSessions += getSlotsForDay(rule, config).length;
    });

    return { workingDays, workingMinutes, estimatedSessions };
  }, [config]);

  const sortedExceptions = useMemo(
    () => [...config.exceptions].sort((a, b) => a.date.localeCompare(b.date)),
    [config.exceptions],
  );

  const upcomingExceptions = sortedExceptions.filter(
    (exception) => exception.date >= getTodayKey(),
  );

  const handleSave = () => {
    const errors = validateConfig(config);

    if (errors.length) {
      setValidationErrors(errors);
      notify("Please correct the availability errors.", "error");

      window.setTimeout(() => {
        document.getElementById("availability-validation")?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "center",
        });
      }, 50);

      return;
    }

    const timestamp = new Date().toISOString();

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, config, savedAt: timestamp }),
      );

      setSavedSnapshot(JSON.stringify(config));
      setSavedAt(timestamp);
      setValidationErrors([]);
      notify("Availability settings saved successfully.");
    } catch {
      notify("Could not save in browser storage. Check browser settings.", "error");
    }
  };

  const handleDiscard = () => {
    try {
      setConfig(JSON.parse(savedSnapshot));
      setValidationErrors([]);
      notify("Unsaved changes have been discarded.");
    } catch {
      notify("Unable to restore the saved settings.", "error");
    }
  };

  const handleResetDefaults = () => {
    setConfig(createDefaultConfig());
    setValidationErrors([]);
    notify("Default schedule loaded. Save to keep the changes.");
  };

  const handleExport = () => {
    try {
      const blob = new Blob(
        [
          JSON.stringify({
            exportedAt: new Date().toISOString(),
            product: "TeachLive",
            settings: config,
          }, null, 2),
        ],
        { type: "application/json;charset=utf-8" },
      );

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = `teachlive-availability-${getTodayKey()}.json`;

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      notify("Availability configuration exported.");
    } catch {
      notify("Unable to export the configuration.", "error");
    }
  };

  const handleAddException = useCallback((exception) => {
    setConfig((current) => ({
      ...current,
      exceptions: [...current.exceptions, exception].sort(
        (a, b) => a.date.localeCompare(b.date),
      ),
    }));

    setValidationErrors([]);
    setShowExceptionModal(false);
    notify("Date exception added. Save to keep your changes.");
  }, [notify]);

  const handleRemoveException = (id) => {
    setConfig((current) => ({
      ...current,
      exceptions: current.exceptions.filter((exception) => exception.id !== id),
    }));

    setValidationErrors([]);
    notify("Date exception removed. Save to keep your changes.");
  };

  const closeExceptionModal = useCallback(
    () => setShowExceptionModal(false),
    [],
  );

  return (
    <div className="min-h-screen min-w-0 bg-[#f5faf8] text-slate-800">
      <style>{`
        .tl-dropdown-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #10b981 #f1f5f9;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
        .tl-dropdown-scrollbar::-webkit-scrollbar {
          width: 7px;
        }
        .tl-dropdown-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .tl-dropdown-scrollbar::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 10px;
          border: 1px solid #f1f5f9;
        }
        .tl-dropdown-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0284c7;
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
        {/* PAGE HEADER */}

        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 flex flex-wrap justify-end gap-2.5"
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <Download size={16} /> Export
            </button>

            <button
              type="button"
              onClick={() => setShowExceptionModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <CalendarClock size={16} /> Add exception
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {isDirty ? <Save size={16} /> : <Check size={16} />}
              {isDirty ? "Save changes" : "Saved"}
            </button>
          </div>
        </motion.header>

        {/* VALIDATION */}

        <AnimatePresence initial={false}>
          {validationErrors.length > 0 && (
            <motion.div
              id="availability-validation"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              role="alert"
              className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-5"
            >
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="mt-0.5 shrink-0 text-rose-600" />

                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-rose-900">
                    Please review your availability
                  </h2>

                  <ul className="mt-2 space-y-1.5 text-sm leading-5 text-rose-800">
                    {validationErrors.map((error, index) => (
                      <li key={`${error}-${index}`}>{error}</li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  aria-label="Dismiss validation"
                  onClick={() => setValidationErrors([])}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-100"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* OVERVIEW STATS */}

        <section
          aria-label="Availability overview"
          className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            icon={CalendarCheck}
            label="Working days"
            value={`${weeklyStats.workingDays}/7`}
            description="Days enabled for sessions"
            reduceMotion={reduceMotion}
          />
          <StatCard
            icon={Clock3}
            label="Weekly working time"
            value={formatDuration(weeklyStats.workingMinutes)}
            description="Break time excluded"
            tone="blue"
            reduceMotion={reduceMotion}
          />
          <StatCard
            icon={Users}
            label="Session capacity"
            value={weeklyStats.estimatedSessions}
            description="Estimated slots per week"
            tone="teal"
            reduceMotion={reduceMotion}
          />
          <StatCard
            icon={CalendarOff}
            label="Upcoming exceptions"
            value={upcomingExceptions.length}
            description="Special dates and days off"
            tone="amber"
            reduceMotion={reduceMotion}
          />
        </section>

        {/* WEEKLY AVAILABILITY */}

        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
        >
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CalendarDays size={21} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-950">Weekly availability</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enable working days and define your session hours.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <RotateCcw size={15} /> Reset defaults
            </button>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3 text-xs font-medium text-slate-500 sm:px-5">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Available
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-300" /> Day off
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Coffee size={13} /> Breaks excluded from slots
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3 2xl:grid-cols-4">
            {DAYS.map((dayMeta) => (
              <AvailabilityDayCard
                key={dayMeta.key}
                dayMeta={dayMeta}
                rule={config.weeklySchedule[dayMeta.key]}
                slots={getSlotsForDay(config.weeklySchedule[dayMeta.key], config)}
                onPatch={updateDay}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>

          <div className="flex items-start gap-2.5 border-t border-slate-100 bg-slate-50/60 px-4 py-3.5 sm:px-5">
            <Info size={17} className="mt-0.5 shrink-0 text-emerald-600" />
            <p className="text-xs leading-5 text-slate-500">
              Session previews are estimates based on hours, breaks,
              duration and buffer. Save your changes after editing.
            </p>
          </div>
        </motion.section>

        {/* SESSION SETTINGS */}

        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 p-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <SlidersHorizontal size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950">Session settings</h2>
              <p className="mt-1 text-sm text-slate-500">
                Configure session duration, buffer and timezone.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
            <div className="min-w-0">
              <label htmlFor="availability-timezone" className={labelClass}>
                <span className="inline-flex items-center gap-2">
                  <Globe2 size={15} className="text-slate-400" /> Timezone
                </span>
              </label>
              <PremiumDropdown
                id="availability-timezone"
                placeholder="Select timezone"
                value={config.timeZone}
                onChange={(value) => updateConfig("timeZone", value)}
                options={TIME_ZONES}
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Schedule times are stored as entered for the selected timezone.
              </p>
            </div>

            <div className="min-w-0">
              <label htmlFor="session-duration" className={labelClass}>
                <span className="inline-flex items-center gap-2">
                  <Clock3 size={15} className="text-slate-400" /> Session duration
                </span>
              </label>
              <PremiumDropdown
                id="session-duration"
                placeholder="Select duration"
                value={config.sessionDuration}
                onChange={(value) => updateConfig("sessionDuration", Number(value))}
                options={DURATIONS.map((duration) => ({
                  value: duration,
                  label: `${duration} minutes${duration === 60 ? " (1 hour)" : ""}`,
                }))}
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">
                How long each teaching session will last.
              </p>
            </div>

            <div className="min-w-0">
              <label htmlFor="session-buffer" className={labelClass}>
                <span className="inline-flex items-center gap-2">
                  <Coffee size={15} className="text-slate-400" /> Buffer between sessions
                </span>
              </label>
              <PremiumDropdown
                id="session-buffer"
                placeholder="Select buffer"
                value={config.bufferMinutes}
                onChange={(value) => updateConfig("bufferMinutes", Number(value))}
                options={BUFFERS.map((buffer) => ({
                  value: buffer,
                  label: buffer === 0 ? "No buffer" : `${buffer} minutes`,
                }))}
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Recovery time between consecutive sessions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 border-t border-slate-100 px-4 py-3.5 sm:px-5">
            <Info size={17} className="mt-0.5 shrink-0 text-sky-600" />
            <p className="text-xs leading-5 text-slate-500">
              Changing duration or buffer recalculates session previews.
              These settings do not themselves create calendar bookings.
            </p>
          </div>
        </motion.section>

        {/* DATE EXCEPTIONS */}

        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
        >
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CalendarClock size={21} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-950">Date exceptions</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add days off or special hours for specific dates.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowExceptionModal(true)}
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <Plus size={17} /> Add exception
            </button>
          </div>

          {sortedExceptions.length ? (
            <div className="divide-y divide-slate-100">
              {sortedExceptions.map((exception) => {
                const unavailable = exception.type === "unavailable";
                const past = exception.date < getTodayKey();

                return (
                  <div
                    key={exception.id}
                    className="flex flex-col gap-3 px-4 py-4 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${unavailable
                        ? "bg-rose-50 text-rose-600"
                        : "bg-emerald-50 text-emerald-700"
                        }`}>
                        {unavailable ? <CalendarOff size={19} /> : <Clock3 size={19} />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-slate-900">
                            {formatDate(exception.date, {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${unavailable
                            ? "bg-rose-50 text-rose-700"
                            : "bg-emerald-50 text-emerald-700"
                            }`}>
                            {unavailable ? "Day off" : "Special hours"}
                          </span>
                          {past && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                              Past
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-600">
                          {unavailable
                            ? "Unavailable for the entire day"
                            : `${formatClock(exception.start)} – ${formatClock(exception.end)}`}
                        </p>
                        {exception.note && (
                          <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                            {exception.note}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveException(exception.id)}
                      aria-label={`Remove exception for ${exception.date}`}
                      className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-5 py-12 text-center sm:py-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <CalendarDays size={25} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                No date exceptions
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Your schedule follows your regular weekly hours.
                Add an exception for a day off or special date.
              </p>
              <button
                type="button"
                onClick={() => setShowExceptionModal(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
              >
                <Plus size={16} /> Create your first exception
              </button>
            </div>
          )}

          <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3.5 sm:px-5">
            <p className="text-xs leading-5 text-slate-500">
              <strong className="text-slate-700">Important:</strong>{" "}
              Date exceptions are saved as configuration records.
              They will not block real student bookings until backend
              booking validation is integrated.
            </p>
          </div>
        </motion.section>

        {/* SAVE / DISCARD */}

        <div className="mt-6 flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck size={19} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Your availability settings
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {isDirty
                  ? "You have unsaved changes."
                  : "All current changes are saved in this browser."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={!isDirty}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <RotateCcw size={15} /> Discard changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-slate-300"
            >
              <Save size={15} /> Save availability
            </button>
          </div>
        </div>
      </div>

      {/* TOAST */}

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            role="status"
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            className={`fixed bottom-4 left-4 right-4 z-[130] mx-auto flex max-w-md items-center gap-3 rounded-2xl border bg-white p-4 shadow-2xl sm:bottom-6 sm:left-auto sm:right-6 ${toast.tone === "error" ? "border-rose-200" : "border-emerald-200"
              }`}
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toast.tone === "error"
              ? "bg-rose-50 text-rose-600"
              : "bg-emerald-50 text-emerald-600"
              }`}>
              {toast.tone === "error"
                ? <AlertCircle size={18} />
                : <CheckCircle2 size={18} />}
            </div>
            <p className="min-w-0 flex-1 text-sm font-semibold">{toast.message}</p>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXCEPTION MODAL */}

      <AnimatePresence>
        {showExceptionModal && (
          <ExceptionModal
            key="availability-exception-modal"
            onClose={closeExceptionModal}
            onSave={handleAddException}
            existingDates={config.exceptions.map((e) => e.date)}
            reduceMotion={reduceMotion}
          />
        )}
      </AnimatePresence>
    </div>
  );
}