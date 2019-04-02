<template lang="pug">
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component
export default class MapCircleOverlay extends Vue {
  @Prop({ default: null })
  public coordinate!: MK.Coordinate;
  @Prop({ default: 1000 })
  public radiusKM!: number;

  private map: MK.Map | null = null;
  private wait: number = 100;
  private overlay: MK.CircleOverlay | null = null;

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

    const mkCenter: MK.Coordinate = new this.$mapkit.Coordinate(this.coordinate.latitude, this.coordinate.longitude);
    this.overlay = new this.$mapkit.CircleOverlay(mkCenter, this.radiusKM * 1000) as MK.CircleOverlay;
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

  @Watch('radiusKM', { immediate: false })
  private onRadiusKMUpdate(n: number, o: number) {
    if (this.overlay !== null && n !== o && n !== null) {
      this.overlay.radius = n * 1000;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
