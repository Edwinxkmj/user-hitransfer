<template>
  <div id="zyFooter">
    <div class="bg">
      <div class="flex-between content">
        <div>
          <!-- <p class="fw550">{{$t('help.term')}}</p> -->
          <p @click="goHelp(1)">{{$t('help.fee-descriptions')}}</p>
          <p @click="goHelp(2)">Privacy Policy</p>
          <!-- <p @click="goHelp(3)">{{$t('help.refund-policay')}}</p> -->
        </div>
        <div>
          <!-- <p class="fw550">{{$t('help.website')}}</p> -->
          <p @click="goHelp(5)">{{$t('help.about-us')}}</p>
          <p @click="goHelp(4)">{{$t('help.user')}}</p>
        </div>
        <div>
          <p @click="goHelp(6)">{{$t('help.website')}}</p>
          <!-- <p class="fw550">{{$t('help.help')}}</p>
          <p class="btn_udesk_im">{{$t('help.online-chat')}}</p>-->
        </div>
        <!-- <div>
          <p class="fw550">{{$t('help.follow-us')}}</p>
           <div>
            <img class="wh32" src="../assets/images/facebook.png">
            <img class="wh32 ml5" src="../assets/images/weihbo.png">
            <img class="wh32 ml5" src="../assets/images/wechat.png">
          </div> 
        </div>-->
      </div>

      <div class="bottomTitle">
        © 2019 Global Transfers. All rights reserved.
        ICP证: 
        <a
          target="_black"
          href="http://www.beian.miit.gov.cn"
        >蜀ICP备19026033</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "zyFooter",
  data() {
    return {};
  },
  inject: ["reload"],
  methods: {
    goHelp(value) {
      this.$router.push({ path: "/index/help", query: { active: value } });
      this.reload();
    }
  }
};
</script>

<style scoped>
#zyFooter {
  height: 360px;
  margin-top: 90px;
}

#zyFooter .bg {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: #333;
  background-position: center center;
  margin: auto;
}

#zyFooter .content {
  width: 900px;
  margin: 0 auto;
  padding: 80px 0 70px 0;
}

#zyFooter p {
  font-weight: 400;
  color: rgba(204, 204, 204, 1);
  line-height: 36px;
  height: 36px;
  margin: 0;
}

#zyFooter p.fw550 {
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
}

#zyFooter .content p:hover {
  cursor: pointer;
  text-decoration: underline;
}

#zyFooter p.fw550:hover {
  cursor: text;
  text-decoration: none;
}

#zyFooter .bg .bottomTitle {
  width: 1201px;
  height: 78px;
  line-height: 78px;
  margin: 0 auto 0;
  border-top: 2px solid #3d3d3d;
  text-align: center;
  font-size: 12px;
  color: rgba(200, 200, 200, 0.5);
  bottom: 0;
}

.bottomTitle a {
  font-size: 12px;
  color: rgba(200, 200, 200, 0.5);
}
</style>
