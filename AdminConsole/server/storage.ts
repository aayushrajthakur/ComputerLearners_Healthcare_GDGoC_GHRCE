import { UserLocation, UserLocationUpdate } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUserLocation(username: string): Promise<UserLocation | undefined>;
  updateUserLocation(update: UserLocationUpdate): Promise<UserLocation>;
  getAllUserLocations(): Promise<UserLocation[]>;
}

export class MemStorage implements IStorage {
  private userLocations: Map<string, UserLocation>;

  constructor() {
    this.userLocations = new Map();
  }

  async getUserLocation(username: string): Promise<UserLocation | undefined> {
    return this.userLocations.get(username);
  }

  async getAllUserLocations(): Promise<UserLocation[]> {
    return Array.from(this.userLocations.values());
  }

  async updateUserLocation(update: UserLocationUpdate): Promise<UserLocation> {
    const userLocation: UserLocation = {
      ...update,
      isOnline: Date.now() - update.timestamp < 300000, // 5 minutes
    };
    this.userLocations.set(update.username, userLocation);
    return userLocation;
  }
}

export const storage = new MemStorage();
