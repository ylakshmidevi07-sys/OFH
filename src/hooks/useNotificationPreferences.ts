 import { useState, useEffect, useCallback } from "react";
 
 export interface NotificationTypePreferences {
   order: boolean;
   low_stock: boolean;
   signup: boolean;
   return: boolean;
 }
 
 export interface NotificationPreferences {
   // Push notification settings
   pushEnabled: boolean;
   pushTypes: NotificationTypePreferences;
   
   // In-app notification settings
   inAppEnabled: boolean;
   inAppTypes: NotificationTypePreferences;
   
   // Sound settings
   soundEnabled: boolean;
   
   // Quiet hours
   quietHoursEnabled: boolean;
   quietHoursStart: string;
   quietHoursEnd: string;
 }
 
 const STORAGE_KEY = "admin_notification_preferences";
 
 const defaultPreferences: NotificationPreferences = {
   pushEnabled: false,
   pushTypes: {
     order: true,
     low_stock: true,
     signup: true,
     return: true,
   },
   inAppEnabled: true,
   inAppTypes: {
     order: true,
     low_stock: true,
     signup: true,
     return: true,
   },
   soundEnabled: true,
   quietHoursEnabled: false,
   quietHoursStart: "22:00",
   quietHoursEnd: "08:00",
 };
 
 export const useNotificationPreferences = () => {
   const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
   const [isLoaded, setIsLoaded] = useState(false);
 
   // Load preferences from localStorage on mount
   useEffect(() => {
     try {
       const saved = localStorage.getItem(STORAGE_KEY);
       if (saved) {
         const parsed = JSON.parse(saved);
         setPreferences({ ...defaultPreferences, ...parsed });
       }
     } catch (error) {
       console.error("Error loading notification preferences:", error);
     }
     setIsLoaded(true);
   }, []);
 
   // Save preferences to localStorage whenever they change
   const savePreferences = useCallback((newPreferences: NotificationPreferences) => {
     try {
       localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
       setPreferences(newPreferences);
     } catch (error) {
       console.error("Error saving notification preferences:", error);
     }
   }, []);
 
   const updatePreferences = useCallback((updates: Partial<NotificationPreferences>) => {
     const newPreferences = { ...preferences, ...updates };
     savePreferences(newPreferences);
   }, [preferences, savePreferences]);
 
   const updatePushType = useCallback((type: keyof NotificationTypePreferences, enabled: boolean) => {
     const newPreferences = {
       ...preferences,
       pushTypes: { ...preferences.pushTypes, [type]: enabled },
     };
     savePreferences(newPreferences);
   }, [preferences, savePreferences]);
 
   const updateInAppType = useCallback((type: keyof NotificationTypePreferences, enabled: boolean) => {
     const newPreferences = {
       ...preferences,
       inAppTypes: { ...preferences.inAppTypes, [type]: enabled },
     };
     savePreferences(newPreferences);
   }, [preferences, savePreferences]);
 
   const isInQuietHours = useCallback(() => {
     if (!preferences.quietHoursEnabled) return false;
     
     const now = new Date();
     const currentTime = now.getHours() * 60 + now.getMinutes();
     
     const [startHour, startMin] = preferences.quietHoursStart.split(":").map(Number);
     const [endHour, endMin] = preferences.quietHoursEnd.split(":").map(Number);
     
     const startTime = startHour * 60 + startMin;
     const endTime = endHour * 60 + endMin;
     
     // Handle overnight quiet hours (e.g., 22:00 to 08:00)
     if (startTime > endTime) {
       return currentTime >= startTime || currentTime < endTime;
     }
     
     return currentTime >= startTime && currentTime < endTime;
   }, [preferences.quietHoursEnabled, preferences.quietHoursStart, preferences.quietHoursEnd]);
 
   const shouldShowPushForType = useCallback((type: keyof NotificationTypePreferences) => {
     return preferences.pushEnabled && preferences.pushTypes[type] && !isInQuietHours();
   }, [preferences.pushEnabled, preferences.pushTypes, isInQuietHours]);
 
   const shouldShowInAppForType = useCallback((type: keyof NotificationTypePreferences) => {
     return preferences.inAppEnabled && preferences.inAppTypes[type];
   }, [preferences.inAppEnabled, preferences.inAppTypes]);
 
   const resetToDefaults = useCallback(() => {
     savePreferences(defaultPreferences);
   }, [savePreferences]);
 
   return {
     preferences,
     isLoaded,
     updatePreferences,
     updatePushType,
     updateInAppType,
     shouldShowPushForType,
     shouldShowInAppForType,
     isInQuietHours,
     resetToDefaults,
   };
 };