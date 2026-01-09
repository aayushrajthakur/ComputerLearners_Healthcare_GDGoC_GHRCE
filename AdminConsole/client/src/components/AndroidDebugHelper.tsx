import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AndroidDebugHelper() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Code copied successfully",
    });
  };

  const androidInterface = `@POST("users/{userId}/location.json")
Call<Void> sendLocation(@Path("userId") String userId, @Body ModelData location);`;

  const androidUsage = `// In your MainActivity recordButton click listener:
ApiService service = RetrofitClient.getClient().create(ApiService.class);
ModelData location = new ModelData(latitude, longitude, user.getDisplayName());

// You need to provide userId parameter
String userId = user.getUid(); // or user.getDisplayName() or any unique ID
Call<Void> call = service.sendLocation(userId, location);`;

  const expectedFirebaseData = `// Expected Firebase structure:
{
  "users": {
    "john_doe": {
      "location": {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "username": "john_doe"
      }
    }
  }
}`;

  return (
    <Card className="w-full max-w-4xl mx-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Smartphone className="h-5 w-5" />
          <span>Android Integration Guide</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">1. Update your Android API Interface:</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg relative">
            <pre className="text-sm overflow-x-auto">{androidInterface}</pre>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => copyToClipboard(androidInterface)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">2. Update your MainActivity usage:</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg relative">
            <pre className="text-sm overflow-x-auto">{androidUsage}</pre>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => copyToClipboard(androidUsage)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">3. Expected Firebase Data Structure:</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg relative">
            <pre className="text-sm overflow-x-auto">{expectedFirebaseData}</pre>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => copyToClipboard(expectedFirebaseData)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Current Status:</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>✅ Web app is working and receiving Firebase data</li>
            <li>✅ Firebase connection is established</li>
            <li>✅ Test data shows proper format</li>
            <li>🔄 Android app needs @Path("userId") parameter added</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}