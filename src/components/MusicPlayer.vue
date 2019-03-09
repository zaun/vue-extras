<template lang="pug">
  .audio-player
    .a-mini(v-if="display === 'mini'")
      .a-player
        .a-play-pause-btn(@click="doPlayPause")
          img(:src="controlIcon")
        .a-controls
          span.a-time {{ displayCurrentTime }}
          .a-slider(data-direction="horizontal")
            .a-progress(:style="{ width: progress + '%' }")
              .a-pin
          span.a-time {{ displayTotalTime }}
        .a-volume
          .a-volume-btn(@click.stop="onToggleVolume")
            img(:src="volumeIcon")
          .a-volume-controls(v-if="showVolume")
            .a-slider(@click="onVolumeChange" @mousedown="onDraggingStart" data-direction="vertical")
              .a-progress(:style="{ height: (volume * 100) + '%' }" data-name="volume")
                .a-pin

    .a-small(v-if="display === 'small'")
      .a-player
        .a-artwork(:style="artworkStyle" @click="doPlayPause")
          .a-play-pause-btn
            img(:src="controlIcon")
        .a-controls
          .a-top {{ title }}
          .a-bottom
            span.a-time {{ displayTime }}
            .a-slider(data-direction="horizontal")
              .a-progress(:style="{ width: progress + '%' }")
                .a-pin
            .a-volume
              .a-volume-btn(@click.stop="onToggleVolume")
                img(:src="volumeIcon")
              .a-volume-controls(v-if="showVolume")
                .a-slider(@click="onVolumeChange" @mousedown="onDraggingStart" data-direction="vertical")
                  .a-progress(:style="{ height: (volume * 100) + '%' }" data-name="volume")
                    .a-pin
    
    ul(v-if="playlist")
      li(v-for="(track, index) in tracks" :key="index" @click="doPlayItem(track)")
        span {{ index + 1  }}
        | {{ track.title }}
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
/* tslint:disable:no-var-requires */
const noCoverArt = require('@/assets/noCoverArt.png');
const playIcon = require('@/assets/play.png');
const pauseIcon = require('@/assets/pause.png');
const stopIcon = require('@/assets/stop.png');
const audio0 = require('@/assets/audio-0.png');
const audio1 = require('@/assets/audio-1.png');
const audio2 = require('@/assets/audio-2.png');
const audio3 = require('@/assets/audio-3.png');
/* tslint:enable */

interface Track {
  url: string;
  art: string;
  title: string;
}

interface TrackInternal extends Track {
  src: string;
}


@Component
export default class AudioPlayer extends Vue {
  @Prop({ default: [] })
  public tracks!: Track[];

  @Prop({ default: 'mini' })
  public display!: string;

  @Prop({ default: false })
  public playlist!: boolean;

  private player: HTMLAudioElement | null = null;       // The audio player
  private playerWatcher: number = -1;                   // The set interval for the audio player
  private coverArtUrl: string = noCoverArt;             // Current cover art URL
  private title: string = '';                           // Current title
  private showVolume: boolean = false;                  // True if the volumne slider is show
  private isPaused: boolean = true;                     // True if not playing
  private currentTime: number = 0;                      // Current time in seconds
  private duration: number = 0;                         // Total time in seconds
  private volume: number = 0;                           // Volume 0 to 1
  private track: TrackInternal | null = null;           // Currently playing track
  private currentlyDragged: HTMLElement | null = null;  //  Set if a slider is draggin

  // Return the style for the cover art of the current music
  private get artworkStyle() {
    return `background-image: url("${this.coverArtUrl}")`;
  }

  // Return the correct Play/Pause icon
  private get controlIcon() {
    if (this.player === null) {
      return playIcon;
    }

    if (this.isPaused) {
      return playIcon;
    } else {
      return pauseIcon;
    }
  }

