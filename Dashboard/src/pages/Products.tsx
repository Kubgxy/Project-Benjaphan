import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Search, ArrowUp, ArrowDown, FileDown, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';

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
  availableSizes: string[];
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // โหลดสินค้าจาก API



  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply filters and sorting
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    const matchesStatus = statusFilter
      ? statusFilter === 'Active'
        ? product.stock > 0
        : product.stock === 0
      : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a[sortConfig.key as keyof Product] < b[sortConfig.key as keyof Product]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key as keyof Product] > b[sortConfig.key as keyof Product]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };



  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(sortedProducts.map(product => product._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectOne = (checked: boolean, productId: string) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleExportCsv = () => {
    toast({ title: "CSV Export ยังไม่ทำ" });
  };



  const uniqueCategories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">สินค้า</h1>
        <Button className="flex items-center" onClick={() => setAddDialogOpen(true)}>
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
          <SelectTrigger><SelectValue placeholder="หมวดหมู่" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">ทั้งหมด</SelectItem>
            {uniqueCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue placeholder="สถานะ" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">ทั้งหมด</SelectItem>
            <SelectItem value="Active">เปิดใช้งาน</SelectItem>
            <SelectItem value="Inactive">ปิดใช้งาน</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-background border rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <Checkbox
              checked={selectedProducts.length === sortedProducts.length && sortedProducts.length > 0}
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
                <TableHead onClick={() => requestSort('name')} className="cursor-pointer">ชื่อสินค้า</TableHead>
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
                sortedProducts.map(product => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product._id)}
                        onCheckedChange={(c) => handleSelectOne(!!c, product._id)}
                      />
                    </TableCell>
                    <TableCell>
                      <img src={product.images[0]} className="h-12 w-12 object-cover rounded" />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>฿{product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge className={product.stock > 0 ? 'bg-emerald' : 'bg-muted'}>
                        {product.stock > 0 ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-1">
                      {product.isNewArrival && <Badge className="bg-purple">ใหม่</Badge>}
                      {product.isBestseller && <Badge className="bg-gold">ขายดี</Badge>}
                      {product.isOnSale && <Badge className="bg-ruby">ลดราคา</Badge>}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
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
                  <TableCell colSpan={9} className="text-center py-6">ไม่มีข้อมูลสินค้า</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>ยืนยันการลบสินค้า?</DialogTitle></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>ยกเลิก</Button>
            {/* <Button variant="destructive" onClick={handleDeleteConfirm}>ลบ</Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>เพิ่มสินค้าใหม่</DialogTitle></DialogHeader>
          {/* <form onSubmit={handleAddProduct} className="space-y-4"> */}
            <Input name="id_product" placeholder="รหัสสินค้า" required />
            <Input name="name" placeholder="ชื่อสินค้า" required />
            <Input name="category" placeholder="หมวดหมู่" required />
            <Input name="price" type="number" placeholder="ราคา" required />
            <Input name="stock" type="number" placeholder="คงเหลือ" required />
            <Input name="availableSizes" placeholder="ขนาด (เช่น S,M,L)" />
            <Input name="description" placeholder="รายละเอียด" />
            <Input name="images" type="file" accept="image/*" multiple />
            <Button type="submit">บันทึก</Button>
          {/* </form> */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
