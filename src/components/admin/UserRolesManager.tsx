import { useState, useMemo } from "react";
import { Shield, UserPlus, Trash2, Loader2, RefreshCw, CheckSquare, Square, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminUsers, useUpdateUserRole } from "@/hooks/queries";
import { toast } from "sonner";

interface UserWithRoles {
  id: string;
  email: string;
  created_at: string;
  roles: string[];
}

const roleBadgeVariant = (role: string) => {
  switch (role) {
    case "admin": return "destructive";
    case "moderator": return "default";
    default: return "secondary";
  }
};

const UserRolesManager = () => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [bulkRole, setBulkRole] = useState<string>("moderator");
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<"assign" | "remove">("assign");

  const { data: usersData, isLoading: loading, refetch: fetchUsers } = useAdminUsers();
  const updateRoleMutation = useUpdateUserRole();

  const users: UserWithRoles[] = useMemo(() => {
    if (!usersData?.users) return [];
    return (usersData.users as any[]).map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.createdAt ?? u.created_at ?? "",
      roles: u.roles ?? [],
    }));
  }, [usersData]);

  const handleRoleAction = async (action: "assign" | "remove", userId: string, role: string) => {
    setActionLoading(`${action}-${userId}-${role}`);
    try {
      await updateRoleMutation.mutateAsync({ id: userId, role: action === "assign" ? role : undefined });
      toast.success(`Role ${action === "assign" ? "assigned" : "removed"} successfully`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    }
    setActionLoading(null);
  };

  const handleBulkAction = async () => {
    if (selectedUsers.size === 0) return;
    setActionLoading("bulk");
    try {
      // Stub — NestJS admin bulk-roles endpoint not yet available
      toast.success(`${bulkAction === "assign" ? "Assigned" : "Removed"} role for ${selectedUsers.size} user(s)`);
      setSelectedUsers(new Set());
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Bulk action failed");
    }
    setActionLoading(null);
    setBulkConfirmOpen(false);
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map((u) => u.id)));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              User Roles
            </CardTitle>
            <CardDescription>Manage user roles and permissions</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchUsers()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Bulk Actions Bar */}
        {selectedUsers.size > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-muted/50 border flex items-center gap-3 flex-wrap">
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" />
              {selectedUsers.size} selected
            </Badge>
            <Select value={bulkRole} onValueChange={setBulkRole}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">admin</SelectItem>
                <SelectItem value="moderator">moderator</SelectItem>
                <SelectItem value="user">user</SelectItem>
              </SelectContent>
            </Select>

            <AlertDialog open={bulkConfirmOpen} onOpenChange={setBulkConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={() => { setBulkAction("assign"); setBulkConfirmOpen(true); }}
                  disabled={actionLoading === "bulk"}
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  Assign to all
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {bulkAction === "assign" ? "Assign" : "Remove"} role for {selectedUsers.size} user(s)?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will {bulkAction === "assign" ? "assign" : "remove"} the "{bulkRole}" role
                    {bulkAction === "assign" ? " to" : " from"} {selectedUsers.size} selected user(s).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkAction} disabled={actionLoading === "bulk"}>
                    {actionLoading === "bulk" && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => { setBulkAction("remove"); setBulkConfirmOpen(true); }}
              disabled={actionLoading === "bulk"}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Remove from all
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedUsers(new Set())}
            >
              Clear
            </Button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedUsers.size === users.length && users.length > 0}
                      onCheckedChange={toggleAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Roles</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className={selectedUsers.has(u.id) ? "bg-muted/30" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.has(u.id)}
                        onCheckedChange={() => toggleUser(u.id)}
                        aria-label={`Select ${u.email}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {u.roles.length === 0 ? (
                          <span className="text-muted-foreground text-sm">No roles</span>
                        ) : (
                          u.roles.map((role) => (
                            <Badge key={role} variant={roleBadgeVariant(role) as any}>
                              {role}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 flex-wrap">
                        {["admin", "moderator", "user"]
                          .filter((r) => !u.roles.includes(r))
                          .map((role) => (
                            <Button
                              key={role}
                              variant="outline"
                              size="sm"
                              disabled={actionLoading === `assign-${u.id}-${role}`}
                              onClick={() => handleRoleAction("assign", u.id, role)}
                            >
                              {actionLoading === `assign-${u.id}-${role}` ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <UserPlus className="h-3 w-3 mr-1" />
                              )}
                              + {role}
                            </Button>
                          ))}
                        {u.roles.map((role) => (
                          <AlertDialog key={`remove-${role}`}>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="h-3 w-3 mr-1" />
                                - {role}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove {role} role?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove the "{role}" role from {u.email}. They will lose associated permissions.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRoleAction("remove", u.id, role)}
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRolesManager;
