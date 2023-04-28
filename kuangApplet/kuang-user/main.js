import App from './App'
import { createSSRApp } from 'vue'


// 公用样式
import './Common-style/style.css'



export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}