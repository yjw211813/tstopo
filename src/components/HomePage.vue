<template>
  <div class="network-diagram-container">
    <div class="network-topology">
      <svg width="100%" height="100%">
        <!-- 随便放了个⚪ -->
        <circle cx="150" cy="150" r="30" stroke="blue" stroke-width="3" fill="blue" />
      </svg>
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
    const activeIndex = ref('1');
    const activeName = ref('link');

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

    return {
      activeIndex,
      activeName,
      activeComponent,
      handleSelect
    };
  }
}
</script>

<style>
.network-diagram-container {
  display: flex;
  justify-content: space-between;
}

.network-topology {
  width: 60%;
  border-right: 1px solid #ddd;
}

.function-menu {
  width: 40%;
  padding: 0px;
}
.subComponent {
  width: 100%;  /* 使用百分比宽度使其自适应 */
  display: flex; /* 使用flex布局保证菜单项平分宽度 */
  justify-content: space-around; /* 菜单项平均分配空间 */
}
.tabs {
  margin-top: 5px;
}
</style>
