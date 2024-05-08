import { createApp } from 'vue';
import './style.css';
import 'normalize.css';
// 1. 引入你需要的组件
// 2. 引入组件样式
import { Button } from 'vant';
import { RadioGroup, Radio } from 'vant';
import { ConfigProvider } from 'vant';
import 'vant/lib/index.css';

import App from './App.vue';

const app = createApp(App);

app.use(Button);
app.use(RadioGroup);
app.use(Radio);
app.use(ConfigProvider);

app.mount('#app');
