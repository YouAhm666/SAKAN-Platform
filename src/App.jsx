import React, { useState, useContext, createContext, useMemo, useEffect } from "react";
import {
  LayoutDashboard, CalendarClock, Building2, Wallet, Star, Globe, Bell, Search,
  ChevronRight, X, Check, AlertTriangle, Sparkles, Wifi, WifiOff, Users, DollarSign,
  TrendingUp, TrendingDown, Upload, MapPin, Phone, Ruler, BedDouble, MoreVertical,
  MessageSquare, RefreshCw, CreditCard, FileText, ImagePlus, PlusCircle, SlidersHorizontal,
  ClipboardList, ShieldCheck, Wrench, Droplets, ArrowUpRight, ArrowDownRight, Coffee,
  ShoppingBag, Waves, ExternalLink, KeyRound, DoorOpen, DoorClosed, Zap, Hand
} from "lucide-react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

/* Brand lockups (icon + wordmark), embedded inline so the app stays a single
   self-contained file. EN lockup reads icon-first (LTR); AR lockup reads
   icon-last (RTL), matching each language's natural reading direction. */
import { LOGO_EN, LOGO_AR, LOGO_EN_DARK, LOGO_AR_DARK } from "./brand.js";

/* ============================================================================
   DESIGN TOKENS (see inline <style> block for font imports)
   Palette — brand system built on four colors: Areia (sand), Terra Queimada
   (burnt terracotta), Verde Opaco (opaque olive), Azul (deep navy).
     ink-950     #16202B  (near-black navy, text)
     azul-950    #28374A  (sidebar / deep surfaces — literal Azul)
     terra-600   #754437  (primary interactive — Terra Queimada)
     terra-700   #5E362B  (primary hover, darker)
     terra-500   #9A6152  (primary lighter accent)
     verde-600   #7C7340  (signal accent on light surfaces — ratings, active state, focus rings)
     verde-tint  #D6CA85  (signal accent on dark surfaces — sidebar active rail, brandSub)
     areia-tint  #E9E4D5  (sidebar body text tint — Areia)
     paper       #F7F5F0  (app background, warm sand-white)
     line        #E5DFD1  (hairline borders, Areia-tinted)
     clean       #17C964  (status green, kept distinct from brand colors)
     dirty       #FF6B35  (status orange, kept distinct from brand colors)
     maint       #6B7280  (status neutral slate)
   Fonts: "Space Grotesk" (display, LTR headings — geometric, modern),
          "Tajawal" (Arabic display+body), "Inter" (LTR body/UI),
          "JetBrains Mono" (data/codes)
   Signature element: the "Signal Tab" — every property/unit card carries a
   slim status flag on its trailing edge instead of a boxed badge, and the
   sidebar's active item is marked by a single glowing Verde Opaco rail.
   Status colors stay universally legible (green/orange/gray) independent of
   the brand palette, which is reserved for chrome, CTAs, and accents.
   ============================================================================ */

