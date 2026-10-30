
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ArrowDownUp,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Download,
  Filter,
  GraduationCap,
  Plus,
  Search,
  SlidersHorizontal,
  UserRoundCheck,
  Users,
  X,
} from "lucide-react";

/* =========================================================
   TRAINER ASSIGNMENTS — PREMIUM ADMIN PAGE
   CodeFaculty orange-white theme
========================================================= */

const STORAGE_KEY = "codefaculty_admin_trainer_assignments_premium_v2";

const INITIAL_ASSIGNMENTS = [
  {
    id: "TA-1001",
    trainer: "Aman Sharma",
    college: "RKGIT",
    technology: "Java + DSA",
    duration: "4 Months",
    startDate: "2026-10-01",
    status: "Active",
    createdAt: "2026-09-20T09:00:00.000Z",
  },
  {
    id: "TA-1002",
    trainer: "Priya Verma",
    college: "XYZ College",
    technology: "Python AI/ML",
    duration: "8 Weeks",
    startDate: "2026-10-05",
    status: "Pending",
    createdAt: "2026-09-23T09:00:00.000Z",
  },
  {
    id: "TA-1003",
    trainer: "Rahul Mehta",
    college: "Global University",
    technology: "Full Stack",
    duration: "Semester",
    startDate: "2026-09-28",
    status: "Active",
    createdAt: "2026-09-18T09:00:00.000Z",
  },
];

const TRAINERS = [
  "Aman Sharma",
  "Priya Verma",
  "Rahul Mehta",
  "Rahul Verma",
  "Priya Singh",
  "Ankit Mehta",
  "Neha Agarwal",
  "Karan Malhotra",
];

const COLLEGES = [
  "RKGIT",
  "XYZ College",
  "Global University",
  "Rajasthan Technical University",
  "JECRC University",
  "Poornima College of Engineering",
  "LNM Institute of Information Technology",
  "Arya College of Engineering",
  "SKIT Jaipur",
];

const PROGRAMS = [
  "Java + DSA",
  "Python AI/ML",
  "Full Stack",
  "Full Stack Development",
  "Python Programming",
  "Java & DSA",
  "Artificial Intelligence",
  "Data Science",
  "React Development",
  "Machine Learning",
  "Cloud Computing",
];

const DURATIONS = [
  "4 Weeks",
  "8 Weeks",
  "12 Weeks",
  "3 Months",
  "4 Months",
  "6 Months",
  "Semester",
  "Full Year",
];

const STATUS_OPTIONS = [
  { label: "All statuses", value: "All" },
  { label: "Active", value: "Active", description: "Currently running" },
  { label: "Pending", value: "Pending", description: "Awaiting activation" },
  { label: "Completed", value: "Completed", description: "Assignment finished" },
];

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Start date: earliest", value: "date-asc" },
  { label: "Start date: latest", value: "date-desc" },
  { label: "Trainer: A to Z", value: "trainer-asc" },
];

const STATUS_META = {
  Active: { label: "Active", className: "active" },
  Pending: { label: "Pending", className: "pending" },
  Completed: { label: "Completed", className: "completed" },
};

const EMPTY_FORM = {
  trainer: "",
  college: "",
  technology: "",
  duration: "",
  startDate: "",
};

/* =========================================================
   HELPERS
========================================================= */

const loadAssignments = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to load trainer assignments:", error);
  }

  return INITIAL_ASSIGNMENTS;
};

