
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
 * Logistics & Region Mapping
 */
export const REGION_MAPPING = {
  "Lagos": "lagos",
  "Oyo": "south-west", "Ogun": "south-west", "Osun": "south-west", "Ondo": "south-west", "Ekiti": "south-west",
  "Abia": "south-east-south", "Anambra": "south-east-south", "Ebonyi": "south-east-south", "Enugu": "south-east-south", "Imo": "south-east-south",
  "Akwa Ibom": "south-east-south", "Bayelsa": "south-east-south", "Cross River": "south-east-south", "Delta": "south-east-south", "Edo": "south-east-south", "Rivers": "south-east-south",
  "FCT": "north", "Adamawa": "north", "Bauchi": "north", "Benue": "north", "Borno": "north", "Gombe": "north", "Jigawa": "north", "Kaduna": "north",
  "Kano": "north", "Katsina": "north", "Kebbi": "north", "Kogi": "north", "Kwara": "north", "Nasarawa": "north", "Niger": "north", "Plateau": "north",
  "Sokoto": "north", "Taraba": "north", "Yobe": "north", "Zamfara": "north"
};

/**
 * Returns the logistics route key for a given state/region name
 * Case-insensitive and handles trimming to prevent falling back to 'lagos' incorrectly.
 * @param {string} region - State name
 * @returns {string} - Route key ('lagos', 'south-west', 'south-east-south', 'north')
 */
export const getRouteFromRegion = (region) => {
  if (!region) return "lagos";
  const normalized = region.toString().trim();
  
  // Direct match
  if (REGION_MAPPING[normalized]) return REGION_MAPPING[normalized];
  
  // Case-insensitive match
  const lowerRegion = normalized.toLowerCase();
  const match = Object.keys(REGION_MAPPING).find(key => key.toLowerCase() === lowerRegion);
  
  return match ? REGION_MAPPING[match] : "lagos";
};
