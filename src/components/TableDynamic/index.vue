<template>
  <div class="box">
    <div class="add-btn">
      <i class="el-icon-circle-plus"></i>
      <span @click='handleInsert'>插入行</span>
    </div>
    <div class="table-box">
      <table>
        <thead>
          <tr>
            <td><div class="con-col">序号</div></td>
            <td v-for="(item,index) in theadList" v-bind:key="index">{{item}}</td>
            <td><div class="con-col">操作</div></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for='(item,index) in pageData' v-bind:key="index">
            <td><span>{{index+1}}</span></td>
              <td v-for="(node,index) in Object.keys(theadList)" v-bind:key="index">
                  <input type="text" v-model="item[node]" class="input-box"/>
              </td>
            <td class="con-col"><span @click='handleDelSingle(index)'>删除</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="page-turn">
      <div class="record">共
        <span>{{pageParams.total}}</span>条记录 第 {{pageParams.currentPage}}/{{Math.ceil(pageParams.total/pageParams.pageSize)}}页
      </div>
      <div class="page-wrap">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background :current-page="pageParams.currentPage"
        :page-size="pageParams.pageSize"
        layout="prev, pager, next, jumper"
        :total="pageParams.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableDynamic',
  data () {
    return {
      // 清空
      // isempty: '',
      theadList: {name: '姓名', sex: '性别', age: '年龄', address: '住址', hobby: '爱好'},

      formArray: [],
      // 总记录条数
      totalData: [],
      // 分页所需记录条数
      pageData: [],
      // 分页参数
      pageParams: {
        currentPage: 1,
        total: 1,
        pageSize: 5
      }
    }
  },
  // props: {
  //   theadList: Object
  // },
  methods: {
    // 分页大小改动
    handleSizeChange (val) {
      this.pageParams.pageSize = val
      this.initPageData()
    },
    // 分布当前页数改动
    handleCurrentChange (val) {
      this.pageParams.currentPage = val
      this.initPageData()
    },
    // 初始化分页数据
    initPageData () {
      const start =
        (this.pageParams.currentPage - 1) * this.pageParams.pageSize
      this.pageData = this.formArray.slice(
        start,
        start + this.pageParams.pageSize
      )
    },
    // 向末尾插入一行
    handleInsert () {
      this.formIncrement()
      this.initPageData()
    },
    // 删除指定的一行
    handleDelSingle (index) {
      this.formArray.splice(index, 1)
      this.initPageData()
    },
    // 表单数组自增
    formIncrement () {
      const obj = {}
      for (const key in this.theadList) {
        obj[key] = ''
      }
      this.formArray.push(obj)
    }
  },
  created () {
    // 初始化表格的行数
    for (let i = 0; i < 5; i++) {
      this.formIncrement()
    };
    this.pageParams.total = 1
    this.initPageData()
  },
  watch: {
    formArray: {
      handler (val) {
        this.pageParams.total = this.formArray.length
        // 打印出表单变化后的值
        this.$emit('input', val)
      },
      deep: true
    },
    // 解决删除条数时自动翻页
    pageData: {
      handler: function (val) {
        if (!this.pageData.length) {
          --this.pageParams.currentPage
          this.initPageData()
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.add-btn {
  color: green;
  cursor: pointer;
  text-align: left;
}
.table-box {
  height: 400px;
  overflow: scroll;
}
.table-box::-webkit-scrollbar {
  width: 0px;
}
.table-box::-webkit-scrollbar-thumb {
  background-color: #20436A;
}
tr {
  height: 50px;
  background-color: #2B4B6E;
}
thead tr td {
  color: #fff;
  border: 0;
}
.con-col {
  width: 90px;
}
tbody tr td {
  border: 0;
}
tbody tr:hover {
  background-color: rgb(58, 88, 121);
}
tbody tr input:hover {
  background-color: rgb(58, 88, 121);
}
input {
  height: 50px;
  color: #808183;
  background-color: rgb(43, 75, 110);
}
tbody tr td span {
  color: #42b6f6;
  cursor: pointer;
}
</style>
