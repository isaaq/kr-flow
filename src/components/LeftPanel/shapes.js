export const basicShapes = [
  {
    shape: 'custom-rect',
    label: '开始',
  },
  {
    shape: 'custom-rect',
    label: '过程',
  },
  {
    shape: 'custom-polygon',
    attrs: {
      body: {
        refPoints: '0,10 10,0 20,10 10,20',
      },
    },
    label: '决策',
  },
  {
    shape: 'custom-polygon',
    attrs: {
      body: {
        refPoints: '10,0 40,0 30,20 0,20',
      },
    },
    label: '数据',
  },
  {
    shape: 'custom-circle',
    label: '准备',
  },
  {
    shape: 'custom-circle',
    label: '连接',
  },
];