  // Return the current/total time MM:SS / MM:SS
  private get displayTime(): string {
    // tslint:disable-next-line no-bitwise
    const minC: number = Math.floor((this.currentTime / 60) << 0);
    const secC: number = Math.floor((this.currentTime) % 60);
    // tslint:disable-next-line no-bitwise
    const minT: number = Math.floor((this.duration / 60) << 0);
    const secT: number = Math.floor((this.duration) % 60);
    let ret = '';
    if (minT > 0) {
      ret = this.pad(minC, 2) + ':';
    }
    ret += this.pad(secC, 2) + ' / ';
    if (minT > 0) {
      ret += this.pad(minT, 2) + ':';
    }
    ret += this.pad(secT, 2);
    return ret;
  }

  // Return the current M:SS
  private get displayCurrentTime(): string {
    let ret = '';
    // tslint:disable-next-line no-bitwise
    const minT: number = Math.floor((this.duration / 60) << 0);
    // tslint:disable-next-line no-bitwise
    const minC: number = Math.floor((this.currentTime / 60) << 0);
    const secC: number = Math.floor((this.currentTime) % 60);
    if (minT > 0) {
      ret = this.pad(minC, 1) + ':';
    }
    ret += this.pad(secC, 2);
    return ret;
  }

  // Return the total M:SS
  private get displayTotalTime(): string {
    let ret = '';
    // tslint:disable-next-line no-bitwise
    const minT = Math.floor((this.duration / 60) << 0);
    const secT = Math.floor((this.duration) % 60);
    if (minT > 0) {
      ret = this.pad(minT, 1) + ':';
    }
    ret += this.pad(secT, 2);
    return ret;
  }

  // Return the percent of the current track that has been played
  private get progress() {
    return this.currentTime / this.duration * 100;
  }

  // return the current volume icon.
  private get volumeIcon() {
    if (this.volume * 100 > 75) {
      return audio3;
    } else if (this.volume * 100 <= 0) {
      return audio0;
    } else if (this.volume * 100 < 25) {
      return audio1;
    }
    return audio2;
  }

  // setInterval function to keep the player updated from the audio component
  private watchPlayer() {
    if (this.player === null) {
      return;
    }

    this.currentTime = this.player.currentTime;
    this.isPaused = this.player.paused;
    this.duration = this.player.duration || 0;
    this.volume = this.player.volume;
  }

  // On mount, create the audio player, select the 1st track
  private mounted() {
    this.player = new Audio();
    this.player.addEventListener('ended', this.onEnded);

    if (this.tracks && this.tracks.length) {
      this.track = this.tracks[0] as TrackInternal;
    } else {
      this.track = {
        src: '',
        url: '',
        art: '',
        title: '',
      };
    }

    this.player.src =  this.track.url;
    this.title =  this.track.title || 'Unknown';
    this.coverArtUrl =  this.track.art || noCoverArt;

    const self = this;
  }

  // Add the global mouse events once, start the watcher
  private created() {
    this.playerWatcher = setInterval(this.watchPlayer.bind(self), 100);
    window.addEventListener('mouseup', this.onDraggingStop, false);
    window.addEventListener('mousemove', this.onDragging, false);
  }

  // Remove the watcher and the mouse events
  private destroyed() {
    if (this.playerWatcher !== -1) {
      clearInterval(this.playerWatcher);
    }
    if (this.player === null) {
      return;
    }

    window.removeEventListener('mouseup', this.onDraggingStop, false);
    window.removeEventListener('mousemove', this.onDragging, false);

    this.player.pause();
    this.player = null;
  }

  // Called when the current track is finished player
  // Will auto-start the next track if there is one
  private onEnded() {
    if (this.track === null) {
      return;
    }
    const idx = this.tracks.map((e) => e.url).indexOf(this.track.url);
    if (idx + 1 < this.tracks.length) {
      this.track = this.tracks[idx + 1] as TrackInternal;
      this.doPlayPause();
    } else {
      this.track = this.tracks[0] as TrackInternal;
    }
  }

