<template>
  <div>
    <div class="title">{{$t('account.login')}} <span v-if="lang == 'zh'">{{$t('account.hitransfers')}}</span></div>

    <el-form>
      <el-form-item>
        <el-input :placeholder="$t('account.email')" @input="inputEmail" v-model="form.email"></el-input>
        <p class="erro-info" v-if="emailError">{{emailErrorText}}</p>
      </el-form-item>

      <el-form-item>
        <el-input v-model="form.password"
                  :type="isShowPwd ? 'text' : 'password'"
                  :placeholder="$t('account.password')">
        </el-input>
        <p class="erro-info" v-if="pwdError && !form.password">{{$t('yz.null-pwd')}}</p>
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="form.isRemember">{{$t('account.remember')}}</el-checkbox>
        <span class="show-pwd" @click="togglePwdShow">{{ isShowPwd ? $t('account.hide-pwd') : $t('account.show-pwd')}}</span>
      </el-form-item>

      <el-form-item>
        <el-button class="custom-btn" :loading="loginLoading"  @click="loginAction">{{$t('account.log-in')}}</el-button>
      </el-form-item>

      <p class="text-center fz14 color-666"><span class="forget-pwd" @click="changeFn">{{$t('account.forget-pwd')}}</span></p>
    </el-form>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name: "Login",
    inject: ["reload"],
    props: {
      loginLoading: {
        type: Boolean,
        default: false
      },
      cacheAccount: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
    ...mapState({
       lang: state => state.lang
    })
    },
    data() {
      return{
        form: {
          email: '',
          password: '',
          isRemember: false,
        },
        isShowPwd: false,
        emailError: false,
        emailErrorText: this.$t('yz.null-email'),
        pwdError: false
      };
    },
    methods: {
      changeFn() {
         this.$router.push({ 'path': '/index/user', 'query': {type: 'retrieve'}})
         this.reload();
      },
      togglePwdShow() {
        this.isShowPwd = !this.isShowPwd;
      },
      loginAction () {
        const param = {
          email: this.form.email,
          password: this.form.password,
          isRemember: this.form.isRemember
        }
        if (!param.email) {
          this.emailError = true;
          this.emailErrorText = this.$t('yz.null-email');
          return
        }

        if (!this.isEmail(this.form.email)) {
          this.emailError = true;
          this.emailErrorText = this.$t('yz.email-error');
          return;
        }

        if (!param.password) {
          this.pwdError = true;
          return
        }
        this.$emit('login', param)
      },
       inputEmail() {
        this.emailError = false;
      },
      isEmail(str){
        var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        return reg.test(str);
      },
    },
    mounted(){
      if (this.cacheAccount) {
        this.form = Object.assign(this.form, this.cacheAccount);
      }
    }
  }
</script>

<style scoped lang="scss">
    .custom-btn {
      width: 100%;
      border-radius: 23px;
      border: transparent;
      color: #fff !important;
      background: linear-gradient(#328C6E, #4B9D63);
      box-shadow: none !important;
  }
  .custom-btn:hover {color: #fff !important;} 
</style>
