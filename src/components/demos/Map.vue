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
          &lt;Map :region=&quot;cupertinoRegion&quot; style=&quot;height: 350px;&quot; /&gt;
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
          v-flex(xs12)
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
        v-layout(row wrap)
          v-flex.pl-3(xs6 md3)
            v-checkbox(v-model="showsMapTypeControl" label="Map Type Control")
          v-flex.pl-3(xs6 md3)
            v-checkbox(v-model="showsZoomControl" label="Zoom Control")
          v-flex.pl-3(xs6 md3)
            v-checkbox(v-model="showsUserLocationControl" label="User Location Control")
          v-flex.pl-3(xs6 md3)
            v-checkbox(v-model="showsCompassControl" label="Compass Control" messages="Not visible if Rotation is disabled")
          v-flex.pl-3(xs6 md3)
            v-checkbox(v-model="showsScale" label="Scale")
          v-flex.pl-3(xs6 md3)
            v-slider(v-model="rotation" min="0" max="360" thumb-label="always" label="Rotation")
        v-layout(row wrap)
          v-flex.pl-3(xs12 md3)
            v-checkbox(v-model="isRotationEnabled" label="Is Rotation Available" messages="Enable / disable gestures to rotate the map")
          v-flex.pl-3(xs12 md3)
            v-checkbox(v-model="isScrollEnabled" label="Is Scroll Enabled" messages="Enable / disable the mouse to move the map")
          v-flex.pl-3(xs12 md3)
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
               style=&quot;height: 350px;&quot; /&gt;
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
        Map.map-sample(
          :region="cupertinoRegion"
          :isRotationEnabled="false"
          :isScrollEnabled="false"
          :isZoomEnabled="false"
          :showsZoomControl="false"
          :showsMapTypeControl="false"
        )
          MapCircleOverlay(v-if="overlayType == 'Circle'" :coordinate="circleCenter" :radiusKM="circleRadius")
          MapPolylineOverlay(v-if="overlayType == 'Polyline'" :points="poly")
          MapPolygonOverlay(v-if="overlayType == 'Polygon'" :points="poly")
        v-layout(row wrap)
          v-flex.pt-4.pr-3(xs6)
            v-select(:items="overlayTypes" v-model="overlayType" label="Type")
          v-flex.pt-4(xs6 v-if="overlayType == 'Circle'")
            v-slider(v-model="circleRadius" min="1" max="5" thumb-label="always" step="0.1" label="Radius (km)")
        v-layout(row wrap)
          v-flex.pt-4.pr-3(xs6 v-if="overlayType != 'Circle'")
            v-slider(v-model="poly[0].latitude" min="37.25" max="37.41" thumb-label="always" thumb-size="45" step="0.01" label="P1.lat")
          v-flex.pt-4.pr-3(xs6 v-if="overlayType != 'Circle'")
            v-slider(v-model="poly[0].longitude" min="-122.21" max="-121.85" thumb-label="always" thumb-size="45" step="0.01" label="P1.lon")
          v-flex.pt-4.pr-3(xs6 v-if="overlayType != 'Circle'")
            v-slider(v-model="poly[1].latitude" min="37.25" max="37.41" thumb-label="always" thumb-size="45" step="0.01" label="P2.lat")
          v-flex.pt-4.pr-3(xs6 v-if="overlayType != 'Circle'")
            v-slider(v-model="poly[1].longitude" min="-122.21" max="-121.85" thumb-label="always" thumb-size="45" step="0.01" label="P2.lon")
          v-flex.pt-4.pr-3(xs6 v-if="overlayType != 'Circle'")
            v-slider(v-model="poly[2].latitude" min="37.25" max="37.41" thumb-label="always" thumb-size="45" step="0.01" label="P3.lat")
          v-flex.pt-4.pr-3(xs6 v-if="overlayType != 'Circle'")
            v-slider(v-model="poly[2].longitude" min="-122.21" max="-121.85" thumb-label="always" thumb-size="45" step="0.01" label="P3.lon")
      template(v-slot:template).
        &lt;template&gt;
          &lt;Map :region=&quot;cupertinoRegion&quot; style=&quot;height: 350px;&quot;&gt;
            &lt;MapCircleOverlay :coordinate=&quot;circleCenter&quot; radiusKM=&quot;circleRadius&quot; /&gt;
            &lt;MapPolylineOverlay :points=&quot;poly&quot; /&gt;
            &lt;MapPolygonOverlay :points=&quot;poly&quot; /&gt;
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

                poly: [{
                  latitude: 37.39,
                  longitude: -122.12,
                }, {
                  latitude: 37.33,
                  longitude: -121.92,
                }, {
                  latitude: 37.27,
                  longitude: -122.12,
                }]
              };
            };
          },
        &lt;/script&gt;

    .headline.mt-5 Annotaions
    Example
      template(v-slot:output)
        Map.map-sample(:region="cupertinoRegion")
          MapMarkerAnnotation(:coordinate="annotation" :glyph-text="glyphText" :title="title", :subtitle="subtitle")
        v-layout(row wrap)
          v-flex.pt-4.pr-3(xs4)
            v-text-field(v-model="glyphText" label="Glyph" messages="Unicode and emoji work")
          v-flex.pt-4.pr-3(xs4)
            v-text-field(v-model="title" label="Title")
          v-flex.pt-4.pr-3(xs4)
            v-text-field(v-model="subtitle" label="Subtitle")
      template(v-slot:template).
        &lt;template&gt;
          &lt;Map :region=&quot;cupertinoRegion&quot; style=&quot;height: 350px;&quot;&gt;
            &lt;MapAnnotation :coordinate=&quot;circleCenter&quot; /&gt;
          &lt;/Map&gt;
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


    .headline.mt-5 GEO JSON
    Example
      template(v-slot:output)
        Map.map-sample(:region="usRegion")
          MapGeoJSON(:geo="state(selectedState)")
        v-select(:items="stateNames" v-model="selectedState" label="Type")
      template(v-slot:template).
        &lt;template&gt;
          &lt;Map :region=&quot;usRegion&quot; style=&quot;height: 350px;&quot;&gt;
            &lt;MapGeoJSON :geo=&quot;data&quot; /&gt;
          &lt;/Map&gt;
        &lt;/template&gt;
      template(v-slot:code).
        &lt;script&gt;
          export default {
            data () {
              return {
                usRegion = {
                  center: {
                    latitude: 39.8283,
                    longitude: -98.5795,
                  },
                  span: {
                    latitudeDelta: 25,
                    longitudeDelta: 60,
                  },
                },
              };
            };
          },
        &lt;/script&gt;   


