<template>
  <div class="order-dts">
    <div class="left-content" v-loading="isLoading">
      <p class="cursor" @click="goOrderList">
        <img class="el-icon-back" src="../../assets/images/backarrow.png" />
        <span class="fz14 color-666 ml10">{{$t('order.back')}}</span>
      </p>
      <div class="flex-between item-center">
        <div class="air-plane" v-if="detailInfo.relate">
          <div class="air-plane-title mt20">
            <img
              class="order-type-img"
              v-if="detailInfo.relate.type == 1 && type == 'transfer'"
              src="../../assets/images/airport2.png"
              alt
            />
            <img
              class="order-type-img"
              v-if="detailInfo.relate.type == 2 && type == 'transfer'"
              src="../../assets/images/airportdropoff.png"
              alt
            />
            <span class="fz16 color-333 fw600 ml10">
              <!-- {{detailInfo.relate.address[0]}}  -->
              <span
                v-if="type == 'transfer'"
              >{{detailInfo.relate.type == 1? $t('m.pick-up'): $t('m.drop-off')}}</span>
              <span v-else>{{$t('order.reservation')}}</span>
            </span>
          </div>

          <div class="driver flex item-center mt20" v-if="detailInfo.relate.driver">
            <img class="wh46" v-lazy="detailInfo.relate.driver.driver.img" alt />
            <div class="ml10" v-if="detailInfo.relate">
              <span class="fz16 color-333">{{detailInfo.relate.driver.driver.real_name}}</span><br>
              <span class="fz14 color-333 mt5">{{detailInfo.relate.driver.driver_mobile_code}} {{detailInfo.relate.driver.driver_mobile}}</span>
              <!-- <el-tooltip
                v-if="detailInfo.relate.comment"
                :content="$t('order.view-comments')"
                placement="bottom"
                effect="light"
              >
                <span class="cursor" @click="showComment = true">
                  <el-rate
                    v-model="detailInfo.relate.driver.driver.score"
                    :colors="['#38846A','#38846A','#38846A']"
                    disabled
                  ></el-rate>
                </span>
              </el-tooltip>
              <el-rate
                v-else
                v-model="detailInfo.relate.driver.driver.score"
                :colors="['#38846A','#38846A','#38846A']"
                disabled
              ></el-rate> -->
            </div>
           
          </div>

          <div class="flex-between service-info" v-if="detailInfo.order">
            <div class="fz14 color-333">
              <p>{{type == 'transfer'?detailInfo.relate.type == 1? $t('m.pick-up'): $t('m.drop-off'): $t('order.reservation')}}</p>
              <p>
                {{$t('order.baby-booster')}}
                <img class="wh14 ml5 hide" src="../../assets/images/detail.png" alt />
              </p>
              <p v-if="type == 'transfer'">
                {{$t('order.meet-greet2')}}
                <img class="wh14 ml5 hide" src="../../assets/images/detail.png" alt />
              </p>
              <!-- <p v-if="type == 'transfer'">高速费 <img class="wh14 ml5" src="../../assets/images/detail.png" alt=""></p>     -->
              <p>
                {{$t('order.discount')}}
                <img class="wh14 ml5 hide" src="../../assets/images/detail.png" alt />
              </p>
            </div>
            <div class="fz14 color-333">
              <p>
                <span v-if="detailInfo.order.base_fee > 0">{{detailInfo.order.currency_symbol}}</span>
                {{detailInfo.order.base_fee}}
              </p>
              <p>
                <span
                  v-if="detailInfo.order.children_seat_fee != 0"
                >{{detailInfo.order.currency_symbol}}</span>
                {{detailInfo.order.children_seat_fee}}
              </p>
              <p v-if="type == 'transfer'">
                <span v-if="detailInfo.order.hight_way_fee > 0">{{detailInfo.order.currency_symbol}}</span>
                {{detailInfo.order.hight_way_fee}}
              </p>
              <!-- <p v-if="type == 'transfer'"><span v-if="detailInfo.order.brand_pick_up_fee > 0">{{detailInfo.order.currency_symbol}}</span>{{detailInfo.order.brand_pick_up_fee}}</p> -->
              <p class="color-green">
                <span
                  v-if="detailInfo.order.discount_fee > 0"
                >-{{detailInfo.order.currency_symbol}}{{detailInfo.order.discount_fee}}</span>
                <span v-else>0</span>
              </p>
            </div>
          </div>
        </div>
        <div id="mapId" class="map-img"></div>
        <!-- <img class="map-img" src="../../assets/images/rectangle17.png" alt=""> -->
      </div>
      <div class="flex-between pay-info mt5" v-if="detailInfo.order">
        <div class="flex-between pay-num">
          <div class="color-333 fw600">
            <p class="fz16">{{$t('order.total2')}}</p>
            <p class="fz14 mt5">
              {{$t('order.commission8')}}
              <img class="wh14 ml5 hide" src="../../assets/images/detail.png" alt />
            </p>
          </div>
          <div class="color-green">
            <p class="fz22">{{detailInfo.order.currency_symbol}}{{detailInfo.order.total_fee}}</p>
            <p class="fz16 text-right">
              <span v-if="detailInfo.order.rebate_fee > 0">{{detailInfo.order.currency_symbol}}</span>
              {{detailInfo.order.rebate_fee}}
            </p>
          </div>
        </div>
        <div class="bind-btns">
          <el-button
            v-for="item2 in detailInfo.order.operate"
            :key="item2"
            @click="operateBtn(item2, detailInfo.order.out_trade_no)"
            :class="{'green': item2=='pay' || item2 == 'refund', 'black': item2 == 'cancel' || item2 == 'urge' || item2 == 'comment'}"
          >{{operate[item2]}}</el-button>
          <!-- <el-button class="green" @click="showEvaluate = true">评价司机</el-button> -->
          <!-- <el-tooltip class="item" effect="light" content="17780077764" placement="bottom-end">
                        <el-button class="green"><i class="el-icon-phone-outline"></i> &nbsp;联系司机</el-button>
          </el-tooltip>-->
        </div>
      </div>

      <div class="detail-info" v-if="detailInfo.relate">
        <div class="p-relative trap-info">
          <p class="flex-between">
            <span>
              <img class="wh10" src="../../assets/images/reservationtime.png" alt />
              <label class="fz14 color-666 ml5">{{detailInfo.relate.use_time}}</label>
            </span>
            <span class="fz14 color-green">{{status_text}}</span>
          </p>
          <p>
            <img class="wh10" src="../../assets/images/reservationstart.png" alt />
            <label class="fz16 color-333 fw600 ml5">{{detailInfo.relate.address[0]}}</label>
          </p>
          <p>
            <span class="line inline-block"></span>
            <span class="fz14 color-666 ml20">{{$t('order.about')}}{{detailInfo.relate.distance}}km</span>
          </p>
          <p>
            <img class="wh10" src="../../assets/images/reservation-destination.png" alt />
            <label class="fz16 color-333 fw600 ml5">{{detailInfo.relate.address[1]}}</label>
          </p>
          <p v-if="type == 'transfer'">
            <img class="wh10" src="../../assets/images/wheel.png" alt />
            <label class="fz14 color-666 ml5">{{detailInfo.relate.car}}</label>
          </p>
          <p v-if="type == 'pointcar'">
            <img class="wh10" src="../../assets/images/order-number.png" alt />
            <label
              class="fz14 color-666 ml5"
            >{{$t('wallet.order-number')}}：{{detailInfo.order.out_trade_no}}</label>
          </p>
        </div>
        <div class="flex-between detail-text mt20" v-if="type == 'transfer'">
          <div>
            <p>{{$t('order.pick-up-time')}}</p>
            <p>{{$t('order.distance')}}</p>
            <p>{{$t('order.flight')}}</p>
          </div>
          <div class="text-right">
            <p>
              <label>{{detailInfo.relate.use_time}}</label>
            </p>
            <p>
              <label>{{$t('order.about')}}{{detailInfo.relate.distance}}km</label>
            </p>
            <p>
              <label>{{detailInfo.relate.flight_no}}</label>
            </p>
          </div>
        </div>
        <div class="flex-between detail-text" >
          <div>
            <p v-if="type == 'transfer'">{{$t('order.car-type')}}</p>
            <p>{{$t('m.passengers2')}}</p>
            <p>{{$t('order.luggages')}}</p>
          </div>
          <div class="text-right">
            <p v-if="type == 'transfer'">
              <label>{{detailInfo.relate.car}}</label>
            </p>
            <p>
              <label>{{$t('m.adult')}}*{{detailInfo.order.adults}}，{{$t('m.children')}}*{{detailInfo.order.children}}</label>
            </p>
            <p>
              <label>{{$t('order.large-luggage')}}*{{detailInfo.relate.big_luggage}}，{{$t('order.carry-on-luggage')}}*{{detailInfo.relate.small_luggage}}</label>
            </p>
          </div>
        </div>
        <div class="flex-between detail-text">
          <div>
            <p>{{$t('order.client-name2')}}</p>
            <p>{{$t('m.phone-number')}}</p>
            <p>{{$t('m.wechat-number')}}</p>
          </div>
          <div class="text-right">
            <p>
              <label>{{detailInfo.contact.contact_name}}</label>
            </p>
            <p>
              <label>{{detailInfo.contact.contact_mobile}}</label>
            </p>
            <p>
              <label>{{detailInfo.contact.wechat}}</label>
            </p>
          </div>
        </div>
        <div class="flex-between detail-text">
          <div>
            <p>{{$t('order.emergency-contact')}}</p>
            <p>{{$t('m.phone-number')}}</p>
            <p>{{$t('m.wechat-number')}}</p>
            <p v-if="type == 'pointcar'">{{$t('order.note-dts')}}</p>
          </div>
          <div class="text-right">
            <p>
              <label>{{detailInfo.contact.spare_contact_name}}</label>
            </p>
            <p>
              <label>{{detailInfo.contact.spare_contact_mobile}}</label>
            </p>
            <p>
              <label>{{detailInfo.contact.spare_wechat}}</label>
            </p>
            <p v-if="type == 'pointcar'">
              <label>{{detailInfo.order.remark}}</label>
            </p>
          </div>
        </div>
        <div class="flex-between detail-text" v-if="type == 'transfer'">
          <div>
            <p>{{$t('wallet.order-number')}}</p>
            <p>{{$t('order.date-ordered')}}</p>
            <p>{{$t('order.note-dts')}}</p>
            <p class="color-green">{{$t('order.special-instructions')}}</p>
          </div>
          <div class="text-right">
            <p>
              <label>{{detailInfo.order.out_trade_no}}</label>
            </p>
            <p>
              <label>{{detailInfo.order.create_time}}</label>
            </p>
            <p>
              <label>{{detailInfo.order.remark}}</label>
            </p>
            <p>
              <label>
                {{detailInfo.relate.brand_pick_up == 1?$t('order.meet-greet'):''}}
                <br />
                {{detailInfo.relate.is_high_way == 1? $t('order.toll-way2'): ''}}
                <br />
                {{detailInfo.order.children > 0 ? this.$t('order.baby-booster2') + '*' +detailInfo.order.children: ''}}
              </label>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="right-content"
      :class="{'zh-right-content': lang == 'zh', 'en-right-content': lang == 'en'}"
    >
      <div class="rule">
        <h3>{{$t('order.refund-rules')}}</h3>
        <p>{{$t('order.refund-rules-tips8')}}</p>
      </div>
    </div>
    <!-- 查看评论 -->
    <el-dialog
      v-if="showComment"
      :title="$t('order.your-comment')"
      :visible.sync="showComment"
      disabled
      width="340px"
      center
    >
      <p class="item-center evaluate">
        <el-rate disabled v-model="detailInfo.relate.comment.score" allow-half></el-rate>
      </p>
      <p class="pd10 fz14">{{detailInfo.relate.comment.comment}}</p>
    </el-dialog>

    <!-- 评论 -->
    <el-dialog :title="$t('order.your-comment')" :visible.sync="showEvaluate" width="340px" center>
      <p class="item-center evaluate">
        <el-rate v-model="evaluateStar" allow-half></el-rate>
      </p>
      <el-input
        class="mt20"
        type="textarea"
        :placeholder="$t('order.tips-comment')"
        v-model="evaluateValue"
        show-word-limit
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button class="custom-btn" @click="comment()">{{$t('m.ok')}}</el-button>
      </span>
    </el-dialog>

    <!-- 退款成功及确认取消 -->
    <el-dialog
      :title="cancelTitle"
      :visible.sync="showCancelOrder"
      width="360px"
      @close="bindCancel(2)"
      center
    >
      <p v-if="cancelTitle" class="fz14 color-333">
        <span v-if="cancelOrderInfo.is_order == 0">{{$t('order.has-driver')}}</span>
        <span>{{$t('order.cancel-tips2')}}</span>
        <!-- <span v-if="cancelOrderInfo.fee_cancel_time && lang == 'zh'" >行程开始{{cancelOrderInfo.fee_cancel_time.value}}{{cancelOrderInfo.fee_cancel_time.type}}前可免费取消，</span> -->
        <!-- <span v-if="cancelOrderInfo.fee_cancel_time && lang == 'en'">Free cancellation up to {{cancelOrderInfo.fee_cancel_time.value}} {{cancelOrderInfo.fee_cancel_time.type}} before pick-up.</span> -->
        <span>{{$t('order.refund-money')}}{{cancelOrderInfo.currency}}{{cancelOrderInfo.refund}}</span>
      </p>
      <span v-if="cancelTitle" slot="footer" class="dialog-footer cancel-footer">
        <el-button size="small" @click="showCancelOrder = false">{{$t('order.no')}}</el-button>
        <el-button
          size="small"
          class="mt10"
          type="danger"
          @click="bindCancel(1)"
        >{{$t('order.y-cancel')}}</el-button>
      </span>
      <div v-if="!cancelTitle" class="refund-success text-center">
        <img src="../../assets/images/cancel-scucess.png" alt />
        <p class="fz20 color-333 fw600">{{$t('order.refund-successful')}}</p>
        <p>{{$t('order.refund-tips')}}</p>
        <el-button size="medium" round @click="bindCancel(2)">{{$t('order.ok2')}}</el-button>
      </div>
    </el-dialog>

    <!-- 取消成功 -->
    <el-dialog :visible.sync="showNoRefundCancel" width="360px" center>
      <div class="text-center">
        <img src="../../assets/images/no-rerund.png" alt />
        <p class="fz20 color-333 fw600">{{$t('order.cancel-successful')}}</p>
        <!-- <p v-if="lang == 'zh'">送您一张补偿优惠券，下次下单可以用哦~</p>
                <div class="flex-between item-center coupon mt10">
                    <img class="wh40 ml10" src="../../assets/images/coupons.png" alt="">
                    <div>
                        <p class="color-333 fw600"><span class="fz16">$</span><span class="fz30">50</span><span class="fz16">通用优惠券</span></p>
                        <p class="fz12 color-666">【补偿优惠券】</p>
                        <p class="fz12 color-666">有效期至2018年2月28日</p>
                    </div>
                    <div class="use-btn"><span class="fz14 color-fff">{{$t('order.get')}}</span></div>
        </div>-->
        <el-button
          class="no-redund-cancel cursor"
          size="medium"
          round
          @click="showNoRefundCancel = false"
        >{{$t('order.ok2')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "order-dts",
  data() {
    return {
      star: 5,
      showEvaluate: false,
      evaluateValue: "",
      evaluateStar: 0,
      out_trade_no: "",
      detailInfo: {},
      isLoading: true,
      operate: {
        cancel: this.$t("order.cancel-order"),
        pay: this.$t("order.pay"),
        refund: this.$t("order.return-money"),
        urge: this.$t("order.urge"),
        comment: this.$t("order.customer-service")
      },
      status_text: "",
      type: "",
      btn_out_trade_no: "",
      showNoRefundCancel: false,
      cancelTitle: this.$t("order.cancel-book"),
      showNoRefundCancel: false,
      cancelOrderInfo: {},
      showCancelOrder: false,
      showComment: false
    };
  },
  computed: {
    ...mapState({
      lang: state => state.lang
    })
  },
  methods: {
    goOrderList() {
      this.$router.push({ name: "orderList" });
    },
    getDetail() {
      this.$axios
        .get(this.lang + "/order/detail?out_trade_no=" + this.out_trade_no)
        .then(res => {
          this.detailInfo = res.data.data;
          this.isLoading = false;
          this.status_text = res.data.data.order.status_text;
          window.scrollTo(0, 0);
          this.getlatlngByAddress(res.data.data.relate.address);
        });
    },
    operateBtn(type, out_trade_no) {
      this.btn_out_trade_no = out_trade_no;
      if (type == "pay") {
        let money =
          this.detailInfo.order.currency_symbol +
          this.detailInfo.order.total_fee;
        sessionStorage.setItem(
          "payParams",
          JSON.stringify({ num: money, out_trade_no: out_trade_no })
        );
        this.$router.push({ name: "payorder" });
      } else if (type == "cancel") {
        this.orderCancel(out_trade_no);
      } else if (type == "refund") {
        this.orderRefund();
      } else if (type == "urge") {
        this.orderUrgent();
      } else if (type == "comment") {
        this.showEvaluate = true;
      }
    },

    comment() {
      //评论
      let param = {
        id: this.detailInfo.relate.driver.driver_order_id,
        score: this.evaluateStar,
        comment: this.evaluateValue
      };
      this.$axios.post(this.lang + "/order/comment", param).then(res => {
        if (res.data.status == 1) {
          this.$message.success(this.$t("order.comment-successful"));
          this.getDetail();
        }
      });
    },
    bindCancel(type) {
      if (type == 1) {
        this.confirmCancelOrder();
      } else {
        this.cancelTitle = this.$t("order.cancel-book");
        this.showCancelOrder = false;
        this.getDetail();
      }
    },
    orderUrgent() {
      //催派订单
      this.$axios
        .post(this.lang + "/order/urgent", {
          out_trade_no: this.btn_out_trade_no
        })
        .then(res => {
          if (res.data.status == 1) {
            this.$message.success(this.$t("order.urge-successful"));
          }
        });
    },
    orderRefund() {
      //退款
      this.$axios
        .post(this.lang + "/order/refund", {
          out_trade_no: this.btn_out_trade_no
        })
        .then(res => {
          if (res.data.status == 1) {
            this.cancelTitle = "";
            this.showCancelOrder = true;
          }
        });
    },
    confirmCancelOrder() {
      //确认取消
      this.$axios
        .post(this.lang + "/order/cancel-confirm", {
          out_trade_no: this.btn_out_trade_no
        })
        .then(res => {
          this.showCancelOrder = true;
          this.getDetail();
        });
    },
    orderCancel(out_trade_no) {
      //取消订单
      let param = { out_trade_no: out_trade_no };
      this.$axios.post(this.lang + "/order/cancel", param).then(res => {
        if (res.data.data.need_alert == 0) {
          this.getDetail();
          this.showNoRefundCancel = true;
        } else {
          this.showCancelOrder = true;
          this.cancelOrderInfo = res.data.data;
        }
      });
    },
    getlatlngByAddress(address) {
      let points = [];
      address.map((item, index) => {
        this.$axios
          .get(this.lang + "/tools/to-coordinate?address=" + item)
          .then(res => {
            if (res.data.data.results.length > 0) {
              points.push(res.data.data.results[0].geometry.location);
              this.initBaiduMap(points);
            }
          });
      });
    },
    initBaiduMap(points) {
      var map = new BMap.Map("mapId");
      var point = new BMap.Point(points[0].lng, points[0].lat);
      map.centerAndZoom(point, 15);
      map.enableScrollWheelZoom(true);

      if (points.length == 2) {
        var myP1 = new BMap.Point(points[0].lng, points[0].lat);
        var myP2 = new BMap.Point(points[1].lng, points[1].lat); 

        var polyline = new BMap.Polyline([myP1,myP2], {strokeColor:"#F15C47",//设置颜色
        strokeWeight:3, //宽度
        strokeOpacity:0.5});//透明度
        map.addOverlay(polyline);

        points.map((item, index) => {
           this.addMarker(map, new window.BMap.Point(item.lng, item.lat), index)
        })
      }
    },
    addMarker(map, point, index) {    
        var marker = new BMap.Marker(point);    
        map.addOverlay(marker);    
        return marker;    
    }    
  },
  mounted() {
    this.out_trade_no = this.$route.query.out_trade_no;
    this.type = this.$route.query.type;

    this.getDetail();
  }
};
</script>
<style lang="scss" scoped>
.custom-btn {
  width: 100%;
  border-radius: 4px;
  border: transparent;
  color: #fff !important;
  background: linear-gradient(#328c6e, #4b9d63);
  box-shadow: 0 2px 20px 0 rgba(51, 51, 51, 0.5);
}
.order-dts {
  display: flex;
  width: 1201px;
  margin: auto;
  .coupon {
    border-radius: 12px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    p {
      margin: 2px 0;
      text-align: left;
    }
    .use-btn {
      background: rgba(249, 189, 79, 1);
      border-radius: 0px 12px 12px 0px;
      height: 90px;
      line-height: 90px;
      width: 62px;
    }
  }

  .left-content {
    min-height: 600px;
    width: 790px;
    margin-top: 45px;
    padding: 0 45px 0 45px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    .driver {
      img {
        border-radius: 100%;
      }
    }
    .air-plane {
      .air-plane-title img {
        width: 45px;
        height: 22px;
      }
      .service-info {
        width: 300px;
        margin: 20px 0;
        padding: 15px 0;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        p {
          margin: 10px 0;
        }
      }
    }
    .pay-info {
      .pay-num {
        width: 300px;
        p {
          vertical-align: top;
          margin: 0;
        }
      }
      .bind-btns {
        .el-button {
          width: 178px;
          height: 36px;
          text-align: center;
          padding: 0;
          border-radius: 18px;
        }
        .black {
          color: #333;
          border: 1px solid #666;
        }
        .green {
          color: #38846a;
          border: 1px solid #38846a;
        }
        .el-button:hover {
          color: #4b9d63;
        }
      }
    }

    .detail-info {
      border-radius: 12px;
      border: 1px solid rgba(204, 204, 204, 1);
      padding: 10px 25px;
      margin: 30px 0;
      .trap-info {
        p {
          margin: 10px 0;
        }
        .line {
          position: absolute;
          left: 4px;
          border-right: 1px dashed #38846a;
          height: 26px;
        }
      }
      .detail-text {
        border-top: 1px solid #ccc;
        p {
          margin: 10px 0;
          font-size: 14px;
          color: #666;
          label {
            font-size: 16px;
            color: #333;
          }
        }
      }
    }

    .map-img {
      height: 218px;
      width: 378px;
      background: #f1f1f1;
    }
  }
  .zh-right-content {
    height: 200px;
  }
  .en-right-content {
    height: 210px;
  }
  .right-content {
    border-top: 6px solid #4b9d63;
    width: 370px;
    margin-left: 40px;
    margin-top: 45px;
    width: 370px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    .rule {
      padding: 0 25px;
      p {
        font-size: 16px;
        color: #333;
        line-height: 22px;
        margin-bottom: 25px;
      }
    }
  }
  /deep/ {
    .evaluate .el-rate__icon {
      font-size: 30px;
      margin-left: 10px;
    }
    .map-img .BMap_cpyCtrl {
      z-index: -1 !important;
    }
  }
}
</style>


