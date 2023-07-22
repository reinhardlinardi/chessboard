import { createApp } from './lib/vue.esm-browser.js';
import Editor from './editor.vue.js';

// Setup vue
const app = createApp({});
app.component('Editor', Editor);

app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
