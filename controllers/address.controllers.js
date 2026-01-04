import mongoose from "mongoose";
import Address from "../models/address.model.js";


// ================= GET MY ADDRESSES =================
export const getMyAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.userId }).sort({
      isDefault: -1,
      createdAt: -1
    });

    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch addresses",
      error: error.message
    });
  }
};


// ================= ADD ADDRESS =================
export const addAddress = async (req, res) => {
  try {
    const {
      name,
      phone,
      street,
      city,
      state,
      pincode,
      country,
      isDefault
    } = req.body;

    if (!name || !phone || !street || !city || !state || !pincode) {
      return res.status(400).json({
        message: "All required fields must be filled"
      });
    }

    const existingCount = await Address.countDocuments({
      user: req.userId
    });

    let makeDefault = isDefault;

    // First address must be default
    if (existingCount === 0) {
      makeDefault = true;
    }

    // If setting default, unset others
    if (makeDefault) {
      await Address.updateMany(
        { user: req.userId },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      user: req.userId,
      name,
      phone,
      street,
      city,
      state,
      pincode,
      country,
      isDefault: makeDefault
    });

    res.status(201).json(address);

  } catch (error) {
    res.status(500).json({
      message: "Failed to add address",
      error: error.message
    });
  }
};


// ================= UPDATE ADDRESS =================
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid address id"
      });
    }

    const address = await Address.findOne({
      _id: id,
      user: req.userId
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found"
      });
    }

    const {
      name,
      phone,
      street,
      city,
      state,
      pincode,
      country,
      isDefault
    } = req.body;

    // Prevent removing last default address
    if (address.isDefault && isDefault === false) {
      return res.status(400).json({
        message: "You must have at least one default address"
      });
    }

    // If setting this address as default, unset others
    if (isDefault === true) {
      await Address.updateMany(
        { user: req.userId },
        { isDefault: false }
      );
      address.isDefault = true;
    }

    if (name !== undefined) address.name = name;
    if (phone !== undefined) address.phone = phone;
    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (pincode !== undefined) address.pincode = pincode;
    if (country !== undefined) address.country = country;

    await address.save();

    res.status(200).json(address);

  } catch (error) {
    res.status(500).json({
      message: "Failed to update address",
      error: error.message
    });
  }
};


// ================= DELETE ADDRESS =================
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid address id"
      });
    }

    const address = await Address.findOne({
      _id: id,
      user: req.userId
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found"
      });
    }

    // If deleting default address
    if (address.isDefault) {
      const otherAddress = await Address.findOne({
        user: req.userId,
        _id: { $ne: id }
      }).sort({ createdAt: -1 });

      if (!otherAddress) {
        return res.status(400).json({
          message: "Cannot delete the only default address"
        });
      }

      otherAddress.isDefault = true;
      await otherAddress.save();
    }

    await address.deleteOne();

    res.status(200).json({
      message: "Address deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete address",
      error: error.message
    });
  }
};
