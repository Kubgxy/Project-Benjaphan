
import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  ArrowUp, 
  ArrowDown,
  FileDown,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';

// Mock data for products
const mockProducts = [
  {
    id: 'prod-1',
    name: 'แหวนมังกรทองคำ',
    category: 'แหวน',
    price: 2500,
    salePrice: 2000,
    stock: 15,
    isNew: true,
    isBestSeller: true,
    isOnSale: true,
    status: 'Active',
    imageUrl: 'https://via.placeholder.com/60?text=แหวน',
  },
  {
    id: 'prod-2',
    name: 'จี้แมวนำโชค',
    category: 'สร้อยคอ',
    price: 3500,
    salePrice: null,
    stock: 8,
    isNew: true,
    isBestSeller: false,
    isOnSale: false,
    status: 'Active',
    imageUrl: 'https://via.placeholder.com/60?text=จี้',
  },
  {
    id: 'prod-3',
    name: 'กำไลหยกมงคล',
    category: 'กำไล',
    price: 1800,
    salePrice: 1500,
    stock: 3,
    isNew: false,
    isBestSeller: true,
    isOnSale: true,
    status: 'Active',
    imageUrl: 'https://via.placeholder.com/60?text=กำไล',
  },
  {
    id: 'prod-4',
    name: 'ต่างหูปลาคาร์ฟทอง',
    category: 'ต่างหู',
    price: 1200,
    salePrice: null,
    stock: 0,
    isNew: false,
    isBestSeller: false,
    isOnSale: false,
    status: 'Inactive',
    imageUrl: 'https://via.placeholder.com/60?text=ต่างหู',
  },
  {
    id: 'prod-5',
    name: 'สร้อยคอหงส์เงิน',
    category: 'สร้อยคอ',
    price: 4200,
    salePrice: 3800,
    stock: 5,
    isNew: false,
    isBestSeller: false,
    isOnSale: true,
    status: 'Active',
    imageUrl: 'https://via.placeholder.com/60?text=สร้อยคอ',
  },
];

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply filters and sorting to products
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    const matchesStatus = statusFilter ? product.status === statusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Handle delete dialog
  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      // In a real app, this would be an API call to delete the product
      toast({
        title: "ลบสินค้าเรียบร้อย",
        description: "สินค้าได้ถูกลบออกจากระบบแล้ว",
      });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(sortedProducts.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  // Handle individual checkbox
  const handleSelectOne = (checked: boolean, productId: string) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  // Handle export CSV
  const handleExportCsv = () => {
    toast({
      title: "เริ่มการส่งออกไฟล์",
      description: "ไฟล์ CSV กำลังถูกสร้างและจะพร้อมให้ดาวน์โหลดในไม่ช้า",
    });
  };

  const uniqueCategories = Array.from(new Set(mockProducts.map(p => p.category)));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">สินค้า</h1>
        <Button className="flex items-center">
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
              className="pl-8 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="กรองตามหมวดหมู่" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">ทุกหมวดหมู่</SelectItem>
            {uniqueCategories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="กรองตามสถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">ทุกสถานะ</SelectItem>
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
              aria-label="เลือกสินค้าทั้งหมด"
              className="mr-2"
            />
            <span className="text-sm text-muted-foreground">
              เลือก {selectedProducts.length} จาก {sortedProducts.length} รายการ
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={handleExportCsv}
            disabled={selectedProducts.length === 0}
          >
            <FileDown className="mr-2 h-4 w-4" />
            ส่งออกที่เลือก
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="w-[80px]">รูปภาพ</TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('name')}>
                  <div className="flex items-center">
                    ชื่อสินค้า
                    {sortConfig.key === 'name' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('price')}>
                  <div className="flex items-center">
                    ราคา
                    {sortConfig.key === 'price' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('stock')}>
                  <div className="flex items-center">
                    คงเหลือ
                    {sortConfig.key === 'stock' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>แท็ก</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => handleSelectOne(!!checked, product.id)}
                        aria-label={`เลือก ${product.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="h-12 w-12 rounded overflow-hidden">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="h-full w-full object-cover" 
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className={product.isOnSale ? "text-muted-foreground line-through" : ""}>
                          ฿{product.price.toLocaleString()}
                        </span>
                        {product.isOnSale && (
                          <span className="text-ruby font-medium">
                            ฿{product.salePrice?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={
                        product.stock === 0 
                          ? "text-ruby" 
                          : product.stock < 5 
                          ? "text-gold" 
                          : ""
                      }>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={product.status === "Active" ? "default" : "secondary"}
                        className={product.status === "Active" 
                          ? "bg-emerald hover:bg-emerald/80" 
                          : "bg-muted text-muted-foreground"}
                      >
                        {product.status === "Active" ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.isNew && (
                          <Badge className="bg-purple hover:bg-purple/80">ใหม่</Badge>
                        )}
                        {product.isBestSeller && (
                          <Badge className="bg-gold hover:bg-gold/80">ขายดี</Badge>
                        )}
                        {product.isOnSale && (
                          <Badge className="bg-ruby hover:bg-ruby/80">ลดราคา</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-ruby hover:text-ruby/80 hover:bg-ruby/10"
                          onClick={() => handleDeleteClick(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    ไม่พบสินค้า
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบ?</DialogTitle>
            <DialogDescription>
              การกระทำนี้ไม่สามารถย้อนกลับได้ สินค้าจะถูกลบออกจากระบบอย่างถาวร
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              ลบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
