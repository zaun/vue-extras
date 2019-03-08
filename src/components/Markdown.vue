<template lang="pug">
  div(v-html="content")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import Markdown from 'markdown-it';

@Component
export default class SheetMusic extends Vue {
  @Prop()
  value!: string;

  md: any = null;
  content = '';

  @Watch('value', { immediate: false })
  onValueUpdate(n: string, o: string) {
    if (this.md !== null && n !== o) {
      this.content = this.md!.render(this.value);
    }
  }

  created() {
    this.md = new Markdown({
      html: false,
      break: false,
    });
  }

  mounted() {
    if (!this.value || this.md === null) {
      return;
    }
    this.content = this.md.render(this.value);
  }
}
</script>

<style lang="scss" scoped>
</style>
