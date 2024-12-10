<template>
  <!--
  整体布局:
  pks-container
  |-- topology
      |-- input-menu
          |-- file-input -- backend-input
      |-- network-topology
  |-- function-menu
      |-- subComponent
  -->
  <div class="pks-container">
    <div class="topology">
      <!-- 添加输入 -->
      <div class="input-menu">
        <!-- 文件输入 -->
          <input class="file-input" type="file" accept=".json" @change="handleFileUpload" />

        <!-- 后端服务输入 -->
          <button class="backend-input" @click="fetchDataFromBackend" >从后端获取数据</button>
      </div>
      <!-- 拓扑图展示 -->
      <div class="network-topology">
        <svg ref="svg" width="100%" height="100%">
          <!-- 渲染网络拓扑中的节点 -->
          <g v-for="(node) in nodes" :key="node.id">
            <circle
              :cx="node.Latitude"
              :cy="node.Longitude"
              r="5"
              :stroke="node.id === selectedNode ? 'red' : 'blue'"
              stroke-width="3"
              :fill="node.id === selectedNode ? 'red' : 'blue'"
              @click="selectNode(node.id)" />
            <text :x="node.x" :y="node.y" fill="white" font-size="12" text-anchor="middle" dy="4">{{ node.label }}</text>
          </g>
          <!-- 渲染网络拓扑中的边 -->
          <g v-for="(connection, index) in connections" :key="index">
            <line
              :x1="getNodeById(connection.srcID).Latitude"
              :y1="getNodeById(connection.srcID).Longitude"
              :x2="getNodeById(connection.dstID).Latitude"
              :y2="getNodeById(connection.dstID).Longitude"
              :stroke="connection === selectedConnection ? 'green' : 'gray'"
              stroke-width="2"
              @click="selectConnection(connection)" />
          </g>
        </svg>
      </div>
    </div>
    <div class="function-menu">
      <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" class="subComponent">
        <el-menu-item index="1">网算一体</el-menu-item>
        <el-menu-item index="2">转义模块</el-menu-item>
        <el-menu-item index="3">网管模块</el-menu-item>
        <el-menu-item index="4">认知模块</el-menu-item>
      </el-menu>
      <!-- 动态加载不同模块 -->
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<script>
import {ref} from 'vue'
import {ElMenu, ElMenuItem, ElTabs, ElTabPane} from 'element-plus'

// 导入子模块组件
import NetCalculation from './SubComponent_1/NetCalculation.vue'
import EscapeModule from './SubComponent_2/EscapeModule.vue'
import NetworkManagement from './SubComponent_3/NetworkManagement.vue'
import CognitiveModule from './SubComponent_4/CognitiveModule.vue'

