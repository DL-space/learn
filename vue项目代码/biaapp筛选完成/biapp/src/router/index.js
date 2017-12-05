import Vue from 'vue'
import Router from 'vue-router'
import NavLeft from '@/components/NavLeft'
import Default from '@/components/Default'
import DataAccess from '@/components/DataAccess'
import DataVisual from '@/components/DataVisual'
import DataDrag from '@/components/DataDrag'

Vue.use(Router)

export default new Router({
  routes: [
  	/*author:Elsa
      *date:2017/10/18 	
      * describe:点击横向菜单跳到数据源接入
      * */
    {
      path: '/dataAccess',
      name: 'dataAccess',
      components: {
        default: DataAccess,
        topLeft: null
      }
    },
     /*author:Elsa
      *date:2017/10/18 	
      * describe:点击横向菜单跳到编辑图表页面
      * */
     {
      path: '/dataVisual',
      name: 'dataVisual',
      components: {
        default: DataVisual,
        topLeft: null
      }
    },
    /*author:Elsa
      *date:2017/10/18 	
      * describe:点击横向菜单跳到绘制报表页面
      * */
     {
      /*path: '/dataDrag:radioChoose:chooseName',*/
     	path: '/dataDrag',
      name: 'dataDrag',
      components: {
        default: DataDrag,
        topLeft: null
      }
    }
    /*{
      path: '/',
      name: 'default',
      components: {
        default: Default,
        topLeft: null
      },
      children:[{
      	path: '/',
      	name: 'dataAccess',
      	component: DataAccess
      }]
    }*/
  ]
})
