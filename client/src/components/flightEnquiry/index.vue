<template>
  <div class="contentBox">
  
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "flightEnquiry",
  props: ["itemArray", "flightno", "date"],
  data() {
    return {
      aimArray: []
    };
  },
  computed: {
    ...mapState({
      lang: state => state.lang
    })
  },
  methods: {
    clickAirplan(item) {
      this.$emit("clickSelf", item);
    },
    computedTitle(item) {
      let date = item.split("-");
      let str =
        this.lang == "zh"
          ? date[0] + "年" + date[1] + "月" + date[2] + "日"
          : date[0] + "/" + date[1] + "/" + date[2] + "/";
      return str;
    }
  },
  mounted() {
    this.aimArray = this.itemArray;
  }
};
</script>

<style scoped lang="scss">
.contentBox {
  max-height: 390px;
  overflow-x: hidden;
  padding: 0 30px;

  .img {
    width: 240px;
  }

  .item {
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
  }

  .info {
    width: 240px;
  }

  .btn {
    font-size: 16px;
    color: #38846a;
    text-align: center;
    line-height: 36px;
    font-weight: 530;
    cursor: pointer;
    width: 90px;
    height: 36px;
    border-radius: 24px;
    border: 1px solid rgba(56, 132, 106, 1);
  }
}
</style>
