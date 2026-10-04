export type District = {
  name: string
  path: string
  state: string
  eyebrow: string
  tagline: string
  lead: string
}

export const republic = {
  name: '理想国',
  eyebrow: '国境之内',
  title: '理想国',
  tagline: '一座只为自己发光的城。',
  manifesto:
    '这里不是作品陈列柜。是往后所有建造的地基——软件、文字、尚未命名的东西，都会从这里长出来。',
  districts: [
    {
      name: '工坊',
      path: '/workshop',
      state: '两局',
      eyebrow: '手里的局',
      tagline: '坐下来就能下。',
      lead: '五子棋，和一盘要熄掉的灯。',
    },
    {
      name: '档案',
      path: '/archive',
      state: '待入卷',
      eyebrow: '城志',
      tagline: '文字从这里入卷。',
      lead: '帖子按时间排在这里。',
    },
    {
      name: '夜航',
      path: '/night',
      state: '可走',
      eyebrow: '未眠',
      tagline: '看清顺序，再走一遍。',
      lead: '灯会一颗一颗亮。按同样的顺序点回去。',
    },
  ] satisfies District[],
}
