<template>
  <div class="home">
    <div @click="clickHelpers">点击 --- 调用helper.js 进行懒加载(npm i babel-plugin-syntax-dynamic-import -D) </div>
    <div>------------------------------</div>
    <div>webpack.DefinePlugin区分开发环境---------{{userAvator}}</div>
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

// 这里无论是data函数，methods对象，computed对象，watch对象，都可以访问到API_CONFIG;---https://segmentfault.com/a/1190000017217915
export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  mounted(){
    console.log(`${API_CONFIG.BAR_API}`)
    this.getList()
  },
  computed: { 
    userAvator() { 
      return `${API_CONFIG.BAR_API}?id=0&name=0`
    } 
  },
  methods: {
    clickHelpers() {
      console.log('点击 clickHelpers')
      //懒加载  /* webpackChunkName:'helper' */ ---> 自定义chunk出来的名字
      const help = () => import(/* webpackChunkName:'helper' */'../helper')
      help()
    },


    async getList(){

      let res = await this.$Http.getContactList()
      console.log('res.data----',res.data)
    },




  }
}
</script>
