<template lang="pug">
#playback-title
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { Howl, Howler } from 'howler';

interface Player {
  load: (url: string, autoPlay?: boolean) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  volume: () => number;
  setVolume: (val: number) => void;
  duration: () => number;
  currentTime: () => number;
  isPlaying: () => boolean;
}

@Component
export default class AudioHowler extends Vue {

  private audio: Howl | null = null;
  private playerWatcher: number = -1;

  private pCurrentTime: number = 0;
  private pDuration: number = 0;
  private pVolume: number = 0;

  private nextTrack: null | ((autoPlay: boolean) => {}) = null;

  private player: Player = {
    load: this.load,
    play: this.play,
    pause: this.pause,
    stop: this.stop,
    volume: this.volume,
    setVolume: this.setVolume,
    duration: this.duration,
    currentTime: this.currentTime,
    isPlaying: this.isPlaying,
  };

  private mounted() {
    if (this.$parent && this.$parent.$data.players) {
      this.$parent.$data.players.mid = this.player;

      this.nextTrack = (this.$parent as any).nextTrack;
    }

    const self = this;
    this.playerWatcher = setInterval(this.watchPlayer.bind(self), 100);

    if (!window.MIDI) {
      this.loadScript('midi-script', 'https://cdnjs.cloudflare.com/ajax/libs/midi.js/0.3.0/midi.min.js');
    }
    this.waitForPlayer();
  }

  private waitForPlayer() {
    if (!window.MIDI || !window.MIDI.Player) {
      setTimeout(this.waitForPlayer);
    } else {
      this.audio = window.MIDI.Player;
    }
  }

  private beforeDestroy() {
    if (this.$parent && this.$parent.$data.players) {
      delete this.$parent.$data.players.mid;
    }
    if (this.playerWatcher !== -1) {
      clearInterval(this.playerWatcher);
    }
    if (this.audio !== null) {
      this.audio.stop();
    }
  }

  private loadScript(id: string, src: string) {
    let scriptEl = document.querySelector('#' + id);
    if (scriptEl != null) {
      return;
    }
    scriptEl = document.createElement('script');
    scriptEl.setAttribute('id', id);
    scriptEl.setAttribute('src', src);
    const head = document.querySelector('head');
    if (head) {
      head.appendChild(scriptEl);
    }
  }

  private watchPlayer() {
    // if (this.audio === null) {
    //   this.pCurrentTime = 0;
    //   this.pDuration = 0;
    //   this.pVolume = 0;
    //   return;
    // }

    // const ct: number = this.audio.seek() as number;
    // if (Number.isNaN(ct)) {
    //   this.pCurrentTime = 0;
    // } else {
    //   this.pCurrentTime = ct;
    // }

    // this.pDuration = this.audio.duration() || 1;
    // this.pVolume = this.audio.volume() * 100;
  }

  private currentTime(): number {
    return this.pCurrentTime;
  }

  private duration(): number {
    return this.pDuration;
  }

  private volume(): number {
    return this.pVolume;
  }

  private setVolume(val: number) {
    // if (this.audio) {
    //   this.audio.volume(val / 100);
    // }
  }

  private load(url: string, autoPlay?: boolean) {
    if (this.audio === null) {
      return;
    }

    console.log('load', url);
    this.audio.loadFile(url, () => {
      this.play();
    }, (p) => {
      console.log('p', p);
    }, (err) => {
      console.log('err', err);
    });
  }

  private isPlaying(): boolean {
    if (this.audio === null) {
      return false;
    }
    return this.audio.playing;
  }

  private play() {
    if (this.audio === null) {
      return;
    }
    this.audio.start();
  }

  private pause() {
    if (this.audio === null) {
      return;
    }
    this.audio.pause();
  }

  private stop() {
    if (this.audio === null) {
      return;
    }
    this.audio.stop();
  }
}
</script>
