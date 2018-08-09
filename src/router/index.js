import Vue from 'vue'
import Router from 'vue-router'
import tableDynamic from '@/components/TableDynamic'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'tableDynamic',
      component: tableDynamic
    }
  ]
})
