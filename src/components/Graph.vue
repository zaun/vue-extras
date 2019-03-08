<template lang="pug">
  div(ref="graph")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import mermaid from 'mermaid';

@Component
export default class Graph extends Vue {
  @Prop()
  value!: string;

  id: string = '';

  @Watch('value', { immediate: false })
  onValueUpdate(n: string, o: string) {
    if (n !== o) {
      (<HTMLElement>this.$refs.graph).innerHTML = '';
      mermaid.mermaidAPI.render('g' + this.id, this.value, (svgCode: string) => {
        (<HTMLElement>this.$refs.graph).innerHTML = svgCode;
      });
    }
  }

  mounted() {
    if (!this.value) {
      return;
    }
    this.id = this.uuidv4();
    mermaid.mermaidAPI.render('g' + this.id, this.value, (svgCode: string) => {
      (<HTMLElement>this.$refs.graph).innerHTML = svgCode;
    });
  }

  uuidv4() {
    return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
</script>

<style lang="scss" scoped>
</style>
