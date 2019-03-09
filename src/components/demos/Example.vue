<template lang="pug">
  .demo.pa-4
    .display-1 Example
    .body-1 Display an example usage of a Vue tag

    .headline.mt-5 Usage
    Example
      template(v-slot:output)
        Example
          template(v-slot:output)
            .body-1 Example Output
          template(ref="template" v-slot:template) Template
          template(v-slot:code) Code
      template(v-slot:template).
        &lt;template&gt;
          &lt;Example&gt;
            &lt;template v-slot:output&gt;
              &lt;div class=&quot;body-1&gt;Example Output&lt;/div&gt;
            &lt;/template&gt;
            &lt;template v-slot:template&gt;
              Template
            &lt;/template&gt;
            &lt;template v-slot:code&gt;
              Code
            &lt;/template&gt;
          &lt;/Example&gt;
        &lt;/template&gt;
      template(v-slot:code) No Code Needed
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import Example from '../Example.vue';

@Component({
  components: {
    Example,
  },
})
export default class SheetMusicDemo extends Vue {
  private tab: number = 0;
  private code: string = ``;
  private template: string = ``;
}
</script>

<style lang="scss" scoped>
</style>
