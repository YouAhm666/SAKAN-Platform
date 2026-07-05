import { supabase } from "./supabaseClient.js";

/* ============================================================================
   Maps the dashboard's existing property-type vocabulary onto the narrower
   enum values allowed by the database schema. "Bedrooms" and "House" don't
   have their own database category yet, so they fold into the closest fit
   (apartment / villa) for now — worth a proper schema update later if you
   want those preserved exactly.
   ============================================================================ */
const PROPERTY_TYPE_TO_DB = {
  Hotel: "hotel",
  Hostel: "hostel",
  Villa: "villa",
  Chalet: "chalet",
  Apartment: "apartment",
  Bedrooms: "apartment",
  House: "villa",
};

const UNIT_TYPE_TO_DB = {
  hotel: "room",
  hostel: "room",
  villa: "whole_property",
  chalet: "chalet",
  apartment: "apartment",
};

/* Fetch every listing (unit + its parent property + current housekeeping
   status) that belongs to the signed-in owner. Returns [] if not signed in
   or if the owner has no listings yet. */
export async function fetchOwnerListings() {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from("units")
    .select(`
      id, name, name_ar, unit_type, size_sqm, base_price, currency,
      properties!inner ( id, name, name_ar, property_type, address, owner_id ),
      housekeeping_status ( status )
    `)
    .eq("properties.owner_id", user.id)
    .order("id", { ascending: true });

  if (error) throw error;

  return (data || []).map((u) => ({
    id: u.id,
    name: u.name,
    nameAr: u.name_ar || u.name,
    type: u.properties?.property_type || "hotel",
    area: u.size_sqm,
    location: u.properties?.address || "",
    price: u.base_price,
    currency: u.currency,
    status: u.housekeeping_status?.status || "clean",
    residency: "short",
  }));
}

/* Creates a new property + its first unit + an initial housekeeping status
   row, all linked together. Returns the created unit's id. */
export async function createListing({
  name, nameAr, propertyType, area, address, basePrice, currency, initialStatus,
}) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) throw new Error("You need to be signed in to add a property.");

  const dbPropertyType = PROPERTY_TYPE_TO_DB[propertyType] || "apartment";
  const dbUnitType = UNIT_TYPE_TO_DB[dbPropertyType] || "apartment";

  const { data: property, error: propError } = await supabase
    .from("properties")
    .insert({ owner_id: user.id, name, name_ar: nameAr || null, property_type: dbPropertyType, address: address || null })
    .select()
    .single();
  if (propError) throw propError;

  const { data: unit, error: unitError } = await supabase
    .from("units")
    .insert({
      property_id: property.id,
      name,
      name_ar: nameAr || null,
      unit_type: dbUnitType,
      size_sqm: area || null,
      base_price: basePrice || 0,
      currency: currency || "AED",
    })
    .select()
    .single();
  if (unitError) throw unitError;

  const { error: statusError } = await supabase
    .from("housekeeping_status")
    .insert({ unit_id: unit.id, status: initialStatus || "clean" });
  if (statusError) throw statusError;

  return unit.id;
}
