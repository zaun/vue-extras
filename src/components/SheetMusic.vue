<template lang="pug">
  div(ref="music")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import abcjs from 'abcjs';

@Component
export default class SheetMusic extends Vue {
  @Prop()
  value!: string;

  @Watch('value', { immediate: false })
  onValueUpdate(n: string, o: string) {
    if (n !== o) {
      abcjs.renderAbc(this.$refs.music, this.value, {});
    }
  }

  mounted() {
    if (!this.value) {
      return;
    }
    abcjs.renderAbc(this.$refs.music, this.value, {});
  }
}
</script>

<style lang="scss" scoped>
</style>
