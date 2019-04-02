<template lang="pug">
  .demo.pa-4
    .display-1 Map
    .body-1 Display a map using Apple's MapKit.
      | To ustilize the map, you must initilize the service to provide your autorization
      | token. Please follow Apple's 
      a(target="_blank" href="https://developer.apple.com/maps/mapkitjs/") documentation
      | &nbsp;or&nbsp;
      a(target="_blank" href="https://developer.apple.com/videos/play/wwdc2018/508") video
      |.
    CodeHighlight(language="javascript").
      // Retrieve from a route
      Vue.use(MapInitlize, (done) => {
        fetch(`http://server.com/token`)
        .then((res) => res.json())
        .then((body) => {
          done(body.token);
        });
      });

      // Provide inline
      Vue.use(MapInitlize, (done) => {
        done('TOKEN HERE');
      });

    .headline.mt-5 Basic Map
    Example
      template(v-slot:output)
        Map.map-sample(:region="cupertinoRegion")
      template(v-slot:template).
        &lt;template&gt;
          &lt;Map :region=&quot;cupertinoRegion&quot; style=&quot;height: 450px;&quot; /&gt;
        &lt;/template&gt;
      template(v-slot:code).
        &lt;script&gt;
          export default {
            data () {
              return {
                cupertinoRegion: {
                  center: {
                    latitude: 37.3316850890998,
                    longitude: -122.030067374026,
                  },
                  span: {
                    latitudeDelta: 0.167647972,
                    longitudeDelta: 0.354985255,
                  },
                },
              };
            };
          },
        &lt;/script&gt;   

    .headline.mt-5 Map Controls
    Example
      template(v-slot:output)
        v-layout(row)
          v-flex(xs9)
            Map.map-sample(
              :region="cupertinoRegion"
              :rotation="rotation"
              :showsScale="showsScale"
              :showsMapTypeControl="showsMapTypeControl"
              :showsZoomControl="showsZoomControl"
              :showsUserLocationControl="showsUserLocationControl"
              :showsCompassControl="showsCompassControl"
              :isRotationEnabled="isRotationEnabled"
              :isScrollEnabled="isScrollEnabled"
              :isZoomEnabled="isZoomEnabled"
            )
          v-flex.pl-3(xs3)
            v-checkbox(v-model="showsMapTypeControl" label="Show Map Type Control")
            v-checkbox(v-model="showsZoomControl" label="Show Zoom Control")
            v-checkbox(v-model="showsUserLocationControl" label="Show User Location Control")
            v-checkbox(v-model="showsCompassControl" label="Show Compass Control" messages="Not visible if Rotation is disabled")
            v-checkbox(v-model="showsScale" label="Show Scale")
            v-slider(v-model="rotation" min="0" max="360" thumb-label="always" label="Rotation")
        v-layout(row)
          v-flex(4)
            v-checkbox(v-model="isRotationEnabled" label="Is Rotation Available" messages="Enable / disable gestures to rotate the map")
          v-flex(4)
            v-checkbox(v-model="isScrollEnabled" label="Is Scroll Enabled" messages="Enable / disable the mouse to move the map")
          v-flex(4)
            v-checkbox(v-model="isZoomEnabled" label="Is Zoom Enabled" messages="Enable / disable gestures or the mouse to zoom the map")
      template(v-slot:template).
        &lt;template&gt;
          &lt;Map :region=&quot;cupertinoRegion&quot;
               :rotation="rotation&quot;
               :showsScale="showsScale&quot;
               :showsMapTypeControl="showsMapTypeControl&quot;
               :showsZoomControl="showsZoomControl&quot;
               :showsUserLocationControl="showsUserLocationControl&quot;
               :showsCompassControl="showsCompassControl&quot;
               :isRotationEnabled="isRotationEnabled&quot;
               :isScrollEnabled="isScrollEnabled&quot;
               :isZoomEnabled="isZoomEnabled&quot;
               style=&quot;height: 450px;&quot; /&gt;
        &lt;/template&gt;
      template(v-slot:code).
        &lt;script&gt;
          export default {
            data () {
              return {
                cupertinoRegion: {
                  center: {
                    latitude: 37.3316850890998,
                    longitude: -122.030067374026,
                  },
                  span: {
                    latitudeDelta: 0.167647972,
                    longitudeDelta: 0.354985255,
                  },
                },

                showsMapTypeControl: false,
                showsZoomControl: false,
                showsUserLocationControl: false,
                showsCompassControl: false,
                showsScale: false,
                rotation: 0,

                isRotationEnabled: true,
                isScrollEnabled: true,
                isZoomEnabled: true,
              };
            };
          },
        &lt;/script&gt; 

    .headline.mt-5 Overlays
    Example
      template(v-slot:output)
        v-layout(row)
          v-flex(xs9)
            Map.map-sample(:region="cupertinoRegion")
              MapCircleOverlay(v-if="showCircleOverlay" :coordinate="circleCenter" :radiusKM="circleRadius")
              MapPolylineOverlay(v-if="showPolylineOverlay" :points="line")
          v-flex.pl-3(xs3)
            v-checkbox(v-model="showCircleOverlay" label="Show Circle Overlay")
            v-slider(v-model="circleRadius" min="1" max="5" thumb-label="always" step="0.1" label="Radius (km)")
            v-checkbox(v-model="showPolylineOverlay" label="Show Polyline Overlay")
            v-slider(v-model="line[1].latitude" min="37.25" max="37.41" thumb-label="always" step="0.01")
            v-slider(v-model="line[1].longitude" min="-122.21" max="-121.85" thumb-label="always" step="0.01")
      template(v-slot:template).
        &lt;template&gt;
          &lt;Map :region=&quot;cupertinoRegion&quot; style=&quot;height: 450px;&quot;&gt;
            &lt;MapCircleOverlay :coordinate=&quot;circleCenter&quot; radiusKM=&quot;circleRadius&quot; /&gt;
            &lt;MapPolylineOverlay :points=&quot;line&quot; /&gt;
          &lt;/Map&gt;
        &lt;/template&gt;
      template(v-slot:code).
        &lt;script&gt;
          export default {
            data () {
              return {
                cupertinoRegion: {
                  center: {
                    latitude: 37.3316850890998,
                    longitude: -122.030067374026,
                  },
                  span: {
                    latitudeDelta: 0.167647972,
                    longitudeDelta: 0.354985255,
                  },
                },

                circleCenter: {
                  latitude: 37.3316850890998,
                  longitude: -122.030067374026,
                },

                line: [{
                  latitude: 37.3316850890998,
                  longitude: -122.030067374026,
                }, {
                  latitude: 37.3,
                  longitude: -122.0,
                }]
              };
            };
          },
        &lt;/script&gt;

