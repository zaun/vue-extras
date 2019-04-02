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
    done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikg4N1FXNU02WjQifQ.eyJvcmlnaW4iOiJodHRwczovL3phdW4uZ2l0aHViLmlvLyIsImlhdCI6MTU1NDE3Mjc4NCwiZXhwIjoxNTU0MTczMTQ0LCJpc3MiOiI4QlUyWThDNUo3In0.DSY7r_dhsJltIf5dlVXchPOl8Vra6sCu5yQZgJDWpIPGBuv7BhD84aKXqvfxZqnfR7n0eRHAmQAAVdArLp0UeA');
  }
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
