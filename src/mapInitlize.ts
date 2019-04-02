declare global {
  interface Window { mapkit: any; }
}

interface IPrototype { prototype: any; }

const MapInitilize = {

  loadScript(id: string, src: string, onLoad: () => void) {
    let scriptEl = document.querySelector('#' + id);
    if (scriptEl != null) {
      return;
    }
    scriptEl = document.createElement('script');
    scriptEl.setAttribute('id', id);
    scriptEl.setAttribute('src', src);
    if (onLoad) {
      scriptEl.addEventListener('load', onLoad);
    }
    const head = document.querySelector('head');
    if (head) {
      head.appendChild(scriptEl);
    }
  },

  install(Vue: object, getToken: (done: (token: string) => {}) => {}) {
    MapInitilize.loadScript('map-apple', 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js', () => {
      window.mapkit.addEventListener('configuration-change', (event: any) => {
        switch (event.status) {
          case 'Initialized':
            (Vue as IPrototype).prototype.$mapkit = window.mapkit;
            break;
          case 'Refreshed':
            break;
        }
      });

      window.mapkit.addEventListener('error', (event: any) => {
        throw(new Error(event));
      });

      window.mapkit.init({
        authorizationCallback: getToken,
        language: 'en',
      });
    });
  },
};

export default MapInitilize;
