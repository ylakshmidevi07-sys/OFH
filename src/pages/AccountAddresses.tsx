import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { MapPin, Plus, Trash2, ArrowLeft, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useAuthStore } from "@/stores/authStore";
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from "@/hooks/queries";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: string;
  label: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string | null;
  is_default: boolean;
}

const AccountAddresses = () => {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: "Home",
    first_name: "",
    last_name: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
  });

  const { data: rawAddresses, isLoading: queryLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const loading = authLoading || queryLoading;

  const addresses: Address[] = useMemo(() => {
    if (!rawAddresses) return [];
    return rawAddresses.map((a) => ({
      id: a.id,
      label: a.label,
      first_name: a.firstName,
      last_name: a.lastName,
      address: a.address,
      city: a.city,
      state: a.state,
      zip_code: a.zipCode,
      phone: a.phone ?? null,
      is_default: a.isDefault,
    }));
  }, [rawAddresses]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createAddress.mutateAsync({
        label: formData.label,
        firstName: formData.first_name,
        lastName: formData.last_name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zip_code,
        phone: formData.phone || undefined,
      });
      toast({
        title: "Address added",
        description: "Your new address has been saved.",
      });
      setFormData({
        label: "Home",
        first_name: "",
        last_name: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        phone: "",
      });
      setIsDialogOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to add address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user) return;

    try {
      await updateAddress.mutateAsync({ id: addressId, isDefault: true });
      toast({
        title: "Default updated",
        description: "Your default address has been updated.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to set default address.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (addressId: string) => {
    try {
      await deleteAddress.mutateAsync(addressId);
      toast({
        title: "Address deleted",
        description: "The address has been removed.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isSaving = createAddress.isPending;

  if (authLoading || loading) {
    return (
      <PageTransition>
        <Navbar />
        <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Saved Addresses | OFH</title>
        <meta name="description" content="Manage your saved delivery addresses." />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" className="mb-4" onClick={() => navigate("/account")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Account
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Saved Addresses
                </h1>
                <p className="font-body text-muted-foreground mt-2">
                  Manage your delivery addresses
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="label">Label</Label>
                      <Input
                        id="label"
                        name="label"
                        value={formData.label}
                        onChange={handleInputChange}
                        placeholder="Home, Office, etc."
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip_code">ZIP</Label>
                        <Input
                          id="zip_code"
                          name="zip_code"
                          value={formData.zip_code}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Address"
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          {addresses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center py-16"
            >
              <MapPin className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                No addresses saved
              </h2>
              <p className="font-body text-muted-foreground mb-8">
                Add an address to make checkout faster.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address, index) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl p-6 shadow-soft"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-semibold text-foreground">
                            {address.label}
                          </h3>
                          {address.is_default && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="font-body text-sm text-muted-foreground">
                          {address.first_name} {address.last_name}
                        </p>
                        <p className="font-body text-sm text-muted-foreground">
                          {address.address}
                        </p>
                        <p className="font-body text-sm text-muted-foreground">
                          {address.city}, {address.state} {address.zip_code}
                        </p>
                        {address.phone && (
                          <p className="font-body text-sm text-muted-foreground">
                            {address.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!address.is_default && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(address.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default AccountAddresses;
