import { createApp } from './lib/vue.esm-browser.js';

// Vue app
let rootComponent = {
    data() {
        return {
            count: 0,
        };
    }
}

// Setup vue
const app = createApp(rootComponent);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
