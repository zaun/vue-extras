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
    done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikg4N1FXNU02WjQifQ.eyJvcmlnaW4iOiJodHRwczovL3phdW4uZ2l0aHViLmlvIiwiaWF0IjoxNTU0NDM3NjQyLCJleHAiOjE1NTQ0Mzc4ODIsImlzcyI6IjhCVTJZOEM1SjcifQ.JTaE2QaT4N6DhY_SnRH2NB6MQN3tmYKnc4Fw24U_kX7ozLH3RUQzNtEuI4VSRtxvtEX1NztuH4QsgZ4S2XF6nQ');
  }
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
