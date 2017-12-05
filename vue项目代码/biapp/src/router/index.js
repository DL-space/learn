import Vue from 'vue'
import Router from 'vue-router'
import TopNav from '@/components/TopNav'
import TopBack from '@/components/TopBack'
import NavLeft from '@/components/NavLeft'
import Login from '@/components/Login'
import IntelligentDefault from '@/components/IntelligentDefault'
import OverView from '@/components/OverView'
import KeySelect from '@/components/KeySelect'
import Warning from '@/components/Warning'
import BuildSelect from '@/components/BuildSelect'
import WarningToNew from '@/components/WarningToNew'
import CanvasTest from '@/components/CanvasTest'
import VuexTest from '@/components/VuexTest'

Vue.use(Router);

export default new Router({
  routes: [
  	/*author:Elsa
      *date:2017/10/31 	
      * describe:智能分析二级菜单
      * */
     {
      path: '/',
      name: 'default',     
      components: {
        default: IntelligentDefault
      },
      children: [
        { path: '/', component: OverView },  //登录后默认路径，也是智能分析的公司总览
        { path: '/keyWord:queryObj',name:'keyWord', component: KeySelect },   //智能分析的关键词查询
        { path: '/BuildSelect:queryObj',name:'BuildSelect', component: BuildSelect }   //智能分析的楼盘查询
      ]
    },
    {
      path: '/Warning',
      name: 'Warning',     
      components: {
        default: Warning                   //预警&监控页面
      }
    },
    {
      path: '/WarningToNew',
      name: 'WarningToNew',     
      components: {
        default: WarningToNew                  //预警&监控页面
      }
    },
    {
      path: '/CanvasTest',
      name: 'CanvasTest',     
      components: {
        default: CanvasTest                 //学习canvas
      }
    },
    {
      path: '/VuexTest',
      name: 'VuexTest',     
      components: {
        default: VuexTest                 //学习canvas
      }
    },
    {
      path: '/index',
      name: 'topNav',
      components: {
        default: TopNav
      },
      children: [
        { path: 'user', component: NavLeft }
      ]
    }, {
      path: '/edit',
      name: 'topBack',
      components: {
        default: TopBack
      }
    }, {
      path: '/login',
      name: 'login',
      components: {
        default: Login
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
});