/* ---------------------------------- i18n ---------------------------------- */
const DICT = {
  en: {
    dir: "ltr",
    brand: "SAKAN", brandSub: "Host Operations",
    nav: {
      overview: "Overview & Analytics",
      timeline: "Booking Timeline & Housekeeping",
      availability: "Availability & Room Status",
      setup: "Property & Branding Setup",
      financials: "Financials & Channel Manager",
      reviews: "Ratings & Reviews",
    },
    search: "Search properties, guests, bookings…",
    langToggle: "العربية",
    kpi: {
      totalBookings: "Total Bookings / Leases",
      activeGuests: "Active Guests",
      grossRevenue: "Gross Revenue",
      heldCommission: "Held Platform Commission",
    },
    alerts: {
      title: "Smart Alert",
      occDrop: "Occupancy at {p} dropped {n}% week-over-week — review pricing before the weekend.",
      lateSync: "{c} inventory sync delayed on {p} — rates may be stale on OTA listings.",
      dismiss: "Dismiss",
    },
    quick: {
      title: "Quick Actions",
      addProperty: "Add New Property",
      adjustPricing: "Adjust Inventory & Pricing",
      manualBooking: "Manual Booking / Create Lease",
    },
    chart: {
      title: "Business Performance",
      sub: "Revenue and occupancy trajectory, last 8 weeks",
      revenue: "Gross Revenue",
      occupancy: "Occupancy Rate",
    },
    status: { clean: "Clean", dirty: "Dirty", maintenance: "Under Maintenance" },
    statusVerb: { clean: "Mark as Cleaned", dirty: "Mark as Dirty", maintenance: "Put Under Maintenance" },
    residency: { short: "Short-Term Stay", long: "Long-Term Rental" },
    payment: { gateway: "Paid via Platform Gateway", checkin: "Pay at Check-In / Pay Monthly" },
    timeline: {
      title: "Weekly Timeline",
      sub: "Click any block to open the guest folio and update room status",
      filterAll: "All Statuses",
      legend: "Status Legend",
    },
    modal: {
      guestInfo: "Guest / Tenant Info",
      residencyType: "Residency Type",
      searchMeta: "Search Metadata",
      paymentMethod: "Payment Method",
      folio: "On-Site Guest Folio",
      folioTotal: "Folio Total",
      close: "Close",
      source: "Booking Source",
      nights: "Nights",
      channel: "Channel",
      device: "Device",
    },
    setup: {
      title: "Property & Branding Setup",
      sub: "Add or update a listing — details sync live to the guest website and app.",
      propertyType: "Property Type",
      tierLayout: "Tier / Layout Configuration",
      occupancy: "Occupancy & Bed Configuration",
      specialty: "Specialty Accommodation",
      area: "Area (m²)",
      location: "Location",
      hostContact: "Host Contact Information",
      amenities: "Amenities & Features",
      initialStatus: "Initial Status",
      residencySwitch: "Residency Type",
      rateShort: "Nightly Rate",
      rateLong: "Monthly Rate",
      overbooking: "Overbooking Buffer",
      leaseTerm: "Minimum Lease Term (months)",
      logo: "Host / Hotel Logo",
      gallery: "Property Photo Gallery",
      syncNote: "These details will automatically link and sync live to your public listing on the Guest Website and Mobile Applications.",
      save: "Save Property",
      dropHint: "Drag files here or click to upload",
      name: "Property / Unit Name",
      currentListings: "Current Listings",
    },
    financials: {
      title: "Financials & Channel Manager",
      sub: "Distribution channels, payouts, and commission tracking",
      channelSync: "Channel Sync Panel",
      channelNote: "Channel Manager: Automatically updates your room availability and rates across all Online Travel Agencies (OTAs).",
      lastSync: "Last synced",
      neverSynced: "Not connected",
      ledger: "Platform Ledger",
      ledgerSub: "Payouts issued to hosts",
      invoices: "Commission Invoices Owed",
      invoicesSub: "Off-platform check-ins pending commission settlement",
      property: "Property", amount: "Amount", date: "Date", statusCol: "Status",
      paid: "Paid", pending: "Pending", overdue: "Overdue",
      reconnect: "Reconnect", disconnect: "Disconnect",
    },
    reviews: {
      title: "Ratings, Reviews & Channel Insights",
      sub: "Aggregate guest sentiment across all properties",
      avgRating: "Average Rating",
      totalReviews: "Total Reviews",
      responseRate: "Response Rate",
      reply: "Reply to Review",
      yourReply: "Write a reply…",
      send: "Send Reply",
      replied: "Replied",
      viewedOn: "via",
    },
    availability: {
      title: "Availability Control",
      sub: "Open or close any room, chalet, or entire property for booking — automatically or manually.",
      mode: "Mode",
      auto: "Automatic",
      manual: "Manual",
      autoDesc: "Follows housekeeping status — closes on its own during maintenance, reopens once marked clean.",
      manualDesc: "You're in direct control of this listing, independent of housekeeping status.",
      open: "Open for booking",
      closed: "Closed to booking",
      closedAuto: "Closed automatically — under maintenance",
      closedManual: "Closed by host",
      closeProperty: "Close entire property",
      openProperty: "Reopen entire property",
      unitsClosed: "{n} of {t} units closed",
      allOpen: "All units open",
      unitsCount: "{n} units",
    },
    common: {
      unit: "Unit", perNight: "/ night", perMonth: "/ month", nights: "nights",
      showMore: "Show more", area: "Area",
    },
  },
  ar: {
    dir: "rtl",
    brand: "سكن", brandSub: "عمليات المضيف",
    nav: {
      overview: "نظرة عامة وتحليلات",
      timeline: "الجدول الزمني للحجوزات والتدبير المنزلي",
      availability: "التوفر وحالة الغرف",
      setup: "إعداد العقار والهوية",
      financials: "الشؤون المالية وإدارة القنوات",
      reviews: "التقييمات والمراجعات",
    },
    search: "ابحث عن عقارات، نزلاء، حجوزات…",
    langToggle: "English",
    kpi: {
      totalBookings: "إجمالي الحجوزات / العقود",
      activeGuests: "النزلاء النشطون",
      grossRevenue: "إجمالي الإيرادات",
      heldCommission: "العمولة المحتجزة",
    },
    alerts: {
      title: "تنبيه ذكي",
      occDrop: "انخفض معدل الإشغال في {p} بنسبة {n}٪ أسبوعياً — راجع التسعير قبل نهاية الأسبوع.",
      lateSync: "تأخّر مزامنة المخزون لـ {c} في {p} — قد تكون الأسعار على منصات الحجز غير محدثة.",
      dismiss: "إغلاق",
    },
    quick: {
      title: "إجراءات سريعة",
      addProperty: "إضافة عقار جديد",
      adjustPricing: "تعديل المخزون والأسعار",
      manualBooking: "حجز يدوي / إنشاء عقد",
    },
    chart: {
      title: "أداء الأعمال",
      sub: "مسار الإيرادات والإشغال خلال آخر 8 أسابيع",
      revenue: "إجمالي الإيرادات",
      occupancy: "معدل الإشغال",
    },
    status: { clean: "نظيفة", dirty: "تحتاج تنظيف", maintenance: "تحت الصيانة" },
    statusVerb: { clean: "تمييز كنظيفة", dirty: "تمييز كغير نظيفة", maintenance: "وضع تحت الصيانة" },
    residency: { short: "إقامة قصيرة الأجل", long: "إيجار طويل الأجل" },
    payment: { gateway: "الدفع عبر بوابة المنصة", checkin: "الدفع عند تسجيل الوصول / شهرياً" },
    timeline: {
      title: "الجدول الأسبوعي",
      sub: "انقر على أي وحدة لعرض فاتورة النزيل وتحديث حالة الغرفة",
      filterAll: "كل الحالات",
      legend: "دليل الحالات",
    },
    modal: {
      guestInfo: "بيانات النزيل / المستأجر",
      residencyType: "نوع الإقامة",
      searchMeta: "بيانات البحث",
      paymentMethod: "طريقة الدفع",
      folio: "فاتورة النزيل الداخلية",
      folioTotal: "إجمالي الفاتورة",
      close: "إغلاق",
      source: "مصدر الحجز",
      nights: "عدد الليالي",
      channel: "القناة",
      device: "الجهاز",
    },
    setup: {
      title: "إعداد العقار والهوية",
      sub: "أضف أو حدّث إعلاناً — تتم مزامنة التفاصيل مباشرة مع موقع وتطبيق النزلاء.",
      propertyType: "نوع العقار",
      tierLayout: "فئة وتصميم الوحدة",
      occupancy: "الإشغال وتهيئة الأسرّة",
      specialty: "إقامة ذات طابع خاص",
      area: "المساحة (م²)",
      location: "الموقع",
      hostContact: "بيانات التواصل مع المضيف",
      amenities: "المرافق والمزايا",
      initialStatus: "الحالة الأولية",
      residencySwitch: "نوع الإقامة",
      rateShort: "السعر لليلة",
      rateLong: "السعر الشهري",
      overbooking: "هامش الحجز الزائد",
      leaseTerm: "الحد الأدنى لمدة العقد (أشهر)",
      logo: "شعار المضيف / الفندق",
      gallery: "معرض صور العقار",
      syncNote: "سيتم ربط هذه التفاصيل ومزامنتها مباشرة مع إعلانك العام على موقع وتطبيقات النزلاء.",
      save: "حفظ العقار",
      dropHint: "اسحب الملفات هنا أو انقر للرفع",
      name: "اسم العقار / الوحدة",
      currentListings: "الإعلانات الحالية",
    },
    financials: {
      title: "الشؤون المالية وإدارة القنوات",
      sub: "قنوات التوزيع، المدفوعات، وتتبع العمولات",
      channelSync: "لوحة مزامنة القنوات",
      channelNote: "إدارة القنوات: تحدّث تلقائياً توفر الغرف والأسعار عبر جميع وكالات السفر الإلكترونية (OTAs).",
      lastSync: "آخر مزامنة",
      neverSynced: "غير متصل",
      ledger: "سجل المنصة المالي",
      ledgerSub: "المدفوعات الصادرة للمضيفين",
      invoices: "فواتير العمولة المستحقة",
      invoicesSub: "حجوزات خارج المنصة بانتظار تسوية العمولة",
      property: "العقار", amount: "المبلغ", date: "التاريخ", statusCol: "الحالة",
      paid: "مدفوعة", pending: "قيد الانتظار", overdue: "متأخرة",
      reconnect: "إعادة الاتصال", disconnect: "قطع الاتصال",
    },
    reviews: {
      title: "التقييمات والمراجعات ورؤى القنوات",
      sub: "ملخص آراء النزلاء عبر جميع العقارات",
      avgRating: "متوسط التقييم",
      totalReviews: "إجمالي المراجعات",
      responseRate: "معدل الرد",
      reply: "الرد على المراجعة",
      yourReply: "اكتب رداً…",
      send: "إرسال الرد",
      replied: "تم الرد",
      viewedOn: "عبر",
    },
    availability: {
      title: "التحكم بالتوفر",
      sub: "افتح أو أغلق أي غرفة أو شاليه أو عقار بالكامل أمام الحجز — تلقائياً أو يدوياً.",
      mode: "الوضع",
      auto: "تلقائي",
      manual: "يدوي",
      autoDesc: "يتبع حالة التدبير المنزلي — يُغلق تلقائياً أثناء الصيانة، ويعاد فتحه فور التمييز كنظيفة.",
      manualDesc: "أنت تتحكم بهذا الإعلان مباشرة، بغض النظر عن حالة التدبير المنزلي.",
      open: "متاح للحجز",
      closed: "مغلق أمام الحجز",
      closedAuto: "مغلق تلقائياً — قيد الصيانة",
      closedManual: "مغلق من قبل المضيف",
      closeProperty: "إغلاق العقار بالكامل",
      openProperty: "إعادة فتح العقار بالكامل",
      unitsClosed: "{n} من {t} وحدات مغلقة",
      allOpen: "جميع الوحدات متاحة",
      unitsCount: "{n} وحدات",
    },
    common: {
      unit: "وحدة", perNight: "/ ليلة", perMonth: "/ شهر", nights: "ليالٍ",
      showMore: "عرض المزيد", area: "المساحة",
    },
  },
};

const PROPERTY_TYPES = ["Hotel", "Hostel", "Villa", "Chalet", "Apartment", "Bedrooms", "House"];
const PROPERTY_TYPES_AR = { Hotel: "فندق", Hostel: "نُزل", Villa: "فيلا", Chalet: "شاليه", Apartment: "شقة", Bedrooms: "غرف فردية", House: "منزل" };
const TIERS = ["Standard Room", "Superior/Deluxe Room", "Junior Suite", "Executive Suite", "Presidential/Penthouse Suite"];
const TIERS_AR = { "Standard Room": "غرفة عادية", "Superior/Deluxe Room": "غرفة سوبيريور/ديلوكس", "Junior Suite": "جناح صغير", "Executive Suite": "جناح تنفيذي", "Presidential/Penthouse Suite": "الجناح الرئاسي/البنتهاوس" };
const OCCUPANCY = ["Single Room", "Double Room", "Twin Room", "Double-Double (Queen-Queen)", "Triple/Quad Room"];
const OCCUPANCY_AR = { "Single Room": "غرفة مفردة", "Double Room": "غرفة مزدوجة", "Twin Room": "غرفة توأم", "Double-Double (Queen-Queen)": "غرفة كوين مزدوجة", "Triple/Quad Room": "غرفة ثلاثية/رباعية" };
const SPECIALTY = ["Studio Room", "Connecting/Adjoining Rooms", "Accessible Room", "Villa/Bungalow"];
const SPECIALTY_AR = { "Studio Room": "غرفة استوديو", "Connecting/Adjoining Rooms": "غرف متصلة", "Accessible Room": "غرفة لذوي الاحتياجات", "Villa/Bungalow": "فيلا/بنغالو" };

