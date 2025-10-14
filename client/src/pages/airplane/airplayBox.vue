<template>
  <div>
    <div class="airplay-box" v-loading="cityLoading">
      <div class="top">
        <el-col :span="12">
          <div class="logo en-width" :class="{active: form.type===1}" @click="doClick(1)">
            <img v-if="form.type===1" src="../../assets/images/airplaneGet.png" />
            <img v-else src="../../assets/images/airport2.png" />
            <p>{{$t('m.pick-up')}}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="logo en-width" :class="{active: form.type===2}" @click="doClick(2)">
            <img v-if="form.type===2" src="../../assets/images/airportActive.png" />
            <img v-else src="../../assets/images/airportdropoff.png" />
            <p>{{$t('m.drop-off')}}</p>
          </div>
        </el-col>
      </div>
      <div style="position: relative">
        <el-form :model="form">
          <el-form-item :label="$t('m.pick-up-point')" id="airportBox" class="p-relative">
            <select-airport
              v-if="airportName"
              @airportId="getAirPortId"
              @airportName="getAirportName"
              @cityName="getCityName"
              :aname="airportName"
              style="width: 300px;"
            ></select-airport>
          </el-form-item>

          <!--航班查询-->
          <el-form-item :label="titleMsg">
            <div class="addAddress" @click="doAddress"></div>
            <div v-for="(item,index) in form.starting" style="position: relative" :key="index">
              <i class="el-icon-circle-close deleteAddress" v-if="index>0" @click="doDelete(index)"></i>
              <search-address
                class="width"
                v-if="form.starting[index]"
                :address="form.starting[index]"
                :aIndex="index"
                @inputAddress="getInputAddress"
                @addressIndex="getAddressIndex"
                :airportCity="airportCity"
                :placeholder="$t('m.address-hotel-name')"
              ></search-address>
            </div>
          </el-form-item>

          <el-form-item :label="$t('m.time')">
            <el-date-picker
              class="carData"
              v-model="arrive"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              :placeholder="placeholderDate"
            ></el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button class="custom-btn" @click="selectCar">
              {{$t('m.book')}}
              <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div v-if="isSelectCar" class="select-car">
      <div class="flex-between header-icon">
        <span>
          <i class="el-icon-location-information"></i>
          {{order.address[0]}} —— {{form.starting[0].length>=50?form.starting[0].substring(0,50)+'...' : form.starting.join(',')}}
        </span>
        <span>
          <img class="wh14" src="../../assets/images/distance_slices.png" alt />
          {{$t('m.about')}} {{order.distance}}km
        </span>
      </div>

      <div class="car-Item" v-for="(item, index) in order.list" :key="index">
        <div class="car-pic">
          <img v-lazy="item.img" />
        </div>
        <div class="car-content">
          <p class="car-name">{{item.name}}</p>
          <p class="car-people" v-if="lang=='zh'">
            <span style="font-weight: bold">人数：</span>
            <span>{{item.people}}</span>
            <span style="font-weight: bold;margin-left: 10px">行李：</span>
            <span>{{item.luggage}}</span>
          </p>
          <p class="car-people" v-if="lang=='en'">
            <i class="el-icon-user-solid"></i>
            <span>{{item.people}}</span>
            <i class="el-icon-s-goods ml20"></i>
            <span>{{item.luggage}}</span>
          </p>
          <p class="car-type" v-if="lang=='zh'">
            <span style="font-weight: bold">参考车型：</span>
            {{item.model}}或其它同等车型
          </p>
          <p class="car-type" v-if="lang=='en'">{{item.model}} corolla or similar</p>
        </div>
        <div class="car-money">
          <p class="money-money">{{order.currency}}{{item.price}}</p>
          <div class="money-btn" @click="goOrder(item, order.distance)">{{$t('m.select2')}}</div>
        </div>
      </div>
      <div v-if="order.list.length == 0" class="no-data">No data ~</div>
    </div>

    <!--航班查询的结果-->
    <el-dialog
      width="518px"
      :visible.sync="airplanKey"
      :close-on-click-modal="false"
      @close="closeFlyList"
    >
      <div v-loading="isLoading" class="flightNo">
        <div class="item" v-for="(item, index) in itemArray" :key="index">
          <p class="fz14 color-666">{{computedTitle(form.flyTiem)}} &nbsp; &nbsp;{{airPlayNumber}}</p>
          <img class="mt20 img" src="../../assets/images/flightno.png" alt />
          <div class="flex-between mt10">
            <div class="flex-between info">
              <div class="text-center">
                <p class="fz22 color-333">{{item.depEstimated}}</p>
                <p class="fz16 color-666 mt2">{{item.depCode}}</p>
              </div>
              <div class="text-center">
                <p class="fz22 color-333">{{item.arrScheduled}}</p>
                <p class="fz16 color-666 mt2">{{item.arrCode}}</p>
              </div>
            </div>
            <div class="btn" @click="selectFly(item)">{{$t('m.select')}}</div>
          </div>
        </div>
        <p class="text-center" v-if="itemArray.length == 0">{{$t('m.no-data')}}</p>
      </div>
    </el-dialog>

    <!--航班查询的盒子模型-->
    <el-dialog width="350px" :visible.sync="airplanTime" :close-on-click-modal="false">
      <div>
        <el-form :model="form">
          <el-form-item :label="$t('m.flight-number')">
            <el-input v-model="airPlayNumber" :placeholder="$t('m.eg')"></el-input>
          </el-form-item>

          <el-form-item :label="$t('m.departure-time')">
            <el-date-picker
              class="carData"
              v-model="form.flyTiem"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              prefix-icon="null"
              :placeholder="$t('m.type-time')"
            ></el-date-picker>
          </el-form-item>

          <el-form-item>
            <p
              css="fz14 color-666 text-center"
              style="margin: 0;line-height: 25px;"
            >{{$t('m.transit-info')}}</p>
            <el-button class="custom-btn mt15" @click="clickAirplan">
              {{$t('m.flight-search')}}
              <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import selectAirport from "../../components/selectAirport";
