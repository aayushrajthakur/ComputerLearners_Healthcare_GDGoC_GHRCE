import { useState, useEffect, useCallback } from 'react';
import { MapPin, Wifi, WifiOff, Menu, X } from 'lucide-react';
import { database, ref, onValue } from '@/lib/firebase';
import { UserLocation, userLocationSchema } from '@shared/schema';
import LocationMap from '@/components/LocationMap';
import UserSidebar from '@/components/UserSidebar';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [users, setUsers] = useState<UserLocation[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserLocation | null>(null);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const { toast } = useToast();

  const fetchUserLocations = useCallback(() => {
    setIsLoading(true);
    
    try {
      const locationsRef = ref(database, 'users');
      
      const unsubscribe = onValue(locationsRef, (snapshot) => {
        try {
          setConnectionStatus('connected');
          const data = snapshot.val();
          
          if (!data) {
            setUsers([]);
            setIsLoading(false);
            return;
          }

          const userLocations: UserLocation[] = [];
          
          Object.entries(data).forEach(([userId, userData]) => {
            try {
              const userDataObj = userData as any;
              let locationData = userDataObj?.location;
              
              if (locationData && locationData.latitude && locationData.longitude) {
                const timestamp = locationData.timestamp || Date.now();
                userLocations.push(userLocationSchema.parse({
                  username: locationData.username || userId,
                  latitude: locationData.latitude,
                  longitude: locationData.longitude,
                  timestamp: timestamp,
                  accuracy: locationData.accuracy,
                  isOnline: Date.now() - timestamp < 300000,
                }));
                return;
              }
              
              if (locationData && typeof locationData === 'object') {
                const locationEntries = Object.entries(locationData);
                if (locationEntries.length > 0) {
                  const [, latestLocation] = locationEntries[locationEntries.length - 1];
                  const latestData = latestLocation as any;
                  
                  if (latestData?.latitude && latestData?.longitude) {
                    const timestamp = latestData.timestamp || Date.now();
                    userLocations.push(userLocationSchema.parse({
                      username: latestData.username || userId,
                      latitude: latestData.latitude,
                      longitude: latestData.longitude,
                      timestamp: timestamp,
                      accuracy: latestData.accuracy,
                      isOnline: Date.now() - timestamp < 300000,
                    }));
                  }
                }
              }
            } catch (e) {
              console.warn(`Invalid data for user ${userId}`);
            }
          });

          setUsers(userLocations);
          setLastUpdated(new Date());
          setIsLoading(false);
        } catch (err) {
          console.error('Error processing location data:', err);
          setConnectionStatus('disconnected');
          setIsLoading(false);
        }
      }, (error) => {
        console.error('Firebase error:', error);
        setConnectionStatus('disconnected');
        setIsLoading(false);
      });

      return unsubscribe;
    } catch (err: any) {
      console.error('Setup error:', err);
      setConnectionStatus('disconnected');
      setIsLoading(false);
      return () => {};
    }
  }, [toast]);

  useEffect(() => {
    if (realTimeEnabled) {
      const unsubscribe = fetchUserLocations();
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, [realTimeEnabled, fetchUserLocations]);

  const handleRefresh = async () => {
    if (realTimeEnabled) {
      toast({
        title: "Real-time Active",
        description: "Locations are automatically updating in real-time",
      });
    } else {
      fetchUserLocations();
    }
  };

  const handleUserClick = (user: UserLocation) => {
    setSelectedUser(user);
  };

  const handleToggleRealTime = () => {
    setRealTimeEnabled(!realTimeEnabled);
    toast({
      title: realTimeEnabled ? "Real-time Disabled" : "Real-time Enabled",
      description: realTimeEnabled ? "Manual refresh required" : "Updates received automatically",
    });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <LocationMap
          users={users}
          selectedUser={selectedUser}
          onUserClick={handleUserClick}
          realTimeEnabled={realTimeEnabled}
          onToggleRealTime={handleToggleRealTime}
        />
      </div>

      {/* Floating Status Bar */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-20 glass px-6 py-2 rounded-full flex items-center gap-4"
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm font-medium text-foreground capitalize">{connectionStatus}</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{users.length} Active Users</span>
        </div>
      </motion.div>

      {/* Sidebar Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 left-4 z-30 glass hover:bg-white/90"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Floating Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-16 left-4 bottom-4 w-80 z-20"
          >
            <UserSidebar
              users={users}
              isLoading={isLoading}
              onRefresh={handleRefresh}
              onUserClick={handleUserClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
