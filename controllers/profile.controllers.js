import Profile from "../models/profile.model.js";


export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.userId });

    if (!profile) {
      return res.status(200).json({
        profileExists: false,
        profile: null
      });
    }

    res.status(200).json({
      profileExists: true,
      profile
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};

// ================= CREATE OR UPDATE MY PROFILE =================
export const upsertMyProfile = async (req, res) => {
  try {
    const { fullName, phone, bio, avatar, address } = req.body;

    let profile = await Profile.findOne({ user: req.userId });

    // 🆕 If profile does not exist → CREATE
    if (!profile) {
      profile = await Profile.create({
        user: req.userId,
        fullName,
        phone,
        bio,
        avatar,
        address
      });

      return res.status(201).json({
        message: "Profile created successfully",
        profile
      });
    }

    // 🔁 If profile exists → UPDATE
    if (fullName !== undefined) profile.fullName = fullName;
    if (phone !== undefined) profile.phone = phone;
    if (bio !== undefined) profile.bio = bio;
    if (avatar !== undefined) profile.avatar = avatar;
    if (address !== undefined) profile.address = address;

    await profile.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create/update profile",
      error: error.message
    });
  }
};


export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate("user", "email role"); // only safe fields

    res.status(200).json({
      count: profiles.length,
      profiles
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profiles",
      error: error.message
    });
  }
};