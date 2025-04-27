import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Model
import User from "../Models/User";

// Register
export const registerUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res
      .status(400)
      .json({ message: "❌ Please provide name, email, and password" });
    return; // ✅ return แค่หยุด function, ไม่ return ค่า
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "❌ Email already exists" });
      return;
    }

    // Hash password ก่อน save
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword, // ใช้ password ที่ hash แล้ว
    });
    await newUser.save();

    res.status(201).json({
      message: "✅ User registered successfully",
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
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

    const isPasswordValid = await bcrypt.compare(password, user.password);
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
