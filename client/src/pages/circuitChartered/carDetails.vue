<template>

  <div class="car-details">
    <div class="topBanner" v-loading="isLoading">
      <div class="left">
        <img :src="imgList[0]" />
      </div>
      <div class="right">
        <img :src="imgList[1]" />
        <img :src="imgList[2]" />
        <img :src="imgList[3]" />
        <img :src="imgList[4]" />
      </div>
    </div>
    
    <div class="contentBox">
      <!--左侧的内容-->
      <div class="left">
       
        <p class="title" v-if="itemObj.info">{{itemObj.info.title}}</p>
        <p class="iconBox" v-if="itemObj.info">
          <i class="el-icon-location-information"></i>&nbsp;&nbsp;
          <span>{{itemObj.info.country}}，{{itemObj.info.city}}</span>
          <img src="../../assets/images/time_slices.png" />&nbsp;&nbsp;
          <span>{{itemObj.info.hours}} {{$t('m.hours')}}</span>
        </p>

        <div class="xinChenBox mt40">
          <p class="borderW">{{$t('m.trip-characteristics')}}</p>
          <p class="content" v-if="itemObj.info">{{itemObj.info.descript}}</p>
        </div>
        
        <div class="border" v-if="showCarData.length > 0"></div>
        <div class="carShowBox" v-if="showCarData.length > 0">
          <div class="borderW">{{$t('m.car-type2')}}</div>
          <div class="content">
            <div class="car">
              <div v-for="item in showCarData" :key="item.id">
                <div class="flex">
                   <img class="carImg" v-lazy="item.img" />
                  <div class="txt">
                    <span>{{item.name}}</span>
                    <p v-if="lang == 'zh'">人数：最多{{item.people}}人 &ensp; 行李：{{item.luggage}}</p>
                    <p v-if="lang == 'en'"> <i class="el-icon-user-solid"></i> {{item.people}} &ensp;  <i class="el-icon-s-goods ml20"></i> {{item.luggage}}</p>
                    <p v-if="lang=='zh'">参考车型：{{item.model}}或其他同等级车</p>
                    <p v-if="lang=='en'">{{item.model}}corolla or similar</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="carTitle">
              <img src="../../assets/images/tick.png" />
              <span>{{$t('m.driver-tips1')}}</span>
              <img src="../../assets/images/tick.png" />
              <span>{{$t('m.driver-tips2')}}</span>
              <img src="../../assets/images/tick.png" />
              <span>{{$t('m.driver-tips3')}}</span>
              <img v-if="lang == 'zh'" src="../../assets/images/tick.png" />
              <span v-if="lang == 'zh'">{{$t('m.driver-tips4')}}</span>
            </div>
          </div>
        </div>
           
        <div v-if="itemObj.schedule">
           <div class="border" v-if="itemObj.schedule.length > 0"></div>
            <div class="riChenBox" v-if="itemObj.schedule.length > 0"> 
    
            <div class="borderW">{{$t('m.tour-schedule')}}</div>
            <div class="content">
              <div class="dayItem" v-for="(item,index) in itemObj.schedule" :key="index">
                <div class="title">
                  <div class="dayTitle">DAY{{index+1}}</div>
                  <div class="timeAddress">
                    {{item.city}}
                    <span
                      style="color: #666666;margin-left: 10px; font-weight:400;"
                    >({{item.distance}}km)</span>
                  </div>
                </div>
                <div class="whereGo" v-for="(day,idx) in item.schedule" :key="idx">
                  <div class="left">
                    <div class="time">{{day.start_time}}</div>
                    <div class="logo">
                      <img
                        style="width: 20px;height: 20px;z-index: 1;background-color: #fff;"
                        src="../../assets/images/beginEnd.png"
                      />
                      <div class="line"></div>
                    </div>
                  </div>
                  <div class="right">
                    <div class="txt">{{day.descript || ''}}</div>
                    <div class="imgBox">
                      <img v-lazy="img" v-for="(img,index) in day.img_list" :key="index" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       
       <div v-if="itemObj.viewpoints">
          <div class="border" v-if="itemObj.viewpoints.length > 0"></div>
          <div class="borderW mt30" v-if="itemObj.viewpoints.length > 0">{{$t('m.attractions')}}</div> 
          <div class="mt30" v-if="itemObj.viewpoints.length > 0"></div>
       </div>
       
       <div id="mapDom" :class="{'show-map': showMap, 'hide-map': !showMap}" style="height: 430px;width:720px"></div>  
        <div class="flex view-points-card p-relative cursor">
          <div v-for="(item, index) in itemObj.viewpoints" :key="index" :class="{'ml10': index > 0}" @click="initBaiduMap(itemObj.viewpoints, index)">
              <img v-lazy="item.img" alt="">
              <p class="view-points-text flex-between">
                <span class="fz14 color-fff">{{item.title}}</span>
                <label class="fz14 color-fff" v-if="lang == 'zh'">第{{item.station}}站</label>
                <label class="fz14 color-fff" v-if="lang == 'en'">{{item.station}}</label>
              </p>
          </div>
        </div>

        <div class="border" ></div>
        <div class="fuWuLiuChen">
          <div class="borderW">{{$t('m.service-process')}}</div>
          <div class="content">
            <div class="item">
              <img src="../../assets/images/orderImg1.png" />
              <p class="itemTxt">{{$t('p.book-tip1')}}</p>
            </div>
            <div class="leftLogo">
              <img src="../../assets/images/nextStep.png" />
            </div>
            <div class="item">
              <img src="../../assets/images/notification.png" />
              <p class="itemTxt">{{$t('p.book-tip2')}}</p>
            </div>
            <div class="leftLogo">
              <img src="../../assets/images/nextStep.png" />
            </div>
            <div class="item">
              <img src="../../assets/images/dialog.png" />
              <p class="itemTxt">{{$t('p.book-tip3')}}</p>
            </div>
            <div class="leftLogo">
              <img src="../../assets/images/nextStep.png" />
            </div>
            <div class="item">
              <img src="../../assets/images/pickup.png" />
              <p class="itemTxt">{{$t('p.book-tip4')}}</p>
            </div>
            <div class="leftLogo">
              <img src="../../assets/images/nextStep.png" />
            </div>
            <div class="item">
              <img src="../../assets/images/landscape.png" />
              <p class="itemTxt">{{$t('p.book-tip5')}}</p>
            </div>
            <div class="leftLogo">
              <img src="../../assets/images/nextStep.png" />
            </div>
            <div class="item">
              <img src="../../assets/images/house.png" />
              <p class="itemTxt">{{$t('p.book-tip6')}}</p>
            </div>
          </div>
        </div>

        <div v-if="itemObj.comment">
              <div class="border" v-if="itemObj.comment.total != 0"></div>
              <!--用户评论-->
              <div class="pingLunBox" v-if="itemObj.comment.total != 0">
                <div class="borderW">
                  <div>{{$t('m.reviews')}}</div>
                  <!-- <div class="allPingLun">
                    查看全部评论（{{itemObj.comment.total}}）
                    <i
                      style="margin-left: 5px"
                      class="el-icon-arrow-right"
                    ></i>
                  </div> -->
                </div>
                <div class="content">
                  <div class="item" v-for="(item,index) in itemObj.comment.list.slice(0,commentNum)" :key="index">
                    <div class="imgBox">
                      <img style="width: 100%;height: 100%" v-lazy="item.img" />
                    </div>
                    <div class="textBox">
                      <div class="text">
                        <p>{{item.comment}}</p>
                      </div>
                      <div class="nameBox">
                        {{item.username}}
                        <el-rate
                          style="margin-left:15px;display: inline-block;vertical-align: middle"
                          disabled
                          :colors="['#F9BD4F', '#F9BD4F', '#F9BD4F']"
                          v-model="item.score"
                        ></el-rate>
                      </div>
                      <p class="time">{{item.year}}，{{item.month}}<span v-if="lang == 'zh'">月</span></p>
                    </div>
                  </div>
                  <div class="all-comment" v-if="itemObj.comment.total > 6" @click="commentNum = 10"><span class="fz20 color-333">{{$t('m.view-all-reviews')}} <i style="margin-left: 5px" class="el-icon-arrow-right" ></i></span></div>
                </div>
              </div>
        </div>

        <div class="border"></div>

        <div class="feiYongBox">
          <div class="borderW">{{$t('help.excess')}}</div>
          <div class="feeInclude">
            <p class="title">• {{$t('p.inclusions')}}</p>
            <p class="content" v-if="itemObj.info">{{itemObj.info.fee_include}}</p>
          </div>
          <div class="feeNoInclude">
            <p class="title color-orange">• {{$t('p.exclusions')}}</p>
            <p class="content" v-if="itemObj.info">{{itemObj.info.fee_no_include}}</p>
          </div>
        </div>

        <div class="border"></div>
        <!--该退规则-->
        <div class="gaiTuiBox">
          <div class="borderW">{{$t('help.refund-policay2')}}</div>
          <div class="content" v-if="itemObj.info">{{itemObj.info.refund}}</div>
        </div>

        <div class="border"></div>
        <!--注意事项-->
        <div class="zhuYiBox">
          <div class="borderW">{{$t('help.announcements')}}</div>
          <div class="content" v-if="itemObj.info">{{itemObj.info.tips}}</div>
        </div>
      </div>
       
      <!--右侧的表单-->
      <div class="form-right" v-if="itemObj.info">
        <div :class="{'postion': scrollTop >= 650 && scrollTop < scrollH - 250}">
          <div class="carForm">
            <p class="title">{{carPrice ? carPrice :itemObj.currency + itemObj.info.price}} <span v-if='lang == "zh"'>/车</span><span v-if='lang == "en"'>per car</span></p>
            <div class="startBox">
              <el-rate
                :value="itemObj.info.score"
                :colors="['#F9BD4F','#F9BD4F','#F9BD4F']"
                disabled
              ></el-rate>
              <span class="ml5">{{itemObj.info.experience_num}}{{$t('order.sold')}}</span>
            </div>
            <div class="border"></div>
            <div class="itemBox">
              <p class="header">{{$t('m.dates')}}</p>
              <el-date-picker
                @change="selectCar"
                v-model="date"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                :placeholder="$t('m.dates-pl')"
              ></el-date-picker>
            </div>

            <div class="itemBox">
              <p class="header">{{$t('m.car-type-select')}}</p>
              <el-select
                v-model="carId"
                style="width: 100%"
                :placeholder="$t('m.car-type-select')"
                @change="displayCar"
              >
                <el-option
                  v-for="(item,idx) in carList.cars"
                  :key="idx"
                  :value="item.id"
                  :label="item.name+'   ' + item.people+' '+$t('m.people')+'     ' + item.luggage"
                >
                  <span style="float: left">{{item.name}}</span>
                  <span class="ml10">{{item.people}}{{$t('m.people')}}</span>
                  <span class="ml10">{{item.luggage}}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{carList.currency}}{{item.price}}</span>
                </el-option>
              </el-select>
            </div>
            <div class="btn" @click="doOrder">{{$t('m.book-order')}}</div>
          </div>
          <div class="xyBox ml10">
            <img class="wh30 vertical-middle" src="../../assets/images/custom.png" />
            <span class="fz16 color-333 ml10">
              {{$t('p.customer-tips')}}<br v-if="lang=='en'">
              <label @click="goCustimize" class="fz16 color-green cursor" :class="lang=='en'?'ml45 underline':''"> {{$t('p.customized')}}</label>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!--推荐-->
    <div class="tuiG">
      <div class="title">
        <div class="border"></div>
        <span style="margin: 0 30px">{{$t('m.recommended')}}</span>
        <div class="border"></div>
      </div><br><br>
      <div class="content">
        <el-carousel arrow="always" height="252px" >
          <el-carousel-item v-for="(items,idx) in recomment" :key="idx">
             <div class="flex-center">
              <div
                class="itemBox"
                v-for="(item,index) in items"
                :key="index"
                @click="goCircuit(item.id)"
              >
                <div class="contentPic">
                  <img v-lazy="item.img" />
                </div>
                <div class="contentText fz16">
                  <p class="fz16 color-333">{{item.title}}</p>
                  <!-- <p class="color-green text-center">{{item.price}}</p> -->
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "carDetails",
  data() {
    return {
      orderNumber: "",
      trapImg: "",
      itemObj: {},
      carList: {},
      showCarData: [],
      date: "",
      carId: "",
      pingLunShowNumber: 1,
      xingYKey: true,
      commentNum: 6,
      isShowPersonBox: false,
      isLoading: true,
      scrollTop: 0,
      lineId: '',
      imgList: [],
      carPrice: '',
      showMap: false,
      score: '',
      num: '',
      scrollH: 0,
      recomment: [],
      styles: {
        postion: 'relative',
        top: 0 + 'px'
      }
    };
  },
  inject: ["reload"],
  methods: {
    init() {
      this.lineId = this.$route.query.id;
      window.scrollTo(0, 0);
    
      this.$axios.get(this.lang+"/charter/detail?id=" + this.lineId).then(res => {
          let _this = this;
          this.isLoading = false;
          this.itemObj = res.data.data;
          this.imgList = res.data.data.info.img_list ? res.data.data.info.img_list: ['', '', '', '', ''];
          this.carPrice = res.data.data.currency + res.data.data.info.price;
          this.score = res.data.data.info.score;
          this.num = res.data.data.info.experience_num;

          let array = [];
          res.data.data.recomment.forEach((item, index) => {
            if (array.length === 4 || res.data.data.recomment.length === index + 1) {
              array.push(item);
              this.recomment.push(array);
              array = [];
            } else {
              array.push(item);
            }
          });
          
          if (res.data.data.viewpoints.length > 0) {
            this.showMap = true;
            setTimeout(()=> {
               _this.initBaiduMap(res.data.data.viewpoints, 0);
            },1000)
          }
      });
    },
    goCircuit(id) {
       this.$router.push({'path' :'/index/carDetails', 'query': {id: id}});
       this.reload();
    },
    initBaiduMap(points, index) {
      var map = new BMap.Map('mapDom');     
      var point = new BMap.Point(points[index].lng, points[index].lat); 
      map.centerAndZoom(point, 15); 
      var marker = new BMap.Marker(point);// 创建标注
    	map.addOverlay(marker); 
    },
    selectCar(){
      if (!this.date) {
        return;
      }
      this.$axios.post(this.lang+'/charter/price', {date: this.date, charter_id: this.lineId}).then((res) => {
        this.carList = res.data.data;
      })
    },
    displayCar() {
      let car = this.carList.cars.filter((item) => item.id == this.carId);
      this.showCarData = car;
      this.carPrice = this.carList.currency + car[0].price;
    },
    goCustimize() {
      this.$router.push({ name: "customize" });
    },
    getToday() {
        let day = new Date();
        day.setTime(day.getTime());
        let today = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
        return today;
    },
    doOrder() {
      if (this.date === "") {
        this.$message.warning(this.$t('yz.null-dates'));
        return false;
      }else if (this.carId === "") {
        this.$message.warning(this.$t('yz.null-car-type'));
        return false;
      }

      let data = {
        use_time: this.date,
        car_id: this.carId,
        charter_id: this.lineId,
        info: this.itemObj.info,
        car: this.showCarData[0],
        img: this.imgList[0],
        num: this.num,
        score: this.score,
        currency: this.carList.currency,
        extra_ffee: this.carList.extra_ffee
      };

      sessionStorage.setItem('charterInfo', JSON.stringify(data))
      this.$router.push({'path': 'charter-order'});
    },
  },
  created() {
    window.onscroll = () => {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      this.scrollTop = scrollTop;
      this.scrollH = document.documentElement.scrollHeight - 1060;
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapState({
      lang: state => state.lang
    }),
    bottomList() {
      let dataArray = [],
        array = [];
      if (this.itemObj.recommendList) {
        this.itemObj.recommendList.forEach(item => {
          array.push(item);
          if (array.length === 4) {
            dataArray.push(array);
            array = [];
          }
        });

        dataArray.push(array);
      }

      return dataArray;
    }
  },
  watch: {
      date() {
      if(this.date && new Date(this.getToday()).getTime() > new Date(this.date).getTime()){
          this.$message({ message: this.$t('yz.less-today'), type: "warning"});
          this.date = "";
      }
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ {
  .el-input__inner:focus {
    border: 1px solid #4B9D63;
  }
   .el-select .is-focus .el-input__inner:focus {
    border: 1px solid #ccc;
  }
  .el-rate__icon {
    font-size: 16px;
    margin-right: 0 !important;
  }

  .tuiG .el-carousel__arrow--right {
    right: 20px;
  }

  .startBox > div {
    padding-top: 0 !important;
  }

  .itemBox .el-input__inner {
    width: 100%;
    height: 50px;
    line-height: 50px;
  }

  .borderW {
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    border-left: 4px solid #38846a;
    font-size: 22px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }
}
.all-comment {
  width: 314px;
  height: 68px;
  line-height: 68px;
  text-align: center;
  border-radius: 34px;
  margin: auto;
  margin-top: 70px;
  margin-bottom: 100px;
  border: 2px solid rgba(102,102,102,1);
  cursor: pointer;
}
.show-map {
  display: show;
}
.hide-map {
  display: none;
}

.drop-box {
  position: absolute;
  top: 100px;
  left: 16px;
  width: 330px;
  border: 1px solid #cccccc;
  border-top: 2px solid #38846a;
  margin: -12px;
  padding: 21px;
  box-sizing: border-box;
  background-color: #ffffff;

  > span:last-child {
    float: right;
    color: #38846a;
    cursor: pointer;
    margin: 10px 0;
  }

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > span:first-child {
      font-size: 14px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }

    /deep/ {
      .el-input-number {
        width: 100px;

        .el-input__inner {
          padding-left: 30px;
          padding-right: 30px;
          border: 0;
        }

        .el-input-number__decrease,
        .el-input-number__increase {
          top: 9px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: transparent;
          color: #38846a;
          border: 1px solid #38846a;
          line-height: 22px;
        }
      }
    }
  }
}

.car-details {
  min-height: 1000px;
  padding-bottom: 172px;
  background-color: #ffffff;
  overflow: hidden;

  .topBanner {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: auto;
    font-size: 0;
    background-color: #333333;

    .left {
      width: 50%;
      height: 600px;
      margin-right: 8px;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .right {
      width: 50%;
      height: 600px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: space-between;
      img {
        width: 49.5%;
        height: 296px;
      }
    }
  }

  .contentBox {
    padding-top: 10px;
    width: 1200px;
    margin: auto;
    display: flex;
    justify-content: space-between;

    .left {
      width: 730px;
      padding: 0;
      p {
        margin: 15px 0;
      }

      .title {
        font-size: 30px;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }

      .iconBox {
        margin-top: 10px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        img {
          width: 16px;
          height: 16px;
          vertical-align: sub;
        }

        span {
          margin-right: 40px;
        }
      }

      .xinChenBox {
        margin-top: 30px;

        .content {
          padding: 20px 0 0 40px;
          font-size: 16px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
      }

      .carShowBox {
        margin-top: 60px;

        .content {
          .car {
            padding: 20px 0 0 40px;
            display: flex;
            flex-wrap: nowrap;

            .carImg {
              width: 188px;
              height: 80px;
              background-color: white;
            }

            .txt {
              margin-left: 40px;

              span {
                display: inline-block;
                font-size: 16px;
                font-weight: 600;
                color: rgba(51, 51, 51, 1);
                border: 1px solid #666666;
                padding: 3px 8px;
                margin-bottom: 5px;
              }

              p {
                font-size: 16px;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                margin: 5px 0;

                &:first-child {
                  margin-top: 5px;
                }
              }
            }
          }

          .carTitle {
            margin-top: 40px;
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);

            img {
              width: 16px;
              height: 16px;
              vertical-align: sub;
            }

            span {
              margin-right: 50px;
            }
          }
        }
      }

      .riChenBox {
        margin-top: 60px;

        .content {
          .dayItem {
            margin-top: 20px;

            .title {
              display: flex;
              flex-wrap: nowrap;
              margin-bottom: 24px;

              .dayTitle {
                width: 137px;
                height: 30px;
                line-height: 30px;
                background: linear-gradient(#328c6e, #4b9d63);
                border-radius: 0 12px 12px 0;
                text-align: center;
                font-size: 16px;
                font-weight: 600;
                color: rgba(255, 255, 255, 1);
              }

              .timeAddress {
                margin-left: 33px;
                height: 30px;
                line-height: 30px;
                font-size: 16px;
                font-weight: 600;
                color: #333333;
              }
            }

            .whereGo {
              display: flex;
              flex-wrap: nowrap;

              .left {
                display: flex;
                flex-wrap: nowrap;
                width: 137px;

                .time {
                  margin-left: 36px;
                  font-size: 14px;
                  font-weight: 400;
                  color: rgba(51, 51, 51, 1);
                }

                .logo {
                  margin-left: 25px;
                  width: 20px;
                  height: 100%;
                  position: relative;

                  img {
                    position: absolute;
                    top: 0;
                  }

                  .line {
                    margin: auto;
                    width: 1px;
                    height: 100%;
                    background-color: #cccccc;
                    opacity: 0.5;
                  }
                }
              }

              .right {
                width: 560px;
                margin-left: 33px;
                text-align: left;
                padding-bottom: 20px;

                .txt {
                  font-size: 14px;
                  font-weight: 600;
                  color: rgba(51, 51, 51, 1);
                  line-height: 20px;
                }

                .imgBox {
                  margin-top: 10px;

                  img {
                    margin-right: 10px;
                    width: 250px;
                    height: 160px;
                  }
                }
              }
            }
            .whereGo:last-child {
              .line {
                 background-color: #fff;
              }
            }
          }
        }
      }
        .view-points-card {
          width: 730px;
          position: relative;
          top: 10px;
          overflow-x: auto;
          overflow-y: hidden;
          img {
              width: 200px;
              height: 140px;
              border-radius: 12px;
              box-shadow: 0 0 10px #ccc;
            }
          }
          .view-points-text {
            width: 180px;
            height: 41px;
            line-height: 41px;
            position: absolute;
            bottom: -10px;
            padding: 0 10px;
            background:linear-gradient(360deg,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0) 100%);
            border-radius: 0 0 12px 12px;
          }

          ::-webkit-scrollbar {
              width: 2px;
              height: 4px;
              background-color: #4b9d63;
          }

          ::-webkit-scrollbar-thumb {
              background-color: #ccc;
          }

      .fuWuLiuChen {
        margin-top: 40px;

        .content {
          display: flex;
          flex-wrap: nowrap;
          margin-top: 20px;

          .item {
            width: 140px;

            img {
              width: 80px;
              height: 80px;
            }

            .itemTxt {
              font-size: 13px;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
              text-align: center;
            }
          }

          .leftLogo {
            width: 50px;
            height: 80px;
            line-height: 80px;
            text-align: center;
          }
        }
      }

      /*评论盒子*/
      .pingLunBox {
        padding-top: 40px;

        .borderW {
          display: flex;
          justify-content: space-between;

          .allPingLun {
            font-size: 16px;
            font-weight: 400;
            color: rgba(72, 72, 72, 1);
            cursor: pointer;
          }
        }

        .content {
          .item {
            position: relative;
            margin-top: 20px;
            padding-left: 40px;

            .imgBox {
              position: absolute;
              left: 0;
              top: 30px;
              width: 80px;
              height: 80px;
              border-radius: 40px;
              overflow: hidden;
            }

            .textBox {
              padding: 30px 96px 30px 84px;
              width: 686px;
              background: rgba(255, 255, 255, 1);
              box-shadow: 0 2px 20px 0 rgba(51, 51, 51, 0.15);
              border-radius: 12px;
              box-sizing: border-box;

              .text {
                font-size: 14px;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                line-height: 20px;

                p {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 4;
                }
              }

              .nameBox {
                margin-top: 20px;
                font-size: 16px;
                font-weight: 500;
                color: rgba(51, 51, 51, 1);
              }

              .time {
                font-size: 14px;
                font-weight: 400;
                color: rgba(102, 102, 102, 1);
              }
            }
          }
        }
      }

      .feiYongBox {
        margin-top: 80px;

        .feeInclude {
          padding: 20px 0 0 20px;
          .title {
            font-size: 16px;
            font-weight: 600;
            color: rgba(120, 161, 125, 1);
          }

          .content {
            padding: 10px 0 0 20px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 20px;
          }
        }

        .feeNoInclude {
          margin-top: 10px;
          padding: 20px 0 0 20px;
          .title {
            font-size: 16px;
            font-weight: 600;
          }

          .content {
            padding: 10px 0 0 20px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 20px;
          }
        }
      }

      .gaiTuiBox {
        margin-top: 80px;

        .content {
          padding: 20px 0 0 40px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 20px;
        }
      }

      .border {
        margin-top: 40px;
        height: 1px;
        background-color: #ddd;
      }

      .zhuYiBox {
        margin-top: 40px;

        .content {
          padding: 20px 0 0 40px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 20px;
        }
      }
    }

    .form-right {
      position: relative;
      top: 30px;
      width: 360px;
      z-index: 100;

      .postion {
        position: fixed;
        top: 20px;
        height: 540px;
      }

      .carForm {
        padding: 20px;
        width: 340px;
        border-radius: 12px;
        text-align: left;
        background: #fff;
        border: 1px solid rgba(204, 204, 204, 0.8);

        .title {
          color: #333333;
          font-weight: 600;
          line-height: 22px;
        }

        .startBox {
          margin-top: 5px;
          height: 20px;
          line-height: 20px;
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          color: #999999;
          font-size: 14px;
        }

        .border {
          margin-top: 20px;
          height: 1px;
          background-color: #cccccc;
        }

        .itemBox {
          margin-top: 20px;

          .header {
            font-size: 14px;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 20px;
            margin-bottom: 10px;
          }
        }

        .btn {
          margin-top: 40px;
          height: 48px;
          line-height: 48px;
          background: linear-gradient(#328c6e, #4b9d63);
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          letter-spacing: 2px;
        }
      }

      .xyBox {
        width: 380px;
        margin-top: 20px;
        height: 20px;
        line-height: 20px;
        color: #999999;
      }
    }
  }

  .tuiG {
    margin-top: 120px;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #666;

      .border {
        width: 300px;
        height: 1px;
        background-color: rgba(102,102,102,1);
      }
    }

    .content {
      width: 1230px;
      margin: auto;
      position: relative;

      .itemBox {
        border: 1px solid transparent;
        .contentPic {
          width: 224px;
          height: 224px;
          margin: 0 10px;
          cursor: pointer;
        }
        .contentPic img {
          width: 224px;
          height: 224px;
        }
        .contentText {
            p {
              margin: 5px 0;
              font-weight: 500;
              color: rgba(51, 51, 51, 1);
              overflow: hidden;
              width: 200px;
              padding: 0 10px;
              text-overflow: ellipsis;
              white-space: nowrap;
              text-align: center;
            }
          }
      }
    }
  }
}
</style>
