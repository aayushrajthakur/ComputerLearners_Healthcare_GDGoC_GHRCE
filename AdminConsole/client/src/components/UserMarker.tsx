import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { UserLocation } from '@shared/schema';
import DeleteUserButton from './DeleteUserButton';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';

interface UserMarkerProps {
  user: UserLocation;
  onUserClick: (user: UserLocation) => void;
  userLocation?: { latitude: number; longitude: number } | null;
}

const createCustomIcon = (isOnline: boolean, username: string) => {
  const color = isOnline ? '#4CAF50' : '#F44336';
  const initial = username.charAt(0).toUpperCase();
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
        <text x="16" y="21" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">${initial}</text>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default function UserMarker({ user, onUserClick, userLocation }: UserMarkerProps) {
  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);

    let relativeTime = '';
    if (minutes < 1) relativeTime = 'Just now';
    else if (minutes < 60) relativeTime = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    else {
      const hours = Math.floor(minutes / 60);
      if (hours < 24) relativeTime = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      else {
        const days = Math.floor(hours / 24);
        relativeTime = `${days} day${days > 1 ? 's' : ''} ago`;
      }
    }

    return relativeTime;
  };

  const getAbsoluteTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getDirections = () => {
    if (!userLocation) {
      // Fallback: open in maps without origin
      const url = `https://www.google.com/maps/dir/?api=1&destination=${user.latitude},${user.longitude}`;
      window.open(url, '_blank');
      return;
    }

    // Open Google Maps with directions from current location to user location
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${user.latitude},${user.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <Marker
      position={[user.latitude, user.longitude]}
      icon={createCustomIcon(user.isOnline || false, user.username)}
      eventHandlers={{
        click: () => onUserClick(user),
      }}
    >
      <Popup>
        <div className="p-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{user.username}</h4>
              <p className="text-sm text-gray-500">
                <span className={`inline-block w-2 h-2 rounded-full mr-1 ${user.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {user.isOnline ? 'Online' : 'Offline'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {user.latitude.toFixed(4)}, {user.longitude.toFixed(4)}
              </p>
              <div className="text-xs text-gray-400">
                <p className="font-medium">{formatTimestamp(user.timestamp)}</p>
                <p className="text-gray-500">{getAbsoluteTime(user.timestamp)}</p>
              </div>
              {user.accuracy && (
                <p className="text-xs text-gray-400">
                  ±{user.accuracy}m accuracy
                </p>
              )}
            </div>
            <DeleteUserButton user={user} />
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200">
            <Button
              onClick={getDirections}
              size="sm"
              className="w-full flex items-center justify-center gap-2"
            >
              <Navigation className="h-4 w-4" />
              Get Directions
            </Button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
