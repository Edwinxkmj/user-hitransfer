<template>
  <div id="index">
    <el-container>
      <!--公共头部-->
      <el-header class="header" height="60px">
        <Header
          :isLogin="isLogin"
          @logout="logout"
        ></Header>
      </el-header>
      <!--中心内容-->
      <el-main style="padding: 0;margin: 0;min-height: 500px">
        <router-view/>
      </el-main>
      <!--公共底部-->
      <el-footer style="width:100%;padding: 0;margin: -90px auto 0;" height="450px">
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import Header from "../components/header.vue"
  import Footer from "../components/footer.vue"
  import { mapState, mapMutations } from 'vuex'
  export default {
    name: 'index',
    components: {
      Header: Header,
      Footer: Footer
    },
    computed: {
      ...mapState({
        isLogin: state => state.isLogin,
        hideLoginOrRegister: state => state.hideLoginOrRegister
      })
    },
    inject: ["reload"],
    data () {
      return {
        showLoginOrRegister: false,
        showType: ''
      }
    },
    methods: {
      ...mapMutations({
        changeLoginStatus: 'CHANGE_LOGIN_SATUS'
      }),
      checkUserStatus () { // 检查用户登录状态是否过期
        const token = this.$cookie.get('access_token')
        if (token) { // 登录未过期
          this.changeLoginStatus(true)
        } else { // 登录已过期
          this.changeLoginStatus(false)
        }
      },
      logout () { // 退出登录
        this.$cookie.remove('access_token')
        this.changeLoginStatus(false)
        this.reload()
      }
    },
    created () {
      this.checkUserStatus()
    },
    watch: {
      isLogin () {
        if (this.isLogin) {
          this.showLoginOrRegister = false
        }
      },
      hideLoginOrRegister() {
        this.showLoginOrRegister = false;
      }
    }
  }
</script>

<style scoped>

  #index{
    overflow: hidden;
  }
  /*公共头部样式*/
  #index .header{
    background-color: #333333;
    color:rgba(255,255,255,1);
    width: 100%;
  }
  [v-cloak] {
    display:none;
  }
</style>
