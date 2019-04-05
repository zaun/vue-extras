/**
 * Apple MapKitJS Types
 */

declare namespace MK {
  interface Overlay {
    data: object;
    visible: boolean;
    enabled: boolean;
    selected: boolean;
    style: object;
    map: Map;

    addEventListener: (type: string, listener: () => void, data?: object) => void;
    removeEventListener: (type: string, listener: () => void, data?: object) => void;
  }

  interface CircleOverlay extends Overlay {
    coordinate: Coordinate;
    radius: number;
  }

  interface PolylineOverlay extends Overlay {
    points: Coordinate[];
  }

  interface PolygonOverlay extends Overlay {
    points: Coordinate[];
  }

  interface MapPoint {
    x: number;
    y: number;
    copy: () => MapPoint;
    equals: (anotherPoint: MapPoint) => boolean;
    toCoordinate: () => Coordinate;
  }

  interface MapSize {
    height: number;
    width: number;
    copy: () => MapSize;
    equals: (anotherSize: MapSize) => boolean;
  }

  interface MapRect {
    origin: MapPoint;
    size: MapSize;
    copy: () => MapSize;
    equals: (anotherSize: MapSize) => boolean;
    maxX: () => number;
    maxY: () => number;
    midX: () => number;
    midY: () => number;
    minX: () => number;
    minY: () => number;
    scale: (scaleFactor: number, scaleCenter: MapPoint) => MapRect;
    toCoordinateRegion: () => CoordinateRegion;
  }

  interface Coordinate {
    latitude: number;
    longitude: number;
    copy: () => Coordinate;
    equals: (anotherCoordinate: Coordinate) => boolean;
    toMapPoint: () => MapPoint;
    toUnwrappedMapPoint: () => MapPoint;
  }

  interface CoordinateRegion {
    center: Coordinate;
    span: CoordinateSpan;
    copy: () => CoordinateRegion;
    equals: (anotherCoordinate: CoordinateRegion) => boolean;
    toBoundingRegion: () => BoundingRegion;
    toMapRect: () => MapRect;
  }

  interface CoordinateSpan {
    latitudeDelta: number;
    longitudeDelta: number;
    copy: () => CoordinateSpan;
    equals: (anotherCoordinate: CoordinateSpan) => boolean;
  }

  interface BoundingRegion {
    eastLongitude: number;
    northLatitude: number;
    southLatitude: number;
    westLongitude: number;
    copy: () => BoundingRegion;
    toCoordinateRegion: () => CoordinateRegion;
  }

  interface Map {
    center: Coordinate;
    setCenterAnimated: (coordinate: Coordinate, animate?: boolean) => Map;
    region: CoordinateRegion;
    setRegionAnimated: (region: CoordinateRegion, animate?: boolean) => Map;
    rotation: number;
    setRotationAnimated: (degrees: number, animate?: boolean) => Map;
    visibleMapRect: MapRect;
    setVisibleMapRectAnimated: (mapRect: MapRect, animate?: boolean) => Map;

    showsMapTypeControl: boolean;
    showsZoomControl: boolean;
    showsUserLocationControl: boolean;
    showsCompass: string;
    showsScale: string;

    isRotationEnabled: boolean;
    isScrollEnabled: boolean;
    isZoomEnabled: boolean;

    addOverlay: (overlay: Overlay) => void;
    removeOverlay: (overlay: Overlay) => void;

    destroy: () => void;
  }

  interface GeoJSONResult {
    items: object[];
    getFlattenedItemList: () => object[];
  }
}
