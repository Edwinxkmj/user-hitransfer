<template>
  <div class="customize">
    <div class="content">
      <div class="left">
        <div class="setps">
            <el-steps :active="active" finish-status="success">
                <el-step :title="$t('m.information')"></el-step>
                <el-step :title="$t('m.contact')"></el-step>
                <el-step :title="$t('m.done')"></el-step>
            </el-steps>
        </div><br>
        <div v-if="active == 0">
            <el-form label-position="right" label-width="100px" >
            <el-form-item :label="$t('m.destinations')">
                <city-select-cus
                    id="box"
                    v-model="form.address"
                    :placeholder="$t('m.search-city-privete')"
                    @getCityName="getCityName"
                    @getCityIds="getCityIds"
                    :sourceCities="sourceCities"
                    :cityIds="form.cityIds"
                    :cityName="form.address"
                    :isShowCity="isShowCity"
                    input-class="prev-icon position"
                ></city-select-cus>
            </el-form-item>
            <el-form-item :label="$t('m.start-date')">
            <el-date-picker
                    class="date"
                    style="width: 100%;"
                    v-model="startDate"
                    value-format="yyyy-MM-dd"
                    type="date"
                    prefix-icon="null"
                    :placeholder="$t('m.start-date-pl')">
                </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('m.passengers')">
                <el-col :span="11">
                <el-form-item class="person" id="personBox">
                    <el-input v-model="form.peopleNum"  @focus="isShowPersonBox = true" style="position:relative;right: 20px;top:-10px"></el-input>
                    <div class="drop-box" v-if="isShowPersonBox" >
                        <div class="select-box">
                            <span>{{$t('m.adult')}}</span>
                            <el-input-number v-model="people.adult" :min="0"></el-input-number>
                        </div>
                        <div class="select-box">
                            <span>{{$t('m.children')}} （{{$t('m.seven-age')}}）</span>
                            <el-input-number v-model="people.children" :min="0"></el-input-number>
                        </div>
                        <span @click="changePerson">{{$t('m.ok')}}</span>
                    </div>
                </el-form-item>
                </el-col>
                <el-col class="line fz16 color-333" :span="2">{{$t('m.budget')}}</el-col>
                <el-col :span="11">
                <el-form-item>
                    <el-input v-model="form.budget" :placeholder="$t('m.budget-pl')" style="position:relative;top:-10px;width: 230px;"></el-input>
                </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item :label="$t('m.others')">
                <el-checkbox-group v-model="form.demand_ids" size="mini" >
                    <el-checkbox :label="$t('m.tickets')" border></el-checkbox>
                    <el-checkbox :label="$t('m.flights')" border></el-checkbox>
                    <el-checkbox :label="$t('m.hotels')" border></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            </el-form>
            <el-button class="mt20 next-btn" @click="next" style="position:relative;right: 20px;">{{$t('m.next')}}</el-button>
        </div>
        <div v-if="active == 1">
            <el-form label-position="right" label-width="128px" >
                <el-form-item :label="$t('order.client-name2')">
                    <el-input v-model="form.name" :placeholder="$t('order.client-name2')" ></el-input>
                </el-form-item>
                <el-form-item :label="$t('m.phone-number')">
                    <el-input class="tel-input" @keyup.native="form.phone = form.phone.replace(/[^\d]/g,'')" :placeholder="$t('m.phone-number')" v-model="form.phone">
                    <el-select v-model="form.areaCode"
                                slot="prepend"
                                placeholder="请选择"
                                class="area-code">
                        <el-option v-for="code in areaCode"
                                :key="code.value"
                                :label="code.value"
                                :value="code.value">
                        <span style="float: left;margin-right: 10px">{{ code.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ code.value }}</span>
                        </el-option>
                    </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('m.wechat-number')">
                    <el-input v-model="form.wechat" :placeholder="$t('m.wechat-pl')" ></el-input>
                </el-form-item>
                <el-form-item label="WhatsApp">
                    <el-input v-model="form.whatsapp" :placeholder="$t('m.whatsapp-pl')" ></el-input>
                </el-form-item>
            </el-form>
            <div class="btns">
                <el-button class="back-btn fz16 color-333" @click="back">{{$t('m.back-privete')}}</el-button>
                <el-button class="next-btn" @click="next">{{$t('m.next')}}</el-button>
            </div>
        </div>
        <div v-if="active == 3">
            <div class="step-three">
                <img src="../../assets/images/success.png" alt="">
                <h3 class="mt40">{{$t('m.success')}}！</h3>
                <div class="color-999 fz16 tip-info" v-if="lang == 'zh'">
                    <p>定制提交完成，专属定制师会在 </p>
                    <p>{{telDate}}前与您电话联系 </p>
                    <p>请注意来电 </p>
                    <p></p>
                </div>
                <div class="color-999 fz16 tip-info" v-if="lang == 'en'">
                    <p>The customized submission is successful. </p>
                    <p>we will contact you by phone before {{telDate}} </p>
                    <p></p>
                </div>
                <el-button class="home-btn fz16 color-333 mt40" @click="goHome">{{$t('m.homepage')}}</el-button>
            </div>
        </div>
      </div>
      <div class="right">
          <h4 class="color-fff fz26 fw0">{{$t('m.information-list')}}</h4>
          <p class="fz16 mt100"><label class="color-ccc">{{$t('m.destinations')}}</label> <span class="color-fff">{{form.address.length>0? form.address.join('，'): " "}}</span></p>
          <p class="fz16"><label class="color-ccc">{{$t('m.start-date')}}</label> <span class="color-fff">{{startDate}}</span></p>
          <p class="fz16"><label class="color-ccc">{{$t('m.passengers2')}}</label> <span class="color-fff">{{form.peopleNum}}</span></p>
          <p class="fz16"><label class="color-ccc">{{$t('m.budget2')}}</label> <span class="color-fff">{{form.budget}}</span></p>
          <p class="fz16"><label class="color-ccc">{{$t('m.others')}}</label> <span class="color-fff">{{form.demand_ids.length>0?form.demand_ids.join('，'): ""}}</span></p>
          <p class="fz16"><label class="color-ccc">{{$t('order.client-name2')}}</label> <span class="color-fff">{{form.name}}</span></p>
          <p class="fz16"><label class="color-ccc">{{$t('m.phone-number')}}</label> <span class="color-fff">{{form.phone}}</span></p>
          <p class="fz16"><label class="color-ccc">{{$t('m.wechat-number')}}</label> <span class="color-fff">{{form.wechat}}</span></p>
          <p class="fz16"><label class="color-ccc">WhatsApp</label> <span class="color-fff">{{form.whatsapp}}</span></p>
      </div>
    </div>
  </div>
