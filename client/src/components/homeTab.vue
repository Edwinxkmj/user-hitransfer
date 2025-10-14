<template>
  <div id="tab">
    <el-col :span="4">
      <div class="tab-head">
        <div :class="{'active-border': tabType==1}" @click="bindTab(1)">
          <img class="tab1" v-if="tabType==1" src="../assets/images/tab-active2.png" alt>
          <img class="tab1" v-else src="../assets/images/tab2.png" alt>
          <span>{{$t('m.pick-up')}}</span>
        </div>
        <div :class="{'active-border1': tabType==2}" @click="bindTab(2)">
          <img class="tab2" v-if="tabType==2" src="../assets/images/tab-active1.png" alt>
          <img class="tab2" v-else src="../assets/images/tab1.png" alt>
          <span>{{$t('m.drop-off')}}</span>
        </div>
      </div>
    </el-col>

    <el-col class="search-btn" :span="6">
    </el-col>
    <!-- 接机 -->
    <div class="tab-content air" v-if="tabType==1">
        <select-airport @airportId="getAirPortId" @airportName="getAirportName" class="ml50" style="width: 320px;"></select-airport>
        <img style="width: 36px;height:13px;" class="ml30" src="../assets/images/air-arrow.png" alt>
        <search-address style="width: 400px" :address="pickUp.airPlace" @inputAddress="getInputAddress" :airportCity="airportCity" :placeholder="tipinfo"></search-address>
        <!-- <el-autocomplete
          style="width: 400px"
          class="inline-input"
          v-model="pickUp.airPlace"
          :fetch-suggestions="querySearchAsync"
          :placeholder="tipinfo"
          clearable
          :title="pickUp.airPlace"
        ></el-autocomplete> -->
        <span class="line">|</span>
        <el-date-picker
          v-model="airArrive"
          type="datetime"
          style="width: 300px"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          :placeholder="airTimeInfo"
          prefix-icon="el-icon-date"
        ></el-date-picker>
        <div class="search-btn">
           <el-button type="danger" @click="goAirplane(1)">{{$t('m.home-tab-book')}}</el-button>
        </div>
    </div>
    <!-- 送机 -->
    <div class="tab-content air" v-if="tabType==2">
      <!-- <el-autocomplete
        style="width: 350px"
        class="inline-input ml50"
        v-model="dropOff.airPlace"
        :fetch-suggestions="querySearchAsync"
        :placeholder="tipinfo"
        :title="pickUp.airPlace"
        clearable
      ></el-autocomplete> -->
      <search-address class="inline-input ml50" style="width: 350px" :address="dropOff.airPlace" @inputAddress="getInputAddress2" :airportCity="airportCity" :placeholder="tipinfo"></search-address>
      <img style="width: 36px;height:13px;" src="../assets/images/air-arrow.png" alt>
      <select-airport @airportId="getAirPortId2" @airportName="getAirportName" style="width: 350px;"></select-airport>
      <span class="line">|</span>
      <el-date-picker
        v-model="dropOffDate"
        type="datetime"
        style="width: 300px"
        format="yyyy-MM-dd HH:mm"
        value-format="yyyy-MM-dd HH:mm"
        :placeholder="airTimeInfo"
        prefix-icon="el-icon-date"
      ></el-date-picker>
      <div class="search-btn">
        <el-button type="danger"  @click="goAirplane(2)">{{$t('m.home-tab-book')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import selectAirport from './selectAirport';
import searchAddress from './searchAddress';

export default {
  name: 'tab',
  components: { selectAirport, searchAddress },
  props: ['cities'],
  data() {
    return {
      tabType: 1,
      tipinfo: this.$t('m.address-hotel-name2'),
      airTimeInfo: this.$t('m.pick-up-time'),
      date: '',
      airArrive: '',
      dropOffDate: '',
      pickUp: {
        airportId: '',
        airPlace: '',
        arrive: '',
      },
      dropOff: {
        airportId: '',
        airPlace: '',
        arrive: '',
      },
      arrive: "",
      restaurants: [],
      airports: [],
      airportName: '',
      airportCity: ''
    };
  },
  computed: {
      ...mapState({
        lang: state => state.lang
      })
  },
  mounted() {
      this.getAirport();
  },
  methods: {
    getAirPortId(id) {
      this.pickUp.airportId = id;
    },
    getAirportName(name) {
      this.airportName = name;
    },
    getAirPortId2(id) {
      this.dropOff.airportId = id;
    },
    getInputAddress(address) {
       this.pickUp.airPlace = address;
    },
    getInputAddress2(address) {
      this.dropOff.airPlace = address;
    },
    bindTab(type) {
      this.tabType = type;
    },
    getAirport() {
       this.$axios.get('en/tools/airport').then((res)=> {
        this.airports = res.data.data;
      })
    },
    goAirplane(type) {
      let data = '';
      if (type == 2) {
         if (!this.dropOff.airportId) {
         this.$notify.error(this.$t('yz.null-airport'));
          return;
        }else if(!this.dropOff.airPlace) {
          this.$notify.error(this.$t('yz.null-adress'));
          return;
        }else if(!this.dropOffDate) {
          this.$notify.error(this.$t('yz.null-use-time'));
          return;
        }
      }else {
          if(!this.pickUp.airPlace) {
            this.$notify.error(this.$t('yz.null-adress'));
            return;
          }else if (!this.pickUp.airportId) {
            this.$notify.error(this.$t('yz.null-airport'));
            return;
          }else if(!this.airArrive) {
            this.$notify.error(this.$t('yz.null-use-time'));
            return;
          }
      }
      
      if (type == 1) {
        this.pickUp.arrive = this.airArrive;
        this.pickUp.type = type;
        data = this.pickUp;
      }else {
        this.dropOff.arrive = this.dropOffDate;
        this.dropOff.type = type;
        data = this.dropOff;
      }
      data.airportName = this.airportName;
      sessionStorage.setItem('airInput', JSON.stringify(data));
      this.$router.push({'name': 'airplane'});
    },
    getToday() {
      let day = new Date();
      day.setTime(day.getTime());
      let today = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
      return today;
    },
  },
  watch: {
    // airArrive() {
    //   if(this.airArrive && new Date(this.getToday()).getTime() > new Date(this.airArrive).getTime()){
    //     this.$message({ message: this.$t('yz.less-today'), type: "warning"});
    //     this.airArrive = "";
    //   }    
    // },
    // dropOffDate() {
    //    if(this.dropOffDate && new Date(this.getToday()).getTime() > new Date(this.dropOffDate).getTime()){
    //     this.$message({ message: this.$t('yz.less-today'), type: "warning"});
    //     this.dropOffDate = "";
    //   }  
    // }
  }
};
</script>

<style scoped lang="scss">
/deep/ {
  .el-select:hover .el-input__inner {
      border: 1px solid transparent;
  }
  .el-input__inner {
      border: 1px solid transparent;
  }

  input::-webkit-input-placeholder {
    font-size: 15px !important;
  }
  input::-moz-input-placeholder {
    font-size: 15px !important;
  }
  input::-ms-input-placeholder {
    font-size: 15px !important;
  }
}

.search-btn {
  position: relative;
  z-index: 10;
  .el-button {
    width: 230px;
    height: 76px;
    background: linear-gradient(#328C6E,#4B9D63);
    color: #fff;
    text-align: center;
    font-size: 18px;
    margin-left: 50px;
    margin-right: 5px;
    border-radius: 6px;
  }

  .el-button:hover { color: #fff !important; }

  .el-button--danger { border-color: transparent; }
}

.city-adress {
    .el-select {
      position: relative;
      width: 420px;
    }
  }

.el-select:hover .el-input__inner {
  border: transparent;
}
.tab {
  position: relative;
}

.inputContent {
  position: relative;
  margin-top: -94px;
  margin-left: 90px;
  z-index: 9;
  width: 618px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 4px 7px -2px rgba(51, 51, 51, 0.5);
  border-radius: 0 0 12px 12px;

  .top {
    width: 100%;
    height: 4px;
    background: #3e9468;
    box-shadow: 1px 4px 7px -2px rgba(51, 51, 51, 0.5);
  }

  .title {
    padding-bottom: 10px;
    font-size: 15px;

    .titleContent { 
      text-align: left;
      padding: 10px 20px 0 20px; 
    }

    .titleItem {
      padding: 10px 20px 0;
      overflow-x: hidden;
    }

    .titleItem .item {
      line-height: 22px;
      padding-bottom: 10px;
      font-size: 15px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      cursor: pointer;
      text-align: left;
    }
  }
}

.line-car img {
  width: 31px;
  height: 32px;
}

.tab-content {
  position: relative;
  display: flex;
  z-index: 9999;
  align-items: center;
  width: 1200px;
  height: 90px;
  line-height: 90px;
  background: #fff;
  border-radius: 8px;
  border-top-left-radius: 0;
}

// 接送机
.air {
  img {
    display: inline-block;
    height: 18px;
    margin: 0 20px;
  }

  .line {
    margin: 0 20px;
    color: #38846A;
  }

  .el-icon-date {
    font-size: 20px;
    color: #666;
    margin-top: 3px;
  }

  .air-type.el-select {
    width: 530px;
    position: relative;
    font-size: 18px;
  }
  .airport.el-select {
     width: 800px;
  }
}

#home /deep/ .el-input__inner {
  -webkit-box-shadow: none;
  box-shadow: none;
}

// .tab-head
.tab-head {
  display: flex;
  width: 434px;
  height: 70px;
  line-height: 70px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  color: #fff;
  background: rgba($color: #000000, $alpha: 0.3);
  margin-top: 1px;

  .active {
    background: #fff;
    color: #373635;
  }

  .active-border {
    background: #fff;
    color: #373635;
    border-top-left-radius: 8px;
  }

  .active-border1 {
    background: #fff;
    color: #373635;
    padding-right: 20px;
    border-top-right-radius: 8px;
  }

  div {
    width: 208px;
    text-align: center;
    font-size: 16px;

    image {
      vertical-align: middle;
    }

    :hover {
      cursor: pointer;
    }

    span {
      margin-left: 5px;
    }

    .tab1 {
      width: 35px;
      height: 22px;
    }

    .tab2 {
      width: 35px;
      height: 22px;
    }
  }
}
</style>


