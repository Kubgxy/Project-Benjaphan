import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, Search, FileDown, Eye } from "lucide-react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

interface Product {
  _id: string;
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
  availableSizes: {
    size: string;
    quantity: number;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    id_product: "",
    name: "",
    category: "",
    price: 0,
    availableSizes: [] as { size: string; quantity: number }[],
    description: "",
    images: [] as File[],
    isNewArrival: false,
    isBestseller: false,
    isOnSale: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/product/getAllProducts",
        { withCredentials: true }
      );
      setProducts(response.data.products);
      console.log(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const requestSort = (key: string) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const calculateStock = (availableSizes: any) => {
    if (!availableSizes || !Array.isArray(availableSizes)) return 0;
    return availableSizes.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );
  };

  // ✅ ใช้ได้แล้วตรงนี้
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()); // ✅ ตรงนี้!
    const matchesCategory =
      categoryFilter !== "all" ? product.category === categoryFilter : true;
    const matchesStatus =
      statusFilter !== "all"
        ? statusFilter === "Active"
          ? calculateStock(product.availableSizes) > 0
          : calculateStock(product.availableSizes) === 0
        : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (
      a[sortConfig.key as keyof Product] < b[sortConfig.key as keyof Product]
    ) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (
      a[sortConfig.key as keyof Product] > b[sortConfig.key as keyof Product]
    ) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id_product", newProduct.id_product);
      formData.append("name", newProduct.name);
      formData.append("category", newProduct.category);
      formData.append("price", newProduct.price.toString());
      formData.append("description", newProduct.description);
      formData.append(
        "availableSizes",
        JSON.stringify(newProduct.availableSizes)
      );
      formData.append("isNewArrival", newProduct.isNewArrival.toString());
      formData.append("isBestseller", newProduct.isBestseller.toString());
      formData.append("isOnSale", newProduct.isOnSale.toString());
      console.log("images", newProduct.images);
      newProduct.images.forEach((image) => {
        console.log("Appending image:", image);
        formData.append("images", image);
      });

      await axios.post(
        "http://localhost:3000/api/product/addProducts",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast({ title: "✅ เพิ่มสินค้าสำเร็จ!" });
      setAddDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("❌ Error adding product:", error);
      toast({ title: "❌ เพิ่มสินค้าไม่สำเร็จ" });
    }
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(sortedProducts.map((product) => product._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectOne = (checked: boolean, productId: string) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  const handleExportCsv = () => {
    toast({ title: "CSV Export ยังไม่ทำ" });
  };

  const IMAGE_BASE_URL = "http://localhost:3000";

  const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">สินค้า</h1>
        <Button
          className="flex items-center"
          onClick={() => setAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มสินค้า
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ค้นหาสินค้า..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="หมวดหมู่" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>{" "}
            {/* ตรงนี้ต้องมี all */}
            {uniqueCategories.filter(Boolean).map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="Active">เปิดใช้งาน</SelectItem>
            <SelectItem value="Inactive">ปิดใช้งาน</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-background border rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <Checkbox
              checked={
                selectedProducts.length === sortedProducts.length &&
                sortedProducts.length > 0
              }
              onCheckedChange={handleSelectAll}
              className="mr-2"
            />
            <span className="text-sm text-muted-foreground">
              เลือก {selectedProducts.length} จาก {sortedProducts.length} รายการ
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <FileDown className="mr-2 h-4 w-4" />
            ส่งออก
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead />
                <TableHead>รูปภาพ</TableHead>
                <TableHead
                  onClick={() => requestSort("name")}
                  className="cursor-pointer"
                >
                  ชื่อสินค้า
                </TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead>คงเหลือ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>แท็ก</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product._id)}
                        onCheckedChange={(c) =>
                          handleSelectOne(!!c, product._id)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={`${IMAGE_BASE_URL}${product.images[0]}`}
                        className="h-16 w-16 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>฿{product.price.toLocaleString()}</TableCell>
                    <TableCell>
                      {calculateStock(product.availableSizes)}
                    </TableCell>{" "}
                    {/* ✅ ใช้ฟังก์ชันคำนวณ stock */}
                    <TableCell>
                      <Badge
                        className={
                          calculateStock(product.availableSizes) > 0
                            ? "bg-emerald"
                            : "bg-muted"
                        }
                      >
                        {calculateStock(product.availableSizes) > 0
                          ? "เปิดใช้งาน"
                          : "ปิดใช้งาน"}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-1">
                      {product.isNewArrival && (
                        <Badge className="bg-purple">ใหม่</Badge>
                      )}
                      {product.isBestseller && (
                        <Badge className="bg-gold">ขายดี</Badge>
                      )}
                      {product.isOnSale && (
                        <Badge className="bg-ruby">ลดราคา</Badge>
                      )}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-ruby hover:text-ruby/80"
                        onClick={() => handleDeleteClick(product._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6">
                    ไม่มีข้อมูลสินค้า
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบสินค้า?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              ยกเลิก
            </Button>
            {/* <Button variant="destructive" onClick={handleDeleteConfirm}>ลบ</Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <Input
              name="id_product"
              placeholder="รหัสสินค้า"
              required
              value={newProduct.id_product}
              onChange={(e) =>
                setNewProduct({ ...newProduct, id_product: e.target.value })
              }
            />
            <Input
              name="name"
              placeholder="ชื่อสินค้า"
              required
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <Input
              name="category"
              placeholder="หมวดหมู่"
              required
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            />
            <Input
              name="price"
              placeholder="ราคา"
              required
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: Number(e.target.value) })
              }
            />
            {/* ❌ ลบ stock ออก */}

            {/* ✅ เพิ่ม availableSizes แบบใหม่ (เช่น S:10,M:5,L:7) */}
            {/* เพิ่ม Sizes แบบ Dynamic */}
            <div className="space-y-2">
              <label className="font-medium">ขนาดและจำนวน:</label>
              {newProduct.availableSizes.map((sizeObj, index) => (
                <div key={index} className="flex space-x-2 items-center">
                  <Input
                    placeholder="ไซส์ (เช่น S, M, L)"
                    value={sizeObj.size}
                    onChange={(e) => {
                      const updated = [...newProduct.availableSizes];
                      updated[index].size = e.target.value;
                      setNewProduct({ ...newProduct, availableSizes: updated });
                    }}
                  />
                  <Input
                    placeholder="จำนวน"
                    type="text"
                    value={sizeObj.quantity}
                    onChange={(e) => {
                      const updated = [...newProduct.availableSizes];
                      updated[index].quantity = Number(e.target.value);
                      setNewProduct({ ...newProduct, availableSizes: updated });
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      const updated = newProduct.availableSizes.filter(
                        (_, i) => i !== index
                      );
                      setNewProduct({ ...newProduct, availableSizes: updated });
                    }}
                  >
                    🗑️
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  setNewProduct({
                    ...newProduct,
                    availableSizes: [
                      ...newProduct.availableSizes,
                      { size: "", quantity: 0 },
                    ],
                  })
                }
              >
                ➕ เพิ่มไซส์
              </Button>
            </div>

            <Input
              name="description"
              placeholder="รายละเอียด"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
            <Input
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  images: e.target.files ? Array.from(e.target.files) : [],
                })
              }
            />
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={newProduct.isNewArrival}
                  onCheckedChange={(checked) =>
                    setNewProduct({ ...newProduct, isNewArrival: !!checked })
                  }
                />
                <span>ใหม่</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={newProduct.isBestseller}
                  onCheckedChange={(checked) =>
                    setNewProduct({ ...newProduct, isBestseller: !!checked })
                  }
                />
                <span>ขายดี</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={newProduct.isOnSale}
                  onCheckedChange={(checked) =>
                    setNewProduct({ ...newProduct, isOnSale: !!checked })
                  }
                />
                <span>ลดราคา</span>
              </label>
            </div>
            <Button type="submit">บันทึก</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
