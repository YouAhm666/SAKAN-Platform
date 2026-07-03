import React, { useState, useMemo, useEffect, createContext, useContext } from "react";
import {
  Search, Heart, MapPin, Star, Users, Calendar, X, Check, ChevronRight, ChevronLeft,
  Building2, Home as HomeIcon, Waves, Wifi, Coffee, ShieldCheck, LogIn, User, Minus, Plus,
  Globe, BedDouble, SlidersHorizontal, Car, Snowflake, ChefHat, MessageCircle, Navigation,
  PencilLine, Clock, CheckCircle2, XCircle, Sparkles, Bath, Ruler
} from "lucide-react";
import { LOGO_EN_DARK, LOGO_AR_DARK, LOGO_EN, LOGO_AR } from "./brand.js";

/* ============================================================================
   TRAVELER APP — guest-facing storefront where travelers search & book stays.
   Same brand system as the Property Owner dashboard: Areia / Terra Queimada /
   Verde Opaco / Azul, Space Grotesk + Inter + Tajawal. No login wall on
   browsing — sign-in is only prompted at the moment of booking or saving.
   ============================================================================ */

/* ---------------------------------- i18n ---------------------------------- */
const DICT = {
  en: {
    dir: "ltr",
    brand: "SAKAN",
    nav: { explore: "Explore", trips: "My Trips", ownerLink: "List your property", signIn: "Sign in" },
    search: {
      where: "Where to?", checkIn: "Check-in", checkOut: "Check-out", guests: "Guests",
      guestsUnit: "guests", search: "Search", filters: "Filters",
    },
    categories: { all: "All", apartment: "Apartments", hotel: "Hotel Rooms", suite: "Luxury Suites", villa: "Villas", chalet: "Chalets" },
    card: { night: "night", reviews: "reviews" },
    filters: {
      title: "Filters", priceRange: "Price range", perNight: "per night",
      propertyType: "Property type", entire: "Entire place", private: "Private room", shared: "Shared room",
      amenities: "Amenities", clear: "Clear all", show: "Show", stays: "stays",
      wifi: "Wi-Fi", ac: "Air conditioning", parking: "Parking", pool: "Pool", kitchen: "Kitchen",
    },
    details: {
      back: "Back to search", hostedBy: "Hosted by", joined: "Joined in", about: "About this place",
      amenities: "What this place offers", location: "Location", mapPlaceholder: "Map view",
      reviews: "Reviews", cleanliness: "Cleanliness", communication: "Communication",
      locationScore: "Location", value: "Value", bookingTitle: "Add dates for prices", perNight: "night",
      checkIn: "Check-in", checkOut: "Check-out", guests: "Guests", nights: "nights",
      serviceFee: "Service fee", total: "Total", bookNow: "Reserve", selectDates: "Select dates to see the total",
      bedrooms: "bedrooms", bathrooms: "bathrooms", sqm: "sqm",
    },
    trips: {
      title: "My Trips", upcoming: "Upcoming", past: "Past", cancelled: "Cancelled",
      ref: "Booking ref", total: "Total paid", getDirections: "Get directions", contactHost: "Contact host",
      writeReview: "Write a review", empty: "Nothing here yet", emptySub: "Your trips will show up here once you book a stay.",
      statusConfirmed: "Confirmed", statusPending: "Pending host approval", statusCancelled: "Cancelled", statusCompleted: "Completed",
    },
    checkout: {
      title: "Confirm and pay", summary: "Your trip", confirm: "Confirm booking",
      confirmedTitle: "Booking confirmed!", confirmedSub: "A confirmation has been sent for your records.",
      code: "Confirmation code", backToSearch: "Back to search",
    },
    signIn: {
      title: "Sign in to continue", sub: "You need an account to book or save a place.",
      email: "Email", password: "Password", submit: "Sign in",
      switch: "New here? Create an account", switchBack: "Already have an account? Sign in",
      createSubmit: "Create account", name: "Full name",
    },
    footer: { rights: "All rights reserved.", ownerCta: "Own a property? List it on SAKAN" },
  },
  ar: {
    dir: "rtl",
    brand: "سكن",
    nav: { explore: "استكشف", trips: "رحلاتي", ownerLink: "أضف عقارك", signIn: "تسجيل الدخول" },
    search: {
      where: "إلى أين تذهب؟", checkIn: "تسجيل الوصول", checkOut: "تسجيل المغادرة", guests: "الضيوف",
      guestsUnit: "ضيوف", search: "بحث", filters: "الفلاتر",
    },
    categories: { all: "الكل", apartment: "شقق", hotel: "غرف فندقية", suite: "أجنحة فاخرة", villa: "فلل", chalet: "شاليهات" },
    card: { night: "الليلة", reviews: "تقييم" },
    filters: {
      title: "الفلاتر", priceRange: "نطاق السعر", perNight: "لليلة",
      propertyType: "نوع العقار", entire: "المكان بالكامل", private: "غرفة خاصة", shared: "غرفة مشتركة",
      amenities: "المرافق", clear: "مسح الكل", show: "عرض", stays: "إقامة",
      wifi: "واي فاي", ac: "تكييف", parking: "موقف سيارات", pool: "مسبح", kitchen: "مطبخ",
    },
    details: {
      back: "العودة للبحث", hostedBy: "يستضيفه", joined: "انضم في", about: "عن هذا المكان",
      amenities: "ما يقدمه هذا المكان", location: "الموقع", mapPlaceholder: "عرض الخريطة",
      reviews: "التقييمات", cleanliness: "النظافة", communication: "التواصل",
      locationScore: "الموقع", value: "القيمة", bookingTitle: "أضف التواريخ لمعرفة السعر", perNight: "الليلة",
      checkIn: "تسجيل الوصول", checkOut: "تسجيل المغادرة", guests: "الضيوف", nights: "ليالٍ",
      serviceFee: "رسوم الخدمة", total: "الإجمالي", bookNow: "احجز", selectDates: "اختر التواريخ لمعرفة الإجمالي",
      bedrooms: "غرف نوم", bathrooms: "حمامات", sqm: "م²",
    },
    trips: {
      title: "رحلاتي", upcoming: "القادمة", past: "السابقة", cancelled: "الملغاة",
      ref: "رقم الحجز", total: "المبلغ المدفوع", getDirections: "الاتجاهات", contactHost: "تواصل مع المضيف",
      writeReview: "اكتب تقييمًا", empty: "لا يوجد شيء هنا بعد", emptySub: "ستظهر رحلاتك هنا بعد حجز إقامة.",
      statusConfirmed: "مؤكد", statusPending: "بانتظار موافقة المضيف", statusCancelled: "ملغى", statusCompleted: "مكتمل",
    },
    checkout: {
      title: "التأكيد والدفع", summary: "رحلتك", confirm: "تأكيد الحجز",
      confirmedTitle: "تم تأكيد الحجز!", confirmedSub: "تم إرسال تأكيد بالحجز لسجلاتك.",
      code: "رمز التأكيد", backToSearch: "العودة للبحث",
    },
    signIn: {
      title: "سجّل الدخول للمتابعة", sub: "تحتاج إلى حساب لحجز مكان أو حفظه.",
      email: "البريد الإلكتروني", password: "كلمة المرور", submit: "تسجيل الدخول",
      switch: "جديد هنا؟ أنشئ حسابًا", switchBack: "لديك حساب بالفعل؟ سجّل الدخول",
      createSubmit: "إنشاء حساب", name: "الاسم الكامل",
    },
    footer: { rights: "جميع الحقوق محفوظة.", ownerCta: "تملك عقارًا؟ أضفه على سكن" },
  },
};