</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { find, map } from 'lodash';
import CodeHighlight from '../CodeHighlight.vue';
import Example from '../Example.vue';
import Map from '../Map.vue';
import MapMarkerAnnotation from '../MapMarkerAnnotation.vue';
import MapCircleOverlay from '../MapCircleOverlay.vue';
import MapPolylineOverlay from '../MapPolylineOverlay.vue';
import MapPolygonOverlay from '../MapPolygonOverlay.vue';
import MapGeoJSON from '../MapGeoJSON.vue';
import usStates from '@/assets/us_states.json';

@Component({
  components: {
    CodeHighlight,
    Example,
    Map,
    MapMarkerAnnotation,
    MapCircleOverlay,
    MapPolylineOverlay,
    MapPolygonOverlay,
    MapGeoJSON,
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
  private overlayTypes = [
    'Circle',
    'Polyline',
    'Polygon',
  ];
  private overlayType = 'Circle';

  private circleCenter = {
    latitude: 37.3316850890998,
    longitude: -122.030067374026,
  };
  private poly = [{
    latitude: 37.39,
    longitude: -122.12,
  }, {
    latitude: 37.33,
    longitude: -121.92,
  }, {
    latitude: 37.27,
    longitude: -122.12,
  }];

  private circleRadius = 2;

  /**
   * Annotations
   */
  private annotation = {
    latitude: 37.3316850890998,
    longitude: -122.030067374026,
  };
  private glyphText = '';
  private title = 'Title';
  private subtitle = 'Subtitle';

  /**
   * GEO JSON
   */
  private usRegion = {
    center: {
      latitude: 39.8283,
      longitude: -98.5795,
    },
    span: {
      latitudeDelta: 25,
      longitudeDelta: 60,
    },
  };

  private states = usStates;
  private selectedState = 'Maine';
  private get stateNames() {
    return map(this.states.features, (f) => {
      return f.properties.NAME;
    }).sort();
  }

  private state(name: string) {
    return find(this.states.features, (f) => {
      return f.properties.NAME === name;
    });
  }
}
</script>

<style lang="scss" scoped>
.map-sample {
  height: 350px;
}
</style>
