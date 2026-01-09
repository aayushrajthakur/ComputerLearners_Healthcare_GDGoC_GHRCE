# TODO: Add Device Location Button to Main Page

- [x] Import necessary hooks and icons in LocationMap.tsx (useToast, MapPin icon)
- [x] Add a new "Get My Location" button in the map controls section
- [x] Implement handleGetLocation function to request geolocation
- [x] Handle success: center map on coordinates and zoom to level 15
- [x] Handle errors: show toast notification for permission denied or other errors
- [x] Place the button alongside existing controls (zoom, center, layer, real-time)
- [x] Add state for user's current location marker
- [x] Render a marker at the user's location when obtained
- [x] Use a distinct icon for the user's location marker (e.g., blue pin)

# TODO: Add Get Directions Button for Each User

- [x] Add Directions icon import to UserMarker.tsx
- [x] Add getDirections function to UserMarker component
- [x] Add "Get Directions" button to user popup
- [x] Implement directions using external maps service (Google Maps, Apple Maps, etc.)
- [x] Handle cases where user location is not available

# TODO: Enhance Timestamp Display for Users

- [x] Update timestamp display to show both relative time ("5 minutes ago") and absolute time ("Dec 15, 2023 14:30")
- [x] Format the absolute timestamp using toLocaleString()
- [x] Make the timestamp more prominent in the user popup

# TODO: Focus Map on User Selection from Sidebar

- [x] Update LocationMap component to accept selectedUser prop and focus map on it
- [x] Modify MapController to center on selectedUser when it changes
- [x] Ensure smooth map transition when user is selected from sidebar
