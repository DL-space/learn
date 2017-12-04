<template>
    <div id="app">

        <!-- 路由出口 -->
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view></router-view>
        <div class="tab">
            <router-link :to="{path:'home'}">首页</router-link>
            <router-link :to="{path:'list'}">列表</router-link>
            <router-link :to="{path:'des'}">详情</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app'
    }
</script>

<style>
    body{
        margin: 0;
        padding: 0;
    }
    .tab {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        height: 50px;
        align-items: center;
        align-content: center;
    }
    .tab a {
        flex: 1;
        text-align: center;
        text-decoration: none;
    }
    .tab .router-link-active {
        color: red;
        font-weight: 700;
    }
</style>
