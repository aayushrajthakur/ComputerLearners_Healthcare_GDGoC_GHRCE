import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Search, Users, MapPin, Clock } from 'lucide-react';
import { UserLocation } from '@shared/schema';
import DeleteUserButton from './DeleteUserButton';
import { motion } from 'framer-motion';

interface UserSidebarProps {
  users: UserLocation[];
  isLoading: boolean;
  onRefresh: () => void;
  onUserClick: (user: UserLocation) => void;
}

export default function UserSidebar({ users, isLoading, onRefresh, onUserClick }: UserSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOnlineFilter = !showOnlineOnly || user.isOnline;
      return matchesSearch && matchesOnlineFilter;
    });
  }, [users, searchQuery, showOnlineOnly]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getUserInitial = (username: string) => username.charAt(0).toUpperCase();

  const getAvatarColor = (username: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-orange-400 to-orange-600',
      'bg-gradient-to-br from-emerald-400 to-emerald-600'
    ];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="h-full glass-panel rounded-2xl flex flex-col overflow-hidden">
      {/* Header & Controls */}
      <div className="p-6 space-y-6 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Tracker
            </h2>
            <p className="text-xs text-muted-foreground font-medium">
              {users.length} Devices Active
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="hover:bg-white/50 rounded-full"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="relative group">
            <Input
              type="text"
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50 border-transparent focus:border-primary/20 focus:bg-white transition-all rounded-xl"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>

          <Button
            variant={showOnlineOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowOnlineOnly(!showOnlineOnly)}
            className={`w-full justify-start rounded-xl ${!showOnlineOnly && 'bg-white/50 border-transparent hover:bg-white'}`}
          >
            <Users className="h-4 w-4 mr-2" />
            {showOnlineOnly ? 'Showing Online Only' : 'Show All Devices'}
          </Button>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <RefreshCw className="h-8 w-8 animate-spin mb-2 opacity-50" />
            <span className="text-sm">Syncing...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <MapPin className="h-8 w-8 mb-2 opacity-20" />
            <span className="text-sm">No devices found</span>
          </div>
        ) : (
          filteredUsers.map((user, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={user.username}
              className="glass-card rounded-xl p-3 cursor-pointer group relative overflow-hidden"
              onClick={() => onUserClick(user)}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-10 h-10 ${getAvatarColor(user.username)} text-white rounded-full flex items-center justify-center font-bold shadow-md`}>
                      {getUserInitial(user.username)}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full ${user.isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-400'
                        }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {user.username}
                    </h3>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimestamp(user.timestamp)}
                    </div>
                  </div>
                </div>

                <DeleteUserButton user={user} onUserDeleted={onRefresh} />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
