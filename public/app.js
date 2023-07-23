import { createApp } from './lib/vue.esm-browser.js';

import Editor from './editor.vue.js';
import Analysis from './analysis.vue.js';

// Setup vue
const app = createApp({});
app.component('Editor', Editor)
   .component('Analysis', Analysis);

app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
