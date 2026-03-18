 import { useState, useEffect, useCallback } from "react";
 
 export type NotificationPermission = "default" | "granted" | "denied";
 
 interface BrowserNotificationOptions {
   title: string;
   body: string;
   icon?: string;
   tag?: string;
   onClick?: () => void;
 }
 
 export const useBrowserNotifications = () => {
   const [permission, setPermission] = useState<NotificationPermission>("default");
   const [isSupported, setIsSupported] = useState(false);
 
   useEffect(() => {
     // Check if notifications are supported
     const supported = "Notification" in window;
     setIsSupported(supported);
     
     if (supported) {
       setPermission(Notification.permission as NotificationPermission);
     }
   }, []);
 
   const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
     if (!isSupported) {
       console.warn("Browser notifications are not supported");
       return "denied";
     }
 
     try {
       const result = await Notification.requestPermission();
       setPermission(result as NotificationPermission);
       return result as NotificationPermission;
     } catch (error) {
       console.error("Error requesting notification permission:", error);
       return "denied";
     }
   }, [isSupported]);
 
   const showNotification = useCallback(
     ({ title, body, icon, tag, onClick }: BrowserNotificationOptions) => {
       // Only show if permission granted and tab is not visible
       if (permission !== "granted") {
         return null;
       }
 
       // Check if document is hidden (tab not active)
       if (!document.hidden) {
         return null;
       }
 
       try {
         const notification = new Notification(title, {
           body,
           icon: icon || "/favicon.ico",
           tag, // Prevents duplicate notifications with same tag
           badge: "/favicon.ico",
           requireInteraction: false,
         });
 
         if (onClick) {
           notification.onclick = () => {
             window.focus();
             onClick();
             notification.close();
           };
         }
 
         // Auto-close after 5 seconds
         setTimeout(() => notification.close(), 5000);
 
         return notification;
       } catch (error) {
         console.error("Error showing notification:", error);
         return null;
       }
     },
     [permission]
   );
 
   const playNotificationSound = useCallback(() => {
     // Create a simple notification sound using Web Audio API
     try {
       const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
       const oscillator = audioContext.createOscillator();
       const gainNode = audioContext.createGain();
 
       oscillator.connect(gainNode);
       gainNode.connect(audioContext.destination);
 
       oscillator.frequency.value = 800;
       oscillator.type = "sine";
       
       gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
       gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
 
       oscillator.start(audioContext.currentTime);
       oscillator.stop(audioContext.currentTime + 0.3);
     } catch (error) {
       // Audio context not available, silently fail
     }
   }, []);
 
   return {
     permission,
     isSupported,
     requestPermission,
     showNotification,
     playNotificationSound,
   };
 };