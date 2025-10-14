<template>
  <div class="box">
    <div>
      <el-input class="code" :placeholder="$t('m.exchange-pl')" v-model="input2">
        <template slot="append">{{$t('m.exchange')}}</template>
      </el-input>
    </div>
    <div class="coupon mt40">
      <div class="coupon-item flex-between item-center">
        <div class="coupon-detail flex item-center">
          <img src="../assets/images/travel-coup.png" alt />
          <div class="ml40">
            <p class="color-green">
              <span class="fz16">￥</span>
              <span class="fz26">10</span>
              <span class="fz16">包车劵</span>
            </p>
            <p class="fz14 color-666">【春节特别】包车旅游券</p>
            <p class="fz14 color-666">有效期至2018年2月28日</p>
          </div>
        </div>
        <div class="fz16 color-green cursor mr30" @click="useCoupon(10)">{{$t('order.apply')}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "coupons",
  data() {
    return {
      input2: ""
    };
  },
  methods: {
    useCoupon() {
      this.$router.push({'name': 'home'});
    }
  }
};
</script>
<style lang="scss" scoped>
.box {
  width: 780px;
  margin: auto;
  margin-top: 60px;
  min-height: 600px;

  .code {
    width: 780px !important;
    height: 50px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 25px;
  }
}
/deep/ {
  .code .el-input__inner {
    height: 50px;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
    border: transparent;
    padding-left: 30px;
  }
  .code .el-input-group__append {
    width: 160px !important;
    height: 50px;
    background: linear-gradient(
      360deg,
      rgba(75, 157, 99, 1) 0%,
      rgba(50, 140, 110, 1) 100%
    );
    border-radius: 0px 25px 25px 0px;
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
    text-align: center;
    cursor: pointer;
  }
}
.coupon {
  background: #fff;
  width: 740px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  .coupon-item {
    padding: 8px 10px 10px 10px;
    height: 120px;
    border-bottom: 1px solid #dcdfe6;
  }
  .coupon-item:last-child {
    border: none;
  }

  .coupon-detail {
    border-right: 1px dashed #dcdfe6;
    padding: 0 30px 0 0;
    width: 560px;
  }
  img {
    width: 56px;
    height: 37px;
  }
  .coupon-detail p {
    margin: 0;
  }
}
</style>