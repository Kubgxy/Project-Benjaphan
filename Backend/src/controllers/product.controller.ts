import { Request, Response, NextFunction } from "express";
import Product from "../Models/Product";

// ✅ Helper: แปลง boolean string เป็น boolean
const toBoolean = (value: any) => value === 'true' || value === true;

// ✅ Helper: แปลงเป็น array ถ้าไม่ใช่ array
const toArray = (value: any) => Array.isArray(value) ? value : [value];

// ✅ List ของ field ที่อนุญาตให้อัปเดต
const allowedFields = [
    'id_product', 'name', 'category', 'price', 'description',
    'details', 'rating', 'reviews',
    'isNewArrival', 'isBestseller', 'isOnSale', 'availableSizes'
  ];

// ✅ ใช้กับทั้ง Add และ Update
const prepareProductData = (body: any, images: string[] = []) => {
    const productData: any = {};
  
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        if (['price', 'rating', 'reviews'].includes(field)) {
          const num = Number(body[field]);
          if (Number.isNaN(num)) throw new Error(`${field} must be a valid number`);
          productData[field] = num;
        } else if (field === 'details') {
          productData[field] = toArray(body[field]);
        } else if (field === 'availableSizes') {
          let sizes;
          try {
            sizes = typeof body[field] === 'string' ? JSON.parse(body[field]) : body[field];
          } catch {
            throw new Error('availableSizes must be a valid JSON array');
          }
  
          if (!Array.isArray(sizes)) {
            throw new Error('availableSizes must be an array');
          }
  
          productData[field] = sizes.map((sizeObj: any) => {
            if (!sizeObj.size || sizeObj.quantity === undefined) {
              throw new Error('Each availableSizes item must have size and quantity');
            }
            return {
              size: sizeObj.size,
              quantity: Number(sizeObj.quantity)
            };
          });
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
export const addProduct = async (req: Request, res: Response): Promise<void> => {
    const { id_product, name, category, price, description, availableSizes } = req.body;
  
    if (!id_product || !name || !category || !price || !description || !availableSizes) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
  
    try {
      const images = (req.files as Express.Multer.File[] || []).map(file => `/uploads/products/${file.filename}`);
      const productData = prepareProductData(req.body, images);
  
      const product = await Product.create(productData);
      console.log(req.body)
      res.status(201).json({ message: "Product created successfully", product });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid input", error });
    }
  };

// ✅ Update product + Validate + คงรูปเดิมถ้าไม่ได้ upload ใหม่
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
  
    try {
      const images = (req.files as Express.Multer.File[] || []).map(file => `/uploads/${file.filename}`);
      const existingProduct = await Product.findOne({ id_product: id });
  
      if (!existingProduct) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
  
      const updateData = prepareProductData(req.body, images.length > 0 ? images : existingProduct.images);
  
      // ❌ ป้องกันการแก้ id_product
      if (updateData.id_product && updateData.id_product !== existingProduct.id_product) {
        throw new Error('Cannot change id_product');
      }
  
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
