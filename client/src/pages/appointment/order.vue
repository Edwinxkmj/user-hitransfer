<template>
  <div class="appointment box">
    <div class="steps">
      <el-steps :active="active" finish-status="success">
        <el-step :title="$t('order.select')"></el-step>
        <el-step :title="$t('order.details')"></el-step>
        <el-step :title="$t('order.payment')"></el-step>
        <el-step :title="$t('m.done')"></el-step>
      </el-steps>
    </div>
    <div class="info">
      <el-form class="form" :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item >
              <el-date-picker
                type="datetime"
                prefix-icon="null"
                :placeholder="$t('order.select-date')"
                v-model="use_time"
                style="width: 100%;"
                class="radius date"
                :class="{'require': !use_time}"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="ml15" id="peopleBox">
              <el-input class="radius" :class="{'require': !form.peopleNum}" :value="form.peopleNum" @focus="isShowPersonBox = true" :placeholder="$t('order.passengers')"></el-input>
               <div class="drop-box" v-if="isShowPersonBox">
                  <div class="select-box flex-between">
                      <span class="fz14 color-333 fw550">{{$t('m.adult')}}</span>
                      <el-input-number v-model="people.adult" :min="1"></el-input-number>
                  </div>
                  <div class="select-box flex-between ">
                      <span class="fz14 color-333 fw550">{{$t('m.children')}}({{$t('m.seven-age')}})</span>
                      <el-input-number v-model="people.children" :min="0"></el-input-number>
                  </div>
                  <p class="fz14 color-666 mt10">{{$t('order.passengers-tips')}}</p>
                  <p @click="changePerson" class="fz14 color-green text-right cursor mt10">{{$t('m.ok')}}</p>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item >
              <el-input class="radius" :class="{'require': !form.contact}" v-model="form.contact" :placeholder="$t('order.client-name2')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="ml15">
              <el-input class="tel-input radius" :class="{'tel-require': !form.phone}" v-model="form.phone" @keyup.native="form.phone = form.phone.replace(/[^\d]/g,'')" :placeholder="$t('order.phone')" >
                <el-select
                  v-model="form.areaCode"
                  slot="prepend"
                  placeholder="请选择"
                  class="area-code radius"
                >
                  <el-option
                    v-for="code in areaCode"
                    :key="code.value"
                    :label="code.value"
                    :value="code.value"
                  >
                    <span style="float: left;margin-right: 10px">{{ code.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ code.value }}</span>
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="ml15">
              <el-input class="radius" v-model="form.wechat" :placeholder="$t('order.wechat')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="position：relative;top: -18px;">
          <el-col :span="6"><span class="color-fff">x</span></el-col>
          <el-col :span="11" class="text-left" v-if="!showSpareInfo">
            <el-switch class="ml15" v-model="form.is_send_sms" active-color="#4B9D63" inactive-color="#E5E5E5"></el-switch>
            <span class="fz14 color-333 ml10">{{$t('order.send-msg')}}</span>
          </el-col>
          <el-col :span="11" class="text-left " v-if="showSpareInfo">
            <el-switch class="ml15" v-model="form.is_send_sms" active-color="#4B9D63" inactive-color="#E5E5E5"></el-switch>
            <span class="fz14 color-333 ml10">{{$t('order.send-msg')}}</span>
          </el-col>
           <el-col :span="7" class="text-right ">
            <span class="fz14 color-green text-left cursor" v-if="!showSpareInfo" @click="showSpareInfo = true">+ {{$t('order.add-person')}}</span>
          </el-col>
           <!-- <el-col :span="12">
            <span class="fz14 color-green text-left cursor" v-if="!showSpareInfo" @click="showSpareInfo = true">+ {{$t('order.add-person')}}</span>
          </el-col>
          <el-col :span="12" class="text-right" v-if="!showSpareInfo">
            <el-switch class="ml15" v-model="form.is_send_sms" active-color="#4B9D63" inactive-color="#E5E5E5"></el-switch>
            <span class="fz14 color-333 ml10">{{$t('order.send-msg')}}</span>
          </el-col>
          <el-col :span="12" :offset="6" v-if="showSpareInfo">
            <el-switch class="ml15" v-model="form.is_send_sms" active-color="#4B9D63" inactive-color="#E5E5E5"></el-switch>
            <span class="fz14 color-333 ml10">{{$t('order.send-msg')}}</span>
          </el-col> -->
        </el-row>

        <!-- 备用联系人 -->
        <el-row v-if="showSpareInfo">
          <el-col :span="6">
            <el-form-item >
              <el-input class="radius" :class="{'require': !form.spare_contact_name}" v-model="form.spare_contact_name" :placeholder="$t('order.client-name2')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="ml15">
              <el-input class="tel-input radius" :class="{'tel-require': !form.spare_contact_mobile}" @keyup.native="form.spare_contact_mobile = form.spare_contact_mobile.replace(/[^\d]/g,'')"  v-model="form.spare_contact_mobile" :placeholder="$t('order.phone')" >
                <el-select
                  v-model="form.areaCode2"
                  slot="prepend"
                  placeholder="请选择"
                  class="area-code radius"
                >
                  <el-option
                    v-for="code in areaCode"
                    :key="code.value"
                    :label="code.value"
                    :value="code.value"
                  >
                    <span style="float: left;margin-right: 10px">{{ code.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ code.value }}</span>
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="ml15">
              <el-input class="radius" v-model="form.spare_wechat" :placeholder="$t('order.wechat')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row v-if="showSpareInfo" style="position：relative;top: -18px;">
          <el-col :span="12" :offset="6">
            <el-switch class="ml15" v-model="form.is_send_spare_msg" active-color="#4B9D63" inactive-color="#E5E5E5"></el-switch>
            <span class="fz14 color-333">{{$t('order.send-msg')}}</span>
          </el-col>
          <el-col :span="6"></el-col>
        </el-row>

        <el-row class="mt20">
          <el-col :span="24">
            <el-input class="radius" resize="none" type="textarea" v-model="form.remark" :placeholder="$t('order.note')"></el-input>
          </el-col>
        </el-row>
        <el-button class="next-btn mt120" @click="next">{{$t('m.next')}}</el-button>
      </el-form>

      <div class="left">
          <div class="order-info" v-if="orderInfo">
            <div class="title">
                <img src="../../assets/images/tab-active4.png" alt="">
                <span class="fz16 color-333 fw550 ml10">{{orderInfo.cityName}} {{$t('order.reservation')}}</span>
            </div>
            <div class="trap-info">
                <p><img src="../../assets/images/reservationtime.png" alt=""> <span class="fz14 color-333">{{orderInfo.use_time}}</span></p>
                <p><img src="../../assets/images/reservationstart.png" alt=""> <span class="fz16 color-333 fw550">{{destination}}</span></p>
                <p class="has-line"><span class="line"></span><span class="fz14 color-333 ml15">{{$t('m.about')}}{{distance}}km</span></p>
                <p><img src="../../assets/images/reservation-destination.png" alt=""> <span class="fz16 color-333 fw550">{{orderInfo.arrive}}</span></p>
            </div>
            <div class="car flex-between" v-if="orderInfo.car">
                <div>
                    <p class="fz14 color-333 fw550">{{orderInfo.car.name}}</p>
                    <p class="max-w">
                        <span class="fz14 color-333" v-if="lang=='zh'">{{orderInfo.car.model}}或同级别车型&nbsp;&nbsp;可容纳 </span>
                        <span class="fz14 color-333" v-if="lang=='en'">{{orderInfo.car.model}} corolla or similar </span><br>
                        <img class="ml5" src="../../assets/images/passenger.png" alt=""> <span class="fz14 color-green">*{{orderInfo.car.people}}</span> 
                        <img src="../../assets/images/luggage.png" alt=""> <span class="fz14 color-green">*{{orderInfo.car.luggage}}</span> 
                    </p>
                </div>
                <div>
                    <img class="car-img" v-lazy="orderInfo.car.img" alt="">
                </div>
            </div>
            <div>
                <div class="flex-between server-info p-relative">
                  <div>
                      <p>{{$t('order.reservation')}}</p>
                      <p>{{$t('order.baby-booster')}}</p>
                      <p>{{$t('order.discount')}} <img class="wh14" src="../../assets/images/detail.png" alt=""></p>
                  </div>
                  <div class="text-left">
                      <p>{{currency}}{{Number(carPrice)}}</p>
                      <p>{{currency}}{{childrenPrice}}</p>
                      <p class="cursor" v-if="coupon == 0" @click="isShowCoupon = !isShowCoupon">{{$t('order.coupon-tips')}} <i class="el-icon-arrow-right"></i></p>
                      <p class="fz14 color-green" v-else>-{{currency}}{{coupon}}</p>
                  </div>
              </div>
              <div class="coupon" v-if="isShowCoupon">
                <div class="coupon-item flex-between item-center">
                   <img src="../../assets/images/travel-order.png" alt="">
                  <div class="coupon-detail">
                    <p class="color-yellow"><span class="fz16">{{currency}}</span><span class="fz26">10</span> <span class="fz16">包车劵</span></p>
                    <p class="fz14 color-666">【春节特别】包车旅游券</p>
                    <p class="fz14 color-666">有效期至2018年2月28日</p>
                  </div>
                  <div class="fz16 color-yellow cursor" @click="useCoupon(10)">{{$t('order.apply')}}</div>
                </div>
                <div class="coupon-item flex-between item-center">
                   <img src="../../assets/images/travel-order.png" alt="">
                  <div class="coupon-detail">
                    <p class="color-yellow"><span class="fz16">{{currency}}</span><span class="fz26">10</span> <span class="fz16">包车劵</span></p>
                    <p class="fz14 color-666">【春节特别】包车旅游券</p>
                    <p class="fz14 color-666">有效期至2018年2月28日</p>
                  </div>
                  <div class="fz16 color-yellow cursor">{{$t('order.apply')}}</div>
                </div>
              </div>
            </div>
       
            <div class="flex-between total">
                <div>
                    <p class="fz16 color-333 fw550">{{$t('order.total')}}</p>
                    <p class="fz14 color-333 fw550"> 
                      <span v-if="lang == 'en'">{{extra_ffee.rebate_rate*10}}% </span>{{$t('order.commission')}} 
                      <span v-if="lang == 'zh'">{{extra_ffee.rebate_rate*10}}%</span>
                      <img class="wh14" src="../../assets/images/detail.png" alt="">
                    </p>
                </div>
                <div>
                    <p class="fz22 color-333 fw550">{{currency}}{{totalPrice.toFixed(2)}}</p>
                    <p class="fz16 color-333 fw550">{{currency}}{{(totalPrice * extra_ffee.rebate_rate).toFixed(2)}}</p>
                </div>
            </div>
          </div>
          <div class="flex-between tips">
              <p class="fz14 color-333 max-w">{{$t('order.cancel-tips')}}</p>
              <p><img class="wh40" src="../../assets/images/guarantee.png" alt=""></p>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { areaCodeList } from "../../assets/js/areaCode";
