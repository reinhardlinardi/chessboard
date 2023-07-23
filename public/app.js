import { createApp } from './lib/vue.esm-browser.js';

// Root component
let component = {};

// Setup vue
const app = createApp(component);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