import searchAddress from "../../components/searchAddress";

export default {
  name: "AirplayBox",
  components: { selectAirport, searchAddress },
  computed: {
    ...mapState({
      cityLoading: state => state.cityLoading,
      lang: state => state.lang,
      currency: state => state.currency
    }),
    ...mapGetters([
      "cityListByAirport",
      "sourceCitiesByAirport",
      "cityListByGroup"
    ])
  },
  data() {
    return {
      titleMsg: this.$t("m.drop-off-point"),
      placeholderMsg: "请输入送达地点",
      airPlayNumber: "",
      airportName: "",
      showAirList: false,
      placeholderDate: this.$t("m.pick-up-time"),
      airportCity: "",
      form: {
        airplay: "",
        airplayId: "",
        starting: [""],
        flyTiem: "",
        type: 1
      },
      arrive: "",
      order: {},
      isHelpCall: false,
      isSelectCar: false,
      airplanTime: false,
      airplanKey: false,
      itemArray: [],
      flightShow: false,
      restaurants: [],
      timeout: null,
      isLoading: true,
      flightNo: "",
      cityName: "",
      addressIndex: 0
    };
  },
  created() {
    document.addEventListener("click", e => {
      let airportBox = document.getElementById("airportBox");
      airportBox && airportBox.contains(e.target)
        ? (this.showAirList = true)
        : (this.showAirList = false);
    });
  },
  methods: {
    getAirPortId(id) {
      this.form.airplayId = id;
    },
    getAirportName(name) {
      this.airportName = name;
    },
    getCityName(cityName) {
      this.cityName = cityName;
    },
    computedTitle(item) {
      let date = item.split("-");
      let str =
        this.lang == "zh"
          ? date[0] + "年" + date[1] + "月" + date[2] + "日"
          : date[0] + "/" + date[1] + "/" + date[2] + "/";
      return str;
    },
    closeFlyList() {
      this.flightShow = false;
      this.isLoading = true;
    },
    getInputAddress(address) {
      this.form.starting[this.addressIndex] = address;
    },
    getAddressIndex(index) {
      this.addressIndex = index;
    },
    // 查询车型
    selectCar() {
      if (!this.form.airplayId) {
        this.$message.error(this.$t("yz.null-airport"));
        return;
      } else if (this.form.starting.length > 0) {
        for (let i = 0; i < this.form.starting.length; i++) {
          if (!this.form.starting[i]) {
            this.$message.error(this.$t("yz.null-adress"));
            return;
          }
        }
      } else if (this.arrive == "") {
        this.$message.error(this.$t("yz.null-use-time"));
        return;
      }

      this.$axios
        .post("en/transfer/check-price", {
          use_time: this.arrive,
          airport_id: this.form.airplayId,
          address: this.form.starting,
          type: this.form.type,
          currency: this.currency
        })
        .then(
          res => {
            this.order = res.data.data;
            this.isSelectCar = true;
          },
          () => {
            this.order = [];
            this.isSelectCar = false;
          }
        );
    },

    /*接送机的切换*/
    doClick(index) {
      if (index === 1) {
        this.form.type = index;
        this.titleMsg = this.$t("m.drop-off-point");
        this.placeholderMsg = "请输入送达地点";
        this.placeholderDate = this.$t("m.pick-up-time");
      } else {
        this.form.type = index;
        this.titleMsg = this.$t("m.pick-up-point2");
        this.placeholderMsg = "请输入上车地点";
        this.placeholderDate = this.$t("m.drop-off-time");
      }
      this.isSelectCar = false;
    },

    /*触发提交数据*/
    updateAirplay(obj) {
      this.form.airplayId = obj.id;
    },
    doAddress() {
      if (this.form.starting.length >= 5) {
        return false;
      }
      this.form.starting.push("1");
    },

    doDelete(index) {
      this.form.starting.splice(index, 1);
    },

    goOrder(item, distance) {
      let dataObj = {
        car: item,
        use_time: this.arrive,
        address: this.form.starting,
        airPlayNumber: this.airPlayNumber,
        airPlayId: this.form.airplayId,
        airPortName: this.airPortName || this.order.address[0],
        cityName: this.cityName,
        flightNo: this.flightNo,
        flyTiem: this.form.flyTiem,
        airType: this.form.type,
        distance: distance,
        currency: this.order.currency,
        extra_ffee: this.order.extra_ffee
      };
      sessionStorage.setItem("airPlaneInfo", JSON.stringify(dataObj));
      this.$router.push({ name: "airOrder" });
    },

    /*查找航班*/
    clickAirplan() {
      if (this.airPlayNumber.trim() === "") {
        this.$message.error(this.$t("yz.null-flight-no"));
        return false;
      }
      if (this.form.flyTiem.trim() === "") {
        this.$message.error(this.$t("yz.null-flight-date"));
        return false;
      }

      this.itemArray = [];
      this.airplanKey = true;
      this.$axios
        .post(this.lang + "/airport-transfer/flight", {
          flightno: this.airPlayNumber,
          date: this.form.flyTiem
        })
        .then(res => {
          if (res.data.status === 1) {
            this.flightShow = true;
            this.itemArray = res.data.data.list;
            this.isLoading = false;
          }
        });
    },

    /*选择航班*/
    selectFly(item) {
      this.airplanKey = false;
      this.airplanTime = false;
      this.flightNo = this.airPlayNumber;
      if (this.arrive && this.form.airplayId && this.form.starting) {
        this.selectCar();
      }
    },
    getToday() {
      let day = new Date();
      day.setTime(day.getTime());
      let today =
        day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
      return today;
    }
  },
  mounted() {
    if (sessionStorage.getItem("airInput")) {
      let airInput = JSON.parse(sessionStorage.getItem("airInput")),
        _this = this;
      this.form.type = airInput.type;
      this.form.airplayId = airInput.airportId;
      this.arrive = airInput.arrive;
      this.form.starting[0] = airInput.airPlace;
      this.airportName = airInput.airportName;

      this.selectCar();
    } else {
      this.airportName = "1";
      this.form.starting[0] = "1";
    }
  }
};
</script>