/* ------------------------------ mock dataset ------------------------------ */
const PROPERTIES = [
  { id: "P-101", name: "Sakan Bay Hotel — Room 412", nameAr: "فندق سكن باي — غرفة 412", type: "Hotel", tier: "Executive Suite", occupancy: "Double-Double (Queen-Queen)", specialty: null, area: 62, location: "Jumeirah Coast, Dubai", host: "Layla Haddad", phone: "+971 50 213 8842", status: "clean", residency: "short", price: 1450, currency: "AED", image: "hotel" },
  { id: "P-102", name: "Sakan Bay Hotel — Room 118", nameAr: "فندق سكن باي — غرفة 118", type: "Hotel", tier: "Standard Room", occupancy: "Twin Room", specialty: null, area: 28, location: "Jumeirah Coast, Dubai", host: "Layla Haddad", phone: "+971 50 213 8842", status: "dirty", residency: "short", price: 420, currency: "AED", image: "hotel" },
  { id: "P-203", name: "Cedar Hills Chalet", nameAr: "شاليه سيدر هيلز", type: "Chalet", tier: "Junior Suite", occupancy: "Double Room", specialty: "Villa/Bungalow", area: 145, location: "Faraya, Mount Lebanon", host: "Karim Fakhoury", phone: "+961 3 445 210", status: "maintenance", residency: "short", price: 220, currency: "USD", image: "chalet" },
  { id: "P-304", name: "Old Town Hostel — Bunk Bay", nameAr: "نُزل البلدة القديمة — الرواق", type: "Hostel", tier: "Standard Room", occupancy: "Triple/Quad Room", specialty: "Studio Room", area: 34, location: "Balat, Istanbul", host: "Mert Aydın", phone: "+90 532 118 4477", status: "clean", residency: "short", price: 38, currency: "USD", image: "hostel" },
  { id: "P-405", name: "Palm Villa Residence 7", nameAr: "فيلا النخيل — وحدة 7", type: "Villa", tier: "Presidential/Penthouse Suite", occupancy: "Double-Double (Queen-Queen)", specialty: "Villa/Bungalow", area: 410, location: "Palm Jumeirah, Dubai", host: "Sara Al Mansoori", phone: "+971 55 902 1187", status: "clean", residency: "long", price: 28500, currency: "AED", image: "villa" },
  { id: "P-506", name: "Downtown Loft 6B", nameAr: "لوفت وسط البلد 6B", type: "Apartment", tier: "Superior/Deluxe Room", occupancy: "Double Room", specialty: "Studio Room", area: 71, location: "Zamalek, Cairo", host: "Nour El-Sayed", phone: "+20 100 334 7712", status: "dirty", residency: "long", price: 18200, currency: "EGP", image: "apartment" },
  { id: "P-607", name: "Marina Bedrooms — Unit C", nameAr: "غرف المارينا — وحدة C", type: "Bedrooms", tier: "Standard Room", occupancy: "Single Room", specialty: "Accessible Room", area: 22, location: "Ras Al Khaimah Marina", host: "Omar Idris", phone: "+971 52 776 4410", status: "clean", residency: "short", price: 190, currency: "AED", image: "bedrooms" },
  { id: "P-708", name: "Heritage House — Garden Wing", nameAr: "بيت التراث — جناح الحديقة", type: "House", tier: "Junior Suite", occupancy: "Triple/Quad Room", specialty: "Connecting/Adjoining Rooms", area: 96, location: "Al Balad, Jeddah", host: "Yasmin Qureshi", phone: "+966 55 213 908", status: "maintenance", residency: "long", price: 9600, currency: "SAR", image: "house" },
];

const OTA_CHANNELS = [
  { id: "booking", name: "Booking.com", synced: true, lastSync: "2 min ago", lastSyncAr: "قبل دقيقتين", rate: 96 },
  { id: "expedia", name: "Expedia", synced: true, lastSync: "11 min ago", lastSyncAr: "قبل 11 دقيقة", rate: 89 },
  { id: "airbnb", name: "Airbnb", synced: false, lastSync: "4 hours ago", lastSyncAr: "قبل 4 ساعات", rate: 0 },
  { id: "direct", name: "Direct Booking Engine", synced: true, lastSync: "live", lastSyncAr: "مباشر", rate: 100, direct: true },
];

const CHART_DATA = [
  { week: "W1", revenue: 41200, occupancy: 62 },
  { week: "W2", revenue: 44800, occupancy: 67 },
  { week: "W3", revenue: 39650, occupancy: 58 },
  { week: "W4", revenue: 52300, occupancy: 74 },
  { week: "W5", revenue: 49900, occupancy: 71 },
  { week: "W6", revenue: 36100, occupancy: 51 },
  { week: "W7", revenue: 58200, occupancy: 79 },
  { week: "W8", revenue: 61400, occupancy: 83 },
];

const BOOKINGS = [
  { id: "B-9001", unitId: "P-101", unit: "Room 412", guest: "Adrian Vance", day: 0, span: 3, residency: "short", payment: "gateway", channel: "Booking.com", device: "Mobile App", folio: [
      { item: "Room Charge", itemAr: "رسوم الغرفة", amount: 4350, cat: "room" },
      { item: "Spa — Deep Tissue Massage", itemAr: "سبا — تدليك عميق", amount: 340, cat: "spa" },
      { item: "Restaurant — Room Service Dinner", itemAr: "مطعم — عشاء خدمة الغرف", amount: 210, cat: "food" },
    ] },
  { id: "B-9002", unitId: "P-102", unit: "Room 118", guest: "Priya Nair", day: 1, span: 2, residency: "short", payment: "checkin", channel: "Direct", device: "Website", folio: [
      { item: "Room Charge", itemAr: "رسوم الغرفة", amount: 840, cat: "room" },
      { item: "Gift Shop — Souvenirs", itemAr: "متجر الهدايا", amount: 65, cat: "shop" },
    ] },
  { id: "B-9003", unitId: "P-304", unit: "Bunk Bay", guest: "Tomasz Kwiat", day: 2, span: 4, residency: "short", payment: "gateway", channel: "Expedia", device: "Mobile App", folio: [
      { item: "Room Charge", itemAr: "رسوم الغرفة", amount: 152, cat: "room" },
    ] },
  { id: "B-9004", unitId: "P-405", unit: "Residence 7", guest: "Al Mutairi Family", day: 0, span: 7, residency: "long", payment: "checkin", channel: "Direct", device: "Desktop", folio: [
      { item: "Monthly Lease Installment", itemAr: "قسط الإيجار الشهري", amount: 28500, cat: "room" },
      { item: "Pool Maintenance Add-on", itemAr: "إضافة صيانة المسبح", amount: 450, cat: "spa" },
    ] },
  { id: "B-9005", unitId: "P-506", unit: "Loft 6B", guest: "Farah Zidane", day: 3, span: 2, residency: "long", payment: "gateway", channel: "Booking.com", device: "Mobile App", folio: [
      { item: "Monthly Lease Installment", itemAr: "قسط الإيجار الشهري", amount: 18200, cat: "room" },
    ] },
  { id: "B-9006", unitId: "P-607", unit: "Unit C", guest: "Henrik Solberg", day: 4, span: 3, residency: "short", payment: "gateway", channel: "Direct", device: "Website", folio: [
      { item: "Room Charge", itemAr: "رسوم الغرفة", amount: 570, cat: "room" },
      { item: "Restaurant — Breakfast x3", itemAr: "مطعم — إفطار × 3", amount: 96, cat: "food" },
    ] },
];

const LEDGER = [
  { id: "L-01", property: "Sakan Bay Hotel", amount: 38940, date: "2026-06-24", status: "paid" },
  { id: "L-02", property: "Palm Villa Residence 7", amount: 27075, date: "2026-06-25", status: "paid" },
  { id: "L-03", property: "Cedar Hills Chalet", amount: 6120, date: "2026-06-29", status: "pending" },
];
const INVOICES = [
  { id: "I-01", property: "Downtown Loft 6B", amount: 1820, date: "2026-06-18", status: "overdue" },
  { id: "I-02", property: "Old Town Hostel — Bunk Bay", amount: 210, date: "2026-06-27", status: "pending" },
  { id: "I-03", property: "Marina Bedrooms — Unit C", amount: 340, date: "2026-06-28", status: "paid" },
];

