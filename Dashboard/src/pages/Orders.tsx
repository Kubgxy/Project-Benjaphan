
import { useState } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Download, ArrowUp, ArrowDown, Eye, Check, X } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Skeleton } from '@/components/ui/skeleton';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    date: new Date('2023-04-15'),
    total: 1290,
    status: 'completed',
    items: [
      { id: 'P1', name: 'Lucky Dragon Pendant', price: 590, quantity: 1 },
      { id: 'P2', name: 'Jade Bracelet', price: 700, quantity: 1 },
    ],
    paymentMethod: 'Credit Card',
    shippingAddress: '123 Main St, Bangkok, Thailand',
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    date: new Date('2023-04-16'),
    total: 890,
    status: 'processing',
    items: [
      { id: 'P3', name: 'Gold Fortune Cat', price: 890, quantity: 1 },
    ],
    paymentMethod: 'Bank Transfer',
    shippingAddress: '456 Park Ave, Chiang Mai, Thailand',
  },
  {
    id: 'ORD-003',
    customer: 'Bob Johnson',
    date: new Date('2023-04-17'),
    total: 1500,
    status: 'shipped',
    items: [
      { id: 'P4', name: 'Prosperity Bowl', price: 750, quantity: 2 },
    ],
    paymentMethod: 'PayPal',
    shippingAddress: '789 River Rd, Phuket, Thailand',
  },
  {
    id: 'ORD-004',
    customer: 'Sarah Lee',
    date: new Date('2023-04-18'),
    total: 2100,
    status: 'pending',
    items: [
      { id: 'P5', name: 'Wealth Frog', price: 420, quantity: 1 },
      { id: 'P6', name: 'Lucky Bamboo Set', price: 840, quantity: 2 },
    ],
    paymentMethod: 'Cash on Delivery',
    shippingAddress: '101 Ocean View, Pattaya, Thailand',
  },
  {
    id: 'ORD-005',
    customer: 'Mike Wilson',
    date: new Date('2023-04-19'),
    total: 3600,
    status: 'cancelled',
    items: [
      { id: 'P7', name: 'Crystal Pagoda', price: 1200, quantity: 3 },
    ],
    paymentMethod: 'Credit Card',
    shippingAddress: '202 Mountain Road, Chiang Rai, Thailand',
  }
];

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200'
};

const Orders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState(mockOrders);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter orders based on status and search query
  const filteredOrders = orders.filter(order => 
    (filterStatus === 'all' || order.status === filterStatus) &&
    (
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Sort orders based on sortBy and sortDirection
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date') {
      return sortDirection === 'asc' 
        ? a.date.getTime() - b.date.getTime() 
        : b.date.getTime() - a.date.getTime();
    } else {
      return sortDirection === 'asc' 
        ? a.total - b.total 
        : b.total - a.total;
    }
  });

  // Handle sort
  const handleSort = (column: 'date' | 'total') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  // Handle status change
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setIsLoading(false);
      setSelectedOrder(null);
      setShowOrderDetails(false);
      toast({
        title: "Order Updated",
        description: `Order ${orderId} status changed to ${newStatus}`,
      });
    }, 500);
  };

  // Mock export to CSV function
  const exportToCSV = () => {
    toast({
      title: "Export Started",
      description: "Your CSV file is being generated. It will be available for download shortly.",
    });
    // In a real app, this would call a backend API to generate the CSV
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your CSV file is ready for download",
      });
    }, 1500);
  };

  // Show order details in dialog
  const viewOrderDetails = (order: (typeof orders)[0]) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'processing' || o.status === 'shipped').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ฿{orders.reduce((acc, order) => acc + order.total, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64">
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full md:w-auto">
          <DatePickerWithRange className="w-full md:w-auto" />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                Date
                {sortBy === 'date' && (
                  sortDirection === 'asc' ? 
                  <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                  <ArrowDown className="inline ml-1 h-4 w-4" />
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('total')}>
                Total
                {sortBy === 'total' && (
                  sortDirection === 'asc' ? 
                  <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                  <ArrowDown className="inline ml-1 h-4 w-4" />
                )}
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(null).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16 float-right" /></TableCell>
                </TableRow>
              ))
            ) : (
              sortedOrders.length > 0 ? (
                sortedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{format(order.date, 'dd MMM yyyy')}</TableCell>
                    <TableCell>฿{order.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status as OrderStatus]}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => viewOrderDetails(order)}
                      >
                        <Eye size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No orders found
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        {selectedOrder && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Order Details: {selectedOrder.id}</DialogTitle>
              <DialogDescription>
                Placed on {format(selectedOrder.date, 'dd MMMM yyyy')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Customer</h3>
                  <p>{selectedOrder.customer}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Status</h3>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[selectedOrder.status as OrderStatus]}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </Badge>
                    <Select 
                      defaultValue={selectedOrder.status}
                      onValueChange={(value) => handleStatusChange(selectedOrder.id, value as OrderStatus)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Payment Method</h3>
                  <p>{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Shipping Address</h3>
                  <p>{selectedOrder.shippingAddress}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">฿{item.price.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">฿{(item.price * item.quantity).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-semibold">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ฿{selectedOrder.total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowOrderDetails(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Orders;
