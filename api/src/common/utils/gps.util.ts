/**
 * GPS and location utility functions
 */
export class GpsUtil {
  /**
   * Validate GPS coordinates
   * @param latitude Latitude (-90 to 90)
   * @param longitude Longitude (-180 to 180)
   * @returns true if valid
   */
  static isValidCoordinates(latitude: number, longitude: number): boolean {
    return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  }

  /**
   * Calculate distance between two GPS points (Haversine formula)
   * @param lat1 First latitude
   * @param lon1 First longitude
   * @param lat2 Second latitude
   * @param lon2 Second longitude
   * @returns Distance in kilometers
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Check if a point is within a radius of another point
   * @param centerLat Center latitude
   * @param centerLon Center longitude
   * @param checkLat Point latitude
   * @param checkLon Point longitude
   * @param radiusKm Radius in kilometers
   * @returns true if within radius
   */
  static isWithinRadius(
    centerLat: number,
    centerLon: number,
    checkLat: number,
    checkLon: number,
    radiusKm: number,
  ): boolean {
    const distance = this.calculateDistance(centerLat, centerLon, checkLat, checkLon);
    return distance <= radiusKm;
  }

  /**
   * Convert degrees to radians
   */
  private static toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}
