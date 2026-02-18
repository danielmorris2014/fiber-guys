declare module "react-simple-maps" {
  import { ComponentType, CSSProperties, ReactNode } from "react";

  interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    rotate?: [number, number, number];
    parallels?: [number, number];
  }

  interface ComposableMapProps {
    width?: number;
    height?: number;
    projection?: string;
    projectionConfig?: ProjectionConfig;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
  }

  interface GeographyStyle {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    outline?: string;
    transition?: string;
    cursor?: string;
  }

  interface GeographyProps {
    geography: any;
    style?: {
      default?: GeographyStyle;
      hover?: GeographyStyle;
      pressed?: GeographyStyle;
    };
    onMouseEnter?: (event: any) => void;
    onMouseLeave?: (event: any) => void;
    onClick?: (event: any) => void;
    className?: string;
  }

  interface GeographiesChildrenArgs {
    geographies: any[];
    outline?: any;
    borders?: any;
  }

  interface GeographiesProps {
    geography: string | Record<string, any> | any[];
    children: (args: GeographiesChildrenArgs) => ReactNode;
    parseGeographies?: (geos: any[]) => any[];
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const ZoomableGroup: ComponentType<any>;
  export const Marker: ComponentType<any>;
  export const Line: ComponentType<any>;
  export const Annotation: ComponentType<any>;
  export const Graticule: ComponentType<any>;
  export const Sphere: ComponentType<any>;
}
