<template>
  <div id="list">
    <div class="list">
      <div class="flex-between mt20">
        <span class="fz30 color-333">{{$t('wallet.balance')}}</span>
        <div class="btns">
          <span class="white-bg" @click="showAccountList()">{{$t('wallet.withdrawl-records')}}</span>
          <span class="green-bg ml5" @click="goWithdraw()">{{$t('wallet.withdrawl')}}</span>
          <label class="fz30 color-333 ml20">{{wallet.currency + wallet.balance || 0}}</label>
        </div>
      </div>
      <div class="flex-between item-center accout-detail mt30" v-loading="isLoading">
        <span class="fz22 color-333">{{$t('wallet.transactions')}}</span>
        <el-dropdown class="cursor" @command="handleCommand" trigger="click">
          <span class="el-dropdown-link">
            <i
              style="font-size: 20px;position: relative;top:2px;"
              class="el-icon-arrow-down el-icon-s-fold"
            ></i>
            {{$t('wallet.refine')}}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command>{{$t('wallet.all')}}</el-dropdown-item>
            <el-dropdown-item
              v-for="item in walletLog.typeList"
              :key="item.key"
              :command="item.key"
            >{{item.value}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div v-if="walletLog.list">
        <div class="no-content text-center mt60" v-if="walletLog.list.length == 0">
          <img src="../assets/images/car-service.png" alt />
          <p class="fz12 color-green">{{$t('wallet.no-records')}}</p>
        </div>
      </div>

      <div
        class="list-item flex-between item-center"
        v-for="(item,index) in walletList"
        :key="index"
      >
        <div class="flex-between">
          <span
            class="fz16 type"
            :class="{'color-green': item.type==$t('account.income'), 'color-orange': item.type==$t('account.withdraw') || item.type==$t('account.expenses')}"
          >{{item.type}}</span>
          <div>
            <p class="fz16 color-333 fw550">{{item.title}}</p>
            <p class="fz14 color-333 mt15">{{$t('wallet.order-number')}}：{{item.out_trade_no}}</p>
            <p class="fz14 color-999">{{item.create_time}}</p>
          </div>
        </div>
        <div class="text-left">
          <p
            class="fz16"
            :class="{'color-green': item.type==$t('account.income'), 'color-orange': item.type==$t('account.withdraw') || item.type==$t('account.expenses')}"
          >{{item.money}}</p>
          <p class="fz14 color-666 mt20">{{$t('wallet.balance')}}：{{item.balance}}</p>
        </div>
      </div>

      <div
        class="load-more cursor mt30"
        v-if="nextPage && walletList.length > 0"
        @click="loadMore()"
      >
        <span class="fz12 color-666">
          {{$t('order.more')}}
          <i class="el-icon-arrow-down"></i>
        </span>
      </div>
      <br />
      <br />
      <!-- <pagination v-if="walletLog.next_page" :current-page.sync="currentPage" :total="listTotal"></pagination> -->
      <div class="mt30"></div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import pagination from "@/components/pagination/index";
export default {
  name: "list",
  components: { pagination },
  data() {
    return {
      isLoading: true,
      walletLog: {},
      nextPage: "",
      walletList: []
    };
  },
  computed: {
    ...mapState({
      lang: state => state.lang
    })
  },
  props: ["wallet"],
  mounted() {
    this.getWalletLog("");
  },
  methods: {
    goWithdraw() {
      if (this.wallet.balance && this.wallet.balance > 0) {
        this.$router.push({ name: "withdraw" });
      } else {
        this.$message.warning(this.$t("wallet.no-withdraw"));
      }
    },
    showAccountList() {
      this.$emit("showAccountEvent", false);
    },
    getWalletLog(type) {
      this.$axios.get(this.lang + "/wallet/log?type=" + type).then(res => {
        this.walletLog = res.data.data;
        this.isLoading = false;
        this.walletList = res.data.data.list;
        this.nextPage = res.data.data.next_page ? res.data.data.next_page : "";
        console.log(this.nextPage);
      });
    },
    loadMore() {
      this.$axios.get(this.nextPage).then(
        res => {
          this.isLoading = false;
          this.walletList = this.walletList.concat(res.data.data.list);
          this.nextPage = res.data.data.next_page
            ? res.data.data.next_page
            : "";
        },
        () => {
          this.isLoading = false;
        }
      );
    },
    handleCommand(command) {
      this.getWalletLog(command);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ {
  .el-dropdown-menu__item:hover {
    color: #4b9d63 !important;
  }
}
.list {
  padding: 20px 30px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  margin-top: 20px;
  min-height: 500px;
  .btns {
    span {
      display: inline-block;
      border-radius: 16px;
      font-size: 16px;
      text-align: center;
      height: 32px;
      line-height: 32px;
      cursor: pointer;
      padding: 0 15px;
    }
    .white-bg {
      border: 1px solid #38846a;
      color: #38846a;
      // width: 106px;
    }
    .green-bg {
      background: linear-gradient(#328c6e, #4b9d63);
      color: #fff;
      width: 74px;
    }
  }
  .accout-detail {
    padding: 10px 0;
  }
  .list-item {
    border-bottom: 1px solid #dcdcdc;
    padding: 20px 0;
    .type {
      display: inline-block;
      width: 120px;
    }
    p {
      margin: 0;
    }
  }
  .list-item:first-child {
    border-top: 1px solid #dcdcdc;
  }

  .load-more {
    text-align: center;
    height: 35px;
    line-height: 35px;
    background: #e5e8e7;
  }
  .load-more:hover {
    background: #e1f1e6;
  }
  .load-more:hover i {
    color: #4b9d63;
  }
}
</style>