export default {
  components: {
    ElMenu,
    ElMenuItem,
    ElTabs,
    ElTabPane,
    NetCalculation,
    EscapeModule,
    NetworkManagement,
    CognitiveModule
  },
  setup() {
    const nodes = ref([]);
    const connections = ref([]);
    const selectedNode = ref(null);
    const selectedConnection = ref(null);
    const activeIndex = ref('1');
    // 根据选中的菜单项来决定加载哪个子组件
    const activeComponent = ref('NetCalculation');

    // 手动切换子模块
    const handleSelect = (key) => {
      // 切换显示的模块
      switch (key) {
        case '1':
          activeComponent.value = 'NetCalculation';
          break;
        case '2':
          activeComponent.value = 'EscapeModule';
          break;
        case '3':
          activeComponent.value = 'NetworkManagement';
          break;
        case '4':
          activeComponent.value = 'CognitiveModule';
          break;
        default:
          activeComponent.value = 'NetCalculation';
      }
    };
    // 手动选取文件读取网络数据(json)
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = JSON.parse(e.target.result);
          // 解析并更新 nodes 和 connections 数据
          updateNetworkData(data);
        };
        reader.readAsText(file);
      }
      else{
        console.log("文件读取失败")
      }
    };
    // 启动后端读取网络数据(json)
    function fetchDataFromBackend() {
      fetch('http://localhost:8000/project1/initTopo', {
        method: 'POST', // 使用 POST 请求
        headers: {
          'Content-Type': 'application/json', // 设置请求头
        },
        body: JSON.stringify({}) // 如果需要传递数据，可以在这里添加，例如：{ param1: value1 }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('网络响应不是 OK');
        }
        return response.json(); // 解析响应为 JSON
      })
      .then(data => {
          console.log(`读取数据:`, data); // 正确输出获取的数据
          updateNetworkData(data); // 使用解析后的数据
      })
      .catch(error => {
        console.error('获取数据失败:', error);
      });
    }
    // 网络数据处理
    const updateNetworkData = (data) => {

      // data 格式校验
      if (!data || !data.platform || !data.topology) {
        console.error('数据格式不正确');
        return;
      }
      const topology = data.topology;
      const platforms = data.platform;

      //转存node数据(json)
      nodes.value = platforms.map(platform => ({
        id: platform.id,
        Name: platform.platformName,
        nodeType: platform.type,
        range: platform.range,
        protocols: platform.protocols,
        platformType: platform.platformType,
        cluster_id: platform.cluster_id,
        cpuType: platform.cpuType,
        Latitude: platform.platformLatitude,
        Longitude: platform.platformLongitude,
        Height: platform.platformHeight,
        label: platform.platformName,
        memory: platform.memory,
        commandChain: platform.commandChain,
        side: platform.platformSide,
        sceneName: platform.sceneName
      }));
      // 日志输出: 使用 forEach 循环输出所有node数据
      console.log("所有节点数据:");
      nodes.value.forEach(node => {
        console.log(`ID: ${node.id}, Name: ${node.Name}, nodeType: ${node.nodeType},
          range: ${node.range}, protocols: ${node.protocols}, platformType: ${node.platformType},
          cluster_id: ${node.cluster_id}, cpuType: ${node.cpuType},
          Latitude: ${node.Latitude}, Longitude: ${node.Longitude},
          Height(meter): ${node.Height}, label: ${node.label}, memory: ${node.memory},
          commandChain: ${node.platformSide}, side: ${node.platformSide},
          sceneName: ${node.sceneName}
        `);
      });

      //转存connection数据(json)
      connections.value = topology.map(topology => ({
        srcID: topology.txId,
        dstID: topology.rxId,
        srcLatitude: topology.rxX,
        srcLongitude: topology.rxY,
        srcHeight: topology.rxZ,
        dstLatitude: topology.txX,
        dstLongitude: topology.txY,
        dstHeight: topology.txZ,
        srcType: topology.rxType,
        dstType: topology.txType,
        connectionDelay: topology.delay,
        connectionBandwidth: topology.bandwidth,
        connectionPackageLoss: topology.packageLoss,
        connectionJitter: topology.jitter
      }));
      // 日志输出: 使用 forEach 循环输出所有connection数据
      console.log("所有边数据:");
      connections.value.forEach(connection => {
        console.log(`srcID: ${connection.srcID}, srcType: ${connection.srcType},
          srcLatitude: ${connection.srcLatitude}, srcLongitude: ${connection.srcLongitude}, srcHeight: ${connection.srcHeight},
          dstID: ${connection.dstID}, dstType: ${connection.dstType},
          dstLatitude: ${connection.dstLatitude}, dstLongitude: ${connection.dstLongitude}, dstHeight: ${connection.dstHeight},
          connectionDelay: ${connection.connectionDelay}, connectionBandwith: ${connection.connectionBandwith},
          connectionPackgeLoss: ${connection.connectionPackgeLoss}, connectionJitter: ${connection.connectionJitter}
        `);
      });

    };


    const getNodeById = (id) => {
      return nodes.value.find(node => node.id === id) || {};
    };

    const selectNode = (nodeId) => {
      if (selectedNode.value === nodeId) {
        selectedNode.value = null;  // 取消选中
      } else {
        selectedNode.value = nodeId;  // 选中节点
      }
    };

    const selectConnection = (connection) => {
      if (selectedConnection.value === connection) {
        selectedConnection.value = null;  // 取消选中
      }
      else {
        selectedConnection.value = connection;  // 选中边
      }
    };

    return {
      activeIndex,
      activeComponent,
      nodes,
      connections,
      selectedNode,
      selectedConnection,
      handleFileUpload,
      selectNode,
      selectConnection,
      getNodeById,
      handleSelect,
      fetchDataFromBackend
    };
  }
}
</script>

<style>
.pks-container {
  display: flex;
  justify-content: space-between;
  height: 100vh; /* 设置高度为视口高度 */
  width: 100vw;  /* 设置宽度为视口宽度 */
  box-sizing: border-box; /* 确保padding和border不会影响总高度和宽度 */
}
.topology {
  display: flex;
  width:60%;
  border-right: 5px solid #ddd;
  flex-direction: column; /* 使子元素垂直布局 */
}
.input-menu {
  width: 100%;
  height: 9%;
  display: flex;
  flex-direction: row;
  align-items: center; /* 垂直居中对齐 */
  justify-content: space-between; /* 使子元素之间的间隔均匀 */
}
.file-input {
  display: flex;
  height: 50%;
  width: 50%;
}
.backend-input{
  width: 20%;
  height: 50%;
  margin-left: auto; /* 将背景输入框向右侧推 */
}
.network-topology {
  width: 100%;
  height: 91%;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-right: 5px solid #ddd;
  position: relative;
}

.function-menu {
  width: 40%;
  padding: 0;
}
.subComponent {
  width: 100%;  /* 使用百分比宽度使其自适应 */
  display: flex; /* 使用flex布局保证菜单项平分宽度 */
  justify-content: space-around; /* 菜单项平均分配空间 */
}

</style>