</template>
<script>
import CitySelectCus from "./citySelectCus";
import { areaCodeList } from "../../assets/js/areaCode";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "customize",
  components: { CitySelectCus },
  data() {
    return {
      active: 0,
      areaCode: [],
      isShowPersonBox: false,
      people: {adult: 1, children: 0},
      sourceCities: [],
      startDate: "",
      isShowCity: false,
      form: {
        cityIds: [],
        address: [],
        peopleNum: `${this.$t('m.adult')}*2，${this.$t('m.children')}*0`,
        budget: "",
        demand_ids: [],
        areaCode: "+86",
        phone: '',
        wechat: '',
        name: '',
        whatsapp: ''
      },
      telDate: ''
    };
  },
   computed: {
    ...mapState({
      cityLoading: state => state.cityLoading,
      lang: state => state.lang
    }),
    ...mapGetters(["cityListByGroup"])
  },
  mounted() {
    window.scrollTo(0, 0);
    this.areaCode = areaCodeList(this.$t('m.china'), this.$t('m.australia'), this.$t('m.new-zealand'), this.$t('m.hong-kong'));
    this.getCityList();
  },
  created() {
    document.addEventListener('click', (e) => {
     let box = document.getElementById('box');
     let personBox = document.getElementById('personBox');

     box && box.contains(e.target) ?  this.isShowCity = true : this.isShowCity = false;
     personBox && personBox.contains(e.target) ? this.isShowPersonBox = true : this.isShowPersonBox = false;
    })
  },
  methods: {
    ...mapActions({
      searchCarList: "searchCarList",
      getCityList: "getCityList"
    }),
    getCityList() {
      this.$axios.get(this.lang + '/tools/city').then((res) => {
        this.sourceCities = res.data.data;
      })
    },
    getCityName(cityName) {
      this.form.address = cityName;
    },
    getCityIds(cityIds) {
      this.form.cityIds = cityIds;
    },
    changePerson(){
        this.isShowPersonBox = false;
        this.form.peopleNum = `${this.$t('m.adult')}*${this.people.adult}，${this.$t('m.children')}*${this.people.children}`;
    },
    next() {
        if (this.active == 0) {
            if (this.form.address.length == 0) {
                this.$message({
                    message: this.$t('yz.null-destination'),
                    type: "warning"
                });
                return;
            }else if(!this.startDate) {
                this.$message({
                    message: this.$t('yz.null-start-date2'),
                    type: "warning"
                });
                return;
            }
            this.active ++;
        }else {
            if (!this.form.name) {
                 this.$message({
                    message: this.$t('yz.null-name'),
                    type: "warning"
                });
                return;
            }else if (!this.form.phone) {
                 this.$message({
                    message: this.$t('yz.null-phone'),
                    type: "warning"
                });
                return;
            }

            let parem = {
              city_ids: this.form.cityIds.join(','),
              date: this.startDate,
              adults: this.people.adult,
              children: this.people.children,
              budget: this.form.budget,
              demand_ids: this.form.demand_ids.join(','),
              contact_name: this.form.name,
              area_code: this.form.areaCode,
              contact_mobile: this.form.phone,
              wechat: this.form.wechat,
              whatsapp: this.form.whatsapp
            }
           
            this.$axios.post(this.lang+'/private-custom/make', parem).then((res) => {
              if (res.data.status == 1) {
                 this.active +=2;
                 this.telDate = res.data.data.date;
              }
            })
        }
    },
    back() {
        this.active --;
    },
    goHome() {
         this.$router.push({ name: "home" });
    },
    getToday() {
        let day = new Date();
        day.setTime(day.getTime());
        let today = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
        return today;
      }
  },
  watch: {
      startDate() {
      if(this.startDate && new Date(this.getToday()).getTime() > new Date(this.startDate).getTime()){
          this.$message({ message: this.$t('yz.less-today'), type: "warning"});
          this.startDate = "";
      }
    }
  }
};
</script>

