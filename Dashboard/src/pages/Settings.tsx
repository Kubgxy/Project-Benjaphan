
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Check, Save, Lock, Store, Tag, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/separator';

// Define schema for store settings
const storeSettingsSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  storeDescription: z.string().optional(),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(1, "Address is required"),
  currency: z.string().min(1, "Currency is required"),
  displayPricesWithTax: z.boolean(),
  allowGuestCheckout: z.boolean(),
  showOutOfStockItems: z.boolean(),
  enableCustomerRegistration: z.boolean(),
});

// Define schema for promotion settings
const promotionSettingsSchema = z.object({
  defaultDiscountPercentage: z.coerce.number().min(0).max(100),
  enableAutomaticDiscounts: z.boolean(),
  minOrderValueForDiscount: z.coerce.number().min(0),
  maxDiscountAmount: z.coerce.number().min(0),
  displayDiscountBadges: z.boolean(),
  enableFlashSales: z.boolean(),
  promotionBannerText: z.string().max(100, "Banner text must be less than 100 characters"),
});

// Define schema for security settings
const securitySettingsSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Settings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Store settings form
  const storeForm = useForm<z.infer<typeof storeSettingsSchema>>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      storeName: "Lucky Jewelry",
      storeDescription: "Authentic Thai amulets and jewelry for prosperity and good fortune",
      contactEmail: "contact@luckyjewelry.com",
      contactPhone: "+66 98 765 4321",
      address: "123 Prosperity Lane, Bangkok, Thailand",
      currency: "THB",
      displayPricesWithTax: true,
      allowGuestCheckout: true,
      showOutOfStockItems: false,
      enableCustomerRegistration: true,
    },
  });

  // Promotion settings form
  const promotionForm = useForm<z.infer<typeof promotionSettingsSchema>>({
    resolver: zodResolver(promotionSettingsSchema),
    defaultValues: {
      defaultDiscountPercentage: 10,
      enableAutomaticDiscounts: true,
      minOrderValueForDiscount: 1000,
      maxDiscountAmount: 500,
      displayDiscountBadges: true,
      enableFlashSales: true,
      promotionBannerText: "Special Offer: 10% off all orders over ฿1,000!",
    },
  });

  // Security settings form
  const securityForm = useForm<z.infer<typeof securitySettingsSchema>>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handle store settings submission
  const onStoreSubmit = (data: z.infer<typeof storeSettingsSchema>) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Store settings:", data);
      setIsLoading(false);
      
      toast({
        title: "Store Settings Updated",
        description: "Your store settings have been saved successfully.",
      });
    }, 1000);
  };

  // Handle promotion settings submission
  const onPromotionSubmit = (data: z.infer<typeof promotionSettingsSchema>) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Promotion settings:", data);
      setIsLoading(false);
      
      toast({
        title: "Promotion Settings Updated",
        description: "Your promotion settings have been saved successfully.",
      });
    }, 1000);
  };

  // Handle security settings submission
  const onSecuritySubmit = (data: z.infer<typeof securitySettingsSchema>) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Password changed"); // Don't log actual passwords!
      setIsLoading(false);
      
      // Reset form
      securityForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      toast({
        title: "Password Changed",
        description: "Your admin password has been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your store settings, promotions, and security
        </p>
      </div>
      
      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* Store Settings Tab */}
        <TabsContent value="store">
          <Form {...storeForm}>
            <form onSubmit={storeForm.handleSubmit(onStoreSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Store className="mr-2" size={20} />
                    Store Information
                  </CardTitle>
                  <CardDescription>
                    Basic information about your store
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={storeForm.control}
                      name="storeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={storeForm.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="THB">Thai Baht (฿)</SelectItem>
                              <SelectItem value="USD">US Dollar ($)</SelectItem>
                              <SelectItem value="EUR">Euro (€)</SelectItem>
                              <SelectItem value="GBP">British Pound (£)</SelectItem>
                              <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={storeForm.control}
                    name="storeDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Describe your store..."
                            className="resize-none h-20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <h3 className="font-medium">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={storeForm.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={storeForm.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={storeForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="resize-none h-20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <h3 className="font-medium">Store Preferences</h3>
                  <div className="space-y-4">
                    <FormField
                      control={storeForm.control}
                      name="displayPricesWithTax"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Display Prices with Tax</FormLabel>
                            <FormDescription>
                              Show product prices including tax
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={storeForm.control}
                      name="allowGuestCheckout"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Allow Guest Checkout</FormLabel>
                            <FormDescription>
                              Allow customers to checkout without creating an account
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={storeForm.control}
                      name="showOutOfStockItems"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Show Out of Stock Items</FormLabel>
                            <FormDescription>
                              Display products even when they're out of stock
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={storeForm.control}
                      name="enableCustomerRegistration"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Enable Customer Registration</FormLabel>
                            <FormDescription>
                              Allow customers to create accounts on your store
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="ml-auto"
                    disabled={isLoading || !storeForm.formState.isDirty}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
        
        {/* Promotions Tab */}
        <TabsContent value="promotions">
          <Form {...promotionForm}>
            <form onSubmit={promotionForm.handleSubmit(onPromotionSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="mr-2" size={20} />
                    Promotion Settings
                  </CardTitle>
                  <CardDescription>
                    Configure default promotion and discount settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={promotionForm.control}
                      name="defaultDiscountPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Discount Percentage</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Input 
                                type="number" 
                                min={0} 
                                max={100} 
                                {...field} 
                              />
                              <span className="ml-2">%</span>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Default discount applied to promotions
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={promotionForm.control}
                      name="minOrderValueForDiscount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Order Value for Discount</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <span className="mr-2">฿</span>
                              <Input 
                                type="number" 
                                min={0} 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={promotionForm.control}
                    name="maxDiscountAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Discount Amount</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <span className="mr-2">฿</span>
                            <Input 
                              type="number" 
                              min={0} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Maximum discount amount that can be applied to any order
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={promotionForm.control}
                    name="promotionBannerText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promotion Banner Text</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Text displayed on the promotion banner
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <h3 className="font-medium">Promotion Options</h3>
                  <div className="space-y-4">
                    <FormField
                      control={promotionForm.control}
                      name="enableAutomaticDiscounts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Enable Automatic Discounts</FormLabel>
                            <FormDescription>
                              Automatically apply discounts to eligible orders
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={promotionForm.control}
                      name="displayDiscountBadges"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Display Discount Badges</FormLabel>
                            <FormDescription>
                              Show discount badges on product listings
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={promotionForm.control}
                      name="enableFlashSales"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Enable Flash Sales</FormLabel>
                            <FormDescription>
                              Allow time-limited flash sales with special discounts
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="ml-auto"
                    disabled={isLoading || !promotionForm.formState.isDirty}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <Form {...securityForm}>
            <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="mr-2" size={20} />
                    Change Admin Password
                  </CardTitle>
                  <CardDescription>
                    Update your admin account password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={securityForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securityForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securityForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="ml-auto"
                    disabled={isLoading || !securityForm.formState.isDirty}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
