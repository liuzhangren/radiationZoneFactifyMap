import Vue from 'vue'
import Router from 'vue-router'
import Map from '../components/olmap.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Map',
      component: Map
    }
  ]
})