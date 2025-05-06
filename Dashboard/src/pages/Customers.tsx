import { useState, useEffect } from "react";
import axios from "axios";
import {
  Download,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  UserCog,
  Ban,
  Download as DownloadIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

type CustomerStatus = "active" | "unverified";

const statusColors: Record<CustomerStatus, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  unverified: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const Customers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<any[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [sortBy, setSortBy] = useState<"registeredDate" | "orders">(
    "registeredDate"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:3000/api/user/getAllCustomers",
          {
            withCredentials: true,
          }
        );
        if (res.status !== 200) {
          throw new Error("Failed to fetch customers");
        }
        if (res.data.customers.length === 0) {
          throw new Error("No customers found");
        }
        const formatted = res.data.customers.map((c: any) => ({
          id: c._id,
          name: `${c.firstName} ${c.lastName}`,
          email: c.email,
          phone: c.phoneNumber,
          avatar: c.avatar ? `http://localhost:3000${c.avatar}` : null,
          registeredDate: new Date(c.createdAt),
          orders: c.orders ? c.orders.length : 0,
          status: c.isVerified ? "active" : "unverified",
        }));
        setCustomers(formatted);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load customers" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      (filterStatus === "all" || customer.status === filterStatus) &&
      (customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery))
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === "registeredDate") {
      return sortDirection === "asc"
        ? a.registeredDate.getTime() - b.registeredDate.getTime()
        : b.registeredDate.getTime() - a.registeredDate.getTime();
    } else {
      return sortDirection === "asc"
        ? a.orders - b.orders
        : b.orders - a.orders;
    }
  });

  const handleSort = (column: "registeredDate" | "orders") => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  const exportToCSV = () => {
    toast({
      title: "Export Started",
      description: "Your CSV file is being generated.",
    });
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your CSV file is ready for download.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button
          onClick={exportToCSV}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {customers.filter((c) => c.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Unverified Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {customers.filter((c) => c.status === "unverified").length}
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
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("registeredDate")}
              >
                Registered
                {sortBy === "registeredDate" &&
                  (sortDirection === "asc" ? (
                    <ArrowUp className="inline ml-1 h-4 w-4" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("orders")}
              >
                Orders
                {sortBy === "orders" &&
                  (sortDirection === "asc" ? (
                    <ArrowUp className="inline ml-1 h-4 w-4" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5)
                .fill(null)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))
            ) : sortedCustomers.length > 0 ? (
              sortedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={customer.avatar || "/default-avatar.png"}
                          alt={customer.name}
                          className="h-16 w-16 object-cover"
                        />
                        <AvatarFallback>
                          {customer.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs text-muted-foreground">
                          ID : {customer.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{customer.email}</div>
                    <div className="text-xs text-muted-foreground">
                      Tel : {customer.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(customer.registeredDate, "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        statusColors[customer.status as CustomerStatus]
                      }
                    >
                      {customer.status.charAt(0).toUpperCase() +
                        customer.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Customers;
