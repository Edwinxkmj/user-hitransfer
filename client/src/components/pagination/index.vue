<template>
  <div class="c-pagination">
    <button class="icon-prev"
            @click="$emit('update:currentPage', currentPage-1)"
            :disabled="currentPage<=1">
    </button>
    <ul class="c-pager">
      <li v-for="num in totalPage"
          @click="$emit('update:currentPage', num)"
          :class="{current: num === currentPage}"
          :key="num">
        {{num}}
      </li>
    </ul>
    <button class="icon-next"
            @click="$emit('update:currentPage', currentPage+1)"
            :disabled="currentPage*pageSize>=total">
    </button>
  </div>
</template>

<script>
  export default {
    name: "pagination",
    props: {
      pageSize: {
        type: Number,
        default: 15,
      },
      currentPage:{
        type: Number,
        default: 1,
      },
      total:{
        type: Number,
        default: 0,
      }
    },
    data() {
      return {}
    },
    methods: {},
    computed:{
      totalPage(){
        let quotient = this.total%this.pageSize;
        let pageNum = parseInt(this.total/this.pageSize) + ((quotient===0 && this.total===0) ? 0 : 1);
        let pageArr = [];
        for (let i=1; i<=pageNum; i++){
          pageArr.push(i);
        }
        return pageArr;
      }
    },
    watch:{
      currentPage(){
        this.$emit('page-change');
      },
    }
  }
</script>

<style scoped lang="scss">
  .c-pagination{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;

    button:disabled {
      background-color: #fff !important;
    }

    .c-pager{
      padding: 0 20px;

      li{
        display: inline-flex;
        box-sizing: border-box;
        width: 40px;
        height: 40px;
        border: 1px solid rgba(153,153,153,1);
        border-radius: 50%;
        font-size:16px;
        color: #555;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-right: 5px;

        &:last-child{
          margin-right: 0;
        }

        &.current{
          background-color: #4B9D63;
          // background-color: linear-gradient(#4B9D63, #328C6E);
          border-color: transparent;
          color: white;
        }
      }
    }

    button{
      width: 40px;
      height: 40px;
      background-size: contain;
      background-repeat: no-repeat;
      background-color: transparent;
      border: 0;
      outline: 0;
      cursor: pointer;
      border-radius: 50%;

      &.icon-prev{
        background-image: url("../../assets/images/black_left.png");
      }
      &.icon-next{
        background-image: url("../../assets/images/black_right.png");
      }

      &:disabled{
        background-color: #ccc;
      }
    }
  }
</style>
