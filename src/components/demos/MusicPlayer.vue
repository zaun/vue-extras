<template lang="pug">
  .demo.pa-4
    .display-1 MusicPlayer
    .body-1 Play a single track or a list of tracks. The player utilizes the HTML5 audio API, for best browser compatibility use mp3 or mp4 AAC.

    .headline.mt-5 Usage
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

    .headline.mt-5 Example
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
      url: '/track1.mp3',
      art: 'https://m.media-amazon.com/images/I/71TJHr9h7iL._SS500_.jpg',
      title: 'A-M Classical Beethoven - Für Elise',
    },
    {
      url: '/track2.mp3',
      art: 'https://i1.sndcdn.com/artworks-000120113151-sacbo4-t500x500.jpg',
      title: 'Bon: Sonata in g minor, mvt. 1',
    },
  ];
}
</script>

<style lang="scss" scoped>
</style>
