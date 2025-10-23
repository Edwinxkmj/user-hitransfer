<template>
    <div class="cusomize-dts">
        <div class="left-content">
            <div class="left-content-top">
                <p class="cursor" @click="goOrderList"><img class="el-icon-back" src="../../assets/images/backarrow.png"/> <span class="fz14 color-666 ml10">返回</span></p>
                <div class="flex-between">
                    <div class="air-plane">
                        <div class="air-plane-title mt20">
                            <span class="fz16 color-333 fw600">{{detailInfo.relate.title}}</span>
                        </div>
                        <div class="flex-between service-info">
                            <div class="fz14 color-333">
                                <p>私人定制</p>
                            </div>
                            <div class="fz14 color-333">
                                <p>{{detailInfo.order.currency_symbol}}{{detailInfo.order.base_fee}}</p>
                            </div>
                        </div>
                        <div class="flex-between pay-num">
                            <div class="color-333 fw550">
                                <p class="fz16">总价</p>
                                <p class="fz14 mt5">可得佣金8% <img class="wh14 ml5" src="../../assets/images/detail.png" alt=""></p>
                            </div>
                            <div class="color-green">
                                <p class="fz22">{{detailInfo.order.currency_symbol}}{{detailInfo.order.total_fee}}</p>
                                <p class="fz16 text-right">{{detailInfo.order.currency_symbol}}{{detailInfo.order.rebate_fee}}</p>
                            </div>
                        </div>
                    </div>
                    <img class="map-img" v-lazy="detailInfo.relate.img" alt="">
                </div>
                <div class="flex-between pay-info mt5">
                    <div class="flex-between pay-num"></div>
                    <div class="bind-btns">
                        <el-button v-for="item2 in detailInfo.order.operate" :key="item2" @click="operateBtn(item2)" :class="{'green': item2=='pay' || item2 == 'refund', 'black': item2 == 'cancel' || item2 == 'urge'}">{{operate[item2]}}</el-button>
                    </div>
                </div>

                <div class="detail-info">
                    <div class="p-relative trap-info">
                        <p class="flex-between">
                            <span><img class="wh10" src="../../assets/images/reservationtime.png" alt=""> <label class="fz14 color-666 ml5">{{detailInfo.relate.start_date}} ~ {{detailInfo.relate.end_date}}</label></span>
                            <span class="fz14 color-green">{{status_text}}</span>
                        </p>
                        <p><img class="wh10" src="../../assets/images/reservationstart.png" alt=""> <label class="fz16 color-333 fw600 ml5">{{detailInfo.relate.route_title}}</label> <i class="el-icon-arrow-right
    "></i></p>
                    </div>
                    <div class="flex-between detail-text mt20">
                        <div>
                            <p>同行人数</p>
                            <p>联系人</p>
                            <p>手机号</p>
                            <p>定制单号</p>
                        </div>
                        <div class="text-right">
                            <p><label>成人*2，儿童*0</label></p>
                            <p><label>{{detailInfo.contact.contact_name}}</label></p>
                            <p><label>{{detailInfo.contact.contact_mobile}}</label></p>
                            <p><label>xx</label></p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 线路及规则说明 -->
            <div class="left-content-bottom mt60">
                <h3 class="fz22 color-333 fw600 p-relative">线路安排</h3>
                <div class="trap" v-for="(item,index) in detailInfo.relate.days" :key="index">
                    <div class="flex item-center">
                        <p class="time title"><span>DAY{{item.day}}</span></p>
                        <p class="fz16 ml25"><label class="color-333">{{item.city}}</label> <span class="color-666">{{item.hours}}小时({{item.distance}}公里)</span></p>
                    </div>
                    <div v-for="(citem, cindex) in item.schedule" :key="cindex">
                       <div class="flex">
                             <p class="time">
                                <span class="fz14 color-333 ml35">{{citem.start_time}}</span>
                                <img class="wh20 p-relative" style="top: 4px;left: 15px;" src="../../assets/images/beginEnd.png" alt="">
                            </p>
                            <p class="fz14 ml25 mt15" style="width: 560px">
                                <span class="color-333 fw600">CROWN酒店出发</span><br>
                                <span class="color-333">{{citem.descript}}</span>
                            </p> 
                       </div>
                       <div class="flex">
                           <p class="time"></p>
                            <p class="trap-img ml25">
                                <img v-for="(ccitem, ccindex) in citem.img_list" :key="ccindex" v-lazy="ccitem" alt="">
                            </p>  
                       </div>
                    </div>
                </div>
                <h3 class="fz22 color-333 fw600 p-relative mt40">费用说明</h3>
                <p class="ml15 color-78A17D fz16 fw600 mt30">• &nbsp;费用包含</p>
                <div class="fz14 color-333 plf30">
                    <p>1. 墨尔本市内区域酒店(机场酒店除外)至景点间以及景点之间交通往返接驳车费. 以及车辆所需费用：车辆燃油费、停车费、高速费、车辆使用费、进城费、拥堵费； </p>
                    <p>2. 含用车险（需提供证件信息、司兼导服务费(不陪同进景点)、燃油费、过路费、高速费，司兼导用餐补助费用； </p>
                    <p>3. 免费车内纸巾 + 矿泉水；</p>
                    <p>4. 车辆 10 小时/天单日使用费（正常服务时间08:00 - 22:30），夜间服务时间为 22:30 - 08:00（另收费）； </p>
                    <p>5. 所选车辆400公里/天单日使用费用。</p>
                </div>
                 <p class="ml15 mt30 color-orange fz16 fw600">• &nbsp; 费用不包含</p>
                <div class="fz14 color-333 plf30">
                    <p>1. 因交通延阻、罢工、天气、飞机、机器故障、航班取消或更改时间等不可抗原因所导致的超时及超公里费用； </p>
                    <p>2. 一切个人消费及费用包含中未提及的任何费用，包括但不限于住宿费用、餐费，景点门票、当地参加的自费项目以及其他个人消费费用；  </p>
                    <p>3. 夜间服务费:若在当地时间晚 10:31 至次日早 07:59 之间使用车辆及司导服务， 需现付司导夜间服务费用100 人民币/天； </p>
                    <p>4. 若在实际行程中，因客人游览时间过长导致超出 10 小时标准服务范围(超过 15 分钟即算 1 小时)，则需要向司导直接支付超时费（超时费收费标准: 5-7 座车收费 200 元人民币 / 小时，8 座及以上车型收取 250 元人民币 / 小时)；超公里数按: 5人民币/公里收费； </p>
                    <p>5. 如需儿童座椅请提前告知(依照澳洲相关法律，7 周岁及以下儿童必需乘坐儿童座椅，不可由成人怀抱乘坐)： 第一个儿童座椅免费，若需要请在下单时备注或及时告知客服备注； 第二个开始每个收费 100 元人民币；  </p>
                    <p>6.一切个人消费及费用包含中未提及的任何费用。</p>
                </div>
                <hr class="line">
                <h3 class="fz22 color-333 fw600 p-relative">退改规则</h3>
                 <div class="fz14 color-333 plf30">
                     <p>该产品支持取消，如需取消，请登录Hitransfers账户，至"我的行程"中，申请取消 </p>
                     <p><span class="fw600">该产品支持部分退</span><br> 使用日期前5天17:00之前(含)，扣除买家订单金额0%作为卖家损失费 使用日期前3天17:00之前(含)，扣除买家订单金额30%作为卖家损失费 使用日期前2天17:00之前(含)，扣除买家订单金额50%作为卖家损失费 使用日期前2天17:00之后，扣除买家订单金额100%作为卖家损失费 </p>
                     <p><span class="fw600">如在行程前因旅行社违约而无法为您提供用车服务，我们将按照以下规则赔付</span><br>（每张订单最低赔付100元，最高赔付2000元/订单）： 1. 约定用车日期前7天及以前赔付订单金额20%； 2. 约定用车日期前6天及前赔付3天订单金额30%； 3. 约定用车日期前2天至前赔付1天订单金额50%； 4. 约定用车日期前24小时内赔付订单金额的100%； 5. 使用日期前2个工作日内预定（当地时间）不可退改； 6. 出发当天，因客人个人原因导致的无法出行不可退改。</p>
                 </div>
                 <hr class="line">
                <h3 class="fz22 color-333 fw600 p-relative">注意事项</h3>
                 <div class="fz14 color-333 plf30">
                    <p>1. 如需要乘车意外险，请您在预订时提供准确信息，包含（姓名、性别、身份证号码、国籍），如因客人提供错误个人信息或者没有提供而造成损失，我司不承担任何责任（特别提示：请您在下单时务必将出行信息【接送地址、出行人数、行李数以及大小，是否有儿童、联系方式】填写在备注信息栏，以便我们尽快为您出单）； </p>
                    <p>2.年龄限制：70周岁（含）以上老年人或18周岁以下客人预订出行需确保身体健康适宜旅游，并有22周岁以上家属或朋友（因服务能力所限无法接待及限制接待的人除外）全程陪同出行；</p>
                    <p>3.本行程若由于天气、交通、罢工、安全等原因临时变更或暂停，或，因个人原因迟到或未参加行程，我司不承担责任，无法取消本行程或退回行程费用；</p>
                    <p>4. 行程中途若客人脱团将无法退还剩余或全部行程款项，且由此导致的各种人身安全、财产安全问题，我司不承担责任； </p>
                    <p>5. 本行程不含午餐晚餐安排，且午餐晚餐费用需自理。部分餐厅不可携带外食进入餐厅用餐或仅占用位子不点餐，敬请留意各餐厅具体要求； </p>
                    <p>6. 如您的预订要求与我们的行程产品不一致，请随时咨询在线客服定制专属行程； 7.关于儿童座椅：境外7岁以下儿童必须乘坐儿童座椅且不能怀抱，所以儿童也要计入乘坐人数。第一个座椅免费提供（儿童安全座椅约占1.5成人位），请严格遵守相关法律政策规定。</p>
                 </div><br><br>
            </div>
         </div>
         <!-- 右边 -->
        <div class="right-content" :class="{'zh-right-content': lang == 'zh', 'en-right-content': lang == 'en'}">
            <div class="rule">
                <h3>{{$t('order.refund-rules')}}</h3>
                <p>{{$t('order.refund-rules-tips1')}} </p>
                <p>{{$t('order.refund-rules-tips2')}} </p>
                <p>{{$t('order.refund-rules-tips3')}}  </p>
                <p>{{$t('order.refund-rules-tips4')}}</p>
                <p>{{$t('order.refund-rules-tips5')}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    name: 'cusomize-dts',
    data() {
        return {
            out_trade_no: '',
            detailInfo: {},
            operate: {'cancel': '取消订单', 'pay': '支付订单', 'refund': '申请退款', 'urge': '催派'},
        }
    },
    computed: {
        ...mapState({
            lang: state => state.lang
        }),
    },
     mounted() {
        this.out_trade_no = this.$route.query.out_trade_no;
        this.status_text = this.$route.query.status_text;
        this.getOrderDetail();
    },
     methods: {
        getOrderDetail() {
            this.$axios.get(this.lang+'/order/detail?out_trade_no='+this.out_trade_no).then((res) => {
                console.log(res)
            })
            this.detailInfo = {
                "order": {
                    "base_fee": 615.38,
                    "brand_pick_up_fee": 0,
                    "discount_fee": 0,
                    "hight_way_fee": 0,
                    "children_seat_fee": 0,
                    "total_fee": 615.38,
                    "rebate_fee": 8.41,
                    "currency_symbol": "$",
                    "out_trade_no": "20190801150234581255",
                    "create_time": "2019-08-01 15:02:34",
                    "remark": "",
                    "operate": [
                        "cancel",
                        "pay"
                    ]
                },
                "relate": {
                    "title": "私人定制五天自由行",
                    "route_title": "大洋路|企鹅岛xxxx",
                    "start_date": "2019-08-20",
                    "end_date": "2019-08-22",
                    "img": "https://skycarglobal.oss-ap-southeast-2.aliyuncs.com/dbd905eb666035ded20184e780889cb6.png",
                    "days": {
                        "day": 1,
                        "city": "Laane",
                        "hours": 10,
                        "distance": 127,
                        "schedule": {
                            "zh": [
                                {
                                    "start_time": "09:00:00",
                                    "descript": "Skycar专属司导会到您的指定地点接您",
                                    "img_list": ""
                                },
                                {
                                    "start_time": "10:00:00",
                                    "descript": "大概10点左右我们将到达彩虹小屋，在此留下我们独有的纪念。",
                                    "img_list": [
                                        "https://skycarglobal.oss-ap-southeast-2.aliyuncs.com/dbd905eb666035ded20184e780889cb6.png",
                                        "https://skycarglobal.oss-ap-southeast-2.aliyuncs.com/73c85aafc03cff7124852a4c887a59e2.png"
                                    ]
                                },
                                {
                                    "start_time": "12:30:00",
                                    "descript": "大概经过1小时15分钟的车程，我们将来到魔法迷宫花园。",
                                    "img_list": [
                                        "https://skycarglobal.oss-ap-southeast-2.aliyuncs.com/9783d1529260325b77a6a08ab6c8593b.png",
                                        "https://skycarglobal.oss-ap-southeast-2.aliyuncs.com/7379d4986bdb94a2ee4a9d57e4972731.png"
                                    ]
                                },
                                {
                                    "start_time": "15:30:00",
                                    "descript": "大概经过20分钟的车程我们将来到莫宁顿半岛温泉  Peninsula Hot Springs",
                                    "img_list": [
                                        "https://skycarglobal.oss-ap-southeast-2.aliyuncs.com/27134a0ab7909ea5d6da5176fd6aa9a8.png",
                                        "https://skycarglobal.oss-ap-southeast-2.aliyuncs.com/f9be5dbed5151694619518e535f51604.png",
                                        "https://skycarglobal.oss-ap-southeast-2.aliyuncs.com/acbf08d426e52f37d10ca6b2314d1438.png",
                                        "https://skycarglobal.oss-ap-southeast-2.aliyuncs.com/0e98a0a6c491776cc1601790435a757a.png"
                                    ]
                                },
                                {
                                    "start_time": "05:00:00",
                                    "descript": "返程；在结束了今天的欢乐旅程后，我们也将驱车返回住处，结束一天奇妙的行程。",
                                    "img_list": ""
                                }
                            ]
                        }
                    }
                },
                "contact": {
                    "contact_name": "张三",
                    "contact_mobile": " 8613980581087",
                    "wechat": "微信号",
                    "spare_contact_name": "",
                    "spare_contact_mobile": ""
                }
    }
        },
        goOrderList() {
            this.$router.push({'name': 'orderList'})
        }
    }
}
</script>
<style lang="scss" scoped>
.custom-btn {
    width: 100%;
    border-radius: 4px;
    border: transparent;
    color: #fff !important;
    background: linear-gradient(#328C6E, #4B9D63);
    box-shadow: 0 2px 20px 0 rgba(51, 51, 51, 0.5);
  }
  .cusomize-dts {
    display: flex;
    width: 1201px;
    margin: auto;

    .left-content {
        width: 790px;
        margin-top: 45px;
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
        background:rgba(255,255,255,1);
        border-radius: 2px;
        .line {
            border-top: 1px solid #f1f1f1;
            margin: 50px 0;
        }
        .left-content-top {
            padding: 0 45px 0 45px;
        }
        .left-content-bottom {
            h3 { padding-left: 20px; }
            h3::before {
                position: absolute;
                left: 0;
                content: "|";
                color: #4B9D63;
            }
            .trap {
                p {
                    margin: 10px 0;
                }
                .time {
                     width: 137px;
                     text-align: center;
                }
                .trap-img img {
                    width: 250px;
                    height: 160px;
                }
                .title {
                    background: linear-gradient(#328C6E, #4B9D63);
                    color: #fff;
                    border-radius: 0px  12px  12px  0px;
                    height: 30px;
                    line-height: 30px;
                }
            }
        }
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
         .pay-num {
              width: 300px; 
            p {
                vertical-align: top;
                margin: 0;
            } 
        }
        .pay-info {
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


