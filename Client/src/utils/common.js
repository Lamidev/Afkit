
/**
 * Formats a long MongoDB ID or system ID into a premium, aesthetic SKU/Identifier
 * @param {string} id - The original ID
 * @param {string} prefix - The prefix to use (e.g., ORD, GAD, USR)
 * @returns {string} - The formatted ID
 */
export const formatAestheticId = (id, prefix = "AFK") => {
  if (!id) return "";
  // Keep it simple and premium: uppercase prefix + last 6 chars of ID
  const shortId = id.toString().slice(-6).toUpperCase();
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
