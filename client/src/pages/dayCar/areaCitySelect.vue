<template>
  <div class="place-select">
    <el-input
      readonly
      :placeholder="placeholder"
      @focus="handleCity"
      :class="inputClass"
      v-model="place">
    </el-input>
    <div class="place-box" v-if="isShowSelect">
      <div class="site-list">
        <el-scrollbar :native="false">
          <ul>
            <li
              v-for="(site, index) in siteList"
              @click="selectAddr(site)"
              :key="index">
              <p>{{site.name}}</p>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState } from "vuex";
  export default {
    name: "areaCitySelect",
    props:{
      value:{
        type: String,
        default: '',
      },
      inputClass:{
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '',
      },
      cityId: {
        type: Number,
        default: ''
      },
      isShowAreaCity: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        place: '',
        searchKey: '',
        currentCity: '',
        curretSite: '',
        sourceCities: [],
        resultCities: [], // 城市搜索结果
        //是否显示下拉选择
        isShowSelect: false,
        //是否在选择城市
        isSelectCity: true,

        //地点列表
        siteList: [],
        addrLoading: true,
        showAddress: false, // 显示地址输入
        isShowAddressResult: false, // 是否显示地址搜索结果
        addressList: [] // 地址搜索结果
      }
    },
    methods: {
      handleCity () {
        this.isShowSelect = true;
        this.showAddress = false
      },

      handlerClick(){
        this.isShowSelect = false;
        this.isSelectCity = true;
        this.showAddress = false
      },
     
      selectAddr (city) { // 选择地址
        this.place = city.name;
        this.showAddress = false;
        this.isShowSelect = false;
        this.$emit('getName', city.name);
        this.$emit('getId', city.id);
      },
      getCityArea() {
        this.$axios.get(this.lang + '/tools/city-area?city_id=' + this.cityId).then((res) => {
            this.siteList = res.data.data.list;
        })
      }
    },
    mounted(){
      this.place = this.value;
      this.getCityArea();
    },
    computed:{
      ...mapState({
        lang: state => state.lang
      }),
      cities(){
        return this.sourceCities;    
      },
      isHideSearchResult () {
        return this.searchKey.replace(/\s+/g, "").length === 0
      }
    },
    watch:{
      value(){
        this.place = this.value;
      },
      searchKey () {
        if (!this.searchKey) {
          return;
        }
        this.$axios.get(this.lang+'/tools/keyword-lenovo?keyword=' + this.searchKey).then((res) => {
          this.resultCities = res.data.data.city;
        })
      },
      isShowAreaCity() {
        this.isShowSelect = this.isShowAreaCity;
      }
    }
  }
</script>

<style scoped lang="scss">
  /deep/{
    .el-input-group__prepend {
      border-width: 0 0 1px 0;
      background-color: white;
    }

    .el-scrollbar__wrap{
      max-height:295px;
    }
  }

  .place-select{
    position: relative;

    .place-box{
      position: absolute;
      bottom: 2px;
      left: 0;
      right: 0;
      transform: translateY(100%);
      z-index: 99;
      background:rgba(255,255,255,1);
      box-sizing: border-box;
      box-shadow:1px 4px 7px -2px rgba(51,51,51,0.5);
      border-radius:0px 0px 12px 12px;
      padding: 10px;
      border-top: 2px solid #3B936A;
    }

    .continent-list{
      display: flex;
      justify-content: space-between;

      li{
        cursor: pointer;
        border-bottom: 2px solid transparent;
        line-height: 1.5;
        padding: 5px 0;
        font-size: 14px;

        &.active{
          color: #3B936A;
          border-bottom-color: #3B936A;
        }
      }
    }

    .city-list{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      line-height: 2em;
      margin-top: 10px;

      li{
        width: 33%;
        font-size: 14px;
        color: #333;
        cursor: pointer;

        &.active{
          color: #3B936A;
        }
      }
    }
    .no-city-list {
      color: #9a9a9a;
      text-align: center;
      line-height: 30px;
      font-size: 12px;
      padding: 10px 0;
    }

    .site-list{
      margin: -10px;

      li{
        padding: 5px 12px;
        font-size:14px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:20px;
        border-bottom: 1px solid #ccc;
        cursor: pointer;

        &:hover{
          transition: all .3s linear;
          background:rgba(102,102,102,0.1);
        }

        span{
          font-weight:400;
          font-size: 12px;
          color:rgba(102,102,102,1);
        }
      }
    }
    .address-area {
      width: 100%;
      box-sizing: border-box;
      padding: 5px 10px;
      background-color: #fff;
      border: 1px solid #dfdfdf;
      border-top: none;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      .addr-loading {
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
      .address-list {
        max-height: 100px;
        overflow-x: hidden;
        .address-list-item {
          cursor: pointer;
          border-bottom: 1px solid #efefef;
        }
        .address-list-item:last-child {
          border-bottom: none;
        }
      }
      .no-data {
        line-height: 30px;
        text-align: center;
        color: #9a9a9a;
        font-size: 12px;
      }
    }
  }
</style>
