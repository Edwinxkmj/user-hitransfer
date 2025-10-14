<template>
  <div class="classify">
    <div class="classify-title">
      <slot name="title">{{title}}</slot>
    </div>

    <ul class="classify-list" :class="{noOpen: openKey}">
      <li @click="allClick" :class="{active: value === '{}' && !cityid}">{{$t('wallet.all')}}</li>
      <li
        v-for="(item, idx) in list"
        @click="$emit('input', JSON.stringify(item))"
        :class="{active: value === JSON.stringify(item), active2: cityid == item.id && title == $t('m.hot') }"
        :key="'hot_'+idx"
      >{{itemName===""?item:item[itemName]}}</li>
    </ul>
    <div class="more color-green" @click="toOpen" v-if="title==$t('m.hot')">
      {{$t('m.more')}}
      <span class="el-icon-arrow-down" v-if="openKey"></span>
      <span class="el-icon-arrow-up" v-else></span>
    </div>

     <div class="more color-green" @click="toOpen" v-if="title==$t('m.theme') && lang == 'en'">
      {{$t('m.more')}}
      <span class="el-icon-arrow-down" v-if="openKey"></span>
      <span class="el-icon-arrow-up" v-else></span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ClassifyList",
  props: {
     value: {
        type: [String, Number],
        default: '全部',
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    cityid: {
       default: ""
    },
    title: {
      type: String,
      default: ""
    },
    itemName: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang
    })
  },
  data() {
    return {
      openKey: true
    };
  },
  methods: {
    toOpen() {
      this.openKey = !this.openKey;
    },
     allClick() {
      this.$emit('input', Math.random());
    }
  }
};
</script>

<style lang="scss">
.el-card {
  border: 0;
  background-color: none;
}

.classify {
  position: relative;
  padding: 12px 0;

  .classify-title {
    position: absolute;
    font-size: 16px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    width: 100px;
    text-align: center;
  }

  .classify-list {
    padding: 0 100px;
    overflow: hidden;
    display: -webkit-box;
    &.noOpen {
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    li:hover {
      color: #38846A;
    }

    li {
      display: inline-block;
      font-size: 16px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      margin: 0 20px 10px;
      cursor: pointer;

      &.active {
        color: #38846A;
        font-weight: 500;
      }

      &.active2 {
          color: #38846A;
         font-weight: 500;
      }

    }
  }

  .more {
    position: absolute;
    width: 100px;
    text-align: center;
    font-size: 16px;
    right: 0;
    top: 10px;
    cursor: pointer;
  }
}
</style>
