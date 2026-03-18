 import { useState } from "react";
 import {
   Bell,
   BellOff,
   Volume2,
   VolumeX,
   ShoppingCart,
   AlertTriangle,
   UserPlus,
   Package,
   Moon,
   Clock,
   RotateCcw,
   Save,
   Smartphone,
   Monitor,
 } from "lucide-react";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Switch } from "@/components/ui/switch";
 import { Label } from "@/components/ui/label";
 import { Input } from "@/components/ui/input";
 import { Button } from "@/components/ui/button";
 import { Separator } from "@/components/ui/separator";
 import { Badge } from "@/components/ui/badge";
 import { toast } from "sonner";
 import { useNotificationPreferences, NotificationTypePreferences } from "@/hooks/useNotificationPreferences";
 import { useBrowserNotifications } from "@/hooks/useBrowserNotifications";
 import { cn } from "@/lib/utils";
 
 interface NotificationTypeConfig {
   key: keyof NotificationTypePreferences;
   label: string;
   description: string;
   icon: React.ReactNode;
   color: string;
 }
 
 const notificationTypes: NotificationTypeConfig[] = [
   {
     key: "order",
     label: "New Orders",
     description: "When customers place new orders",
     icon: <ShoppingCart className="h-4 w-4" />,
     color: "text-primary",
   },
   {
     key: "low_stock",
     label: "Low Stock Alerts",
     description: "When products are running low",
     icon: <AlertTriangle className="h-4 w-4" />,
     color: "text-amber-500",
   },
   {
     key: "signup",
     label: "New Signups",
     description: "When new customers register",
     icon: <UserPlus className="h-4 w-4" />,
     color: "text-green-500",
   },
   {
     key: "return",
     label: "Return Requests",
     description: "When customers request returns",
     icon: <Package className="h-4 w-4" />,
     color: "text-blue-500",
   },
 ];
 
 const NotificationPreferencesPanel = () => {
   const {
     preferences,
     updatePreferences,
     updatePushType,
     updateInAppType,
     resetToDefaults,
   } = useNotificationPreferences();
 
   const {
     permission,
     isSupported,
     requestPermission,
   } = useBrowserNotifications();
 
   const [isSaving, setIsSaving] = useState(false);
 
   const handleTogglePush = async () => {
     if (!preferences.pushEnabled) {
       // Enabling push
       if (permission !== "granted") {
         const result = await requestPermission();
         if (result !== "granted") {
           toast.error("Permission denied", {
             description: "Please enable notifications in your browser settings",
           });
           return;
         }
       }
       updatePreferences({ pushEnabled: true });
       toast.success("Push notifications enabled");
     } else {
       updatePreferences({ pushEnabled: false });
       toast.info("Push notifications disabled");
     }
   };
 
   const handleSave = () => {
     setIsSaving(true);
     setTimeout(() => {
       setIsSaving(false);
       toast.success("Notification preferences saved");
     }, 500);
   };
 
   const handleReset = () => {
     resetToDefaults();
     toast.info("Preferences reset to defaults");
   };
 
   return (
     <div className="space-y-6">
       {/* Push Notifications Card */}
       <Card>
         <CardHeader>
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className={cn(
                 "p-2 rounded-lg",
                 preferences.pushEnabled ? "bg-primary/10" : "bg-muted"
               )}>
                 {preferences.pushEnabled ? (
                   <Smartphone className="h-5 w-5 text-primary" />
                 ) : (
                   <BellOff className="h-5 w-5 text-muted-foreground" />
                 )}
               </div>
               <div>
                 <CardTitle className="text-lg">Browser Push Notifications</CardTitle>
                 <CardDescription>
                   Receive alerts even when the tab is not active
                 </CardDescription>
               </div>
             </div>
             <div className="flex items-center gap-2">
               {!isSupported && (
                 <Badge variant="secondary">Not Supported</Badge>
               )}
               {isSupported && permission === "denied" && (
                 <Badge variant="destructive">Blocked</Badge>
               )}
               {isSupported && permission === "granted" && preferences.pushEnabled && (
                 <Badge variant="default" className="bg-green-500">Active</Badge>
               )}
               <Switch
                 checked={preferences.pushEnabled}
                 onCheckedChange={handleTogglePush}
                 disabled={!isSupported || permission === "denied"}
               />
             </div>
           </div>
         </CardHeader>
         
         {preferences.pushEnabled && (
           <CardContent className="space-y-4">
             <p className="text-sm text-muted-foreground">
               Choose which notification types trigger browser push alerts:
             </p>
             <div className="grid gap-3">
               {notificationTypes.map((type) => (
                 <div
                   key={type.key}
                   className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                 >
                   <div className="flex items-center gap-3">
                     <div className={cn("p-1.5 rounded-md bg-muted", type.color)}>
                       {type.icon}
                     </div>
                     <div>
                       <p className="text-sm font-medium">{type.label}</p>
                       <p className="text-xs text-muted-foreground">{type.description}</p>
                     </div>
                   </div>
                   <Switch
                     checked={preferences.pushTypes[type.key]}
                     onCheckedChange={(checked) => updatePushType(type.key, checked)}
                   />
                 </div>
               ))}
             </div>
           </CardContent>
         )}
       </Card>
 
       {/* In-App Notifications Card */}
       <Card>
         <CardHeader>
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className={cn(
                 "p-2 rounded-lg",
                 preferences.inAppEnabled ? "bg-primary/10" : "bg-muted"
               )}>
                 <Monitor className="h-5 w-5 text-primary" />
               </div>
               <div>
                 <CardTitle className="text-lg">In-App Notifications</CardTitle>
                 <CardDescription>
                   Toast notifications shown in the admin panel
                 </CardDescription>
               </div>
             </div>
             <Switch
               checked={preferences.inAppEnabled}
               onCheckedChange={(checked) => updatePreferences({ inAppEnabled: checked })}
             />
           </div>
         </CardHeader>
         
         {preferences.inAppEnabled && (
           <CardContent className="space-y-4">
             <p className="text-sm text-muted-foreground">
               Choose which notification types appear as toasts:
             </p>
             <div className="grid gap-3">
               {notificationTypes.map((type) => (
                 <div
                   key={type.key}
                   className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                 >
                   <div className="flex items-center gap-3">
                     <div className={cn("p-1.5 rounded-md bg-muted", type.color)}>
                       {type.icon}
                     </div>
                     <div>
                       <p className="text-sm font-medium">{type.label}</p>
                       <p className="text-xs text-muted-foreground">{type.description}</p>
                     </div>
                   </div>
                   <Switch
                     checked={preferences.inAppTypes[type.key]}
                     onCheckedChange={(checked) => updateInAppType(type.key, checked)}
                   />
                 </div>
               ))}
             </div>
           </CardContent>
         )}
       </Card>
 
       {/* Sound Settings Card */}
       <Card>
         <CardHeader>
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className={cn(
                 "p-2 rounded-lg",
                 preferences.soundEnabled ? "bg-primary/10" : "bg-muted"
               )}>
                 {preferences.soundEnabled ? (
                   <Volume2 className="h-5 w-5 text-primary" />
                 ) : (
                   <VolumeX className="h-5 w-5 text-muted-foreground" />
                 )}
               </div>
               <div>
                 <CardTitle className="text-lg">Notification Sound</CardTitle>
                 <CardDescription>
                   Play a sound when new notifications arrive
                 </CardDescription>
               </div>
             </div>
             <Switch
               checked={preferences.soundEnabled}
               onCheckedChange={(checked) => updatePreferences({ soundEnabled: checked })}
             />
           </div>
         </CardHeader>
       </Card>
 
       {/* Quiet Hours Card */}
       <Card>
         <CardHeader>
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className={cn(
                 "p-2 rounded-lg",
                 preferences.quietHoursEnabled ? "bg-primary/10" : "bg-muted"
               )}>
                 <Moon className="h-5 w-5 text-primary" />
               </div>
               <div>
                 <CardTitle className="text-lg">Quiet Hours</CardTitle>
                 <CardDescription>
                   Pause push notifications during specific hours
                 </CardDescription>
               </div>
             </div>
             <Switch
               checked={preferences.quietHoursEnabled}
               onCheckedChange={(checked) => updatePreferences({ quietHoursEnabled: checked })}
             />
           </div>
         </CardHeader>
         
         {preferences.quietHoursEnabled && (
           <CardContent>
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <Clock className="h-4 w-4 text-muted-foreground" />
                 <Label htmlFor="quiet-start" className="text-sm">From</Label>
                 <Input
                   id="quiet-start"
                   type="time"
                   value={preferences.quietHoursStart}
                   onChange={(e) => updatePreferences({ quietHoursStart: e.target.value })}
                   className="w-28"
                 />
               </div>
               <span className="text-muted-foreground">to</span>
               <div className="flex items-center gap-2">
                 <Label htmlFor="quiet-end" className="text-sm">Until</Label>
                 <Input
                   id="quiet-end"
                   type="time"
                   value={preferences.quietHoursEnd}
                   onChange={(e) => updatePreferences({ quietHoursEnd: e.target.value })}
                   className="w-28"
                 />
               </div>
             </div>
             <p className="text-xs text-muted-foreground mt-2">
               Push notifications will be silenced during these hours
             </p>
           </CardContent>
         )}
       </Card>
 
       {/* Actions */}
       <div className="flex items-center justify-between pt-4">
         <Button variant="outline" onClick={handleReset}>
           <RotateCcw className="h-4 w-4 mr-2" />
           Reset to Defaults
         </Button>
         <Button onClick={handleSave} disabled={isSaving}>
           <Save className="h-4 w-4 mr-2" />
           {isSaving ? "Saving..." : "Save Preferences"}
         </Button>
       </div>
     </div>
   );
 };
 
 export default NotificationPreferencesPanel;