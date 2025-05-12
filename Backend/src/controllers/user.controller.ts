import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Model
// import User from "../Models/User";
import User from "../Models_GPT/User"; 
import Cart from "../Models_GPT/Cart";
import Wishlist from "../Models_GPT/Wishlist";

// Register
export const registerUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  const { firstName, lastName, email, password, phoneNumber, addresses } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res
      .status(400)
      .json({ message: "❌ Please provide name, email, and password" });
    return;
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      res.status(400).json({ message: "❌ Email already exists" });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phoneNumber,
      addresses,
      provider: "local",
    });
    await newUser.save();

    const existingCart = await Cart.findOne({ userId: newUser._id });
    const cart = existingCart || new Cart({ userId: newUser._id });
    if (!existingCart) {
      await cart.save();
    }

    const existingWishlist = await Wishlist.findOne({ userId: newUser._id });
    const wishlist = existingWishlist || new Wishlist({ userId: newUser._id }); 
    if (!existingWishlist) {
      await wishlist.save();
    }

    newUser.cartId = cart._id;
    newUser.wishlistId = wishlist._id;
    await newUser.save();

    res.status(201).json({
      message: "✅ User registered successfully",
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        phoneNumber: newUser.phoneNumber,
        addresses: newUser.addresses,
        cartId: newUser.cartId,
        wishlistId: newUser.wishlistId,
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "❌ Server error", error });
  }
};

// Login
export const loginUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "❌ Please provide email and password" });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "❌ User not found" });
      return;
    }

    if (!user.password) {
      res.status(500).json({ message: "❌ Server error: Password is missing" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password as string);
    if (!isPasswordValid) {
      res.status(401).json({ message: "❌ Invalid password" });
      return;
    }

    
    // ✅ สร้าง token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    
    console.log("🔐 SIGNING PAYLOAD:", { userId: user._id.toString(), role: user.role });
    console.log("🔐 JWT_SECRET used for signing:", process.env.JWT_SECRET);
    console.log("🔐 TOKEN after sign:", token);
    // ✅ ส่ง token ผ่าน cookie
    res
      .cookie("token", token, {
        httpOnly: true, // Client-side JS อ่านไม่ได้
        secure: process.env.NODE_ENV === "production", // ใช้ secure เฉพาะ production (HTTPS)
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 วัน
      })
      .status(200)
      .json({
        message: "✅ User logged in successfully",
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        token,
      });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error });
  }
};

// Logout
export const logoutUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "✅ Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error });
  }
};

// Get user profile
export const getUserProfile = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
       res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update user and Upload avatar
export const updateMe = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const { firstName, lastName, email } = req.body;
    const avatar = req.file
      ? `/uploads/avatars/${req.file.filename}`
      : undefined;

    const updateData: any = { firstName, lastName, email };
    if (avatar) {
      updateData.avatar = avatar;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user?.userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//Get Address
export const getAddress = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('addresses');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addAddress = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const { label, addressLine, city, province, postalCode, country } = req.body;
    const userId = req.user?.userId;

    if (!label || !addressLine || !city || !province || !postalCode || !country) {
      res.status(400).json({ message: '❌ Please provide all address fields' });
      return;
    }

    const newAddress = {
      label,
      addressLine,
      city,
      province,
      postalCode,
      country
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { addresses: newAddress } },
      { new: true, runValidators: true }
    ).select('addresses');

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ message: '✅ Address added successfully', addresses: updatedUser.addresses });
  }
  catch (error) {
    res.status(500).json({ message: '❌ Server error', error });
  }
};

// Update Address
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const { addressLine, city, province, postalCode, country, label } = req.body;
    const userId = req.user?.userId;
    const addressId = req.params.addressId;

    if (!label || !addressLine || !city || !province || !postalCode || !country) {
      res.status(400).json({ message: '❌ Please provide all address fields' });
      return;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, 'addresses._id': addressId },
      {
        $set: {
          'addresses.$': { _id: addressId, label, addressLine, city, province, postalCode, country }
        }
      },
      { new: true }
    ).select('addresses');

    if (!updatedUser) {
      res.status(404).json({ message: 'User or address not found' });
      return;
    }

    res.status(200).json({ message: '✅ Address updated successfully', addresses: updatedUser.addresses });
  } catch (error) {
    res.status(500).json({ message: '❌ Server error', error });
  }
};

// Delete Address
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const addressId = req.params.addressId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    ).select('addresses');

    if (!updatedUser) {
      res.status(404).json({ message: 'User or address not found' });
      return;
    }

    res.status(200).json({ message: '✅ Address deleted successfully', addresses: updatedUser.addresses });
  } catch (error) {
    res.status(500).json({ message: '❌ Server error', error });
  }
};

// Get all customers (Admin only)
export const getAllCustomers = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    res.status(200).json({ customers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
