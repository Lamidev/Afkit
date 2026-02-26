
/**
 * Formats a long MongoDB ID or system ID into a premium, aesthetic SKU/Identifier
 * @param {string} id - The original ID
 * @param {string} prefix - The prefix to use (e.g., ORD, GAD, USR)
 * @returns {string} - The formatted ID
 */
export const formatAestheticId = (id, prefix = "AFK") => {
  if (!id) return "";
  const strId = id.toString();
  
  // If it already contains the prefix, just return it with #
  if (strId.toUpperCase().includes(`${prefix.toUpperCase()}-`)) {
    return strId.startsWith("#") ? strId : `#${strId}`;
  }
  
  // Keep it simple and premium: uppercase prefix + last 6 chars of ID
  const shortId = strId.slice(-6).toUpperCase();
  return `#${prefix}-${shortId}`;
};

/**
 * Formats currency to Naira with proper symbols and commas
 */
export const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("NGN", "₦");
};

/**
 * Creates a URL-friendly slug from a string
 */
export const createSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
};
/**
 * Logistics & Region Mapping - Standardized by Afkit Management
 * 1. Lagos: Free Home Delivery
 * 2. South-West: Free Car Park Delivery
 * 3. North/East/South-South: Free Airport Delivery
 */
export const REGION_MAPPING = {
  // LAGOS ZONE
  "Lagos": "lagos",
  
  // PARK ZONE (SOUTH-WEST / YORUBALAND)
  "Oyo": "park", "Ogun": "park", "Osun": "park", "Ondo": "park", "Ekiti": "park",
  
  // AIRPORT ZONE (NORTH / EAST / SOUTH-SOUTH)
  "Abia": "airport", "Anambra": "airport", "Ebonyi": "airport", "Enugu": "airport", "Imo": "airport",
  "Akwa Ibom": "airport", "Bayelsa": "airport", "Cross River": "airport", "Delta": "airport", "Edo": "airport", "Rivers": "airport",
  "FCT": "airport", "Adamawa": "airport", "Bauchi": "airport", "Benue": "airport", "Borno": "airport", "Gombe": "airport", "Jigawa": "airport", "Kaduna": "airport",
  "Kano": "airport", "Katsina": "airport", "Kebbi": "airport", "Kogi": "airport", "Kwara": "airport", "Nasarawa": "airport", "Niger": "airport", "Plateau": "airport",
  "Sokoto": "airport", "Taraba": "airport", "Yobe": "airport", "Zamfara": "airport"
};

/**
 * Returns simple, plain-English instructions for delivery based on state and preference.
 * Designed to be understood by everyone (10-70 years old).
 */
export const getDeliveryPolicy = (state, preference) => {
  if (!state) return null;
  const zone = REGION_MAPPING[state] || "airport";

  if (state === "Lagos") {
    return {
      title: "Free Home Delivery",
      description: "We will bring your gadget directly to your house for FREE.",
      feeLabel: "FREE",
      isFree: true
    };
  }

  const isHome = preference === "doorstep";

  if (zone === "park") {
    return {
      title: isHome ? "Deliver to My House" : "Pick up at the Park",
      description: isHome 
        ? "We send it to the nearest main motor park, then a local rider brings it to your house. Note: You will pay the rider for the local delivery." 
        : "We send it to the nearest main motor park for FREE. You go there to pick it up.",
      feeLabel: isHome ? "Pay Rider" : "FREE",
      isFree: !isHome
    };
  }

  // Airport Zone (Default for everything else)
  return {
    title: isHome ? "Deliver to My House" : "Pick up at the Airport",
    description: isHome 
      ? "We send it to the nearest airport hub, then a local rider brings it to your house. Note: You will pay the rider for the local delivery." 
      : "We send it to the nearest airport hub for FREE. You go there to pick it up.",
    feeLabel: isHome ? "Pay Rider" : "FREE",
    isFree: !isHome
  };
};

export const getRouteFromRegion = (region) => {
  if (!region) return "lagos";
  const normalized = region.toString().trim();
  return REGION_MAPPING[normalized] || "airport";
};
