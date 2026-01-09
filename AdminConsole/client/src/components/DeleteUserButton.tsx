import { Button } from '@/components/ui/button';
import { database, ref, set } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { UserLocation } from '@shared/schema';
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
} from '@/components/ui/alert-dialog';

interface DeleteUserButtonProps {
  user: UserLocation;
  onUserDeleted?: () => void;
}

export default function DeleteUserButton({ user, onUserDeleted }: DeleteUserButtonProps) {
  const { toast } = useToast();

  const deleteUser = async () => {
    try {
      // Find the user ID from Firebase structure
      const usersSnapshot = await fetch(`https://onecall-c9557-default-rtdb.firebaseio.com/users.json`);
      const usersData = await usersSnapshot.json();
      
      if (!usersData) {
        toast({
          title: "Error",
          description: "No users found in database",
          variant: "destructive",
        });
        return;
      }

      // Find the userId that matches this user's data
      let userIdToDelete = null;
      for (const [userId, userData] of Object.entries(usersData)) {
        const data = userData as any;
        const locationData = data?.location;
        
        // Handle direct location format
        if (locationData?.username === user.username && 
            locationData?.latitude === user.latitude && 
            locationData?.longitude === user.longitude) {
          userIdToDelete = userId;
          break;
        }
        
        // Handle nested location format
        if (locationData && typeof locationData === 'object') {
          const locationEntries = Object.entries(locationData);
          for (const [, location] of locationEntries) {
            const loc = location as any;
            if (loc?.username === user.username && 
                loc?.latitude === user.latitude && 
                loc?.longitude === user.longitude) {
              userIdToDelete = userId;
              break;
            }
          }
          if (userIdToDelete) break;
        }
      }

      if (!userIdToDelete) {
        toast({
          title: "Error",
          description: "Could not find user in database",
          variant: "destructive",
        });
        return;
      }

      // Delete the user data
      const userRef = ref(database, `users/${userIdToDelete}`);
      await set(userRef, null);
      
      toast({
        title: "User Deleted",
        description: `Removed ${user.username} from the database`,
      });

      if (onUserDeleted) {
        onUserDeleted();
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Delete Failed",
        description: `Failed to delete user: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User Location</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the location data for "{user.username}"? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteUser}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}