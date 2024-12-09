<template>
  <div class="pks-container">
    <div class="topology">
      <!-- 添加输入 -->
      <div class="topology-menu">
        <!-- 文件输入 -->
        <input type="file" accept=".json" @change="handleFileUpload" style="position: absolute; top: 10px; left: 10px; z-index: 10;"/>
        <!-- 后端服务输入 -->
      </div>

      <!-- 拓扑图展示 -->
    <div class="network-topology">
      <svg ref="svg" width="100%" height="100%">
        <!-- 渲染网络拓扑中的节点 -->
        <g v-for="(node) in nodes" :key="node.id">
          <circle
            :cx="node.Latitude"
            :cy="node.Longtitude"
            r="5"
            :stroke="node.id === selectedNode ? 'red' : 'blue'"
            stroke-width="3"
            :fill="node.id === selectedNode ? 'red' : 'blue'"
            @click="selectNode(node.id)" />
          <text :x="node.x" :y="node.y" fill="white" font-size="12" text-anchor="middle" dy="4">{{ node.label }}</text>
        </g>
        <!-- 渲染网络拓扑中的边 -->
        <g v-for="(edge, index) in edges" :key="index">
          <line
            :x1="getNodeById(edge.from).Latitude"
            :y1="getNodeById(edge.from).Longtitude"
            :x2="getNodeById(edge.to).Latitude"
            :y2="getNodeById(edge.to).Longtitude"
            :stroke="edge === selectedEdge ? 'green' : 'gray'"
            stroke-width="2"
            @click="selectEdge(edge)" />
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
    const edges = ref([]);
    const selectedNode = ref(null);
    const selectedEdge = ref(null);
    const activeIndex = ref('1');
    // 根据选中的菜单项来决定加载哪个子组件
    const activeComponent = ref('NetCalculation');

    const handleSelect = (key) => {
      // 根据菜单项切换显示的模块
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

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = JSON.parse(e.target.result);
          // 解析并更新 nodes 和 edges 数据
          updateNetworkData(data);
        };
        reader.readAsText(file);
      }
    };

    const updateNetworkData = (data) => {
      // 这里假设 data 是包含 topology 和 platform 的格式的数据
      const topology = data.topology;
      const platforms = data.platform;

      nodes.value = platforms.map(platform => ({
        id: platform.id,
        Name: platform.platformName,
        nodeType: platform.Type,
        range: platform.range,
        protocols: platform.protocols,
        platformType: platform.platformType,
        cluster_id: platform.cluster_id,
        cpuType: platform.cpuType,
        Latitude: platform.platformLatitude, // 假设你在平台数据中有这些坐标
        Longtitude: platform.platformLongitude,
        Height: platform.platformHeight,
        label: platform.platformName,
        memory: platform.memory
      }));

      edges.value = topology.map( topology=> ({
        from: topology.txId,
        to: topology.rxId,
        delay: topology.delay,
        bandwidth: topology.bandwidth,
        packageLoss: topology.packageLoss,
        jitter: topology.jitter
      }));
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

    const selectEdge = (edge) => {
      if (selectedEdge.value === edge) {
        selectedEdge.value = null;  // 取消选中
      } else {
        selectedEdge.value = edge;  // 选中边
      }
    };

    return {
      activeIndex,
      activeComponent,
      nodes,
      edges,
      selectedNode,
      selectedEdge,
      handleFileUpload,
      selectNode,
      selectEdge,
      getNodeById,
      handleSelect
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
  flex-direction: column; /* 使子元素垂直布局 */
}
.topology-menu {
  width: 100%;
  height: 9%;
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
