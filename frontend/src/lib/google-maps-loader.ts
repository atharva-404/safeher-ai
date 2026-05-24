export function isGoogleMapsConfigured() {
  return Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
}

let _loadPromise: Promise<void> | null = null;

export function ensureGoogleMapsLoaded(): Promise<void> {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!key) return Promise.reject(new Error("Google Maps API key not configured"));
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));

  // Already loaded
  if ((window as any).google && (window as any).google.maps) {
    return Promise.resolve();
  }

  // Reuse an in-flight load promise
  if (_loadPromise) return _loadPromise;

  _loadPromise = new Promise<void>((resolve, reject) => {
    // Check once more after acquiring the promise slot
    if ((window as any).google && (window as any).google.maps) {
      resolve();
      return;
    }

    // Use a unique callback name to avoid conflicts
    const callbackName = `__gmaps_cb_${Date.now()}`;
    (window as any)[callbackName] = () => {
      delete (window as any)[callbackName];
      resolve();
    };

    const existing = document.querySelector(`script[data-vite-google-maps]`);
    if (existing) {
      // Script tag exists — check if already loaded via polling
      const check = setInterval(() => {
        if ((window as any).google && (window as any).google.maps) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(check);
        reject(new Error("Google Maps load timeout"));
      }, 10000);
      return;
    }

    const script = document.createElement("script");
    script.setAttribute("data-vite-google-maps", "1");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,geometry&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      _loadPromise = null;
      reject(new Error("Failed to load Google Maps"));
    };
    document.head.appendChild(script);
  });

  return _loadPromise;
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key) return null;
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0]?.formatted_address ?? null;
  } catch {
    return null;
  }
}

/**
 * Use Google Places Nearby Search to find hospitals and police stations.
 * Falls back to null if Maps not loaded or API unavailable.
 */
export async function findNearbyPlaces(
  lat: number,
  lng: number,
  radius: number = 2000,
): Promise<Array<{ name: string; latitude: number; longitude: number; place_type: string; address: string; distance_m?: number }> | null> {
  try {
    await ensureGoogleMapsLoaded();
    const { google } = window as any;
    if (!google?.maps?.places) return null;

    const div = document.createElement("div");
    const map = new google.maps.Map(div, { center: { lat, lng }, zoom: 15 });
    const service = new google.maps.places.PlacesService(map);

    const results: Array<{ name: string; latitude: number; longitude: number; place_type: string; address: string; distance_m?: number }> = [];

    const searchType = (type: string) =>
      new Promise<void>((resolve) => {
        service.nearbySearch(
          { location: { lat, lng }, radius, type },
          (
            places: google.maps.places.PlaceResult[] | null,
            status: google.maps.places.PlacesServiceStatus,
          ) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && places) {
              places.slice(0, 5).forEach((p) => {
                const plat = p.geometry?.location?.lat() ?? lat;
                const plng = p.geometry?.location?.lng() ?? lng;
                // Calculate distance using Haversine
                const R = 6371000;
                const dLat = ((plat - lat) * Math.PI) / 180;
                const dLng = ((plng - lng) * Math.PI) / 180;
                const a =
                  Math.sin(dLat / 2) ** 2 +
                  Math.cos((lat * Math.PI) / 180) *
                    Math.cos((plat * Math.PI) / 180) *
                    Math.sin(dLng / 2) ** 2;
                const distance_m = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));

                results.push({
                  name: p.name ?? "Unknown",
                  latitude: plat,
                  longitude: plng,
                  place_type: type === "police" ? "police" : "hospital",
                  address: p.vicinity ?? "",
                  distance_m,
                });
              });
            }
            resolve();
          },
        );
      });

    await searchType("hospital");
    await searchType("police");

    // Sort by distance
    results.sort((a, b) => (a.distance_m ?? 0) - (b.distance_m ?? 0));
    return results;
  } catch {
    return null;
  }
}
