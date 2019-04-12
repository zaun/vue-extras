<template lang="pug">
  .demo.pa-4
    .display-1 AudioPlayer
    .body-1 Play a single track or a list of tracks. The player utilizes the HTML5 audio API, for best browser compatibility use mp3 or mp4 AAC.

    .headline.mt-5 Mini Player
    Example
      template(v-slot:output)
        AudioPlayer(:tracks="tracks")
          AudioHowler
          AudioMIDI
          AudioTracker
      template(v-slot:template).
        &lt;template&gt;
          &lt;AudioPlayer :value=&quot;tracks&quot; /&gt;
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
        AudioPlayer(:tracks="tracks" display="small" :playlist="true")
          AudioHowler
          AudioMIDI
          AudioTracker
      template(v-slot:template).
        &lt;template&gt;
          &lt;AudioPlayer :value=&quot;tracks&quot; display=&quot;small&quot; :playlist=&quot;true&quot; /&gt;
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
import AudioPlayer from '../AudioPlayer.vue';
import AudioHowler from '../AudioHowler.vue';
import AudioMIDI from '../AudioMIDI.vue';
import AudioTracker from '../AudioTracker.vue';

@Component({
  components: {
    Example,
    AudioPlayer,
    AudioHowler,
    AudioMIDI,
    AudioTracker,
  },
})
export default class SheetMusicDemo extends Vue {
  private tab: number = 0;
  private tracks = [
    {
      url: 'track1.mp3',
      art: 'track1.jpg',
      title: '(MP3) A-M Classical Beethoven - Für Elise',
    },
    {
      url: 'track2.ogg',
      art: 'track2.png',
      title: '(OGG) Cyaron’s Gate',
    },
    {
      url: 'track3.flac',
      art: 'track2.png',
      title: '(FLAC) King of the Desert',
    },
    {
      url: 'track4.m4a',
      art: 'track4.jpg',
      title: '(M4A) The Shirts, I Declare War excerpt',
    },
    {
      url: 'track4.m4a',
      art: 'track4.jpg',
      title: '(M4A) The Shirts, I Declare War excerpt',
    },
    {
      url: 'track5.xm',
      title: '(XM) Dream Candy',
    },
    {
      url: 'track6.mid',
      title: '(MID) Bohemian Rhapsody',
    },
    {
      url: 'track7.mod',
      title: '(MOD) Lady Lucifer',
    },
  ];
}
</script>

<style lang="scss" scoped>
</style>
