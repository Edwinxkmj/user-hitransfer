<template>
  <div class="circuit-chartered" v-loading="isLoading">
    <div class="banner"></div>
    <div class="content">
      <div class="search-box">
        <el-input :placeholder="$t('m.search-destination')" v-model="keyword">
          <i @click="getDataList()" slot="suffix" class="el-input__icon el-icon-search color-green"></i>
        </el-input>
      </div>
      <div class="classify-box">
        <classify-list
          :list="cityList"
          itemName="name"
          :cityid="cityId"
          v-model="city"
          :title="$t('m.hot')"
        ></classify-list>
        <classify-list :list="themeList" itemName="name" v-model="theme" :title="$t('m.theme')"></classify-list>
        <classify-list :list="dayList" itemName="title" v-model="days" :title="$t('m.days')"></classify-list>
      </div>
      <div class="sort-methods">
        <div
          class="cursor"
          :class="{active: sortType == ''}"
          @click="sortFn('')"
        >{{$t('m.synthesize')}}</div>
        <div class="cursor" :class="{active: sortType == 'sale'}" @click="sortFn('sale')">
          {{$t('m.sales')}}
          <span class="caret">
            <span class="el-icon-caret-top"></span>
            <span class="el-icon-caret-bottom"></span>
          </span>
        </div>
        <div class="cursor" :class="{active: sortType == 'price'}" @click="sortFn('price')">
          {{$t('m.price')}}
          <span class="caret">
            <span class="el-icon-caret-top"></span>
            <span class="el-icon-caret-bottom"></span>
          </span>
        </div>
      </div>
      <div class="place-list">
        <div class="flex-wrap">
          <div v-for="(place,idx) in placeList" :key="idx">
            <div @click="doPlaceNumber(place)">
              <place-card :place="place" style="margin-bottom: 30px"></place-card>
            </div>
          </div>
        </div>
      </div>
      <pagination v-if="listTotal > 0" :current-page.sync="currentPage" :total="listTotal"></pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import classifyList from "@/components/classifyList/index";
import pagination from "@/components/pagination/index";
import placeCard from "@/components/placeCard/index";

export default {
  name: "chartered",
  components: { classifyList, pagination, placeCard },
  data() {
    return {
      cityList: [],
      themeList: [],
      dayList: [],
      keyword: "",
      city: "{}",
      theme: "{}",
      days: "{}",
      placeList: [],
      currentPage: 1,
      isLoading: true,
      listTotal: 0,
      dayList: [
        { title: this.$t('m.day-filter1'), value: 1 },
        { title: this.$t('m.day-filter2'), value: 2 },
        { title: this.$t('m.day-filter3'), value: 3 }
      ],
      sort: "",
      sortType: "",
      cityId: ""
    };
  },
  computed: {
    ...mapState({
      lang: state => state.lang
    })
  },
  methods: {
    getDataList(param) {
      this.$axios
        .get(this.lang + "/charter", {
          params: {
            city_id: JSON.parse(this.city).id || this.cityId,
            theme: JSON.parse(this.theme).value || "",
            keyword: this.keyword.trim() || "",
            sort: this.sort || "",
            days: JSON.parse(this.days).value || "",
            page: this.currentPage
          }
        })
        .then(rsp => {
          this.isLoading = false;
          if (param == "init") {
            this.cityList = rsp.data.data.city;
            this.themeList = rsp.data.data.theme;
          }

          this.placeList = rsp.data.data.list;
          this.listTotal = rsp.data.data.total;
      
        });
    },

    sortFn(type) {
      this.sortType = type;
      if (type == "sale") {
        if (this.sort != "sales_asc") {
          this.sort = "sales_asc";
        } else {
          this.sort = "salse_desc";
        }
      } else if (type == "price") {
        if (this.sort != "price_asc") {
          this.sort = "price_asc";
        } else {
          this.sort = "price_desc";
        }
      } else {
        this.sort = "";
      }
      this.getDataList();
    },

    /*选择地点后进行详情页面的跳转*/
    doPlaceNumber(item) {
      this.$router.push({
        path: "carDetails",
        query: { id: item.id, score: item.score, num: item.num }
      });
    }
  },
  /*初始化的操作*/
  mounted() {
    this.cityId = this.$route.query.cityId;
    if (sessionStorage.getItem("lineCityName")) {
      this.keyword = sessionStorage.getItem("lineCityName");
    }

    this.getDataList("init");
    window.scrollTo(0, 0);
  },
  watch: {
    city() {
      this.keyword = "";
      this.cityId = "";
      if (typeof(this.city) == 'number') {
        this.city = '{}';
      }
      this.currentPage = 1;
      this.getDataList();
    },
    theme() {
      this.currentPage = 1;
      this.cityId = "";
      if (typeof(this.theme) == 'number') {
        this.theme = '{}';
      }
      this.getDataList();
    },
    days() {
      this.currentPage = 1;
      this.cityId = "";
        if (typeof(this.days) == 'number') {
        this.days = '{}';
      }
      this.getDataList();
    },
    currentPage() {
       this.getDataList();
       window.scrollTo(0, 290);
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ {
  .el-input__inner:focus {
    border: 1px solid #4b9d63;
  }
}
 .el-card {
    border: 1px solid transparent;
  }
.circuit-chartered {
  margin: 0 0 90px;
}
.banner {
  width: 100%;
  height: 300px;
  background: url("../../assets/images/xianlubaoche_banner.png") no-repeat
    center;
  background-size: cover;
}

.place-list {
  position: relative;
  top: 10px;
  .flex-wrap::after {
    content: ' ';
    width: 386px;
  }
}

.content {
  width: 1200px;
  margin: auto;

  .search-box {
    width: 1000px;
    margin: auto;
    transform: translateY(-50%);

    /deep/ {
      .el-input__inner {
        height: 70px;
        line-height: 70px;
        border-radius: 12px;
        box-shadow: 0px 3px 20px 0px rgba(204, 204, 204, 1);
        padding: 0 70px;
        font-size: 16px;
      }

      .el-input__suffix {
        padding: 0 30px;
        cursor: pointer;
      }

      .el-icon-search {
        font-size: 24px;
        font-weight: bold;
      }
    }
  }

  .classify-box {
    width: 100%;
    border-radius: 12px;
    border: 1px solid rgba(204, 204, 204, 1);
    padding: 0 10px;
    box-sizing: border-box;

    /deep/ {
      .classify {
        &:not(:last-child) {
          border-bottom: 1px solid rgba(204, 204, 204, 0.5);
        }
      }
    }
  }

  .sort-methods {
    display: flex;
    justify-content: flex-end;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: rgba(102, 102, 102, 1);
    line-height: 22px;
    padding: 15px 0;

    > div {
      margin: 0 20px;
      display: flex;
      align-items: center;

      &:last-child {
        margin-right: 0;
      }

      &.active {
        color: #38846a;
      }

      .caret {
        display: inline-flex;
        position: relative;
        width: 24px;
        height: 20px;

        span {
          position: absolute;
          font-size: 14px;
          cursor: pointer;

          &.el-icon-caret-top {
            top: 0;
          }

          &.el-icon-caret-bottom {
            bottom: 0;
          }
        }
      }
    }
  }
}
</style>
