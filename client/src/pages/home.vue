<template>
  <div id="home">
    <!--banner-->
    <div class="banner">
      <div class="banner-content">
        <h1>Find your ride instantly</h1>
        <el-col>
          <Tab :cities="sourceCities"></Tab>
        </el-col>

        <div class="down-btn">
          <img src="../assets/images/down.png" class="cursor down-animation" @click="scrollTop" />
        </div>
      </div>
    </div>

    <!--map-->
    <div class="map">
      <div class="nameTitle">
        <div class="border left" style="border-color:#9a9a9a;"></div>
        <div class="titleContent" style="color: #333333">{{$t('m.globalRoutes')}}</div>
        <div class="border right" style="border-color:#9a9a9a;"></div>
      </div>

      <!--内容-->
      <div class="content">{{$t('p.globalRoutes')}}</div>

      <div class="mapPic">
        <img v-if="lang == 'zh'" src="../assets/images/map.png" alt />
        <img v-if="lang == 'en'" src="../assets/images/map-en.png" alt />
      </div>
    </div>
  </div>
</template>

<script>
import Tab from "../components/homeTab.vue";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "home",
  components: {
    Tab: Tab
  },
  data() {
    return {
      value5: 3.5,
      interval: 5000,
      charterRouteList: [],
      hotCityList: [],
      scrollY: 0,
      sourceCities: [],
      isLoading: true,
      currency: "",
      screenH: window.screen.height
    };
  },
  computed: {
    ...mapState({
      lang: state => state.lang
    })
  },
  mounted() {
    this.$store.commit("SET_ACTIVE_PATH", this.$route.path);
    // this.getCity();
  },
  methods: {
    ...mapActions({
      getCityList: "getCityList"
    }),
    getCity() {
      this.$axios.get(this.lang + "/tools/popular").then(res => {
        this.sourceCities = res.data.data.list;
      });
    },
    goCircuit(id) {
       this.$router.push({'path' :'/index/circuit', 'query': {cityId: id}});
    },

    scrollTop() {
      let timer = setInterval(() => {
        this.scrollY += 40;
    
        if (this.scrollY >= this.screenH-210) {
          this.scrollY = this.screenH-210;
          clearInterval(timer);
        }
      
        window.scrollTo(0, this.scrollY);
      }, 20);

      this.scrollY = 0;
    },

    doClick(item) {
      sessionStorage.setItem("cityId", JSON.stringify(item.id));
      this.$router.push({ name: "hotPlace" });
    },

    doPlaceNumber(item) {
      this.$router.push({
        path: "carDetails",
        query: { id: item.id, score: item.score, num: item.num }
      });
    }
  }
};
</script>

<style lang="scss">
.address .el-carousel__container {
  width: 1350px;
}

.review {
  width: 1000px;
  margin: 50px auto 0px auto;

  img {
    width: 155px;
    height: 70px;
    cursor: pointer;
  }
}

#home {
  margin: auto;
  position: relative;

  /deep/ {
    .air-type .el-input__inner {
      padding-left: 57px;
    }
    .el-input__inner {
      height: 70px;
      border: 0;
      border-radius: 12px;
    }
  }
}

#home {
  position: relative;
}

#home .banner {
  background-image: url("../assets/images/airportbg.jpg");
  background-size: cover;
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: center;
  height: 739px;
  text-align: center;
  margin: auto;
}

.descript {
  height: 40px;
}

.banner .banner-content {
  width: 1201px;
  justify-content: flex-start;
}

.banner .banner-content h1 {
  text-align: left;
  font-size: 54px;
  font-weight: normal;
  color: #fff;
  padding-top: 13vh;
}

.banner .down-btn {
  position: relative;
  top: 200px;
  animation: down 3s infinite;
}

@keyframes down {
  0% {
    top: 200px;
    opacity: 1;
  }
  50% {
    top: 210px;
    opacity: 0.5;
  }
  100% {
    top: 200px;
    opacity: 1;
  }
}

.banner .down-btn image {
  width: 69px;
  height: 40px;
}

#home .address {
  height: 780px;
  box-sizing: border-box;
  padding-top: 80px;

  .el-carousel--horizontal {
    display: flex;
    justify-content: center;
  }
}

#home .address .contentItem {
  width: 285px;
  height: 456px;
  margin: 0 10px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
}

#home .address .contentPic {
  height: 358px;
}

#home .address .contentPic img {
  width: 100%;
  height: 100%;
}

#home .address .contentText {
  padding: 20px;
  background: #f7f8f9;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

#home .address .contentText p {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: #222;
}

#home .address .contentText span {
  margin-top: 10px;
  display: block;
  font-size: 16px;
  font-weight: 400;
  color: #737373;
}

#home .charteredCar .content {
  width: 1220px;
  display: flex;
  flex-wrap: wrap;
}

.charteredCar .line-item {
   .content::after {
      content: ' ';
      width: 390px;
      margin: 0 auto ;
   }
}

#home .charteredCar .contentItem {
  width: 386px;
  margin: 0 10px;
  border-radius: 10px;
  background: rgba(247, 248, 249, 1);
  cursor: pointer;
  margin: auto;
}

#home .charteredCar .contentPic img {
  width: 386px;
  height: 250px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

#home .charteredCar .contentItem:hover {
  background: #333;
  animation: bg ease-in-out 1s 1 alternate forwards;
}
#home .charteredCar .contentItem:hover .hover-w {
  color: #ffffff;
}

@keyframes bg {
  from {
    background: #333;
    opacity: 0.8;
  }
  to {
    background: #333;
    opacity: 1;
  }
}

#home .map {
  padding-top: 100px;
}

#home .map .content {
  width: 900px;
  margin: 60px auto 0;
  line-height: 30px;
  font-size: 20px;
  color: #666;
}

#home .map .mapPic {
  margin: 60px auto;
  width: 1201px;
  height: 630px;
}

#home .map .peopleT {
  width: 1024px;
  margin: 30px auto 0;
  border-bottom: 3px solid #cccccc;
  position: relative;
}

#home .map .peopleT .item {
  position: absolute;
  width: 117px;
  left: 50%;
  transform: translate(-50%, 0);
  border-bottom: 3px solid #f1604f;
}

#home .map .peopleName {
  margin: 30px auto 10px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  font-size: 22px;
  font-weight: 400;
  color: rgba(44, 44, 44, 1);
}

#home .map .start {
  width: 140px;
  height: 40px;
  line-height: 40px;
  margin: auto;
  font-size: 0;
  text-align: center;
}

#home .nameTitle {
  height: 75px;
  position: relative;
}

#home .nameTitle .border {
  width: 300px;
}

#home .nameTitle .titleContent {
  height: 75px;
  line-height: 75px;
  text-align: center;
  font-size: 30px;
  color: #ffffff;
}

#home .nameTitle .border.left {
  position: absolute;
  left: 50%;
  transform: translate(-264px, 0); /* 50%为自身尺寸的一半 */
  -webkit-transform: translate(-264px, 0);
  border-bottom: 1px solid #ffffff;
}

#home .nameTitle .border.right {
  position: absolute;
  left: 50%;
  transform: translate(-36px, 0); /* 50%为自身尺寸的一半 */
  -webkit-transform: translate(-36px, 0);
  border-top: 1px solid #ffffff;
}
</style>
