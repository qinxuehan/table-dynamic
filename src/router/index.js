import Vue from 'vue'
import Router from 'vue-router'
import tableDynamic from '@/components/TableDynamic'
import treeTable from '@/components/TreeTable'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'tableDynamic',
      component: tableDynamic
    },
    {
      path: '/treeTable',
      name: 'treeTable',
      component: treeTable
    }
  ]
})
