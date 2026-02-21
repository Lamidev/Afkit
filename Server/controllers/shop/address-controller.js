const Address = require("../../models/address");

const addAddress = async (req, res) => {
  try {
    const { userId, fullName, email, address, city, phone, notes, addressType } = req.body;
    const requiredFields = { userId, fullName, email, address, city, phone };
    const missingFields = Object.keys(requiredFields).filter(key => !requiredFields[key] || requiredFields[key] === "undefined");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing or invalid fields: ${missingFields.join(", ")}`,
      });
    }

    // Clear other last used flags for this user and type
    const flagToClear = addressType === "recipient" ? { isLastUsedRecipient: true } : { isLastUsed: true };
    const resetData = addressType === "recipient" ? { isLastUsedRecipient: false } : { isLastUsed: false };
    await Address.updateMany({ userId, ...flagToClear }, resetData);

    const newlyCreatedAddress = new Address({
      userId,
      fullName,
      email,
      address,
      city,
      phone,
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
