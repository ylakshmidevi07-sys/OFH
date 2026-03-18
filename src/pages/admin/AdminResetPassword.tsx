import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authApi } from "@/api/auth.api";
import { toast } from "sonner";
import logoOFH from "@/assets/logo-ofh.png";

const AdminResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) setHasToken(true);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = searchParams.get("token");
    if (!token) { toast.error("Invalid reset link"); return; }

    if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }

    setIsLoading(true);
    try {
      await authApi.resetPassword(token, password);
      toast.success("Password updated successfully! You can now sign in.");
      navigate("/admin/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    }
    setIsLoading(false);
  };

  if (!hasToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center space-y-4">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <img src={logoOFH} alt="OFH Logo" className="h-16 w-auto" />
            </Link>
          </div>
          <Card className="shadow-xl">
            <CardContent className="pt-6 space-y-4">
              <p className="text-muted-foreground">This page is used to reset your password. Please use the link from your email to access it.</p>
              <Link to="/admin/forgot-password">
                <Button variant="outline" className="w-full">Request a new reset link</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <img src={logoOFH} alt="OFH Logo" className="h-16 w-auto" />
          </Link>
          <p className="text-muted-foreground">Admin Panel</p>
        </div>
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <KeyRound className="h-6 w-6 text-primary" />
              Set New Password
            </CardTitle>
            <CardDescription>Choose a strong password for your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required className="pr-10" />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Updating...</span> : <span className="flex items-center gap-2"><KeyRound className="h-4 w-4" />Update Password</span>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminResetPassword;
