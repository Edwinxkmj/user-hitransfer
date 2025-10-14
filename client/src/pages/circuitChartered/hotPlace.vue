<template>
    <div v-loading="isloading">
        <div class="banner">
            <img v-lazy="country.img" alt="">
            <h3>{{country.name}}</h3>
        </div>
        <div class="content">
            <div class="search-box">
                <el-input :placeholder="$t('m.search-destination')" v-model="keyword">
                <i @click="doSearch" slot="suffix" class="el-input__icon el-icon-search color-green"></i>
                </el-input>
            </div>
            <div class="title">
                <span @click="goPath('circuit')">{{$t('m.charter-tours')}}</span>
                <span @click="goPath('daycar')">{{$t('m.day-car')}}</span>
                <span @click="goPath('airplane')">{{$t('m.airport-transfers')}}</span>
                <span @click="goPath('appointment')">{{$t('m.reserve-car')}}</span>
            </div>
            <div class="address">
                <div class="nameTitle">
                    <div class="border left" style="border-color: #9a9a9a"></div>
                    <div class="titleContent" style="color: #333333">{{$t('m.popularDes')}}</div>
                    <div class="border right" style="border-color: #9a9a9a"></div>
                </div>
                <el-carousel
                    height="372px"
                    indicator-position="none"
                    :interval="interval"
                    style="margin-top: 50px;"
                >
                    <el-carousel-item v-for="(items,idx) in hotCityList" :key="idx">
                    <div class="content flex-center">
                        <div class="contentItem" v-for="(item,index) in items" :key="index" @click="goCircuit(item.name)">
                            <div class="contentPic"> 
                                <img v-lazy="item.img" style="height: 372px">
                                <div class="text">
                                    <p>{{item.name}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    </el-carousel-item>
                </el-carousel>
            </div>

            <div class="charteredCar" v-loading="isloading">
                <div class="nameTitle">
                    <div class="border right" style="border-color: #9a9a9a"></div>
                    <div class="titleContent" style="color: #333333">{{$t('m.topCharter')}}</div>
                    <div class="border left" style="border-color: #9a9a9a"></div>
                </div>
                <div class="flex-center">
                    <div class="content" style="margin-top: 30px">
                    <div
                        class="contentItem"
                        style="margin-top: 20px"
                        @click="doPlaceNumber(item)"
                        v-for="(item,index) in line"
                        :key="index"
                    >
                        <div class="contentPic">
                            <img v-lazy="item.img">
                        </div>
                        <div class="pd20">
                        <div class="fz20 color-333 fw500 csssubstring-w-350 hover-w">{{item.title}}</div>
                        <div class="fz16 color-666 mt15 hover-w" :title="item.descript">{{item.substr}}</div>
                        <div class="mt20 flex-between">
                            <span class="color-999 fz14 hover-w">
                            <i class="el-icon-location-information"></i>
                            {{item.country}}，{{item.city}}
                            </span>
                            <span class="hover-w fz16 fw500 color-green">{{item.price_text}}</span>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
    name: 'hotPlace',
    data() {
        return {
            keyword: '',
            countryId: '',
            line: [],
            hotCityList: [],
            interval: 8000,
            isloading: true,
            country: {}
        }
    },
    computed: {
        ...mapState({
            lang: state => state.lang
        })
    },
    mounted() {
        this.countryId = this.$route.query.id;
        this.getCharterInfo();
    },
    methods: {
        getCharterInfo() {
            this.$axios.get(this.lang+'/charter/country?id='+this.countryId).then((res) => {
                this.isloading = false;
                this.line = res.data.data.list;
                this.country = res.data.data.country;
                
                let array = [];
                res.data.data.city.forEach((item, index) => {
                    if (array.length === 2 || res.data.data.city.length === index + 1) {
                        array.push(item);
                        this.hotCityList.push(array);
                        array = [];
                    } else {
                        array.push(item);
                    }
                });
            })
        },
        doPlaceNumber(item) {
            this.$router.push({path:'carDetails', query: {id: item.id, score: item.score, num: item.num}})
        },
        goCircuit(name) {
            sessionStorage.setItem("lineCityName", name);
            this.$router.push({ name: "circuit" });
        },
        doSearch() {
            if (!this.keyword) {
                return;
            }
           sessionStorage.setItem("lineCityName", this.keyword);
           this.$router.push({ name: "circuit" }); 
        },
        goPath(path) {
            sessionStorage.removeItem("lineCityName");
            this.$router.push({'name': path});
        }
    }
}
</script>
<style lang="scss" scoped>
.banner {
    position: relative;
    height: 380px;
  
    img {
        width: 100%;
        height: 380px;

    }
    h3 {
       position: absolute;
       top: 40%;
       left: 48%;
       transform: translate(-50%, -50%);
       font-size: 40px;
       color: #fff;
       font-weight: normal;
       letter-spacing: 4px;
       background: rgba(51,51,51,0.2);
       padding: 10px 20px;
    }
}
.address {
  width: 1440px;
  padding-top: 20px;
  margin-right: 100px;
  margin-bottom: 20px;
  position: relative;
  right: 100px;
   
  .nameTitle {
      margin-bottom: 140px;
  }
  .contentItem:hover {
      opacity: .9;
  }
  .contentItem {
    width: 480px;
    height: 358px;
    border-radius: 10px;
    cursor: pointer;
    }
    .contentPic {
        position: relative;
        height: 358px;
        img {
            width: 480px;
            height: 100%;
        }
        .text {
            position: absolute;
            top: 0;
            width: 480px;
            height: 358px;
            background: rgba(51,51,51,0.2);
            p {
                width: 480px;
                font-size: 36px;
                font-weight: normal;
                text-align: center;
                color: #fff;
                margin-top: 150px;
            }
        }
    }
}
.charteredCar  {
   margin: auto; 
  .nameTitle {
      margin-bottom: 100px;
  }
  .content {
    width: 1220px;
    display: flex;
    flex-wrap: wrap;
  }
  .flex-center {
      margin-bottom: 80px;
  }
  .contentItem {
    width: 386px;
    margin: 0 5px;
    border-radius: 10px;
    background: rgba(247, 248, 249, 1);
    cursor: pointer;
  }
  .contentPic img {
    width: 386px;
    height: 250px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  .contentItem:hover {
      background: #ffbd3c;
      animation: bg ease-in-out 1s 1 alternate forwards;
    }
   .contentItem:hover .hover-w {
        color: #ffffff;
   }
}
@keyframes bg {
  from {
    background: #ffbd3c;
    opacity: 0.8;
  }
  to {
    background: #ffbd3c;
    opacity: 1;
  }
}

.content {
    width: 1200px;
    margin: auto;

    .search-box{
        width: 1000px;
        margin: auto;
        transform: translateY(-50%);

        /deep/{
            .el-input__inner:focus {
                border: 1px solid #4B9D63;
            }
            .el-input__inner{
                height:70px;
                line-height: 70px;
                border-radius: 12px;
                box-shadow:0px 3px 20px 0px rgba(204,204,204,1);
                padding: 0 70px;
                font-size: 16px;
            }

            .el-input__suffix{
                padding: 0 30px;
                cursor: pointer;
            }

            .el-icon-search{
                font-size: 24px;
                font-weight: bold;
            }
        }
    }
    .title {
        width: 680px;
        margin: auto;
        span {
            color: #293340;
            display: inline-block;
            width: 154px;
            border-radius: 17px;
            height: 34px;
            line-height: 34px;
            font-size: 16px;
            text-align: center;
            margin-left: 10px;
            cursor: pointer;
            border: 1px solid #CCCCCC;
        }
        span:hover {
            background: linear-gradient(360deg,rgba(75,157,99,1) 0%,rgba(50,140,110,1) 100%);
            color: #fff;
        }
    }
    .nameTitle {
        height: 75px;
        position: relative;
        top: 70px;
    }
    .nameTitle .border {
        width: 300px;
    }
    .nameTitle .titleContent {
        height: 75px;
        line-height: 75px;
        text-align: center;
        font-size: 30px;
        font-family: "Microsoft YaHei";
        color: #ffffff;
    }
    .nameTitle .border.left {
        position: absolute;
        left: 50%;
        transform: translate(-264px, 0); /* 50%为自身尺寸的一半 */
        -webkit-transform: translate(-264px, 0);
        border-bottom: 1px solid #ffffff;
    }
    .nameTitle .border.right {
        position: absolute;
        left: 50%;
        transform: translate(-36px, 0); /* 50%为自身尺寸的一半 */
        -webkit-transform: translate(-36px, 0);
        border-top: 1px solid #ffffff;
    }

}
</style>



