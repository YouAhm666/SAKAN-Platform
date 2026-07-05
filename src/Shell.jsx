import React, { useState, useEffect, useRef } from "react";
import { LogIn, X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import OwnerApp from "./App.jsx";
import TravelerApp from "./TravelerApp.jsx";
import { LOGO_EN } from "./brand.js";
import { supabase } from "./supabaseClient.js";

/* ============================================================================
   SHELL — one app, one login system, two experiences.
     - Traveler:      opens straight into browsing, no login wall.
     - Property Owner: requires sign-in first (private operational tool).
   ============================================================================ */

const COPY = {
  splash: {
    title: "Welcome to SAKAN",
    sub: "Choose how you'd like to continue.",
    traveler: "I'm a Traveler",
    travelerSub: "Search and book stays",
    owner: "I'm a Property Owner",
    ownerSub: "Manage your listings",
  },
  signIn: {
    title: "Property Owner sign in",
    sub: "Sign in to manage your properties.",
    email: "Email",
    password: "Password",
    submit: "Sign in",
    back: "← Back",
  },
};

const SWIPE_PANELS = [
  {
    key: "traveler",
    kicker: "TRAVELER",
    title: "Find a Stay",
    sub: "Explore short-term getaways or long-term residences seamlessly.",
    cta: "Enter Guest Portal",
    bgFrom: "#16202B",
    bgTo: "#28374A",
    hint: "left",
    art: "interior",
  },
  {
    key: "owner",
    kicker: "PROPERTY OWNER",
    title: "List Your Property",
    sub: "Maximize your income from nightly guests or monthly tenants.",
    cta: "Open Dashboard",
    bgFrom: "#3A241C",
    bgTo: "#5E362B",
    hint: "right",
    art: "facade",
  },
];

function InteriorArt() {
  return (
    <svg viewBox="0 0 400 500" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 }} preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="330" width="400" height="4" fill="rgba(233,228,213,0.18)" />
      <rect x="40" y="200" width="90" height="130" rx="4" fill="none" stroke="rgba(233,228,213,0.22)" strokeWidth="2" />
      <rect x="150" y="250" width="60" height="80" rx="30" fill="none" stroke="rgba(233,228,213,0.16)" strokeWidth="2" />
      <circle cx="320" cy="120" r="70" fill="rgba(233,228,213,0.06)" />
      <line x1="250" y1="330" x2="250" y2="180" stroke="rgba(233,228,213,0.14)" strokeWidth="2" />
      <line x1="250" y1="180" x2="360" y2="180" stroke="rgba(233,228,213,0.14)" strokeWidth="2" />
    </svg>
  );
}
function FacadeArt() {
  const windows = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      windows.push(
        <rect
          key={`${row}-${col}`}
          x={40 + col * 68}
          y={60 + row * 62}
          width="42"
          height="40"
          rx="3"
          fill={(row + col) % 3 === 0 ? "rgba(233,228,213,0.20)" : "rgba(233,228,213,0.08)"}
        />
      );
    }
  }
  return (
    <svg viewBox="0 0 400 500" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6 }} preserveAspectRatio="xMidYMid slice">
      {windows}
    </svg>
  );
}

function PulsingArrow({ direction }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <div
      style={{
        position: "absolute", top: "50%", [direction === "left" ? "left" : "right"]: 14,
        transform: "translateY(-50%)", color: "rgba(255,255,255,0.55)",
        animation: `sakan-arrow-${direction} 1.8s ease-in-out infinite`,
      }}
    >
      <Icon size={26} strokeWidth={1.75} />
    </div>
  );
}