<style scoped lang="scss">
.customize {
  background: url("../../assets/images/head-bg.jpg") no-repeat center;
  height: 94vh;
  width: 100%;
  background-size: cover;
  
  .content {
    display: flex;
    width: 1200px;
    height: 600px;
    box-shadow: 0 0 5px #222;
    margin: auto;
    position: relative;
    top: 50px;
    border-radius: 12px;
  }
  .left {
    height: 100%;
    width: 784px;
    padding: 20px 40px;
    background: #fff;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    .setps {
        width: 600px;
        margin: 20px auto;
    }
    .btns {
        padding: 0 30px 0 20px;
        margin-top: 100px;
    }
    .next-btn {
        border-radius: 24px;
        width: 160px;
        height: 48px;
        text-align: center;
        font-size: 16px;
        float: right;
    }
    .next-btn:hover {color: #fff !important;}
    .back-btn {
        border-radius: 24px;
        width: 160px;
        height: 48px;
        text-align: center;
    }
    .step-three {
        text-align: center;
        .tip-info p { margin: 0 0 5px 0; }
        .tip-info p:last-child { margin-top: 30px; }
        .home-btn {
            color: #333;
            width: 188px;
            height: 48px;
            text-align: center;
            border-radius: 24px;
            border: 1px solid #328C6E;
        }
    }
  }
  .right {
    height: 100%;
    width: 416px;
    padding: 20px 40px;
    background: #333333;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    p label {
        display: inline-block;
        width: 120px;
        vertical-align: top;
    }

    p span {
        display: inline-block;
        width: 180px;
    }
    h4 { margin: 20px 0 0 0; }
  }
}
.person {position: relative;}

.drop-box{
    position: absolute;
    top: 50px;
    left: -10px;
    width: 330px;
    border: 1px solid #cccccc;
    border-top: 2px solid #38846A;
    margin: -12px;
    padding: 21px 21px 5px 21px;
    box-sizing: border-box;
    background-color: #ffffff;
    z-index: 1000;

    >span:last-child{
      float: right;
      color: #38846A;
      cursor: pointer;
      margin: 10px 0;
    }

    >div{
      display: flex;
      justify-content: space-between;
      align-items: center;

      >span:first-child{
        font-size:14px;
        font-weight:500;
        color:rgba(51,51,51,1);
      }

      /deep/{
        
         .el-input-number{
          width: 100px;

           .el-input__inner{
            padding-left: 30px;
            padding-right: 30px;
            border: 0;
          }

          .el-input-number__decrease,
          .el-input-number__increase{
            top: 9px;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: transparent;
            color: #38846A;
            border: 1px solid #38846A;
            line-height: 22px;
          }
        }
      }
    }
  }

/deep/ {
   .el-input__inner:focus {
        border: 1px solid #4B9D63;
    }
  .date .el-input__inner { padding-left: 9px !important; }
  .el-step__title {font-size: 12px;} 
  .el-step__title.is-process {
      font-weight: normal;
      color: #38846A;
  } 
  .el-step__title.is-success,
  .el-step__head.is-success,
  .el-step__head.is-process,
  .el-checkbox { color: #38846A; }
  .el-step__head.is-success,
  .el-step__head.is-process { border-color: #4B9D63;}
  .el-step__icon.is-text {
       width: 30px; height: 30px;
  }
  .is-wait .el-step__icon.is-text { background: #999999; color: #fff; border-color: transparent; }
  .is-success .el-step__icon.is-text,
  .is-process .el-step__icon.is-text { background: linear-gradient(#328C6E, #4B9D63); color: #fff;}  
}
.el-checkbox.is-bordered.el-checkbox--mini {
    padding: 2px 15px 2px 7px;
    border-radius: 15px;
    margin-right: 5px;
}
.el-checkbox.is-bordered {
    border: 1px solid #38846A;
}
.el-checkbox.is-checked,
.next-btn {
    background: linear-gradient(#328C6E, #4B9D63); color: #fff;
}
</style>




