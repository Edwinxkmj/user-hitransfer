<template>
  <div class="flex-between user">
    <div class="left-content">
      <div class="form">
        <login
          @change="changeCurrent"
          @login="loginAction"
          :cacheAccount="cacheAccount"
          :loginLoading="loginLoading"
          v-if="currentBoxName === 'login'"
        ></login>
        <retrieve-pwd
          @change="changeCurrent"
          @showLogin="showLoginFn"
          v-if="currentBoxName === 'retrieve'"
        ></retrieve-pwd>
        <register @change="changeCurrent" v-if="currentBoxName === 'register'"></register>

        <div class="text-center">
          <template v-if="currentBoxName != 'register'">
            <div class="division fz14 color-666">or</div>
            <div class="login-links cursor btn-border" @click="changeCurrent('register')">
              {{$t('account.dont-account')}}
              <span>{{$t('account.sign')}}</span>
            </div>
          </template>
          <template v-else>
            <div class="login-links cursor mt40" @click="changeCurrent('login')">
              {{$t('account.have-account')}}
              <span>{{$t('account.login')}}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="right-content">
      <template>
        <el-carousel style="height: 90vh"  direction="vertical" :interval="5000" arrow="hover" :autoplay="true">
          <el-carousel-item >
           <img src="../../assets/images/user1.jpg" alt="">
          </el-carousel-item>
           <el-carousel-item >
           <img src="../../assets/images/user2.jpg" alt="">
          </el-carousel-item>
           <el-carousel-item >
           <img src="../../assets/images/user3.jpg" alt="">
          </el-carousel-item>
        </el-carousel>
      </template>
        <!-- <img v-if="currentBoxName == 'login'" src="../../assets/images/airportbg.jpg" alt="">
        <img v-if="currentBoxName == 'register'" src="../../assets/images/register.jpg" alt="">
        <img v-if="currentBoxName == 'retrieve'" src="../../assets/images/pwd.jpg" alt=""> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import login from "../../components/loginBox/login";
import retrievePwd from "../../components/loginBox/retrievePwd";
import register from "../../components/loginBox/register";

export default {
  name: "LoginBox",
  components: { login, retrievePwd, register },
  inject: ["reload"],
  // props: ['type'],
  data() {
    return {
      isShow: false,
      loginLoading: false,
      currentBoxName: ""
    };
  },
  methods: {
    ...mapMutations({
      setUserInfo: "SET_USER_INFO",
      setCacheAccount: "SET_CACHE_ACCOUNT",
      clearCacheAccount: "CLEAR_CACHE_ACCOUNT"
    }),
    ...mapActions({
      login: "login"
    }),
    changeCurrent(name) {
      this.currentBoxName = name;
    },
    showLoginFn() {
      this.currentBoxName = "login";
    },
    loginAction(param) {
      const self = this;
      this.loginLoading = true;
      this.$axios.post('en/account/login', param).then(
        res => {
          self.loginLoading = false;
          if (param.isRemember) {
            self.setCacheAccount({
              email: param.email,
              password: param.password,
              isRemember: param.isRemember
            });
          } else {
            self.clearCacheAccount();
          }

          self.$cookie.set("access_token", res.data.data.token_type + " " + res.data.data.access_token);
          self.setUserInfo(res.data.data.user);
         
          if (window.history.length <= 4) {
            this.$router.push({ name: "home" });
          }else {
            this.$router.go(-1);
          }
            
          self.reload();
        },
        () => {
          self.loginLoading = false;
        }
      );
    }
  },
  mounted() {
    this.currentBoxName = this.$route.query.type;
    this.isShow = this.isShowLoginBox;
  },
  computed: {
    ...mapGetters(["isShowLoginBox"]),
    ...mapState({
      cacheAccount: state => state.cacheAccount,
      lang: state => state.lang
    })
  },
  watch: {
    isShowLoginBox() {
      this.isShow = this.isShowLoginBox;
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.user {
    >div {
         width: 50%;
    }
    .left-content {
        display: flex;
        justify-content: center;
        position: relative;
        left: 5%;
        margin-top: 80px;
    }
    .right-content {
        overflow: hidden;
        img {
            height: 90vh;
            width: 100%;
            height: 100%;
        }
    }
    .form {
        width: 430px;
    }
}

.division {
  position: relative;
  padding: 10px 0;

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 40%;
    height: 1px;
    background: #ccc;
  }

  &:before {
    left: 0;
  }
  &:after {
    right: 0;
  }
}

.btn-border {
  border: 1px solid rgba(51, 51, 51, 1);
  border-radius: 12px;
  height: 39px;
  line-height: 39px;
}

.login-links {
  font-size: 12px;
  font-weight: 400;
  margin-top: 20px;
  color: rgba(51, 51, 51, 1);

  span {
    color: #38846a;
    cursor: pointer;
  }
}
/deep/ {
  .el-carousel__item {
    height: 90vh !important;
  }
  .el-input__inner:focus {
    border: 1px solid #4b9d63;
  }
  .el-carousel__container {
    height: 90vh;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #38846a;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #38846a;
    border-color: #38846a;
  }
  .custom-btn {
    width: 100%;
  }
  .el-dialog {
    border-radius: 12px !important;
  }
  .el-dialog__body {
    padding: 30px 40px;
  }
  .el-dialog__headerbtn {
    left: 20px;
    right: initial;
  }

  .title {
    font-size: 22px;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    line-height: 30px;
    margin-bottom: 22px;
  }

  .area-code {
    width: 80px;
  }

  .show-pwd {
    font-size: 14px;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    float: right;
    cursor: pointer;
  }

  .forget-pwd {
    cursor: pointer;
  }

  .el-input__inner {
    border-radius: 12px;
  }

  .el-input-group__prepend {
    background-color: white;
    border-radius: 12px 0 0 12px;

    & + .el-input__inner {
      border-radius: 0 12px 12px 0;
    }
  }

  .el-input-group--append {
    .el-input__inner {
      border-radius: 12px 0 0 12px;
    }

    .el-input-group__append {
      background: white;
      border-radius: 0 12px 12px 0;
    }
  }
}
.custom-btn {
  width: 100%;
  border-radius: 12px;
  color: #fff !important;
  background: linear-gradient(#328c6e, #4b9d63);
  box-shadow: 0 2px 20px 0 rgba(51, 51, 51, 0.5);
  border: transparent;
}

.custom-btn:hover {
  color: #fff !important;
}
</style>