const formatDate = (value) => {
  if (!value) return "Not scheduled";

  const date = new Date(
    value.length === 10 ? `${value}T00:00:00` : value
  );

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDateValue = (value) => {
  if (!value) return 0;

  const date = new Date(
    value.length === 10 ? `${value}T00:00:00` : value
  );

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const uniqueOptions = (values) =>
  [...new Set(values.filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({
      label: value,
      value,
    }));

const escapeCSV = (value) =>
  `"${String(value ?? "").replace(/"/g, '""')}"`;

/* =========================================================
   PREMIUM SEARCHABLE SELECT
   Portal-based dropdown with custom scrollbar
========================================================= */

function PremiumSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  searchable = true,
  disabled = false,
  className = "",
  menuWidth,
  searchPlaceholder = "Search options...",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuStyle, setMenuStyle] = useState({});

  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const normalizedOptions = useMemo(
    () =>
      options.map((option) =>
        typeof option === "string"
          ? { label: option, value: option }
          : option
      ),
    [options]
  );

  const selectedOption = normalizedOptions.find(
    (option) => option.value === value
  );

  const filteredOptions = normalizedOptions.filter((option) => {
    const searchableText = `${option.label} ${option.description || ""}`;
    return searchableText.toLowerCase().includes(query.toLowerCase());
  });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const availableBelow = viewportHeight - rect.bottom - 16;
    const availableAbove = rect.top - 16;

    const openBelow =
      availableBelow >= 220 || availableBelow >= availableAbove;

    const maxHeight = Math.max(
      145,
      Math.min(320, openBelow ? availableBelow : availableAbove)
    );

    const desiredWidth = menuWidth || Math.max(rect.width, 220);

    const width = Math.min(desiredWidth, viewportWidth - 24);

    const left = Math.min(
      Math.max(12, rect.left),
      viewportWidth - width - 12
    );

    setMenuStyle({
      position: "fixed",
      left,
      width,
      maxHeight,
      top: openBelow ? rect.bottom + 7 : "auto",
      bottom: openBelow
        ? "auto"
        : viewportHeight - rect.top + 7,
    });
  }, [menuWidth]);

  useEffect(() => {
    if (!open) return undefined;

    updatePosition();

    const handleOutside = (event) => {
      if (
        !triggerRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpen(false);
        setQuery("");
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleKeyDown);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleKeyDown);

      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  const selectOption = (option) => {
    onChange(option.value);
    setOpen(false);
    setQuery("");
  };

  const menu =
    open && typeof document !== "undefined"
      ? createPortal(
        <AnimatePresence>
          <motion.div
            ref={menuRef}
            className="ta-dropdown-menu"
            style={menuStyle}
            initial={{
              opacity: 0,
              y: -5,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -5,
              scale: 0.985,
            }}
            transition={{ duration: 0.16 }}
          >
            {searchable && (
              <div className="ta-dropdown-search">
                <Search size={15} />

                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}

            <div className="ta-dropdown-options ta-scrollbar">
              {filteredOptions.length ? (
                filteredOptions.map((option) => {
                  const active = option.value === value;

                  return (
                    <button
                      type="button"
                      key={option.value}
                      className={`ta-dropdown-option ${active ? "active" : ""
                        }`}
                      onClick={() => selectOption(option)}
                    >
                      <span className="ta-option-copy">
                        <span className="ta-option-label">
                          {option.label}
                        </span>

                        {option.description && (
                          <span className="ta-option-description">
                            {option.description}
                          </span>
                        )}
                      </span>

                      {active && (
                        <span className="ta-option-check">
                          <Check size={14} />
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="ta-dropdown-empty">
                  No matching options found
                </div>
              )}
            </div>

            <div className="ta-dropdown-footer">
              <span>{filteredOptions.length} options</span>
              <span>CodeFaculty</span>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`ta-select-trigger ${open ? "is-open" : ""
          } ${className}`}
        onClick={() => {
          if (disabled) return;

          setOpen((previous) => !previous);
          setQuery("");
        }}
      >
        <span
          className={
            selectedOption
              ? "ta-select-value"
              : "ta-select-placeholder"
          }
        >
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`ta-select-chevron ${open ? "rotated" : ""
            }`}
        />
      </button>

      {menu}
    </>
  );
}

/* =========================================================
   SHARED UI COMPONENTS
========================================================= */

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Pending;

  return (
    <span className={`ta-status-badge ${meta.className}`}>
      <span className="ta-status-dot" />
      {meta.label}
    </span>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  note,
  tone,
  index,
}) {
  return (
    <motion.div
      className="ta-stat-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045 }}
    >
      <div className="ta-stat-top">
        <span className={`ta-stat-icon ${tone}`}>
          <Icon size={19} />
        </span>

        <span className="ta-stat-note">
          <Activity size={12} />
          {note}
        </span>
      </div>

      <div className="ta-stat-value">{value}</div>

      <div className="ta-stat-title">{title}</div>
    </motion.div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="ta-info-item">
      <span className="ta-info-icon">
        <Icon size={15} />
      </span>

      <span className="ta-info-copy">
        <small>{label}</small>
        <strong title={value}>{value || "—"}</strong>
      </span>
    </div>
  );
}

function Modal({
  title,
  description,
  icon: Icon = UserRoundCheck,
  onClose,
  children,
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="ta-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <motion.div
          className="ta-modal"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{
            opacity: 0,
            y: 16,
            scale: 0.985,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 12,
            scale: 0.985,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="ta-modal-header">
            <div className="ta-modal-heading-icon">
              <Icon size={20} />
            </div>

            <div className="ta-modal-heading-copy">
              <span className="ta-modal-eyebrow">
                CODEFACULTY ADMIN
              </span>

              <h2>{title}</h2>
              <p>{description}</p>
            </div>

            <button
              type="button"
              className="ta-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="ta-modal-body ta-scrollbar">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

/* =========================================================
   PAGE STYLES — SCOPED TO THIS PAGE
========================================================= */

const PAGE_STYLES = `
.ta-page {
  --ta-orange: #f4512b;
  --ta-orange-dark: #df3f1d;
  --ta-orange-soft: #fff0ea;
  --ta-ink: #202633;
  --ta-muted: #87909e;
  --ta-line: #edf0f3;

  width: 100%;
  min-width: 0;
  position: relative;
  padding: 2px 2px 30px;
  color: var(--ta-ink);

  font-family: Inter, ui-sans-serif, system-ui,
  -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.ta-page *,
.ta-page *::before,
.ta-page *::after {
  box-sizing: border-box;
}

.ta-page button,
.ta-page input {
  font: inherit;
}

.ta-page button {
  cursor: pointer;
}

.ta-page button:focus-visible,
.ta-page input:focus-visible {
  outline: 3px solid rgba(244,81,43,.16);
  outline-offset: 2px;
}

/* CUSTOM SCROLLBAR */

.ta-scrollbar,
.ta-dropdown-menu,
.ta-modal-body {
  scrollbar-width: thin;
  scrollbar-color: #f58b70 #fff0ea;
}

.ta-scrollbar::-webkit-scrollbar,
.ta-dropdown-menu::-webkit-scrollbar,
.ta-modal-body::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

.ta-scrollbar::-webkit-scrollbar-track,
.ta-dropdown-menu::-webkit-scrollbar-track,
.ta-modal-body::-webkit-scrollbar-track {
  background: #fff2ed;
  border-radius: 20px;
}

.ta-scrollbar::-webkit-scrollbar-thumb,
.ta-dropdown-menu::-webkit-scrollbar-thumb,
.ta-modal-body::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg,#ffad94,#f4512b);
  border: 2px solid #fff2ed;
  border-radius: 20px;
}

.ta-scrollbar::-webkit-scrollbar-thumb:hover,
.ta-dropdown-menu::-webkit-scrollbar-thumb:hover,
.ta-modal-body::-webkit-scrollbar-thumb:hover {
  background: #df3f1d;
}

/* HEADER */

.ta-page-header {
  margin-bottom: 21px;
}

.ta-breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 17px;
  color: #929aa6;
  font-size: 13px;
  font-weight: 650;
}

.ta-breadcrumb-separator {
  color: #c9cdd3;
}

.ta-breadcrumb .current {
  color: #4b5563;
}

.ta-header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 22px;
}

.ta-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: var(--ta-orange);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.ta-eyebrow-dot {
  width: 7px;
  height: 7px;
  display: inline-block;
  border-radius: 50%;
  background: var(--ta-orange);
  box-shadow: 0 0 0 4px rgba(244,81,43,.10);
}

.ta-header-main h1 {
  margin: 0;
  color: #202633;
  font-size: clamp(25px,3vw,31px);
  font-weight: 790;
  letter-spacing: -1.1px;
  line-height: 1.2;
}

.ta-header-main h1 span {
  color: var(--ta-orange);
}

.ta-page-description {
  max-width: 620px;
  margin: 8px 0 0;
  color: #89919d;
  font-size: 14px;
  line-height: 1.65;
}

.ta-header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
}

.ta-button {
  height: 41px;
  padding: 0 15px;
  border: 1px solid transparent;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 750;
  white-space: nowrap;
  transition: all .2s ease;
}

.ta-button-primary {
  color: #fff;
  background: linear-gradient(135deg,#ff704c,#f4512b);
  border-color: #f4512b;
  box-shadow: 0 5px 13px rgba(244,81,43,.17);
}

.ta-button-primary:hover {
  background: linear-gradient(135deg,#f45d38,#df3f1d);
  box-shadow: 0 7px 17px rgba(244,81,43,.23);
  transform: translateY(-1px);
}

.ta-button-secondary {
  color: #5e6876;
  background: #fff;
  border-color: #e7e9ed;
}

.ta-button-secondary:hover {
  color: var(--ta-orange);
  background: #fffaf8;
  border-color: #ffc6b6;
}

/* STATISTICS */

.ta-stats-grid {
  display: grid;
  grid-template-columns: repeat(4,minmax(0,1fr));
  gap: 13px;
  margin-bottom: 19px;
}

.ta-stat-card {
  min-width: 0;
  padding: 16px 17px 15px;
  border: 1px solid #edf0f2;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 3px 14px rgba(25,35,50,.025);
  transition: transform .2s ease,box-shadow .2s ease;
}

.ta-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 9px 23px rgba(25,35,50,.055);
}

.ta-stat-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.ta-stat-icon {
  width: 37px;
  height: 37px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
}

.ta-stat-icon.orange {
  color: #f4512b;
  background: #fff0ea;
}

.ta-stat-icon.green {
  color: #22966b;
  background: #eaf8f1;
}

.ta-stat-icon.amber {
  color: #bd8524;
  background: #fff7e8;
}

.ta-stat-icon.blue {
  color: #3979d8;
  background: #edf4ff;
}

.ta-stat-note {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #a0a7b1;
  font-size: 11px;
  font-weight: 650;
}

.ta-stat-note svg {
  color: #299d72;
}

.ta-stat-value {
  margin-bottom: 4px;
  color: #232a37;
  font-size: 25px;
  line-height: 1.1;
  letter-spacing: -.8px;
  font-weight: 800;
}

.ta-stat-title {
  color: #596373;
  font-size: 13px;
  font-weight: 750;
}

/* MAIN CONTENT */

.ta-content-card {
  overflow: visible;
  border: 1px solid #eceff2;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 18px rgba(22,34,50,.025);
}

.ta-content-heading {
  padding: 17px 19px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid #f0f1f3;
}

.ta-content-title-line {
  display: flex;
  align-items: center;
  gap: 11px;
}

.ta-section-icon {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ta-orange);
  background: #fff1eb;
  border-radius: 11px;
}

.ta-content-heading h2 {
  margin: 0;
  color: #29303d;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -.15px;
}

.ta-content-heading p {
  margin: 4px 0 0;
  color: #9aa2ad;
  font-size: 12px;
}

.ta-record-count {
  padding: 7px 10px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid #eceff2;
  border-radius: 30px;
  color: #818a97;
  background: #fafbfc;
  font-size: 11px;
  font-weight: 750;
  white-space: nowrap;
}

.ta-record-count-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #26966a;
}

/* TOOLBAR + SEARCH */

.ta-toolbar {
  padding: 13px 19px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid #f0f1f3;
}

.ta-search-box {
  height: 39px;
  min-width: 190px;
  max-width: 330px;
  flex: 1;
  padding: 0 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e9ecf0;
  border-radius: 9px;
  color: #a0a8b2;
  background: #fcfcfd;
  transition: .2s ease;
}

.ta-search-box:focus-within {
  border-color: #f6a08a;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(244,81,43,.07);
}

.ta-page .ta-search-box input {
  width: 100%;
  min-width: 0;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  color: #111827 !important;
  font-size: 12px !important;
  font-weight: 750 !important;
  appearance: none;
}

.ta-search-box input::placeholder {
  color: #aab1ba;
}

.ta-search-box button {
  display: flex;
  flex-shrink: 0;
  padding: 3px;
  border: 0;
  color: #9ca4af;
  background: transparent;
}

.ta-search-box button:hover {
  color: var(--ta-orange);
}

.ta-toolbar-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.ta-filter-select {
  width: 132px;
}

.ta-filter-select.college {
  width: 155px;
}

.ta-filter-select.program {
  width: 150px;
}

.ta-sort-select {
  width: 174px;
  padding-left: 9px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-left: 1px solid #eceff2;
  color: #89919d;
}

.ta-sort-select .ta-select-trigger {
  padding-left: 3px;
  border-color: transparent;
  background: transparent;
}

/* PREMIUM SELECT */

.ta-select-trigger {
  width: 100%;
  min-width: 0;
  height: 39px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid #e8ebef;
  border-radius: 9px;
  color: #596373;
  background: #fff;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  transition: .18s ease;
}

.ta-select-trigger:hover {
  border-color: #f5b09e;
  background: #fffdfc;
}

.ta-select-trigger.is-open {
  border-color: #f28d73;
  box-shadow: 0 0 0 3px rgba(244,81,43,.075);
}

.ta-select-trigger:disabled {
  cursor: not-allowed;
  opacity: .55;
}

.ta-select-value,
.ta-select-placeholder {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ta-select-value {
  color: #4b5563;
}

.ta-select-placeholder {
  color: #a1a8b2;
}

.ta-select-chevron {
  flex-shrink: 0;
  color: #939ca8;
  transition: transform .18s ease;
}

.ta-select-chevron.rotated {
  transform: rotate(180deg);
  color: var(--ta-orange);
}

.ta-dropdown-menu {
  z-index: 999999;
  min-width: 210px;
  max-width: calc(100vw - 24px);
  padding: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid #f0e4df;
  border-radius: 12px;
  background: #fff;
  box-shadow:
    0 17px 45px rgba(35,42,55,.16),
    0 3px 9px rgba(35,42,55,.05);
}

.ta-dropdown-search {
  min-height: 36px;
  flex-shrink: 0;
  margin-bottom: 5px;
  padding: 0 9px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #f0f1f3;
  border-radius: 8px;
  color: #9ba3ae;
  background: #fafafa;
}

.ta-dropdown-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: #424b59;
  background: transparent;
  font-size: 12px;
}

.ta-dropdown-search input::placeholder {
  color: #aab1ba;
}

.ta-dropdown-search button {
  padding: 2px;
  display: flex;
  border: 0;
  color: #9ba3ae;
  background: transparent;
}

.ta-dropdown-options {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 2px;
}

.ta-dropdown-option {
  width: 100%;
  min-height: 36px;
  padding: 8px 9px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 0;
  border-radius: 7px;
  color: #626c79;
  background: transparent;
  text-align: left;
  transition: .14s ease;
}

.ta-dropdown-option:hover {
  color: #e64a27;
  background: #fff5f1;
}

.ta-dropdown-option.active {
  color: #e84c29;
  background: #fff0ea;
  font-weight: 750;
}

.ta-option-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ta-option-label {
  font-size: 12px;
  line-height: 1.4;
}

.ta-option-description {
  color: #a2a9b2;
  font-size: 11px;
}

.ta-option-check {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffdbd0;
  border-radius: 6px;
  color: var(--ta-orange);
  background: #fff;
}

.ta-dropdown-empty {
  padding: 21px 10px;
  color: #99a1ab;
  text-align: center;
  font-size: 12px;
}

.ta-dropdown-footer {
  flex-shrink: 0;
  margin-top: 4px;
  padding: 8px 5px 2px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #f1f1f2;
  color: #a2a9b2;
  font-size: 11px;
}

/* PREMIUM SEARCH ICON + CARET FIX */
.ta-page .ta-search-box input {
  caret-color: #111827 !important;
  color: #111827 !important;
}

.ta-page .ta-search-box > svg:first-child {
  color: #F4512B !important;
  stroke-width: 2.2;
  flex-shrink: 0;
}

.ta-page .ta-search-box button {
  width: 27px;
  height: 27px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: none;
  border-radius: 7px;
  color: #64748B !important;
  background: transparent;
  transition: all .2s ease;
}

.ta-page .ta-search-box button svg {
  color: inherit;
  stroke-width: 2.2;
}

.ta-page .ta-search-box button:hover {
  color: #F4512B !important;
  background: #FFF0EA;
}

.ta-page .ta-search-box:focus-within > svg:first-child {
  color: #DF3F1D !important;
}
/* ACTIVE FILTER CHIPS */

.ta-active-filters {
  min-height: 39px;
  padding: 8px 19px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  border-bottom: 1px solid #f0f1f3;
  background: #fffdfc;
}

.ta-active-filter-label {
  margin-right: 2px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #9aa1aa;
  font-size: 11px;
  font-weight: 750;
}

.ta-filter-chip {
  padding: 5px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #ffddd2;
  border-radius: 30px;
  color: #db5738;
  background: #fff;
  font-size: 11px;
  font-weight: 650;
}

.ta-filter-chip:hover {
  background: #fff0ea;
}

.ta-clear-filters {
  padding: 5px;
  border: 0;
  color: #858e9a;
  background: transparent;
  font-size: 11px;
  font-weight: 750;
}

.ta-clear-filters:hover {
  color: var(--ta-orange);
}

/* ASSIGNMENT CARDS */

.ta-assignment-grid {
  padding: 17px;
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 14px;
}

.ta-assignment-card {
  min-width: 0;
  padding: 17px;
  border: 1px solid #eceff2;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(22,34,50,.025);
  transition:
    border-color .2s ease,
    box-shadow .2s ease,
    transform .2s ease;
}

.ta-assignment-card:hover {
  border-color: #f5c7b9;
  box-shadow: 0 10px 25px rgba(34,43,58,.065);
}

.ta-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.ta-person-block {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 11px;
}

.ta-person-avatar {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffe4da;
  border-radius: 12px;
  color: #f4512b;
  background: linear-gradient(145deg,#fff4ef,#ffebe3);
}

.ta-person-copy {
  min-width: 0;
}

.ta-person-copy h3 {
  overflow: hidden;
  margin: 0;
  color: #303846;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -.15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ta-person-program {
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #e16a4d;
  font-size: 12px;
  font-weight: 650;
}

.ta-person-program span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ta-assignment-id {
  margin-top: 4px;
  color: #a7aeb8;
  font-size: 11px;
  font-weight: 650;
  letter-spacing: .25px;
}

.ta-status-badge {
  min-height: 24px;
  padding: 5px 9px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 750;
}

.ta-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.ta-status-badge.active {
  color: #21845f;
  border: 1px solid #d9f1e6;
  background: #ecf9f2;
}

.ta-status-badge.pending {
  color: #a9751d;
  border: 1px solid #f5e5c4;
  background: #fff8e9;
}

.ta-status-badge.completed {
  color: #3974c3;
  border: 1px solid #dce9fb;
  background: #eff6ff;
}

.ta-card-info-panel {
  margin-top: 15px;
  padding: 13px;
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 14px 12px;
  border: 1px solid #edf0f2;
  border-radius: 11px;
  background: #fafbfc;
}

.ta-info-item {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 9px;
}

.ta-info-icon {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e9edf1;
  border-radius: 8px;
  color: #84909f;
  background: #fff;
}

.ta-info-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ta-info-copy small {
  color: #929aa6;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .65px;
  text-transform: uppercase;
}

.ta-info-copy strong {
  overflow: hidden;
  color: #566170;
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ta-card-footer {
  margin-top: 14px;
  padding-top: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-top: 1px solid #f0f1f3;
}

.ta-card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ta-card-link {
  padding: 8px 7px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  border-radius: 8px;
  color: #7c8795;
  background: transparent;
  font-size: 12px;
  font-weight: 750;
  transition: .18s ease;
}

.ta-card-link:hover {
  color: var(--ta-orange);
  background: #fff5f1;
}

.ta-card-action {
  min-width: 116px;
  height: 35px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid transparent;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 750;
  transition: .18s ease;
}

.ta-card-action.activate {
  color: #fff;
  background: linear-gradient(135deg,#ff704c,#f4512b);
  box-shadow: 0 4px 10px rgba(244,81,43,.14);
}

.ta-card-action.activate:hover {
  background: linear-gradient(135deg,#f45d38,#df3f1d);
  transform: translateY(-1px);
}

.ta-card-action.active {
  color: #21845f;
  border-color: #d9f1e6;
  background: #ecf9f2;
  cursor: default;
}

.ta-card-action.completed {
  color: #3974c3;
  border-color: #dce9fb;
  background: #eff6ff;
  cursor: default;
}

/* EMPTY STATE */

.ta-empty-state {
  padding: 48px 20px;
  text-align: center;
}

.ta-empty-icon {
  width: 54px;
  height: 54px;
  margin: 0 auto 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffe5dc;
  border-radius: 16px;
  color: #f0785c;
  background: #fff5f1;
}

.ta-empty-state h3 {
  margin: 0;
  color: #3d4653;
  font-size: 15px;
  font-weight: 800;
}

.ta-empty-state p {
  margin: 6px 0 15px;
  color: #9aa2ad;
  font-size: 12px;
}

/* MODAL + FORM */

.ta-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9000;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(24,31,42,.42);
  backdrop-filter: blur(5px);
}

.ta-modal {
  width: min(100%,590px);
  max-height: min(90vh,780px);
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.75);
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(25,34,48,.23);
}

.ta-modal-header {
  padding: 19px 21px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-bottom: 1px solid #edf0f2;
}

.ta-modal-heading-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffe2d8;
  border-radius: 11px;
  color: var(--ta-orange);
  background: #fff2ed;
}

.ta-modal-heading-copy {
  min-width: 0;
  flex: 1;
}

.ta-modal-eyebrow {
  color: var(--ta-orange);
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 1.3px;
}

.ta-modal-heading-copy h2 {
  margin: 4px 0 0;
  color: #252d3a;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -.3px;
}

.ta-modal-heading-copy p {
  margin: 4px 0 0;
  color: #929aa6;
  font-size: 12px;
  line-height: 1.5;
}

.ta-modal-close {
  width: 31px;
  height: 31px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #edf0f2;
  border-radius: 9px;
  color: #89929e;
  background: #fff;
}

.ta-modal-close:hover {
  color: #d94e30;
  border-color: #ffd8cc;
  background: #fff7f4;
}

.ta-modal-body {
  max-height: calc(90vh - 82px);
  overflow-y: auto;
  padding: 20px 21px 21px;
}

.ta-form-grid {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 15px 13px;
}

.ta-field {
  min-width: 0;
}

.ta-field.span-2 {
  grid-column: span 2;
}

.ta-field-label {
  margin-bottom: 7px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #596373;
  font-size: 12px;
  font-weight: 800;
}

.ta-required {
  color: #ed6647;
}

.ta-input {
  width: 100%;
  height: 40px;
  padding: 0 11px;
  border: 1px solid #e7eaee;
  border-radius: 9px;
  outline: none;
  color: #424b59;
  background: #fff;
  font-size: 12px;
  transition: .18s ease;
}

.ta-input:hover {
  border-color: #d8dde3;
}

.ta-input:focus {
  border-color: #f28d73;
  box-shadow: 0 0 0 3px rgba(244,81,43,.075);
}

.ta-input::placeholder {
  color: #aab1ba;
}

.ta-field .ta-select-trigger {
  height: 40px;
}

.ta-form-error {
  margin-top: 14px;
  padding: 10px 12px;
  border: 1px solid #f7d6d1;
  border-radius: 9px;
  color: #bd4935;
  background: #fff6f4;
  font-size: 12px;
  font-weight: 650;
}

.ta-modal-footer {
  margin-top: 20px;
  padding-top: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-top: 1px solid #edf0f2;
}

.ta-modal-footer-note {
  color: #a0a7b1;
  font-size: 11px;
}

.ta-modal-footer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ta-detail-banner {
  margin-bottom: 17px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 11px;
  border: 1px solid #ffe5dc;
  border-radius: 12px;
  background: linear-gradient(115deg,#fff8f5,#fff);
}

.ta-detail-avatar {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffe2d8;
  border-radius: 12px;
  color: var(--ta-orange);
  background: #fff;
}

.ta-detail-person {
  min-width: 0;
  flex: 1;
}

.ta-detail-person strong {
  display: block;
  overflow: hidden;
  color: #333d4b;
  font-size: 14px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ta-detail-person span {
  display: block;
  margin-top: 4px;
  color: #df765a;
  font-size: 12px;
  font-weight: 650;
}

.ta-detail-grid {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 11px;
}

.ta-detail-item {
  min-width: 0;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid #edf0f2;
  border-radius: 10px;
  background: #fbfcfd;
}

.ta-detail-item .ta-info-icon {
  width: 31px;
  height: 31px;
}

.ta-detail-status {
  max-width: 210px;
}

.ta-toast {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 1000000;
  max-width: min(360px,calc(100vw - 32px));
  padding: 12px 15px;
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid #d9eee4;
  border-radius: 11px;
  color: #207a58;
  background: #f0fbf5;
  box-shadow: 0 12px 35px rgba(28,48,39,.12);
  font-size: 13px;
  font-weight: 750;
}

/* RESPONSIVE */

@media (max-width:1100px) {
  .ta-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .ta-search-box {
    max-width: none;
    width: 100%;
  }

  .ta-toolbar-filters {
    width: 100%;
  }

  .ta-filter-select.college,
  .ta-filter-select.program {
    width: 145px;
  }
}

@media (max-width:900px) {
  .ta-stats-grid {
    grid-template-columns: repeat(2,minmax(0,1fr));
  }

  .ta-header-main {
    align-items: flex-start;
    flex-direction: column;
  }

  .ta-header-actions {
    width: 100%;
  }
}

@media (max-width:680px) {
  .ta-assignment-grid {
    grid-template-columns: minmax(0,1fr);
    padding: 12px;
  }

  .ta-toolbar-filters {
    display: grid;
    grid-template-columns: repeat(2,minmax(0,1fr));
  }

  .ta-filter-select,
  .ta-filter-select.college,
  .ta-filter-select.program,
  .ta-sort-select {
    width: 100%;
  }

  .ta-sort-select {
    padding-left: 0;
    border-left: 0;
  }

  .ta-content-heading {
    padding: 14px;
  }

  .ta-toolbar {
    padding: 12px 14px;
  }

  .ta-active-filters {
    padding: 8px 14px;
  }

  .ta-stats-grid {
    gap: 9px;
  }

  .ta-stat-card {
    padding: 13px;
  }

  .ta-stat-value {
    font-size: 22px;
  }

  .ta-header-actions {
    flex-wrap: wrap;
  }
}

@media (max-width:460px) {
  .ta-stats-grid {
    grid-template-columns: repeat(2,minmax(0,1fr));
  }

  .ta-card-info-panel {
    grid-template-columns: minmax(0,1fr);
  }

  .ta-card-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .ta-card-actions {
    width: 100%;
  }

  .ta-card-actions .ta-card-action {
    flex: 1;
  }

  .ta-card-link {
    justify-content: center;
  }

  .ta-form-grid,
  .ta-detail-grid {
    grid-template-columns: minmax(0,1fr);
  }

  .ta-field.span-2 {
    grid-column: span 1;
  }

  .ta-modal-backdrop {
    padding: 9px;
  }

  .ta-modal-header,
  .ta-modal-body {
    padding-left: 15px;
    padding-right: 15px;
  }

  .ta-modal-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .ta-modal-footer-actions {
    width: 100%;
  }

  .ta-modal-footer-actions .ta-button {
    flex: 1;
  }
}
`;

/* =========================================================
   MAIN PAGE
========================================================= */

export default function TrainerAssignmentsPage() {
  const [assignments, setAssignments] = useState(loadAssignments);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCollege, setSelectedCollege] = useState("All");
  const [selectedProgram, setSelectedProgram] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const [detailStatus, setDetailStatus] = useState("Pending");
  const [toast, setToast] = useState("");

  /* SAVE DATA */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(assignments)
      );
    } catch (error) {
      console.error("Unable to save trainer assignments:", error);
    }
  }, [assignments]);

  /* TOAST */

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(
      () => setToast(""),
      3000
    );

    return () => window.clearTimeout(timer);
  }, [toast]);

  /* FILTER OPTIONS */

  const collegeOptions = useMemo(
    () => [
      { label: "All colleges", value: "All" },
      ...uniqueOptions(assignments.map((item) => item.college)),
    ],
    [assignments]
  );

  const programOptions = useMemo(
    () => [
      { label: "All programs", value: "All" },
      ...uniqueOptions(assignments.map((item) => item.technology)),
    ],
    [assignments]
  );

  /* FILTER + SEARCH + SORT */

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = assignments.filter((item) => {
      const matchesSearch =
        !query ||
        [
          item.trainer,
          item.college,
          item.technology,
          item.id,
          item.duration,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      const matchesStatus =
        selectedStatus === "All" ||
        item.status === selectedStatus;

      const matchesCollege =
        selectedCollege === "All" ||
        item.college === selectedCollege;

      const matchesProgram =
        selectedProgram === "All" ||
        item.technology === selectedProgram;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCollege &&
        matchesProgram
      );
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "oldest") {
        return (
          getDateValue(a.createdAt) -
          getDateValue(b.createdAt)
        );
      }

      if (sortBy === "date-asc") {
        return (
          getDateValue(a.startDate) -
          getDateValue(b.startDate)
        );
      }

      if (sortBy === "date-desc") {
        return (
          getDateValue(b.startDate) -
          getDateValue(a.startDate)
        );
      }

      if (sortBy === "trainer-asc") {
        return String(a.trainer).localeCompare(
          String(b.trainer)
        );
      }

      return (
        getDateValue(b.createdAt) -
        getDateValue(a.createdAt)
      );
    });

    return result;
  }, [
    assignments,
    search,
    selectedStatus,
    selectedCollege,
    selectedProgram,
    sortBy,
  ]);

  /* STATISTICS */

  const stats = useMemo(
    () => ({
      total: assignments.length,

      active: assignments.filter(
        (item) => item.status === "Active"
      ).length,

      pending: assignments.filter(
        (item) => item.status === "Pending"
      ).length,

      completed: assignments.filter(
        (item) => item.status === "Completed"
      ).length,
    }),
    [assignments]
  );

  const hasActiveFilters =
    Boolean(search) ||
    selectedStatus !== "All" ||
    selectedCollege !== "All" ||
    selectedProgram !== "All";

  const showMessage = (message) => setToast(message);

  /* RESET FILTERS */

  const resetFilters = () => {
    setSearch("");
    setSelectedStatus("All");
    setSelectedCollege("All");
    setSelectedProgram("All");
    setSortBy("newest");
  };

  /* ACTIVATE */

  const activateAssignment = (id) => {
    setAssignments((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: "Active" }
          : item
      )
    );

    setSelectedAssignment((current) =>
      current?.id === id
        ? { ...current, status: "Active" }
        : current
    );

    showMessage("Trainer assignment activated successfully.");
  };

  /* DETAILS */

  const openDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setDetailStatus(assignment.status || "Pending");
  };

  const saveDetailStatus = () => {
    if (!selectedAssignment) return;

    const id = selectedAssignment.id;

    setAssignments((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: detailStatus }
          : item
      )
    );

    setSelectedAssignment((current) =>
      current
        ? { ...current, status: detailStatus }
        : current
    );

    showMessage("Assignment status updated.");
  };

  /* CREATE ASSIGNMENT */

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFormError("");
  };

  const openCreateModal = () => {
    setForm(EMPTY_FORM);
    setFormError("");
    setShowCreateModal(true);
  };

  const createAssignment = (event) => {
    event.preventDefault();
    setFormError("");

    if (
      !form.trainer ||
      !form.college ||
      !form.technology ||
      !form.duration ||
      !form.startDate
    ) {
      setFormError(
        "Please select all required assignment details."
      );
      return;
    }

    const newAssignment = {
      id: `TA-${Date.now().toString().slice(-7)}`,
      ...form,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    setAssignments((current) => [
      newAssignment,
      ...current,
    ]);

    resetFilters();

    setShowCreateModal(false);
    setForm(EMPTY_FORM);

    showMessage("New trainer assignment created.");
  };

  /* EXPORT CSV */

  const exportAssignments = () => {
    if (!filteredAssignments.length) {
      showMessage("There are no assignments to export.");
      return;
    }

    const headers = [
      "Assignment ID",
      "Trainer",
      "College",
      "Program",
      "Duration",
      "Start Date",
      "Status",
    ];

    const rows = filteredAssignments.map((item) => [
      item.id,
      item.trainer,
      item.college,
      item.technology,
      item.duration,
      formatDate(item.startDate),
      item.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "trainer-assignments.csv";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    showMessage("Assignment report exported.");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="ta-page">
      <style>{PAGE_STYLES}</style>

      {/* PAGE HEADER */}

      <div className="ta-page-header">
        <div className="ta-breadcrumb">
          <span>Admin</span>

          <span className="ta-breadcrumb-separator">
            /
          </span>

          <span className="current">
            Trainer assignments
          </span>
        </div>

        <div className="ta-header-main">
          <div>
            <div className="ta-eyebrow">
              <span className="ta-eyebrow-dot" />
              TRAINER MANAGEMENT
            </div>

            <h1>
              Trainer <span>Assignments</span>
            </h1>

            <p className="ta-page-description">
              Allocate trainers to partner colleges, track
              program ownership and manage assignment status
              from one place.
            </p>
          </div>

          <div className="ta-header-actions">
            <button
              type="button"
              className="ta-button ta-button-secondary"
              onClick={exportAssignments}
            >
              <Download size={15} />
              Export report
            </button>

            <button
              type="button"
              className="ta-button ta-button-primary"
              onClick={openCreateModal}
            >
              <Plus size={16} />
              New assignment
            </button>
          </div>
        </div>
      </div>

      {/* OVERVIEW STATS */}

      <div className="ta-stats-grid">
        <StatCard
          icon={Users}
          title="Total assignments"
          value={stats.total}
          note="All records"
          tone="orange"
          index={0}
        />

        <StatCard
          icon={CheckCircle2}
          title="Active assignments"
          value={stats.active}
          note="In progress"
          tone="green"
          index={1}
        />

        <StatCard
          icon={Clock3}
          title="Pending activation"
          value={stats.pending}
          note="Needs review"
          tone="amber"
          index={2}
        />

        <StatCard
          icon={GraduationCap}
          title="Completed"
          value={stats.completed}
          note="Finished"
          tone="blue"
          index={3}
        />
      </div>

      {/* MAIN ASSIGNMENT CONTENT */}

      <section className="ta-content-card">
        <div className="ta-content-heading">
          <div className="ta-content-title-line">
            <div className="ta-section-icon">
              <UserRoundCheck size={19} />
            </div>

            <div>
              <h2>All trainer assignments</h2>

              <p>
                Review trainer allocations and manage their
                current status.
              </p>
            </div>
          </div>

          <div className="ta-record-count">
            <span className="ta-record-count-dot" />
            {filteredAssignments.length} of{" "}
            {assignments.length} records
          </div>
        </div>

        {/* SEARCH + FILTERS */}

        <div className="ta-toolbar">
          <div className="ta-search-box">
            <Search size={16} />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search trainer, college, program or ID..."
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="ta-toolbar-filters">
            <div className="ta-filter-select">
              <PremiumSelect
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={STATUS_OPTIONS}
                searchable={false}
              />
            </div>

            <div className="ta-filter-select college">
              <PremiumSelect
                value={selectedCollege}
                onChange={setSelectedCollege}
                options={collegeOptions}
                searchable
                searchPlaceholder="Find a college..."
              />
            </div>

            <div className="ta-filter-select program">
              <PremiumSelect
                value={selectedProgram}
                onChange={setSelectedProgram}
                options={programOptions}
                searchable
                searchPlaceholder="Find a program..."
              />
            </div>

            <div className="ta-sort-select">
              <SlidersHorizontal size={14} />

              <PremiumSelect
                value={sortBy}
                onChange={setSortBy}
                options={SORT_OPTIONS}
                searchable={false}
              />
            </div>
          </div>
        </div>

        {/* ACTIVE FILTERS */}

        {hasActiveFilters && (
          <div className="ta-active-filters">
            <div className="ta-active-filter-label">
              <Filter size={12} />
              Active filters
            </div>

            {search && (
              <button
                type="button"
                className="ta-filter-chip"
                onClick={() => setSearch("")}
              >
                Search: {search}
                <X size={11} />
              </button>
            )}

            {selectedStatus !== "All" && (
              <button
                type="button"
                className="ta-filter-chip"
                onClick={() => setSelectedStatus("All")}
              >
                {selectedStatus}
                <X size={11} />
              </button>
            )}

            {selectedCollege !== "All" && (
              <button
                type="button"
                className="ta-filter-chip"
                onClick={() => setSelectedCollege("All")}
              >
                {selectedCollege}
                <X size={11} />
              </button>
            )}

            {selectedProgram !== "All" && (
              <button
                type="button"
                className="ta-filter-chip"
                onClick={() => setSelectedProgram("All")}
              >
                {selectedProgram}
                <X size={11} />
              </button>
            )}

            <button
              type="button"
              className="ta-clear-filters"
              onClick={resetFilters}
            >
              Clear all
            </button>
          </div>
        )}

        {/* ASSIGNMENT CARDS */}

        {filteredAssignments.length ? (
          <div className="ta-assignment-grid">
            {filteredAssignments.map((assignment, index) => (
              <motion.article
                key={assignment.id}
                className="ta-assignment-card"
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: Math.min(index * 0.035, 0.18),
                }}
                whileHover={{ y: -2 }}
              >
                <div className="ta-card-top">
                  <div className="ta-person-block">
                    <div className="ta-person-avatar">
                      <UserRoundCheck size={20} />
                    </div>

                    <div className="ta-person-copy">
                      <h3 title={assignment.trainer}>
                        {assignment.trainer}
                      </h3>

                      <div className="ta-person-program">
                        <BookOpen size={12} />

                        <span>
                          {assignment.technology}
                        </span>
                      </div>

                      <div className="ta-assignment-id">
                        {assignment.id}
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={assignment.status} />
                </div>

                <div className="ta-card-info-panel">
                  <InfoItem
                    icon={Building2}
                    label="College"
                    value={assignment.college}
                  />

                  <InfoItem
                    icon={Clock3}
                    label="Duration"
                    value={assignment.duration}
                  />

                  <InfoItem
                    icon={CalendarDays}
                    label="Start date"
                    value={formatDate(assignment.startDate)}
                  />

                  <InfoItem
                    icon={GraduationCap}
                    label="Program"
                    value={assignment.technology}
                  />
                </div>

                <div className="ta-card-footer">
                  <button
                    type="button"
                    className="ta-card-link"
                    onClick={() => openDetails(assignment)}
                  >
                    View details
                    <ChevronRight size={14} />
                  </button>

                  <div className="ta-card-actions">
                    {assignment.status === "Pending" ? (
                      <button
                        type="button"
                        className="ta-card-action activate"
                        onClick={() =>
                          activateAssignment(assignment.id)
                        }
                      >
                        <CheckCircle2 size={14} />
                        Activate
                      </button>
                    ) : (
                      <span
                        className={`ta-card-action ${assignment.status === "Completed"
                          ? "completed"
                          : "active"
                          }`}
                      >
                        <CheckCircle2 size={14} />
                        {assignment.status}
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="ta-empty-state">
            <div className="ta-empty-icon">
              <Search size={23} />
            </div>

            <h3>No assignments found</h3>

            <p>
              Try changing your filters or create a new
              trainer assignment.
            </p>

            <button
              type="button"
              className="ta-button ta-button-secondary"
              onClick={resetFilters}
            >
              <ArrowDownUp size={14} />
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* CREATE ASSIGNMENT MODAL */}

      {showCreateModal && (
        <Modal
          title="Create new assignment"
          description="Select a trainer, partner college and training program."
          icon={Plus}
          onClose={() => {
            setShowCreateModal(false);
            setFormError("");
          }}
        >
          <form onSubmit={createAssignment}>
            <div className="ta-form-grid">
              <div className="ta-field">
                <label className="ta-field-label">
                  Trainer <span className="ta-required">*</span>
                </label>

                <PremiumSelect
                  value={form.trainer}
                  onChange={(value) =>
                    updateForm("trainer", value)
                  }
                  options={TRAINERS}
                  placeholder="Select trainer"
                  searchable
                  searchPlaceholder="Search trainers..."
                  menuWidth={300}
                />
              </div>

              <div className="ta-field">
                <label className="ta-field-label">
                  College <span className="ta-required">*</span>
                </label>

                <PremiumSelect
                  value={form.college}
                  onChange={(value) =>
                    updateForm("college", value)
                  }
                  options={COLLEGES}
                  placeholder="Select college"
                  searchable
                  searchPlaceholder="Search colleges..."
                  menuWidth={330}
                />
              </div>

              <div className="ta-field span-2">
                <label className="ta-field-label">
                  Training program{" "}
                  <span className="ta-required">*</span>
                </label>

                <PremiumSelect
                  value={form.technology}
                  onChange={(value) =>
                    updateForm("technology", value)
                  }
                  options={PROGRAMS}
                  placeholder="Select course or technology"
                  searchable
                  searchPlaceholder="Search programs..."
                  menuWidth={440}
                />
              </div>

              <div className="ta-field">
                <label className="ta-field-label">
                  Duration <span className="ta-required">*</span>
                </label>

                <PremiumSelect
                  value={form.duration}
                  onChange={(value) =>
                    updateForm("duration", value)
                  }
                  options={DURATIONS}
                  placeholder="Select duration"
                  searchable={false}
                />
              </div>

              <div className="ta-field">
                <label className="ta-field-label">
                  Start date <span className="ta-required">*</span>
                </label>

                <input
                  type="date"
                  value={form.startDate}
                  onChange={(event) =>
                    updateForm("startDate", event.target.value)
                  }
                  className="ta-input"
                />
              </div>
            </div>

            {formError && (
              <div className="ta-form-error">
                {formError}
              </div>
            )}

            <div className="ta-modal-footer">
              <span className="ta-modal-footer-note">
                New assignments are created with Pending status.
              </span>

              <div className="ta-modal-footer-actions">
                <button
                  type="button"
                  className="ta-button ta-button-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="ta-button ta-button-primary"
                >
                  <Plus size={15} />
                  Create assignment
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* ASSIGNMENT DETAILS MODAL */}

      {selectedAssignment && (
        <Modal
          title="Assignment details"
          description="Review assignment information and update its status."
          icon={UserRoundCheck}
          onClose={() => setSelectedAssignment(null)}
        >
          <div className="ta-detail-banner">
            <div className="ta-detail-avatar">
              <UserRoundCheck size={21} />
            </div>

            <div className="ta-detail-person">
              <strong>
                {selectedAssignment.trainer}
              </strong>

              <span>
                {selectedAssignment.technology}
              </span>
            </div>

            <StatusBadge status={selectedAssignment.status} />
          </div>

          <div className="ta-detail-grid">
            <div className="ta-detail-item">
              <InfoItem
                icon={Building2}
                label="College"
                value={selectedAssignment.college}
              />
            </div>

            <div className="ta-detail-item">
              <InfoItem
                icon={Clock3}
                label="Duration"
                value={selectedAssignment.duration}
              />
            </div>

            <div className="ta-detail-item">
              <InfoItem
                icon={CalendarDays}
                label="Start date"
                value={formatDate(selectedAssignment.startDate)}
              />
            </div>

            <div className="ta-detail-item">
              <InfoItem
                icon={GraduationCap}
                label="Assignment ID"
                value={selectedAssignment.id}
              />
            </div>
          </div>

          <div className="ta-modal-footer">
            <div className="ta-detail-status">
              <label className="ta-field-label">
                Update status
              </label>

              <PremiumSelect
                value={detailStatus}
                onChange={setDetailStatus}
                options={STATUS_OPTIONS.filter(
                  (item) => item.value !== "All"
                )}
                searchable={false}
              />
            </div>

            <div className="ta-modal-footer-actions">
              <button
                type="button"
                className="ta-button ta-button-secondary"
                onClick={() => setSelectedAssignment(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="ta-button ta-button-primary"
                onClick={saveDetailStatus}
              >
                <Check size={15} />
                Save changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* TOAST */}

      <AnimatePresence>
        {toast && (
          <motion.div
            className="ta-toast"
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 8,
            }}
          >
            <CheckCircle2 size={16} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
