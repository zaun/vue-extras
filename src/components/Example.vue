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
    v-tab-item(:key="1")
      v-card
        v-card-text
          slot(name="output")
    v-tab-item(:key="2")
      v-card
        v-card-text
          pre
            slot(name="template")
    v-tab-item(:key="3")
      v-card
        v-card-text
          pre
            slot(name="code")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component
export default class Example extends Vue {
  tab: number = 0
}
</script>

<style lang="scss" scoped>
</style>
