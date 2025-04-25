import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox"; // ✅ เพิ่ม Checkbox ที่ใช้ใน Boolean Fields
import { toast } from "@/hooks/use-toast";

// 🟢 Interface ของสินค้า (ตามที่น้องเสือกำหนดมา)
interface Product {
  id_product: string;
  name: string;
  category: string;
  price: number;
  description: string;
  details: string[];
  images: string[];
  rating: number;
  reviews: number;
  isNewArrival: boolean;
  isBestseller: boolean;
  isOnSale: boolean;
  availableSizes: string[];
  stock: number;
}

const Products: React.FC = () => {
  // 🟡 State สำหรับการจัดการสินค้า
  const [products, setProducts] = useState<Product[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productDetails, setProductDetails] = useState<Product | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // ✅ โหลดสินค้าทั้งหมด
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/product/getAllProducts",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products);
      } else {
        toast({
          title: "โหลดสินค้าไม่สำเร็จ",
          description: data.message || "เกิดข้อผิดพลาด",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "โหลดสินค้าไม่สำเร็จ",
        description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        variant: "destructive",
      });
    }
  };

  // ✅ เพิ่มสินค้าใหม่
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // 🟢 แปลง input comma-separated เป็น array
    const details = formData.get("details")?.toString().split(",") || [];
    const availableSizes =
      formData.get("availableSizes")?.toString().split(",") || [];
    const images = formData.get("images")?.toString().split(",") || [];

    formData.set("details", JSON.stringify(details));
    formData.set("availableSizes", JSON.stringify(availableSizes));
    formData.set("images", JSON.stringify(images));

    try {
      const response = await fetch(
        "http://localhost:3000/api/product/addProducts",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast({ title: "เพิ่มสินค้าสำเร็จ", description: data.message });
        fetchProducts();
        setAddDialogOpen(false);
      } else {
        toast({
          title: "เพิ่มสินค้าไม่สำเร็จ",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "เพิ่มสินค้าไม่สำเร็จ",
        description: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้",
        variant: "destructive",
      });
    }
  };

  // 🟠 แก้ไขสินค้า (Update Product)
  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productToEdit) return;

    const formData = new FormData(e.currentTarget);

    // 🟢 แปลง array string เป็น JSON string
    const details = formData.get("details")?.toString().split(",") || [];
    const availableSizes =
      formData.get("availableSizes")?.toString().split(",") || [];
    const images = formData.get("images")?.toString().split(",") || [];

    formData.set("details", JSON.stringify(details));
    formData.set("availableSizes", JSON.stringify(availableSizes));
    formData.set("images", JSON.stringify(images));

    try {
      const response = await fetch(
        `http://localhost:3000/api/product/${productToEdit.id_product}`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast({ title: "อัปเดตสินค้าสำเร็จ", description: data.message });
        fetchProducts();
        setEditDialogOpen(false);
      } else {
        toast({
          title: "อัปเดตสินค้าไม่สำเร็จ",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "อัปเดตสินค้าไม่สำเร็จ",
        description: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้",
        variant: "destructive",
      });
    }
  };

  // 🟥 ลบสินค้า (Delete Product)
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/product/${productToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast({ title: "ลบสินค้าสำเร็จ", description: data.message });
        fetchProducts();
      } else {
        toast({
          title: "ลบสินค้าไม่สำเร็จ",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "ลบสินค้าไม่สำเร็จ",
        description: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // 👁️ ดูรายละเอียดสินค้า (View Details)
  const handleViewDetails = async (id_product: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/product/${id_product}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setProductDetails(data.product);
        setDetailsDialogOpen(true);
      } else {
        toast({
          title: "โหลดรายละเอียดไม่สำเร็จ",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "โหลดรายละเอียดไม่สำเร็จ",
        description: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้",
        variant: "destructive",
      });
    }
  };

  // 🟡 ดึงข้อมูลครั้งแรกเมื่อโหลดหน้า
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">จัดการสินค้า</h2>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2" /> เพิ่มสินค้า
        </Button>
      </div>

      <Table className="border border-gray-200 rounded-lg shadow-sm">
        <TableHeader>
          <TableRow className="bg-gray-200 text-blue-900 font-semibold">
            <TableHead>รหัสสินค้า</TableHead>
            <TableHead>ชื่อสินค้า</TableHead>
            <TableHead>หมวดหมู่</TableHead>
            <TableHead>ราคา</TableHead>
            <TableHead>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow
              key={product.id_product}
              className={
                index % 2 === 0
                  ? "bg-white"
                  : "bg-gray-50 hover:bg-yellow-50 transition"
              }
            >
              <TableCell>{product.id_product}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.price} บาท</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewDetails(product.id_product)}
                  className="hover:bg-yellow-100 rounded-full p-2"
                >
                  <Eye className="text-blue-600" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setProductToEdit(product);
                    setEditDialogOpen(true);
                  }}
                  className="hover:bg-yellow-100 rounded-full p-2"
                >
                  <Edit className="text-green-600" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setProductToDelete(product.id_product);
                    setDeleteDialogOpen(true);
                  }}
                  className="rounded-full p-2 bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 🟢 Add Product Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleAddProduct}
            className="flex flex-col gap-4"
            encType="multipart/form-data"
          >
            <Input name="id_product" placeholder="รหัสสินค้า" required />
            <Input name="name" placeholder="ชื่อสินค้า" required />
            <Input name="category" placeholder="หมวดหมู่" required />
            <Input name="price" placeholder="ราคา" type="number" required />
            <Input name="description" placeholder="คำอธิบายสินค้า" required />
            <Input name="details" placeholder="รายละเอียดสินค้า" required />
            <Input
              name="stock"
              placeholder="จำนวนในสต็อก"
              type="number"
              required
            />

            {/* 🟢 Upload รูปภาพ */}
            <label className="block">
              <span className="text-sm text-gray-700">
                เลือกรูปภาพ (หลายรูปได้)
              </span>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                className="mt-1 block w-full"
                required
              />
            </label>

            {/* 🟠 Checkbox สำหรับ Boolean fields */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <Checkbox name="isNewArrival" /> สินค้ามาใหม่
              </label>
              <label className="flex items-center gap-2">
                <Checkbox name="isBestseller" /> สินค้าขายดี
              </label>
              <label className="flex items-center gap-2">
                <Checkbox name="isOnSale" /> สินค้าลดราคา
              </label>
            </div>

            <DialogFooter>
              <Button type="submit">บันทึก</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 🟠 Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไขสินค้า</DialogTitle>
          </DialogHeader>
          {productToEdit && (
            <form
              onSubmit={handleUpdateProduct}
              className="flex flex-col gap-4"
              encType="multipart/form-data"
            >
              <Input
                name="name"
                placeholder="ชื่อสินค้า"
                defaultValue={productToEdit.name}
                required
              />
              <Input
                name="category"
                placeholder="หมวดหมู่"
                defaultValue={productToEdit.category}
                required
              />
              <Input
                name="price"
                placeholder="ราคา"
                type="number"
                defaultValue={productToEdit.price}
                required
              />
              <Input
                name="description"
                placeholder="คำอธิบาย"
                defaultValue={productToEdit.description}
                required
              />
              <Input
                name="details"
                placeholder="รายละเอียดเพิ่มเติม (คั่นด้วย , )"
                defaultValue={productToEdit.details.join(",")}
                required
              />
              <Input
                name="availableSizes"
                placeholder="ขนาดที่มี"
                defaultValue={productToEdit.availableSizes.join(",")}
              />
              <Input
                name="stock"
                placeholder="จำนวนในสต็อก"
                type="number"
                defaultValue={productToEdit.stock}
                required
              />
              <Input
                name="rating"
                placeholder="เรตติ้ง"
                type="number"
                step="0.1"
                defaultValue={productToEdit.rating}
              />
              <Input
                name="reviews"
                placeholder="จำนวนรีวิว"
                type="number"
                defaultValue={productToEdit.reviews}
              />

              {/* ✅ เปลี่ยนจาก text เป็น Upload รูปภาพ */}
              <label className="block">
                <span className="text-sm text-gray-700">
                  เลือกรูปภาพใหม่ (หลายรูปได้)
                </span>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  className="mt-1 block w-full"
                />
                <span className="text-xs text-gray-500">
                  * ถ้าไม่เลือก จะใช้รูปเดิม
                </span>
              </label>

              {/* 🟠 Checkbox สำหรับ Boolean fields */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <Checkbox
                    name="isNewArrival"
                    defaultChecked={productToEdit.isNewArrival}
                  />{" "}
                  สินค้ามาใหม่
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    name="isBestseller"
                    defaultChecked={productToEdit.isBestseller}
                  />{" "}
                  สินค้าขายดี
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    name="isOnSale"
                    defaultChecked={productToEdit.isOnSale}
                  />{" "}
                  สินค้าลดราคา
                </label>
              </div>

              <DialogFooter>
                <Button type="submit">อัปเดต</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 🟥 Delete Confirm Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบ</DialogTitle>
          </DialogHeader>
          <p>คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              ลบ
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              ยกเลิก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 👁️ View Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>รายละเอียดสินค้า</DialogTitle>
          </DialogHeader>
          {productDetails && (
            <div className="flex flex-col gap-2">
              <p>
                <strong>รหัสสินค้า:</strong> {productDetails.id_product}
              </p>
              <p>
                <strong>ชื่อสินค้า:</strong> {productDetails.name}
              </p>
              <p>
                <strong>หมวดหมู่:</strong> {productDetails.category}
              </p>
              <p>
                <strong>ราคา:</strong> {productDetails.price} บาท
              </p>
              <p>
                <strong>คำอธิบาย:</strong> {productDetails.description || "-"}
              </p>
              <p>
                <strong>รายละเอียดเพิ่มเติม:</strong>{" "}
                {productDetails.details && productDetails.details.length > 0
                  ? productDetails.details.join(", ")
                  : "-"}
              </p>
              <p>
                <strong>ขนาดที่มี:</strong>{" "}
                {productDetails.availableSizes &&
                productDetails.availableSizes.length > 0
                  ? productDetails.availableSizes.join(", ")
                  : "-"}
              </p>
              <p>
                <strong>จำนวนในสต็อก:</strong> {productDetails.stock}
              </p>
              <p>
                <strong>เรตติ้ง:</strong> {productDetails.rating}
              </p>
              <p>
                <strong>จำนวนรีวิว:</strong> {productDetails.reviews}
              </p>
              <p>
                <strong>สินค้าใหม่:</strong>{" "}
                {productDetails.isNewArrival ? "✅" : "❌"}
              </p>
              <p>
                <strong>สินค้าขายดี:</strong>{" "}
                {productDetails.isBestseller ? "✅" : "❌"}
              </p>
              <p>
                <strong>สินค้าลดราคา:</strong>{" "}
                {productDetails.isOnSale ? "✅" : "❌"}
              </p>

              {/* 🟠 แสดงรูปภาพแบบ preview */}
              <div className="mt-4">
                <strong>รูปภาพสินค้า:</strong>
                {productDetails.images && productDetails.images.length > 0 ? (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {productDetails.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`product-${index}`}
                        className="w-24 h-24 object-cover border rounded"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">ไม่มีรูปภาพ</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
