<template>
  <div class="day-car">
    <div class="contentBox">
      <div class="left">
        <el-form>
          <el-form-item :label="$t('m.pick-up-location')">
            <div class="clear-float" id="cityBox">
              <city-select
                v-model="cityName"
                :placeholder="$t('m.pick-up-location-pl')"
                @getCityName="getCityName"
                @getCityId="getCityId"
                :sourceCities="sourceCities"
                :isShowCity="isShowCity"
                input-class="prev-icon position"
              ></city-select>
            </div>
          </el-form-item>

          <el-form-item :label="$t('m.privete-start-date')">
            <el-date-picker
              class="prev-icon time"
              v-model="startTime"
              type="date"
              prefix-icon="null"
              value-format="yyyy-MM-dd"
              :placeholder="$t('m.date-departure')"
            ></el-date-picker>
          </el-form-item>

          <el-form-item :label="$t('m.privete-end-date')">
            <el-date-picker
              class="prev-icon time"
              v-model="endTime"
              type="date"
              prefix-icon="null"
              value-format="yyyy-MM-dd"
              :placeholder="$t('m.end-date')"
            ></el-date-picker>
          </el-form-item>

          <el-form-item v-if="!showCar">
            <el-button
              v-if="!showTrap"
              :class="cityName&&startTime&&endTime?'custom-btn' : 'gray-btn'"
              @click="startTrap"
            >{{$t('m.privete-trap')}}<i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
            <el-button
              v-if="showTrap"
              :class="isSelectCar? 'custom-btn':'gray-btn'"
              @click="selectCar"
            >{{$t('m.privete-car-type')}}<i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
          </el-form-item>
          <p v-if="showCar" @click="changeTrap" class="color-green fz16 text-right cursor">&lt;&nbsp;&nbsp; {{$t('m.reschedule')}}</p>
        </el-form>
      </div>
      <div class="right">
        <div class="right-trap" v-if="!showCar">
          <div class="dayList" v-if="!showTrap">
            <div class="mapLogo">
              <img src="../../assets/images/mapLogo.png" class="logo">
              <p class="txt">
                {{$t('p.day-info')}}
                <!-- 请选择出发和结束日期后
                <br>在这里安排每天的行程 -->
              </p>
            </div>
          </div>
          <div class="trap-list" v-if="showTrap">
            <div class="day">
              <i class="el-icon-back" @click="before" v-if="beforeBtn"></i>
              <ul>
                <li v-for="(item, id) in sliceDaies" :key="id">
                  <p
                    class="title"
                    :class="{active: item.day === selectDay}"
                    @click="changeDay(item.day)"
                  >{{item.day}}</p>
                  <p class="detail color-999 fz12">{{item.type}}</p>
                </li>
              </ul>
              <i class="el-icon-right" @click="after" v-if="afterBtn"></i>
            </div>
            <div class="trap-detail">
              <ul>
                <li class="flex-between item-center" @click="checked(1, '市内一日', 'One day')" :class="{liActive :checkIndex == 1}">
                  <div>
                    <p class="fz16 color-333 fw-500">{{$t('m.one-day')}}</p>
                    <p class="fz14 color-666">{{$t('m.one-day-hours')}}</p>
                  </div>
                  <img src="../../assets/images/active_radio.png" v-if="checkIndex==1" alt="">
                  <img src="../../assets/images/radio.png" v-else alt="">
                </li>
                <li class="flex-between item-center" @click="checked(2, '市区半天', 'Half day')" :class="{liActive :checkIndex == 2}">
                  <div>
                    <p class="fz16 color-333 fw-500">{{$t('m.half-day')}}</p>
                    <p class="fz14 color-666">{{$t('m.half-day-hours')}}</p>
                  </div>
                  <img src="../../assets/images/active_radio.png" v-if="checkIndex==2" alt="">
                  <img src="../../assets/images/radio.png" v-else alt="">
                </li>
                <li class="flex-between item-center" @click="checked(3, '周边地区', 'Surrounding area')"  :class="{liActive :checkIndex == 3}">
                  <div>
                    <p class="fz16 color-333 fw-500">{{$t('m.surrounding-area')}}</p>
                    <p class="fz14 color-666">{{$t('m.surrounding-area-hours')}}</p>
                  </div>
                  <img src="../../assets/images/active_radio.png" v-if="checkIndex==3" alt="">
                  <img src="../../assets/images/radio.png" v-else alt="">
                </li>
                <li class="place-li" @click="checked(4, '')" id="areaCityBox"  :class="{liActive :checkIndex == 4}">
                  <div class="flex-between item-center">
                    <div>
                      <p class="fz16 color-333 fw-500">{{$t('m.other-cities')}}</p>
                      <p class="fz14 color-666">{{$t('m.other-cities-hours')}}</p>
                    </div>
                    <img src="../../assets/images/active_radio.png" v-if="checkIndex==4" alt="">
                    <img src="../../assets/images/radio.png" v-else alt="">
                  </div>
                  <area-city-select
                    v-model="cityName2"
                    :placeholder="$t('m.select-city-region')"
                    @getName="getCityName2"
                    @getId="getCityId2"
                    :cityId="cityId"
                    :isShowAreaCity="isShowAreaCity"
                    input-class="position"
                  ></area-city-select>
                </li>
              </ul>
            </div>
          </div>
          <div class="map show-map" id="mapDom"></div>
        </div>
      
        <!-- 车辆信息 -->
        <div v-if="showCar" class="car-info"> 
          <div class="map hide-map" id="mapDom"></div>
          <div class="trap-info flex-between item-center">
            <p class="max-width"><img src="../../assets/images/location.png" alt=""> <span class="fz14 color-666">{{selectTrap.join('——')}}</span></p>
            <!-- <p><img src="../../assets/images/time.png" alt=""> <span class="fz14 color-666">预计行驶56分钟</span></p> -->
          </div>
          <div class="car-dts flex-between" v-for="item in carList.list" :key="item.id">
            <div class="flex">
              <img v-lazy="item.img" alt="">
              <div class="ml25">
                <p class="fz16 color-333 fw550">{{item.name}}</p>
                <p class="fz14 color-333 mt10" v-if="lang == 'zh'"><span class="fw550">人数：</span><span>最多{{item.people}}人</span><span class="fw550 ml20">行李：</span><span>{{item.luggage}}</span></p>
                <p class="fz14 color-333" v-if="lang == 'zh'"><span class="fw550">参考车型：</span><span>{{item.model}}或其他同等级车</span></p>
                <p class="fz14 color-333 mt10" v-if="lang == 'en'"> <i class="el-icon-user-solid"></i>{{item.people}} <i class="el-icon-s-goods ml20"></i><span>{{item.luggage}}</span></p>
                <p class="fz14 color-333" v-if="lang == 'en'"><span>{{item.model}} corolla or similar </span></p>
              </div>
            </div> 
            <div>
              <p class="fz22 color-green">{{carList.currency}}{{item.price}}</p>
              <p class="car-btn mt5 cursor" @click="goOrder(item, carList.currency)">{{$t('m.select')}}</p>
            </div> 
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CitySelect from "./citySelect";
import areaCitySelect from './areaCitySelect';
import { switchNum, getAllDate } from "../../assets/js/public";