const REVIEWS = [
  { id: "R-1", guest: "Adrian Vance", guestAr: "أدريان فانس", property: "Sakan Bay Hotel", rating: 5, channel: "Booking.com",
    text: "Impeccable service and the room was spotless on arrival. The spa credit was a lovely touch.",
    textAr: "خدمة لا تشوبها شائبة والغرفة كانت نظيفة تماماً عند الوصول. رصيد السبا كان لمسة رائعة.",
    date: "2026-06-20", replied: false },
  { id: "R-2", guest: "Priya Nair", guestAr: "بريا ناير", property: "Sakan Bay Hotel", rating: 3, channel: "Direct",
    text: "Good location but housekeeping was late on day two and the gift shop was overpriced.",
    textAr: "الموقع جيد لكن التدبير المنزلي تأخر في اليوم الثاني وأسعار متجر الهدايا مرتفعة.",
    date: "2026-06-22", replied: true, reply: "Thank you for the honest feedback — we've retrained the turnover team for faster same-day service." },
  { id: "R-3", guest: "Farah Zidane", guestAr: "فرح زيدان", property: "Downtown Loft 6B", rating: 4, channel: "Booking.com",
    text: "Great long-term stay, the lease process through the platform was smooth from day one.",
    textAr: "إقامة طويلة رائعة، وكانت عملية الإيجار عبر المنصة سلسة منذ اليوم الأول.",
    date: "2026-06-15", replied: false },
  { id: "R-4", guest: "Henrik Solberg", guestAr: "هنريك سولبرغ", property: "Marina Bedrooms — Unit C", rating: 5, channel: "Direct",
    text: "Accessible room was thoughtfully designed. Breakfast add-on to the folio was seamless.",
    textAr: "الغرفة المخصصة لذوي الاحتياجات مصممة بعناية. إضافة الإفطار إلى الفاتورة كانت سلسة.",
    date: "2026-06-27", replied: false },
];

/* ------------------------------- contexts -------------------------------- */
const LangContext = createContext(null);
const useLang = () => useContext(LangContext);

function fmtMoney(n, currency = "AED", lang = "en") {
  try {
    return new Intl.NumberFormat(lang === "ar" ? "ar-AE" : "en-AE", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${n} ${currency}`;
  }
}

const STATUS_STYLES = {
  clean: { bg: "bg-[#E3FBEF]", text: "text-[#0F9D58]", dot: "bg-[#17C964]", ring: "ring-[#17C964]/30", icon: ShieldCheck },
  dirty: { bg: "bg-[#FFE9DE]", text: "text-[#E8590C]", dot: "bg-[#FF6B35]", ring: "ring-[#FF6B35]/30", icon: Droplets },
  maintenance: { bg: "bg-[#EAEBE6]", text: "text-[#4F5866]", dot: "bg-[#6B7280]", ring: "ring-[#6B7280]/30", icon: Wrench },
};

function StatusBadge({ status, size = "sm" }) {
  const t = useLang();
  const s = STATUS_STYLES[status];
  const Icon = s.icon;
  const pad = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ring-1 ${s.bg} ${s.text} ${s.ring} ${pad}`}>
      <Icon size={size === "sm" ? 11 : 13} strokeWidth={2.3} />
      {t.status[status]}
    </span>
  );
}

/* The signature "Room Key" tab used on property cards and sidebar */
function KeyTab({ status }) {
  const s = STATUS_STYLES[status];
  return (
    <div className={`absolute top-3 end-[-6px] h-8 w-3 rounded-s-sm ${s.dot} shadow-[0_1px_2px_rgba(0,0,0,0.25)]`} />
  );
}