export default {
    name: 'appointment',
    data() {
        return {
            active: 1,
            people: {adult: 1, children: 0},
            showSpareInfo: false,
            use_time: "", 
            form: { 
                name: "", 
                peopleNum: `${this.$t('m.adult')}*1，${this.$t('m.children')}*0`,
                contact: "",
                phone: "",
                wechat: "",
                remark: "",
                spare_contact_name: "",
                spare_contact_mobile: "",
                is_send_sms: false,
                areaCode: "+86",
                areaCode2: "+86",
                spare_wechat: '', //备用微信
                is_send_spare_msg: false, //备用手机号接受信息
            },
            areaCode: [],
            isShowCoupon: false,
            isShowPersonBox: false,
            coupon: 0,
            orderInfo: {},
            carPrice: 0,
            childrenPrice: 0,
            totalPrice: 0,
            destination: [],
            distance: '',
            currency: '',
            extra_ffee: {}
        }
    },
    computed: {
      ...mapState({
          lang: state => state.lang
      }),
    },
    created() {
      document.addEventListener('click', (e) => {
        let peopleBox = document.getElementById('peopleBox');
        peopleBox && peopleBox.contains(e.target) ? this.isShowPersonBox = true : this.isShowPersonBox = false;
      })
    },
    methods: {
        next() {
            if (!this.use_time) {
              this.$message.error(this.$t('yz.null-date'));
              return;
            }else if(!this.form.contact) {
              this.$message.error(this.$t('yz.null-name'));
              return;
            }else if(!this.form.phone) {
              this.$message.error(this.$t('yz.null-phone'));
              return;
            }

            let param = {
              use_time: this.use_time,
              address: this.orderInfo.address.concat([this.orderInfo.arrive]),
              city_id: this.orderInfo.city_id,
              adults: this.people.adult,
              children: this.people.children,
              contact_name: this.form.contact,
              contact_mobile: this.form.phone,
              car_id: this.orderInfo.car.id,
              is_send_sms: this.form.is_send_sms ? 1 : 0,
              coupon_id: 0,
              mobile_area_code: this.form.areaCode,
              spare_mobile_area_code:  this.form.spare_contact_mobile ? this.form.areaCode2 : '',
              spare_contact_name: this.form.spare_contact_name,
              spare_contact_mobile: this.form.spare_contact_mobile,
              wechat: this.form.wechat,
              spare_wechat: this.form.spare_wechat,
              is_send_spare_msg: this.form.is_send_spare_msg ? 1 : 0,
              remark: this.form.remark
            }

            this.$axios.post(this.lang+'/point-car/make', param).then((res) => {
              let money = res.data.data.currency_symbol + res.data.data.total_fee;
              sessionStorage.setItem('payParams', JSON.stringify({num :money, out_trade_no: res.data.data.out_trade_no}))
              this.$router.push({ name: "payorder" });
            })
        },
        useCoupon(value) {
            this.coupon = value;
            this.isShowCoupon = false;
        },
        changePerson() {
          this.isShowPersonBox = false;
          this.form.peopleNum = `${this.$t('m.adult')}*${this.people.adult}，${this.$t('m.children')}*${this.people.children}`;
          this.childrenPrice = this.people.children > 0 ? (this.people.children-1) * this.extra_ffee.children_seat : 0;
          this.countTotalPrice();
      },
      countTotalPrice() {
        this.totalPrice = Number(this.childrenPrice) + Number(this.carPrice);
      },
      getToday() {
        let day = new Date();
        day.setTime(day.getTime());
        let today = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
        return today;
      }
    },
    mounted() {
      let data = JSON.parse(sessionStorage.getItem('appointmentData'));
      this.orderInfo = data;
      this.use_time = data.use_time;
      this.carPrice = data.car.price;
      this.destination = data.address.join(',');
      this.currency = data.currency;
      this.distance = data.distance;
      this.extra_ffee = data.extra_ffee;
      console.log(data)
      this.countTotalPrice();
      this.areaCode = areaCodeList(this.$t('m.china'), this.$t('m.australia'), this.$t('m.new-zealand'), this.$t('m.hong-kong'));
    },
    watch: {
       use_time() {
        if(this.use_time && new Date(this.getToday()).getTime() > new Date(this.use_time).getTime()){
            this.$message({ message: this.$t('yz.less-today'), type: "warning"});
            this.use_time = "";
        }
      }
    }

}
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
  .info {
    display: flex;
    margin-top: 50px;
  }
  .coupon {
    position: absolute;
    background: #fff;
    width: 356px;
    padding: 0 20px;
    border: 1px solid #DCDFE6;
    border-top: 2px solid #F9BD4F;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    box-shadow: 0 1px #ccc;
    .coupon-item {
      padding: 8px 10px 10px 10px;
      border-bottom: 1px solid #DCDFE6;
    }
    .coupon-item:last-child { border: none; }

    .coupon-detail { 
      border-right: 1px dashed #DCDFE6; 
      padding: 0 30px 0 0;
    }
    img {
      width: 56px;
      height: 37px;
    }
    .coupon-detail p {
      margin: 0;
    }
  }
  .drop-box {
    position: absolute;
    z-index: 999;
    border: 1px solid #DCDFE6;
    border-top: 2px solid #4B9D63;
    background-color: #ffffff;
    padding: 10px 20px;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    box-shadow: 0 1px #ccc;
    p {
      margin: 5px 0;
      line-height: 20px;
    }
  }
  .form {
    width: 730px;
    .next-btn {
      background: linear-gradient(#328C6E, #4B9D63); 
      color: #fff;
      border-radius: 24px;
      width: 160px;
      height: 48px;
      text-align: center;
      font-size: 16px;
    }
    .next-btn:hover {
      color: #fff !important;
    }
    .radius {
        position: relative;
    }
  
    .require::before {
        content: "*";
        color: #F1604F;
        position: absolute;
        left: 10px;
    }

      .tel-require::before {
        content: "*";
        color: #F1604F;
        position: absolute;
        left: 100px;
        top: 7px;
    }

  }
  .left {
    margin-left: 70px;
    .tips {
        padding: 0 20px;
        .max-w { width: 240px; }
    }
    .car-img {
      width: 140px;
      height: 60px;
    }
  }
  .order-info {
    width: 380px;
    border: 1px solid #DCDFE6;
    padding: 0 20px;
    border-radius: 12px;
    box-shadow: 0 0 3px #DCDFE6;
    .title {
        padding-top: 10px;
        img {
            width: 37px;
            height: 20px;
        }
    }
    .trap-info {
        border-top: 1px solid #DCDFE6;
        border-bottom: 1px solid #DCDFE6;
        margin: 20px 0;
        padding: 10px 0;
        .has-line { position: relative; }
        p { margin: 6px 0; }
        .line {
            position: absolute;
            left: 5px;
            top: -4px;
            height: 30px;
            border-left: 1px dashed #F1604F;
        }
    }
    .car {
        border-bottom: 1px solid #DCDFE6;
        padding-bottom: 20px;
        div p { margin: 2px 0; }
        .max-w {
            display: inline-block;
            width: 180px;
        }
    }
    .server-info {
        border-bottom: 1px solid #DCDFE6;
        padding: 10px 0;
        font-size: 14px;
        p { margin: 8px 0; }
    }
    .total {
        margin: 20px 0;
        p { margin: 6px 0; }

    }
  }
}

