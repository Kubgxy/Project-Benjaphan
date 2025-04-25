import { Request, Response, NextFunction } from "express";
import Product from "../Models/Product";

// ✅ Helper: แปลง boolean string เป็น boolean
const toBoolean = (value: any) => value === 'true' || value === true;

// ✅ Helper: แปลงเป็น array ถ้าไม่ใช่ array
const toArray = (value: any) => Array.isArray(value) ? value : [value];

// ✅ List ของ field ที่อนุญาตให้อัปเดต
const allowedFields = [
  'name', 'category', 'price', 'description', 'details', 'stock',
  'rating', 'reviews', 'isNewArrival', 'isBestseller', 'isOnSale', 'availableSizes'
];

// ✅ ใช้กับทั้ง Add และ Update
const prepareProductData = (body: any, images: string[] = []) => {
  const productData: any = {};

  allowedFields.forEach(field => {
    if (body[field] !== undefined) {
      if (['price', 'stock', 'rating', 'reviews'].includes(field)) {
        const num = Number(body[field]);
        if (Number.isNaN(num)) throw new Error(`${field} must be a valid number`);
        productData[field] = num;
      } else if (['details', 'availableSizes'].includes(field)) {
        productData[field] = toArray(body[field]);
      } else if (['isNewArrival', 'isBestseller', 'isOnSale'].includes(field)) {
        productData[field] = toBoolean(body[field]);
      } else {
        productData[field] = body[field];
      }
    }
  });

  if (images.length > 0) {
    productData.images = images;
  }

  return productData;
};

// ✅ Get all products
export const getAllProducts = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json({ message: "Products fetched successfully", products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get product by id_product
export const getProductById = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const id = req.params.id;
  try {
    const product = await Product.findOne({ id_product: id });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Product fetched successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Add product + Validate + Upload images
export const addProduct = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const { id_product, name, category, price, description, details, stock } = req.body;

  if (!id_product || !name || !category || !price || !description || !details || !stock) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const images = (req.files as Express.Multer.File[] || []).map(file => `/uploads/${file.filename}`);
    const productData = prepareProductData(req.body, images);
    productData.id_product = id_product;

    const product = await Product.create(productData);
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Invalid input", error });
  }
};

// ✅ Update product + Validate + คงรูปเดิมถ้าไม่ได้ upload ใหม่
export const updateProduct = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const id = req.params.id;

  try {
    const images = (req.files as Express.Multer.File[] || []).map(file => `/uploads/${file.filename}`);
    const existingProduct = await Product.findOne({ id_product: id });

    if (!existingProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const updateData = prepareProductData(req.body, images.length > 0 ? images : existingProduct.images);

    const product = await Product.findOneAndUpdate({ id_product: id }, updateData, { new: true });
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Invalid input", error });
  }
};

// ✅ Delete product
export const deleteProduct = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const id = req.params.id;
  try {
    const product = await Product.findOneAndDelete({ id_product: id });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