</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import CodeHighlight from '../CodeHighlight.vue';
import Example from '../Example.vue';
import Map from '../Map.vue';
import MapCircleOverlay from '../MapCircleOverlay.vue';
import MapPolylineOverlay from '../MapPolylineOverlay.vue';

@Component({
  components: {
    CodeHighlight,
    Example,
    Map,
    MapCircleOverlay,
    MapPolylineOverlay,
  },
})
export default class MapDemo extends Vue {
  private cupertinoRegion = {
    center: {
      latitude: 37.3316850890998,
      longitude: -122.030067374026,
    },
    span: {
      latitudeDelta: 0.167647972,
      longitudeDelta: 0.354985255,
    },
  };


  /**
   * Control Demo
   */
  private showsMapTypeControl = false;
  private showsZoomControl = false;
  private showsUserLocationControl = false;
  private showsCompassControl = false;
  private showsScale = false;
  private rotation = 0;

  private isRotationEnabled = true;
  private isScrollEnabled = true;
  private isZoomEnabled = true;


  /**
   * Overlay Demo
   */
  private circleCenter = {
    latitude: 37.3316850890998,
    longitude: -122.030067374026,
  };
  private line = [{
    latitude: 37.3316850890998,
    longitude: -122.030067374026,
  }, {
    latitude: 37.3,
    longitude: -122.0,
  }];

  private showCircleOverlay = true;
  private circleRadius = 2;
  private showPolylineOverlay = true;
}
</script>

<style lang="scss" scoped>
.map-sample {
  height: 450px;
}
</style>
