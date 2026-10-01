export type Paragraph = {type: 'paragraph' | 'heading' | 'quote'; text: string};

export type WritingWork = {
  slug: string;
  title: string;
  subtitle?: string;
  body: Paragraph[];
  order: number;
};

export type PhotoSeries = {
  slug: string;
  title: string;
  description?: string;
  images: {src: string; previewSrc?: string; alt: string; width: number; height: number}[];
  order: number;
};

export type DesignProject = {
  slug: string;
  title: string;
  role?: string;
  description?: string;
  assets: {src: string; previewSrc?: string; alt: string; kind: 'image' | 'pdf'; width?: number; height?: number}[];
  order: number;
};

export type PortfolioContent = {
  writing: WritingWork[];
  photography: PhotoSeries[];
  design: DesignProject[];
};

// 收到真实作品后，只需在这里按展示顺序加入内容。
export const portfolioContent: PortfolioContent = {
  writing: [
    {
      slug: 'writing-01', title: '文案 01', order: 1,
      body: [
        {type: 'quote', text: '“世界是世界的，而日记，是属于我的。”'},
        {type: 'paragraph', text: '很多时候，我们走一些路，就像一块海绵，无法选择浸入的液体。'},
        {type: 'paragraph', text: '此刻我翻开手边的一本日记，去年夹的落叶还没在今年等到落下，热敏纸的打印仍未完全褪色，时间，记忆装载在小小一本里，质地厚重，一起私人订制出世界最小的样子。'},
      ],
    },
    {
      slug: 'writing-02', title: '文案 02', order: 2,
      body: [
        {type: 'paragraph', text: '我们总是习惯问，自己是不是做错了？'},
        {type: 'paragraph', text: '敏感的我们，心里总装着一个“对错检测仪”。'},
        {type: 'paragraph', text: '别人皱一下眉，你就立刻复盘“是不是我哪里做错了……”'},
        {type: 'paragraph', text: '事情没按预期发展，就先责怪自己“如果当时再小心点就好了……”'},
        {type: 'paragraph', text: '发现自己和别人不一样，也会悄悄怀疑“是不是我有问题……”'},
        {type: 'paragraph', text: '可是……'},
        {type: 'quote', text: '“不同”不是错，\n“被创伤绊倒”不是错，\n“没迎合所有人”也不是错。'},
        {type: 'paragraph', text: '所谓“错误”，很多时候只是我们给自己套上的枷锁。'},
        {type: 'paragraph', text: '在这次的“魅力第六天”，我们想把这个检测仪关掉，'},
        {type: 'paragraph', text: '不研究 “我们有没有做错”，只听自己说“你过得好不好？”'},
      ],
    },
    {
      slug: 'writing-03', title: '文案 03', order: 3,
      body: [
        {type: 'paragraph', text: '大S是前卫先锋的，而大同则是那个总在平凡日子里给予我们激励的声音。'},
        {type: 'paragraph', text: '在今年的浪潮音乐大赏陈珊妮对方大同的颁奖词中她提到：“然而，并非所有歌手，都擅长用高音撼动人心。也并非所有情感，都适合撕心裂肺的大声呼喊。” 在他的歌声里，我们领会安静的力量和因歌手对作品付出真心才能呈现的工巧美感。他留下的最后一张专辑《梦想家 The Dreamer》，收录的每一首曲子像一张张为听众小心书写的明信片，简单的日常、飞逝的青春，落在心底变成最轻盈的感动。回到这张专辑的音乐制作本身，它融合了多种音乐风格，jazz与soul融合的《Tango》、加入管弦乐的《GF》、纯钢伴的《回留》......，每一首都昭示着歌手对作品创作的诚恳与匠心。'},
        {type: 'quote', text: '“时光不会倒流、往事不会重来。”'},
        {type: 'paragraph', text: '但你们赠予世界的美好，每一分都保留。'},
      ],
    },
    {
      slug: 'writing-04', title: '文案 04', order: 4,
      body: [
        {type: 'paragraph', text: '北京的柳絮开始泛滥成灾，痒意翕动在鼻尖眼角，提示着关于过敏的季节还在延续。'},
        {type: 'paragraph', text: '越长大越发现，追逐种种的路途中有太多使人感到心累的时刻，却也因此发现自己可忍耐的事情也那么多。'},
        {type: 'paragraph', text: '接受了一个人独自生活，接受了为求风光要鞠躬，接受了人与人之间难有真正的理解…….'},
        {type: 'paragraph', text: '在我们逐渐书写麻木的人生卷轴中，这些诱发我们“花粉症”的过敏原，反倒像我们仍然懂得感受的证明，以强势的存在感昭示着每个人触摸到的世界独一无二的质地。'},
        {type: 'paragraph', text: '应对春季频发的过敏是令人恼怒痛苦的，好在春夜温柔，还值得享受。'},
        {type: 'paragraph', text: '无论在这个看似明媚的春天里，有没有一个瞬间，让你觉得生活让人“过敏”得想掉眼泪。'},
        {type: 'paragraph', text: '请记得先睡个好觉，吃顿饱饭。'},
        {type: 'paragraph', text: '祝好运像狂飞的杨絮柳絮一样，播撒在我们身上。'},
      ],
    },
    {
      slug: 'writing-05', title: '文案 05', order: 5,
      body: [
        {type: 'paragraph', text: '新的一年，我决定不更新了。'},
        {type: 'heading', text: '前言：'},
        {type: 'paragraph', text: '你们会不会对“更新”这件事感到没来由的恐惧？'},
        {type: 'paragraph', text: '坚定维持了半年多的ios18.0系统，终于在某个夜晚，没有抵抗住自动更新的威力变成了ios26.3；'},
        {type: 'paragraph', text: '穿了很久的跑鞋，在一次清洗后，鞋头莫名开裂；'},
        {type: 'paragraph', text: '从没换过的水杯款式，在某次换新时，发现坚持使用的款式已彻底淘汰；'},
        {type: 'paragraph', text: '小时候常去的儿童乐园，被开发商改造成了时兴ip的主题乐园。'},
        {type: 'paragraph', text: '这些具体的变化，虽不至于让我们的日常因此瘫痪，但仍会让人担心会不会某天突然出现一个自己完全不熟悉的地方。'},
        {type: 'paragraph', text: '我们正生活在一个善于“迭代”的世界。铺天盖地的新概念、永远也追不完的热点，全都变成一个个红色的弹窗，不厌其烦地提醒着：我们的认知该刷新了，旧的习惯该淘汰了，原来那种慢吞吞的活法，已经不适合这个世界了。'},
        {type: 'paragraph', text: '脑子里突然蹦出了“忒修斯之船”的悖论，我发现我害怕这样毫无知觉的修补。'},
        {type: 'paragraph', text: '带着拒绝这一切的执拗，让我们去身边人的生活里滚一圈儿，一起收集他们生活里，那些老派固执的时刻。'},
        {type: 'paragraph', text: '全都毛茸茸的，可爱极了。'},
      ],
    },
  ],
  photography: [{
    slug: 'photo-series-01',
    title: 'PHOTO 01–05',
    images: [
      {src: '/assets/works/photo/photo-02-full.webp', previewSrc: '/assets/works/photo/photo-02-thumb.webp', alt: 'PHOTO 01，树荫街道旁的摊位', width: 2016, height: 1344},
      {src: '/assets/works/photo/photo-03-full.webp', previewSrc: '/assets/works/photo/photo-03-thumb.webp', alt: 'PHOTO 02，后视镜前活动的孩子', width: 1512, height: 1008},
      {src: '/assets/works/photo/photo-04-full.webp', previewSrc: '/assets/works/photo/photo-04-thumb.webp', alt: 'PHOTO 03，旧窗格中的鞋与干燥植物', width: 2016, height: 1344},
      {src: '/assets/works/photo/photo-05-full.webp', previewSrc: '/assets/works/photo/photo-05-thumb.webp', alt: 'PHOTO 04，墙边的三只小猫', width: 1512, height: 1008},
      {src: '/assets/works/photo/photo-06-full.webp', previewSrc: '/assets/works/photo/photo-06-thumb.webp', alt: 'PHOTO 05，电线之间的悬挂饰物', width: 1920, height: 1280},
    ],
    order: 1,
  }],
  design: [
    {slug: 'design-01', title: 'DESIGN 01', assets: [{src: '/assets/works/design/design-01-full.webp', previewSrc: '/assets/works/design/design-01-thumb.webp', alt: 'DESIGN 01', kind: 'image', width: 1714, height: 2400}], order: 1},
    {slug: 'design-02', title: 'DESIGN 02', assets: [{src: '/assets/works/design/design-02-full.webp', previewSrc: '/assets/works/design/design-02-thumb.webp', alt: 'DESIGN 02', kind: 'image', width: 1714, height: 2400}], order: 2},
    {slug: 'design-03', title: 'DESIGN 03', assets: [{src: '/assets/works/design/design-03-full.webp', previewSrc: '/assets/works/design/design-03-thumb.webp', alt: 'DESIGN 03', kind: 'image', width: 1714, height: 2400}], order: 3},
    {slug: 'design-04', title: 'DESIGN 04', assets: [{src: '/assets/works/design/design-04-full.webp', previewSrc: '/assets/works/design/design-04-thumb.webp', alt: 'DESIGN 04', kind: 'image', width: 2400, height: 1667}], order: 4},
    {slug: 'design-05', title: 'DESIGN 05', assets: [{src: '/assets/works/design/design-05-full.webp', previewSrc: '/assets/works/design/design-05-thumb.webp', alt: 'DESIGN 05', kind: 'image', width: 1714, height: 2400}], order: 5},
  ],
};