  // Toggle the volume slider displace
  private onToggleVolume() {
    this.showVolume = !this.showVolume;
  }

  // Dragging event on the window on all mouse up events
  private onDraggingStop() {
    if (this.currentlyDragged !== null) {
      this.currentlyDragged = null;
      this.showVolume = false;
    }
  }

  // Dragging event on the window on all mouse move events
  private onDragging(event: MouseEvent) {
    let name: string = '';
    if (this.currentlyDragged && this.currentlyDragged.parentElement) {
      name = this.currentlyDragged.parentElement.dataset.name || '';
    }
    if (this.currentlyDragged !== null && name === 'volume') {
      this.onVolumeChange(event);
    }
  }

  // Dragging event on specific slider to start draggin
  private onDraggingStart(event: MouseEvent) {
    if (!this.isDraggable(event.target as HTMLElement) || this.currentlyDragged !== null) {
      return false;
    }
    this.currentlyDragged = event.target as HTMLElement;
  }

  // Update the volume from a mouse event on the volumen slide
  private onVolumeChange(event: MouseEvent) {
    this.doVolume(this.getCoefficient(event));
    if (event.type === 'click') {
      this.showVolume = false;
    }
  }

  // Return trun only on slider pins
  private isDraggable(el: HTMLElement) {
    let canDrag = false;
    const classes = Array.from(el.classList);
    if (classes.indexOf('a-pin') !== -1) {
      canDrag = true;
    }
    return canDrag;
  }

  // Get the slider based on the mouse event type
  private getRangeBox(event: MouseEvent): HTMLElement | null {
    if (event.target === null) {
      return null;
    }

    let rangeBox: HTMLElement | null = null;
    const el: HTMLElement | null = this.currentlyDragged;
    if (event.type === 'click' && this.isDraggable(event.target as HTMLElement)) {
      const target: HTMLElement = event.target as HTMLElement;
      if (target.parentElement !== null) {
        rangeBox = target.parentElement.parentElement;
      }
    }
    if (event.type === 'mousemove' && el !== null) {
      if (el.parentElement != null) {
        rangeBox = el.parentElement.parentElement;
      }
    }
    return rangeBox;
  }

  // returns 0 to 1 based on the slide position
  private getCoefficient(event: MouseEvent): number {
    const slider: HTMLElement | null = this.getRangeBox(event);
    if (slider === null) {
      return 0;
    }

    const rect: DOMRect = slider.getBoundingClientRect() as DOMRect;
    let K = 0;
    if (slider.dataset.direction === 'horizontal') {
      const offsetX = event.clientX - slider.offsetLeft;
      const width = slider.clientWidth;
      K = offsetX / width;
    } else if (slider.dataset.direction === 'vertical') {
      const height = slider.clientHeight;
      const offsetY = event.clientY - rect.top;
      K = 1 - offsetY / height;
    }
    return K < 0 ? 0 : K > 1 ? 1 : K;
  }

  // Pad a number with zeros
  private pad(num: number, size: number) {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }


  private doVolume(val: number) {
    if (this.player === null) {
      return;
    }
    this.player.volume = val;
  }

  private doChangeVolume(val: number) {
    this.doVolume(val);
    this.showVolume = false;
  }

  private doPlayItem(item: Track) {
    if ((this.track && this.track.url !== item.url) || this.isPaused) {
      this.track =  item as TrackInternal;
      this.doPlayPause();
    }
  }

  private doPlayPause() {
    if (this.player === null) {
      return;
    }

    if (this.track && this.player.src !== this.track.src) {
      this.player.pause();
      this.player.src =  this.track.url;
      this.track.src = this.player.src;
      this.title = this.track.title || 'Unknown';
      this.coverArtUrl = this.track.art || noCoverArt;
    }

    if (this.player.paused) {
      this.player.play();
    } else {
      this.player.pause();
    }
  }
}
</script>