const LangContext = createContext(DICT.en);
const useLang = () => useContext(LangContext);

/* ------------------------------- Mock data --------------------------------- */
const AMENITY_META = { wifi: Wifi, ac: Snowflake, parking: Car, pool: Waves, kitchen: ChefHat };
const CATEGORY_ICONS = { all: Sparkles, apartment: Building2, hotel: BedDouble, suite: Star, villa: HomeIcon, chalet: Waves };

const LISTINGS = [
  { id: "P1", name: "Sakan Bay Hotel — Deluxe Room", nameAr: "فندق سكن باي — غرفة ديلوكس", location: "Jeddah Corniche", locationAr: "كورنيش جدة", type: "hotel", price: 620, rating: 4.9, reviews: 214, maxGuests: 2, bedrooms: 1, bathrooms: 1, sqm: 32, amenities: ["wifi", "ac", "pool"], grad: "from-[#754437] to-[#5E362B]", host: { name: "Layla", joined: 2021 }, desc: "A modern deluxe room overlooking the Red Sea, steps from the Corniche promenade. Bright, quiet, and freshly renovated.", scores: { cleanliness: 4.9, communication: 5.0, location: 4.8, value: 4.6 } },
  { id: "P2", name: "Marina Chalet", nameAr: "شاليه المارينا", location: "Half Moon Bay", locationAr: "خليج نصف القمر", type: "chalet", price: 950, rating: 4.8, reviews: 132, maxGuests: 6, bedrooms: 2, bathrooms: 2, sqm: 110, amenities: ["wifi", "pool", "parking", "kitchen"], grad: "from-[#28374A] to-[#1E2A38]", host: { name: "Omar", joined: 2020 }, desc: "A private beachfront chalet with a shared pool, perfect for families. Direct beach access and a fully equipped kitchen.", scores: { cleanliness: 4.7, communication: 4.9, location: 5.0, value: 4.5 } },
  { id: "P3", name: "Sakan Bay Hotel — Suite", nameAr: "فندق سكن باي — جناح", location: "Jeddah Corniche", locationAr: "كورنيش جدة", type: "suite", price: 1290, rating: 4.7, reviews: 98, maxGuests: 3, bedrooms: 1, bathrooms: 1, sqm: 58, amenities: ["wifi", "ac"], grad: "from-[#9A6152] to-[#754437]", host: { name: "Layla", joined: 2021 }, desc: "Our signature suite with a separate living area and panoramic sea views. Includes daily housekeeping.", scores: { cleanliness: 4.8, communication: 4.9, location: 4.7, value: 4.3 } },
  { id: "P4", name: "Diriyah Garden Apartment", nameAr: "شقة حدائق الدرعية", location: "Diriyah, Riyadh", locationAr: "الدرعية، الرياض", type: "apartment", price: 410, rating: 4.6, reviews: 76, maxGuests: 4, bedrooms: 2, bathrooms: 1, sqm: 85, amenities: ["wifi", "kitchen", "parking", "ac"], grad: "from-[#7C7340] to-[#5E5730]", host: { name: "Sara", joined: 2022 }, desc: "A quiet garden-level apartment minutes from Bujairi Terrace, with a private courtyard and full kitchen.", scores: { cleanliness: 4.6, communication: 4.7, location: 4.8, value: 4.6 } },
  { id: "P5", name: "Al Ula Desert Villa", nameAr: "فيلا صحراء العلا", location: "AlUla", locationAr: "العلا", type: "villa", price: 2400, rating: 5.0, reviews: 44, maxGuests: 8, bedrooms: 4, bathrooms: 3, sqm: 320, amenities: ["wifi", "pool", "parking", "kitchen", "ac"], grad: "from-[#5B6472] to-[#28374A]", host: { name: "Fahad", joined: 2019 }, desc: "A secluded desert villa with a private plunge pool and uninterrupted views of the sandstone canyons.", scores: { cleanliness: 5.0, communication: 5.0, location: 4.9, value: 4.8 } },
  { id: "P6", name: "Riyadh Skyline Apartment", nameAr: "شقة أفق الرياض", location: "King Abdullah Financial District", locationAr: "حي الملك عبدالله المالي", type: "apartment", price: 530, rating: 4.7, reviews: 89, maxGuests: 3, bedrooms: 1, bathrooms: 1, sqm: 62, amenities: ["wifi", "kitchen", "ac"], grad: "from-[#8993A0] to-[#5B6472]", host: { name: "Nora", joined: 2023 }, desc: "A sleek high-rise apartment with skyline views, walking distance to KAFD metro station.", scores: { cleanliness: 4.7, communication: 4.6, location: 4.9, value: 4.5 } },
];

