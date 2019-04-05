<template lang="pug">
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component
export default class MapMarkerAnnotation extends (Vue) {
  @Prop({ default: () => [] })
  public coordinate!: MK.Coordinate;
  @Prop({ default: '' })
  public glyphText!: string;
  @Prop({ default: '#969696' })
  public color!: string;
  @Prop({ default: '' })
  public title!: string;
  @Prop({ default: '' })
  public subtitle!: string;

  private map: MK.Map | null = null;
  private wait: number = 100;
  private annotation: MK.MarkerAnnotation | null = null;

  private $mapkit: any;

  private mounted() {
    if (this.map === null) {
      this.waitForMap();
    } else {
      this.ready();
    }
  }

  private beforeDestroy() {
    if (this.map !== null && this.annotation !== null) {
      this.map.removeAnnotation(this.annotation);
    }
  }

  private ready() {
    if (this.map === null) {
      throw new Error('Map should exist');
    }

    const mkCenter: MK.Coordinate = new this.$mapkit.Coordinate(this.coordinate.latitude, this.coordinate.longitude);
    this.annotation = new this.$mapkit.MarkerAnnotation(mkCenter, {
      glyphText: this.glyphText,
      color: this.color,
      title: this.title,
      subtitle: this.subtitle,
    }) as MK.MarkerAnnotation;
    this.map.addAnnotation(this.annotation);
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

  @Watch('coordinate', { immediate: false })
  private onCoordinateUpdate(n: MK.Coordinate, o: MK.Coordinate) {
    if (this.annotation !== null && n !== null) {
      this.annotation.coordinate = n;
    }
  }
  @Watch('glyphText', { immediate: false })
  private onGlyphTextUpdate(n: string, o: string) {
    if (this.annotation !== null && n !== null) {
      this.annotation.glyphText = n;
    }
  }
  @Watch('title', { immediate: false })
  private onTitleUpdate(n: string, o: string) {
    if (this.annotation !== null && n !== null) {
      this.annotation.title = n;
    }
  }
  @Watch('subtitle', { immediate: false })
  private onSubtitleUpdate(n: string, o: string) {
    if (this.annotation !== null && n !== null) {
      this.annotation.subtitle = n;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
