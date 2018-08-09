<!-- ##父组件引用该组件 -->
<TableDynamic :theadList="theadList" v-model="dyTableData"></TableDynamic>
<!-- 父组件传入表头 -->
theadList: {name: '姓名', sex: '性别', age: '年龄', address: '住址', hobby: '爱好'},
注：表格列（字段及列数）由父组件传入的表头数据控制
<!-- 父组件接收该组件返回的表格数据 -->
dyTableData: []


