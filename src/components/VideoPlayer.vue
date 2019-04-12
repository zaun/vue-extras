<template lang="pug">
  div(ref="container")
    div(ref="video")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

interface Dailymotion {
  player: any;
}

interface Twitch {
  Embed: any;
}

interface YouTube {
  Player: any;
}

interface Vimeo {
  Player: any;
}

declare global {
  interface Window {
    DM: Dailymotion;
    Twitch: Twitch;
    YT: YouTube;
    Vimeo: Vimeo;
  }
}

@Component
export default class VideoPlayer extends Vue {
  @Prop({ default: null })
  public dailymotion!: string;
  @Prop({ default: null })
  public twitch!: string;
  @Prop({ default: null })
  public vimeo!: string;
  @Prop({ default: null })
  public youtube!: string;

  private embed!: any;
  private player!: any;
  private lastWidth: number = 0;
  private waitForLoad: number = 1000;

  private dmLoaded: boolean = false;
  private ttvLoaded: boolean = false;
  private vimLoaded: boolean = false;
  private ytLoaded: boolean = false;

  private created() {
    window.addEventListener('resize', this.resizeIframe);
  }

  private destroyed() {
    window.removeEventListener('resize', this.resizeIframe);
    if (this.embed && this.embed.destroy) {
      this.embed.destroy();
    }
  }

  private mounted() {
    if (this.dailymotion !== null) {
      this.loadScript('dailymotion-script', 'https://api.dmcdn.net/all.js');
      this.checkForDailymotion();
    }
    if (this.vimeo !== null) {
      this.loadScript('vimeo-script', 'https://player.vimeo.com/api/player.js');
      this.checkForVimeo();
    }
    if (this.youtube !== null) {
      this.loadScript('youtube-script', 'https://www.youtube.com/iframe_api');
      this.checkForYoutube();
    }
    if (this.twitch !== null) {
      this.loadScript('twitch-script', 'https://embed.twitch.tv/embed/v1.js');
      setTimeout(this.checkForTwitch, 100);
    }
  }


  private checkForDailymotion() {
    if (this.dmLoaded || this.waitForLoad === 0) {
      this.resizeIframe();
      return;
    }

    if (window.DM && window.DM.player) {
      this.dmLoaded = true;
      this.onReadyDailymotion();
    } else {
      this.waitForLoad -= 1;
      setTimeout(this.checkForDailymotion);
    }
  }

  private checkForTwitch() {
    if (this.ttvLoaded || this.waitForLoad === 0) {
      this.resizeIframe();
      return;
    }

    if (window.Twitch && window.Twitch.Embed) {
      this.ttvLoaded = true;
      this.onReadyTwitch();
    } else {
      this.waitForLoad -= 1;
      setTimeout(this.onReadyTwitch);
    }
  }

  private checkForVimeo() {
    if (this.vimLoaded || this.waitForLoad === 0) {
      this.resizeIframe();
      return;
    }

    if (window.Vimeo && window.Vimeo.Player) {
      this.vimLoaded = true;
      this.onReadyViemo();
    } else {
      this.waitForLoad -= 1;
      setTimeout(this.checkForVimeo);
    }
  }

  private checkForYoutube() {
    if (this.ytLoaded || this.waitForLoad === 0) {
      this.resizeIframe();
      return;
    }

    if (window.YT && window.YT.Player) {
      this.ytLoaded = true;
      this.onReadyYoutube();
    } else {
      this.waitForLoad -= 1;
      setTimeout(this.checkForYoutube);
    }
  }

  private generateUUID() {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
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

  private onReadyDailymotion() {
    this.player = new window.DM.player(this.$refs.video, {
      video: this.dailymotion,
    });
    this.resizeIframe();
  }

  private onReadyTwitch() {
    this.embed = new window.Twitch.Embed(this.$refs.video, {
      video: this.twitch,
    });
    this.embed.addEventListener(window.Twitch.Embed.VIDEO_READY, () => {
      this.player = this.embed.getPlayer();
      this.player.pause();
      this.resizeIframe();
    });
    this.resizeIframe();
  }

  private onReadyViemo() {
    this.player = new window.Vimeo.Player(this.$refs.video, {
      id: this.vimeo,
    });
    this.resizeIframe();
  }

  private onReadyYoutube() {
    this.player = new window.YT.Player(this.$refs.video, {
      videoId: this.youtube,
      events: {
        onReady: () => {
          this.resizeIframe();
        },
      },
      playerVars: {
        playerapiid: this.generateUUID(),
        controls: 1,
        autoplay: 0,
        disablekb: 1,
        enablejsapi: 1,
        iv_load_policy: 3,
        modestbranding: 1,
        showinfo: 0,
        rel: 0,
        theme: 'light',
      },
    });
    this.resizeIframe();
  }

  private resizeIframe() {
    const container = this.$refs.container as HTMLElement;
    if (container && container.offsetWidth && container.offsetWidth !== this.lastWidth) {
      const iframe = container.querySelector('iframe') as HTMLIFrameElement;
      if (iframe) {
        this.lastWidth = container.offsetWidth;

        const w: number = iframe.offsetWidth;
        const h: number = iframe.offsetHeight;
        const ar: number = h / w;

        iframe.setAttribute('width', container.offsetWidth.toString());
        iframe.setAttribute('height', (container.offsetWidth * ar).toString());
      } else {
        setTimeout(this.resizeIframe);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
