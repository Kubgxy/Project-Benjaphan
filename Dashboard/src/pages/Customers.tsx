
import { useState } from 'react';
import { Download, ArrowUp, ArrowDown, MoreHorizontal, UserCog, Ban, Download as DownloadIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

// Mock customers data
const mockCustomers = [
  {
    id: 'C001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+66 98 765 4321',
    address: '123 Main St, Bangkok, Thailand',
    registeredDate: new Date('2023-01-15'),
    orders: 12,
    totalSpent: 34560,
    status: 'active'
  },
  {
    id: 'C002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+66 91 234 5678',
    address: '456 Park Ave, Chiang Mai, Thailand',
    registeredDate: new Date('2023-02-20'),
    orders: 8,
    totalSpent: 15890,
    status: 'active'
  },
  {
    id: 'C003',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+66 83 456 7890',
    address: '789 River Rd, Phuket, Thailand',
    registeredDate: new Date('2023-03-10'),
    orders: 5,
    totalSpent: 8750,
    status: 'banned'
  },
  {
    id: 'C004',
    name: 'Sarah Lee',
    email: 'sarah@example.com',
    phone: '+66 86 789 0123',
    address: '101 Ocean View, Pattaya, Thailand',
    registeredDate: new Date('2023-04-05'),
    orders: 3,
    totalSpent: 6200,
    status: 'active'
  },
  {
    id: 'C005',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    phone: '+66 82 345 6789',
    address: '202 Mountain Road, Chiang Rai, Thailand',
    registeredDate: new Date('2023-04-15'),
    orders: 1,
    totalSpent: 1590,
    status: 'active'
  },
];

type CustomerStatus = 'active' | 'banned';

const statusColors: Record<CustomerStatus, string> = {
  active: 'bg-green-100 text-green-800 border-green-200',
  banned: 'bg-red-100 text-red-800 border-red-200',
};

const Customers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState(mockCustomers);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<'registeredDate' | 'orders' | 'totalSpent'>('registeredDate');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof customers)[0] | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);

  // Filter customers
  const filteredCustomers = customers.filter(customer => 
    (filterStatus === 'all' || customer.status === filterStatus) &&
    (
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    )
  );

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === 'registeredDate') {
      return sortDirection === 'asc' 
        ? a.registeredDate.getTime() - b.registeredDate.getTime() 
        : b.registeredDate.getTime() - a.registeredDate.getTime();
    } else if (sortBy === 'orders') {
      return sortDirection === 'asc' 
        ? a.orders - b.orders 
        : b.orders - a.orders;
    } else {
      return sortDirection === 'asc' 
        ? a.totalSpent - b.totalSpent 
        : b.totalSpent - a.totalSpent;
    }
  });

  // Handle sort
  const handleSort = (column: 'registeredDate' | 'orders' | 'totalSpent') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  // Handle view customer details
  const viewCustomerDetails = (customer: (typeof customers)[0]) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  // Handle status change
  const handleStatusChange = (customerId: string, newStatus: CustomerStatus) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer.id === customerId ? { ...customer, status: newStatus } : customer
        )
      );
      setIsLoading(false);
      setShowBanDialog(false);
      toast({
        title: newStatus === 'banned' ? "Customer Banned" : "Customer Unbanned",
        description: `Customer ${customerId} has been ${newStatus === 'banned' ? 'banned' : 'unbanned'}.`,
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

  // Handle ban/unban dialog
  const openBanDialog = (customer: (typeof customers)[0]) => {
    setSelectedCustomer(customer);
    setShowBanDialog(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {customers.filter(c => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Banned Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {customers.filter(c => c.status === 'banned').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ฿{customers.reduce((acc, customer) => acc + customer.totalSpent, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64">
            <Input
              placeholder="Search customers..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
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
              <TableHead>Customer</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('registeredDate')}>
                Registered
                {sortBy === 'registeredDate' && (
                  sortDirection === 'asc' ? 
                  <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                  <ArrowDown className="inline ml-1 h-4 w-4" />
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('orders')}>
                Orders
                {sortBy === 'orders' && (
                  sortDirection === 'asc' ? 
                  <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                  <ArrowDown className="inline ml-1 h-4 w-4" />
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('totalSpent')}>
                Total Spent
                {sortBy === 'totalSpent' && (
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
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 float-right" /></TableCell>
                </TableRow>
              ))
            ) : (
              sortedCustomers.length > 0 ? (
                sortedCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-muted-foreground">{customer.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{customer.email}</div>
                      <div className="text-xs text-muted-foreground">{customer.phone}</div>
                    </TableCell>
                    <TableCell>{format(customer.registeredDate, 'dd MMM yyyy')}</TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>฿{customer.totalSpent.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[customer.status as CustomerStatus]}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => viewCustomerDetails(customer)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {customer.status === 'active' ? (
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => openBanDialog(customer)}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Ban Customer
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(customer.id, 'active')}
                            >
                              <UserCog className="mr-2 h-4 w-4" />
                              Unban Customer
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No customers found
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={showCustomerDetails} onOpenChange={setShowCustomerDetails}>
        {selectedCustomer && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>
                Customer ID: {selectedCustomer.id}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {selectedCustomer.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{selectedCustomer.name}</h2>
                  <p className="text-muted-foreground">
                    Member since {format(selectedCustomer.registeredDate, 'MMMM yyyy')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Contact Information</h3>
                  <p className="text-sm">Email: {selectedCustomer.email}</p>
                  <p className="text-sm">Phone: {selectedCustomer.phone}</p>
                  <p className="text-sm mt-2">Address: {selectedCustomer.address}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Account Status</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className={statusColors[selectedCustomer.status as CustomerStatus]}>
                      {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                    </Badge>
                    {selectedCustomer.status === 'active' ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600"
                        onClick={() => {
                          setShowCustomerDetails(false);
                          setTimeout(() => openBanDialog(selectedCustomer), 100);
                        }}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Ban Customer
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleStatusChange(selectedCustomer.id, 'active')}
                      >
                        <UserCog className="mr-2 h-4 w-4" />
                        Unban Customer
                      </Button>
                    )}
                  </div>
                  <h3 className="font-semibold mb-1">Purchase History</h3>
                  <p className="text-sm">Total Orders: {selectedCustomer.orders}</p>
                  <p className="text-sm">Total Spent: ฿{selectedCustomer.totalSpent.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCustomerDetails(false)}
                >
                  Close
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={exportToCSV}
                >
                  <DownloadIcon size={16} />
                  Export Order History
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Ban Customer Confirmation Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        {selectedCustomer && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Ban Customer</DialogTitle>
              <DialogDescription>
                Are you sure you want to ban {selectedCustomer.name}? This will prevent them from placing new orders.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowBanDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleStatusChange(selectedCustomer.id, 'banned')}
              >
                Ban Customer
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Customers;
