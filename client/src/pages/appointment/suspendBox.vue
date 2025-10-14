<template>
  <div class="divCenter" >
    <div class="suspend-box" v-loading="cityLoading">
      <div class="car-form">
        <el-form :model="form">
          <el-form-item :label="$t('m.time')">
            <div class="clear-float">
              <el-date-picker
                class="prev-icon time"
                v-model="use_time"
                type="datetime"
                prefix-icon="null"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                :placeholder="$t('m.pick-up-time2')"
              ></el-date-picker>
            </div>
          </el-form-item>

          <el-form-item :label="$t('m.start-point')">
            <div class="addAddress" @click="doAddress"></div>
            <div>
               <div class="city-adress prev-icon start-position p-relative">
                 <el-select v-model="form.city_id" :placeholder="$t('account.select')">
                  <el-option
                    v-for="item in sourceCities"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                  <el-autocomplete
                    class="width"
                    v-model="address[0]"
                    :fetch-suggestions="querySearchAsync"
                    :placeholder="$t('m.start-point-pl')"
                    :title="address[0]"
                    clearable
                  ></el-autocomplete>
               </div>
              <div v-for="(item,index) in address" :key="index" class="p-relative ">
                 <el-autocomplete
                  v-if="index > 0"
                  class="prev-icon start-position w100"
                  v-model="address[index]"
                  :fetch-suggestions="querySearchAsync"
                  :placeholder="$t('m.start-point-pl')"
                  :title="address[index]"
                  clearable
                ></el-autocomplete>
                <i class="el-icon-circle-close deleteAddress" v-if="index>0" @click="doDelete(index)"></i>
              </div>
            </div>
          </el-form-item>

          <el-form-item :label="$t('m.arrive-point')">
               <el-autocomplete
                class="prev-icon end-position w100"
                v-model="arrive"
                :fetch-suggestions="querySearchAsync"
                :placeholder="$t('m.arrive-point-pl')"
                :title="arrive"
                clearable
              ></el-autocomplete>
            <!-- <place-select
              v-model="form.arrive"
              placeholder="请输入目的地址"
              :sourceCities="sourceCities"
              :continentAndCity="cityListByGroup"
              input-class="prev-icon end-position"
            ></place-select> -->
          </el-form-item>

          <el-form-item v-if="!isSelectCar">
            <el-button class="custom-btn" :loading="searchLoading" @click="searchCar">
              {{$t('m.book')}}
              <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
          </el-form-item>

          <template v-else>
            <div class="car-type">
              <el-carousel
                height="92px"
                indicator-position="none"
                :autoplay="false"
                @change="carTypeChange"
                arrow="always"
              >
                <el-carousel-item class="text-center" v-for="(car,idx) in carList" :key="idx">
                  <img v-lazy="car.img">
                  <p style="margin: 0">
                    <span class="car-model p-relative">
                      {{car.name}}
                      <el-popover placement="top" width="200" trigger="hover">
                        <div style="text-align: center" v-if="lang=='zh'">
                          {{car.model}}或同款车型
                          <br>
                          可容纳{{car.people}}人，{{car.luggage}}
                        </div>
                         <div style="text-align: center" v-if="lang=='en'">
                          {{car.model}} corolla or similar 
                          <br>
                          <i class="el-icon-user-solid"></i> {{car.people}} <i class="el-icon-s-goods ml20"></i> {{car.luggage}}
                        </div>
                        <img
                          slot="reference"
                          style="width: 10px;height: 10px;margin-left: 5px;cursor: pointer"
                          src="../../assets/images/help.png"
                        >
                      </el-popover>
                    </span>
                  </p>
                </el-carousel-item>
              </el-carousel>
            </div>

            <p class="total-price">{{totalPrice}}</p>

            <el-form-item>
              <el-button @click="toConfirmOrder()" class="custom-btn">{{$t('m.book-now')}}</el-button>
            </el-form-item>
          </template>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { googleMap, baiduMap, getGoogleImg} from "../../assets/js/public";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "AppointmentBox",
  data() {
    return {
      use_time: "",
      form: {
        city_id: ""
      },
      address: [''],
      arrive: "",
      carType: [],
      carTypeIndex: 0, 
      isSelectCar: false,
      searchLoading: false,
      carList: [],
      trapInfo: {},
      totalPrice: "",
      isUseGoogle: false,
      restaurants: [],
      sourceCities: []
    };
  },
  computed: {
    ...mapState({
      lang: state => state.lang,
      cityLoading: state => state.cityLoading
    }),
    ...mapGetters(["cityListByGroup"])
  },
  methods: {
    ...mapActions({
      getCityList: "getCityList"
    }),
    carTypeChange(index) {
      this.totalPrice = "¥ " + this.carList[index].price;
      this.carTypeIndex = index;
    },
    getCityList() {
      this.$axios.get(this.lang+'/tools/city').then((res)=> {
        this.sourceCities = res.data.data;
      })
    },
    getCity(city_id) {
      this.city = city_id;
    },
    doAddress() {
        if (this.address.length >= 5) {
          return false
        }
        this.address.push('');
    },
    doDelete(index) {
      this.address.splice(index, 1)
    },
    getCityName() {
      let selectCity = this.sourceCities.filter(item => item.id == this.form.city_id);
      let city = selectCity.length > 0 ? selectCity[0].name :'' ;
      return city;
    },
    querySearchAsync(queryString, cb) {
      let _this = this, 
         city = this.getCityName();

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
    searchCar() {
      if (!this.use_time) {
        this.$message.error(this.$t('m.pick-up-time'));
        return false;
      }else if (!this.address[0]) {
        this.$message.error(this.$t('yz.null-start-address'));
        return false;
      }else if (!this.arrive) {
        this.$message.error(this.$t('yz.null-end-address'));
        return false;
      }

      let arr = [this.arrive], 
          param = this.form;

      param.use_time = this.use_time;
      param.address = this.address.concat(arr)
      this.searchLoading = true;

      this.$axios.post(this.lang+'/point-car/check-price', param).then((res) => {
        this.searchLoading = false;

        if (res.data.data.list.length > 0) {
          this.isSelectCar = true;
          this.carList = res.data.data.list;
          this.trapInfo = res.data.data;
        }else {
          this.$message.error(this.$t('m.no-data'));
        }
       
      }, () => {
        this.searchLoading = false;
      })
    },

    toConfirmOrder() {
      let data = this.form;
      data.address = this.address;
      data.arrive = this.arrive;
      data.car = this.carList[this.carTypeIndex];
      data.cityName = this.getCityName();
      data.currency = this.trapInfo.currency;
      data.distance = this.trapInfo.distance;
      data.extra_ffee = this.trapInfo.extra_ffee;

      sessionStorage.setItem('appointmentData', JSON.stringify(data));
      this.$router.push({'name':'appointmentOrder'})
    },

    getToday() {
      let day = new Date();
      day.setTime(day.getTime());
      let today = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
      return today;
    },
  },
  mounted() {
    let _this = this;
    if (this.sourceCities.length === 0) {
      this.getCityList();
    }else {
      this.form.city_id = this.sourceCities[0].id;
    }

    if ((JSON.stringify(this.$route.params) != "{}")) {
      this.form = this.$route.params.form;
      this.use_time = this.$route.params.form.use_time;
      this.address = this.$route.params.address;
      this.arrive = this.$route.params.arrive;

      this.searchCar();
    }
   
    getGoogleImg().then((res) => {
      this.isUseGoogle = res;
    })
  },
  watch: {
    sourceCities() {
      this.form.city_id = this.sourceCities[0].id;
    },
    use_time() {
      if(this.use_time && new Date(this.getToday()).getTime() > new Date(this.use_time).getTime()){
          this.$message({ message: this.$t('yz.less-today'), type: "warning"});
          this.use_time = "";
      }
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ {
  .el-input__inner:focus {
      border-bottom: 1px solid #4B9D63 !important;
  }
  .el-select .is-focus .el-input__inner:focus {
    border-bottom: 1px solid #ccc;
  }
  .custom-btn {
    width: 100%;
    border-radius: 12px;
    color: #fff !important;
    background: linear-gradient(#328C6E, #4B9D63);
    box-shadow: 0 2px 20px 0 rgba(51, 51, 51, 0.5);
    border: transparent;
  }
  .el-carousel__container {
    width: 300px !important;
  }

  .custom-btn:hover {color: #fff !important;}
  .prev-icon  .el-input__inner {
    padding-left: 0 !important;
  }
  .prev-icon {
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

    &.time:before {
      background-image: url("../../assets/images/reservationtime.png");
    }

    &.start-position:before {
      background-image: url("../../assets/images/reservationstart.png");
    }

    &.end-position:before {
      background-image: url("../../assets/images/reservation-destination.png");
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

.area-code {
  width: 60px;
}

.divCenter {
  width: 1201px;
  height: 100%;
  margin: auto;
  position: relative;
}

.city-adress {
  margin-top: 25px;
  .el-select {
    position: relative;
    width: 85px;
  }
  .el-autocomplete { position: relative; right: 4px; width: 70%;;}
}
.w100 {
  width: 100%;
}

.addAddress {
  width: 18px;
  height: 18px;
  position: absolute;
  z-index: 9;
  right: 0;
  cursor: pointer;
  background: url("../../assets/images/plusAdd.png") no-repeat;
}
.deleteAddress {
  width: 18px;
  height: 18px;
  line-height: 18px;
  font-size: 18px;
  position: absolute;
  top: 10px;
  right: -10px;
  z-index: 9;
  color: #ff6554;
  cursor: pointer;
  text-align: center;
}
.suspend-box {
  position: absolute;
  left: 0;
  top: 50px;
  z-index: 9;

  .car-type {
    img {
      height: 60px;
    }

    .car-model {
      font-size: 16px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 22px;
      position: relative;
    }

    /deep/ {
      .el-carousel__arrow {
        margin-top: -21px;
        background: transparent;
        color: #2c2c2c;
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
      .el-carousel__arrow--left {
        left: 0;
      }
      .el-carousel__arrow--right {
        right: 0;
      }
    }
  }

  .total-price {
    text-align: center;
    font-size: 22px;
    font-weight: 500;
    color: #38846A;
    line-height: 30px;
    margin: 10px 0 5px;
  }

  .car-form {
    width: 380px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 20px 0px rgba(51, 51, 51, 0.5);
    border-radius: 12px;
    box-sizing: border-box;
    padding: 39px 39px 1px;
  }

  .help-call {
    display: none;
    width: 380px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 20px 0px rgba(51, 51, 51, 0.5);
    border-radius: 12px;
    margin-top: 20px;

    .help-call-btn {
      height: 60px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      color: rgba(102, 102, 102, 1);
      line-height: 60px;
    }

    .help-call-form {
      position: relative;
      padding: 39px 39px 1px;

      .el-icon-close {
        position: absolute;
        top: 20px;
        right: 20px;
        cursor: pointer;
      }

      /deep/ {
        .el-input-group__prepend {
          border-width: 0 0 1px 0;
          background-color: white;
        }
      }
    }
  }
}
</style>