/* ------------------------------- shell bits ------------------------------- */
function Sidebar({ view, setView, lang }) {
  const t = useLang();
  const items = [
    { key: "overview", label: t.nav.overview, icon: LayoutDashboard },
    { key: "timeline", label: t.nav.timeline, icon: CalendarClock },
    { key: "availability", label: t.nav.availability, icon: DoorOpen },
    { key: "setup", label: t.nav.setup, icon: Building2 },
    { key: "financials", label: t.nav.financials, icon: Wallet },
    { key: "reviews", label: t.nav.reviews, icon: Star },
  ];
  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col bg-[#28374A] text-[#E9E4D5]">
      <div className="flex flex-col items-start gap-2 px-6 py-6 border-b border-white/10">
        <img src={lang === "ar" ? LOGO_AR : LOGO_EN} alt={t.brand} className="h-9 w-auto" />
        <p className="text-[11px] tracking-[0.14em] uppercase text-[#D6CA85]">{t.brandSub}</p>
      </div>
      <nav className="flex-1 px-3 py-5 space-y-1">
        {items.map((it) => {
          const active = view === it.key;
          const Icon = it.icon;
          return (
            <button
              key={it.key}
              onClick={() => setView(it.key)}
              className={`relative w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-start transition-colors
                ${active ? "bg-white/10 text-white" : "text-[#A79C87] hover:bg-white/5 hover:text-white"}`}
            >
              {active && <span className="absolute inset-y-1 start-0 w-1 rounded-full bg-[#D6CA85]" />}
              <Icon size={18} strokeWidth={2} className="shrink-0" />
              <span className="leading-tight">{it.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="px-6 py-5 border-t border-white/10 text-[11px] text-[#8B8170]">
        <p>{t.brand} · {new Date().getFullYear()}</p>
      </div>
    </aside>
  );
}

function Topbar({ lang, setLang }) {
  const t = useLang();
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[#E5DFD1] bg-[#F7F5F0]/90 backdrop-blur px-4 sm:px-8 py-4">
      <img src={lang === "ar" ? LOGO_AR_DARK : LOGO_EN_DARK} alt={t.brand} className="h-6 w-auto lg:hidden shrink-0" />
      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-[#5B6472]" />
        <input
          placeholder={t.search}
          className="w-full rounded-full border border-[#E5DFD1] bg-white ps-9 pe-4 py-2.5 text-sm text-[#1E2A38] placeholder:text-[#8993A0] outline-none focus:ring-2 focus:ring-[#7C7340]/40"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          className="flex items-center gap-1.5 rounded-full border border-[#E5DFD1] bg-white px-3.5 py-2 text-xs font-medium text-[#1E2A38] hover:border-[#7C7340] transition-colors"
        >
          <Globe size={14} />
          {t.langToggle}
        </button>
        <button className="relative grid h-9 w-9 place-items-center rounded-full border border-[#E5DFD1] bg-white hover:border-[#7C7340] transition-colors">
          <Bell size={16} className="text-[#1E2A38]" />
          <span className="absolute top-1.5 end-1.5 h-2 w-2 rounded-full bg-[#FF6B35]" />
        </button>
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#E5DFD1] bg-white ps-1 pe-3 py-1">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-[#754437] text-[10px] font-semibold text-white">LH</div>
          <span className="text-xs font-medium text-[#1E2A38]">Layla Haddad</span>
        </div>
      </div>
    </header>
  );
}

function MobileNav({ view, setView }) {
  const t = useLang();
  const items = [
    { key: "overview", icon: LayoutDashboard },
    { key: "timeline", icon: CalendarClock },
    { key: "availability", icon: DoorOpen },
    { key: "setup", icon: Building2 },
    { key: "financials", icon: Wallet },
    { key: "reviews", icon: Star },
  ];
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex items-center justify-around border-t border-[#E5DFD1] bg-white px-2 py-2">
      {items.map((it) => {
        const Icon = it.icon;
        const active = view === it.key;
        return (
          <button key={it.key} onClick={() => setView(it.key)} className="flex flex-col items-center gap-1 px-2 py-1">
            <Icon size={18} className={active ? "text-[#754437]" : "text-[#8993A0]"} />
            <span className={`text-[9px] leading-none ${active ? "text-[#754437] font-medium" : "text-[#8993A0]"}`}>
              {t.nav[it.key].split(" ")[0]}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/* --------------------------------- View 1 --------------------------------- */
function KpiCard({ icon: Icon, label, value, trend, accent }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E5DFD1] bg-white shadow-[0_1px_2px_rgba(16,14,28,0.04)] p-5">
      <div className="flex items-start justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-lg ${accent}`}>
          <Icon size={18} className="text-white" strokeWidth={2.2} />
        </div>
        {trend != null && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${trend >= 0 ? "text-[#0F9D58]" : "text-[#FF6B35]"}`}>
            {trend >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl text-[#1E2A38] tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-[#5B6472]">{label}</p>
    </div>
  );
}

function AlertBanner({ lang, dismissed, onDismiss }) {
  const t = useLang();
  if (dismissed) return null;
  const msg = t.alerts.occDrop.replace("{p}", lang === "ar" ? "شاليه سيدر هيلز" : "Cedar Hills Chalet").replace("{n}", "18");
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#B7B29C] bg-[#E9E6DC] px-4 py-3.5">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#7C7340] text-white">
        <AlertTriangle size={15} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-[#4A4838]">{t.alerts.title}</p>
        <p className="text-sm text-[#28374A] mt-0.5">{msg}</p>
      </div>
      <button onClick={onDismiss} className="text-[#5B6472] hover:text-[#1E2A38] p-1">
        <X size={16} />
      </button>
    </div>
  );
}

function PerformanceChart() {
  const t = useLang();
  return (
    <div className="rounded-2xl border border-[#E5DFD1] bg-white shadow-[0_1px_2px_rgba(16,14,28,0.04)] p-5">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="font-display text-lg text-[#1E2A38]">{t.chart.title}</h3>
          <p className="text-xs text-[#5B6472] mt-0.5">{t.chart.sub}</p>
        </div>
        <Sparkles size={16} className="text-[#7C7340]" />
      </div>
      <div className="h-72 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={CHART_DATA} margin={{ left: -18, right: 8, top: 8 }}>
            <CartesianGrid stroke="#EDE8DC" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#5B6472" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#5B6472" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#5B6472" }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E5DFD1", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar yAxisId="left" dataKey="revenue" name={t.chart.revenue} fill="#754437" radius={[4, 4, 0, 0]} barSize={22} />
            <Line yAxisId="right" type="monotone" dataKey="occupancy" name={t.chart.occupancy} stroke="#7C7340" strokeWidth={2.5} dot={{ r: 3, fill: "#7C7340" }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function OverviewView({ lang }) {
  const t = useLang();
  const [dismissed, setDismissed] = useState(false);
  return (
    <div className="space-y-5">
      <AlertBanner lang={lang} dismissed={dismissed} onDismiss={() => setDismissed(true)} />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={ClipboardList} label={t.kpi.totalBookings} value="214" trend={8} accent="bg-[#754437]" />
        <KpiCard icon={Users} label={t.kpi.activeGuests} value="86" trend={4} accent="bg-[#9A6152]" />
        <KpiCard icon={DollarSign} label={t.kpi.grossRevenue} value={fmtMoney(383550, "AED", lang)} trend={12} accent="bg-[#7C7340]" />
        <KpiCard icon={Wallet} label={t.kpi.heldCommission} value={fmtMoney(46020, "AED", lang)} trend={-3} accent="bg-[#6B7280]" />
      </div>
      <PerformanceChart />
      <div className="rounded-2xl border border-[#E5DFD1] bg-white shadow-[0_1px_2px_rgba(16,14,28,0.04)] p-5">
        <h3 className="font-display text-lg text-[#1E2A38] mb-3">{t.quick.title}</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <button className="flex items-center gap-3 rounded-lg border border-[#E5DFD1] px-4 py-3.5 text-sm font-medium text-[#1E2A38] hover:border-[#7C7340] hover:bg-[#F3EFE6] transition-colors">
            <PlusCircle size={17} className="text-[#754437]" /> {t.quick.addProperty}
          </button>
          <button className="flex items-center gap-3 rounded-lg border border-[#E5DFD1] px-4 py-3.5 text-sm font-medium text-[#1E2A38] hover:border-[#7C7340] hover:bg-[#F3EFE6] transition-colors">
            <SlidersHorizontal size={17} className="text-[#754437]" /> {t.quick.adjustPricing}
          </button>
          <button className="flex items-center gap-3 rounded-lg border border-[#E5DFD1] px-4 py-3.5 text-sm font-medium text-[#1E2A38] hover:border-[#7C7340] hover:bg-[#F3EFE6] transition-colors">
            <CalendarClock size={17} className="text-[#754437]" /> {t.quick.manualBooking}
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- View 2 --------------------------------- */
function BookingModal({ booking, onClose, lang, statuses, setStatus }) {
  const t = useLang();
  if (!booking) return null;
  const prop = PROPERTIES.find((p) => p.id === booking.unitId);
  const total = booking.folio.reduce((s, f) => s + f.amount, 0);
  const currentStatus = statuses[booking.unitId];
  const catIcon = { room: BedDouble, spa: Waves, food: Coffee, shop: ShoppingBag };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-6" onClick={onClose}>
      <div
        className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-[#5B6472]">{booking.id}</p>
            <h3 className="font-display text-xl text-[#1E2A38]">{lang === "ar" ? prop?.nameAr : prop?.name}</h3>
          </div>
          <button onClick={onClose} className="text-[#5B6472] hover:text-[#1E2A38]"><X size={18} /></button>
        </div>

        <div className="mb-4">
          <StatusBadge status={currentStatus} size="md" />
        </div>

        <section className="grid grid-cols-2 gap-4 mb-5 text-sm">
          <div>
            <p className="text-[11px] uppercase text-[#5B6472] mb-1">{t.modal.guestInfo}</p>
            <p className="font-medium text-[#1E2A38]">{booking.guest}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase text-[#5B6472] mb-1">{t.modal.residencyType}</p>
            <p className="font-medium text-[#1E2A38]">{t.residency[booking.residency]}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase text-[#5B6472] mb-1">{t.modal.paymentMethod}</p>
            <p className="font-medium text-[#1E2A38]">{t.payment[booking.payment]}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase text-[#5B6472] mb-1">{t.modal.nights}</p>
            <p className="font-medium text-[#1E2A38]">{booking.span}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[11px] uppercase text-[#5B6472] mb-1">{t.modal.searchMeta}</p>
            <p className="text-[#4F5866]">{t.modal.channel}: <span className="font-medium text-[#1E2A38]">{booking.channel}</span> · {t.modal.device}: <span className="font-medium text-[#1E2A38]">{booking.device}</span></p>
          </div>
        </section>

        <section className="mb-5">
          <p className="text-[11px] uppercase text-[#5B6472] mb-2">{t.modal.folio}</p>
          <div className="rounded-lg border border-[#E5DFD1] divide-y divide-[#EDE8DC]">
            {booking.folio.map((f, i) => {
              const Icon = catIcon[f.cat] || FileText;
              return (
                <div key={i} className="flex items-center justify-between px-3.5 py-2.5">
                  <span className="flex items-center gap-2 text-sm text-[#1E2A38]">
                    <Icon size={14} className="text-[#5B6472]" />
                    {lang === "ar" ? f.itemAr : f.item}
                  </span>
                  <span className="text-sm font-medium tabular-nums text-[#1E2A38]">{fmtMoney(f.amount, prop?.currency, lang)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between px-1 pt-2.5">
            <span className="text-sm font-semibold text-[#1E2A38]">{t.modal.folioTotal}</span>
            <span className="font-display text-lg text-[#754437]">{fmtMoney(total, prop?.currency, lang)}</span>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2">
          {["clean", "dirty", "maintenance"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(booking.unitId, s)}
              className={`rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors
                ${currentStatus === s ? `${STATUS_STYLES[s].bg} ${STATUS_STYLES[s].text} border-transparent` : "border-[#E5DFD1] text-[#4F5866] hover:border-[#7C7340]"}`}
            >
              {t.statusVerb[s]}
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}

function TimelineView({ lang }) {
  const t = useLang();
  const [statuses, setStatuses] = useState(() => Object.fromEntries(PROPERTIES.map((p) => [p.id, p.status])));
  const [active, setActive] = useState(null);
  const days = lang === "ar"
    ? ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const setStatus = (unitId, s) => setStatuses((prev) => ({ ...prev, [unitId]: s }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-[#1E2A38]">{t.timeline.title}</h2>
          <p className="text-xs text-[#5B6472] mt-0.5">{t.timeline.sub}</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#4F5866]">
          <span className="text-[#5B6472]">{t.timeline.legend}:</span>
          {["clean", "dirty", "maintenance"].map((s) => (
            <span key={s} className="flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${STATUS_STYLES[s].dot}`} /> {t.status[s]}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5DFD1] bg-white shadow-[0_1px_2px_rgba(16,14,28,0.04)] overflow-x-auto">
        <div className="min-w-[820px]">
          <div className="grid grid-cols-[180px_repeat(7,1fr)] border-b border-[#EDE8DC] bg-[#F8F6F1]">
            <div className="px-4 py-3 text-[11px] font-semibold uppercase text-[#5B6472]">{t.common.unit}</div>
            {days.map((d) => (
              <div key={d} className="px-2 py-3 text-center text-[11px] font-semibold uppercase text-[#5B6472]">{d}</div>
            ))}
          </div>
          {PROPERTIES.map((p) => {
            const bks = BOOKINGS.filter((b) => b.unitId === p.id);
            const s = statuses[p.id];
            return (
              <div key={p.id} className="grid grid-cols-[180px_repeat(7,1fr)] border-b border-[#EDE8DC] last:border-0">
                <div className="relative flex flex-col justify-center gap-1 px-4 py-3 border-e border-[#EDE8DC]">
                  <p className="text-xs font-medium text-[#1E2A38] truncate">{lang === "ar" ? p.nameAr.split("—")[1] || p.nameAr : p.name.split("—")[1] || p.name}</p>
                  <StatusBadge status={s} />
                  <KeyTab status={s} />
                </div>
                <div className="col-span-7 relative grid grid-cols-7">
                  {days.map((_, i) => <div key={i} className="border-e border-[#ECE6D9] last:border-0 h-16" />)}
                  {bks.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setActive(b)}
                      style={{
                        gridColumnStart: b.day + 1,
                        gridColumnEnd: `span ${b.span}`,
                      }}
                      className={`absolute top-2 h-12 rounded-md ${STATUS_STYLES[s].bg} ${STATUS_STYLES[s].text} ring-1 ${STATUS_STYLES[s].ring} px-2.5 flex flex-col justify-center text-start hover:brightness-95 transition`}
                    >
                      <span className="text-[11px] font-semibold truncate">{b.guest}</span>
                      <span className="text-[10px] opacity-80 truncate">{b.channel}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BookingModal booking={active} onClose={() => setActive(null)} lang={lang} statuses={statuses} setStatus={setStatus} />
    </div>
  );
}

/* ------------------------------ Availability ------------------------------ */
function Switch({ on, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative h-6 w-11 shrink-0 overflow-hidden rounded-full transition-colors ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${on ? "bg-[#754437]" : "bg-[#DAD5C8]"}`}
    >
      <span className={`absolute top-0.5 start-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-[20px] rtl:-translate-x-[20px]" : "translate-x-0"}`} />
    </button>
  );
}

function AvailabilityRow({ p, lang, mode, setMode, manualOpen, toggleManual, housekeeping }) {
  const t = useLang();
  const isOpen = mode === "auto" ? housekeeping !== "maintenance" : manualOpen;
  const closedReason = mode === "auto" ? t.availability.closedAuto : t.availability.closedManual;
  const rawName = lang === "ar" ? p.nameAr : p.name;
  const unitName = (rawName.includes("—") ? rawName.split("—")[1] : rawName).trim();

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#E5DFD1] px-4 py-3.5">
      <div className="flex-1 min-w-[160px]">
        <p className="text-sm font-semibold text-[#1E2A38] truncate">{unitName}</p>
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          <StatusBadge status={housekeeping} />
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${isOpen ? "bg-[#E3FBEF] text-[#0F9D58]" : "bg-[#FFE9DE] text-[#E8590C]"}`}>
            {isOpen ? <DoorOpen size={11} strokeWidth={2.3} /> : <DoorClosed size={11} strokeWidth={2.3} />}
            {isOpen ? t.availability.open : closedReason}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex rounded-lg border border-[#E5DFD1] p-1 bg-[#F8F6F1]">
          <button
            onClick={() => setMode("auto")}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors ${mode === "auto" ? "bg-[#754437] text-white" : "text-[#4F5866]"}`}
          >
            <Zap size={12} /> {t.availability.auto}
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors ${mode === "manual" ? "bg-[#754437] text-white" : "text-[#4F5866]"}`}
          >
            <Hand size={12} /> {t.availability.manual}
          </button>
        </div>
        <Switch on={isOpen} disabled={mode === "auto"} onClick={toggleManual} />
      </div>
    </div>
  );
}

function AvailabilityView({ lang }) {
  const t = useLang();
  const [modes, setModes] = useState(() => Object.fromEntries(PROPERTIES.map((p) => [p.id, "auto"])));
  const [manualOpen, setManualOpen] = useState(() => Object.fromEntries(PROPERTIES.map((p) => [p.id, true])));
  const housekeeping = useMemo(() => Object.fromEntries(PROPERTIES.map((p) => [p.id, p.status])), []);

  const setMode = (id, m) => setModes((prev) => ({ ...prev, [id]: m }));
  const toggleManual = (id) => setManualOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  const isUnitOpen = (p) => (modes[p.id] === "auto" ? housekeeping[p.id] !== "maintenance" : manualOpen[p.id]);

  const groups = useMemo(() => {
    const map = new Map();
    PROPERTIES.forEach((p) => {
      const key = p.name.includes("—") ? p.name.split("—")[0].trim() : p.name;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    });
    return Array.from(map.entries());
  }, []);

  const setGroup = (units, open) => {
    setModes((prev) => {
      const next = { ...prev };
      units.forEach((u) => { next[u.id] = "manual"; });
      return next;
    });
    setManualOpen((prev) => {
      const next = { ...prev };
      units.forEach((u) => { next[u.id] = open; });
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl text-[#1E2A38]">{t.availability.title}</h2>
        <p className="text-xs text-[#5B6472] mt-0.5">{t.availability.sub}</p>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 rounded-lg border border-[#E5DFD1] bg-white px-4 py-3">
        <span className="flex items-center gap-1.5 text-[11px] text-[#4F5866]">
          <Zap size={12} className="text-[#7C7340]" /> <b className="text-[#1E2A38]">{t.availability.auto}:</b> {t.availability.autoDesc}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#4F5866]">
          <Hand size={12} className="text-[#754437]" /> <b className="text-[#1E2A38]">{t.availability.manual}:</b> {t.availability.manualDesc}
        </span>
      </div>

      <div className="space-y-4">
        {groups.map(([key, units]) => {
          const openCount = units.filter(isUnitOpen).length;
          const allOpen = openCount === units.length;
          const rawGroupLabel = lang === "ar" ? units[0].nameAr : key;
          const groupLabel = (lang === "ar" && rawGroupLabel.includes("—") ? rawGroupLabel.split("—")[0] : rawGroupLabel).trim();
          return (
            <div key={key} className="rounded-2xl border border-[#E5DFD1] bg-white shadow-[0_1px_2px_rgba(16,14,28,0.04)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-display text-base text-[#1E2A38]">{groupLabel}</h3>
                  {units.length > 1 && (
                    <p className="text-[11px] text-[#5B6472] mt-0.5">
                      {allOpen ? t.availability.allOpen : t.availability.unitsClosed.replace("{n}", units.length - openCount).replace("{t}", units.length)}
                    </p>
                  )}
                </div>
                {units.length > 1 && (
                  <button
                    onClick={() => setGroup(units, !allOpen)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
                      allOpen
                        ? "border-[#B7B29C] text-[#55523F] hover:bg-[#E9E6DC]"
                        : "border-[#E5DFD1] text-[#754437] hover:bg-[#F3EFE6]"
                    }`}
                  >
                    {allOpen ? <DoorClosed size={14} /> : <DoorOpen size={14} />}
                    {allOpen ? t.availability.closeProperty : t.availability.openProperty}
                  </button>
                )}
              </div>
              <div className="space-y-2.5">
                {units.map((p) => (
                  <AvailabilityRow
                    key={p.id}
                    p={p}
                    lang={lang}
                    mode={modes[p.id]}
                    setMode={(m) => setMode(p.id, m)}
                    manualOpen={manualOpen[p.id]}
                    toggleManual={() => toggleManual(p.id)}
                    housekeeping={housekeeping[p.id]}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------------- View 3 --------------------------------- */
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-[#4F5866] mb-1.5">{label}</span>
      {children}
    </label>
  );
}
const inputCls = "w-full rounded-lg border border-[#E5DFD1] bg-white px-3.5 py-2.5 text-sm text-[#1E2A38] outline-none focus:ring-2 focus:ring-[#7C7340]/40 focus:border-[#7C7340]";

function SetupView({ lang }) {
  const t = useLang();
  const [propType, setPropType] = useState("Hotel");
  const [residency, setResidency] = useState("short");
  const [status, setStatus] = useState("clean");

  const label = (obj, arObj, val) => (lang === "ar" ? arObj[val] : val);

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-5">
      <div className="rounded-2xl border border-[#E5DFD1] bg-white shadow-[0_1px_2px_rgba(16,14,28,0.04)] p-6">
        <h2 className="font-display text-xl text-[#1E2A38]">{t.setup.title}</h2>
        <p className="text-xs text-[#5B6472] mt-1 mb-6">{t.setup.sub}</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t.setup.name}>
            <input className={inputCls} placeholder="Sakan Bay Hotel — Room 512" />
          </Field>
          <Field label={t.setup.propertyType}>
            <select className={inputCls} value={propType} onChange={(e) => setPropType(e.target.value)}>
              {PROPERTY_TYPES.map((pt) => (
                <option key={pt} value={pt}>{label(null, PROPERTY_TYPES_AR, pt)}</option>
              ))}
            </select>
          </Field>

          <Field label={t.setup.tierLayout}>
            <select className={inputCls}>
              {TIERS.map((x) => <option key={x} value={x}>{label(null, TIERS_AR, x)}</option>)}
            </select>
          </Field>
          <Field label={t.setup.occupancy}>
            <select className={inputCls}>
              {OCCUPANCY.map((x) => <option key={x} value={x}>{label(null, OCCUPANCY_AR, x)}</option>)}
            </select>
          </Field>

          <Field label={t.setup.specialty}>
            <select className={inputCls}>
              <option value="">—</option>
              {SPECIALTY.map((x) => <option key={x} value={x}>{label(null, SPECIALTY_AR, x)}</option>)}
            </select>
          </Field>
          <Field label={t.setup.area}>
            <div className="relative">
              <Ruler size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-[#8993A0]" />
              <input type="number" defaultValue={62} className={`${inputCls} ps-9`} />
            </div>
          </Field>

          <Field label={t.setup.location}>
            <div className="relative">
              <MapPin size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-[#8993A0]" />
              <input className={`${inputCls} ps-9`} placeholder="Jumeirah Coast, Dubai" />
            </div>
          </Field>
          <Field label={t.setup.hostContact}>
            <div className="relative">
              <Phone size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-[#8993A0]" />
              <input className={`${inputCls} ps-9`} placeholder="+971 50 000 0000" />
            </div>
          </Field>
        </div>

        <div className="mt-5">
          <Field label={t.setup.amenities}>
            <input className={inputCls} placeholder="Pool, Sea View, Kitchenette, Balcony…" />
          </Field>
        </div>

        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          <Field label={t.setup.initialStatus}>
            <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value)}>
              {["clean", "dirty", "maintenance"].map((s) => <option key={s} value={s}>{t.status[s]}</option>)}
            </select>
          </Field>

          <div>
            <span className="block text-xs font-medium text-[#4F5866] mb-1.5">{t.setup.residencySwitch}</span>
            <div className="flex rounded-lg border border-[#E5DFD1] p-1 bg-[#F8F6F1]">
              {["short", "long"].map((r) => (
                <button
                  key={r}
                  onClick={() => setResidency(r)}
                  className={`flex-1 rounded-md py-2 text-xs font-medium transition-colors ${residency === r ? "bg-[#754437] text-white" : "text-[#4F5866]"}`}
                >
                  {t.residency[r]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          {residency === "short" ? (
            <>
              <Field label={t.setup.rateShort}><input type="number" defaultValue={420} className={inputCls} /></Field>
              <Field label={t.setup.overbooking}><input type="number" defaultValue={2} className={inputCls} /></Field>
            </>
          ) : (
            <>
              <Field label={t.setup.rateLong}><input type="number" defaultValue={18200} className={inputCls} /></Field>
              <Field label={t.setup.leaseTerm}><input type="number" defaultValue={6} className={inputCls} /></Field>
            </>
          )}
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div>
            <span className="block text-xs font-medium text-[#4F5866] mb-1.5">{t.setup.logo}</span>
            <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#E5DFD1] py-6 text-[#8993A0] hover:border-[#7C7340] transition-colors cursor-pointer">
              <Upload size={16} /> <span className="text-xs">{t.setup.dropHint}</span>
            </div>
          </div>
          <div>
            <span className="block text-xs font-medium text-[#4F5866] mb-1.5">{t.setup.gallery}</span>
            <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#E5DFD1] py-6 text-[#8993A0] hover:border-[#7C7340] transition-colors cursor-pointer">
              <ImagePlus size={16} /> <span className="text-xs">{t.setup.dropHint}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-lg bg-[#F3EFE6] border border-[#E4DAC8] px-3.5 py-3 text-xs text-[#28374A]">
          <ExternalLink size={14} className="mt-0.5 shrink-0" />
          {t.setup.syncNote}
        </div>

        <button className="mt-6 w-full sm:w-auto rounded-lg bg-[#754437] px-6 py-3 text-sm font-medium text-white shadow-[0_8px_20px_-6px_rgba(91,59,255,0.55)] hover:bg-[#5E362B] hover:shadow-[0_10px_24px_-6px_rgba(91,59,255,0.65)] transition-all">
          {t.setup.save}
        </button>
      </div>

      <div className="rounded-2xl border border-[#E5DFD1] bg-white shadow-[0_1px_2px_rgba(16,14,28,0.04)] p-5 h-fit">
        <h3 className="font-display text-base text-[#1E2A38] mb-3">{t.setup.currentListings}</h3>
        <div className="space-y-2.5 max-h-[640px] overflow-y-auto">
          {PROPERTIES.map((p) => (
            <div key={p.id} className="relative overflow-hidden rounded-lg border border-[#E5DFD1] px-3.5 py-3">
              <KeyTab status={p.status} />
              <p className="text-xs font-semibold text-[#1E2A38] truncate pe-2">{lang === "ar" ? p.nameAr : p.name}</p>
              <p className="text-[11px] text-[#5B6472] mt-0.5">{label(null, PROPERTY_TYPES_AR, p.type)} · {p.area} {t.common.area === "Area" ? "m²" : "م²"}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <StatusBadge status={p.status} />
                <span className="text-xs font-medium text-[#754437] tabular-nums">
                  {fmtMoney(p.price, p.currency, lang)}{p.residency === "short" ? t.common.perNight : t.common.perMonth}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- View 4 --------------------------------- */
function ChannelCard({ ch, lang, connected, toggle }) {
  const t = useLang();
  const on = connected;
  return (
    <div className="rounded-lg border border-[#E5DFD1] px-4 py-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`grid h-9 w-9 place-items-center rounded-lg ${on ? "bg-[#E3FBEF] text-[#0F9D58]" : "bg-[#EFEAE0] text-[#8993A0]"}`}>
            {on ? <Wifi size={16} /> : <WifiOff size={16} />}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1E2A38]">{ch.name}{ch.direct && <span className="ms-1.5 rounded-full bg-[#E9E6DC] text-[#55523F] text-[10px] px-1.5 py-0.5 align-middle">{lang === "ar" ? "بدون عمولة" : "Commission-free"}</span>}</p>
            <p className="text-[11px] text-[#5B6472] mt-0.5">{t.financials.lastSync}: {on ? (lang === "ar" ? ch.lastSyncAr : ch.lastSync) : t.financials.neverSynced}</p>
          </div>
        </div>
        <button
          onClick={() => toggle(ch.id)}
          className={`relative h-6 w-11 shrink-0 overflow-hidden rounded-full transition-colors ${on ? "bg-[#754437]" : "bg-[#DAD5C8]"}`}
        >
          <span className={`absolute top-0.5 start-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-[20px] rtl:-translate-x-[20px]" : "translate-x-0"}`} />
        </button>
      </div>
    </div>
  );
}

function LedgerTable({ rows, cols, lang }) {
  const t = useLang();
  const badge = { paid: "bg-[#E3FBEF] text-[#0F9D58]", pending: "bg-[#E9E6DC] text-[#55523F]", overdue: "bg-[#FFE9DE] text-[#E8590C]" };
  return (
    <div className="overflow-x-auto rounded-lg border border-[#E5DFD1]">
      <table className="w-full text-sm">
        <thead className="bg-[#F8F6F1] text-[11px] uppercase text-[#5B6472]">
          <tr>
            <th className="text-start px-4 py-2.5 font-semibold">{t.financials.property}</th>
            <th className="text-start px-4 py-2.5 font-semibold">{t.financials.amount}</th>
            <th className="text-start px-4 py-2.5 font-semibold">{t.financials.date}</th>
            <th className="text-start px-4 py-2.5 font-semibold">{t.financials.statusCol}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-[#EDE8DC]">
              <td className="px-4 py-3 text-[#1E2A38] font-medium">{r.property}</td>
              <td className="px-4 py-3 tabular-nums">{fmtMoney(r.amount, "AED", lang)}</td>
              <td className="px-4 py-3 text-[#4F5866] tabular-nums">{r.date}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${badge[r.status]}`}>{t.financials[r.status]}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FinancialsView({ lang }) {
  const t = useLang();
  const [connected, setConnected] = useState(() => Object.fromEntries(OTA_CHANNELS.map((c) => [c.id, c.synced])));
  const toggle = (id) => setConnected((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl text-[#1E2A38]">{t.financials.title}</h2>
        <p className="text-xs text-[#5B6472] mt-0.5">{t.financials.sub}</p>
      </div>

      <div className="rounded-2xl border border-[#E5DFD1] bg-white shadow-[0_1px_2px_rgba(16,14,28,0.04)] p-5">
        <div className="flex items-center gap-2 mb-1">
          <RefreshCw size={15} className="text-[#754437]" />
          <h3 className="font-display text-lg text-[#1E2A38]">{t.financials.channelSync}</h3>
        </div>
        <p className="text-xs text-[#28374A] bg-[#F3EFE6] border border-[#E4DAC8] rounded-lg px-3.5 py-2.5 mt-3 mb-4">{t.financials.channelNote}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {OTA_CHANNELS.map((ch) => (
            <ChannelCard key={ch.id} ch={ch} lang={lang} connected={connected[ch.id]} toggle={toggle} />
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-[#E5DFD1] bg-white shadow-[0_1px_2px_rgba(16,14,28,0.04)] p-5">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={15} className="text-[#754437]" />
            <h3 className="font-display text-lg text-[#1E2A38]">{t.financials.ledger}</h3>
          </div>
          <p className="text-xs text-[#5B6472] mb-3">{t.financials.ledgerSub}</p>
          <LedgerTable rows={LEDGER} lang={lang} />
        </div>
        <div className="rounded-2xl border border-[#E5DFD1] bg-white shadow-[0_1px_2px_rgba(16,14,28,0.04)] p-5">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={15} className="text-[#754437]" />
            <h3 className="font-display text-lg text-[#1E2A38]">{t.financials.invoices}</h3>
          </div>
          <p className="text-xs text-[#5B6472] mb-3">{t.financials.invoicesSub}</p>
          <LedgerTable rows={INVOICES} lang={lang} />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- View 5 --------------------------------- */
function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={13} className={i <= rating ? "fill-[#7C7340] text-[#7C7340]" : "text-[#E1DED4]"} />
      ))}
    </div>
  );
}

function ReviewCard({ r, lang }) {
  const t = useLang();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replied, setReplied] = useState(r.replied);
  const [savedReply, setSavedReply] = useState(r.reply || "");

  return (
    <div className="rounded-lg border border-[#E5DFD1] p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#754437] text-[11px] font-semibold text-white">
            {(lang === "ar" ? r.guestAr : r.guest).split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1E2A38]">{lang === "ar" ? r.guestAr : r.guest}</p>
            <p className="text-[11px] text-[#5B6472]">{r.property} · {t.reviews.viewedOn} {r.channel} · {r.date}</p>
          </div>
        </div>
        <StarRow rating={r.rating} />
      </div>
      <p className="text-sm text-[#26333F] mt-3 leading-relaxed">{lang === "ar" ? r.textAr : r.text}</p>

      {replied && (
        <div className="mt-3 rounded-lg bg-[#F8F6F1] border border-[#EDE8DC] px-3.5 py-2.5">
          <p className="text-[11px] font-semibold text-[#754437] mb-1">{t.reviews.replied}</p>
          <p className="text-xs text-[#4F5866]">{savedReply}</p>
        </div>
      )}

      {!replied && !replying && (
        <button onClick={() => setReplying(true)} className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#754437] hover:underline">
          <MessageSquare size={13} /> {t.reviews.reply}
        </button>
      )}

      {!replied && replying && (
        <div className="mt-3 space-y-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={t.reviews.yourReply}
            rows={2}
            className="w-full rounded-lg border border-[#E5DFD1] px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#7C7340]/40"
          />
          <button
            onClick={() => { if (replyText.trim()) { setSavedReply(replyText.trim()); setReplied(true); setReplying(false); } }}
            className="rounded-lg bg-[#754437] px-4 py-2 text-xs font-medium text-white hover:bg-[#5E362B]"
          >
            {t.reviews.send}
          </button>
        </div>
      )}
    </div>
  );
}

function ReviewsView({ lang }) {
  const t = useLang();
  const avg = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);
  const respRate = Math.round((REVIEWS.filter((r) => r.replied).length / REVIEWS.length) * 100);
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl text-[#1E2A38]">{t.reviews.title}</h2>
        <p className="text-xs text-[#5B6472] mt-0.5">{t.reviews.sub}</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#E5DFD1] bg-white shadow-[0_1px_2px_rgba(16,14,28,0.04)] p-5 text-center">
          <p className="font-display text-3xl text-[#1E2A38]">{avg}</p>
          <div className="flex justify-center mt-1"><StarRow rating={Math.round(avg)} /></div>
          <p className="text-xs text-[#5B6472] mt-2">{t.reviews.avgRating}</p>
        </div>
        <div className="rounded-2xl border border-[#E5DFD1] bg-white shadow-[0_1px_2px_rgba(16,14,28,0.04)] p-5 text-center">
          <p className="font-display text-3xl text-[#1E2A38]">{REVIEWS.length}</p>
          <p className="text-xs text-[#5B6472] mt-2">{t.reviews.totalReviews}</p>
        </div>
        <div className="rounded-2xl border border-[#E5DFD1] bg-white shadow-[0_1px_2px_rgba(16,14,28,0.04)] p-5 text-center">
          <p className="font-display text-3xl text-[#1E2A38]">{respRate}%</p>
          <p className="text-xs text-[#5B6472] mt-2">{t.reviews.responseRate}</p>
        </div>
      </div>
      <div className="space-y-3">
        {REVIEWS.map((r) => <ReviewCard key={r.id} r={r} lang={lang} />)}
      </div>
    </div>
  );
}

/* ---------------------------------- App ----------------------------------- */
export default function App() {
  const [lang, setLang] = useState("en");
  const [view, setView] = useState("overview");
  const t = DICT[lang];

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  const views = {
    overview: <OverviewView lang={lang} />,
    timeline: <TimelineView lang={lang} />,
    availability: <AvailabilityView lang={lang} />,
    setup: <SetupView lang={lang} />,
    financials: <FinancialsView lang={lang} />,
    reviews: <ReviewsView lang={lang} />,
  };

  return (
    <LangContext.Provider value={t}>
      <div dir={t.dir} className={`min-h-screen w-full bg-[#F7F5F0] ${lang === "ar" ? "font-ar" : "font-en"}`}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&family=Tajawal:wght@400;500;700&display=swap');
          .font-en { font-family: 'Inter', ui-sans-serif, system-ui; }
          .font-en .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui; letter-spacing: -0.01em; }
          .font-ar, .font-ar .font-display { font-family: 'Tajawal', ui-sans-serif, system-ui; }
          [dir="rtl"] svg.lucide-chevron-right, [dir="rtl"] svg.lucide-arrow-up-right, [dir="rtl"] svg.lucide-arrow-down-right { transform: scaleX(-1); }
        `}</style>

        <div className="flex">
          <Sidebar view={view} setView={setView} lang={lang} />
          <div className="flex-1 min-w-0">
            <Topbar lang={lang} setLang={setLang} />
            <main className="px-4 sm:px-8 py-6 pb-24 lg:pb-6 max-w-[1400px] mx-auto">
              {views[view]}
            </main>
          </div>
        </div>
        <MobileNav view={view} setView={setView} />
      </div>
    </LangContext.Provider>
  );
}
