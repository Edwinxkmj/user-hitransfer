<template>
  <div class="zyHeader">
    <div class="max-wdith">
      <el-col :span="9" class="flex-start">
        <router-link to="/index/home">
          <img class="logo" style="width:152px;" src="../assets/images/logo_eng.png" />
        </router-link>
      </el-col>
       <el-col :span="8" class="text-right">
        <router-link :to="'orderList'" class="color-fff no-underline">My Bookings</router-link>
      </el-col>
      <el-col :span="3" class="text-right">
        <div style="margin-right: 15px;">
          <el-dropdown trigger="click" placement="bottom" @command="triggerDropdown">
            <span class="charteredCar el-dropdown-link cursor">
              <img
                class="wh21 vertical-middle"
                v-if="currency2 == 'USD'"
                src="../assets/images/united.png"
                alt
              />
              <img
                class="wh21 vertical-middle"
                v-if="currency2 == 'CNY'"
                src="../assets/images/china.png"
                alt
              />
              <img
                class="wh21 vertical-middle"
                v-if="currency2 == 'EURO'"
                src="../assets/images/european.png"
                alt
              />
              <span class="el-dropdown-link vertical-middle color-fff fz15 ml5">{{currency2}}</span>
              <i class="el-icon-arrow-down color-fff"></i>
            </span>

            <el-dropdown-menu slot="dropdown" class="downMeu car en-width">
              <el-dropdown-item class="item" command="USD">
                <img class="wh21 vertical-middle" src="../assets/images/united.png" alt />
                <span class="el-dropdown-link curP cursor vertical-middle color-fff fz15 ml5">USD</span>
              </el-dropdown-item>
              <el-dropdown-item class="item" command="CNY">
                <img class="wh21 vertical-middle" src="../assets/images/china.png" alt />
                <span class="el-dropdown-link curP cursor vertical-middle color-fff fz15 ml5">CNY</span>
              </el-dropdown-item>
              <el-dropdown-item class="item" command="EURO">
                <img class="wh21 vertical-middle" src="../assets/images/european.png" alt />
                <span class="el-dropdown-link curP cursor vertical-middle color-fff fz15 ml5">EURO</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
      <el-col :span="4" class="flex-end">
        <div class="user">
          <div v-if="isLogin && userInfo" class="login">
            <div class="headPortrait">
              <img v-lazy="userInfo.img" v-if="userInfo.img" style="width: 100%;height: 100%" />
              <img
                src="../assets/images/user@2x.png"
                v-if="!userInfo.img"
                alt
                style="width: 100%;height: 100%"
              />
            </div>
            <el-dropdown
              class="en-width"
              placement="bottom"
              trigger="click"
              @command="handleCommand"
            >
              <span class="el-dropdown-link curP cursor" style="color: #fff">{{userInfo.email}}</span>
              <el-dropdown-menu slot="dropdown" class="downMeu">
                <router-link to="/index/help">
                  <el-dropdown-item class="item">{{$t('m.help')}}</el-dropdown-item>
                </router-link>
                <el-dropdown-item command="logout" class="item">{{$t('m.logout')}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="curP cursor" v-else>
            <span class="mr10" @click="openLoginBox">{{$t('account.login')}}</span>
            <span class="ml20" @click="openSignUpBox">{{$t('account.sign-up')}}</span>
          </div>
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "zyHeader",
  props: {
    isLogin: {
      type: Boolean,
      default: false
    }
  },
  inject: ["reload"],
  data() {
    return {
      isShow: false,
      showSearch: true,
      pathUrl: "",
      searchValue: "",
      showCityList: [],
      langText: "EN",
      country: [],
      currency2: sessionStorage.getItem("currency") || "USD"
    };
  },
  mounted() {
    this.pathUrl = this.$route.path;
    sessionStorage.setItem("lang", "en");
    this.$store.commit("SET_ACTIVE_PATH", this.$route.path);
    if (sessionStorage.getItem("lang") == "en") {
      this.langText = "中文";
    } else {
      this.langText = "EN";
    }
  },
  methods: {
    ...mapMutations({
      actionLang: "LANG",
      actionCurrency: "CURRENCY"
    }),
    switchLang() {
      if (this.lang === "zh") {
        this.actionLang("en");
      } else {
        this.actionLang("zh");
      }
      sessionStorage.setItem("lang", this.lang);
      this.$i18n.locale = this.lang;
      this.reload();
    },
    goHotPlace(id) {
      this.showSearch = !this.showSearch;
      this.$router.push({ path: "/index/hot-place", query: { id: id } });
    },
    searchCountry() {
      if (!this.searchValue) {
        return;
      }

      this.$axios
        .get(this.lang + "/tools/keyword-lenovo?keyword=" + this.searchValue)
        .then(res => {
          this.country = res.data.data.country;
        });
    },

    /*选择对应的城市*/
    selectItem(item) {
      this.$router.push({ path: "/index/circuit", query: { cityId: item.id } });
      sessionStorage.removeItem("lineCityName");
      this.isSearch();
      this.reload();
    },
    isSearch() {
      this.showSearch = !this.showSearch;
      this.searchValue = "";
    },
    openLoginBox() {
      this.$router.push({ path: "/index/user", query: { type: "login" } });
      this.reload();
    },
    openSignUpBox() {
      this.$router.push({ path: "/index/user", query: { type: "register" } });
      this.reload();
    },
    handleCommand(command) {
      if (command == "logout") {
        this.$emit("logout");
      }
    },
    triggerDropdown(command) {
      this.currency2 = command;
      sessionStorage.setItem("currency", command);
      this.actionCurrency(command);
    }
  },
  computed: {
    ...mapState({
      userInfo: "userInfo",
      lang: state => state.lang,
      currency: state => state.currency
    }),
    getActivePath() {
      return this.$store.state.activePath;
    }
  },
  watch: {
    getActivePath: function(path) {
      this.pathUrl = path;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ {
  .el-dropdown-menu__item:not(.is-disabled):hover {
    color: #fff;
  }
  .popper__arrow {
    display: none;
  }
}
.pt2 {
  position: relative;
  top: 2px;
}
.logo {
  height: 26px;
  position: relative;
  top: 7px;
}
.el-dropdown-menu {
  padding: 0 !important;
  box-shadow: 0 0 5px rgba(51, 51, 51, 0.5);
  a {
    text-decoration: none !important;
  }
}
.zyHeader {
  display: flex;
  justify-content: center;
  height: 60px;
  line-height: 60px;
  background-color: #333333;
  color: rgba(255, 255, 255, 1);
  text-align: center;
  margin: auto;
}

.zyHeader .max-wdith {
  width: 1201px;
}

.zyHeader .flex-start {
  text-align: left;
}

.zyHeader .flex-end {
  text-align: center;
}

.zyHeader .navigation {
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
}

.zyHeader .user {
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}

.zyHeader .user .headPortrait {
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 30px;
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
}

.zyHeader .user .end {
  height: 40px;
  line-height: 40px;
  margin: 10px 0;
  padding-left: 30px;
  text-align: left;
  border-left: 1px solid rgba(255, 255, 255, 1);
}

.zyHeader .navigation a {
  color: #ffffff;
  text-decoration: none;
}

.zyHeader .inputBox {
  position: relative;
}

.zyHeader .inputBox .inputContent {
  position: absolute;
  left: 50%;
  top: 60px;
  transform: translate(-50%, 0);
  z-index: 999;
  width: 100%;
  height: 184px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 4px 7px -2px rgba(51, 51, 51, 0.5);
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  .country-list {
    margin-top: 10px;
    p {
      margin: 3px 0;
      padding: 0 20px;
      line-height: 20px;
      text-align: left;
    }
  }
}

.zyHeader .inputContent .top {
  width: 100%;
  height: 4px;
  background: #38846a;
  box-shadow: 1px 4px 7px -2px rgba(51, 51, 51, 0.5);
}

.zyHeader .inputContent .title {
  height: 170px;
  padding-bottom: 10px;
}

.zyHeader .title .titleContent {
  height: 22px;
  line-height: 22px;
  font-size: 16px;
  padding: 10px 0 0 20px;
  font-weight: 600;
  text-align: left;
  color: rgba(51, 51, 51, 1);
}

.zyHeader .title .titleItem {
  padding: 10px 0;
  height: 137px;
  overflow-x: hidden;
}

.zyHeader .title .titleItem .item {
  line-height: 22px;
  padding-bottom: 10px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  cursor: pointer;
  text-align: left;
}
.zyHeader .title .titleItem .item:hover {
  color: #38846a;
}

.zyHeader .navigation .charteredCar {
  height: 22px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 22px;
  outline: none;
}

.zyHeader .navigation a.colorActive {
  color: #38846a;
}

.en-width {
  width: 120px;
}

.downMeu {
  top: 48px !important;
  line-height: 44px;
  background-color: #333333;
  border-radius: 0;
  border: 0;
  padding: 0;
}

.downMeu .item {
  height: 37px;
  line-height: 37px;
  font-size: 16px;
  color: rgba(255, 255, 255, 1);
}

.downMeu .item a {
  text-decoration: none;
  color: #ffffff;
}

.downMeu .item:hover {
  background: linear-gradient(#328c6e, #4b9d63);
}
</style>
