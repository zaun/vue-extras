<template lang="pug">
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component
export default class MapAnnotation extends (Vue) {
  @Prop({ default: () => [] })
  public coordinate!: MK.Coordinate;
  @Prop({ default: '' })
  public title!: string;

  // tslint:disable-next-line no-empty
  @Prop({ default: () => {} })
  public data!: object;

  private map: MK.Map | null = null;
  private wait: number = 100;
  private annotation: MK.Annotation | null = null;

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

  private factory(coordinate: MK.Coordinate, options: object) {
    const div = document.createElement('div');
    div.innerText = 'A';
    div.className = 'circle-annotation';
    return div;
  }

  private ready() {
    if (this.map === null) {
      throw new Error('Map should exist');
    }

    const mkCenter: MK.Coordinate = new this.$mapkit.Coordinate(this.coordinate.latitude, this.coordinate.longitude);
    this.annotation = new this.$mapkit.Annotation(mkCenter, this.factory, {
      title: this.title,
      data: this.data || {},
    }) as MK.Annotation;
    this.map.addAnnotation(this.annotation);
    this.map.showItems(this.annotation);
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
  private onPointUpdate(n: MK.Coordinate, o: MK.Coordinate) {
    if (this.annotation !== null && n !== null) {
      this.annotation.coordinate = n;
    }
  }
}
</script>

<style lang="scss" scoped>
.circle-annotation {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #FFF;
  background-color: #CCC;
  text-align: center;
  line-height: 32px;
}
</style>
