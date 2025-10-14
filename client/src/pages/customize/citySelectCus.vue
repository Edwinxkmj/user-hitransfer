<template>
  <div class="place-select" >
     <div class="tag cursor" @click="handleCity">
      <span v-if="place.length == 0" class="tips fz16 color-999">{{$t('m.destinations-pl')}}</span> 
      <el-tag size="small"  v-on:click.stop.prevent="handlerClick" @click="deleteTag(item)" effect="plain" v-for="(item,index) in place" :key="index">{{item}}<i class="el-icon-close"></i></el-tag>
    </div>

    <div class="place-box" v-if="isShowSelect">
      <template v-if="isSelectCity">
        <el-input v-model="searchKey"
                  :placeholder="$t('m.search-city-privete')"
                  suffix-icon="el-icon-search">
        </el-input>

        <div v-if="isHideSearchResult" class="place-tabs">
          <div class="head">
            <ul class="continent-list">
              <li v-for="(continent, index) in continentAndCity"
                  @click="currentContinent=continent.continent"
                  :class="{active: continent.continent === currentContinent}"
                  :key="index"
                >
                {{continent.continent}}
              </li>
            </ul>
          </div>
          <el-scrollbar wrap-class="list" :native="false">
            <div v-if="cities.length > 0" class="content">
              <ul class="city-list">
                <li v-for="(city, index) in cities"
                    @click="selectAddr(city)"
                    :class="{active: city.id === currentCity}"
                    :key="index">
                  {{city.name}}
                </li>
              </ul>
            </div>
            <div v-else class="no-city-list">
              {{$t('m.no-data')}}
            </div>
          </el-scrollbar>
        </div>
        <div v-else>
          <ul v-if="resultCities.length > 0" class="city-list">
            <li v-for="(city, index) in resultCities"
                @click="selectAddr(city)"
                :class="{active: city.id === currentCity}"
                :key="index">
              {{city.name}}
            </li>
          </ul>
          <div v-else class="no-city-list">
             {{$t('m.no-data')}}
            </div>
        </div>
      </template>
    </div> 
  </div>
</template>
<script>
  import { mapState } from "vuex";
  export default {
    name: "CitySelect",
    props:{
      sourceCities: {
        type: Array,
        default: () => []
      },
      continentAndCity: {
        type: Array,
        default: () => []
      },
      cityIds: {
        type: Array,
        default: () => []
      },
      cityName: {
        type: Array,
        default: () => []
      },
      isShowCity: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        place: [],
        placeIds: [],
        searchKey: '',
        currentContinent: '热门',
        currentCity: '',
        curretSite: '',
        resultCities: [], 
        isShowSelect: false,
        isSelectCity: true,
        cityList: [],
        siteList: [],
        addrLoading: true,
        showAddress: false, 
      }
    },
    methods: {
      handleCity (event) {
        this.isShowSelect = true;
        this.showAddress = false;
        event.preventDefault();
      },

      handlerClick(){
        this.isShowSelect = false;
        this.isSelectCity = true;
        this.showAddress = false
      },
      selectAddr (city) { 
        
      if(this.place.length < 5) {
        this.place.map((item, index)=> {
          if (item == city.name) {
              this.place.splice(index, 1);
              this.placeIds.splice(index, 1);
          }
        })

        this.place.push(city.name);
        this.placeIds.push(city.id);
      }else {
        this.$message({
          message: this.$t('m.maximux5'),
          type: "warning"
        });
      }
        this.showAddress = false;
        this.isShowSelect = false;
        this.$emit('getCityName',  this.place);
        this.$emit('getCityIds', this.placeIds);
      },

      deleteTag(name, event) {
        this.place.map((i, index) =>{
          if(i == name) {
            this.place.splice(index, 1);
            this.placeIds.splice(index, 1);
          }
        })
      }
    },
    mounted(){
      if (this.cityIds.length > 0) {
        this.place = this.cityName;
        this.placeIds = this.cityIds;
      }
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
      searchKey () {
         if (!this.searchKey) {
          return;
        }
        this.$axios.get(this.lang+'/tools/keyword-lenovo?keyword=' + this.searchKey).then((res) => {
          this.resultCities = res.data.data.city;
        })
      },
      isShowCity() {
        this.isShowSelect = this.isShowCity;
      }
    }
  }
</script>

<style scoped lang="scss">
.tag {
  border: 1px solid #DCDFE6;
  border-radius: 12px;
  padding-left: 10px;
}

.tag .tips {
  display: inline-block;
  width: 100%;
}

  /deep/{
    .el-tag  {
      margin-right: 8px;
      border-radius: 12px;
      border: 1px solid #DCDFE6;
      color: #606266;
    }

    .el-tag--plain .el-tag__close { color: #606266; }
    
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
