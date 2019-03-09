<template lang="pug">
  .demo.pa-4
    .display-1 SheetMusic
    .body-1 The SheetMusic component is used to display printed music from ABC notaion.

    .headline.mt-5 Usage
    Example
      template(v-slot:output)
        SheetMusic(:value="tune")
      template(v-slot:template).
        &lt;template&gt;
          &lt;SheetMusic :value=&quot;tune&quot; /&gt;
        &lt;/template&gt;
      template(v-slot:code).
        &lt;script&gt;
          export default {
            data () {
              return {
                tune: `X:296
        T:Air De L'Opera Francoise. HSJJ.054
        T:Baa Baa Black Sheep. HSJJ.054
        T:Twinkle,Twinkle,Little Star. HSJJ.054
        M:4/4
        L:1/8
        R:Air
        O:England
        A:Lancashire
        Z:Chris Partington.
        K:G
        G2G2d2d2|efged4|c2c2B2B2|AGABG2G2:|!
        |:d2d2c2c2|B2B2A4|d2d2c2c2|B2B2A4|G2G2d2d2|efged4|c2c2B2B2|AGABG4:|!
        |:BGBG dBdB|efged4|cAcA BGBG|AGABG4:|!
        |:dBdB cAcA|BGBGB2A2|dBdB cAcA|BGBG ~B2A2|!
        BGBG dBdB|efged4|cAcA BGBG|AGABG4:|]
        `
              };
            };
          },
        &lt;/script&gt;
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import Example from '../Example.vue';
import Markdown from '../Markdown.vue';
import SheetMusic from '../SheetMusic.vue';

@Component({
  components: {
    Example,
    Markdown,
    SheetMusic,
  },
})
export default class SheetMusicDemo extends Vue {
  private tab: number = 0;
  private tune: string = `X:296
T:Air De L'Opera Francoise. HSJJ.054
T:Baa Baa Black Sheep. HSJJ.054
T:Twinkle,Twinkle,Little Star. HSJJ.054
M:4/4
L:1/8
R:Air
O:England
A:Lancashire
Z:Chris Partington.
K:G
G2G2d2d2|efged4|c2c2B2B2|AGABG2G2:|!
|:d2d2c2c2|B2B2A4|d2d2c2c2|B2B2A4|G2G2d2d2|efged4|c2c2B2B2|AGABG4:|!
|:BGBG dBdB|efged4|cAcA BGBG|AGABG4:|!
|:dBdB cAcA|BGBGB2A2|dBdB cAcA|BGBG ~B2A2|!
BGBG dBdB|efged4|cAcA BGBG|AGABG4:|]
`;
}
</script>

<style lang="scss" scoped>
</style>
