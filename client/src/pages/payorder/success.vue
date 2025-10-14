<template>
  <div class="success box">
    <div class="steps">
      <el-steps :active="active" finish-status="success">
        <el-step :title="$t('order.select')"></el-step>
        <el-step :title="$t('order.details')"></el-step>
        <el-step :title="$t('order.payment')"></el-step>
        <el-step :title="$t('m.done')"></el-step>
      </el-steps>
    </div>
    <div class="text">
        <img class="mt40" src="../../assets/images/success.png" alt="" />
        <h3 class="mt20 color-333">{{$t('order.pay-success')}}</h3>
        <h3 class="mt5 color-333">{{$t('order.order-processed')}}</h3>
        <div class="color-999 fz16 tip-info mt40">
            <p>{{$t('order.pay-success-tips1')}} </p>
            <p>{{$t('order.pay-success-tips2')}} </p>
            <p>{{$t('order.pay-success-tips3')}} </p>
        </div>
        <el-button class="home-btn fz16 color-333 mt40" @click="goHome">Back to homepage</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "success",
  data() {
    return {
      active: 4
    };
  },
  methods: {
      goHome() {
         this.$router.push({'name': 'home'})
      }
  }
};
</script>
<style lang="scss" scoped>
.box {
  width: 1200px;
  margin: auto;
  padding: 40px 0;
  .steps {
    width: 720px;
    margin: auto;
  }
  .text {
        min-height: 720px;
        text-align: center;
        img {
            width: 83px;
            height: 83px;
        }
        h3 {
            margin: 0;
        }
        .tip-info p { margin: 0 0 5px 0; }
        .home-btn {
            color: #333;
            width: 188px;
            height: 48px;
            text-align: center;
            border-radius: 24px;
            border: 1px solid #328C6E;
            margin-bottom: 80px;
        }
    }
}

/deep/ {
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

