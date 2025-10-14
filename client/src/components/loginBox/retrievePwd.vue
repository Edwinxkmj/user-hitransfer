<template>
 <div>
   <div class="title">{{$t('account.reset-password')}}</div>
   <el-form>
     <el-form-item>
       <el-input :placeholder="$t('account.email')" @input="inputEmail()" v-model="form.email"></el-input>
       <p class="erro-info" v-if="emailError">{{emailErrorText}}</p>
     </el-form-item>
     <el-form-item>
       <el-input v-model="form.verification_code" :placeholder="$t('account.verification')">
         <el-button @click="getVerificationCode" :loading="verificationLoading" :plain="cantSend" :disabled="cantSend" slot="append">
          <span :class="{'color-999':cantSend, 'color-green':!cantSend}">{{$t('account.send')}} <span v-if="cantSend"> ({{ countDownSeconds }}s) </span></span>
          </el-button>
       </el-input>
       <p class="erro-info" v-if="verificationError && !form.verification_code">{{$t('yz.null-verification-code')}}</p>
     </el-form-item>
     <el-form-item>
       <el-input v-model="form.password"
                 type="password"
                 :placeholder="$t('account.new-password')">
       </el-input>
      <p class="erro-info" v-if="pwdError && !form.password">{{$t('yz.null-pwd')}}</p>
     </el-form-item>
      <el-form-item>
       <el-input v-model="form.checkPass"
                 @input="pwdConfError=false"
                 type="password"
                 :placeholder="$t('account.new-password-agin')">
       </el-input>
       <p class="erro-info" v-if="pwdConfError">{{$t('yz.pwd-wrong')}}</p>
     </el-form-item>
     <el-form-item class="m-b-0">
       <el-button class="custom-btn" @click="resetPassword">{{$t('account.reset')}}</el-button>
     </el-form-item>
   </el-form>
 </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    name: "RetrievePwd",
    data() {
      return{
        form: {
          email: '',
          verification_code: '',
          password: '',
          password_confirmation: ''
        },
        countDownSeconds: 60,
        verificationLoading: false,
        cantSend: false, // 是否禁用发送验证码按钮
        emailError: false,
        emailErrorText: '',
        verificationError: false,
        verificationText: '',
        pwdError: false,
        pwdErrorText: '',
        pwdConfError: false
      };
    },
    computed: {
      ...mapState({
        lang: state => state.lang
      }),
    },
    methods: {
      ...mapActions({
        sendCode: 'sendCode',
      }),
      getVerificationCode () {
        if (!this.form.email) {
          this.emailError = true;
          this.emailErrorText = this.$t('yz.null-email');
           return
        }else if (!this.isEmail(this.form.email)) {
          this.emailError = true;
          this.emailErrorText = this.$t('yz.email-error');
          return;
        }
       
        const param = {
          email: this.form.email,
          verification_type: 4
        }
        const self = this;
        if (!param.email) {
          this.$message({
            message: this.$t('yz.null-email'),
            type: 'warning'
          })
          return;
        }
        this.verificationLoading = true
        this.$axios.post(this.lang + '/tools/verification',param).then(() => {
          self.$message({ message: this.$t('account.have-send-tips'), type: 'success' })
          self.verificationLoading = false
          const expireDateTime = self.$miment().add(60, 'ss').format('YYYY-MM-DD hh:mm:ss')
          self.$cookie.set('regist_expireDateTime', expireDateTime, { expires: 1 })
          self.countDown()
          self.cantSend = true
        }, () => {
          self.verificationLoading = false
        })
      },
      countDown () {
        const self = this;
        const timer = setInterval(() => {
          if (self.countDownSeconds > 1) {
            self.countDownSeconds = self.countDownSeconds - 1
          } else {
            clearTimeout(timer)
            self.cantSend = false
            self.countDownSeconds = 60
            self.$cookie.remove('regist_expireDateTime')
          }
        }, 1000)
      },
      created () {
        const expireDateTime = this.$cookie.get('regist_expireDateTime');
        const self = this;
        if (expireDateTime) {
          const diffTime = Math.ceil(self.$miment(expireDateTime).diff(self.$miment().format('YYYY-MM-DD hh:mm:ss')) / 1000 );
          if (diffTime > 0) { // 说明还需要禁用发送验证码按钮
            self.countDownSeconds = diffTime;
            self.cantSend = true;
            self.countDown()
          } else {
            self.countDownSeconds = 60
            self.cantSend = false
          }
        }
      },

      resetPassword () {
        const self = this;
        const param = {
          email: this.form.email,
          password: this.form.password,
          password_confirmation: this.form.checkPass,
          verification_code: this.form.verification_code,
        }
        if (!param.email) {
          this.emailError = true;
          this.emailErrorText = this.$t('yz.null-email');
          return
        }
        if (!this.isEmail(param.email)) {
          this.emailError = true;
          this.emailErrorText = this.$t('yz.email-error');
          return;
        }
        if (!param.verification_code) {
          this.verificationError = true;
          return
        }
        if (!param.password) {
           this.pwdError = true;
          return
        }
        if (param.password_confirmation != param.password) {
          this.pwdConfError = true;
          return
        }
        this.$axios.post('en/account/reset-pwd', param).then(res=>{
          self.$message({ message: this.$t('account.reset-success'), type: 'success' });
          self.$emit('showLogin', 'login')
        })
      },
       
      inputEmail() {
       this.emailError = false;
      },
      isEmail(str){
        var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        return reg.test(str);
      },
    },
  }
</script>

<style scoped lang="scss">
  .title{
    font-size:22px;
    font-weight:600;
    color:rgba(51,51,51,1);
    line-height:30px;
    margin-bottom: 22px;
  }
  .custom-btn {
    width: 100%;
    border-radius: 23px;
    border: transparent;
    color: #fff !important;
    background: linear-gradient(#328C6E, #4B9D63);
    box-shadow: none !important;
  }

  .custom-btn:hover {color: #fff !important;}
  /deep/ {
    .el-button.is-disabled.is-plain {
      background-color: transparent;
      border-color: transparent;
    }
  }
  
</style>
