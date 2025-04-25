
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  MessageSquare, 
  CheckCircle, 
  Circle, 
  Trash2,
  Filter
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';

// Mock messages data
const mockMessages = [
  {
    id: 'MSG001',
    name: 'Somchai Jaidee',
    email: 'somchai@example.com',
    phone: '+66 98 765 4321',
    subject: 'Question about Lucky Dragon Pendant',
    message: 'Hello, I\'m interested in purchasing the Lucky Dragon Pendant but I have a question about its size. Could you provide the dimensions? Also, is it suitable for daily wear or more for special occasions? Thank you!',
    date: new Date('2023-04-18T14:32:00'),
    read: false
  },
  {
    id: 'MSG002',
    name: 'Nattapong Wongsa',
    email: 'nattapong@example.com',
    phone: '+66 91 234 5678',
    subject: 'Order Shipping Inquiry',
    message: 'I placed an order (Order #1234) three days ago and haven\'t received any shipping confirmation. Could you please check the status of my order? I need these items before next weekend for a special ceremony.',
    date: new Date('2023-04-17T09:15:00'),
    read: true
  },
  {
    id: 'MSG003',
    name: 'Pranee Sawasdee',
    email: 'pranee@example.com',
    phone: '+66 83 456 7890',
    subject: 'Custom Amulet Request',
    message: 'I\'m interested in getting a custom amulet made for my father\'s 60th birthday. He was born in the year of the dragon and I\'d like something special that brings good fortune and long life. Do you offer custom pieces? What would the process and timeline look like?',
    date: new Date('2023-04-16T16:45:00'),
    read: false
  },
  {
    id: 'MSG004',
    name: 'Siriwan Thongchai',
    email: 'siriwan@example.com',
    phone: '+66 86 789 0123',
    subject: 'Wholesale Inquiry',
    message: 'I run a small gift shop in Chiang Mai and am interested in wholesale opportunities for your lucky bamboo arrangements and smaller amulets. Could you please send me your wholesale catalog and minimum order requirements? Thank you for your time.',
    date: new Date('2023-04-15T11:20:00'),
    read: true
  },
  {
    id: 'MSG005',
    name: 'Arthit Sakda',
    email: 'arthit@example.com',
    phone: '+66 82 345 6789',
    subject: 'Question about Feng Shui Consultation',
    message: 'I noticed on your website that you offer Feng Shui consultations. I\'ve recently moved into a new home and would like to arrange the space to maximize positive energy and prosperity. Do you provide remote consultations or would you need to visit in person? What are your fees for this service?',
    date: new Date('2023-04-14T13:55:00'),
    read: false
  },
];

const Messages = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState(mockMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [readFilter, setReadFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<(typeof messages)[0] | null>(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Count unread messages
  const unreadCount = messages.filter(msg => !msg.read).length;

  // Filter messages
  const filteredMessages = messages.filter(message => 
    (readFilter === 'all' || 
     (readFilter === 'read' && message.read) || 
     (readFilter === 'unread' && !message.read)) &&
    (
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Sort messages by date (newest first)
  const sortedMessages = [...filteredMessages].sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  );

  // Handle message view
  const viewMessage = (message: (typeof messages)[0]) => {
    setSelectedMessage(message);
    setShowMessageDialog(true);
    
    // Mark as read if not already
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  // Mark message as read
  const markAsRead = (messageId: string) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (message: (typeof messages)[0]) => {
    setSelectedMessage(message);
    setShowDeleteDialog(true);
  };

  // Handle message delete
  const handleDeleteMessage = () => {
    if (!selectedMessage) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== selectedMessage.id));
      setIsLoading(false);
      setShowDeleteDialog(false);
      
      toast({
        title: "Message Deleted",
        description: "The message has been deleted successfully.",
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button variant="outline" onClick={() => setMessages(prevMessages => 
          prevMessages.map(msg => ({ ...msg, read: true }))
        )}>
          Mark All as Read
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Read Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {messages.length - unreadCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64">
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={readFilter} onValueChange={setReadFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
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
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(null).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-4 rounded-full" /></TableCell>
                  <TableCell>
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : (
              sortedMessages.length > 0 ? (
                sortedMessages.map((message) => (
                  <TableRow 
                    key={message.id} 
                    className={message.read ? '' : 'bg-blue-50 hover:bg-blue-100'}
                  >
                    <TableCell>
                      {message.read ? 
                        <CheckCircle size={16} className="text-green-500" /> : 
                        <Circle size={16} className="text-blue-500" />
                      }
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className={message.read ? 'font-normal' : 'font-bold'}>
                          {message.name}
                        </div>
                        <div className="text-xs text-muted-foreground">{message.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        <span className={message.read ? 'font-normal' : 'font-bold'}>
                          {message.subject}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(message.date, 'MMM dd, yyyy')}
                      <div className="text-xs text-muted-foreground">
                        {format(message.date, 'HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => viewMessage(message)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openDeleteDialog(message)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    <div className="flex flex-col items-center py-8">
                      <MessageSquare size={40} className="text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No messages found</h3>
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

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        {selectedMessage && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedMessage.subject}</DialogTitle>
              <DialogDescription>
                From {selectedMessage.name} ({selectedMessage.email})
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6">
              <div className="bg-muted/30 rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm">
                      <strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})
                    </p>
                    {selectedMessage.phone && (
                      <p className="text-sm">
                        <strong>Phone:</strong> {selectedMessage.phone}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-right">
                    <p>{format(selectedMessage.date, 'MMMM dd, yyyy')}</p>
                    <p>{format(selectedMessage.date, 'HH:mm:ss')}</p>
                  </div>
                </div>
                <div className="whitespace-pre-line">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowMessageDialog(false)}
              >
                Close
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  setShowMessageDialog(false);
                  setTimeout(() => openDeleteDialog(selectedMessage), 100);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        {selectedMessage && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this message from {selectedMessage.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
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
                onClick={handleDeleteMessage}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete Message'}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Messages;
