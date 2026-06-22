import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import paymentModel from "../models/payment.model.js";

async function sendTokenResponse(user, res, message) {
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  res.status(200).json({
    message,
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
}


export const register = async (req, res) => {
  const { email, contact, password, fullname, isSeller } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or contact already exists" });
    }

    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSeller ? "seller" : "buyer",
    });

    await sendTokenResponse(user, res, "User registered successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  await sendTokenResponse(user, res, "User logged in successfully");
};


export const googleCallback = async (req, res) => {
  const { id, displayName, emails, photos } = req.user;
  const email = emails[0].value;
  const profilePic = photos[0].value;

  let user = await userModel.findOne({
    email,
  });

  if (!user) {
    user = await userModel.create({
      email,
      googleId: id,
      fullname: displayName,
    });
  }
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  res.redirect("http://localhost:5173/");
};


export const getMe = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    message: "User fetched successfully",
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
      addresses: user.addresses,
      wishlist: user.wishlist,
    },
  });
};

export const updateProfile = async (req, res) => {
  const { fullname, contact } = req.body;
  const user = req.user;

  if (fullname) user.fullname = fullname;
  if (contact) user.contact = contact;

  await user.save();

  res.status(200).json({
    message: "Profile updated successfully",
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
      addresses: user.addresses,
    },
  });
};

export const addAddress = async (req, res) => {
  const { label, line1, line2, city, state, pincode, isDefault } = req.body;
  const user = req.user;

  if (isDefault) {
    user.addresses = user.addresses.map(addr => ({ ...addr.toObject(), isDefault: false }));
  }

  user.addresses.push({ label, line1, line2, city, state, pincode, isDefault: !!isDefault });
  await user.save();

  res.status(201).json({
    message: "Address added successfully",
    success: true,
    addresses: user.addresses,
  });
};

export const deleteAddress = async (req, res) => {
  const { addressId } = req.params;
  const user = req.user;

  user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
  await user.save();

  res.status(200).json({
    message: "Address deleted successfully",
    success: true,
    addresses: user.addresses,
  });
};

export const toggleWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = await userModel.findById(req.user._id);

  const index = user.wishlist.findIndex(id => id.toString() === productId);

  if (index === -1) {
    user.wishlist.push(productId);
  } else {
    user.wishlist.splice(index, 1);
  }

  await user.save();

  res.status(200).json({
    message: index === -1 ? "Added to wishlist" : "Removed from wishlist",
    success: true,
    wishlisted: index === -1,
    wishlist: user.wishlist,
  });
};

export const getWishlist = async (req, res) => {
  const user = await userModel.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    message: "Wishlist fetched successfully",
    success: true,
    wishlist: user.wishlist,
  });
};

export const getMyOrders = async (req, res) => {
  const orders = await paymentModel
    .find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: "Orders fetched successfully",
    success: true,
    orders,
  });
};
