<template lang="pug">
  div(ref="code")
    pre(:class="`line-numbers language-${language}`")
      code
        slot
</template>

<script lang="ts">
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import * as Prism from 'prismjs';
import * as PrismLN from 'prismjs/plugins/line-numbers/prism-line-numbers';

@Component
export default class CodeHighlight extends Vue {
  @Prop({ default: 'javascript' })
  public language!: string;

  private mounted() {
    Prism.highlightAllUnder(this.$refs.code);
  }
}
</script>

<style lang="scss" scoped>
code {
  width: 100%;
}
</style>
