import { Button } from '@/components/ui/button';
import { database, ref, set } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { TestTube } from 'lucide-react';

export default function TestDataButton() {
  const { toast } = useToast();

  const addTestData = async () => {
    try {
      const testData = {
        testuser1: {
          latitude: 40.7589,
          longitude: -73.9851,
          username: "testuser1"
        },
        testuser2: {
          latitude: 40.7505,
          longitude: -73.9934,
          username: "testuser2"
        },
        androiduser: {
          latitude: 40.7614,
          longitude: -73.9776,
          username: "androiduser"
        }
      };

      // Add test data in the format your Android app uses
      const testPromises = Object.entries(testData).map(([userId, location]) =>
        set(ref(database, `users/${userId}/location`), location)
      );
      await Promise.all(testPromises);
      
      toast({
        title: "Test Data Added",
        description: "Added 3 test users to Firebase for testing",
      });
    } catch (error: any) {
      console.error('Error adding test data:', error);
      toast({
        title: "Error",
        description: `Failed to add test data: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const clearData = async () => {
    try {
      const usersRef = ref(database, 'users');
      await set(usersRef, null);
      
      toast({
        title: "Data Cleared",
        description: "Cleared all location data from Firebase",
      });
    } catch (error: any) {
      console.error('Error clearing data:', error);
      toast({
        title: "Error",
        description: `Failed to clear data: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        onClick={addTestData}
        variant="outline"
        size="sm"
        className="flex items-center space-x-1"
      >
        <TestTube className="h-4 w-4" />
        <span>Add Test Data</span>
      </Button>
      
      <Button
        onClick={clearData}
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-700"
      >
        Clear Data
      </Button>
    </div>
  );
}