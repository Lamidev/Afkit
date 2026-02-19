
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
