import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useLogin } from "@/hooks/queries";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logoOFH from "@/assets/logo-ofh.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@ofh.com");
  const [password, setPassword] = useState("admin@OFH2026");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const loginMutation = useLogin();
  const logout = useAuthStore((s) => s.logout);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          const role = data.user.role as string;
          if (role !== "ADMIN" && role !== "MODERATOR") {
            toast.error("You don't have admin or moderator access.");
            logout(); // clear the login that useLogin's onSuccess already stored
            return;
          }
          toast.success("Welcome back!");
          navigate("/admin");
        },
        onError: (err: any) => {
          const message = err?.response?.data?.message || err?.message || "Login failed.";
          toast.error(message);
        },
      },
    );
  };

  const isLoading = loginMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <img src={logoOFH} alt="OFH Logo" className="h-16 w-auto" />
          </Link>
          <p className="text-muted-foreground">Admin Panel</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>Enter your admin credentials to access the panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@ofh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link to="/admin/forgot-password" className="block text-sm text-primary hover:underline transition-colors">
                Forgot password?
              </Link>
              <Link to="/admin/setup" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                First time? Set up admin account
              </Link>
              <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                ← Back to store
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