<style scoped lang="scss">
.custom-btn {
  width: 100%;
  border-radius: 12px;
  color: #fff !important;
  border: transparent;
  background: linear-gradient(#328c6e, #4b9d63);
  box-shadow: 0 2px 20px 0 rgba(51, 51, 51, 0.5);
}

.no-data {
  font-size: 14px;
  text-align: center;
  color: #666;
  padding-top: 100px;
}

.flightNo {
  height: 390px;
  overflow-x: hidden;
  width: 428px;
  padding: 0 30px;
  .img {
    width: 240px;
  }

  .item {
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
  }

  .info {
    width: 240px;
  }

  .btn {
    font-size: 16px;
    color: #38846a;
    text-align: center;
    line-height: 36px;
    font-weight: 530;
    cursor: pointer;
    width: 90px;
    height: 36px;
    border-radius: 24px;
    border: 1px solid rgba(56, 132, 106, 1);
  }
}

.air-list {
  position: absolute;
  background: #fff;
  width: 330px;
  max-height: 300px;
  overflow: auto;
  padding: 10px 0;
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 4px 7px -2px rgba(51, 51, 51, 0.5);
  border-radius: 0px 0px 12px 12px;
  z-index: 100;
  border-top: #4b9d63 2px solid;
  p {
    font-size: 14px;
    color: #333;
    height: 30px;
    line-height: 30px;
    margin: 0;
    padding: 0 10px;
  }
  p:hover {
    cursor: pointer;
    background: rgba(102, 102, 102, 0.1);
  }
}

.custom-btn:hover {
  color: #fff !important;
}
/deep/ {
  .airBox .el-input__inner:focus {
    border: 1px solid #4b9d63;
  }
  .el-input__inner:focus {
    border-bottom: 1px solid #4b9d63;
  }
  p {
    margin: 0;
  }

  .el-dialog__body {
    padding: 2px 20px;
  }

  .el-form-item__label {
    font-size: 14px;
    font-weight: 500;
    color: rgba(102, 102, 102, 1);
    line-height: 20px;
  }

  .el-dialog {
    border-radius: 12px;
    margin-top: 16vh !important;
  }

  .el-input__inner {
    border-width: 0 0 1px 0;
    padding-left: 0;
    border-radius: 0;
  }

  .width .el-input__inner {
    width: 302px;
  }

  .airBox .el-input__inner {
    height: 30px;
    line-height: 30px;
    border-width: 1px;
    padding-left: 10px;
    border-radius: 10px;
    font-size: 14px;
  }

  .el-input__icon {
    line-height: 30px;
  }

  .carData .el-input__inner {
    padding-left: 0;
  }

  .el-input__icon.el-icon-time {
    display: none;
  }
}

.area-code {
  width: 60px;
}

.airplay-box {
  width: 380px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 20px 0 rgba(51, 51, 51, 0.5);
  border-radius: 12px;
  box-sizing: border-box;
  padding: 0 39px 1px;
  margin-left: 30px;

  .top {
    height: 160px;
    .en-width {
      width: 130px;
    }
    .zh-width {
      width: 60px;
    }

    .logo {
      height: 100px;
      margin: auto;
      font-size: 0;
      text-align: center;
      box-sizing: border-box;
      border-top: 2px solid rgba(241, 96, 79, 0);

      img {
        margin-top: 35px;
      }

      p {
        margin-top: 14px;
        height: 22px;
        line-height: 22px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }

      :hover {
        cursor: pointer;
      }
    }

    .active {
      // width: 130px;
      border-top: 2px solid #38846a;

      p {
        color: #38846a;
      }
    }
  }

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

      &:before {
        content: "";
        position: absolute;
        width: 10px;
        height: 10px;
        background: url("../../assets/images/help.png");
        right: -20px;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
    .el-input {
      border: 1px solid red;
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
    color: rgba(241, 96, 79, 1);
    line-height: 30px;
    margin: 10px 0 5px;
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

  /*查询航班样式*/
  .airBox {
    position: absolute;
    top: -30px;
    right: 0;
    width: 176px;
    height: 30px;
    z-index: 9;
  }
}

.select-car {
  position: absolute;
  top: 0px;
  left: 425px;
  width: 800px;
  max-height: 600px;
  min-height: 400px;
  padding: 0 30px;
  overflow: auto;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 20px 0px rgba(51, 51, 51, 0.5);
  border-radius: 12px;
  box-sizing: border-box;
  z-index: 9;

  .header-icon {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #dcdfe6;
    span {
      font-size: 14px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
    }
  }

  .car-Item {
    height: 135px;
    line-height: 120px;
    border-bottom: 1px solid #dcdfe6;
    box-sizing: border-box;
    font-size: 0;
    padding-bottom: 0px;

    .car-pic {
      display: inline-block;
      width: 140px;
      height: 60px;
      vertical-align: middle;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .car-content {
      display: inline-block;
      height: 100%;
      width: 400px;
      padding-top: 30px;
      vertical-align: middle;
      margin-left: 30px;
      box-sizing: border-box;

      .car-name {
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }

      .car-people,
      .car-type {
        height: 25px;
        line-height: 25px;
        font-size: 14px;
        color: rgba(51, 51, 51, 1);
      }
    }

    .car-money {
      display: inline-block;
      text-align: center;
      margin-left: 50px;
      padding-top: 30px;
      height: 100%;
      width: 80px;
      vertical-align: middle;
      box-sizing: border-box;

      .money-money {
        height: 25px;
        font-size: 22px;
        font-weight: 500;
        color: #38846a;
        line-height: 25px;
      }
      .money-btn {
        width: 90px;
        height: 33px;
        line-height: 32px;
        margin: 5px auto 0;
        border-radius: 24px;
        border: 1px solid #38846a;
        font-size: 16px;
        font-weight: 500;
        color: #38846a;
        cursor: pointer;
      }
    }
  }
}

.el-date-editor.el-input.carData {
  width: 100%;
}

.select-car::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.select-car::-webkit-scrollbar-track {
  background: 2px solid #f1ecde;
  border-radius: 8px;
}
.select-car::-webkit-scrollbar-track-piece {
  /*内层轨道，滚动条中间部分（位置4）*/
  border-radius: 2px 2px 0px 0px;
}
.select-car::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 6px;
}
.select-car::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}
.select-car::-webkit-scrollbar-corner {
  background: #f6f6f6;
}

.select-car {
  overflow-y: scroll;
  scrollbar-color: transparent transparent;
  scrollbar-track-color: transparent;
  -ms-scrollbar-track-color: transparent;
}
</style>
