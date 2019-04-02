<template lang="pug">
  .demo.pa-4
    .display-1 VideoPlayer
    .body-1 Play various videos from around the web. Video's are responsive and will fill the full width of it's container while keeping its aspect ratio.

    .headline.mt-5 Vimeo Video
    Example
      template(v-slot:output)
        VideoPlayer(vimeo="162348702")
      template(v-slot:template).
        &lt;template&gt;
          &lt;VideoPlayer vimeo=&quot;162348702&quot; /&gt;
        &lt;/template&gt;
      template(v-slot:code).

    .headline.mt-5 YouTube Video
    Example
      template(v-slot:output)
        VideoPlayer(youtube="oIlIVFBBbNw")
      template(v-slot:template).
        &lt;template&gt;
          &lt;VideoPlayer youtube=&quot;oIlIVFBBbNw&quot; /&gt;
        &lt;/template&gt;
      template(v-slot:code).

    .headline.mt-5 Dailymotion Video
    Example
      template(v-slot:output)
        VideoPlayer(dailymotion="x2bw0ut")
      template(v-slot:template).
        &lt;template&gt;
          &lt;VideoPlayer dailymotion=&quot;x2bw0ut&quot; /&gt;
        &lt;/template&gt;
      template(v-slot:code).


</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import Example from '../Example.vue';
import VideoPlayer from '../VideoPlayer.vue';

@Component({
  components: {
    Example,
    VideoPlayer,
  },
})
export default class VideoPlayerDemo extends Vue {
}
</script>

<style lang="scss" scoped>
</style>
