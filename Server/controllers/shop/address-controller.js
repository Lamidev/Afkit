const Address = require("../../models/address");

// Maps Nigerian state names to logistics route codes
const REGION_MAPPING = {
  "Lagos": "lagos",
  "Oyo": "south-west", "Ogun": "south-west", "Osun": "south-west", "Ondo": "south-west", "Ekiti": "south-west",
  "Abia": "south-east-south", "Anambra": "south-east-south", "Ebonyi": "south-east-south", "Enugu": "south-east-south", "Imo": "south-east-south",
  "Akwa Ibom": "south-east-south", "Bayelsa": "south-east-south", "Cross River": "south-east-south", "Delta": "south-east-south", "Edo": "south-east-south", "Rivers": "south-east-south",
  "FCT": "north", "Adamawa": "north", "Bauchi": "north", "Benue": "north", "Borno": "north", "Gombe": "north", "Jigawa": "north", "Kaduna": "north",
  "Kano": "north", "Katsina": "north", "Kebbi": "north", "Kogi": "north", "Kwara": "north", "Nasarawa": "north", "Niger": "north", "Plateau": "north",
  "Sokoto": "north", "Taraba": "north", "Yobe": "north", "Zamfara": "north"
};

const ROUTE_LABELS = {
  "lagos": "Lagos Doorstep",
  "south-west": "South-West Hub",
  "south-east-south": "Eastern/Southern Hub",
  "north": "Northern/Abuja Hub"
};

/**
 * Returns the logistics route key for a given state/region name
 * Case-insensitive and handles trimming to prevent falling back to 'lagos' incorrectly.
 */
const getRouteFromRegion = (region) => {
  if (!region) return "lagos";
  const normalized = region.toString().trim();
  
  // Direct match
  if (REGION_MAPPING[normalized]) return REGION_MAPPING[normalized];
  
  // Case-insensitive match
  const lowerRegion = normalized.toLowerCase();
  const match = Object.keys(REGION_MAPPING).find(key => key.toLowerCase() === lowerRegion);
  
  return match ? REGION_MAPPING[match] : "lagos";
};


const addAddress = async (req, res) => {
  try {
    const { userId, fullName, email, address, city, region, phone, backupPhone, notes, addressType } = req.body;
    // city is now optional — users may include it in the address string
    const requiredFields = { userId, fullName, email, address, region, phone };
    const missingFields = Object.keys(requiredFields).filter(key =>
      !requiredFields[key] || requiredFields[key] === "undefined" || (typeof requiredFields[key] === 'string' && !requiredFields[key].trim())
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing or invalid fields: ${missingFields.join(", ")}`,
      });
    }

    // Derive logistics route from state name
    const logisticsRoute = getRouteFromRegion(region);

    // Clear other last used flags for this user and type
    const flagToClear = addressType === "recipient" ? { isLastUsedRecipient: true } : { isLastUsed: true };
    const resetData = addressType === "recipient" ? { isLastUsedRecipient: false } : { isLastUsed: false };
    await Address.updateMany({ userId, ...flagToClear }, resetData);

    const newlyCreatedAddress = new Address({
      userId,
      fullName,
      email,
      address,
      city: city && !['Included', 'N/A', ''].includes(city.trim()) ? city.trim() : "",
      region,          // stores the human state name, e.g. "Lagos"
      logisticsRoute,  // stores the internal route key, e.g. "lagos"
      phone,
      backupPhone,
      notes,
      addressType: addressType || "personal",
      isLastUsed: addressType !== "recipient",
      isLastUsedRecipient: addressType === "recipient"
    });

    await newlyCreatedAddress.save();

    res.status(201).json({
      success: true,
      data: newlyCreatedAddress,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error adding address",
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || userId === "undefined") {
      return res.status(400).json({
        success: false,
        message: "User id is required!",
      });
    }

    const addressList = await Address.find({ userId }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error fetching addresses",
    });
  }
};

const getLastUsedAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.query; // 'personal' or 'recipient'

    if (!userId || userId === "undefined") {
      return res.status(400).json({
        success: false,
        message: "User id is required!",
      });
    }

    const query = { userId };
    if (type === "recipient") {
      query.isLastUsedRecipient = true;
    } else {
      query.isLastUsed = true;
    }

    const address = await Address.findOne(query);

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error fetching last used address",
    });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    // If this edit involves setting a last used flag, reset others
    if (formData.isLastUsed) {
        await Address.updateMany({ userId, _id: { $ne: addressId } }, { isLastUsed: false });
    }
    if (formData.isLastUsedRecipient) {
        await Address.updateMany({ userId, _id: { $ne: addressId } }, { isLastUsedRecipient: false });
    }

    const address = await Address.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      formData,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error editing address",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    const address = await Address.findOneAndDelete({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error deleting address",
    });
  }
};

module.exports = {
  addAddress,
  fetchAllAddress,
  getLastUsedAddress,
  editAddress,
  deleteAddress,
};
