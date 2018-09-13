<template>
  <div class="table-box">
  <el-button @click="tab" icon="el-icon-arrow-left">动态表格</el-button>
  <el-table
  :data="realData"
  :row-style="showRow"
  v-bind="$attrs"
  class="table"
  empty-text=" "
  >
    <el-table-column v-for="(column, index) in columns" :key="column.value" :label="column.text" :width="column.width">
      <template slot-scope="scope">
        <span v-show="index === 0" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
        <span class="tree-ctrl" v-show="iconShow(index,scope.row)">
          <!-- <i class="el-icon-plus" @click="toggleExpanded(scope.$index)"></i> -->
          <i :class="{'el-icon-plus': !scope.row._expanded, 'el-icon-minus': scope.row._expanded}" @click="toggleExpanded(scope.$index)"></i>
          <!-- <i class="el-icon-minus" @click="toggleExpanded(scope.$index)"></i> -->
        </span>
        {{scope.row[column.value]}}
      </template>
    </el-table-column>
    <slot>
      <el-table-column prop="selectPerm" label="查看" width="100px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.selectPerm" @change="messageCheck(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="updatePerm" label="修改" width="100px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.updatePerm" @change="messageUpdate(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
    </slot>
  </el-table>
</div>
</template>

<script>
/**
            Auth: Lei.j1ang
            Created: 2018/1/19-13:59
          */
import treeToArray from './eval'
export default {
  name: 'PublishBill',
  props: {
    emptyTree: String,
    // isLoading: Boolean,
    // data: {
    //   type: [Array, Object]
    //   // required: true
    // },
    // columns: {
    //   type: Array,
    //   default: () => []
    // },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      columns: [],
      data: [],
      loading: true,
      rows: [],
      allData: [],
      treeData: [],
      realData: []
    }
  },
  created: function () {
    this.columns = [
      {
        text: '',
        value: 'label'
      }
    ]
    this.data = [
      {
        id: '1',
        label: '中国',
        level: 0,
        childrenNote: [
          {
            id: '11',
            label: '河南',
            level: 1
          },
          {
            id: '12',
            label: '重庆',
            level: 1
          }
        ]
      },
      {
        id: '2',
        label: '美国',
        level: 0
      }
    ]
    global.vue = this
  },
  watch: {
    emptyTree: {
      handler (val) {
        if (this.emptyTree === '1') {
          this.treeData = []
          this.formatData = []
        }
      }
    },
    treeData: {
      handler (val) {
        // 打印变化后的值
        // console.log('变化后的值', val)
        this.$emit('treeData', val)
      },
      deep: true
    },
    formatData: {
      handler (val) {
        // debugger;
        this.handleData()
      },
      deep: true
    }
  },
  computed: {
    // 格式化数据源
    formatData () {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      const res = func.apply(null, args)
      // 首次渲染一级目录
      this.$set(this, 'realData', this.formateArr(res, 1))
      return res
    }
  },
  methods: {
    // 切换表格
    tab () {
      this.$router.push({path: '/'})
    },
    handleData () {
      this.treeData = []
      this.formatData.map((item, index) => {
        if (item.selectPerm || item.updatePerm) {
          const obj = {
            id: item.id,
            selectPerm: item.selectPerm ? '1' : '0',
            updatePerm: item.updatePerm ? '1' : '0'
          }
          this.treeData.push(obj)
        }
      })
    },
    // 根据等级重构数组
    formateArr (arr, lev) {
      const newArr = []
      arr.map((item) => {
        if (item.level <= lev) {
          newArr.push(item)
        }
      })
      return (newArr)
    },
    messageCheck (row) {
      const row_i = this.formatData.filter(v => {
        return v.id === row['id']
      })[0]
      const selected = row.selectPerm
      childSelect(row)
      childSelect(row_i)
      parentSelect(row)
      parentSelect(row_i)
      // 当该节点及其兄弟节点全部被选中或取消之后，父节点同样选中或取消
      function parentSelect (row) {
        const parent = row['parent']
        if (parent) {
          const brotherNodes = row.parent.childrenNote
          let len = 0
          for (let i = 0; i < brotherNodes.length; i++) {
            if (brotherNodes[i].selectPerm) {
              len += 1
            }
          }
          row.parent.selectPerm = len === brotherNodes.length
          parentSelect(parent)
        }
      }
      // 选中或取消该节点的所有子节点
      function childSelect (row) {
        const children = row['childrenNote']
        if (children) {
          for (let i = 0; i < children.length; i++) {
            children[i].selectPerm = selected
            childSelect(children[i])
          }
        }
      }
    },
    messageUpdate (row) {
      const row_i = this.formatData.filter(v => {
        return v.id === row['id']
      })[0]
      const selected = row.updatePerm
      childSelect(row)
      childSelect(row_i)
      parentSelect(row)
      parentSelect(row_i)
      // 当该节点及其兄弟节点全部被选中或取消之后，父节点同样选中或取消
      function parentSelect (row) {
        const parent = row['parent']
        if (parent) {
          const brotherNodes = row.parent.childrenNote
          let len = 0
          for (let i = 0; i < brotherNodes.length; i++) {
            if (brotherNodes[i].updatePerm === true) {
              len += 1
            }
          }
          if (len === brotherNodes.length) {
            row.parent.updatePerm = true
          } else {
            row.parent.updatePerm = false
          }
          parentSelect(parent)
        }
      }
      // 选中或取消该节点的所有子节点
      function childSelect (row) {
        const children = row['childrenNote']
        if (children) {
          for (let i = 0; i < children.length; i++) {
            children[i].updatePerm = selected
            childSelect(children[i])
          }
        }
      }
    },
    showRow: function (row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    updateData: function (arr, lev, record) {
      // const parents = (function(){})()
      const newArr = []
      arr.map((item) => {
        if (item.level < lev) {
          newArr.push(item)
        } else if (item.level === lev && item.parent.id === record.id) {
          newArr.push(item)
        }
      })
      return (newArr)
    },
    // 切换下级是否展开
    toggleExpanded: function (trIndex) {
      // debugger;
      const { realData } = this
      const record = this.realData[trIndex]
      const records_o = realData.filter((v) => {
        return v.parent === record.parent && v.id !== record.id
      })
      const t_index = record._level
      if (t_index >= 3) {
        this.$set(this, 'realData', this.updateData(this.formatData, t_index, record))
        // this.$set(this, 'realData', this.formatData);
      } else {
        this.$set(this, 'realData', this.formateArr(this.formatData, t_index))
      }
      record._expanded = !record._expanded
      records_o.map((v) => {
        v._expanded = false
      })
      // this.updateData(trIndex);
    },
    // 图标显示
    iconShow (index, record) {
      return (index === 0 && record.childrenNote && record.childrenNote.length > 0)
      // return (record.childrenNote && record.childrenNote.length > 0);
    }
  }
}
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @-webkit-keyframes treeTableShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

</style>

<style lang="scss" rel="stylesheet/scss" scoped>
.table {
    height: 600px;
    overflow-y: scroll;
    overflow-x: hidden;
}
  .table::-webkit-scrollbar {
    width: 0px;
  }
  /* .table-box::-webkit-scrollbar-thumb {
    background-color: rgb(106, 32, 57) !important;
  } */

  $color-blue: #2196F3;
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }

  .processContainer {
    width: 100%;
    height: 100%;
  }

  table td {
    line-height: 26px;
  }

  .tree-ctrl {
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
  }

</style>
