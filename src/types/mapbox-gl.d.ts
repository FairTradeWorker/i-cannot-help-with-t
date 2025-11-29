declare module 'mapbox-gl' {
  export const accessToken: string;
  export class Map {
    constructor(options: any);
    flyTo(options: any): void;
    on(event: string, callback: () => void): void;
  }
  export class Marker {
    constructor(element?: HTMLElement);
    setLngLat(lngLat: [number, number]): Marker;
    setPopup(popup: Popup): Marker;
    addTo(map: Map): Marker;
  }
  export class Popup {
    constructor(options?: any);
    setHTML(html: string): Popup;
  }
}

