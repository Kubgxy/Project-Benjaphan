
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Package, 
  MessageSquare, 
  AlertTriangle, 
  ShoppingBag, 
  Check,
  ArrowDown, 
  ArrowUp,
  Trash2
} from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, subDays, subHours } from 'date-fns';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';

type NotificationType = 'order' | 'message' | 'stock' | 'system';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  date: Date;
  read: boolean;
  link?: string;
}

// Icon mapping for notification types
const typeIcons: Record<NotificationType, React.ReactElement> = {
  order: <ShoppingBag size={16} />,
  message: <MessageSquare size={16} />,
  stock: <Package size={16} />,
  system: <AlertTriangle size={16} />
};

// Background and text color mapping for notification types
const typeColors: Record<NotificationType, string> = {
  order: 'bg-blue-100 text-blue-800 border-blue-200',
  message: 'bg-green-100 text-green-800 border-green-200',
  stock: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  system: 'bg-red-100 text-red-800 border-red-200'
};

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: 'N001',
    title: 'New Order Received',
    message: 'Order #ORD-2023-001 has been placed for ฿1,290.',
    type: 'order',
    date: subHours(new Date(), 2),
    read: false,
    link: '/dashboard/orders'
  },
  {
    id: 'N002',
    title: 'New Message',
    message: 'Somchai Jaidee has sent you a message about Lucky Dragon Pendant.',
    type: 'message',
    date: subHours(new Date(), 5),
    read: true,
    link: '/dashboard/messages'
  },
  {
    id: 'N003',
    title: 'Low Stock Alert',
    message: 'Jade Bracelet (SKU: JB-001) is running low on stock (Only 2 left).',
    type: 'stock',
    date: subHours(new Date(), 8),
    read: false,
    link: '/dashboard/products'
  },
  {
    id: 'N004',
    title: 'New Order Received',
    message: 'Order #ORD-2023-002 has been placed for ฿890.',
    type: 'order',
    date: subHours(new Date(), 12),
    read: true,
    link: '/dashboard/orders'
  },
  {
    id: 'N005',
    title: 'System Update',
    message: 'The admin dashboard will be undergoing maintenance tonight from 2:00 AM to 4:00 AM.',
    type: 'system',
    date: subHours(new Date(), 18),
    read: true
  },
  {
    id: 'N006',
    title: 'Low Stock Alert',
    message: 'Wealth Frog (SKU: WF-001) is running low on stock (Only 3 left).',
    type: 'stock',
    date: subDays(new Date(), 1),
    read: true,
    link: '/dashboard/products'
  },
  {
    id: 'N007',
    title: 'New Message',
    message: 'Pranee Sawasdee has sent you a message about Custom Amulet Request.',
    type: 'message',
    date: subDays(new Date(), 1),
    read: false,
    link: '/dashboard/messages'
  },
  {
    id: 'N008',
    title: 'New Order Received',
    message: 'Order #ORD-2023-003 has been placed for ฿1,500.',
    type: 'order',
    date: subDays(new Date(), 2),
    read: true,
    link: '/dashboard/orders'
  }
];

const Notifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);
  
  // Count unread notifications
  const unreadCount = notifications.filter(notif => !notif.read).length;

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => 
    (typeFilter === 'all' || notification.type === typeFilter) &&
    (readFilter === 'all' || 
     (readFilter === 'read' && notification.read) || 
     (readFilter === 'unread' && !notification.read)) &&
    (
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Sort notifications by date
  const sortedNotifications = [...filteredNotifications].sort((a, b) => 
    sortDirection === 'desc' 
      ? b.date.getTime() - a.date.getTime() 
      : a.date.getTime() - b.date.getTime()
  );

  // Handle toggle sort
  const handleToggleSort = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "Notifications Updated",
      description: "All notifications have been marked as read.",
    });
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowDeleteDialog(true);
  };

  // Handle notification delete
  const handleDeleteNotification = () => {
    if (!selectedNotification) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== selectedNotification.id));
      setIsLoading(false);
      setShowDeleteDialog(false);
      
      toast({
        title: "Notification Deleted",
        description: "The notification has been deleted successfully.",
      });
    }, 500);
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setNotifications([]);
      setIsLoading(false);
      setShowClearAllDialog(false);
      
      toast({
        title: "Notifications Cleared",
        description: "All notifications have been cleared.",
      });
    }, 500);
  };

  // Simulate receiving a new notification
  useEffect(() => {
    const timer = setTimeout(() => {
      const newNotification: Notification = {
        id: `N${(notifications.length + 1).toString().padStart(3, '0')}`,
        title: 'New Order Received',
        message: `Order #ORD-2023-${Math.floor(Math.random() * 900) + 100} has been placed for ฿${(Math.floor(Math.random() * 5000) + 500).toLocaleString()}.`,
        type: 'order',
        date: new Date(),
        read: false,
        link: '/dashboard/orders'
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      toast({
        title: "New Order Notification",
        description: "A new order has been received.",
      });
    }, 30000); // Simulate new notification after 30 seconds
    
    return () => clearTimeout(timer);
  }, [notifications, toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => markAllAsRead()}
            disabled={unreadCount === 0}
          >
            <Check className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
          <Button 
            variant="outline" 
            className="text-red-600"
            onClick={() => setShowClearAllDialog(true)}
            disabled={notifications.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Order Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {notifications.filter(n => n.type === 'order').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {notifications.filter(n => n.type === 'stock').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64">
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="order">Orders</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
                <SelectItem value="stock">Stock Alerts</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Select value={readFilter} onValueChange={setReadFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
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
              <TableHead className="w-[80px]">Type</TableHead>
              <TableHead>Notification</TableHead>
              <TableHead className="cursor-pointer w-[160px]" onClick={handleToggleSort}>
                Date
                {sortDirection === 'asc' ? 
                  <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                  <ArrowDown className="inline ml-1 h-4 w-4" />
                }
              </TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              sortedNotifications.length > 0 ? (
                sortedNotifications.map((notification) => (
                  <TableRow 
                    key={notification.id}
                    className={notification.read ? '' : 'bg-rowhighlight'}
                  >
                    <TableCell>
                      <Badge className={typeColors[notification.type]}>
                        <span className="flex items-center">
                          {typeIcons[notification.type]}
                          <span className="ml-1 hidden sm:inline">
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </span>
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={notification.read ? '' : 'font-semibold'}>
                        {notification.title}
                        <div className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(notification.date, 'MMM dd, yyyy')}
                      <div className="text-xs text-muted-foreground">
                        {format(notification.date, 'HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {notification.read ? (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Read
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          Unread
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check size={16} className="mr-1" />
                            Mark Read
                          </Button>
                        )}
                        {notification.link && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            asChild
                          >
                            <a href={notification.link}>View</a>
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openDeleteDialog(notification)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center py-8">
                      <Bell size={40} className="text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No notifications found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        {selectedNotification && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Notification</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this notification? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <h3 className="font-semibold">{selectedNotification.title}</h3>
              <p className="text-muted-foreground">{selectedNotification.message}</p>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteNotification}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Clear All Confirmation Dialog */}
      <Dialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Clear All Notifications</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all notifications? This will remove {notifications.length} notifications and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowClearAllDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={clearAllNotifications}
              disabled={isLoading}
            >
              {isLoading ? 'Clearing...' : 'Clear All'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notifications;
