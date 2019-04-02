<template lang="pug">
  .demo.pa-4
    .display-1 MusicPlayer
    .body-1 Play a single track or a list of tracks. The player utilizes the HTML5 audio API, for best browser compatibility use mp3 or mp4 AAC.

    .headline.mt-5 Mini Player
    Example
      template(v-slot:output)
        MusicPlayer(:tracks="tracks")
      template(v-slot:template).
        &lt;template&gt;
          &lt;MusicPlayer :value=&quot;tracks&quot; /&gt;
        &lt;/template&gt;
      template(v-slot:code).
        &lt;script&gt;
          export default {
            data () {
              return {
                tracks: [
                  {
                    url: 'track1.mp3',
                    art: 'track1_cover.jpg', 
                    title: 'A-M Classical Beethoven - F&uuml;r Elise'
                  },
                  {
                    url: 'track2.mp3',
                    art: 'track2_cover.jpg',  
                    title: 'Bon: Sonata in g minor, mvt. 1'
                  }
                ],
              };
            };
          },
        &lt;/script&gt;      

    .headline.mt-5 Small Player
    Example
      template(v-slot:output)
        MusicPlayer(:tracks="tracks" display="small" :playlist="true")
      template(v-slot:template).
        &lt;template&gt;
          &lt;MusicPlayer :value=&quot;tracks&quot; display=&quot;small&quot; :playlist=&quot;true&quot; /&gt;
        &lt;/template&gt;
      template(v-slot:code).
        &lt;script&gt;
          export default {
            data () {
              return {
                tracks: [
                  {
                    url: '/track1.mp3',
                    art: '/track1_cover.jpg', 
                    title: 'A-M Classical Beethoven - F&uuml;r Elise'
                  },
                  {
                    url: '/track2.mp3',
                    art: '/track2_cover.jpg',  
                    title: 'Bon: Sonata in g minor, mvt. 1'
                  }
                ],
              };
            };
          },
        &lt;/script&gt;   
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import Example from '../Example.vue';
import MusicPlayer from '../MusicPlayer.vue';

@Component({
  components: {
    Example,
    MusicPlayer,
  },
})
export default class SheetMusicDemo extends Vue {
  private tab: number = 0;
  private tracks = [
    {
      url: 'track1.mp3',
      art: 'track1.jpg',
      title: 'A-M Classical Beethoven - Für Elise',
    },
    {
      url: 'track2.mp3',
      art: 'track2.jpg',
      title: 'Bon: Sonata in g minor, mvt. 1',
    },
  ];
}
</script>

<style lang="scss" scoped>
</style>
