import React, { useState } from "react";
import { LogIn, X, User, Building2, MapPinned } from "lucide-react";
import OwnerApp from "./App.jsx";
import TravelerApp from "./TravelerApp.jsx";
import { LOGO_EN_DARK } from "./brand.js";
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

function RolePicker({ onPick }) {
  return (
    <div className="min-h-screen w-full bg-[#F7F5F0] flex items-center justify-center p-6"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&display=swap');`}</style>
      <div className="w-full max-w-md text-center">
        <img src={LOGO_EN_DARK} alt="SAKAN" className="h-9 w-auto mx-auto mb-8" />
        <h1 className="text-2xl text-[#1E2A38] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {COPY.splash.title}
        </h1>
        <p className="text-sm text-[#5B6472] mb-8">{COPY.splash.sub}</p>

        <div className="space-y-3">
          <button
            onClick={() => onPick("traveler")}
            className="w-full flex items-center gap-4 rounded-2xl border border-[#E5DFD1] bg-white p-5 text-start hover:border-[#754437] hover:shadow-md transition-all"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#754437] text-white">
              <MapPinned size={22} />
            </div>
            <div>
              <p className="font-semibold text-[#1E2A38]">{COPY.splash.traveler}</p>
              <p className="text-xs text-[#5B6472]">{COPY.splash.travelerSub}</p>
            </div>
          </button>

          <button
            onClick={() => onPick("owner")}
            className="w-full flex items-center gap-4 rounded-2xl border border-[#E5DFD1] bg-white p-5 text-start hover:border-[#28374A] hover:shadow-md transition-all"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#28374A] text-white">
              <Building2 size={22} />
            </div>
            <div>
              <p className="font-semibold text-[#1E2A38]">{COPY.splash.owner}</p>
              <p className="text-xs text-[#5B6472]">{COPY.splash.ownerSub}</p>
            </div>
          </button>
        </div>
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
    const { data } = await supabase.auth.getSession();
    setOwnerAuthed(!!data.session);
    setCheckingSession(false);
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
