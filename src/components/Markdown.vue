<template lang="pug">
  div(v-html="content")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import Markdown from 'markdown-it';

@Component
export default class SheetMusic extends Vue {
  @Prop()
  public value!: string;

  private md: any = null;
  private content = '';

  @Watch('value', { immediate: false })
  private onValueUpdate(n: string, o: string) {
    if (this.md !== null && n !== o) {
      this.content = this.md!.render(this.value);
    }
  }

  private created() {
    this.md = new Markdown({
      html: false,
      break: false,
    });
  }

  private mounted() {
    if (!this.value || this.md === null) {
      return;
    }
    this.content = this.md.render(this.value);
  }
}
</script>

<style lang="scss" scoped>
</style>