/* ------------------------------- helpers --------------------------------- */
const fmtMoney = (n, lang) => `${n.toLocaleString()} ${lang === "ar" ? "ر.س" : "SAR"}`;
const fmtDate = (iso, lang) => new Date(iso).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { month: "short", day: "numeric", year: "numeric" });

/* ------------------------------- UI atoms ---------------------------------- */
function Stars({ rating, size = 13 }) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#1E2A38]">
      <Star size={size} className="fill-[#7C7340] text-[#7C7340]" /> {rating.toFixed(1)}
    </span>
  );
}

function ScoreBar({ label, value }) {
  return (
    <div className="mb-2.5">
      <div className="flex justify-between text-[13px] text-[#1E2A38] mb-1">
        <span>{label}</span><span className="font-semibold">{value.toFixed(1)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#E5DFD1] overflow-hidden">
        <div className="h-full rounded-full bg-[#754437]" style={{ width: `${(value / 5) * 100}%` }} />
      </div>
    </div>
  );
}

function StatusBadge({ status, t }) {
  const map = {
    confirmed: { cls: "bg-[#E3FBEF] text-[#0F9D58]", label: t.trips.statusConfirmed, icon: CheckCircle2 },
    pending: { cls: "bg-[#FFF3D9] text-[#B8710A]", label: t.trips.statusPending, icon: Clock },
    completed: { cls: "bg-[#E9E4D5] text-[#28374A]", label: t.trips.statusCompleted, icon: CheckCircle2 },
    cancelled: { cls: "bg-[#FFE9DE] text-[#E8590C]", label: t.trips.statusCancelled, icon: XCircle },
  };
  const s = map[status];
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.cls}`}>
      <Icon size={12} /> {s.label}
    </span>
  );
}

function GhostButton({ children, onClick, icon: Icon }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 rounded-lg border border-[#E5DFD1] bg-white px-3 py-2 text-[12.5px] font-medium text-[#1E2A38] hover:border-[#754437] transition-colors">
      {Icon && <Icon size={14} />} {children}
    </button>
  );
}

function PrimaryButton({ children, onClick, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors ${disabled ? "bg-[#8993A0] cursor-not-allowed" : "bg-[#754437] hover:bg-[#5E362B]"} ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------------------------------- Header --------------------------------- */
function Header({ lang, setLang, view, setView, wishlistCount, signedIn, onSignInClick, onSwitchToOwner }) {
  const t = useLang();
  return (
    <header className="sticky top-0 z-30 border-b border-[#E5DFD1] bg-white/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center gap-4">
        <img src={lang === "ar" ? LOGO_AR_DARK : LOGO_EN_DARK} alt={t.brand} className="h-6 w-auto shrink-0" />
        <nav className="hidden sm:flex gap-1 ms-2">
          {["home", "trips"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${view === v ? "bg-[#1E2A38] text-white" : "text-[#1E2A38] hover:bg-[#F7F5F0]"}`}
            >
              {v === "home" ? t.nav.explore : t.nav.trips}
            </button>
          ))}
        </nav>
        <div className="flex-1" />
        <button onClick={onSwitchToOwner} className="hidden sm:block text-sm font-medium text-[#1E2A38] hover:text-[#754437] transition-colors">
          {t.nav.ownerLink}
        </button>
        <button
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          className="flex items-center gap-1 rounded-full border border-[#E5DFD1] px-3 py-1.5 text-xs font-medium text-[#1E2A38] hover:border-[#754437] transition-colors"
        >
          <Globe size={13} /> {lang === "en" ? "AR" : "EN"}
        </button>
        <button className="relative grid h-9 w-9 place-items-center rounded-full border border-[#E5DFD1] hover:border-[#754437] transition-colors">
          <Heart size={16} className={wishlistCount > 0 ? "fill-[#754437] text-[#754437]" : "text-[#5B6472]"} />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -end-1 grid h-4 w-4 place-items-center rounded-full bg-[#754437] text-[9px] font-semibold text-white">{wishlistCount}</span>
          )}
        </button>
        <button onClick={onSignInClick} className="flex items-center gap-1.5 rounded-full bg-[#754437] px-4 py-2 text-sm font-medium text-white hover:bg-[#5E362B] transition-colors">
          {signedIn ? <User size={14} /> : <LogIn size={14} />} {t.nav.signIn}
        </button>
      </div>
    </header>
  );
}

