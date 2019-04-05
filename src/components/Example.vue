<template lang="pug">
  v-tabs(v-model="tab" dense color="grey lighten-3")
    v-tab(:key="1")
      v-icon mdi-language-html5
      | Output
    v-tab(:key="2")
      v-icon mdi-code-tags
      | Template
    v-tab(:key="3")
      v-icon mdi-language-javascript
      | Code
    v-tabs-items(touchless)
      v-tab-item(:key="1")
        v-card
          v-card-text
            slot(name="output")
      v-tab-item(:key="2")
        v-card
          v-card-text
            CodeHighlight(language="html")
              slot(name="template")
      v-tab-item(:key="3")
        v-card
          v-card-text
            CodeHighlight(language="javascript")
              slot(name="code")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import CodeHighlight from './CodeHighlight.vue';

@Component({
  components: {
    CodeHighlight,
  },
})
export default class Example extends Vue {
  private tab: number = 0;
}
</script>

<style lang="scss" scoped>
</style>
