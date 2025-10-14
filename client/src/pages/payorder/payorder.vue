<template>
  <div class="payorder box">
    <div class="steps">
      <el-steps :active="active" finish-status="success">
        <el-step :title="$t('order.select')"></el-step>
        <el-step :title="$t('order.details')"></el-step>
        <el-step :title="$t('order.payment')"></el-step>
        <el-step :title="$t('m.done')"></el-step>
      </el-steps>
    </div>
    <div class="tabs mt60">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('order.credit-card')" name="first" v-loading="isloading3">
           <div class='credit-card-inputs' :class='{ complete }'></div>
          <div class="credit-card mt20">
            <div class="form">
              <div class="flex-between">
                <div id="card-number" class="stripe-element card-number"></div>
                <img class="caster-card" src="../../assets/images/caster-card.png" alt />
              </div>
              <div class="flex-between mt15">
                  <div id="card-expiry" class='stripe-element card-expiry'></div>
                  <div id="card-cvc" class='stripe-element card-cvc'></div>
                <img class="visa" src="../../assets/images/Visa.png" alt />
              </div>
              <div class="mt30">
                <el-input :placeholder="$t('order.name-card')" v-model="accountName" clearable></el-input>
              </div>
            </div>
            <div class="bg">
              <span class="color-999 fz16">CVC</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('order.wechat')" name="third">
          <div class="wechar text-center" v-loading="isloading">
            <p>
              <label class="fz16 color-333">{{$t('order.pay-wechat')}}</label>
              <span class="fz22 color-green">{{money}}</span>
            </p>
            <div id="wqrcode" ref="wqrcode"></div>
            <p class="fz16 color-333 mt20">{{$t('order.wechat-QR')}}</p>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('order.alipay')" name="fourth">
          <div class="alipay text-center" v-loading="isloading2">
            <p>
              <label class="fz16 color-333">{{$t('order.pay-alipay')}}</label>
              <span class="fz22 color-green">{{money}}</span>
            </p>
            <div id="aqrcode" ref="aqrcode"></div>
            <p class="fz16 color-333 mt20">{{$t('order.alipay-QR')}}</p>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="tips flex-center mt100">
        <div class="fz14 color-333 text-center">
          <p>
            {{$t('order.agree-you')}}
            <label
              class="color-green cursor"
              @click="goHelp(4)"
            >{{$t('help.user')}}</label>
            {{$t('account.and')}}
            <label
              class="color-green cursor"
              @click="goHelp(2)"
            >{{$t('order.privacy-agreement')}}</label>
          </p>
          <p v-if="lang=='zh'">付款后我们将自动选择最优司导为您服务，如有疑问请联系客服</p>
        </div>
        <el-button
          class="next-btn cursor"
          v-loading="isloading4"
          v-if="tabIndex == 0"
          @click="pay"
        >{{$t('order.pay')}} {{money}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
import { stripeKey, stripeOptions } from "../../assets/js/stripeConfig";
import { mapState } from "vuex";
export default {
  name: "payorder",
  inject: ["reload"],
  data() {
    return {
      active: 2,
      tabIndex: 0,
      activeName: "first",
      accountName: "",
      money: 0,
      out_trade_no: "",
      isloading: true,
      isloading2: true,
      isloading3: true,
      isloading4: false,
      timer: null,
      complete: false,
      number: false,
      expiry: false,
      cvc: false,
      stripe: stripeKey,
      options: stripeOptions,
      //elements
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      stripe: null,
    };
  },
  computed: {
    ...mapState({
      lang: state => state.lang
    })
  },
  methods: {
    handleClick(tab, event) {
      this.tabIndex = tab.index;
    },
    setUpStripe() {
      if (window.Stripe === undefined) {
        this.$message.error("Stripe V3 library not loaded!");
      } else {
        const stripe = window.Stripe(stripeKey);
        this.stripe = stripe;

        const elements = stripe.elements();
        this.cardNumber = elements.create("cardNumber");
        this.cardExpiry = elements.create("cardExpiry");
        this.cardCvc = elements.create("cardCvc");
      
        this.cardNumber.mount("#card-number");
        this.cardExpiry.mount("#card-expiry");
        this.cardCvc.mount("#card-cvc");

        setTimeout(()=>{ this.isloading3 = false; }, 1000)
      }
    },
    goHelp(value) {
      this.$router.push({ path: "/index/help", query: { active: value } });
      this.reload();
    },
    pay() {
        this.stripe.createToken(this.cardNumber).then(data => {
          if(data.error) {
            this.$message.error(data.error.message);
          }else {
            if (!this.accountName) {
              this.$message.error(this.$t("yz.null-account-name"));
              return;
            }
            let parem = {};
            parem.token = data.token.id;
            parem.out_trade_no = this.out_trade_no;
            this.isloading4 = true;
            this.$axios.post(this.lang + '/order/stripe-pay', parem).then(res => {
              if (res.status == 1) {
                this.$router.push({ name: "success" });
              }
              this.isloading4 = false;
            })
          }
         
        } );
    },
    creteQrCode(url, refs) {
      let _this = this;
      this.$axios
        .post(this.lang + url, { out_trade_no: this.out_trade_no })
        .then(res => {
          url == "/order/wechat-pay" ? (_this.isloading = false) : (_this.isloading2 = false);
          
          setTimeout(() => {
            new QRCode(refs, {
              text: res.data.data.qrCode,
              width: 200,
              height: 200,
              colorDark: "#333333", //二维码颜色
              colorLight: "#ffffff", //二维码背景色
              correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
            });
          }, 0);
        });
    },
    checkPay() {
      this.$axios
        .post(this.lang + "/order/check-pay", {out_trade_no: this.out_trade_no})
        .then(res => {
          if (res.data.data.is_pay == 1) {
            this.$router.push({ name: "success" });
            clearInterval(this.timer);
          }
        });
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  mounted() {
    let payParams = JSON.parse(sessionStorage.getItem("payParams"));

    this.money = payParams.num;
    this.out_trade_no = payParams.out_trade_no;

    if (window.Stripe === undefined) {
         setTimeout(()=> { this.setUpStripe(); },3000)
    } else {
        this.setUpStripe();
    }

    this.creteQrCode("/order/wechat-pay", this.$refs.wqrcode)
    this.creteQrCode("/order/alipay-pay", this.$refs.aqrcode)

    this.timer = setInterval(() => { this.checkPay(); }, 3000);
    
    window.scrollTo(0, 0);
  }
};
</script>
<style lang="scss" scoped>
.card-number {
  width: 75%;
}
.card-expiry,.card-cvc {
 width: 32%;
}
.card-expiry,
.card-cvc,
.card-number {
  border: 1px solid #ccc !important;
  border-radius: 15px;
  padding: 10px;
  font-size: 15px;
}
.box {
  width: 1200px;
  margin: auto;
  padding: 50px 0;
  .steps {
    width: 720px;
    margin: auto;
  }
  .rocket-trip {
    position: relative;
    top: -90px;
    left: 160px;
    text-align: left;
    p {
      margin: 5px 0;
      color: #808080;
      font-size: 14px;
    }
  }
  #aqrcode,
  #wqrcode {
    margin-left: 200px;
  }
  .tabs {
    position: relative;
    width: 600px;
    margin: auto;
    .form {
      position: absolute;
      left: 10px;
      z-index: 1;
      width: 390px !important;
      border: 1px solid #d8d8d8;
      border-radius: 5px;
      padding: 30px 20px;
      background: #fff;
      .caster-card {
        width: 62px;
        height: 38px;
      }
      .visa {
        width: 58px;
        height: 20px;
      }
    }
    .bg {
      position: relative;
      top: 20px;
      background: url("../../assets/images/creditcard.png");
      width: 432px;
      height: 262px;
      margin-left: 140px;
      span {
        position: relative;
        left: 81%;
        top: 106px;
      }
    }
  }
  .paypal,
  .wechar,
  .alipay,
  .account {
    height: 300px;
  }
  .tips {
    position: relative;
    width: 600px;
    margin-bottom: 50px;
    p {
      margin: 3px 0;
    }
    .back-btn {
      border-radius: 24px;
      width: 166px;
      height: 48px;
      text-align: center;
      font-size: 16px;
      color: #333;
    }
    .next-btn {
      border-radius: 24px;
      width: 160px;
      height: 48px;
      text-align: center;
      font-size: 16px;
      background: linear-gradient(#328c6e, #4b9d63);
      color: #fff;
      margin-left: 30px;
    }
    .next-btn:hover {
      color: #fff !important;
    }
  }
}

/deep/ {
  .credit-card .el-input--suffix .el-input__inner {
    background: #fafafa;
    border-radius: 12px;
  }

  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
  .el-tabs__header {
    left: 100px;
  }

  .el-tabs__item {
    line-height: 30px;
    width: 100px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    padding: 0;
    color: #666;
    font-size: 14px;
    margin: 0 10px;
  }

  .el-tabs__item:hover {
    color: #333333;
  }

  .el-tabs__item.is-active {
    background: #333;
    color: #fff;
  }

  .el-tabs__active-bar {
    background: transparent;
  }

  ::-webkit-input-placeholder,
  ::-moz-placeholder,
  :-ms-input-placeholder {
    color: #999999 !important;
    font-size: 16px !important;
    color: #328c6e;
  }
  .date .el-input__inner {
    padding-left: 9px !important;
  }
  .el-step__title {
    font-size: 12px;
  }
  .el-step__title.is-process {
    font-weight: normal;
    color: #38846a;
  }
  .el-step__title.is-success,
  .el-step__head.is-success,
  .el-step__head.is-process,
  .el-checkbox {
    color: #38846a;
  }
  .el-step__head.is-success,
  .el-step__head.is-process {
    border-color: #4b9d63;
  }
  .el-step__icon.is-text {
    width: 30px;
    height: 30px;
  }
  .is-wait .el-step__icon.is-text {
    background: #999999;
    color: #fff;
    border-color: transparent;
  }
  .is-success .el-step__icon.is-text,
  .is-process .el-step__icon.is-text {
    background: linear-gradient(#328c6e, #4b9d63);
    color: #fff;
  }
}
</style>


