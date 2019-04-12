<template lang="pug">
  div(v-if="!noMap" ref="map")
    slot
  div.map-container(v-else)
    .error-message No Map Support
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { isFunction, isString } from 'lodash';

const EARTH_RADIUS = 3960.0;

interface MapCoordinate {
  latitude: number;
  longitude: number;
}

interface MapCoordinateSpan {
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapCoordinateSpanMiles {
  latitudeDeltaMiles: number;
  longitudeDeltaMiles: number;
}

interface MapRegion {
  center: MapCoordinate;
  span: MapCoordinateSpan | MapCoordinateSpanMiles;
}

@Component
export default class Map extends Vue {
  @Prop({ default: true })
  public showsMapTypeControl!: boolean;
  @Prop({ default: true })
  public showsZoomControl!: boolean;
  @Prop({ default: false })
  public showsUserLocationControl!: boolean;
  @Prop({ default: true })
  public showsCompassControl!: boolean;
  @Prop({ default: false })
  public showsScale!: boolean;
  @Prop({ default: true })
  public isRotationEnabled!: boolean;
  @Prop({ default: true })
  public isScrollEnabled!: boolean;
  @Prop({ default: true })
  public isZoomEnabled!: boolean;
  @Prop({ default: null })
  public region!: MapRegion;
  @Prop({ default: 0 })
  public rotation!: number;

  private noMap: boolean = false;
  private map: MK.Map | null = null;

  private $mapkit: any;

  public setMapRegion(region: MapRegion) {
    if (!this.map) {
      return;
    }

    const center = region.center;
    const span: MapCoordinateSpan = {
      latitudeDelta: 0,
      longitudeDelta: 0,
    };

    if ((region.span as MapCoordinateSpanMiles).latitudeDeltaMiles) {
      const spanMiles: MapCoordinateSpanMiles = region.span as MapCoordinateSpanMiles;
      span.latitudeDelta = (spanMiles.latitudeDeltaMiles / EARTH_RADIUS) * (180 / Math.PI);
    } else {
      span.latitudeDelta = (region.span as MapCoordinateSpan).latitudeDelta;
    }

    if ((region.span as MapCoordinateSpanMiles).longitudeDeltaMiles) {
      const r = EARTH_RADIUS * Math.cos(center.latitude * (Math.PI / 180));
      span.longitudeDelta = ((region.span as MapCoordinateSpanMiles).longitudeDeltaMiles / r) * (180 / Math.PI);
    } else {
      span.longitudeDelta = (region.span as MapCoordinateSpan).longitudeDelta;
    }

    const MKCenter: MK.Coordinate = new this.$mapkit.Coordinate(center.latitude, center.longitude);
    const MKSpan: MK.CoordinateSpan = new this.$mapkit.CoordinateSpan(span.latitudeDelta, span.longitudeDelta);
    this.map.region = new this.$mapkit.CoordinateRegion(MKCenter, MKSpan);
  }

  private destroyed() {
    if (this.map !== null) {
      this.map.destroy();
    }
  }

  private mounted() {
    if (!this.$mapkit) {
      this.noMap = true;
      return;
    }

    this.map = new this.$mapkit.Map(this.$refs.map) as MK.Map;
    if (this.region) {
      this.setMapRegion(this.region);
    }
    this.map.showsMapTypeControl = this.showsMapTypeControl;
    this.map.showsZoomControl = this.showsZoomControl;
    this.map.showsUserLocationControl = this.showsUserLocationControl;
    this.map.rotation = this.rotation;
    this.map.isRotationEnabled = this.isRotationEnabled;
    this.map.isScrollEnabled = this.isScrollEnabled;
    this.map.isZoomEnabled = this.isZoomEnabled;
    if (this.showsCompassControl) {
      this.map.showsCompass = this.$mapkit.FeatureVisibility.Visible;
    } else {
      this.map.showsCompass = this.$mapkit.FeatureVisibility.Hidden;
    }
    if (this.showsScale) {
      this.map.showsScale = this.$mapkit.FeatureVisibility.Visible;
    } else {
      this.map.showsScale = this.$mapkit.FeatureVisibility.Hidden;
    }
  }

  @Watch('region', { immediate: false })
  private onRegionUpdate(n: MapRegion, o: MapRegion) {
    if (n !== o && n != null) {
      this.setMapRegion(n);
    }
  }

  @Watch('rotation', { immediate: false })
  private onRotationUpdate(n: number, o: number) {
    if (n !== o && n != null && this.map != null) {
      this.map.rotation = n;
    }
  }

  @Watch('showsMapTypeControl', { immediate: false })
  private onShowsMapTypeControlUpdate(n: boolean, o: boolean) {
    if (n !== o && n != null && this.map != null) {
      this.map.showsMapTypeControl = n;
    }
  }

  @Watch('showsZoomControl', { immediate: false })
  private onShowsZoomControlUpdate(n: boolean, o: boolean) {
    if (n !== o && n != null && this.map != null) {
      this.map.showsZoomControl = n;
    }
  }

  @Watch('showsUserLocationControl', { immediate: false })
  private onShowsUserLocationControlUpdate(n: boolean, o: boolean) {
    if (n !== o && n != null && this.map != null) {
      this.map.showsUserLocationControl = n;
    }
  }

  @Watch('isRotationEnabled', { immediate: false })
  private onIsRotationEnabledpdate(n: boolean, o: boolean) {
    if (n !== o && n != null && this.map != null) {
      this.map.isRotationEnabled = n;
    }
  }

  @Watch('isScrollEnabled', { immediate: false })
  private onIsScrollEnabledUpdate(n: boolean, o: boolean) {
    if (n !== o && n != null && this.map != null) {
      this.map.isScrollEnabled = n;
    }
  }

  @Watch('isZoomEnabled', { immediate: false })
  private onIsZoomEnabledUpdate(n: boolean, o: boolean) {
    if (n !== o && n != null && this.map != null) {
      this.map.isZoomEnabled = n;
    }
  }

  @Watch('showsCompassControl', { immediate: false })
  private onShowsCompassControlUpdate(n: boolean, o: boolean) {
    if (n !== o && n != null && this.map != null) {
      if (n) {
        this.map.showsCompass = this.$mapkit.FeatureVisibility.Visible;
      } else {
        this.map.showsCompass = this.$mapkit.FeatureVisibility.Hidden;
      }
    }
  }

  @Watch('showsScale', { immediate: false })
  private onShowsScaleUpdate(n: boolean, o: boolean) {
    if (n !== o && n != null && this.map != null) {
      if (n) {
        this.map.showsScale = this.$mapkit.FeatureVisibility.Visible;
      } else {
        this.map.showsScale = this.$mapkit.FeatureVisibility.Hidden;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
  height: 100%;
  width: 100%;
  cursor: default;
  .error-message {
    position: absolute;
    font-size: 2em;
    text-align: center;
    width: 100%;
    top: calc(50% - 1em);
    opacity: 0.5;
  }
}
</style>
