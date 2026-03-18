import { useState } from "react";
import { Mail, UserPlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInviteUsers } from "@/hooks/queries";
import { toast } from "sonner";

const InviteUsersCard = ({ onInvited }: { onInvited?: () => void }) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [role, setRole] = useState("moderator");
  const inviteMutation = useInviteUsers();

  const addEmail = () => {
    const trimmed = currentEmail.trim();
    if (trimmed && !emails.includes(trimmed) && trimmed.includes("@")) {
      setEmails([...emails, trimmed]);
      setCurrentEmail("");
    }
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail();
    }
  };

  const handleInvite = async () => {
    if (emails.length === 0) {
      toast.error("Add at least one email address");
      return;
    }
    try {
      await inviteMutation.mutateAsync({ emails, role });
      toast.success(`${emails.length} user(s) invited successfully`);
      setEmails([]);
      onInvited?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to send invitations");
    }
  };

  const loading = inviteMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Invite Team Members
        </CardTitle>
        <CardDescription>
          Add emails and assign a role. Users will be created with temporary credentials.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Email Addresses</Label>
          <div className="flex gap-2">
            <Input
              placeholder="team@example.com"
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button variant="outline" onClick={addEmail} type="button">
              Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Press Enter or comma to add multiple</p>
        </div>

        {emails.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {emails.map((email) => (
              <Badge key={email} variant="secondary" className="gap-1 pr-1">
                {email}
                <button
                  onClick={() => removeEmail(email)}
                  className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleInvite} disabled={loading || emails.length === 0}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Inviting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Invite {emails.length > 0 ? `${emails.length} user(s)` : ""}
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default InviteUsersCard;
