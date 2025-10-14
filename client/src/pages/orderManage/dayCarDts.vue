<template>
    <div class="order-day-car">
         <div class="left-content" v-loading="isLoading">
             <p class="cursor" @click="goOrderList"><img class="el-icon-back" src="../../assets/images/backarrow.png"/> <span class="fz14 color-666 ml10">{{$t('order.back')}}</span></p>
             <div class="flex-between" v-if="detailInfo.relate">
                 <div class="air-plane">
                     <div class="air-plane-title mt20">
                         <span class="fz16 color-333 fw600">{{orderType == 'charter'?detailInfo.relate.charter_title : detailInfo.relate.list.length+$t('order.day-charter')}}</span>
                     </div>
                     <div class="flex-between service-info">
                         <div class="fz14 color-333">
                             <p v-if="orderType == 'charter'">{{detailInfo.relate.charter_title}}</p>
                             <p v-else><span v-if='lang == "zh"'>{{detailInfo.relate.list.length}}</span>{{$t('order.daily-charter')}}</p>
                             <p>{{$t('order.baby-booster')}} <img class="wh14 ml5" src="../../assets/images/detail.png" alt=""></p>
                             <p>{{$t('order.discount')}} <img class="wh14 ml5" src="../../assets/images/detail.png" alt=""></p>
                         </div>
                         <div class="fz14 color-333">
                             <p>{{detailInfo.order.currency_symbol}}{{detailInfo.order.base_fee}}</p>
                             <p><span v-if="detailInfo.order.children_seat_fee>0">{{detailInfo.order.currency_symbol}}</span>{{detailInfo.order.children_seat_fee}}</p>
                             <p class="color-green"><span v-if="detailInfo.order.discount_fee>0">-{{detailInfo.order.currency_symbol}}</span>{{detailInfo.order.discount_fee}}</p>
                         </div>
                     </div>
                 </div>
                 <img class="map-img" src="../../assets/images/day-car-map.png" alt="">
             </div>
             <div class="flex-between pay-info mt5" v-if="detailInfo.order">
                 <div class="flex-between pay-num">
                     <div class="color-333 fw600">
                         <p class="fz16">{{$t('order.total2')}}</p>
                         <p class="fz14 mt5">{{$t('order.commission8')}} <img class="wh14 ml5" src="../../assets/images/detail.png" alt=""></p>
                     </div>
                     <div class="color-green">
                         <p class="fz22">{{detailInfo.order.currency_symbol}}{{detailInfo.order.total_fee}}</p>
                         <p class="fz16 text-right"><span v-if="detailInfo.order.rebate_fee>0">{{detailInfo.order.currency_symbol}}</span>{{detailInfo.order.rebate_fee}}</p>
                     </div>
                 </div>
                 <div class="bind-btns">
                     <el-button v-for="item2 in detailInfo.order.operate" :key="item2" @click="operateBtn(item2, detailInfo.order.out_trade_no)" :class="{'green': item2=='pay' || item2 == 'refund', 'black': item2 == 'cancel' || item2 == 'urge'}">{{operate[item2]}}</el-button>
                     <!-- <el-button class="green" @click="showEvaluate = true">评价司机</el-button> -->
                     <!-- <el-tooltip class="item" effect="light" content="17780077764" placement="bottom-end">
                        <el-button class="green"><i class="el-icon-phone-outline"></i> &nbsp;联系司机</el-button>
                     </el-tooltip> -->
                 </div>
             </div>
            
            <div v-if="detailInfo.relate"> 
                <div v-if="detailInfo.relate.list && orderType == 'day-charter'">
                    <div class="detail-info" v-for="item in detailInfo.relate.list" :key="item.id">
                        <div class="driver flex-between item-center" >
                            <div class="flex item-center" v-if="item.driver">
                                <img class="wh46" v-lazy="item.driver.driver.img" alt="">
                                <p class="ml15" >
                                    <span class="fz16 color-333">{{item.driver.driver.real_name}}</span><br>
                                    <el-tooltip v-if="item.driver.comment" :content="$t('order.view-comments')" placement="bottom" effect="light">
                                        <span class="cursor" @click="showComment = true">
                                        <el-rate 
                                            v-model="item.driver.driver.score"
                                            :colors="['#38846A','#38846A','#38846A']"
                                            disabled>
                                        </el-rate>
                                    </span>
                                    </el-tooltip>
                                    <el-rate 
                                        v-else
                                        v-model="item.driver.driver.score"
                                        :colors="['#38846A','#38846A','#38846A']"
                                        disabled>
                                    </el-rate>
                                    <span class="fz14 color-green">{{item.driver.driver.score}}<span v-if="lang='zh'">星</span></span>
                                </p>
                            </div>
                            <span class="fz14 color-green float-left" v-if="item.driver">{{item.status_text}}</span>   
                        </div>
                        <div class="trap-info">
                            <p class="flex-between">
                                <span><img class="wh10" src="../../assets/images/reservationtime.png" alt=""> <label class="fz14 color-666 ml5">{{item.date}}</label></span>
                                <span class="fz14 color-green" v-if="!item.driver">{{item.status_text}}</span>
                            </p>
                            <p><img class="wh10" src="../../assets/images/reservationstart.png" alt=""> <label class="fz16 color-333 fw600 ml5">{{item.type}}</label></p>
                            <p class="flex-between">
                                <span>
                                    <img class="wh10" src="../../assets/images/wheel.png" alt=""> 
                                    <label class="fz14 color-666 ml5">{{item.car}}</label>
                                </span>
                                                 <!-- <el-button v-for="item2 in detailInfo.order.operate" :key="item2" @click="operateBtn(item2, detailInfo.order.out_trade_no)" :class="{'green': item2=='pay' || item2 == 'refund', 'black': item2 == 'cancel' || item2 == 'urge'}">{{operate[item2]}}</el-button> -->
                                <span class="btns">
                                    <el-button v-for="item2 in item.operate" :key="item2" @click="operateBtn(item2, detailInfo.order.out_trade_no)" :class="{'green': item2=='pay' || item2 == 'refund', 'black': item2 == 'cancel' || item2 == 'urge'}">{{operate[item2]}}</el-button>
                                </span>
                                <!-- <el-rate 
                                    v-model="star"
                                    :colors="['#F9BD4F','#F9BD4F','#F9BD4F']"
                                    disabled>
                                </el-rate> -->
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="detail-info" v-if="detailInfo.relate">
                 <div class="p-relative trap-info" v-if="orderType == 'day-charter' && detailInfo.order.status < 4">
                    <p class="flex-between">
                        <span><img class="wh10" src="../../assets/images/reservationtime.png" alt=""> <label class="fz14 color-666 ml5">{{detailInfo.relate.list[0].date}}~{{detailInfo.relate.list[detailInfo.relate.list.length-1].date}}</label></span>
                        <span class="fz14 color-green">{{status_text}}</span>
                    </p>
                    <p v-for="(item, index) in detailInfo.relate.list" :key="index">
                        <img v-if="index < detailInfo.relate.list.length-1" class="wh10" src="../../assets/images/reservationstart.png" alt=""> 
                        <img v-if="index == detailInfo.relate.list.length-1" src="../../assets/images/reservation-destination.png" alt="">
                        <label class="fz16 color-333 fw600 ml5">
                            <span v-if='lang == "zh"'>第{{item.day}}天 </span>
                            <span v-if='lang == "en"'>Day{{item.day}} </span>
                            {{item.type}}
                        </label>
                    </p>
                    <p><img class="wh10" src="../../assets/images/wheel.png" alt=""> <label class="fz14 color-666 ml5">{{detailInfo.relate.list[0].car}}</label></p>
                 </div>

                 <div class="p-relative trap-info" v-if="orderType == 'charter'">
                    <p class="flex-between">
                        <span><img class="wh10" src="../../assets/images/reservationtime.png" alt=""> <label class="fz14 color-666 ml5">{{use_time}}</label></span>
                        <span class="fz14 color-green">{{status_text}}</span>
                    </p>
                    <p><img class="wh10" src="../../assets/images/reservationstart.png" alt=""> <label class="fz16 color-333 fw600 ml5">{{detailInfo.relate.charter_title}}</label></p>
                    <p><img class="wh10" src="../../assets/images/wheel.png" alt=""> <label class="fz14 color-666 ml5">{{detailInfo.relate.car}}</label></p>
                 </div>
                <div class="flex-between detail-text mt20" v-if="orderType=='charter'">
                     <div>
                         <p>{{$t('order.pick-up-time')}}</p>
                         <p>出发地址</p>
                         <p>{{$t('order.distance')}}</p>
                     </div>
                     <div class="text-right">
                        <p><label>{{use_time}}</label></p>
                        <p><label>{{detailInfo.relate.boarding_address}}</label></p>
                        <p><label>{{detailInfo.relate.distance}}km</label></p>
                     </div>
                 </div>
                 <div class="flex-between detail-text" :class="{'no-border': orderType == 'day-charter' && detailInfo.order.status <= 4}">
                     <div>
                         <p>{{$t('order.car-type')}}</p>
                         <p>{{$t('m.passengers2')}}</p>
                         <p>{{$t('order.luggages')}}</p>
                     </div>
                     <div class="text-right">
                        <p><label>{{orderType=='charter'?detailInfo.relate.car:detailInfo.relate.list[0].car}}</label></p>
                        <p><label>{{$t('m.adult')}}*{{detailInfo.order.adults}}，{{$t('m.children')}}*{{detailInfo.order.children}}</label></p>
                        <p v-if="orderType == 'charter'"><label>{{$t('order.large-luggage')}}*{{detailInfo.relate.big_luggage}}，{{$t('order.carry-on-luggage')}}*{{detailInfo.relate.small_luggage}}</label></p>
                        <p v-if="orderType == 'day-charter'"><label>{{$t('order.large-luggage')}}*{{detailInfo.relate.info.big_luggage}}，{{$t('order.carry-on-luggage')}}*{{detailInfo.relate.info.small_luggage}}</label></p>
                     </div>
                 </div>
                <div class="flex-between detail-text">
                     <div>
                         <p>{{$t('order.client-name2')}}</p>
                         <p>{{$t('m.phone-number')}}</p>
                         <p>{{$t('m.wechat-number')}}</p>
                         <p>{{$t('order.spare-phone')}}</p>
                     </div>
                     <div class="text-right">
                        <p><label>{{detailInfo.contact.contact_name}}</label></p>
                        <p><label>{{detailInfo.contact.contact_mobile}}</label></p>
                        <p><label>{{detailInfo.contact.wechat}}</label></p>
                        <p><label>{{detailInfo.contact.spare_contact_mobile}}</label></p>
                     </div>
                </div>
                <div class="flex-between detail-text">
                     <div>
                         <p>{{$t('wallet.order-number')}}</p>
                         <p>{{$t('order.date-ordered')}}</p>
                         <p>{{$t('order.note-dts')}}</p>
                         <p class="color-green">{{$t('order.special-instructions')}}</p>
                     </div>
                     <div class="text-right">
                        <p><label>{{detailInfo.order.out_trade_no}}</label></p>
                        <p><label>{{detailInfo.order.create_time}}</label></p>
                        <p><label>{{detailInfo.order.remark || $t('m.no-data2')}}</label></p>
                        <p><label>{{detailInfo.order.children > 0 ? this.$t('order.baby-booster2')+ '*' +detailInfo.order.children: ''}}</label></p>
                     </div>
                </div>
            </div>

            <div class="fee-info" v-if="detailInfo.relate">
                <p class="fz16 color-333 fw550">{{$t('p.excess')}}</p>
                <div class="fz14 color-333 ml35">
                     <p class="fw550">{{$t('p.inclusions')}}</p>
                     <p v-if="orderType=='charter'">{{detailInfo.relate.fee_include}}</p>
                     <div v-if="orderType=='day-charter'">
                        <p>• {{$t('p.inclusions-tips1')}}</p>
                        <p>• {{$t('p.inclusions-tips2')}} </p>
                        <p>• {{$t('p.inclusions-tips3')}}</p>
                     </div>
                </div>
                <div class="fz14 color-333 ml35">
                     <p class="fw550">{{$t('p.exclusions')}}</p>
                     <p v-if="orderType=='charter'">{{detailInfo.relate.fee_no_include}}</p>
                     <div v-if="orderType=='day-charter'">
                         <p>• {{$t('p.exclusions-tips1')}} </p>
                         <p>• {{$t('p.exclusions-tips2')}} </p>
                         <p>• {{$t('p.exclusions-tips3')}} </p>
                         <p>• {{$t('p.exclusions-tips4')}}</p>
                     </div>
                </div>
            </div>
         </div>
        <div class="right-content" :class="{'zh-right-content': lang == 'zh', 'en-right-content': lang == 'en'}">
            <div class="rule" v-if="orderType == 'charter'">
                <h3>{{$t('order.refund-rules')}}</h3>
                <p>{{$t('order.refund-rules-tips1')}} </p>
                <p>{{$t('order.refund-rules-tips2')}} </p>
                <p>{{$t('order.refund-rules-tips3')}}  </p>
                <p>{{$t('order.refund-rules-tips4')}}</p>
                <p>{{$t('order.refund-rules-tips5')}}</p>
            </div>
            <div class="rule" v-if="orderType == 'day-charter'">
                <h3>{{$t('order.refund-rules')}}</h3>
                <p>{{$t('order.refund-rules-tips8')}} </p>
                <p>{{$t('order.refund-rules-tips9')}}  </p>
                <p>{{$t('order.refund-rules-tips10')}}</p>
            </div>
        </div>
        <!-- 查看评论 -->
        <el-dialog
            v-if="showComment"
            :title="$t('order.your-comment')"
            :visible.sync="showComment"
            disabled
            width="340px"
            center>
            <p class="item-center evaluate"> 
                <el-rate
                disabled
                v-model="detailInfo.relate.comment.score"
                allow-half>
                </el-rate>
            </p>
            <p class="pd10 fz14">{{detailInfo.relate.comment.comment}}</p>
        </el-dialog>
        <!-- 评论 -->
        <el-dialog
            :title="$t('order.your-comment')"
            :visible.sync="showEvaluate"
            width="340px"
            center>
            <p class="item-center evaluate"> 
                <el-rate
                v-model="evaluateStar"
                allow-half>
                </el-rate>
            </p>
            <el-input
                class="mt20"
                type="textarea"
                :placeholder="$t('order.tips-comment')"
                v-model="evaluateValue"
                show-word-limit
                ></el-input>
            <span slot="footer" class="dialog-footer">
                 <el-button class="custom-btn"  @click="comment()">{{$t('m.ok')}}</el-button>
            </span>
        </el-dialog>
         
         <!-- 退款成功及确认取消 -->
        <el-dialog
            :title="cancelTitle"
            :visible.sync="showCancelOrder"
            width="360px"
            @close="bindCancel(2)"
            center>
            <p v-if="cancelTitle" class="fz14 color-333">
                <!-- <span v-if="cancelOrderInfo.is_order !== 0">{{$t('order.has-driver')}}</span> -->
                <span v-if="cancelOrderInfo.fee_cancel_time && lang == 'zh'" >行程开始{{cancelOrderInfo.fee_cancel_time.value}}{{cancelOrderInfo.fee_cancel_time.type}}前可免费取消，</span>
                <span v-if="cancelOrderInfo.fee_cancel_time && lang == 'en'">Free cancellation up to {{cancelOrderInfo.fee_cancel_time.value}}{{cancelOrderInfo.fee_cancel_time.type}} before pick-up.</span>
                <span>{{$t('order.refund-money')}}{{cancelOrderInfo.currency}}{{cancelOrderInfo.refund}}</span>
            </p>
            <span v-if="cancelTitle" slot="footer" class="dialog-footer cancel-footer">
                <el-button size="small" @click="showCancelOrder = false">{{$t('order.no')}}</el-button>
                <el-button size="small" class="mt10" type="danger" @click="bindCancel(1)">{{$t('order.y-cancel')}}</el-button>
            </span>
            <div v-if="!cancelTitle" class="refund-success text-center">
                <img src="../../assets/images/cancel-scucess.png" alt="">
                <p class="fz20 color-333 fw600">{{$t('order.refund-successful')}}</p>
                <p>{{$t('order.refund-tips')}}</p>
                <el-button size="medium" round @click="bindCancel(2)">{{$t('order.ok2')}}</el-button>
            </div>
        </el-dialog>

        <!-- 取消成功 -->
         <el-dialog
            :visible.sync="showNoRefundCancel"
            width="360px"
            center>
            <div class="text-center">
                <img src="../../assets/images/no-rerund.png" alt="">
                <p class="fz20 color-333 fw600">{{$t('order.cancel-successful')}}</p>
                <p v-if="lang == 'zh'">送您一张补偿优惠券，下次下单可以用哦~</p>
                <div class="flex-between item-center coupon mt10">
                    <img class="wh40 ml10" src="../../assets/images/coupons.png" alt="">
                    <div>
                        <p class="color-333 fw600"><span class="fz16">$</span><span class="fz30">50</span><span class="fz16">通用优惠券</span></p>
                        <p class="fz12 color-666">【补偿优惠券】</p>
                        <p class="fz12 color-666">有效期至2018年2月28日</p>
                    </div>
                    <div class="use-btn"><span class="fz14 color-fff">{{$t('order.get')}}</span></div>
                </div>
                <el-button class="no-redund-cancel cursor" size="medium" round @click="showNoRefundCancel = false">{{$t('order.ok2')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    name: 'order-day-car',
    data(){
        return {
            star: 5,
            showEvaluate: false,
            evaluateValue: '',
            evaluateStar: 0,
            out_trade_no: '',
            detailInfo: {},
            orderType: '',
            operate: {'cancel': this.$t('order.cancel-order'), 'pay': this.$t('order.pay'), 'refund': this.$t('order.return-money'), 'urge': this.$t('order.urge'), 'comment': this.$t('order.customer-service')},
            status_text: '',
            use_time: '',
            isLoading: true,
            btn_out_trade_no: '',
            showNoRefundCancel: false,
            cancelTitle: this.$t('order.cancel-book'),
            showNoRefundCancel: false,
            cancelOrderInfo: {},
            showCancelOrder: false,
            showComment: false
        }
    },
    computed: {
        ...mapState({
            lang: state => state.lang
        }),
    },
    methods: {
        goOrderList() {
            this.$router.push({'name': 'orderList'})
        },
        getCharterInfo() {
            this.$axios.get(this.lang+'/order/detail?out_trade_no=' + this.out_trade_no).then((res) => {
                this.detailInfo = res.data.data;
                this.status_text = res.data.data.order.status_text;
                this.isLoading = false;
                window.scrollTo(0, 0);
            })
        },
        bindCancel(type) {
           if (type == 1) {
                this.confirmCancelOrder();
           }else {
                this.cancelTitle = this.$t('order.cancel-book');  
                this.showCancelOrder = false;
                this.getCharterInfo();
           }
       },
        operateBtn(type, out_trade_no) {
           this.btn_out_trade_no = out_trade_no;
           if (type == 'pay') {
              let money = this.detailInfo.order.currency_symbol + this.detailInfo.order.total_fee;
              sessionStorage.setItem('payParams', JSON.stringify({num :money, out_trade_no: out_trade_no}))
              this.$router.push({ name: "payorder" });
            }else if(type == 'cancel') {
               this.orderCancel(out_trade_no);
            }else if (type == 'refund') {
               this.orderRefund();
            }else if(type == 'urge') {
               this.orderUrgent();
            }else if (type == 'comment') {
                this.showEvaluate = true;
            }
       },
        comment() { //评论
            let param = {
                id: this.detailInfo.relate.driver.driver_order_id,
                score: this.evaluateStar,
                comment: this.evaluateValue
            }
            this.$axios.post(this.lang+'/order/comment', param).then((res) => {
                if (res.data.status == 1) {
                    this.$message.success(this.$t('order.comment-successful'));
                }
            })
        },
       orderUrgent() { //催派订单
          this.$axios.post(this.lang+'/order/urgent', {'out_trade_no': this.btn_out_trade_no}).then((res) => {
                if (res.data.status == 1) {
                    this.$message.success(this.$t('order.urge-successful'));
                    this.getCharterInfo();
                }
            })
       },
       orderRefund() { //退款
            this.$axios.post(this.lang+'/order/refund', {'out_trade_no': this.btn_out_trade_no}).then((res) => {
                if (res.data.status == 1) {
                    this.cancelTitle = '';
                    this.showCancelOrder = true;   
                }
            })
       },
       confirmCancelOrder() { //确认取消
           this.$axios.post(this.lang + '/order/cancel-confirm', {'out_trade_no': this.btn_out_trade_no}).then((res) => {
            //   this.cancelTitle = '';
              this.showCancelOrder = true;
              this.getCharterInfo(); 
           })
       },
       orderCancel(out_trade_no) { //取消订单
           let param = {'out_trade_no': out_trade_no};
           this.$axios.post(this.lang+'/order/cancel', param).then((res) => {
               if (res.data.data.need_alert == 0) {
                   this.showNoRefundCancel = true;
                   this.getCharterInfo();
               }else {
                   this.showCancelOrder = true;
                   this.cancelOrderInfo = res.data.data;
               }
           })
       },
    },
    mounted() {
        this.out_trade_no = this.$route.query.out_trade_no;
        this.orderType = this.$route.query.type;
        this.use_time = this.$route.query.use_time;

        this.getCharterInfo();
    }
}
</script>
<style lang="scss" scoped>
.order-day-car .left-content .no-border {
    border-top: none !important;
}
.custom-btn {
    width: 100%;
    border-radius: 4px;
    border: transparent;
    color: #fff !important;
    background: linear-gradient(#328C6E, #4B9D63);
    box-shadow: 0 2px 20px 0 rgba(51, 51, 51, 0.5);
  }
 .order-day-car {
    display: flex;
    width: 1201px;
    margin: auto;
    .coupon {
        border-radius: 12px;
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1); 
        p {
            margin: 2px 0;
            text-align: left;
        }
        .use-btn {
            background: rgba(249,189,79,1);
            border-radius:0px 12px 12px 0px;
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
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
        background:rgba(255,255,255,1);
        border-radius: 2px;
        .el-rate { display: inline; }
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
                    color: #38846A;
                    border: 1px solid #38846A;
                }
                .el-button:hover {
                    color: #4B9D63;
                }
            }
        }

        .detail-info {
            border-radius: 12px;
            border: 1px solid rgba(204,204,204,1);
            padding: 10px 25px;
            margin: 30px 0;
            .trap-info {
                p {
                    margin: 10px 0;
                }
                .line {
                    position: absolute;
                    left: 4px;
                    border-right: 1px dashed #38846A;
                    height: 26px;
                }
                .btns {
                    label {
                        display: inline-block;
                        font-size: 14px;
                        width: 110px;
                        height: 28px;
                        line-height: 28px;
                        text-align: center;
                        border-radius: 14px;
                        cursor: pointer;
                        margin-left: 10px;
                    }
                    .gray {
                        color: #666;
                        border: 1px solid #CCCCCC;
                    }
                    .green {
                        color: #38846A;
                        border: 1px solid #38846A;
                    }
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
        }
        .fee-info {
            margin-bottom: 80px;
            p { margin: 5px 0; }
            div { margin-top: 20px; }
        }
    }
    .zh-right-content {
        height: 442px;
    }
    .en-right-content {
        height: 552px;
    }
    .right-content {
        border-top: 6px solid #4B9D63;
        width: 370px;
        margin-left: 40px;
        margin-top: 45px;
        width:370px;
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 10px 0px rgba(0,0,0,0.1);
        border-radius:2px;
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
    }
 }   
</style>


