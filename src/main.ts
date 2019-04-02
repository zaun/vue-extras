import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import MapInitlize from './mapInitlize';

Vue.config.productionTip = false;
Vue.use(MapInitlize, (done: (token: string) => {}) => {
  if (process.env.NODE_ENV === 'development') {
    fetch(`http://localhost:8081/token/mapkit`)
    .then((res) => res.json())
    .then((body) => {
      done(body.token);
    });
  } else {
    done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikg4N1FXNU02WjQifQ.eyJvcmlnaW4iOiJodHRwczovL3phdW4uZ2l0aHViLmlvIiwiaWF0IjoxNTU0MTgxMDQ5LCJleHAiOjE1NTQ3ODU4NDksImlzcyI6IjhCVTJZOEM1SjcifQ.y2mUCTt0qweMkKrX8Pu6LS9g20CDONWv9fVJR6kuINBVTgrbnmBRanno4VwoyQwOCEAfhCoM666YTjHXjYWz_w');
  }
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