import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "chartered",
  components: { CitySelect, areaCitySelect },
  data() {
    return {
      cityName: "",
      cityId: "",
      startTime: null,
      endTime: null,
      searchLoading: false,
      showTrap: false,
      daies: [],
      sliceDaies: [],
      selectDay: this.$t('m.day1'),
      trapType: '',
      i: 0,
      cityName2: '',
      cityId2: '',
      checkIndex: '',
      beforeBtn: false,
      afterBtn: false,
      isSelectCar: false,
      showCar: false,
      sourceCities: [],
      checkPriceParam: {},
      selectTrap: [],
      isShowCity: false,
      isShowAreaCity: false
    };
  },
  created() {
    document.addEventListener('click', (e) => {
      let cityBox = document.getElementById('cityBox');
      let areaCityBox = document.getElementById('areaCityBox');

      cityBox && cityBox.contains(e.target) ? this.isShowCity = true : this.isShowCity = false;
      areaCityBox && areaCityBox.contains(e.target) ? this.isShowAreaCity = true : this.isShowAreaCity = false;
    })
  },
  computed: {
    ...mapState({
      lang: state => state.lang
    }),
  },
  methods: {
    getCityName(cityName) {
      this.cityName = cityName;
    },
    getCityId(cityId){
      this.cityId = cityId;
    },
    getCityId2(cityId){
      this.cityId2 = cityId;
    },
    getCityName2(cityName) {
      this.cityName2 = cityName;
      this.checked(4, '');
    },
    getCityList() {
      this.$axios.get(this.lang + '/tools/city').then((res) => {
        this.sourceCities = res.data.data;
      })
    },
    
    // 修改行程
    changeTrap(){
      this.showCar = false; 
      this.showTrap = true; 
    },
    //安排行程
    startTrap() {
      if (!this.cityName) {
        this.$message({
          message: this.$t('m.select-city-region'),
          type: "warning"
        });
        return;
      } else if (!this.startTime || !this.endTime) {
        this.$message({
          message: this.$t('yz.null-date'),
          type: "warning"
        });
        return;
      }
      this.showTrap = true;
      this.checkIndex = '';
      this.isSelectCar = false;
      this.i = 0;
      this.playDay();
      this.changeDay(this.selectDay);
    },
    // 选择行程类型
    checked(index, text, enText){
      this.checkIndex = index;
      this.trapType = this.lang == 'zh' ? text : enText;
      if (index == 4) {
         this.daies.map((item) => {
          if (item.day == this.selectDay) {
            item.type = `${this.cityName} -> ${this.cityName2}`;
            item.cityId = this.cityId2;
            item.index = index;
          }
      })
      }else {
        this.daies.map((item) => {
        if (item.day == this.selectDay) {
          item.type = this.trapType;
          item.index = index;
        }
      })
     }
      this.sliceDaies = this.daies.slice(this.i, (this.i+3));
      this.checkTrapType();
    },

    // 向左
    before(){
      if (this.i <= 1) {
        this.i = 0;
        this.beforeBtn = false;
      }else {
        this.i--;
      }
      
      this.sliceDaies = this.daies.slice(this.i, (this.i + 3));
      this.changeDay(this.selectDay);
   
      // this.checkIndex = '';
      this.afterBtn = true;
    },
    //向右
    after(){
      if (this.i < this.daies.length - 3) {
        this.i++;

        this.beforeBtn = true;
        this.sliceDaies = this.daies.slice(this.i, (this.i + 3));
        this.checkIndex = '';
      }

      this.changeDay(this.selectDay);
      
      if (this.i < this.daies.length - 3) {
        this.afterBtn = true;
      }else {
         this.afterBtn = false;
      }
    },
    selectCar() {
      const self = this;
      let trapArr = this.lang == 'zh' ?  ['', '市内一日', '市区半天', '周边地区', '其它城市/地区'] : ['', 'One day', 'Half day', 'Surrounding area', 'Other city or region'];

      this.selectTrap.length = 0;
      
      if (!this.isSelectCar) {
         this.$message({
          message: this.$t('yz.null-chart-type'),
          type: "warning"
        });
        return;
      }

      let param = { start_date: this.startTime, end_date: this.endTime, city_id: this.cityId };
      for (let i = 0, len = this.daies.length; i < len; i++) {
        param[`schedule[${i}][type]`] = this.daies[i].index;

        if (this.daies[i].index == 4) {
          param[`schedule[${i}][area]`] = this.daies[i].cityId;
        }
      }
      this.checkPriceParam = param;
      this.searchLoading = true;
      for(let pro in param) {
        if (pro.indexOf('[type]') != -1) {
          this.selectTrap.push(trapArr[param[pro]]);
        }
      }
      
      this.$axios.post(this.lang+'/day-charter/check-price', param).then((res) => {
        this.searchLoading = false;
        if (res.data.data.list.length > 0) {
           this.showCar = true;
           this.carList = res.data.data;
        }else {
           this.$message({message: this.$t('m.no-data'),type: "warning"});
        }
      })
    },
    goOrder(car, currency) {
      let data = {param: this.checkPriceParam, car: car, currency: currency, daies: this.daies, cityName: this.cityName, extra_ffee: this.carList.extra_ffee};
      sessionStorage.setItem('dayOrderData', JSON.stringify(data))
      this.$router.push({'name': 'dayCarOrder'})
    },
    getToday() {
      let day = new Date();
      day.setTime(day.getTime());
      let today = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
      return today;
    },

    // 检查行程类型
    checkTrapType() {
       for (var i = 0, len = this.daies.length; i < len; i++) {
        if (!this.daies[i].type || (this.daies[i].index == 4 && !this.cityName2)) {
          this.isSelectCar = false;
          break;
        }else {
          this.isSelectCar = true;
        }
      }
    },

    // 游玩天数
    playDay() {
      let allDate = getAllDate(this.startTime, this.endTime);
      let arr = [];

      for (let i = 0; i < allDate.length; i++) {
        let date = allDate[i].split("-"),
            type = '',
            index = '',
            str = `${~~date[1]}月${~~date[2]}日`;

        if (this.daies.length > 0) {
          this.daies.map((item) => {
            if (item.date == str) {
              type = item.type;
              index = item.index;
            }
          })
        }

        arr.push({
          day: this.lang == 'zh' ? `第${switchNum(i + 1)}天` : `Day${i + 1}`,
          date: str,
          type: type,
          index: index
        });
      }
      this.daies = arr;
      this.sliceDaies = arr.slice(0, 3);

      if (arr.length > 3) {
        this.afterBtn = true;
      }
    },

    // 选择天
    changeDay(day) {
      this.selectDay = day;

      for (let i = 0, len = this.daies.length; i < len; i++) {
        if (this.daies[i].day == day) {
         this.daies[i].type ? this.checkIndex = this.daies[i].index : this.checkIndex = '';
        }
      }
    },

    initBaiduMap(point, map) {
      if (!map) {
        var map = new BMap.Map('mapDom');
      }

      if (this.cityName) {
          map.centerAndZoom(this.cityName, 11); 
      }else {
          var point = new BMap.Point(point.lng, point.lat); 
          map.centerAndZoom(point, 11); 
      }
    },
    getCurrentPosition(map) {
        var _this = this;
        var map = new BMap.Map('mapDom'); 
        var geolocation = new BMap.Geolocation();

        geolocation.getCurrentPosition(function(r){
          if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            _this.initBaiduMap({lng:r.point.lng, lat: r.point.lat}, map);
          }
        },{enableHighAccuracy: true})
    }
  
  },
  mounted() {
      let _this = this;
      this.getCityList();
    
      if (JSON.stringify(this.$route.params) != '{}') {
        this.cityId = this.$route.params.cityId;
        this.startTime = this.$route.params.startDate;
        this.endTime = this.$route.params.endDate;
        this.cityName = this.$route.params.cityName;
        setTimeout(()=>{_this.startTrap(); },0);
      }
      setTimeout(()=> { _this.getCurrentPosition(); },0)
      
  },
  watch: {
    startTime() {
      if (
        this.startTime &&
        new Date(this.getToday()).getTime() >
          new Date(this.startTime).getTime()
      ) {
        this.$message({
          message: this.$t('yz.less-today'),
          type: "warning"
        });
        this.startTime = "";
      } else if (
        this.endTime &&
        new Date(this.startTime).getTime() > new Date(this.endTime).getTime()
      ) {
        this.$message({
          message: this.$t('m.start-cannot-end'),
          type: "warning"
        });
        this.startTime = "";
      }
      this.showTrap = false;
      this.trapType = "";
      this.i = 0;
    },
    endTime() {
      if (
        this.endTime &&
        new Date(this.getToday()).getTime() > new Date(this.endTime).getTime()
      ) {
        this.$message({
          message: this.$t('yz.less-today'),
          type: "warning"
        });
        this.endTime = "";
      } else if (
        this.startTime &&
        new Date(this.startTime).getTime() > new Date(this.endTime).getTime()
      ) {
        this.$message({
          message: this.$t('yz.end-cannot-start'),
          type: "warning"
        });
        this.endTime = "";
      }
      this.showTrap = false;
      this.trapType = "";
      this.i = 0;
    },
    cityName() {
      this.showTrap = false;
      this.trapType = "";
      this.i = 0;
      this.cityName2 = '';
      if (this.cityName && !this.showCar) {
         this.initBaiduMap();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.custom-btn {
      width: 100%;
      border-radius: 12px;
      border: transparent;
      color: #fff !important;
      background: linear-gradient(#328C6E, #4B9D63);
      box-shadow: 0 2px 20px 0 rgba(51, 51, 51, 0.5);
  }
.custom-btn:hover {color: #fff !important;} 
/deep/ {
  .el-input__inner:focus{
      border-bottom: 1px solid #4B9D63;
  }
  .el-radio__label { display: none; }
  .el-radio__input.is-checked .el-radio__inner {border-color: #ccc; background: #fff;}
  .liActive .el-radio__input.is-checked .el-radio__inner {
    border-color: #38846A;
    background: #38846A;
  }
  .place-li .position .el-input__inner { border-radius: 12px; height: 30px; padding: 0 10px;margin-top: 5px;font-size: 14px; border: 1px solid #ccc;}
  .prev-icon {
    .el-input__inner {
      padding-left: 0 !important;
    }
    &:before {
      content: "";
      position: absolute;
      left: -20px;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 10px;
      height: 10px;
      background-size: cover;
      background-repeat: no-repeat;
    }

    &:after {
      content: "";
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 10px;
      height: 10px;
      background-size: cover;
      background-repeat: no-repeat;
    }

    &.position:before {
      height: 12px;
      background-image: url("../../assets/images/locationIcon.png");
    }

    &.position:after {
      width: 20px;
      height: 20px;
      background-image: url("../../assets/images/searchB.png");
    }

    &.time:before {
      background-image: url("../../assets/images/reservationtime.png");
    }
  }
  .clear-float {
    clear: both;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
  .el-form-item__label {
    font-size: 14px;
    font-weight: 500;
    color: rgba(102, 102, 102, 1);
    line-height: 20px;
  }
  .el-input__inner {
    border-width: 0 0 1px 0;
    padding-left: 0;
    border-radius: 0;
  }
}

.max-width {
  width: 750px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.day-car {
  width: 100%;
  height: 94vh;
  padding-top: 60px;
  background: url("../../assets/images/dayCarbg.jpg") no-repeat center;
  background-size: cover;
  box-sizing: border-box;

  .gray-btn {
    width: 100%;
    border-radius: 12px;
    background: #999999;
    color: #fff;
  }

  .gray-btn:hover {
    color: #fff !important;
  }

  .contentBox {
    width: 1200px;
    height: 500px;
    margin: auto;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;

    .left {
      width: 380px;
      height: 373px;
      background-color: #ffffff;
      padding: 39px 39px 1px;
      box-sizing: border-box;
      box-shadow: 0 2px 20px 0 rgba(51, 51, 51, 0.5);
      border-radius: 12px;
    }

    .right {
        width: 800px;
        height: 500px;
        background-color: #ffffff;
        box-shadow: 0 2px 20px 0 rgba(51, 51, 51, 0.5);
        border-radius: 12px;
        .car-info {
          padding: 10px 20px;
          .trap-info {
            border-bottom: 1px solid #ccc;
            img {
              width: 16px;
              height: 16px;
              vertical-align: middle;
            }
          }
          .car-dts {
            border-bottom: 1px solid #ccc;
            padding: 10px 0;
            margin: 15px 0;
            img {
              width: 140px;
              height: 60px;
            }
            p { margin: 0;}
            .car-btn {
              width: 90px;
              height: 36px;
              border-radius: 24px;
              color: #38846A;
              border: 1px solid #38846A;
              text-align: center;
              line-height: 36px;
            }
          }
        }

        .right-trap {
          display: flex;
          height: 500px;
          flex-wrap: nowrap;
          .map {
            width: 450px;
            height: 100%;
            border-top-right-radius: 12px;
            border-bottom-right-radius: 12px;
            // background-image: url("../../assets/images/daycar_map.png");
          }
          .show-map {
            height: 100%;
          }
          .hide-map {
            height: 0;
          }
      }

      .trap-detail {
        margin-top: 10px;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        li:last-child { border: none; }
        li {
          border-bottom: 1px solid #CCCCCC;
          padding: 10px 20px;
          p {
            margin: 5px  0;
          }
        }
      }

      .trap-list {
        width: 350px;
        height: 500px;

        .liActive {
          background: #EEECEC;
        }

        .day {
          position: relative;
          i {
            position: absolute;
            top: 18px;
            font-size: 16px;
          }
          .el-icon-back {
            left: 5px;
          }
          .el-icon-right {
            right: 5px;
          }
        }

        .day ul {
          display: flex;
          justify-content: center;
          margin-top: 10px;
          li {
            width: 100px;
            text-align: center;
            .title {
              color: #666;
              font-size: 14px;
              height: 30px;
              line-height: 30px;
              cursor: pointer;
            }
            .active {
              background: linear-gradient(#328c6e, #4b9d63);
              color: #fff;
              border-radius: 15px;
            }
            p {
              margin: 8px 0;
            }
          }
        }
      }

      .dayList {
        width: 350px;
        height: 500px;
        display: flex;
        align-items: center;
        .mapLogo {
          margin: auto;
          text-align: center;
          .logo {
            width: 116px;
            height: 99px;
          }
          .txt {
            width: 230px;
            padding-top: 15px;
            font-size: 16px;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
            line-height: 22px;
          }
        }
      }
 
    }
  }
}
</style>
