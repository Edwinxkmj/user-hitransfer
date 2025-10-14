<template>
  <div class="airplay-select" v-clickoutside="handlerClick">
    <!--<slot></slot>-->
    <el-input
      readonly
      :placeholder="placeholder"
      @focus="isShowSelect=true"
      :class="inputClass"
      :title="place"
      v-model="place">
    </el-input>
    <div class="place-box" v-if="isShowSelect">
      <template v-if="isSelectCity">
        <el-input v-model="searchKey"
                  placeholder="支持搜索城市"
                  suffix-icon="el-icon-search">
        </el-input>

        <div class="place-tabs">
          <div class="head">
            <ul class="continent-list">
              <li v-for="continent in continentAndCity"
                  @click="currentContinent=continent.continent"
                  :class="{active: continent.continent === currentContinent}"
                  :key="continent.continent">
                {{continent.continent}}
              </li>
            </ul>
          </div>
          <el-scrollbar wrap-class="list" :native="false">
            <div class="content">
              <ul class="city-list">
                <li v-for="city in cities"
                    @click="handlerSelectCity(city)"
                    :class="{active: city === currentCity}"
                    :key="city">
                  {{city}}
                </li>
              </ul>
            </div>
          </el-scrollbar>
        </div>
      </template>

      <div v-else class="site-list">
        <el-scrollbar
                      :native="false">
          <ul>
            <li
              v-for="site in siteList"
              @click="selectSite(site)"
              :key="site.id">
              <p>{{site.name}}</p>
              <!--<span class="detail">{{site.name}}</span>-->
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
  import Clickoutside from 'element-ui/src/utils/clickoutside'

  export default {
    name: "PlaceSelect",
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
      }
    },
    data() {
      return {
        place: '',
        searchKey: '',
        currentContinent: '热门',
        currentCity: '',
        curretSite: '',
        //是否显示下拉选择
        isShowSelect: false,
        //是否在选择城市
        isSelectCity: true,
        continentAndCity:[
          {
            continent: '热门',
            cities:[]
          },
          {
            continent: '澳大利亚',
            cities:[]
          }
        ],

        /*所有的地点列表*/
        allAirplay: {},

        //地点列表
        siteList: [],
      }
    },
    directives: { Clickoutside },
    methods: {
      /*页面数据初始化*/
      init(){
        this.$axios.get("/api/airport",{}).then(res=>{
          let rspData = res.data.data.list;

          /*处理城市数据*/
          this.doCity(rspData);

        });
      },

      /*做城市数据的处理*/
      doCity(dataArray){
        /*获取数组数据后进行处理
        * 首先根据数据类型筛选城市和机场*/
        let city = [],airplay = {};
        dataArray.forEach((item)=>{
          /*首先判断城市数组中是否包含该城市，如果没有该城市则进行置入*/
          let cityName = item.name.split("-")[0];
          if(city.indexOf(cityName)<0){
            city.push(cityName);
          }
          airplay[cityName] = airplay[cityName]&&airplay[cityName].length>0?airplay[cityName]:[];
          airplay[cityName].push(item);
        });


        this.continentAndCity[0].cities = city;
        this.continentAndCity[1].cities = city;
        this.allAirplay = airplay;

      },


      handlerClick(){
        this.isShowSelect = false;
        this.isSelectCity = true;
      },
      handlerSelectCity(city){
        this.currentCity = city;
        this.place = this.currentCity + ' | ';
        this.isSelectCity = false;

        /*往地点数据组中添加数据*/
        this.siteList = this.allAirplay[city];
      },
      selectSite(site){
        this.place += site.name;

        this.$emit('showAirplay', site);

        this.isShowSelect = false;
        this.isSelectCity = true;
      },
    },
    mounted(){
      // this.init();

      this.place = this.value;
    },
    computed:{
      cities(){
        let result;

        for(let i=0; i<this.continentAndCity.length; i++){
          let continent = this.continentAndCity[i];

          if(continent.continent === this.currentContinent){
            result = continent.cities;
            break;
          }
        }

        return result;
      },
    },
    watch:{
      value(){
        this.place = this.value;
      },

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

  .airplay-select{
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
      border-top: 2px solid #38846A;
    }

    .continent-list{
      display: flex;
      justify-content: space-between;
      margin: 0;
      padding: 0;

      li{
        cursor: pointer;
        border-bottom: 2px solid transparent;
        line-height: 1.5;
        padding: 5px 0;
        border: 1px solid red;

        &.active{
          color: $topic-color;
          border-bottom-color: $topic-color;
        }
      }
    }

    .city-list{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      line-height: 2em;
      margin: 0;

      li{
        // width: 33%;
        cursor: pointer;

        &.active{
          color: $topic-color;
        }
      }
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
  }
</style>
