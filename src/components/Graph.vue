<template lang="pug">
  div(ref="graph")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import mermaid from 'mermaid';

@Component
export default class Graph extends Vue {
  @Prop()
  public value!: string;

  private id: string = '';

  @Watch('value', { immediate: false })
  private onValueUpdate(n: string, o: string) {
    if (n !== o) {
      (this.$refs.graph as HTMLElement).innerHTML = '';
      mermaid.mermaidAPI.render('g' + this.id, this.value, (svgCode: string) => {
        (this.$refs.graph as HTMLElement).innerHTML = svgCode;
      });
    }
  }

  private mounted() {
    if (!this.value) {
      return;
    }
    this.id = this.uuidv4();
    mermaid.mermaidAPI.render('g' + this.id, this.value, (svgCode: string) => {
      (this.$refs.graph as HTMLElement).innerHTML = svgCode;
    });
  }

  private uuidv4() {
    return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable-next-line no-bitwise
      const r = Math.random() * 16 | 0;
      // tslint:disable-next-line no-bitwise
      const  v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
</script>

<style lang="scss" scoped>
</style>
