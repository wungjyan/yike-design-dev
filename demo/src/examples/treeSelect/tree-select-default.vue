<template>
  <div>
    <YkTreeSelect :options="state.treeData"></YkTreeSelect>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
// 定义参数
const state = reactive<any>({
  treeData: [
    {
      key: '1',
      label: 'level 1',
      children: [
        {
          key: '11',
          label: 'level 1-1',
        },
      ],
    },
    {
      key: '2',
      label: 'level 2',
      children: [
        {
          key: '12',
          label: 'level 2-1',
        },
        {
          key: '13',
          label: 'level 2-2',
          children: [
            {
              key: '53',
              label: 'level 2-2-1',
            },
            {
              key: '54',
              label: 'level 2-2-2',
            },
          ],
        },
      ],
    },
    {
      key: '3',
      label: 'level 3',
      children: [
        {
          key: '14',
          label: 'level 3-1',
        },
        {
          key: '16',
          label: 'level 3-2',
        },
      ],
    },
  ],
})
// const treeData = []
</script>