function RolePicker({ onPick }) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const widthRef = useRef(1);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) widthRef.current = containerRef.current.offsetWidth;
  }, []);

  const onPointerDown = (e) => {
    setDragging(true);
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    setDragX(x - startX.current);
  };
  const endDrag = () => {
    if (!dragging) return;
    const threshold = widthRef.current * 0.18;
    if (dragX < -threshold && index < SWIPE_PANELS.length - 1) setIndex(index + 1);
    else if (dragX > threshold && index > 0) setIndex(index - 1);
    setDragging(false);
    setDragX(0);
  };

  const translatePercent = -index * 100 + (dragX / widthRef.current) * 100;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative", width: "100%", height: "100vh", overflow: "hidden",
        touchAction: "pan-y", fontFamily: "'Inter', ui-sans-serif, system-ui", userSelect: "none",
      }}
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={endDrag}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        @keyframes sakan-arrow-left { 0%,100% { opacity: .35; transform: translate(0,-50%); } 50% { opacity: .9; transform: translate(-6px,-50%); } }
        @keyframes sakan-arrow-right { 0%,100% { opacity: .35; transform: translate(0,-50%); } 50% { opacity: .9; transform: translate(6px,-50%); } }
        @keyframes sakan-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ position: "absolute", top: 28, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 30, pointerEvents: "none" }}>
        <img src={LOGO_EN} alt="SAKAN" style={{ height: 30, width: "auto", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))" }} />
      </div>

      <div
        style={{
          display: "flex", width: `${SWIPE_PANELS.length * 100}%`, height: "100%",
          transform: `translateX(${translatePercent / SWIPE_PANELS.length}%)`,
          transition: dragging ? "none" : "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {SWIPE_PANELS.map((p, i) => (
          <div
            key={p.key}
            style={{
              width: `${100 / SWIPE_PANELS.length}%`, height: "100%", position: "relative",
              background: `linear-gradient(160deg, ${p.bgFrom}, ${p.bgTo})`, flexShrink: 0,
            }}
          >
            {p.art === "interior" ? <InteriorArt /> : <FacadeArt />}
            <PulsingArrow direction={p.hint} />

            <div
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 32px 56px",
                background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))", paddingTop: 120,
              }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: "#D3C7AD", marginBottom: 10 }}>
                {p.kicker}
              </p>
              <h1
                style={{
                  fontSize: 40, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em",
                  lineHeight: 1.05, marginBottom: 12, maxWidth: 320, fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {p.title}
              </h1>
              <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.5, maxWidth: 300, marginBottom: 26 }}>
                {p.sub}
              </p>

              {index === i && (
                <button
                  onClick={() => onPick(p.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, backgroundColor: "#754437", color: "#fff",
                    border: "none", borderRadius: 999, padding: "14px 26px", fontSize: 14.5, fontWeight: 600,
                    cursor: "pointer", boxShadow: "0 10px 24px -8px rgba(117,68,55,0.6)",
                    animation: "sakan-fade-up 380ms ease both",
                  }}
                >
                  {p.cta} <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 7, zIndex: 20 }}>
        {SWIPE_PANELS.map((p, i) => (
          <button
            key={p.key}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? 22 : 7, height: 7, borderRadius: 999, border: "none",
              backgroundColor: i === index ? "#fff" : "rgba(255,255,255,0.35)",
              transition: "all 250ms ease", cursor: "pointer", padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function OwnerSignIn({ onBack, onSuccess }) {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        if (data.user) {
          // Best-effort profile row; safe to ignore failure here since it
          // doesn't block auth itself, just personalization later.
          await supabase.from("profiles").insert({ id: data.user.id, full_name: fullName });
        }
        if (data.session) {
          onSuccess();
        } else {
          setNeedsConfirmation(true);
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        onSuccess();
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#28374A] flex items-center justify-center p-6"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&display=swap');`}</style>
      <div className="w-full max-w-sm rounded-2xl bg-white p-7">
        <button onClick={onBack} className="text-xs text-[#5B6472] hover:text-[#1E2A38] mb-4">{COPY.signIn.back}</button>
        <h1 className="text-xl text-[#1E2A38] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {mode === "signup" ? "Create your owner account" : COPY.signIn.title}
        </h1>
        <p className="text-sm text-[#5B6472] mb-6">{COPY.signIn.sub}</p>

        {needsConfirmation ? (
          <div className="text-sm text-[#1E2A38] bg-[#F3EFE6] border border-[#E5DFD1] rounded-lg p-4">
            Check <span className="font-semibold">{email}</span> for a confirmation link, then come back and sign in.
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {mode === "signup" && (
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name"
                  className="w-full rounded-lg border border-[#E5DFD1] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#7C7340]/40" />
              )}
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={COPY.signIn.email}
                className="w-full rounded-lg border border-[#E5DFD1] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#7C7340]/40" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={COPY.signIn.password}
                className="w-full rounded-lg border border-[#E5DFD1] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#7C7340]/40" />
            </div>

            {error && <p className="text-xs text-[#E8590C] mt-2.5">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading || !email || !password}
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-lg bg-[#754437] py-2.5 text-sm font-medium text-white hover:bg-[#5E362B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <LogIn size={15} /> {loading ? "Please wait…" : (mode === "signup" ? "Create account" : COPY.signIn.submit)}
            </button>
            <button
              onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); }}
              className="mt-3 w-full text-center text-xs text-[#754437] hover:underline"
            >
              {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an owner account"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* Small persistent switcher bar shown above whichever app is active, so
   either role can jump back to the picker without hunting for a button
   buried in that app's own navigation. */
function SwitchBar({ roleLabel, onExit }) {
  return (
    <div className="flex items-center justify-between bg-[#1E2A38] text-[#E9E4D5] text-xs px-4 py-1.5">
      <span>SAKAN — {roleLabel}</span>
      <button onClick={onExit} className="flex items-center gap-1 hover:text-white transition-colors">
        <X size={12} /> Switch role
      </button>
    </div>
  );
}

export default function Shell() {
  const [role, setRole] = useState(null); // null | 'traveler' | 'owner'
  const [ownerAuthed, setOwnerAuthed] = useState(false);
  const [checkingSession, setCheckingSession] = useState(false);

  const chooseOwner = async () => {
    setRole("owner");
    setCheckingSession(true);
    try {
      const { data } = await supabase.auth.getSession();
      setOwnerAuthed(!!data.session);
    } catch (err) {
      setOwnerAuthed(false);
    } finally {
      setCheckingSession(false);
    }
  };

  const handlePick = (picked) => {
    if (picked === "owner") {
      chooseOwner();
    } else {
      setRole(picked);
    }
  };

  const exit = async () => {
    if (role === "owner") {
      await supabase.auth.signOut();
    }
    setRole(null);
    setOwnerAuthed(false);
  };

  if (role === null) {
    return <RolePicker onPick={handlePick} />;
  }

  if (role === "owner" && checkingSession) {
    return <div className="min-h-screen w-full bg-[#28374A]" />;
  }

  if (role === "owner" && !ownerAuthed) {
    return <OwnerSignIn onBack={exit} onSuccess={() => setOwnerAuthed(true)} />;
  }

  if (role === "owner") {
    return (
      <div>
        <SwitchBar roleLabel="Property Owner" onExit={exit} />
        <OwnerApp />
      </div>
    );
  }

  // role === "traveler"
  return (
    <div>
      <SwitchBar roleLabel="Traveler" onExit={exit} />
      <TravelerApp onSwitchToOwner={() => handlePick("owner")} />
    </div>
  );
}
