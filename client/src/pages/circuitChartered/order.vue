<template>
  <div class="airorder box">
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
              <el-time-select
                :class="{'require': !form.boarding_time}"
                prefix-icon="null"
                style="width: 100%;"
                v-model="form.boarding_time"
                :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '24:00'
                }"
                :placeholder="$t('order.pick-up-time2')">
                </el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="ml15">
                <el-autocomplete
                class="require radius"
                style="width: 100%;"
                v-model="form.boarding_address"
                :fetch-suggestions="querySearchAsync"
                :placeholder="$t('order.pick-up-location')"
                :title="form.boarding_address"
                clearable
                ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="p-relative" id="peopleBox">
              <el-input class="radius" :class="{'require': people.adult < 1 && people.children < 1}" :value="form.peopleNum" @focus="isShowPersonBox = true" :placeholder="$t('order.passengers')"></el-input>
                <div class="drop-box" v-if="isShowPersonBox">
                    <div class="select-box flex-between">
                        <span class="fz14 color-333 fw550">{{$t('m.adult')}}</span>
                        <el-input-number v-model="people.adult" :min="0"></el-input-number>
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
          <el-col :span="12">
            <el-form-item class="ml15 p-relative" id="luggageBox">
              <el-input class="radius" :class="{'require': luggages.max < 1 && luggages.min < 1}" :value="form.luggage" @focus="isShowLuggageBox = true" :placeholder="$t('order.luggages')"></el-input>
               <div class="drop-box" v-if="isShowLuggageBox">
                    <div class="select-box flex-between">
                        <span class="fz14 color-333 fw550">{{$t('order.large-luggage')}}</span>
                        <el-input-number v-model="luggages.max" :min="0"></el-input-number>
                    </div>
                    <div class="select-box flex-between ">
                        <span class="fz14 color-333 fw550">{{$t('order.carry-on-luggage')}}</span>
                        <el-input-number v-model="luggages.min" :min="0"></el-input-number>
                    </div>
                    <p class="fz14 color-666 mt10">{{$t('order.luggage-tips')}}</p>
                    <p @click="changeLuggage" class="fz14 color-green text-right cursor mt10">{{$t('m.ok')}}</p>
                </div>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 联系人 -->
        <el-row>
          <el-col :span="6">
            <el-form-item >
              <el-input class="radius" :class="{'require': !form.contact}" v-model="form.contact" :placeholder="$t('order.client-name2')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="ml15">
              <el-input class="tel-input radius" :class="{'tel-require': !form.phone}"  @keyup.native="form.phone = form.phone.replace(/[^\d]/g,'')" v-model="form.phone" :placeholder="$t('order.phone')" >
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
            <el-switch class="ml15" v-model="form.isSendMsg" active-color="#4B9D63" inactive-color="#E5E5E5"></el-switch>
            <span class="fz14 color-333 ml10">{{$t('order.send-msg')}}</span>
          </el-col>
          <el-col :span="11" class="text-left " v-if="showSpareInfo">
            <el-switch class="ml15" v-model="form.isSendMsg" active-color="#4B9D63" inactive-color="#E5E5E5"></el-switch>
            <span class="fz14 color-333 ml10">{{$t('order.send-msg')}}</span>
          </el-col>
           <el-col :span="7" class="text-right ">
            <span class="fz14 color-green text-left cursor" v-if="!showSpareInfo" @click="showSpareInfo = true">+ {{$t('order.add-person')}}</span>
          </el-col>
            <!-- <el-col :span="12">
            <span class="fz14 color-green text-left cursor" v-if="!showSpareInfo" @click="showSpareInfo = true">+ {{$t('order.add-person')}}</span>
          </el-col>
          <el-col :span="12" class="text-right" v-if="!showSpareInfo">
            <el-switch class="ml15" v-model="form.isSendMsg" active-color="#4B9D63" inactive-color="#E5E5E5"></el-switch>
            <span class="fz14 color-333 ml10">{{$t('order.send-msg')}}</span>
          </el-col>
          <el-col :span="12" :offset="6" v-if="showSpareInfo">
            <el-switch class="ml15" v-model="form.isSendMsg" active-color="#4B9D63" inactive-color="#E5E5E5"></el-switch>
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
              <el-input class="tel-input radius" :class="{'tel-require': !form.spare_contact_mobile}" @keyup.native="form.spare_contact_mobile = form.spare_contact_mobile.replace(/[^\d]/g,'')" v-model="form.spare_contact_mobile" :placeholder="$t('order.phone')" >
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
          <el-col :span="12" :offset="6" >
            <el-switch class="ml15" v-model="form.is_send_spare_msg" active-color="#4B9D63" inactive-color="#E5E5E5"></el-switch>
            <span class="fz14 color-333 ml10">{{$t('order.send-msg')}}</span>
          </el-col>
          <el-col :span="6"></el-col>
        </el-row>

        <el-row class="mt20">
          <el-col :span="24">
            <el-input class="radius" resize="none" type="textarea" v-model="form.remark" :placeholder="$t('order.note')"></el-input>
          </el-col>
        </el-row>
        <el-button class="next-btn mt60" @click="next">{{$t('m.next')}}</el-button>
      </el-form>

      <div class="left">
          <div class="order-info" v-if="charterInfo.info">
            <div class="title flex-between">
                <div>
                    <p><span class="fz16 color-333 fw550">{{charterInfo.info.title}}</span></p>
                    <p class="fz14 color-666 mt15">{{charterInfo.info.descript}}</p>
                    <p class="fz14 color-666"><span>{{charterInfo.num}} {{$t('order.sold')}}</span> 
                        <el-rate
                        style="padding-top: 5px;box-sizing: border-box;"
                        :value="charterInfo.score"
                        :colors="['#F9BD4F','#F9BD4F','#F9BD4F']"
                        disabled
                        ></el-rate>
                    </p>
                </div>
                <img v-lazy="charterInfo.img" alt="">
            </div>
            <div class="trap-info">
                <p><i class="el-icon-location-information color-333"></i>&nbsp; <span class="fz14 color-333">{{charterInfo.info.country}}，{{charterInfo.info.city}}</span></p>
                <p>&nbsp;<img src="../../assets/images/time_slices.png" class="wh12"/>&nbsp; <span class="fz14 color-333">{{charterInfo.use_time}} {{form.boarding_time}}</span></p>
            </div>
            <div class="car flex-between" v-if="charterInfo.car">
                <div>
                    <p class="fz14 color-333 fw550">{{charterInfo.car.name}}</p>
                    <p class="max-w">
                        <span class="fz14 color-333" v-if="lang=='zh'">{{charterInfo.car.model}}或同级别车型&nbsp;&nbsp;可容纳 </span>
                        <span class="fz14 color-333" v-if="lang=='en'">{{charterInfo.car.model}} corolla or similar </span><br>
                        <img class="ml5" src="../../assets/images/passenger.png" alt=""> <span class="fz14 color-green">*{{charterInfo.car.people}}&nbsp;</span> 
                        <img src="../../assets/images/luggage.png" alt=""> <span class="fz14 color-green">*{{charterInfo.car.luggage}}</span> 
                    </p>
                </div>
                <div>
                    <img class="car-img" v-lazy="charterInfo.car.img" alt="">
                </div>
            </div>
            <div>
                <div class="flex-between server-info p-relative">
                  <div>
                      <p>{{$t('order.charter-tour')}}</p>
                      <p>{{$t('order.baby-booster')}} <img class="wh14" src="../../assets/images/detail.png" alt=""></p>
                      <p>{{$t('order.discount')}} <img class="wh14" src="../../assets/images/detail.png" alt=""></p>
                  </div>
                  <div>
                      <p>{{currency}}{{carPrice}}</p>
                      <p>{{currency}}{{childrenPrice}}</p>
                      <p class="cursor" v-if="coupon == 0" @click="isShowCoupon = !isShowCoupon">{{$t('order.coupon-tips')}} <i class="el-icon-arrow-right"></i></p>
                      <p class="fz14 color-green" v-else @click="isShowCoupon = !isShowCoupon">-{{currency}}{{coupon}}</p>
                  </div>
              </div>
              <div class="coupon" v-if="isShowCoupon">
                <div class="coupon-item flex-between item-center">
                   <img src="../../assets/images/travel-order.png" alt="">
                  <div class="coupon-detail">
                    <p class="color-yellow"><span class="fz16">￥</span><span class="fz26">10</span> <span class="fz16">包车劵</span></p>
                    <p class="fz14 color-666">【春节特别】包车旅游券</p>
                    <p class="fz14 color-666">有效期至2018年2月28日</p>
                  </div>
                  <div class="fz16 color-yellow cursor" @click="useCoupon(10)">{{$t('order.apply')}}</div>
                </div>
                <div class="coupon-item flex-between item-center">
                   <img src="../../assets/images/travel-order.png" alt="">
                  <div class="coupon-detail">
                    <p class="color-yellow"><span class="fz16">￥</span><span class="fz26">10</span> <span class="fz16">包车劵</span></p>
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
                      <span v-if="lang == 'en'">{{charterInfo.extra_ffee.rebate_rate*10}}% </span>{{$t('order.commission')}} 
                      <span v-if="lang == 'zh'">{{charterInfo.extra_ffee.rebate_rate*10}}%</span>
                      <img class="wh14" src="../../assets/images/detail.png" alt="">
                    </p>
                </div>
                <div>
                    <p class="fz22 color-333 fw550">{{currency}}{{totalPrice.toFixed(2)}}</p>
                    <p class="fz16 color-333 fw550">{{currency}}{{(totalPrice * charterInfo.extra_ffee.rebate_rate).toFixed(2)}}</p>
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
import { mapState } from 'vuex'
import { googleMap, baiduMap, getGoogleImg} from "../../assets/js/public";
import { areaCodeList } from "../../assets/js/areaCode";
export default {
  name: "charterorder",
  data() {
    return {
      active: 1,
      people: {adult: 1, children: 0},
      luggages: {max: 1, min: 0},
      charterInfo: {},
      carPrice: 0,
      childrenPrice: 0,
      totalPrice: 0,
      showSpareInfo: false,
      currency: '',

      form: { 
          boarding_time: "",
          name: "", 
          type: "",
          peopleNum: `${this.$t('m.adult')}*1，${this.$t('m.children')}*0`,
          boarding_address: "",
          luggage: `${this.$t('order.large-luggage')}*1，${this.$t('order.carry-on-luggage')}*0`,
          contact: "",
          phone: "",
          wechat: "",
          remark: "",
          brand_pick_up: false,
          isHighWay: false,
          isSendMsg: false,
          areaCode: "+86",
          areaCode2: "+86",
          coupon_id: '',
          spare_contact_name: '',
          spare_contact_mobile: '',
          spare_wechat: '', //备用微信
          is_send_spare_msg: false, //备用手机号接受信息
        },
      areaCode: [],
      isShowPersonBox: false,
      isShowLuggageBox: false,
      isShowCoupon: false,
      coupon: 0,
      isUseGoogle: false
    };
  },
  computed: {
    ...mapState({
      lang: state => state.lang
    }),
  },
  created() {
    document.addEventListener('click', (e) => {
      let peopleBox = document.getElementById('peopleBox');
      let luggageBox = document.getElementById('luggageBox');

      peopleBox && peopleBox.contains(e.target) ? this.isShowPersonBox = true : this.isShowPersonBox = false;
      luggageBox && luggageBox.contains(e.target) ? this.isShowLuggageBox = true : this.isShowLuggageBox = false;
    })
  },
  mounted(){
    let orderData = JSON.parse(sessionStorage.getItem('charterInfo'));
    this.charterInfo = orderData;
    this.carPrice = Number(orderData.car.price);
    this.currency = orderData.currency;
    console.log(orderData)
    this.areaCode = areaCodeList(this.$t('m.china'), this.$t('m.australia'), this.$t('m.new-zealand'), this.$t('m.hong-kong'));;
    this.countTotalPrice();

    getGoogleImg().then((res) => {
        this.isUseGoogle = res;
    })
  },
  methods: {
      next() {
        if (!this.form.boarding_time) {
           this.$message.error(this.$t('yz.null-boarding-time'));
           return;
        }else if (!this.form.boarding_address){
          this.$message.error(this.$t('yz.null-location'));
           return;
        }else if(!this.form.contact) {
           this.$message.error(this.$t('yz.null-name'));
           return;
        }else if(!this.form.phone) {
           this.$message.error(this.$t('order.null-phone'));
           return;
        }else if (this.people.adult == 0){
           this.$message.error(this.$t('order.null-adult'));
           return;
        }
        
        let param = {
          use_time: this.charterInfo.use_time,
          boarding_address: this.form.boarding_address,
          charter_id: this.charterInfo.charter_id,
          adults: this.people.adult,
          children: this.people.children,
          car_id: this.charterInfo.car_id,
          is_send_sms: this.form.isSendMsg ? 1: 0,
          boarding_time: this.form.boarding_time,
          contact_name: this.form.contact,
          contact_mobile: this.form.phone,
          wechat: this.form.wechat,
          big_luggage: this.luggages.max,
          small_luggage: this.luggages.min,
          coupon_id: 0,
          mobile_area_code: this.form.areaCode,
          spare_mobile_area_code:  this.form.spare_contact_mobile ? this.form.areaCode2 : '',
          spare_contact_name: this.form.spare_contact_name,
          spare_contact_mobile: this.form.spare_contact_mobile,
          spare_wechat: this.form.spare_wechat,
          is_send_spare_msg: this.form.is_send_spare_msg ? 1 : 0,
          remark: this.form.remark
        }

        this.$axios.post(this.lang + '/charter/make', param).then(res=> {
           let money = res.data.data.currency_symbol + res.data.data.total_fee;
           sessionStorage.setItem('payParams', JSON.stringify({num :money, out_trade_no: res.data.data.out_trade_no}))
           this.$router.push({ name: "payorder" });
        })
      },
      changePerson(){
        this.isShowPersonBox = false;
        this.form.peopleNum = `${this.$t('m.adult')}*${this.people.adult}，${this.$t('m.children')}*${this.people.children}`;

        this.childrenPrice = this.people.children > 1 ? this.charterInfo.extra_ffee.children_seat * this.people.children : 0;
        this.countTotalPrice();
    },
    changeLuggage() {
      this.isShowLuggageBox = false;
       this.form.luggage = `${this.$t('order.large-luggage')}*${this.luggages.max}，${this.$t('order.carry-on-luggage')}*${this.luggages.min}`;
    },

    countTotalPrice() {
       this.totalPrice =  this.carPrice + this.childrenPrice;
    },
    querySearchAsync(queryString, cb) {
        let city = this.charterInfo.info.city;
        let _this = this;

         if (queryString) {
          if (this.isUseGoogle) {
            googleMap(queryString).then((res) => {
              _this.restaurants = res;
              cb(res);
            });
          }else {
            baiduMap(queryString, city, this.$axios.jsonp).then((res) => {
              _this.restaurants = res;
              cb(res);
            });
          }
        }
    },
    useCoupon(value) {
      this.coupon = value;
      this.isShowCoupon = false;
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
        .max-w { width: 245px; }
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
            width: 112px;
            height: 112px;
        }
        p { margin: 5px 0 ; }
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
  .el-input__inner:focus {
      border: 1px solid #4B9D63;
  }
  .area-code .el-input__inner {
    width: 90px !important;
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


