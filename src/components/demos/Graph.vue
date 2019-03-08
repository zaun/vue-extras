<template lang="pug">
  .demo.pa-4
    .display-1 Graph
    .body-1 Show one of many types of charts created with mermaid markup.

    .headline.mt-5 Usage
    Example
      template(v-slot:output)
        Graph(:value="chart1")
      template(v-slot:template).
        &lt;template&gt;
          &lt;Graph :value=&quot;chart&quot; /&gt;
        &lt;/template&gt;
      template(v-slot:code).
        &lt;script&gt;
          export default {
            data () {
              return {
                tune: `sequenceDiagram
            Alice -&gt;&gt; Bob: Hello Bob, how are you?
            Bob--&gt;&gt;John: How about you John?
            Bob--x Alice: I am good thanks!
            Bob-x John: I am good thanks!
            Note right of John: Bob thinks a long&lt;br/&gt;long time, so long&lt;br/&gt;that the text does&lt;br/&gt;not fit on a row.

            Bob--&gt;Alice: Checking with John...
            Alice-&gt;John: Yes... John, how are you?`
              };
            };
          },
        &lt;/script&gt;

    .headline.mt-5 Example (Basic flowchart)
    Example
      template(v-slot:output)
        Graph(:value="chart2")
      template(v-slot:template).
        &lt;template&gt;
          &lt;Graph :value=&quot;chart&quot; /&gt;
        &lt;/template&gt;
      template(v-slot:code).
        &lt;script&gt;
          export default {
            data () {
              return {
                tune: `graph LR
            A[Square Rect] -- Link text --&gt; B((Circle))
            A --&gt; C(Round Rect)
            B --&gt; D{Rhombus}
            C --&gt; D`
              };
            };
          },
        &lt;/script&gt;
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import Example from '@/components/Example.vue'
import Graph from '@/components/Graph.vue'

@Component({
  components: {
    Example,
    Graph
  }
})
export default class GraphDemo extends Vue {
  tab: number = 0
  chart1: string = `sequenceDiagram
    Alice ->> Bob: Hello Bob, how are you?
    Bob-->>John: How about you John?
    Bob--x Alice: I am good thanks!
    Bob-x John: I am good thanks!
    Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

    Bob-->Alice: Checking with John...
    Alice->John: Yes... John, how are you?`;
  chart2: string = `graph LR
    A[Square Rect] -- Link text --> B((Circle))
    A --> C(Round Rect)
    B --> D{Rhombus}
    C --> D`;
}
</script>

<style lang="scss" scoped>
</style>
