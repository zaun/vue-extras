<template lang="pug">
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { filter } from 'lodash';

interface MapKit {
  PolylineOverlay: any;
}

@Component
export default class MapGeoJSON extends (Vue) {
  // tslint:disable-next-line no-empty
  @Prop({ default: () => {} })
  public geo!: object;

  private map: MK.Map | null = null;
  private wait: number = 100;
  private overlays: MK.Overlay[] | null = null;

  private $mapkit: any;

  private mounted() {
    if (this.map === null) {
      this.waitForMap();
    } else {
      this.ready();
    }
  }

  private beforeDestroy() {
    if (this.map !== null && this.overlays !== null) {
      this.overlays.forEach((i) => {
        if (this.map !== null) {
          this.map.removeOverlay(i);
        }
      });
    }
  }

  private ready() {
    if (this.map === null) {
      throw new Error('Map should exist');
    }

    this.loadGeoJSON();
  }

  private loadGeoJSON() {
    this.$mapkit.importGeoJSON(this.geo, (err: Error, result: MK.GeoJSONResult) => {
      if (err) {
        throw err;
      }

      let items = [];
      if (result.getFlattenedItemList) {
        items = result.getFlattenedItemList();
      } else {
        items = [result];
      }

      this.overlays = filter(items, (i) => i instanceof this.$mapkit.PolygonOverlay) as MK.Overlay[];
      this.overlays.forEach((i) => {
        if (this.map !== null) {
          this.map.addOverlay(i);
        }
      });
    });
  }

  private waitForMap() {
    if (this.$parent && this.$parent.$data.map) {
      this.map = this.$parent.$data.map;
      this.ready();
    } else if (this.wait > 0) {
      this.wait -= 1;
      setTimeout(this.waitForMap);
    } else {
      throw new Error('Can\'t find Map');
    }
  }

  @Watch('geo', { immediate: false, deep: true })
  private ongeoUpdate(n: MK.Coordinate[], o: MK.Coordinate[]) {
    if (this.overlays !== null && n !== null) {
      this.overlays.forEach((i) => {
        if (this.map !== null) {
          this.map.removeOverlay(i);
        }
      });

      this.loadGeoJSON();
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
