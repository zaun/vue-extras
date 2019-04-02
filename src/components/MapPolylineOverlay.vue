<template lang="pug">
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component
export default class MapPolylineOverlay extends Vue {
  @Prop({ default: () => [] })
  public points!: MK.Coordinate[];

  private map: MK.Map | null = null;
  private wait: number = 100;
  private overlay: MK.PolylineOverlay | null = null;

  private mounted() {
    if (this.map === null) {
      this.waitForMap();
    } else {
      this.ready();
    }
  }

  private beforeDestroy() {
    if (this.map !== null && this.overlay !== null) {
      this.map.removeOverlay(this.overlay);
    }
  }

  private ready() {
    if (this.map === null) {
      throw new Error('Map should exist');
    }

    this.overlay = new this.$mapkit.PolylineOverlay(this.points.map((p) => {
      return new this.$mapkit.Coordinate(p.latitude, p.longitude);
    })) as MK.PolylineOverlay;
    this.map.addOverlay(this.overlay);
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

  @Watch('points', { immediate: false, deep: true })
  private onPointsUpdate(n: MK.Coordinate[], o: MK.Coordinate[]) {
    if (this.overlay !== null && n !== null) {
      this.overlay.points = n.map((p) => {
        return new this.$mapkit.Coordinate(p.latitude, p.longitude);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
