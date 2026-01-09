import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Maximize2, Layers, Radio, MapPin } from 'lucide-react';
import UserMarker from './UserMarker';
import { UserLocation } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationMapProps {
  users: UserLocation[];
  selectedUser: UserLocation | null;
  onUserClick: (user: UserLocation) => void;
  realTimeEnabled: boolean;
  onToggleRealTime: () => void;
}

function MapController({ users, selectedUser }: { users: UserLocation[]; selectedUser: UserLocation | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedUser) {
      map.flyTo([selectedUser.latitude, selectedUser.longitude], 15, {
        duration: 1.5,
      });
    }
  }, [selectedUser, map]);

  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      const bounds = users.map(user => [user.latitude, user.longitude] as [number, number]);
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        map.setView(bounds[0], 12);
      }
    }
  }, [users, selectedUser, map]);

  return null;
}

export default function LocationMap({ users, selectedUser, onUserClick, realTimeEnabled, onToggleRealTime }: LocationMapProps) {
  const mapRef = useRef<any>(null);
  const [mapLayer, setMapLayer] = useState<'streets' | 'satellite'>('streets');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const { toast } = useToast();

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleCenterMap = () => {
    if (mapRef.current && users.length > 0) {
      const bounds = users.map(user => [user.latitude, user.longitude] as [number, number]);
      if (bounds.length > 1) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      } else {
        mapRef.current.setView(bounds[0], 12);
      }
    }
  };

  const handleToggleLayer = () => {
    setMapLayer(prev => prev === 'streets' ? 'satellite' : 'streets');
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
          toast({
            title: "Location Found",
            description: "Map centered on your current location.",
          });
        }
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const getTileLayerUrl = () => {
    return mapLayer === 'streets'
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  };

  const getTileLayerAttribution = () => {
    return mapLayer === 'streets'
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      : 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={12}
        className="w-full h-full"
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          url={getTileLayerUrl()}
          attribution={getTileLayerAttribution()}
        />

        <MapController users={users} selectedUser={selectedUser} />

        {users.map((user) => (
          <UserMarker
            key={user.username}
            user={user}
            onUserClick={onUserClick}
            userLocation={userLocation}
          />
        ))}

        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={L.divIcon({
              html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
              className: 'custom-user-location-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
                <br />
                <small>
                  {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                </small>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-20 right-4 space-y-2 z-[400]">
        {/* Zoom Controls */}
        <div className="glass rounded-lg overflow-hidden shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="w-10 h-10 rounded-none border-b border-gray-200/20 hover:bg-white/20"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="w-10 h-10 rounded-none hover:bg-white/20"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        {/* Additional Controls */}
        <div className="glass rounded-lg p-1 space-y-1 shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCenterMap}
            className="w-10 h-10 hover:bg-white/20 rounded-md"
            title="Fit to Bounds"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleLayer}
            className="w-10 h-10 hover:bg-white/20 rounded-md"
            title="Toggle Layer"
          >
            <Layers className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleRealTime}
            className={`w-10 h-10 rounded-md ${realTimeEnabled ? 'text-green-600 bg-green-50/20' : 'hover:bg-white/20'}`}
            title="Toggle Real-time"
          >
            <Radio className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleGetLocation}
            className="w-10 h-10 hover:bg-white/20 rounded-md"
            title="Get My Location"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