<style lang="scss" scoped>
.audio-player {
  font-weight: 300;
  .a-mini {
    display: flax;
    flex-direction: column;
    align-items: center;
    height: 3em;
    .a-player {
      min-width: 300px;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 1rem;
      padding-right: 1rem;
      user-select: none;
      background-color: #fff;
      border: 1px solid #eee;
      .a-play-pause-btn {
        cursor: pointer;
        width: 2em;
        height: 2em;
        img {
          opacity: 0.5;
          width: 100%;
        }
      }
      .a-controls {
        font-size: 16px;
        line-height: 18px;
        color: #55606E;
        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        align-items: center;
        margin-left: 24px;
        margin-right: 24px;
        .a-time {
          cursor: default;
        }
      }
    }
  }

  .a-small {
    display: flax;
    flex-direction: column;
    align-items: center;
    height: 6em;
    .a-player {
      min-width: 300px;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 1rem;
      user-select: none;
      border: 1px solid #eee;
      .a-artwork {
        width: 6em;
        height: 6em;
        background-position: center center;
        background-size: cover;
        border-right: 1px solid #eee;
        cursor: pointer;
        .a-play-pause-btn {
          margin: 1.5em;
          width: 3em;
          height: 3em;
          opacity: 0.4;
          background-color: #fff;
          border-radius: 100px;
          img {
            width: 100%;
          }
        }
        &:hover {
          .a-play-pause-btn {
          opacity: 0.5;
          }
        }
      }
      .a-controls {
        height: 100%;
        font-size: 16px;
        line-height: 18px;
        color: #55606E;
        display: flax;
        flex-direction: row;
        flex-grow: 1;
        justify-content: space-between;
        align-items: center;
        margin-left: 1rem;
        .a-top {
          display: block;
          height: 1.3em;
          margin-top: 0.5em;
          line-height: 1.5;
          font-size: 1.5em;
          overflow: hidden;
        }
        .a-bottom {
          position: relative;
          font-size: 16px;
          line-height: 18px;
          color: #55606E;
          display: flex;
          flex-grow: 1;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }

  .a-slider {
    margin-left: 16px;
    margin-right: 16px;
    border-radius: 2px;
    height: 4px;
    flex-grow: 1;
    background-color: #D8D8D8;
    cursor: pointer;
    position: relative;
    .a-progress {
      height: 100%;
      background-color: #44BFA3;
      border-radius: inherit;
      position: absolute;
      pointer-events: none;
      .a-pin {
        height: 16px;
        width: 16px;
        border-radius: 8px;
        background-color: #44BFA3;
        position: absolute;
        pointer-events: all;
        box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.32);
        right: -8px;
        top: -6px;
      }
    }
  }

  .a-volume {
    position: relative;
    .a-volume-btn {
      cursor: pointer;
      width: 2em;
      height: 2em;
      img {
        opacity: 0.5;
        width: 100%;
      }
    }
  }
  
  .a-volume-controls {
    width: 30px;
    height: 135px;
    background-color: rgba(0, 0, 0, 0.62);
    border-radius: 7px;
    position: absolute;
    left: -3px;
    bottom: 52px;
    flex-direction: column;
    align-items: center;
    display: flex;
    bottom: -135px;
    left: -3px;
    z-index: 999;
    .a-slider {
      margin-top: 12px;
      margin-bottom: 12px;
      width: 6px;
      border-radius: 3px;
      .a-progress {
        bottom: 0;
        height: 100%;
        width: 6px;
        .a-pin {
          left: -5px;
          top: -8px;
        }
      }
    }
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      cursor: pointer;
      padding: 0 1em;
      border-bottom: 1px solid #eee;
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
      height: 3em;
      line-height: 3em;
      margin: 0;
      span {
        text-align: right;
        padding-right: 1em;
        display: inline-block;
        width: 2em;
      }
      &:hover {
        background-color: #eee;
      }
    }
  }
}
</style>