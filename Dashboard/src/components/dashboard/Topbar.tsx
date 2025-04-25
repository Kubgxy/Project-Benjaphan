import React, { useState } from "react";
import { Bell, Moon, Sun, Search, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TopbarProps {
  setDarkMode: (isDark: boolean) => void;
  isDarkMode: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ setDarkMode, isDarkMode }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search for:", searchQuery);
    // This would trigger a global search in a real app
  };

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex-1 flex items-center md:w-auto">
          <form
            onSubmit={handleSearch}
            className="hidden md:block w-full max-w-md"
          >
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ค้นหา..."
                className="w-full pl-8 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <Select
            value={language}
            onValueChange={(value: "th" | "en") => setLanguage(value)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="th">ไทย</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={() => setDarkMode(!isDarkMode)}
            aria-label={t("theme")}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>การแจ้งเตือน</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {[1, 2, 3].map((_, i) => (
                  <DropdownMenuItem
                    key={i}
                    className="flex flex-col items-start py-2"
                  >
                    <p className="font-medium">ออเดอร์ใหม่ #{10001 + i}</p>
                    <p className="text-sm text-muted-foreground">
                      มีการสั่งซื้อสินค้าใหม่
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date().toLocaleDateString()}
                    </p>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center font-medium">
                ดูทั้งหมด
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.firstName
                      ? user.firstName.substring(0, 2).toUpperCase()
                      : "AD"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block">
                  {user?.firstName || "แอดมิน"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" asChild>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>โปรไฟล์</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <div className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>ตั้งค่า</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>ออกจากระบบ</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search bar - shows only on small screens */}
      <div className="md:hidden p-2 bg-background">
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ค้นหา..."
              className="w-full pl-8 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
    </header>
  );
};

export default Topbar;