/* -------------------------------- Search bar -------------------------------- */
function SearchBar({ query, setQuery, checkIn, setCheckIn, checkOut, setCheckOut, guests, setGuests, onOpenFilters }) {
  const t = useLang();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 mt-6">
      <div className="flex flex-col sm:flex-row rounded-2xl border border-[#E5DFD1] bg-white shadow-sm overflow-hidden">
        <div className="flex-1 px-4 py-2.5 border-b sm:border-b-0 sm:border-e border-[#E5DFD1]">
          <label className="text-[10.5px] font-bold text-[#1E2A38] uppercase tracking-wide">{t.search.where}</label>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Search size={14} className="text-[#8993A0]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search.where}
              className="flex-1 bg-transparent outline-none text-sm text-[#1E2A38] placeholder:text-[#8993A0]" />
          </div>
        </div>
        <div className="px-4 py-2.5 border-b sm:border-b-0 sm:border-e border-[#E5DFD1] min-w-[130px]">
          <label className="text-[10.5px] font-bold text-[#1E2A38] uppercase tracking-wide">{t.search.checkIn}</label>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Calendar size={14} className="text-[#8993A0]" />
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="bg-transparent outline-none text-xs text-[#1E2A38] w-full" />
          </div>
        </div>
        <div className="px-4 py-2.5 border-b sm:border-b-0 sm:border-e border-[#E5DFD1] min-w-[130px]">
          <label className="text-[10.5px] font-bold text-[#1E2A38] uppercase tracking-wide">{t.search.checkOut}</label>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Calendar size={14} className="text-[#8993A0]" />
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="bg-transparent outline-none text-xs text-[#1E2A38] w-full" />
          </div>
        </div>
        <div className="px-4 py-2.5 min-w-[120px]">
          <label className="text-[10.5px] font-bold text-[#1E2A38] uppercase tracking-wide">{t.search.guests}</label>
          <div className="flex items-center justify-between mt-0.5">
            <span className="flex items-center gap-1 text-sm text-[#1E2A38]"><Users size={14} className="text-[#8993A0]" /> {guests}</span>
            <div className="flex gap-1">
              <button onClick={() => setGuests(Math.max(1, guests - 1))} className="grid h-5 w-5 place-items-center rounded-full border border-[#E5DFD1]"><Minus size={10} /></button>
              <button onClick={() => setGuests(guests + 1)} className="grid h-5 w-5 place-items-center rounded-full border border-[#E5DFD1]"><Plus size={10} /></button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5">
          <button onClick={onOpenFilters} className="flex items-center gap-1.5 rounded-xl bg-[#F7F5F0] border border-[#E5DFD1] px-3.5 py-2.5 text-[13px] font-medium text-[#1E2A38] whitespace-nowrap">
            <SlidersHorizontal size={14} /> {t.search.filters}
          </button>
          <PrimaryButton className="rounded-xl whitespace-nowrap flex items-center gap-1.5">
            <Search size={14} /> {t.search.search}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Category tabs ------------------------------- */
function CategoryTabs({ active, setActive }) {
  const t = useLang();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-6 flex gap-2.5 overflow-x-auto pb-1">
      {["all", "apartment", "hotel", "suite", "villa", "chalet"].map((cat) => {
        const Icon = CATEGORY_ICONS[cat];
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`flex flex-col items-center gap-1.5 min-w-[74px] shrink-0 px-1.5 py-2.5 rounded-2xl border transition-colors ${isActive ? "border-[#1E2A38] bg-[#F7F5F0]" : "border-transparent"}`}
          >
            <Icon size={20} className={isActive ? "text-[#754437]" : "text-[#5B6472]"} />
            <span className={`text-[11.5px] ${isActive ? "font-semibold text-[#1E2A38]" : "font-medium text-[#5B6472]"}`}>{t.categories[cat]}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------ Property card ------------------------------- */
function PropertyCard({ p, lang, isSaved, onToggleSave, onOpen }) {
  const t = useLang();
  const name = lang === "ar" ? p.nameAr : p.name;
  const location = lang === "ar" ? p.locationAr : p.location;
  return (
    <div>
      <div onClick={() => onOpen(p)} className={`relative h-44 rounded-2xl bg-gradient-to-br ${p.grad} flex items-center justify-center cursor-pointer`}>
        <BedDouble size={36} className="text-white/25" />
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSave(p.id); }}
          className="absolute top-2.5 end-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/90"
        >
          <Heart size={15} className={isSaved ? "fill-[#754437] text-[#754437]" : "text-[#5B6472]"} />
        </button>
      </div>
      <button onClick={() => onOpen(p)} className="block w-full text-start mt-2.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13.5px] font-semibold text-[#1E2A38] leading-snug">{name}</p>
          <Stars rating={p.rating} />
        </div>
        <p className="text-[12.5px] text-[#5B6472] mt-1 flex items-center gap-1"><MapPin size={11} /> {location}</p>
        <p className="text-sm text-[#1E2A38] mt-1">
          <span className="font-display font-bold">{fmtMoney(p.price, lang)}</span>{" "}
          <span className="text-[#8993A0]">/ {t.card.night}</span>
        </p>
      </button>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div>
      <div className="h-44 rounded-2xl bg-[#E5DFD1] animate-pulse" />
      <div className="h-3.5 w-2/3 bg-[#E5DFD1] rounded mt-2.5 animate-pulse" />
      <div className="h-3 w-1/2 bg-[#E5DFD1] rounded mt-1.5 animate-pulse" />
      <div className="h-3 w-1/3 bg-[#E5DFD1] rounded mt-2 animate-pulse" />
    </div>
  );
}

/* -------------------------------- Filters modal ------------------------------ */
function FiltersModal({ filters, setFilters, onClose, resultCount }) {
  const t = useLang();
  const toggleType = (type) => setFilters((f) => ({ ...f, types: f.types.includes(type) ? f.types.filter((x) => x !== type) : [...f.types, type] }));
  const toggleAmenity = (a) => setFilters((f) => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] }));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center sm:justify-center" onClick={onClose}>
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5DFD1] sticky top-0 bg-white">
          <h3 className="text-base font-display font-bold text-[#1E2A38]">{t.filters.title}</h3>
          <button onClick={onClose}><X size={20} className="text-[#5B6472]" /></button>
        </div>

        <div className="p-5">
          <p className="text-[13px] font-bold text-[#1E2A38] mb-2.5">{t.filters.priceRange}</p>
          <p className="text-[12.5px] text-[#5B6472] mb-2">{filters.maxPrice} {t.filters.perNight}</p>
          <input type="range" min={0} max={3000} step={50} value={filters.maxPrice}
            onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
            className="w-full accent-[#754437]" />

          <p className="text-[13px] font-bold text-[#1E2A38] mt-6 mb-2.5">{t.filters.propertyType}</p>
          <div className="flex flex-col gap-2">
            {["entire", "private", "shared"].map((type) => (
              <label key={type} className="flex items-center gap-2 text-[13.5px] text-[#1E2A38] cursor-pointer">
                <input type="checkbox" checked={filters.types.includes(type)} onChange={() => toggleType(type)} className="accent-[#754437] w-4 h-4" />
                {t.filters[type]}
              </label>
            ))}
          </div>

          <p className="text-[13px] font-bold text-[#1E2A38] mt-6 mb-2.5">{t.filters.amenities}</p>
          <div className="grid grid-cols-2 gap-2">
            {["wifi", "ac", "parking", "pool", "kitchen"].map((a) => {
              const Icon = AMENITY_META[a];
              const on = filters.amenities.includes(a);
              return (
                <button key={a} onClick={() => toggleAmenity(a)}
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-[12.5px] transition-colors ${on ? "border-[#754437] bg-[#F3EFE6]" : "border-[#E5DFD1] bg-white"}`}>
                  <Icon size={14} className={on ? "text-[#754437]" : "text-[#5B6472]"} /> {t.filters[a]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-[#E5DFD1] p-4 flex items-center justify-between gap-3">
          <button onClick={() => setFilters({ maxPrice: 3000, types: [], amenities: [] })} className="text-[13px] font-semibold text-[#1E2A38] underline">
            {t.filters.clear}
          </button>
          <PrimaryButton onClick={onClose} className="flex-1">{t.filters.show} {resultCount}+ {t.filters.stays}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Home view -------------------------------- */
function HomeView({ lang, favorites, toggleFavorite, onOpenProperty }) {
  const [query, setQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [category, setCategory] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ maxPrice: 3000, types: [], amenities: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [category, query, filters]);

  const filtered = useMemo(() => {
    return LISTINGS.filter((p) => {
      if (category !== "all" && p.type !== category) return false;
      const name = lang === "ar" ? p.nameAr : p.name;
      const loc = lang === "ar" ? p.locationAr : p.location;
      if (query && !name.includes(query) && !loc.includes(query)) return false;
      if (p.price > filters.maxPrice) return false;
      if (filters.amenities.length && !filters.amenities.every((a) => p.amenities.includes(a))) return false;
      if (guests > p.maxGuests) return false;
      return true;
    });
  }, [category, query, filters, guests, lang]);

  return (
    <div className="pb-16">
      <SearchBar query={query} setQuery={setQuery} checkIn={checkIn} setCheckIn={setCheckIn} checkOut={checkOut} setCheckOut={setCheckOut} guests={guests} setGuests={setGuests} onOpenFilters={() => setFiltersOpen(true)} />
      <CategoryTabs active={category} setActive={setCategory} />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((p) => <PropertyCard key={p.id} p={p} lang={lang} isSaved={favorites.has(p.id)} onToggleSave={toggleFavorite} onOpen={onOpenProperty} />)}
        </div>
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-[#5B6472]">
            <Search size={28} className="mx-auto mb-2.5 text-[#8993A0]" />
            <p className="text-sm">No stays match your filters.</p>
          </div>
        )}
      </div>

      {filtersOpen && <FiltersModal filters={filters} setFilters={setFilters} onClose={() => setFiltersOpen(false)} resultCount={filtered.length} />}
    </div>
  );
}

/* ------------------------------ Property details ----------------------------- */
function PropertyDetails({ p, lang, isSaved, onToggleSave, onBack, signedIn, requireSignIn, onReserve }) {
  const t = useLang();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const name = lang === "ar" ? p.nameAr : p.name;
  const location = lang === "ar" ? p.locationAr : p.location;

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const d = (new Date(checkOut) - new Date(checkIn)) / 86400000;
    return d > 0 ? Math.round(d) : 0;
  }, [checkIn, checkOut]);
  const subtotal = nights * p.price;
  const serviceFee = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-5 pb-24">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-[#1E2A38] mb-3.5">
        <ChevronLeft size={16} /> {t.details.back}
      </button>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-2xl overflow-hidden" style={{ height: 340 }}>
        <div className={`col-span-2 row-span-2 bg-gradient-to-br ${p.grad} flex items-center justify-center`}>
          <BedDouble size={32} className="text-white/25" />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`bg-gradient-to-br ${p.grad} opacity-80 flex items-center justify-center`}>
            <BedDouble size={20} className="text-white/25" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-7">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-start gap-2.5">
            <div>
              <h1 className="font-display text-2xl text-[#1E2A38]">{name}</h1>
              <p className="text-[13.5px] text-[#5B6472] mt-1 flex items-center gap-1.5"><MapPin size={13} /> {location}</p>
            </div>
            <button onClick={() => onToggleSave(p.id)} className="h-9 w-9 shrink-0 grid place-items-center rounded-full border border-[#E5DFD1]">
              <Heart size={16} className={isSaved ? "fill-[#754437] text-[#754437]" : "text-[#5B6472]"} />
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-[#1E2A38]">
            <Stars rating={p.rating} size={14} />
            <span className="text-[#8993A0]">{p.reviews} {t.card.reviews}</span>
            <span className="flex items-center gap-1 text-[#5B6472]"><Users size={13} /> {p.maxGuests}</span>
            <span className="flex items-center gap-1 text-[#5B6472]"><BedDouble size={13} /> {p.bedrooms} {t.details.bedrooms}</span>
            <span className="flex items-center gap-1 text-[#5B6472]"><Bath size={13} /> {p.bathrooms} {t.details.bathrooms}</span>
            <span className="flex items-center gap-1 text-[#5B6472]"><Ruler size={13} /> {p.sqm} {t.details.sqm}</span>
          </div>

          <div className="border-t border-[#E5DFD1] mt-5 pt-5 flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-[#28374A] text-white grid place-items-center font-display font-bold">{p.host.name[0]}</div>
            <div>
              <p className="text-[13.5px] font-semibold text-[#1E2A38]">{t.details.hostedBy} {p.host.name}</p>
              <p className="text-xs text-[#5B6472]">{t.details.joined} {p.host.joined}</p>
            </div>
          </div>

          <div className="border-t border-[#E5DFD1] mt-5 pt-5">
            <h3 className="font-display text-base text-[#1E2A38] mb-2">{t.details.about}</h3>
            <p className="text-[13.5px] text-[#5B6472] leading-relaxed">{p.desc}</p>
          </div>

          <div className="border-t border-[#E5DFD1] mt-5 pt-5">
            <h3 className="font-display text-base text-[#1E2A38] mb-3">{t.details.amenities}</h3>
            <div className="grid grid-cols-2 gap-3">
              {p.amenities.map((a) => {
                const Icon = AMENITY_META[a];
                return (
                  <div key={a} className="flex items-center gap-2 text-[13.5px] text-[#1E2A38]">
                    <Icon size={16} className="text-[#754437]" /> {t.filters[a]}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#E5DFD1] mt-5 pt-5">
            <h3 className="font-display text-base text-[#1E2A38] mb-3">{t.details.location}</h3>
            <div className="h-44 rounded-xl bg-[#F7F5F0] border border-[#E5DFD1] grid place-items-center">
              <div className="text-center text-[#5B6472]">
                <MapPin size={22} className="mx-auto mb-1.5" />
                <p className="text-[12.5px]">{t.details.mapPlaceholder} — {location}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E5DFD1] mt-5 pt-5">
            <h3 className="font-display text-base text-[#1E2A38] mb-1 flex items-center gap-1.5">
              <Star size={15} className="fill-[#7C7340] text-[#7C7340]" /> {p.rating.toFixed(1)} · {p.reviews} {t.details.reviews}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 mt-3.5">
              <ScoreBar label={t.details.cleanliness} value={p.scores.cleanliness} />
              <ScoreBar label={t.details.communication} value={p.scores.communication} />
              <ScoreBar label={t.details.locationScore} value={p.scores.location} />
              <ScoreBar label={t.details.value} value={p.scores.value} />
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-20 rounded-2xl border border-[#E5DFD1] p-4.5 shadow-[0_4px_16px_rgba(30,42,56,0.08)]">
            <p className="text-lg font-display font-bold text-[#1E2A38]">
              {fmtMoney(p.price, lang)} <span className="text-[13px] font-normal text-[#8993A0]">/ {t.details.perNight}</span>
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="rounded-lg border border-[#E5DFD1] p-2">
                <label className="text-[10px] font-bold text-[#5B6472] uppercase">{t.details.checkIn}</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="block w-full outline-none text-xs mt-0.5" />
              </div>
              <div className="rounded-lg border border-[#E5DFD1] p-2">
                <label className="text-[10px] font-bold text-[#5B6472] uppercase">{t.details.checkOut}</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="block w-full outline-none text-xs mt-0.5" />
              </div>
            </div>
            <div className="rounded-lg border border-[#E5DFD1] px-2.5 py-2 mt-2 flex justify-between items-center">
              <span className="text-xs text-[#5B6472]">{t.details.guests}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-5.5 h-5.5 grid place-items-center rounded-full border border-[#E5DFD1]"><Minus size={11} /></button>
                <span className="text-[13px]">{guests}</span>
                <button onClick={() => setGuests(Math.min(p.maxGuests, guests + 1))} className="w-5.5 h-5.5 grid place-items-center rounded-full border border-[#E5DFD1]"><Plus size={11} /></button>
              </div>
            </div>

            {nights > 0 ? (
              <div className="mt-3.5 text-[13px] space-y-1.5">
                <div className="flex justify-between text-[#5B6472]"><span>{fmtMoney(p.price, lang)} × {nights} {t.details.nights}</span><span>{fmtMoney(subtotal, lang)}</span></div>
                <div className="flex justify-between text-[#5B6472]"><span>{t.details.serviceFee}</span><span>{fmtMoney(serviceFee, lang)}</span></div>
                <div className="flex justify-between font-semibold text-[#1E2A38] border-t border-[#E5DFD1] pt-2"><span>{t.details.total}</span><span>{fmtMoney(total, lang)}</span></div>
              </div>
            ) : (
              <p className="text-xs text-[#8993A0] mt-3.5">{t.details.selectDates}</p>
            )}

            <PrimaryButton
              disabled={nights <= 0}
              onClick={() => (signedIn ? onReserve({ listing: p, checkIn, checkOut, guests, nights, total }) : requireSignIn())}
              className="w-full mt-4"
            >
              {t.details.bookNow}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- Modals --------------------------------- */
function SignInModal({ onClose, onSuccess }) {
  const t = useLang();
  const [mode, setMode] = useState("signin");
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-[#1E2A38]">{t.signIn.title}</h3>
          <button onClick={onClose}><X size={18} className="text-[#5B6472]" /></button>
        </div>
        <p className="text-sm text-[#5B6472] mb-5">{t.signIn.sub}</p>
        <div className="space-y-3">
          {mode === "signup" && <input placeholder={t.signIn.name} className="w-full rounded-lg border border-[#E5DFD1] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#7C7340]/40" />}
          <input placeholder={t.signIn.email} className="w-full rounded-lg border border-[#E5DFD1] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#7C7340]/40" />
          <input type="password" placeholder={t.signIn.password} className="w-full rounded-lg border border-[#E5DFD1] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#7C7340]/40" />
        </div>
        <button onClick={onSuccess} className="mt-5 w-full rounded-lg bg-[#754437] py-2.5 text-sm font-medium text-white hover:bg-[#5E362B] transition-colors">
          {mode === "signup" ? t.signIn.createSubmit : t.signIn.submit}
        </button>
        <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="mt-3 w-full text-center text-xs text-[#754437] hover:underline">
          {mode === "signup" ? t.signIn.switchBack : t.signIn.switch}
        </button>
      </div>
    </div>
  );
}

function CheckoutModal({ booking, lang, onClose, onConfirm, confirmed, confirmCode }) {
  const t = useLang();
  const name = lang === "ar" ? booking.listing.nameAr : booking.listing.name;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        {!confirmed ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg text-[#1E2A38]">{t.checkout.title}</h3>
              <button onClick={onClose}><X size={18} className="text-[#5B6472]" /></button>
            </div>
            <p className="text-xs uppercase tracking-wide text-[#8993A0] mb-1">{t.checkout.summary}</p>
            <p className="text-sm font-semibold text-[#1E2A38]">{name}</p>
            <p className="text-xs text-[#5B6472] mt-1">{booking.checkIn} → {booking.checkOut} · {booking.nights} {t.details.nights} · {booking.guests}</p>
            <div className="flex justify-between font-semibold text-[#1E2A38] mt-4 pt-3 border-t border-[#E5DFD1]">
              <span>{t.details.total}</span><span>{fmtMoney(booking.total, lang)}</span>
            </div>
            <button onClick={onConfirm} className="mt-5 w-full rounded-lg bg-[#754437] py-2.5 text-sm font-medium text-white hover:bg-[#5E362B] transition-colors">
              {t.checkout.confirm}
            </button>
          </>
        ) : (
          <div className="text-center py-2">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#E3FBEF] mb-4">
              <Check size={26} className="text-[#0F9D58]" />
            </div>
            <h3 className="font-display text-lg text-[#1E2A38]">{t.checkout.confirmedTitle}</h3>
            <p className="text-sm text-[#5B6472] mt-1">{t.checkout.confirmedSub}</p>
            <p className="mt-4 text-xs text-[#8993A0]">{t.checkout.code}</p>
            <p className="font-mono text-sm text-[#1E2A38] tracking-widest">{confirmCode}</p>
            <button onClick={onClose} className="mt-6 w-full rounded-lg border border-[#E5DFD1] py-2.5 text-sm font-medium text-[#1E2A38] hover:border-[#754437] transition-colors">
              {t.checkout.backToSearch}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- My Trips --------------------------------- */
const TRIP_BOOKINGS = [
  { id: "B-2201", listingIdx: 0, status: "confirmed", checkIn: "2026-08-14", checkOut: "2026-08-17", total: 1860, bucket: "upcoming" },
  { id: "B-2185", listingIdx: 1, status: "pending", checkIn: "2026-09-02", checkOut: "2026-09-05", total: 2850, bucket: "upcoming" },
  { id: "B-1972", listingIdx: 3, status: "completed", checkIn: "2026-03-10", checkOut: "2026-03-12", total: 820, bucket: "past" },
  { id: "B-1888", listingIdx: 4, status: "cancelled", checkIn: "2026-02-01", checkOut: "2026-02-04", total: 7200, bucket: "cancelled" },
];

function TripCard({ trip, lang }) {
  const t = useLang();
  const p = LISTINGS[trip.listingIdx];
  const name = lang === "ar" ? p.nameAr : p.name;
  return (
    <div className="flex flex-col sm:flex-row gap-3.5 rounded-2xl border border-[#E5DFD1] bg-white p-3.5">
      <div className={`w-full sm:max-w-[140px] h-24 rounded-xl shrink-0 bg-gradient-to-br ${p.grad} grid place-items-center`}>
        <BedDouble size={22} className="text-white/25" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between gap-2 flex-wrap">
          <p className="text-sm font-semibold text-[#1E2A38]">{name}</p>
          <StatusBadge status={trip.status} t={t} />
        </div>
        <p className="text-[12.5px] text-[#5B6472] mt-1">{fmtDate(trip.checkIn, lang)} — {fmtDate(trip.checkOut, lang)}</p>
        <p className="text-xs text-[#8993A0] mt-0.5">{t.trips.ref}: <span className="font-mono">{trip.id}</span> · {t.trips.total}: {fmtMoney(trip.total, lang)}</p>
        <div className="flex gap-2 mt-2.5 flex-wrap">
          {trip.bucket === "upcoming" && (<>
            <GhostButton icon={Navigation}>{t.trips.getDirections}</GhostButton>
            <GhostButton icon={MessageCircle}>{t.trips.contactHost}</GhostButton>
          </>)}
          {trip.bucket === "past" && <GhostButton icon={PencilLine}>{t.trips.writeReview}</GhostButton>}
        </div>
      </div>
    </div>
  );
}

function MyTrips({ lang }) {
  const t = useLang();
  const [tab, setTab] = useState("upcoming");
  const list = TRIP_BOOKINGS.filter((tr) => tr.bucket === tab);
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-7 pb-16">
      <h1 className="font-display text-2xl text-[#1E2A38]">{t.trips.title}</h1>
      <div className="flex gap-6 mt-4 border-b border-[#E5DFD1]">
        {["upcoming", "past", "cancelled"].map((k) => (
          <button key={k} onClick={() => setTab(k)}
            className={`pb-2.5 text-[13.5px] font-semibold border-b-2 -mb-px transition-colors ${tab === k ? "text-[#1E2A38] border-[#754437]" : "text-[#8993A0] border-transparent"}`}>
            {t.trips[k]}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 mt-5">
        {list.length === 0 && (
          <div className="text-center py-14 text-[#5B6472]">
            <Calendar size={26} className="mx-auto mb-2.5 text-[#8993A0]" />
            <p className="text-sm font-semibold text-[#1E2A38]">{t.trips.empty}</p>
            <p className="text-[12.5px] mt-1">{t.trips.emptySub}</p>
          </div>
        )}
        {list.map((trip) => <TripCard key={trip.id} trip={trip} lang={lang} />)}
      </div>
    </div>
  );
}

/* --------------------------------- Footer ---------------------------------- */
function Footer({ lang, onSwitchToOwner }) {
  const t = useLang();
  return (
    <footer className="bg-[#28374A] text-[#E9E4D5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <img src={lang === "ar" ? LOGO_AR : LOGO_EN} alt={t.brand} className="h-6 w-auto" />
        <button onClick={onSwitchToOwner} className="text-sm text-[#D6CA85] hover:underline">{t.footer.ownerCta}</button>
      </div>
      <div className="border-t border-white/10 px-4 sm:px-8 py-3.5 text-[11px] text-[#A79C87] max-w-6xl mx-auto">
        © {new Date().getFullYear()} {t.brand}. {t.footer.rights}
      </div>
    </footer>
  );
}

/* --------------------------------- App ------------------------------------ */
export default function TravelerApp({ onSwitchToOwner }) {
  const [lang, setLang] = useState("en");
  const t = DICT[lang];
  const [view, setView] = useState("home"); // home | details | trips
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [signedIn, setSignedIn] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [booking, setBooking] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmCode] = useState(() => "SKN-" + Math.random().toString(36).slice(2, 8).toUpperCase());

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  const toggleFavorite = (id) => {
    if (!signedIn) {
      setPendingAction({ type: "wishlist", id });
      setShowSignIn(true);
      return;
    }
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const requireSignInForReserve = () => {
    setPendingAction({ type: "reserve" });
    setShowSignIn(true);
  };

  const handleSignInSuccess = () => {
    setSignedIn(true);
    setShowSignIn(false);
    if (pendingAction?.type === "wishlist") setFavorites((prev) => new Set(prev).add(pendingAction.id));
    setPendingAction(null);
  };

  const handleReserve = (payload) => {
    setBooking(payload);
    setView("home");
    setSelectedProperty(null);
  };

  return (
    <LangContext.Provider value={t}>
      <div dir={t.dir} className={`min-h-screen w-full bg-white ${lang === "ar" ? "font-ar" : "font-en"}`}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&family=Tajawal:wght@400;500;700&display=swap');
          .font-en { font-family: 'Inter', ui-sans-serif, system-ui; }
          .font-en .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui; letter-spacing: -0.01em; }
          .font-ar, .font-ar .font-display { font-family: 'Tajawal', ui-sans-serif, system-ui; }
        `}</style>

        <Header
          lang={lang} setLang={setLang} view={view === "details" ? "home" : view}
          setView={(v) => { setView(v); setSelectedProperty(null); }}
          wishlistCount={favorites.size} signedIn={signedIn}
          onSignInClick={() => (signedIn ? null : setShowSignIn(true))}
          onSwitchToOwner={onSwitchToOwner}
        />

        {view === "home" && (
          <HomeView lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} onOpenProperty={(p) => { setSelectedProperty(p); setView("details"); }} />
        )}
        {view === "details" && selectedProperty && (
          <PropertyDetails
            p={selectedProperty} lang={lang} isSaved={favorites.has(selectedProperty.id)} onToggleSave={toggleFavorite}
            onBack={() => setView("home")} signedIn={signedIn} requireSignIn={requireSignInForReserve} onReserve={handleReserve}
          />
        )}
        {view === "trips" && <MyTrips lang={lang} />}

        {view === "home" && <Footer lang={lang} onSwitchToOwner={onSwitchToOwner} />}

        {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} onSuccess={handleSignInSuccess} />}
        {booking && (
          <CheckoutModal
            booking={booking} lang={lang} onClose={() => { setBooking(null); setConfirmed(false); }}
            onConfirm={() => setConfirmed(true)} confirmed={confirmed} confirmCode={confirmCode}
          />
        )}
      </div>
    </LangContext.Provider>
  );
}