/deep/ {
  .area-code .el-input__inner {
    width: 90px !important;
  }
  .el-input__inner:focus {
        border: 1px solid #4B9D63;
    }
  ::-webkit-input-placeholder,
  ::-moz-placeholder,
  :-ms-input-placeholder {
      color: #999999 !important;
      font-size: 16px !important;
      color: #328C6E;
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
 .el-input .el-input__inner,
 .radius .el-textarea__inner {
    border-radius: 12px;
    padding-left: 20px;
 }
.radius .el-textarea__inner { height: 72px;}
 .tel-input >.el-input__inner{
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
 .tel-input .el-input .el-input__inner {
    width: 80px;
}
.date .el-input__inner { padding-left: 20px !important;}

.drop-box .el-input-number .el-input-number__increase,
.drop-box .el-input-number__decrease,
.drop-box .el-input__inner { border: none; }

.drop-box .el-input-number .el-input-number__decrease,
.drop-box .el-input-number .el-input-number__increase {
   background: transparent;
   width: 22px;
   height: 22px;
   line-height: 22px;
   border-radius: 50%;
   margin-left: 50px;
   color: #38846A;
   border: 1px solid #38846A;
}
.drop-box .el-input {
  padding: 0;
  margin-top: -6px;
  width: 200px;
}

.drop-box .el-input .el-input__inner {
  width: 80px;
  margin-left: 100px;
}
}
</style>

