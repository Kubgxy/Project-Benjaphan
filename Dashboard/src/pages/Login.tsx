
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { AlertCircle } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const login = async (email: string, password: string) => {
//     try {
//       const res = await fetch('http://localhost:3000/api/user/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//         credentials: 'include', // ✅ สำคัญมาก!
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       // ✅ ดึง role ที่ Backend ส่งกลับมา
//       return data.user.role as 'customer' | 'admin';
//     } catch (error) {
//       console.error('❌ Login error:', error);
//       return null;
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);
  
//     try {
//       const role = await login(email, password);
  
//       if (!role) {
//         alert ("เข้าสู่ระบบไม่สําเร็จ!");
//         return;
//       }
  
//       if (role === "customer") {
//         window.location.href = "http://localhost:5173/";
//       } else if (role === "admin") {
//         window.location.href = "http://localhost:5174/";
//       } else {
//       }
//     } catch (err) {
//       alert ("กรุณาลองอีกครั้ง!");
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-muted/50">
//       <div className="max-w-md w-full px-4">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
//           <p className="text-muted-foreground mt-2">Lucky Jewelry E-commerce</p>
//         </div>
        
//         <Card>
//           <CardHeader>
//             <CardTitle>Login to Admin Panel</CardTitle>
//             <CardDescription>
//               Enter your credentials to access the admin dashboard
//             </CardDescription>
//           </CardHeader>
//           <form onSubmit={handleSubmit}>
//             <CardContent className="space-y-4">
//               {error && (
//                 <Alert variant="destructive">
//                   <AlertCircle className="h-4 w-4" />
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}
              
//               <div className="space-y-2">
//                 <Label htmlFor="username">Username</Label>
//                 <Input
//                   id="username"
//                   placeholder="Enter your username (admin)"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="password">Password</Label>
//                 </div>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="Enter your password (password123)"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
              
//               <div className="pt-2">
//                 <p className="text-xs text-muted-foreground">
//                   Demo Credentials: username: <strong>admin</strong>, password: <strong>password123</strong>
//                 </p>
//               </div>
//             </CardContent>
//             <CardFooter>
//               <Button 
//                 type="submit" 
//                 className="w-full" 
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <span className="flex items-center gap-2">
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
//                     Logging in...
//                   </span>
//                 ) : (
//                   'Login'
//                 )}
//               </Button>
//             </CardFooter>
//           </form>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Login;
