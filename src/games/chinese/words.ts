export interface ChineseWord {
  chinese: string
  pinyin: string
  english: string
  emoji: string
  sentences: string[]
}

export type Level = 'starters' | 'movers' | 'flyers'

export interface LevelInfo {
  id: Level
  name: string
  emoji: string
  description: string
}

export const levels: LevelInfo[] = [
  { id: 'starters', name: 'Starters', emoji: '🌱', description: 'Basic characters (1 character)' },
  { id: 'movers', name: 'Movers', emoji: '🚀', description: 'Common words (1-2 characters)' },
  { id: 'flyers', name: 'Flyers', emoji: '✈️', description: 'Longer words (2-3 characters)' },
]

export interface ChineseCategory {
  id: string
  name: string
  emoji: string
  words: Record<Level, ChineseWord[]>
}

export const chineseCategories: ChineseCategory[] = [
  // ============================================================
  // 1. Animals (动物)
  // ============================================================
  {
    id: 'animals',
    name: '动物',
    emoji: '🐾',
    words: {
      starters: [
        { chinese: '马', pinyin: 'mǎ', english: 'horse', emoji: '🐴', sentences: ['我喜欢马。', '马跑得很快。'] },
        { chinese: '牛', pinyin: 'niú', english: 'cow', emoji: '🐄', sentences: ['牛在吃草。', '这头牛很大。'] },
        { chinese: '羊', pinyin: 'yáng', english: 'sheep', emoji: '🐑', sentences: ['羊在山上。', '小羊很可爱。'] },
        { chinese: '鸡', pinyin: 'jī', english: 'chicken', emoji: '🐔', sentences: ['鸡在叫。', '我家有一只鸡。'] },
        { chinese: '鸟', pinyin: 'niǎo', english: 'bird', emoji: '🐦', sentences: ['鸟在天上飞。', '这只鸟很漂亮。'] },
        { chinese: '鱼', pinyin: 'yú', english: 'fish', emoji: '🐟', sentences: ['鱼在水里游。', '我喜欢吃鱼。'] },
        { chinese: '虫', pinyin: 'chóng', english: 'insect', emoji: '🐛', sentences: ['虫子很小。', '地上有一只虫。'] },
        { chinese: '龙', pinyin: 'lóng', english: 'dragon', emoji: '🐉', sentences: ['龙会飞。', '中国人喜欢龙。'] },
        { chinese: '蛇', pinyin: 'shé', english: 'snake', emoji: '🐍', sentences: ['蛇很长。', '我怕蛇。'] },
        { chinese: '猪', pinyin: 'zhū', english: 'pig', emoji: '🐷', sentences: ['猪很胖。', '小猪在睡觉。'] },
      ],
      movers: [
        { chinese: '猫', pinyin: 'māo', english: 'cat', emoji: '🐱', sentences: ['猫在睡觉。', '我家有一只猫。'] },
        { chinese: '狗', pinyin: 'gǒu', english: 'dog', emoji: '🐶', sentences: ['狗是我的朋友。', '这只狗很可爱。'] },
        { chinese: '兔子', pinyin: 'tùzi', english: 'rabbit', emoji: '🐰', sentences: ['兔子爱吃萝卜。', '小兔子跳得很高。'] },
        { chinese: '老虎', pinyin: 'lǎohǔ', english: 'tiger', emoji: '🐯', sentences: ['老虎很厉害。', '老虎住在森林里。'] },
        { chinese: '熊猫', pinyin: 'xióngmāo', english: 'panda', emoji: '🐼', sentences: ['熊猫吃竹子。', '熊猫是中国的国宝。'] },
        { chinese: '猴子', pinyin: 'hóuzi', english: 'monkey', emoji: '🐵', sentences: ['猴子爱吃香蕉。', '猴子会爬树。'] },
        { chinese: '大象', pinyin: 'dàxiàng', english: 'elephant', emoji: '🐘', sentences: ['大象很大。', '大象有长鼻子。'] },
        { chinese: '狮子', pinyin: 'shīzi', english: 'lion', emoji: '🦁', sentences: ['狮子是森林之王。', '狮子很勇敢。'] },
        { chinese: '鸭子', pinyin: 'yāzi', english: 'duck', emoji: '🦆', sentences: ['鸭子在水里游。', '鸭子嘎嘎叫。'] },
        { chinese: '蜜蜂', pinyin: 'mìfēng', english: 'bee', emoji: '🐝', sentences: ['蜜蜂会采蜜。', '蜜蜂很勤劳。'] },
        { chinese: '蝴蝶', pinyin: 'húdié', english: 'butterfly', emoji: '🦋', sentences: ['蝴蝶很漂亮。', '蝴蝶在花上飞。'] },
        { chinese: '乌龟', pinyin: 'wūguī', english: 'turtle', emoji: '🐢', sentences: ['乌龟走得很慢。', '乌龟有壳。'] },
        { chinese: '蚂蚁', pinyin: 'mǎyǐ', english: 'ant', emoji: '🐜', sentences: ['蚂蚁很小。', '蚂蚁很勤劳。'] },
        { chinese: '青蛙', pinyin: 'qīngwā', english: 'frog', emoji: '🐸', sentences: ['青蛙会跳。', '青蛙是绿色的。'] },
        { chinese: '公鸡', pinyin: 'gōngjī', english: 'rooster', emoji: '🐓', sentences: ['公鸡打鸣了。', '公鸡早上叫。'] },
      ],
      flyers: [
        { chinese: '长颈鹿', pinyin: 'chángjǐnglù', english: 'giraffe', emoji: '🦒', sentences: ['长颈鹿的脖子很长。', '长颈鹿吃树叶。'] },
        { chinese: '企鹅', pinyin: 'qǐ\'é', english: 'penguin', emoji: '🐧', sentences: ['企鹅住在南极。', '企鹅不会飞。'] },
        { chinese: '鳄鱼', pinyin: 'èyú', english: 'crocodile', emoji: '🐊', sentences: ['鳄鱼在河里。', '鳄鱼的嘴很大。'] },
        { chinese: '海豚', pinyin: 'hǎitún', english: 'dolphin', emoji: '🐬', sentences: ['海豚很聪明。', '海豚会跳出水面。'] },
        { chinese: '恐龙', pinyin: 'kǒnglóng', english: 'dinosaur', emoji: '🦕', sentences: ['恐龙已经灭绝了。', '我喜欢恐龙。'] },
        { chinese: '蜗牛', pinyin: 'wōniú', english: 'snail', emoji: '🐌', sentences: ['蜗牛走得很慢。', '蜗牛有一个壳。'] },
        { chinese: '金鱼', pinyin: 'jīnyú', english: 'goldfish', emoji: '🐠', sentences: ['金鱼很漂亮。', '我养了一条金鱼。'] },
        { chinese: '孔雀', pinyin: 'kǒngquè', english: 'peacock', emoji: '🦚', sentences: ['孔雀开屏很美。', '孔雀有漂亮的尾巴。'] },
        { chinese: '刺猬', pinyin: 'cìwei', english: 'hedgehog', emoji: '🦔', sentences: ['刺猬身上有刺。', '刺猬很小。'] },
        { chinese: '独角兽', pinyin: 'dújiǎoshòu', english: 'unicorn', emoji: '🦄', sentences: ['独角兽是想象的动物。', '独角兽头上有一个角。'] },
        { chinese: '猫头鹰', pinyin: 'māotóuyīng', english: 'owl', emoji: '🦉', sentences: ['猫头鹰在晚上活动。', '猫头鹰的眼睛很大。'] },
        { chinese: '鹦鹉', pinyin: 'yīngwǔ', english: 'parrot', emoji: '🦜', sentences: ['鹦鹉会说话。', '鹦鹉的羽毛很漂亮。'] },
      ],
    },
  },

  // ============================================================
  // 2. Colors (颜色)
  // ============================================================
  {
    id: 'colors',
    name: '颜色',
    emoji: '🎨',
    words: {
      starters: [
        { chinese: '红', pinyin: 'hóng', english: 'red', emoji: '🔴', sentences: ['花是红的。', '我喜欢红色。'] },
        { chinese: '蓝', pinyin: 'lán', english: 'blue', emoji: '🔵', sentences: ['天是蓝的。', '蓝色很好看。'] },
        { chinese: '绿', pinyin: 'lǜ', english: 'green', emoji: '🟢', sentences: ['草是绿的。', '树叶是绿色的。'] },
        { chinese: '黄', pinyin: 'huáng', english: 'yellow', emoji: '🟡', sentences: ['香蕉是黄的。', '黄色很亮。'] },
        { chinese: '白', pinyin: 'bái', english: 'white', emoji: '⚪', sentences: ['雪是白的。', '白云很美。'] },
        { chinese: '黑', pinyin: 'hēi', english: 'black', emoji: '⚫', sentences: ['头发是黑的。', '天黑了。'] },
        { chinese: '紫', pinyin: 'zǐ', english: 'purple', emoji: '🟣', sentences: ['葡萄是紫的。', '紫色很好看。'] },
        { chinese: '灰', pinyin: 'huī', english: 'grey', emoji: '🩶', sentences: ['大象是灰色的。', '天是灰灰的。'] },
        { chinese: '金', pinyin: 'jīn', english: 'gold', emoji: '🥇', sentences: ['金子很亮。', '这是金色的。'] },
        { chinese: '银', pinyin: 'yín', english: 'silver', emoji: '🥈', sentences: ['银子很白。', '这是银色的。'] },
      ],
      movers: [
        { chinese: '红色', pinyin: 'hóngsè', english: 'red color', emoji: '❤️', sentences: ['苹果是红色的。', '我的书包是红色的。'] },
        { chinese: '蓝色', pinyin: 'lánsè', english: 'blue color', emoji: '💙', sentences: ['大海是蓝色的。', '他穿蓝色的衣服。'] },
        { chinese: '绿色', pinyin: 'lǜsè', english: 'green color', emoji: '💚', sentences: ['树叶是绿色的。', '青蛙是绿色的。'] },
        { chinese: '黄色', pinyin: 'huángsè', english: 'yellow color', emoji: '💛', sentences: ['太阳是黄色的。', '小鸡是黄色的。'] },
        { chinese: '白色', pinyin: 'báisè', english: 'white color', emoji: '🤍', sentences: ['牛奶是白色的。', '白色的花很香。'] },
        { chinese: '黑色', pinyin: 'hēisè', english: 'black color', emoji: '🖤', sentences: ['熊猫有黑色的眼圈。', '我有黑色的鞋子。'] },
        { chinese: '粉色', pinyin: 'fěnsè', english: 'pink', emoji: '🩷', sentences: ['花是粉色的。', '她喜欢粉色。'] },
        { chinese: '橙色', pinyin: 'chéngsè', english: 'orange color', emoji: '🧡', sentences: ['橘子是橙色的。', '秋天的树叶是橙色的。'] },
        { chinese: '棕色', pinyin: 'zōngsè', english: 'brown', emoji: '🤎', sentences: ['巧克力是棕色的。', '树干是棕色的。'] },
        { chinese: '彩色', pinyin: 'cǎisè', english: 'colorful', emoji: '🌈', sentences: ['彩虹是彩色的。', '这幅画是彩色的。'] },
        { chinese: '银色', pinyin: 'yínsè', english: 'silver color', emoji: '🩶', sentences: ['星星是银色的。', '这辆车是银色的。'] },
        { chinese: '金色', pinyin: 'jīnsè', english: 'gold color', emoji: '✨', sentences: ['太阳是金色的。', '金色的项链很美。'] },
      ],
      flyers: [
        { chinese: '五颜六色', pinyin: 'wǔyánliùsè', english: 'colorful/multicolored', emoji: '🎆', sentences: ['花园里五颜六色的花。', '彩灯是五颜六色的。'] },
        { chinese: '深蓝色', pinyin: 'shēnlánsè', english: 'dark blue', emoji: '🫐', sentences: ['深蓝色像大海。', '他穿深蓝色的外套。'] },
        { chinese: '浅绿色', pinyin: 'qiǎnlǜsè', english: 'light green', emoji: '🍀', sentences: ['春天的草是浅绿色的。', '这件衣服是浅绿色的。'] },
        { chinese: '天蓝色', pinyin: 'tiānlánsè', english: 'sky blue', emoji: '🩵', sentences: ['天蓝色很好看。', '她的裙子是天蓝色的。'] },
        { chinese: '玫红色', pinyin: 'méihóngsè', english: 'rose red', emoji: '🌹', sentences: ['玫瑰花是玫红色的。', '她的嘴唇是玫红色的。'] },
        { chinese: '金黄色', pinyin: 'jīnhuángsè', english: 'golden yellow', emoji: '🌟', sentences: ['秋天的田野是金黄色的。', '金黄色的阳光很温暖。'] },
        { chinese: '深红色', pinyin: 'shēnhóngsè', english: 'dark red', emoji: '🍷', sentences: ['深红色的花很漂亮。', '这块布是深红色的。'] },
        { chinese: '浅蓝色', pinyin: 'qiǎnlánsè', english: 'light blue', emoji: '🧊', sentences: ['天空是浅蓝色的。', '这条围巾是浅蓝色的。'] },
      ],
    },
  },

  // ============================================================
  // 3. Food (食物)
  // ============================================================
  {
    id: 'food',
    name: '食物',
    emoji: '🍽️',
    words: {
      starters: [
        { chinese: '米', pinyin: 'mǐ', english: 'rice (grain)', emoji: '🍚', sentences: ['我们吃米。', '米是白的。'] },
        { chinese: '面', pinyin: 'miàn', english: 'noodles/flour', emoji: '🍜', sentences: ['我喜欢吃面。', '面条很好吃。'] },
        { chinese: '肉', pinyin: 'ròu', english: 'meat', emoji: '🥩', sentences: ['肉很好吃。', '猫喜欢吃肉。'] },
        { chinese: '蛋', pinyin: 'dàn', english: 'egg', emoji: '🥚', sentences: ['鸡会生蛋。', '我早上吃蛋。'] },
        { chinese: '奶', pinyin: 'nǎi', english: 'milk', emoji: '🥛', sentences: ['我每天喝奶。', '牛奶很白。'] },
        { chinese: '茶', pinyin: 'chá', english: 'tea', emoji: '🍵', sentences: ['爸爸喜欢喝茶。', '茶很香。'] },
        { chinese: '糖', pinyin: 'táng', english: 'sugar/candy', emoji: '🍬', sentences: ['糖很甜。', '我想吃糖。'] },
        { chinese: '盐', pinyin: 'yán', english: 'salt', emoji: '🧂', sentences: ['盐是咸的。', '菜里要放盐。'] },
        { chinese: '汤', pinyin: 'tāng', english: 'soup', emoji: '🍲', sentences: ['妈妈做了汤。', '汤很好喝。'] },
        { chinese: '饭', pinyin: 'fàn', english: 'rice (cooked)/meal', emoji: '🍚', sentences: ['我们吃饭了。', '饭做好了。'] },
      ],
      movers: [
        { chinese: '面包', pinyin: 'miànbāo', english: 'bread', emoji: '🍞', sentences: ['面包很好吃。', '我早上吃面包。'] },
        { chinese: '蛋糕', pinyin: 'dàngāo', english: 'cake', emoji: '🎂', sentences: ['生日蛋糕很甜。', '我喜欢吃蛋糕。'] },
        { chinese: '饺子', pinyin: 'jiǎozi', english: 'dumplings', emoji: '🥟', sentences: ['饺子很好吃。', '我们一起包饺子。'] },
        { chinese: '包子', pinyin: 'bāozi', english: 'steamed bun', emoji: '🫓', sentences: ['包子里有肉。', '我喜欢吃包子。'] },
        { chinese: '米饭', pinyin: 'mǐfàn', english: 'cooked rice', emoji: '🍚', sentences: ['我每天吃米饭。', '米饭是白色的。'] },
        { chinese: '鸡蛋', pinyin: 'jīdàn', english: 'chicken egg', emoji: '🥚', sentences: ['鸡蛋有营养。', '妈妈炒鸡蛋。'] },
        { chinese: '牛奶', pinyin: 'niúnǎi', english: 'cow milk', emoji: '🥛', sentences: ['我每天喝牛奶。', '牛奶很有营养。'] },
        { chinese: '冰淇淋', pinyin: 'bīngqílín', english: 'ice cream', emoji: '🍦', sentences: ['冰淇淋很凉。', '夏天我爱吃冰淇淋。'] },
        { chinese: '薯条', pinyin: 'shǔtiáo', english: 'french fries', emoji: '🍟', sentences: ['薯条是金黄色的。', '我喜欢吃薯条。'] },
        { chinese: '比萨', pinyin: 'bǐsà', english: 'pizza', emoji: '🍕', sentences: ['比萨很好吃。', '我想吃比萨。'] },
        { chinese: '面条', pinyin: 'miàntiáo', english: 'noodles', emoji: '🍝', sentences: ['面条很长。', '我喜欢吃面条。'] },
        { chinese: '豆腐', pinyin: 'dòufu', english: 'tofu', emoji: '🧈', sentences: ['豆腐是白的。', '妈妈做了豆腐汤。'] },
        { chinese: '果汁', pinyin: 'guǒzhī', english: 'juice', emoji: '🧃', sentences: ['果汁很甜。', '我喜欢喝果汁。'] },
        { chinese: '可乐', pinyin: 'kělè', english: 'cola', emoji: '🥤', sentences: ['可乐有气泡。', '我想喝可乐。'] },
        { chinese: '饼干', pinyin: 'bǐnggān', english: 'biscuit/cookie', emoji: '🍪', sentences: ['饼干很脆。', '我喜欢吃饼干。'] },
      ],
      flyers: [
        { chinese: '巧克力', pinyin: 'qiǎokèlì', english: 'chocolate', emoji: '🍫', sentences: ['巧克力很甜。', '我喜欢吃巧克力。'] },
        { chinese: '汉堡包', pinyin: 'hànbǎobāo', english: 'hamburger', emoji: '🍔', sentences: ['汉堡包里有肉和菜。', '我想吃汉堡包。'] },
        { chinese: '三明治', pinyin: 'sānmíngzhì', english: 'sandwich', emoji: '🥪', sentences: ['三明治里有火腿。', '我中午吃三明治。'] },
        { chinese: '棒棒糖', pinyin: 'bàngbàngtáng', english: 'lollipop', emoji: '🍭', sentences: ['棒棒糖很甜。', '小朋友喜欢吃棒棒糖。'] },
        { chinese: '方便面', pinyin: 'fāngbiànmiàn', english: 'instant noodles', emoji: '🍜', sentences: ['方便面很方便。', '我会泡方便面。'] },
        { chinese: '热狗', pinyin: 'règǒu', english: 'hot dog', emoji: '🌭', sentences: ['热狗里有香肠。', '我喜欢吃热狗。'] },
        { chinese: '炒饭', pinyin: 'chǎofàn', english: 'fried rice', emoji: '🍛', sentences: ['炒饭很好吃。', '妈妈做了蛋炒饭。'] },
        { chinese: '甜甜圈', pinyin: 'tiántiánquān', english: 'donut', emoji: '🍩', sentences: ['甜甜圈是圆的。', '甜甜圈很甜。'] },
      ],
    },
  },

  // ============================================================
  // 4. Family (家庭)
  // ============================================================
  {
    id: 'family',
    name: '家庭',
    emoji: '👨‍👩‍👧‍👦',
    words: {
      starters: [
        { chinese: '人', pinyin: 'rén', english: 'person', emoji: '🧑', sentences: ['那个人是谁？', '人要善良。'] },
        { chinese: '女', pinyin: 'nǚ', english: 'female', emoji: '👩', sentences: ['她是女生。', '女孩子很聪明。'] },
        { chinese: '男', pinyin: 'nán', english: 'male', emoji: '👨', sentences: ['他是男生。', '男孩子很勇敢。'] },
        { chinese: '大', pinyin: 'dà', english: 'big/older', emoji: '🔝', sentences: ['哥哥比我大。', '爸爸很高大。'] },
        { chinese: '小', pinyin: 'xiǎo', english: 'small/younger', emoji: '🔽', sentences: ['弟弟很小。', '小宝宝在笑。'] },
        { chinese: '家', pinyin: 'jiā', english: 'home/family', emoji: '🏠', sentences: ['我的家很温暖。', '我爱我的家。'] },
        { chinese: '爱', pinyin: 'ài', english: 'love', emoji: '❤️', sentences: ['我爱妈妈。', '爸爸爱我们。'] },
        { chinese: '友', pinyin: 'yǒu', english: 'friend', emoji: '🤝', sentences: ['他是我的朋友。', '友谊很重要。'] },
      ],
      movers: [
        { chinese: '爸爸', pinyin: 'bàba', english: 'dad', emoji: '👨', sentences: ['爸爸去上班了。', '我爱爸爸。'] },
        { chinese: '妈妈', pinyin: 'māma', english: 'mom', emoji: '👩', sentences: ['妈妈做饭很好吃。', '我爱妈妈。'] },
        { chinese: '哥哥', pinyin: 'gēge', english: 'older brother', emoji: '👦', sentences: ['哥哥比我高。', '哥哥在上学。'] },
        { chinese: '姐姐', pinyin: 'jiějie', english: 'older sister', emoji: '👧', sentences: ['姐姐很漂亮。', '姐姐教我写字。'] },
        { chinese: '弟弟', pinyin: 'dìdi', english: 'younger brother', emoji: '👦', sentences: ['弟弟很可爱。', '弟弟在玩玩具。'] },
        { chinese: '妹妹', pinyin: 'mèimei', english: 'younger sister', emoji: '👧', sentences: ['妹妹很小。', '妹妹爱唱歌。'] },
        { chinese: '爷爷', pinyin: 'yéye', english: 'grandfather (paternal)', emoji: '👴', sentences: ['爷爷很慈祥。', '我去爷爷家。'] },
        { chinese: '奶奶', pinyin: 'nǎinai', english: 'grandmother (paternal)', emoji: '👵', sentences: ['奶奶做的饭很好吃。', '奶奶在公园散步。'] },
        { chinese: '朋友', pinyin: 'péngyou', english: 'friend', emoji: '🧑‍🤝‍🧑', sentences: ['他是我的好朋友。', '我和朋友一起玩。'] },
        { chinese: '宝宝', pinyin: 'bǎobao', english: 'baby', emoji: '👶', sentences: ['宝宝在笑。', '宝宝很可爱。'] },
      ],
      flyers: [
        { chinese: '外公', pinyin: 'wàigōng', english: 'grandfather (maternal)', emoji: '👴', sentences: ['外公喜欢钓鱼。', '我去外公家。'] },
        { chinese: '外婆', pinyin: 'wàipó', english: 'grandmother (maternal)', emoji: '👵', sentences: ['外婆给我讲故事。', '外婆做了好吃的菜。'] },
        { chinese: '叔叔', pinyin: 'shūshu', english: 'uncle', emoji: '👨', sentences: ['叔叔来我家了。', '叔叔给我买了玩具。'] },
        { chinese: '阿姨', pinyin: 'āyí', english: 'aunt', emoji: '👩', sentences: ['阿姨对我很好。', '阿姨带我去公园。'] },
        { chinese: '家人', pinyin: 'jiārén', english: 'family members', emoji: '👨‍👩‍👧‍👦', sentences: ['我爱我的家人。', '家人在一起很开心。'] },
        { chinese: '表哥', pinyin: 'biǎogē', english: 'older male cousin', emoji: '👦', sentences: ['表哥来我家了。', '我和表哥一起玩。'] },
        { chinese: '表姐', pinyin: 'biǎojiě', english: 'older female cousin', emoji: '👧', sentences: ['表姐很聪明。', '表姐教我画画。'] },
        { chinese: '小朋友', pinyin: 'xiǎopéngyou', english: 'children/kids', emoji: '🧒', sentences: ['小朋友们在玩。', '小朋友要听话。'] },
        { chinese: '双胞胎', pinyin: 'shuāngbāotāi', english: 'twins', emoji: '👯', sentences: ['他们是双胞胎。', '双胞胎长得一样。'] },
      ],
    },
  },

  // ============================================================
  // 5. Body (身体)
  // ============================================================
  {
    id: 'body',
    name: '身体',
    emoji: '🦴',
    words: {
      starters: [
        { chinese: '手', pinyin: 'shǒu', english: 'hand', emoji: '✋', sentences: ['我有两只手。', '手要洗干净。'] },
        { chinese: '口', pinyin: 'kǒu', english: 'mouth', emoji: '👄', sentences: ['用口说话。', '张开口。'] },
        { chinese: '目', pinyin: 'mù', english: 'eye (literary)', emoji: '👁️', sentences: ['目是用来看的。', '目光很亮。'] },
        { chinese: '耳', pinyin: 'ěr', english: 'ear', emoji: '👂', sentences: ['耳朵听声音。', '我有两只耳朵。'] },
        { chinese: '头', pinyin: 'tóu', english: 'head', emoji: '🗣️', sentences: ['我的头很大。', '头上戴帽子。'] },
        { chinese: '心', pinyin: 'xīn', english: 'heart', emoji: '❤️', sentences: ['心在跳。', '我的心很开心。'] },
        { chinese: '足', pinyin: 'zú', english: 'foot (literary)', emoji: '🦶', sentences: ['足可以走路。', '我有两只足。'] },
        { chinese: '牙', pinyin: 'yá', english: 'tooth', emoji: '🦷', sentences: ['牙要刷干净。', '我有白白的牙。'] },
      ],
      movers: [
        { chinese: '眼睛', pinyin: 'yǎnjing', english: 'eyes', emoji: '👀', sentences: ['她的眼睛很大。', '眼睛可以看东西。'] },
        { chinese: '鼻子', pinyin: 'bízi', english: 'nose', emoji: '👃', sentences: ['鼻子可以闻到花香。', '大象的鼻子很长。'] },
        { chinese: '嘴巴', pinyin: 'zuǐba', english: 'mouth', emoji: '👄', sentences: ['嘴巴可以说话。', '嘴巴可以吃东西。'] },
        { chinese: '耳朵', pinyin: 'ěrduo', english: 'ears', emoji: '👂', sentences: ['兔子的耳朵很长。', '耳朵可以听声音。'] },
        { chinese: '头发', pinyin: 'tóufa', english: 'hair', emoji: '💇', sentences: ['她的头发很长。', '我的头发是黑色的。'] },
        { chinese: '肚子', pinyin: 'dùzi', english: 'belly/stomach', emoji: '🤰', sentences: ['我的肚子饿了。', '吃饱了肚子圆圆的。'] },
        { chinese: '脸', pinyin: 'liǎn', english: 'face', emoji: '😊', sentences: ['她的脸红了。', '洗脸要用水。'] },
        { chinese: '腿', pinyin: 'tuǐ', english: 'leg', emoji: '🦵', sentences: ['跑步用腿。', '我的腿很长。'] },
        { chinese: '手指', pinyin: 'shǒuzhǐ', english: 'finger', emoji: '👆', sentences: ['我有十个手指。', '手指可以数数。'] },
        { chinese: '脚', pinyin: 'jiǎo', english: 'foot', emoji: '🦶', sentences: ['脚可以走路。', '我的脚很小。'] },
      ],
      flyers: [
        { chinese: '肩膀', pinyin: 'jiānbǎng', english: 'shoulder', emoji: '💪', sentences: ['爸爸的肩膀很宽。', '我拍拍他的肩膀。'] },
        { chinese: '膝盖', pinyin: 'xīgài', english: 'knee', emoji: '🦵', sentences: ['膝盖弯一弯。', '我摔伤了膝盖。'] },
        { chinese: '眉毛', pinyin: 'méimao', english: 'eyebrow', emoji: '🤨', sentences: ['她的眉毛很好看。', '眉毛在眼睛上面。'] },
        { chinese: '舌头', pinyin: 'shétou', english: 'tongue', emoji: '👅', sentences: ['舌头可以尝味道。', '他伸出舌头。'] },
        { chinese: '胳膊', pinyin: 'gēbo', english: 'arm', emoji: '💪', sentences: ['我张开胳膊。', '胳膊可以抱人。'] },
        { chinese: '下巴', pinyin: 'xiàba', english: 'chin', emoji: '🧔', sentences: ['他摸了摸下巴。', '下巴在嘴巴下面。'] },
        { chinese: '脖子', pinyin: 'bózi', english: 'neck', emoji: '🦒', sentences: ['长颈鹿的脖子很长。', '围巾围在脖子上。'] },
        { chinese: '额头', pinyin: 'étóu', english: 'forehead', emoji: '🤦', sentences: ['妈妈摸了我的额头。', '额头有点热。'] },
        { chinese: '手掌', pinyin: 'shǒuzhǎng', english: 'palm', emoji: '🤚', sentences: ['手掌是暖的。', '张开手掌。'] },
        { chinese: '指甲', pinyin: 'zhǐjia', english: 'fingernail', emoji: '💅', sentences: ['要剪指甲。', '指甲不能太长。'] },
      ],
    },
  },

  // ============================================================
  // 6. Numbers (数字)
  // ============================================================
  {
    id: 'numbers',
    name: '数字',
    emoji: '🔢',
    words: {
      starters: [
        { chinese: '一', pinyin: 'yī', english: 'one', emoji: '1️⃣', sentences: ['我有一本书。', '一加一等于二。'] },
        { chinese: '二', pinyin: 'èr', english: 'two', emoji: '2️⃣', sentences: ['我有两只手。', '二加二等于四。'] },
        { chinese: '三', pinyin: 'sān', english: 'three', emoji: '3️⃣', sentences: ['三个苹果。', '一二三，开始！'] },
        { chinese: '四', pinyin: 'sì', english: 'four', emoji: '4️⃣', sentences: ['桌子有四条腿。', '四季很美。'] },
        { chinese: '五', pinyin: 'wǔ', english: 'five', emoji: '5️⃣', sentences: ['一只手有五个手指。', '五个小朋友一起玩。'] },
        { chinese: '六', pinyin: 'liù', english: 'six', emoji: '6️⃣', sentences: ['我六岁了。', '六个鸡蛋。'] },
        { chinese: '七', pinyin: 'qī', english: 'seven', emoji: '7️⃣', sentences: ['一周有七天。', '七个小矮人。'] },
        { chinese: '八', pinyin: 'bā', english: 'eight', emoji: '8️⃣', sentences: ['八是一个吉利数字。', '八个人。'] },
        { chinese: '九', pinyin: 'jiǔ', english: 'nine', emoji: '9️⃣', sentences: ['九是最大的个位数。', '九月开学。'] },
        { chinese: '十', pinyin: 'shí', english: 'ten', emoji: '🔟', sentences: ['我有十个手指。', '十个苹果。'] },
        { chinese: '百', pinyin: 'bǎi', english: 'hundred', emoji: '💯', sentences: ['一百分！', '一百个人。'] },
        { chinese: '千', pinyin: 'qiān', english: 'thousand', emoji: '🔢', sentences: ['一千米很远。', '千万要小心。'] },
        { chinese: '万', pinyin: 'wàn', english: 'ten thousand', emoji: '🔢', sentences: ['万里长城。', '万事如意。'] },
        { chinese: '零', pinyin: 'líng', english: 'zero', emoji: '0️⃣', sentences: ['零是一个数字。', '温度零度很冷。'] },
      ],
      movers: [
        { chinese: '第一', pinyin: 'dìyī', english: 'first', emoji: '🥇', sentences: ['我是第一名。', '第一次来这里。'] },
        { chinese: '第二', pinyin: 'dìèr', english: 'second', emoji: '🥈', sentences: ['他是第二名。', '第二天我去了学校。'] },
        { chinese: '第三', pinyin: 'dìsān', english: 'third', emoji: '🥉', sentences: ['她是第三名。', '第三个节目很好看。'] },
        { chinese: '两个', pinyin: 'liǎnggè', english: 'two (of something)', emoji: '✌️', sentences: ['我有两个苹果。', '两个人一起走。'] },
        { chinese: '几个', pinyin: 'jǐgè', english: 'how many', emoji: '❓', sentences: ['你有几个朋友？', '桌上有几个杯子？'] },
        { chinese: '很多', pinyin: 'hěnduō', english: 'many/a lot', emoji: '📦', sentences: ['我有很多书。', '公园里有很多花。'] },
        { chinese: '一半', pinyin: 'yíbàn', english: 'half', emoji: '➗', sentences: ['把苹果分一半。', '一半是红的。'] },
        { chinese: '双', pinyin: 'shuāng', english: 'pair/double', emoji: '👟', sentences: ['我有一双鞋。', '双手拍一拍。'] },
      ],
      flyers: [
        { chinese: '一百', pinyin: 'yìbǎi', english: 'one hundred', emoji: '💯', sentences: ['考了一百分。', '一百个气球。'] },
        { chinese: '一千', pinyin: 'yìqiān', english: 'one thousand', emoji: '🔢', sentences: ['一千米是一公里。', '一千个星星。'] },
        { chinese: '多少', pinyin: 'duōshǎo', english: 'how many/how much', emoji: '🤔', sentences: ['这个多少钱？', '你有多少本书？'] },
        { chinese: '数字', pinyin: 'shùzì', english: 'number/digit', emoji: '🔢', sentences: ['你会写数字吗？', '电话号码是数字。'] },
        { chinese: '加法', pinyin: 'jiāfǎ', english: 'addition', emoji: '➕', sentences: ['我在学加法。', '加法很简单。'] },
        { chinese: '减法', pinyin: 'jiǎnfǎ', english: 'subtraction', emoji: '➖', sentences: ['减法也不难。', '我们来做减法。'] },
        { chinese: '乘法', pinyin: 'chéngfǎ', english: 'multiplication', emoji: '✖️', sentences: ['我在学乘法。', '乘法要背口诀。'] },
        { chinese: '除法', pinyin: 'chúfǎ', english: 'division', emoji: '➗', sentences: ['除法要动脑筋。', '我们来做除法。'] },
      ],
    },
  },

  // ============================================================
  // 7. School (学校)
  // ============================================================
  {
    id: 'school',
    name: '学校',
    emoji: '🏫',
    words: {
      starters: [
        { chinese: '书', pinyin: 'shū', english: 'book', emoji: '📚', sentences: ['我在看书。', '这本书很好看。'] },
        { chinese: '笔', pinyin: 'bǐ', english: 'pen/pencil', emoji: '✏️', sentences: ['我用笔写字。', '给我一支笔。'] },
        { chinese: '字', pinyin: 'zì', english: 'character/word', emoji: '🔤', sentences: ['我会写字。', '这个字很难。'] },
        { chinese: '学', pinyin: 'xué', english: 'learn/study', emoji: '📖', sentences: ['我爱学习。', '我们去上学。'] },
        { chinese: '课', pinyin: 'kè', english: 'class/lesson', emoji: '📝', sentences: ['上课了。', '今天有三节课。'] },
        { chinese: '画', pinyin: 'huà', english: 'draw/painting', emoji: '🖼️', sentences: ['我喜欢画画。', '这幅画很美。'] },
        { chinese: '纸', pinyin: 'zhǐ', english: 'paper', emoji: '📄', sentences: ['给我一张纸。', '纸是白色的。'] },
        { chinese: '读', pinyin: 'dú', english: 'read', emoji: '📖', sentences: ['我在读书。', '大声读。'] },
      ],
      movers: [
        { chinese: '老师', pinyin: 'lǎoshī', english: 'teacher', emoji: '👩‍🏫', sentences: ['老师教我们写字。', '老师很和蔼。'] },
        { chinese: '学生', pinyin: 'xuéshēng', english: 'student', emoji: '🧑‍🎓', sentences: ['我是一个学生。', '学生在教室里。'] },
        { chinese: '教室', pinyin: 'jiàoshì', english: 'classroom', emoji: '🏫', sentences: ['教室很大。', '我们在教室学习。'] },
        { chinese: '同学', pinyin: 'tóngxué', english: 'classmate', emoji: '🧑‍🤝‍🧑', sentences: ['他是我的同学。', '同学们好！'] },
        { chinese: '作业', pinyin: 'zuòyè', english: 'homework', emoji: '📝', sentences: ['我在做作业。', '作业写完了。'] },
        { chinese: '考试', pinyin: 'kǎoshì', english: 'exam', emoji: '📋', sentences: ['明天要考试。', '考试要认真。'] },
        { chinese: '铅笔', pinyin: 'qiānbǐ', english: 'pencil', emoji: '✏️', sentences: ['我用铅笔写字。', '铅笔在桌子上。'] },
        { chinese: '橡皮', pinyin: 'xiàngpí', english: 'eraser', emoji: '🧽', sentences: ['橡皮可以擦字。', '我的橡皮是白色的。'] },
        { chinese: '尺子', pinyin: 'chǐzi', english: 'ruler', emoji: '📏', sentences: ['尺子用来量长度。', '借我一把尺子。'] },
        { chinese: '书包', pinyin: 'shūbāo', english: 'schoolbag', emoji: '🎒', sentences: ['我的书包是蓝色的。', '书包里有书。'] },
        { chinese: '黑板', pinyin: 'hēibǎn', english: 'blackboard', emoji: '📋', sentences: ['老师在黑板上写字。', '黑板是绿色的。'] },
        { chinese: '桌子', pinyin: 'zhuōzi', english: 'desk/table', emoji: '🪑', sentences: ['桌子上有书。', '我坐在桌子前。'] },
      ],
      flyers: [
        { chinese: '图书馆', pinyin: 'túshūguǎn', english: 'library', emoji: '📚', sentences: ['图书馆里有很多书。', '我在图书馆看书。'] },
        { chinese: '操场', pinyin: 'cāochǎng', english: 'playground', emoji: '🏃', sentences: ['操场很大。', '我在操场跑步。'] },
        { chinese: '数学', pinyin: 'shùxué', english: 'mathematics', emoji: '🔢', sentences: ['我喜欢数学。', '数学课很有趣。'] },
        { chinese: '语文', pinyin: 'yǔwén', english: 'Chinese language', emoji: '📖', sentences: ['语文课学写字。', '我喜欢语文。'] },
        { chinese: '英语', pinyin: 'yīngyǔ', english: 'English language', emoji: '🇬🇧', sentences: ['我在学英语。', '英语很有趣。'] },
        { chinese: '体育', pinyin: 'tǐyù', english: 'physical education', emoji: '⚽', sentences: ['体育课很好玩。', '我喜欢上体育课。'] },
        { chinese: '音乐', pinyin: 'yīnyuè', english: 'music', emoji: '🎵', sentences: ['音乐课唱歌。', '我喜欢音乐。'] },
        { chinese: '美术', pinyin: 'měishù', english: 'art', emoji: '🎨', sentences: ['美术课画画。', '我喜欢上美术课。'] },
        { chinese: '文具盒', pinyin: 'wénjùhé', english: 'pencil case', emoji: '🧰', sentences: ['文具盒里有铅笔。', '我的文具盒很漂亮。'] },
        { chinese: '幼儿园', pinyin: 'yòu\'éryuán', english: 'kindergarten', emoji: '💒', sentences: ['弟弟在上幼儿园。', '幼儿园里有滑梯。'] },
        { chinese: '粉笔', pinyin: 'fěnbǐ', english: 'chalk', emoji: '🖍️', sentences: ['老师用粉笔写字。', '粉笔是白色的。'] },
        { chinese: '地球仪', pinyin: 'dìqiúyí', english: 'globe', emoji: '🌍', sentences: ['地球仪是圆的。', '教室里有地球仪。'] },
      ],
    },
  },

  // ============================================================
  // 8. Nature (自然)
  // ============================================================
  {
    id: 'nature',
    name: '自然',
    emoji: '🌿',
    words: {
      starters: [
        { chinese: '山', pinyin: 'shān', english: 'mountain', emoji: '⛰️', sentences: ['山很高。', '我们去爬山。'] },
        { chinese: '水', pinyin: 'shuǐ', english: 'water', emoji: '💧', sentences: ['水是透明的。', '我要喝水。'] },
        { chinese: '火', pinyin: 'huǒ', english: 'fire', emoji: '🔥', sentences: ['火很热。', '不要玩火。'] },
        { chinese: '土', pinyin: 'tǔ', english: 'earth/soil', emoji: '🪴', sentences: ['土是棕色的。', '花种在土里。'] },
        { chinese: '木', pinyin: 'mù', english: 'wood/tree', emoji: '🌳', sentences: ['这是一棵大木。', '桌子是木头做的。'] },
        { chinese: '花', pinyin: 'huā', english: 'flower', emoji: '🌸', sentences: ['花很漂亮。', '我喜欢花。'] },
        { chinese: '草', pinyin: 'cǎo', english: 'grass', emoji: '🌿', sentences: ['草是绿色的。', '草地很软。'] },
        { chinese: '石', pinyin: 'shí', english: 'stone/rock', emoji: '🪨', sentences: ['石头很硬。', '路上有石头。'] },
        { chinese: '天', pinyin: 'tiān', english: 'sky/day', emoji: '🌤️', sentences: ['天是蓝的。', '天上有云。'] },
        { chinese: '地', pinyin: 'dì', english: 'ground/earth', emoji: '🌍', sentences: ['地上有草。', '我坐在地上。'] },
        { chinese: '月', pinyin: 'yuè', english: 'moon/month', emoji: '🌙', sentences: ['月亮很圆。', '月亮很亮。'] },
        { chinese: '星', pinyin: 'xīng', english: 'star', emoji: '⭐', sentences: ['天上有很多星星。', '星星很亮。'] },
      ],
      movers: [
        { chinese: '太阳', pinyin: 'tàiyáng', english: 'sun', emoji: '☀️', sentences: ['太阳出来了。', '太阳很亮。'] },
        { chinese: '月亮', pinyin: 'yuèliang', english: 'moon', emoji: '🌙', sentences: ['月亮弯弯的。', '月亮在天上。'] },
        { chinese: '星星', pinyin: 'xīngxing', english: 'stars', emoji: '⭐', sentences: ['星星一闪一闪。', '天上有很多星星。'] },
        { chinese: '大海', pinyin: 'dàhǎi', english: 'ocean/sea', emoji: '🌊', sentences: ['大海很大。', '大海是蓝色的。'] },
        { chinese: '河', pinyin: 'hé', english: 'river', emoji: '🏞️', sentences: ['河水在流。', '河里有鱼。'] },
        { chinese: '树', pinyin: 'shù', english: 'tree', emoji: '🌳', sentences: ['树上有鸟。', '这棵树很高。'] },
        { chinese: '树叶', pinyin: 'shùyè', english: 'leaf', emoji: '🍃', sentences: ['树叶是绿色的。', '秋天树叶落了。'] },
        { chinese: '沙子', pinyin: 'shāzi', english: 'sand', emoji: '🏖️', sentences: ['海边有沙子。', '沙子很细。'] },
        { chinese: '森林', pinyin: 'sēnlín', english: 'forest', emoji: '🌲', sentences: ['森林里有很多树。', '森林很安静。'] },
        { chinese: '湖', pinyin: 'hú', english: 'lake', emoji: '🏞️', sentences: ['湖水很清。', '湖里有鱼。'] },
      ],
      flyers: [
        { chinese: '彩虹', pinyin: 'cǎihóng', english: 'rainbow', emoji: '🌈', sentences: ['雨后有彩虹。', '彩虹有七种颜色。'] },
        { chinese: '瀑布', pinyin: 'pùbù', english: 'waterfall', emoji: '🏞️', sentences: ['瀑布很壮观。', '水从瀑布流下来。'] },
        { chinese: '火山', pinyin: 'huǒshān', english: 'volcano', emoji: '🌋', sentences: ['火山会喷火。', '火山很高。'] },
        { chinese: '沙漠', pinyin: 'shāmò', english: 'desert', emoji: '🏜️', sentences: ['沙漠很热。', '沙漠里有骆驼。'] },
        { chinese: '地球', pinyin: 'dìqiú', english: 'Earth', emoji: '🌍', sentences: ['地球是圆的。', '我们住在地球上。'] },
        { chinese: '海洋', pinyin: 'hǎiyáng', english: 'ocean', emoji: '🌊', sentences: ['海洋很大很深。', '海洋是蓝色的。'] },
        { chinese: '草地', pinyin: 'cǎodì', english: 'grassland/lawn', emoji: '🌾', sentences: ['草地绿油油的。', '我在草地上玩。'] },
        { chinese: '小溪', pinyin: 'xiǎoxī', english: 'stream/creek', emoji: '🏞️', sentences: ['小溪的水很清。', '小溪里有小鱼。'] },
        { chinese: '竹子', pinyin: 'zhúzi', english: 'bamboo', emoji: '🎋', sentences: ['竹子长得很高。', '熊猫吃竹子。'] },
        { chinese: '蘑菇', pinyin: 'mógū', english: 'mushroom', emoji: '🍄', sentences: ['蘑菇长在树下。', '蘑菇可以吃。'] },
        { chinese: '玫瑰花', pinyin: 'méiguihuā', english: 'rose', emoji: '🌹', sentences: ['玫瑰花很香。', '玫瑰花是红色的。'] },
        { chinese: '向日葵', pinyin: 'xiàngrìkuí', english: 'sunflower', emoji: '🌻', sentences: ['向日葵向着太阳。', '向日葵是黄色的。'] },
      ],
    },
  },

  // ============================================================
  // 9. Transport (交通)
  // ============================================================
  {
    id: 'transport',
    name: '交通',
    emoji: '🚗',
    words: {
      starters: [
        { chinese: '车', pinyin: 'chē', english: 'vehicle/car', emoji: '🚗', sentences: ['车在路上跑。', '这是一辆车。'] },
        { chinese: '船', pinyin: 'chuán', english: 'boat/ship', emoji: '🚢', sentences: ['船在水上。', '我坐船去。'] },
        { chinese: '路', pinyin: 'lù', english: 'road', emoji: '🛣️', sentences: ['路很长。', '走这条路。'] },
        { chinese: '门', pinyin: 'mén', english: 'door/gate', emoji: '🚪', sentences: ['开门。', '门是红色的。'] },
        { chinese: '桥', pinyin: 'qiáo', english: 'bridge', emoji: '🌉', sentences: ['桥上可以走。', '这座桥很长。'] },
        { chinese: '站', pinyin: 'zhàn', english: 'station/stop', emoji: '🚏', sentences: ['到站了。', '我在站上等车。'] },
      ],
      movers: [
        { chinese: '汽车', pinyin: 'qìchē', english: 'car', emoji: '🚗', sentences: ['爸爸开汽车。', '汽车很快。'] },
        { chinese: '火车', pinyin: 'huǒchē', english: 'train', emoji: '🚂', sentences: ['火车很长。', '我坐火车去旅行。'] },
        { chinese: '飞机', pinyin: 'fēijī', english: 'airplane', emoji: '✈️', sentences: ['飞机在天上飞。', '我坐飞机去北京。'] },
        { chinese: '公共', pinyin: 'gōnggòng', english: 'public', emoji: '🚌', sentences: ['公共汽车来了。', '这是公共的。'] },
        { chinese: '地铁', pinyin: 'dìtiě', english: 'subway/metro', emoji: '🚇', sentences: ['地铁很快。', '我坐地铁上学。'] },
        { chinese: '出租', pinyin: 'chūzū', english: 'taxi/rent', emoji: '🚕', sentences: ['出租车来了。', '坐出租车去。'] },
        { chinese: '自行车', pinyin: 'zìxíngchē', english: 'bicycle', emoji: '🚲', sentences: ['我会骑自行车。', '自行车有两个轮子。'] },
        { chinese: '轮船', pinyin: 'lúnchuán', english: 'ship', emoji: '🚢', sentences: ['轮船在大海上。', '轮船很大。'] },
        { chinese: '摩托车', pinyin: 'mótuōchē', english: 'motorcycle', emoji: '🏍️', sentences: ['摩托车很快。', '他骑摩托车。'] },
        { chinese: '马路', pinyin: 'mǎlù', english: 'road/street', emoji: '🛣️', sentences: ['过马路要小心。', '马路上有很多车。'] },
      ],
      flyers: [
        { chinese: '公共汽车', pinyin: 'gōnggòngqìchē', english: 'bus', emoji: '🚌', sentences: ['公共汽车到站了。', '我坐公共汽车上学。'] },
        { chinese: '出租车', pinyin: 'chūzūchē', english: 'taxi', emoji: '🚕', sentences: ['我们坐出租车吧。', '出租车是黄色的。'] },
        { chinese: '救护车', pinyin: 'jiùhùchē', english: 'ambulance', emoji: '🚑', sentences: ['救护车来了。', '救护车跑得很快。'] },
        { chinese: '消防车', pinyin: 'xiāofángchē', english: 'fire truck', emoji: '🚒', sentences: ['消防车是红色的。', '消防车来灭火了。'] },
        { chinese: '直升机', pinyin: 'zhíshēngjī', english: 'helicopter', emoji: '🚁', sentences: ['直升机在天上飞。', '直升机可以停在楼顶。'] },
        { chinese: '火箭', pinyin: 'huǒjiàn', english: 'rocket', emoji: '🚀', sentences: ['火箭飞上天了。', '火箭很快。'] },
        { chinese: '红绿灯', pinyin: 'hónglǜdēng', english: 'traffic light', emoji: '🚦', sentences: ['红绿灯在路口。', '红灯停绿灯行。'] },
        { chinese: '斑马线', pinyin: 'bānmǎxiàn', english: 'crosswalk', emoji: '🦓', sentences: ['过马路要走斑马线。', '斑马线是白色的。'] },
        { chinese: '加油站', pinyin: 'jiāyóuzhàn', english: 'gas station', emoji: '⛽', sentences: ['汽车去加油站加油。', '加油站在路边。'] },
        { chinese: '停车场', pinyin: 'tíngchēchǎng', english: 'parking lot', emoji: '🅿️', sentences: ['停车场有很多车。', '把车停在停车场。'] },
      ],
    },
  },

  // ============================================================
  // 10. Clothes (衣服)
  // ============================================================
  {
    id: 'clothes',
    name: '衣服',
    emoji: '👗',
    words: {
      starters: [
        { chinese: '衣', pinyin: 'yī', english: 'clothes', emoji: '👚', sentences: ['穿衣服。', '衣服是红的。'] },
        { chinese: '帽', pinyin: 'mào', english: 'hat', emoji: '🧢', sentences: ['我戴帽子。', '帽子很好看。'] },
        { chinese: '鞋', pinyin: 'xié', english: 'shoe', emoji: '👟', sentences: ['穿好鞋。', '这双鞋很新。'] },
        { chinese: '袜', pinyin: 'wà', english: 'sock', emoji: '🧦', sentences: ['穿袜子。', '袜子是白的。'] },
        { chinese: '包', pinyin: 'bāo', english: 'bag', emoji: '👜', sentences: ['带上包。', '包里有书。'] },
        { chinese: '带', pinyin: 'dài', english: 'belt/wear', emoji: '👔', sentences: ['带上帽子。', '他系了一条带。'] },
      ],
      movers: [
        { chinese: '衣服', pinyin: 'yīfu', english: 'clothes', emoji: '👕', sentences: ['我穿新衣服。', '衣服要洗干净。'] },
        { chinese: '裤子', pinyin: 'kùzi', english: 'pants', emoji: '👖', sentences: ['裤子是蓝色的。', '我穿长裤子。'] },
        { chinese: '裙子', pinyin: 'qúnzi', english: 'skirt/dress', emoji: '👗', sentences: ['裙子很漂亮。', '她穿了一条裙子。'] },
        { chinese: '帽子', pinyin: 'màozi', english: 'hat/cap', emoji: '🧢', sentences: ['帽子很好看。', '出门戴帽子。'] },
        { chinese: '鞋子', pinyin: 'xiézi', english: 'shoes', emoji: '👟', sentences: ['鞋子很新。', '我穿白色的鞋子。'] },
        { chinese: '袜子', pinyin: 'wàzi', english: 'socks', emoji: '🧦', sentences: ['袜子要每天换。', '我穿白袜子。'] },
        { chinese: '外套', pinyin: 'wàitào', english: 'coat/jacket', emoji: '🧥', sentences: ['天冷穿外套。', '外套是红色的。'] },
        { chinese: '围巾', pinyin: 'wéijīn', english: 'scarf', emoji: '🧣', sentences: ['冬天要戴围巾。', '围巾很暖和。'] },
        { chinese: '手套', pinyin: 'shǒutào', english: 'gloves', emoji: '🧤', sentences: ['手套很暖和。', '戴上手套。'] },
        { chinese: '短裤', pinyin: 'duǎnkù', english: 'shorts', emoji: '🩳', sentences: ['夏天穿短裤。', '短裤很凉快。'] },
      ],
      flyers: [
        { chinese: '毛衣', pinyin: 'máoyī', english: 'sweater', emoji: '🧶', sentences: ['毛衣很暖和。', '妈妈给我织了毛衣。'] },
        { chinese: '雨衣', pinyin: 'yǔyī', english: 'raincoat', emoji: '🌧️', sentences: ['下雨穿雨衣。', '雨衣是黄色的。'] },
        { chinese: '背心', pinyin: 'bèixīn', english: 'vest', emoji: '🦺', sentences: ['夏天穿背心。', '背心很凉快。'] },
        { chinese: '游泳衣', pinyin: 'yóuyǒngyī', english: 'swimsuit', emoji: '👙', sentences: ['去游泳穿游泳衣。', '游泳衣是蓝色的。'] },
        { chinese: '太阳镜', pinyin: 'tàiyángjìng', english: 'sunglasses', emoji: '🕶️', sentences: ['太阳镜可以遮阳。', '他戴着太阳镜。'] },
        { chinese: '运动鞋', pinyin: 'yùndòngxié', english: 'sneakers', emoji: '👟', sentences: ['运动鞋很舒服。', '跑步穿运动鞋。'] },
        { chinese: '牛仔裤', pinyin: 'niúzǎikù', english: 'jeans', emoji: '👖', sentences: ['牛仔裤很耐穿。', '我喜欢穿牛仔裤。'] },
        { chinese: '睡衣', pinyin: 'shuìyī', english: 'pajamas', emoji: '🛏️', sentences: ['睡觉穿睡衣。', '睡衣很舒服。'] },
        { chinese: '连衣裙', pinyin: 'liányīqún', english: 'dress', emoji: '👗', sentences: ['连衣裙很漂亮。', '她穿了一件连衣裙。'] },
        { chinese: '羽绒服', pinyin: 'yǔróngfú', english: 'down jacket', emoji: '🧥', sentences: ['冬天穿羽绒服。', '羽绒服很暖和。'] },
      ],
    },
  },

  // ============================================================
  // 11. Actions (动作)
  // ============================================================
  {
    id: 'actions',
    name: '动作',
    emoji: '🏃',
    words: {
      starters: [
        { chinese: '走', pinyin: 'zǒu', english: 'walk', emoji: '🚶', sentences: ['我走路去学校。', '慢慢走。'] },
        { chinese: '跑', pinyin: 'pǎo', english: 'run', emoji: '🏃', sentences: ['他跑得很快。', '我们一起跑。'] },
        { chinese: '吃', pinyin: 'chī', english: 'eat', emoji: '🍽️', sentences: ['我在吃饭。', '吃水果很健康。'] },
        { chinese: '喝', pinyin: 'hē', english: 'drink', emoji: '🥤', sentences: ['我喝水。', '喝牛奶很好。'] },
        { chinese: '看', pinyin: 'kàn', english: 'look/see', emoji: '👀', sentences: ['我在看书。', '看这里！'] },
        { chinese: '听', pinyin: 'tīng', english: 'listen', emoji: '👂', sentences: ['听老师讲。', '我在听音乐。'] },
        { chinese: '说', pinyin: 'shuō', english: 'speak/say', emoji: '🗣️', sentences: ['他在说话。', '请说慢一点。'] },
        { chinese: '写', pinyin: 'xiě', english: 'write', emoji: '✍️', sentences: ['我在写字。', '写作业了。'] },
        { chinese: '坐', pinyin: 'zuò', english: 'sit', emoji: '🪑', sentences: ['请坐下。', '我坐在椅子上。'] },
        { chinese: '站', pinyin: 'zhàn', english: 'stand', emoji: '🧍', sentences: ['站起来。', '我站在门口。'] },
        { chinese: '飞', pinyin: 'fēi', english: 'fly', emoji: '🕊️', sentences: ['鸟会飞。', '飞机在飞。'] },
        { chinese: '笑', pinyin: 'xiào', english: 'laugh/smile', emoji: '😄', sentences: ['他在笑。', '笑一笑。'] },
        { chinese: '哭', pinyin: 'kū', english: 'cry', emoji: '😢', sentences: ['不要哭。', '弟弟在哭。'] },
        { chinese: '玩', pinyin: 'wán', english: 'play', emoji: '🎮', sentences: ['我们一起玩。', '出去玩吧。'] },
      ],
      movers: [
        { chinese: '唱歌', pinyin: 'chànggē', english: 'sing', emoji: '🎤', sentences: ['她在唱歌。', '我喜欢唱歌。'] },
        { chinese: '跳舞', pinyin: 'tiàowǔ', english: 'dance', emoji: '💃', sentences: ['她跳舞很美。', '我们一起跳舞。'] },
        { chinese: '画画', pinyin: 'huàhuà', english: 'draw/paint', emoji: '🎨', sentences: ['我在画画。', '画画很有趣。'] },
        { chinese: '游泳', pinyin: 'yóuyǒng', english: 'swim', emoji: '🏊', sentences: ['我会游泳。', '夏天去游泳。'] },
        { chinese: '睡觉', pinyin: 'shuìjiào', english: 'sleep', emoji: '😴', sentences: ['该睡觉了。', '宝宝在睡觉。'] },
        { chinese: '起床', pinyin: 'qǐchuáng', english: 'get up', emoji: '⏰', sentences: ['早上要起床。', '快起床！'] },
        { chinese: '洗手', pinyin: 'xǐshǒu', english: 'wash hands', emoji: '🧼', sentences: ['吃饭前要洗手。', '用肥皂洗手。'] },
        { chinese: '刷牙', pinyin: 'shuāyá', english: 'brush teeth', emoji: '🪥', sentences: ['每天要刷牙。', '早上起来刷牙。'] },
        { chinese: '跳', pinyin: 'tiào', english: 'jump', emoji: '🤸', sentences: ['兔子会跳。', '跳高很好玩。'] },
        { chinese: '拍', pinyin: 'pāi', english: 'clap/pat', emoji: '👏', sentences: ['拍拍手。', '我拍了一张照片。'] },
        { chinese: '打球', pinyin: 'dǎqiú', english: 'play ball', emoji: '⚽', sentences: ['我去打球。', '他喜欢打球。'] },
        { chinese: '开门', pinyin: 'kāimén', english: 'open the door', emoji: '🚪', sentences: ['请开门。', '我来开门。'] },
      ],
      flyers: [
        { chinese: '做作业', pinyin: 'zuòzuòyè', english: 'do homework', emoji: '📝', sentences: ['我在做作业。', '做完作业再玩。'] },
        { chinese: '看电视', pinyin: 'kàndiànshì', english: 'watch TV', emoji: '📺', sentences: ['我在看电视。', '不要看太多电视。'] },
        { chinese: '骑自行车', pinyin: 'qízìxíngchē', english: 'ride a bike', emoji: '🚴', sentences: ['我会骑自行车。', '我们去骑自行车。'] },
        { chinese: '踢足球', pinyin: 'tīzúqiú', english: 'play soccer', emoji: '⚽', sentences: ['他喜欢踢足球。', '我们去踢足球。'] },
        { chinese: '打篮球', pinyin: 'dǎlánqiú', english: 'play basketball', emoji: '🏀', sentences: ['他在打篮球。', '打篮球很好玩。'] },
        { chinese: '弹钢琴', pinyin: 'tángāngqín', english: 'play piano', emoji: '🎹', sentences: ['她在弹钢琴。', '我学弹钢琴。'] },
        { chinese: '拍照片', pinyin: 'pāizhàopiàn', english: 'take photos', emoji: '📸', sentences: ['我来拍照片。', '拍照片很有趣。'] },
        { chinese: '讲故事', pinyin: 'jiǎnggùshi', english: 'tell a story', emoji: '📖', sentences: ['妈妈给我讲故事。', '我喜欢听讲故事。'] },
        { chinese: '打扫', pinyin: 'dǎsǎo', english: 'clean up', emoji: '🧹', sentences: ['打扫房间。', '我帮妈妈打扫。'] },
        { chinese: '拥抱', pinyin: 'yōngbào', english: 'hug', emoji: '🤗', sentences: ['妈妈给我一个拥抱。', '拥抱让人开心。'] },
        { chinese: '打招呼', pinyin: 'dǎzhāohu', english: 'greet', emoji: '👋', sentences: ['见到人要打招呼。', '他跟我打招呼。'] },
        { chinese: '做游戏', pinyin: 'zuòyóuxì', english: 'play games', emoji: '🎯', sentences: ['我们一起做游戏。', '做游戏很开心。'] },
        { chinese: '荡秋千', pinyin: 'dàngqiūqiān', english: 'swing', emoji: '🎠', sentences: ['我在荡秋千。', '荡秋千真好玩。'] },
      ],
    },
  },

  // ============================================================
  // 12. Places (地方)
  // ============================================================
  {
    id: 'places',
    name: '地方',
    emoji: '📍',
    words: {
      starters: [
        { chinese: '家', pinyin: 'jiā', english: 'home', emoji: '🏠', sentences: ['我在家。', '回家了。'] },
        { chinese: '店', pinyin: 'diàn', english: 'shop/store', emoji: '🏪', sentences: ['去商店买东西。', '这家店很大。'] },
        { chinese: '园', pinyin: 'yuán', english: 'garden/park', emoji: '🏞️', sentences: ['公园很美。', '花园里有花。'] },
        { chinese: '里', pinyin: 'lǐ', english: 'inside', emoji: '📦', sentences: ['家里很温暖。', '书在包里。'] },
        { chinese: '外', pinyin: 'wài', english: 'outside', emoji: '🏕️', sentences: ['外面很冷。', '去外面玩。'] },
        { chinese: '上', pinyin: 'shàng', english: 'up/on', emoji: '⬆️', sentences: ['在桌子上。', '上山去。'] },
        { chinese: '下', pinyin: 'xià', english: 'down/under', emoji: '⬇️', sentences: ['在桌子下。', '下山了。'] },
      ],
      movers: [
        { chinese: '学校', pinyin: 'xuéxiào', english: 'school', emoji: '🏫', sentences: ['我在学校。', '学校很大。'] },
        { chinese: '医院', pinyin: 'yīyuàn', english: 'hospital', emoji: '🏥', sentences: ['生病去医院。', '医院有医生。'] },
        { chinese: '公园', pinyin: 'gōngyuán', english: 'park', emoji: '🏞️', sentences: ['公园里有花。', '我去公园玩。'] },
        { chinese: '超市', pinyin: 'chāoshì', english: 'supermarket', emoji: '🛒', sentences: ['超市里有很多东西。', '妈妈去超市买菜。'] },
        { chinese: '饭店', pinyin: 'fàndiàn', english: 'restaurant', emoji: '🍽️', sentences: ['我们去饭店吃饭。', '饭店的菜很好吃。'] },
        { chinese: '银行', pinyin: 'yínháng', english: 'bank', emoji: '🏦', sentences: ['爸爸去银行。', '银行在那边。'] },
        { chinese: '机场', pinyin: 'jīchǎng', english: 'airport', emoji: '🛫', sentences: ['飞机在机场。', '我们去机场。'] },
        { chinese: '车站', pinyin: 'chēzhàn', english: 'bus/train station', emoji: '🚏', sentences: ['在车站等车。', '车站有很多人。'] },
        { chinese: '教堂', pinyin: 'jiàotáng', english: 'church', emoji: '⛪', sentences: ['教堂很高。', '教堂很安静。'] },
        { chinese: '书店', pinyin: 'shūdiàn', english: 'bookstore', emoji: '📚', sentences: ['书店里有很多书。', '我去书店买书。'] },
      ],
      flyers: [
        { chinese: '图书馆', pinyin: 'túshūguǎn', english: 'library', emoji: '📚', sentences: ['图书馆很安静。', '我在图书馆看书。'] },
        { chinese: '动物园', pinyin: 'dòngwùyuán', english: 'zoo', emoji: '🦁', sentences: ['动物园里有很多动物。', '我去动物园看熊猫。'] },
        { chinese: '游乐场', pinyin: 'yóulèchǎng', english: 'amusement park', emoji: '🎡', sentences: ['游乐场很好玩。', '我去游乐场玩。'] },
        { chinese: '游泳池', pinyin: 'yóuyǒngchí', english: 'swimming pool', emoji: '🏊', sentences: ['游泳池的水很蓝。', '夏天去游泳池。'] },
        { chinese: '电影院', pinyin: 'diànyǐngyuàn', english: 'cinema', emoji: '🎬', sentences: ['我去电影院看电影。', '电影院很大。'] },
        { chinese: '博物馆', pinyin: 'bówùguǎn', english: 'museum', emoji: '🏛️', sentences: ['博物馆里有很多宝贝。', '我去博物馆参观。'] },
        { chinese: '幼儿园', pinyin: 'yòu\'éryuán', english: 'kindergarten', emoji: '💒', sentences: ['弟弟上幼儿园。', '幼儿园里有滑梯。'] },
        { chinese: '体育馆', pinyin: 'tǐyùguǎn', english: 'gymnasium', emoji: '🏟️', sentences: ['体育馆很大。', '我们去体育馆打球。'] },
        { chinese: '游乐园', pinyin: 'yóulèyuán', english: 'theme park', emoji: '🎢', sentences: ['游乐园很好玩。', '我想去游乐园。'] },
        { chinese: '水族馆', pinyin: 'shuǐzúguǎn', english: 'aquarium', emoji: '🐠', sentences: ['水族馆里有鱼。', '我去水族馆看海豚。'] },
        { chinese: '面包店', pinyin: 'miànbāodiàn', english: 'bakery', emoji: '🥐', sentences: ['面包店很香。', '我去面包店买面包。'] },
        { chinese: '花店', pinyin: 'huādiàn', english: 'flower shop', emoji: '💐', sentences: ['花店里有很多花。', '我在花店买了一束花。'] },
        { chinese: '玩具店', pinyin: 'wánjùdiàn', english: 'toy store', emoji: '🧸', sentences: ['玩具店里有很多玩具。', '我想去玩具店。'] },
      ],
    },
  },

  // ============================================================
  // 13. Fruits (水果)
  // ============================================================
  {
    id: 'fruits',
    name: '水果',
    emoji: '🍎',
    words: {
      starters: [
        { chinese: '果', pinyin: 'guǒ', english: 'fruit', emoji: '🍎', sentences: ['水果很好吃。', '吃果子吧。'] },
        { chinese: '瓜', pinyin: 'guā', english: 'melon', emoji: '🍈', sentences: ['瓜很甜。', '夏天吃瓜。'] },
        { chinese: '梨', pinyin: 'lí', english: 'pear', emoji: '🍐', sentences: ['梨很甜。', '我吃了一个梨。'] },
        { chinese: '桃', pinyin: 'táo', english: 'peach', emoji: '🍑', sentences: ['桃子很好吃。', '桃是粉红色的。'] },
        { chinese: '枣', pinyin: 'zǎo', english: 'date (fruit)', emoji: '🫘', sentences: ['枣是红色的。', '枣很甜。'] },
        { chinese: '李', pinyin: 'lǐ', english: 'plum', emoji: '🫐', sentences: ['李子是紫色的。', '李子酸酸的。'] },
      ],
      movers: [
        { chinese: '苹果', pinyin: 'píngguǒ', english: 'apple', emoji: '🍎', sentences: ['苹果是红色的。', '我喜欢吃苹果。'] },
        { chinese: '香蕉', pinyin: 'xiāngjiāo', english: 'banana', emoji: '🍌', sentences: ['香蕉是黄色的。', '猴子爱吃香蕉。'] },
        { chinese: '橘子', pinyin: 'júzi', english: 'orange/tangerine', emoji: '🍊', sentences: ['橘子很甜。', '橘子是橙色的。'] },
        { chinese: '葡萄', pinyin: 'pútao', english: 'grape', emoji: '🍇', sentences: ['葡萄是紫色的。', '葡萄很甜。'] },
        { chinese: '西瓜', pinyin: 'xīguā', english: 'watermelon', emoji: '🍉', sentences: ['西瓜很大。', '夏天吃西瓜很凉。'] },
        { chinese: '草莓', pinyin: 'cǎoméi', english: 'strawberry', emoji: '🍓', sentences: ['草莓是红色的。', '草莓很好吃。'] },
        { chinese: '桃子', pinyin: 'táozi', english: 'peach', emoji: '🍑', sentences: ['桃子很甜。', '桃子是粉红色的。'] },
        { chinese: '芒果', pinyin: 'mángguǒ', english: 'mango', emoji: '🥭', sentences: ['芒果很甜。', '芒果是黄色的。'] },
        { chinese: '柠檬', pinyin: 'níngméng', english: 'lemon', emoji: '🍋', sentences: ['柠檬很酸。', '柠檬是黄色的。'] },
        { chinese: '樱桃', pinyin: 'yīngtáo', english: 'cherry', emoji: '🍒', sentences: ['樱桃很小。', '樱桃是红色的。'] },
        { chinese: '椰子', pinyin: 'yēzi', english: 'coconut', emoji: '🥥', sentences: ['椰子很大。', '椰子水很好喝。'] },
        { chinese: '梨子', pinyin: 'lízi', english: 'pear', emoji: '🍐', sentences: ['梨子很甜。', '梨子是绿色的。'] },
      ],
      flyers: [
        { chinese: '猕猴桃', pinyin: 'míhóutáo', english: 'kiwi', emoji: '🥝', sentences: ['猕猴桃是绿色的。', '猕猴桃很好吃。'] },
        { chinese: '菠萝', pinyin: 'bōluó', english: 'pineapple', emoji: '🍍', sentences: ['菠萝是黄色的。', '菠萝很甜。'] },
        { chinese: '蓝莓', pinyin: 'lánméi', english: 'blueberry', emoji: '🫐', sentences: ['蓝莓很小。', '蓝莓是蓝色的。'] },
        { chinese: '火龙果', pinyin: 'huǒlóngguǒ', english: 'dragon fruit', emoji: '🐉', sentences: ['火龙果是红色的。', '火龙果很好吃。'] },
        { chinese: '哈密瓜', pinyin: 'hāmìguā', english: 'cantaloupe', emoji: '🍈', sentences: ['哈密瓜很甜。', '哈密瓜很大。'] },
        { chinese: '牛油果', pinyin: 'niúyóuguǒ', english: 'avocado', emoji: '🥑', sentences: ['牛油果是绿色的。', '牛油果很有营养。'] },
        { chinese: '百香果', pinyin: 'bǎixiāngguǒ', english: 'passion fruit', emoji: '🍈', sentences: ['百香果很酸。', '百香果可以泡水喝。'] },
        { chinese: '榴莲', pinyin: 'liúlián', english: 'durian', emoji: '🍈', sentences: ['榴莲很臭。', '有的人喜欢吃榴莲。'] },
        { chinese: '石榴', pinyin: 'shíliu', english: 'pomegranate', emoji: '🍎', sentences: ['石榴里有很多籽。', '石榴是红色的。'] },
        { chinese: '山竹', pinyin: 'shānzhú', english: 'mangosteen', emoji: '🍇', sentences: ['山竹很好吃。', '山竹是紫色的。'] },
      ],
    },
  },

  // ============================================================
  // 14. Weather (天气)
  // ============================================================
  {
    id: 'weather',
    name: '天气',
    emoji: '🌤️',
    words: {
      starters: [
        { chinese: '风', pinyin: 'fēng', english: 'wind', emoji: '💨', sentences: ['风很大。', '风吹树叶动。'] },
        { chinese: '雨', pinyin: 'yǔ', english: 'rain', emoji: '🌧️', sentences: ['下雨了。', '雨很大。'] },
        { chinese: '雪', pinyin: 'xuě', english: 'snow', emoji: '❄️', sentences: ['下雪了。', '雪是白色的。'] },
        { chinese: '云', pinyin: 'yún', english: 'cloud', emoji: '☁️', sentences: ['天上有云。', '白云很美。'] },
        { chinese: '冷', pinyin: 'lěng', english: 'cold', emoji: '🥶', sentences: ['冬天很冷。', '今天好冷。'] },
        { chinese: '热', pinyin: 'rè', english: 'hot', emoji: '🥵', sentences: ['夏天很热。', '今天好热。'] },
        { chinese: '晴', pinyin: 'qíng', english: 'clear/sunny', emoji: '☀️', sentences: ['今天天晴了。', '晴天很好。'] },
        { chinese: '阴', pinyin: 'yīn', english: 'cloudy/overcast', emoji: '☁️', sentences: ['今天是阴天。', '天阴了。'] },
        { chinese: '冰', pinyin: 'bīng', english: 'ice', emoji: '🧊', sentences: ['冰很冷。', '水变成了冰。'] },
        { chinese: '暖', pinyin: 'nuǎn', english: 'warm', emoji: '🌡️', sentences: ['春天很暖和。', '太阳很暖。'] },
      ],
      movers: [
        { chinese: '天气', pinyin: 'tiānqì', english: 'weather', emoji: '🌤️', sentences: ['今天天气很好。', '天气变冷了。'] },
        { chinese: '下雨', pinyin: 'xiàyǔ', english: 'rain (v)', emoji: '🌧️', sentences: ['外面在下雨。', '下雨要带伞。'] },
        { chinese: '下雪', pinyin: 'xiàxuě', english: 'snow (v)', emoji: '🌨️', sentences: ['冬天会下雪。', '下雪了，好开心！'] },
        { chinese: '刮风', pinyin: 'guāfēng', english: 'windy', emoji: '💨', sentences: ['外面在刮风。', '刮风了关窗户。'] },
        { chinese: '太阳', pinyin: 'tàiyáng', english: 'sun', emoji: '☀️', sentences: ['太阳出来了。', '太阳很大。'] },
        { chinese: '阴天', pinyin: 'yīntiān', english: 'cloudy day', emoji: '☁️', sentences: ['今天是阴天。', '阴天没有太阳。'] },
        { chinese: '晴天', pinyin: 'qíngtiān', english: 'sunny day', emoji: '☀️', sentences: ['今天是晴天。', '我喜欢晴天。'] },
        { chinese: '雷', pinyin: 'léi', english: 'thunder', emoji: '⚡', sentences: ['打雷了！', '雷声很响。'] },
        { chinese: '雾', pinyin: 'wù', english: 'fog', emoji: '🌫️', sentences: ['起雾了。', '雾很大看不清。'] },
        { chinese: '暖和', pinyin: 'nuǎnhuo', english: 'warm', emoji: '🌡️', sentences: ['今天很暖和。', '穿外套很暖和。'] },
      ],
      flyers: [
        { chinese: '雷阵雨', pinyin: 'léizhènyǔ', english: 'thunderstorm', emoji: '⛈️', sentences: ['今天有雷阵雨。', '雷阵雨来了。'] },
        { chinese: '暴风雨', pinyin: 'bàofēngyǔ', english: 'storm', emoji: '🌪️', sentences: ['暴风雨很可怕。', '暴风雨来了。'] },
        { chinese: '温度', pinyin: 'wēndù', english: 'temperature', emoji: '🌡️', sentences: ['今天温度很高。', '看看温度是多少。'] },
        { chinese: '龙卷风', pinyin: 'lóngjuǎnfēng', english: 'tornado', emoji: '🌪️', sentences: ['龙卷风很可怕。', '远离龙卷风。'] },
        { chinese: '雪人', pinyin: 'xuěrén', english: 'snowman', emoji: '⛄', sentences: ['我们堆雪人。', '雪人有一个红鼻子。'] },
        { chinese: '冰雹', pinyin: 'bīngbáo', english: 'hail', emoji: '🌨️', sentences: ['下冰雹了。', '冰雹像小石头。'] },
        { chinese: '天气预报', pinyin: 'tiānqìyùbào', english: 'weather forecast', emoji: '📺', sentences: ['看天气预报。', '天气预报说明天下雨。'] },
        { chinese: '春天', pinyin: 'chūntiān', english: 'spring', emoji: '🌸', sentences: ['春天花开了。', '春天很暖和。'] },
        { chinese: '夏天', pinyin: 'xiàtiān', english: 'summer', emoji: '☀️', sentences: ['夏天很热。', '夏天可以游泳。'] },
        { chinese: '秋天', pinyin: 'qiūtiān', english: 'autumn', emoji: '🍂', sentences: ['秋天树叶黄了。', '秋天很凉爽。'] },
        { chinese: '冬天', pinyin: 'dōngtiān', english: 'winter', emoji: '❄️', sentences: ['冬天很冷。', '冬天会下雪。'] },
        { chinese: '台风', pinyin: 'táifēng', english: 'typhoon', emoji: '🌀', sentences: ['台风来了。', '台风的风很大。'] },
        { chinese: '晴朗', pinyin: 'qínglǎng', english: 'clear/bright', emoji: '🌞', sentences: ['今天天气晴朗。', '晴朗的天空很蓝。'] },
      ],
    },
  },

  // ============================================================
  // 15. Emotions (情感)
  // ============================================================
  {
    id: 'emotions',
    name: '情感',
    emoji: '😊',
    words: {
      starters: [
        { chinese: '好', pinyin: 'hǎo', english: 'good', emoji: '👍', sentences: ['今天很好。', '你好！'] },
        { chinese: '坏', pinyin: 'huài', english: 'bad', emoji: '👎', sentences: ['这是坏的。', '不要做坏事。'] },
        { chinese: '乐', pinyin: 'lè', english: 'happy/joy', emoji: '😊', sentences: ['我很快乐。', '乐一乐。'] },
        { chinese: '怕', pinyin: 'pà', english: 'afraid', emoji: '😨', sentences: ['我怕黑。', '不要怕。'] },
        { chinese: '急', pinyin: 'jí', english: 'anxious/hurry', emoji: '😰', sentences: ['别着急。', '他很急。'] },
        { chinese: '忙', pinyin: 'máng', english: 'busy', emoji: '🏃', sentences: ['妈妈很忙。', '我很忙。'] },
        { chinese: '累', pinyin: 'lèi', english: 'tired', emoji: '😫', sentences: ['我很累。', '跑步好累。'] },
        { chinese: '气', pinyin: 'qì', english: 'angry/air', emoji: '😤', sentences: ['别生气。', '我很生气。'] },
      ],
      movers: [
        { chinese: '开心', pinyin: 'kāixīn', english: 'happy', emoji: '😄', sentences: ['我很开心。', '开心地笑。'] },
        { chinese: '难过', pinyin: 'nánguò', english: 'sad', emoji: '😢', sentences: ['他很难过。', '不要难过。'] },
        { chinese: '害怕', pinyin: 'hàipà', english: 'scared', emoji: '😱', sentences: ['我害怕打雷。', '不要害怕。'] },
        { chinese: '生气', pinyin: 'shēngqì', english: 'angry', emoji: '😠', sentences: ['妈妈生气了。', '不要生气。'] },
        { chinese: '高兴', pinyin: 'gāoxìng', english: 'glad/happy', emoji: '😃', sentences: ['我很高兴。', '他很高兴见到你。'] },
        { chinese: '着急', pinyin: 'zháojí', english: 'anxious/worried', emoji: '😰', sentences: ['别着急。', '他很着急。'] },
        { chinese: '勇敢', pinyin: 'yǒnggǎn', english: 'brave', emoji: '💪', sentences: ['你很勇敢。', '要做勇敢的孩子。'] },
        { chinese: '喜欢', pinyin: 'xǐhuan', english: 'like', emoji: '❤️', sentences: ['我喜欢画画。', '你喜欢什么？'] },
        { chinese: '讨厌', pinyin: 'tǎoyàn', english: 'dislike', emoji: '😒', sentences: ['我讨厌下雨天。', '不要讨厌别人。'] },
        { chinese: '无聊', pinyin: 'wúliáo', english: 'bored', emoji: '😐', sentences: ['我好无聊。', '下雨天很无聊。'] },
        { chinese: '紧张', pinyin: 'jǐnzhāng', english: 'nervous', emoji: '😬', sentences: ['考试前很紧张。', '不要紧张。'] },
        { chinese: '感动', pinyin: 'gǎndòng', english: 'moved/touched', emoji: '🥹', sentences: ['我很感动。', '这个故事很感动。'] },
      ],
      flyers: [
        { chinese: '伤心', pinyin: 'shāngxīn', english: 'heartbroken/sad', emoji: '💔', sentences: ['她很伤心。', '不要伤心了。'] },
        { chinese: '兴奋', pinyin: 'xīngfèn', english: 'excited', emoji: '🤩', sentences: ['我很兴奋。', '大家都很兴奋。'] },
        { chinese: '骄傲', pinyin: 'jiāo\'ào', english: 'proud', emoji: '🏆', sentences: ['妈妈为我骄傲。', '我很骄傲。'] },
        { chinese: '自信', pinyin: 'zìxìn', english: 'confident', emoji: '😎', sentences: ['要有自信。', '她很自信。'] },
        { chinese: '幸福', pinyin: 'xìngfú', english: 'blissful/happy', emoji: '🥰', sentences: ['我很幸福。', '幸福的一家人。'] },
        { chinese: '惊讶', pinyin: 'jīngyà', english: 'surprised', emoji: '😲', sentences: ['他很惊讶。', '这让我很惊讶。'] },
        { chinese: '孤独', pinyin: 'gūdú', english: 'lonely', emoji: '😔', sentences: ['他很孤独。', '不要感到孤独。'] },
        { chinese: '温柔', pinyin: 'wēnróu', english: 'gentle', emoji: '🥰', sentences: ['妈妈很温柔。', '要温柔对待小动物。'] },
        { chinese: '感谢', pinyin: 'gǎnxiè', english: 'grateful/thankful', emoji: '🙏', sentences: ['感谢老师的帮助。', '要学会感谢别人。'] },
        { chinese: '担心', pinyin: 'dānxīn', english: 'worried', emoji: '😟', sentences: ['妈妈担心我。', '不要担心。'] },
      ],
    },
  },

  // ============================================================
  // 16. Home (家居)
  // ============================================================
  {
    id: 'home',
    name: '家居',
    emoji: '🏠',
    words: {
      starters: [
        { chinese: '床', pinyin: 'chuáng', english: 'bed', emoji: '🛏️', sentences: ['我在床上睡觉。', '床很软。'] },
        { chinese: '灯', pinyin: 'dēng', english: 'light/lamp', emoji: '💡', sentences: ['开灯。', '灯很亮。'] },
        { chinese: '窗', pinyin: 'chuāng', english: 'window', emoji: '🪟', sentences: ['开窗通风。', '窗外有鸟。'] },
        { chinese: '碗', pinyin: 'wǎn', english: 'bowl', emoji: '🥣', sentences: ['碗里有饭。', '洗碗。'] },
        { chinese: '杯', pinyin: 'bēi', english: 'cup/glass', emoji: '🥤', sentences: ['杯子里有水。', '给我一个杯子。'] },
        { chinese: '锅', pinyin: 'guō', english: 'pot/pan', emoji: '🍳', sentences: ['锅里在做饭。', '妈妈用锅炒菜。'] },
        { chinese: '刀', pinyin: 'dāo', english: 'knife', emoji: '🔪', sentences: ['刀很锋利。', '用刀切菜。'] },
        { chinese: '钟', pinyin: 'zhōng', english: 'clock', emoji: '🕐', sentences: ['看看钟。', '钟在响。'] },
      ],
      movers: [
        { chinese: '沙发', pinyin: 'shāfā', english: 'sofa', emoji: '🛋️', sentences: ['沙发很软。', '我坐在沙发上。'] },
        { chinese: '椅子', pinyin: 'yǐzi', english: 'chair', emoji: '🪑', sentences: ['请坐椅子。', '椅子是木头的。'] },
        { chinese: '电视', pinyin: 'diànshì', english: 'television', emoji: '📺', sentences: ['看电视。', '电视在客厅。'] },
        { chinese: '冰箱', pinyin: 'bīngxiāng', english: 'refrigerator', emoji: '🧊', sentences: ['冰箱里有水果。', '把牛奶放冰箱。'] },
        { chinese: '电话', pinyin: 'diànhuà', english: 'telephone', emoji: '📞', sentences: ['电话响了。', '妈妈在打电话。'] },
        { chinese: '镜子', pinyin: 'jìngzi', english: 'mirror', emoji: '🪞', sentences: ['照照镜子。', '镜子在墙上。'] },
        { chinese: '钥匙', pinyin: 'yàoshi', english: 'key', emoji: '🔑', sentences: ['钥匙在哪里？', '用钥匙开门。'] },
        { chinese: '毛巾', pinyin: 'máojīn', english: 'towel', emoji: '🧖', sentences: ['用毛巾擦手。', '毛巾是白色的。'] },
        { chinese: '牙刷', pinyin: 'yáshuā', english: 'toothbrush', emoji: '🪥', sentences: ['用牙刷刷牙。', '我的牙刷是蓝色的。'] },
        { chinese: '枕头', pinyin: 'zhěntou', english: 'pillow', emoji: '🛏️', sentences: ['枕头很软。', '我的枕头是白色的。'] },
        { chinese: '被子', pinyin: 'bèizi', english: 'blanket/quilt', emoji: '🛌', sentences: ['盖上被子。', '被子很暖和。'] },
        { chinese: '厨房', pinyin: 'chúfáng', english: 'kitchen', emoji: '🍳', sentences: ['妈妈在厨房做饭。', '厨房里有锅。'] },
        { chinese: '客厅', pinyin: 'kètīng', english: 'living room', emoji: '🛋️', sentences: ['客厅里有沙发。', '我们在客厅看电视。'] },
        { chinese: '卧室', pinyin: 'wòshì', english: 'bedroom', emoji: '🛏️', sentences: ['卧室里有床。', '我在卧室睡觉。'] },
        { chinese: '阳台', pinyin: 'yángtái', english: 'balcony', emoji: '🌇', sentences: ['阳台上有花。', '我在阳台看风景。'] },
        { chinese: '花瓶', pinyin: 'huāpíng', english: 'vase', emoji: '🏺', sentences: ['花瓶里有花。', '花瓶很漂亮。'] },
        { chinese: '雨伞', pinyin: 'yǔsǎn', english: 'umbrella', emoji: '☂️', sentences: ['下雨带雨伞。', '雨伞是红色的。'] },
      ],
      flyers: [
        { chinese: '洗衣机', pinyin: 'xǐyījī', english: 'washing machine', emoji: '🫧', sentences: ['洗衣机在洗衣服。', '把脏衣服放进洗衣机。'] },
        { chinese: '电风扇', pinyin: 'diànfēngshàn', english: 'electric fan', emoji: '🌀', sentences: ['电风扇很凉快。', '打开电风扇。'] },
        { chinese: '空调', pinyin: 'kōngtiáo', english: 'air conditioner', emoji: '❄️', sentences: ['开空调吧。', '空调很凉快。'] },
        { chinese: '微波炉', pinyin: 'wēibōlú', english: 'microwave', emoji: '📦', sentences: ['用微波炉加热。', '微波炉在厨房。'] },
        { chinese: '吸尘器', pinyin: 'xīchénqì', english: 'vacuum cleaner', emoji: '🧹', sentences: ['用吸尘器打扫。', '吸尘器很有用。'] },
        { chinese: '电脑', pinyin: 'diànnǎo', english: 'computer', emoji: '💻', sentences: ['我在用电脑。', '电脑在桌子上。'] },
        { chinese: '书架', pinyin: 'shūjià', english: 'bookshelf', emoji: '📚', sentences: ['书架上有很多书。', '把书放到书架上。'] },
        { chinese: '台灯', pinyin: 'táidēng', english: 'desk lamp', emoji: '💡', sentences: ['打开台灯写作业。', '台灯在书桌上。'] },
        { chinese: '垃圾桶', pinyin: 'lājītǒng', english: 'trash can', emoji: '🗑️', sentences: ['垃圾放到垃圾桶里。', '垃圾桶在厨房。'] },
        { chinese: '浴室', pinyin: 'yùshì', english: 'bathroom', emoji: '🚿', sentences: ['我在浴室洗澡。', '浴室里有镜子。'] },
        { chinese: '遥控器', pinyin: 'yáokòngqì', english: 'remote control', emoji: '📱', sentences: ['遥控器在哪里？', '用遥控器换台。'] },
        { chinese: '闹钟', pinyin: 'nàozhōng', english: 'alarm clock', emoji: '⏰', sentences: ['闹钟响了。', '闹钟叫我起床。'] },
      ],
    },
  },
  // ============================================================
  // 17. Ocean (海洋)
  // ============================================================
  {
    id: 'ocean',
    name: '海洋',
    emoji: '🌊',
    words: {
      starters: [
        { chinese: '海', pinyin: 'hǎi', english: 'sea', emoji: '🌊', sentences: ['大海很蓝。', '我喜欢看海。'] },
        { chinese: '浪', pinyin: 'làng', english: 'wave', emoji: '🏄', sentences: ['浪花很大。', '浪打在沙滩上。'] },
        { chinese: '岛', pinyin: 'dǎo', english: 'island', emoji: '🏝️', sentences: ['那个岛很小。', '岛上有椰子树。'] },
        { chinese: '船', pinyin: 'chuán', english: 'boat', emoji: '⛵', sentences: ['船在海上。', '我坐船去旅行。'] },
        { chinese: '沙', pinyin: 'shā', english: 'sand', emoji: '🏖️', sentences: ['沙子很软。', '我在沙滩上玩沙。'] },
        { chinese: '冰', pinyin: 'bīng', english: 'ice', emoji: '🧊', sentences: ['冰很冷。', '海上有冰山。'] },
        { chinese: '贝', pinyin: 'bèi', english: 'shell', emoji: '🐚', sentences: ['贝壳很漂亮。', '我捡了一个贝。'] },
        { chinese: '潮', pinyin: 'cháo', english: 'tide', emoji: '🌙', sentences: ['潮水涨了。', '潮水退了。'] },
        { chinese: '港', pinyin: 'gǎng', english: 'harbour', emoji: '⚓', sentences: ['船在港口。', '港口很热闹。'] },
        { chinese: '盐', pinyin: 'yán', english: 'salt', emoji: '🧂', sentences: ['海水有盐。', '盐是白色的。'] },
        { chinese: '藻', pinyin: 'zǎo', english: 'seaweed', emoji: '🌿', sentences: ['海里有海藻。', '藻是绿色的。'] },
        { chinese: '湾', pinyin: 'wān', english: 'bay', emoji: '🏖️', sentences: ['这个湾很美。', '湾里的水很平静。'] },
      ],
      movers: [
        { chinese: '鲨鱼', pinyin: 'shāyú', english: 'shark', emoji: '🦈', sentences: ['鲨鱼在海里游。', '鲨鱼有锋利的牙齿。'] },
        { chinese: '章鱼', pinyin: 'zhāngyú', english: 'octopus', emoji: '🐙', sentences: ['章鱼有八条腿。', '章鱼很聪明。'] },
        { chinese: '虾', pinyin: 'xiā', english: 'shrimp', emoji: '🦐', sentences: ['虾是红色的。', '我喜欢吃虾。'] },
        { chinese: '螃蟹', pinyin: 'pángxiè', english: 'crab', emoji: '🦀', sentences: ['螃蟹有大钳子。', '螃蟹横着走。'] },
        { chinese: '海星', pinyin: 'hǎixīng', english: 'starfish', emoji: '⭐', sentences: ['海星有五个角。', '海星在海底。'] },
        { chinese: '水母', pinyin: 'shuǐmǔ', english: 'jellyfish', emoji: '🪼', sentences: ['水母是透明的。', '水母在水里漂。'] },
        { chinese: '珊瑚', pinyin: 'shānhú', english: 'coral', emoji: '🪸', sentences: ['珊瑚很漂亮。', '珊瑚在海底。'] },
        { chinese: '海鸥', pinyin: 'hǎi\'ōu', english: 'seagull', emoji: '🦅', sentences: ['海鸥在天上飞。', '海鸥在海边叫。'] },
        { chinese: '灯塔', pinyin: 'dēngtǎ', english: 'lighthouse', emoji: '🗼', sentences: ['灯塔很亮。', '灯塔在海边。'] },
        { chinese: '海龟', pinyin: 'hǎiguī', english: 'sea turtle', emoji: '🐢', sentences: ['海龟游得很慢。', '海龟在沙滩上下蛋。'] },
        { chinese: '海豹', pinyin: 'hǎibào', english: 'seal', emoji: '🦭', sentences: ['海豹会拍手。', '海豹在冰上晒太阳。'] },
        { chinese: '鲸鱼', pinyin: 'jīngyú', english: 'whale', emoji: '🐳', sentences: ['鲸鱼是最大的动物。', '鲸鱼会喷水。'] },
      ],
      flyers: [
        { chinese: '龙虾', pinyin: 'lóngxiā', english: 'lobster', emoji: '🦞', sentences: ['龙虾有大钳子。', '龙虾是红色的。'] },
        { chinese: '海豚', pinyin: 'hǎitún', english: 'dolphin', emoji: '🐬', sentences: ['海豚很聪明。', '海豚会跳出水面。'] },
        { chinese: '鱿鱼', pinyin: 'yóuyú', english: 'squid', emoji: '🦑', sentences: ['鱿鱼有很多触手。', '鱿鱼游得很快。'] },
        { chinese: '潜水艇', pinyin: 'qiánshuǐtǐng', english: 'submarine', emoji: '🛟', sentences: ['潜水艇在水下航行。', '潜水艇可以潜到很深。'] },
        { chinese: '指南针', pinyin: 'zhǐnánzhēn', english: 'compass', emoji: '🧭', sentences: ['指南针指向北方。', '航海需要指南针。'] },
        { chinese: '冰山', pinyin: 'bīngshān', english: 'iceberg', emoji: '🏔️', sentences: ['冰山浮在海上。', '冰山很大很冷。'] },
        { chinese: '美人鱼', pinyin: 'měirényú', english: 'mermaid', emoji: '🧜', sentences: ['美人鱼住在海底。', '美人鱼有鱼尾巴。'] },
        { chinese: '海盗', pinyin: 'hǎidào', english: 'pirate', emoji: '🏴‍☠️', sentences: ['海盗在海上冒险。', '海盗找宝藏。'] },
        { chinese: '河豚', pinyin: 'hétún', english: 'pufferfish', emoji: '🐡', sentences: ['河豚会鼓起来。', '河豚圆圆的。'] },
        { chinese: '海马', pinyin: 'hǎimǎ', english: 'seahorse', emoji: '🐠', sentences: ['海马很小很可爱。', '海马在海草里游。'] },
        { chinese: '贝壳', pinyin: 'bèiké', english: 'seashell', emoji: '🐚', sentences: ['我在海边捡贝壳。', '贝壳有很多颜色。'] },
        { chinese: '海草', pinyin: 'hǎicǎo', english: 'seaweed', emoji: '🌿', sentences: ['海草在水中摇摆。', '鱼儿躲在海草里。'] },
      ],
    },
  },
  // ============================================================
  // 18. Insects (昆虫)
  // ============================================================
  {
    id: 'insects',
    name: '昆虫',
    emoji: '🦗',
    words: {
      starters: [
        { chinese: '蛾', pinyin: 'é', english: 'moth', emoji: '🦋', sentences: ['蛾在灯旁飞。', '蛾喜欢光。'] },
        { chinese: '蚊', pinyin: 'wén', english: 'mosquito', emoji: '🦟', sentences: ['蚊子咬我了。', '蚊子嗡嗡叫。'] },
        { chinese: '蝇', pinyin: 'yíng', english: 'fly', emoji: '🪰', sentences: ['苍蝇到处飞。', '蝇很烦人。'] },
        { chinese: '蜂', pinyin: 'fēng', english: 'bee', emoji: '🐝', sentences: ['蜂在采蜜。', '蜂会蛰人。'] },
        { chinese: '蛛', pinyin: 'zhū', english: 'spider', emoji: '🕷️', sentences: ['蜘蛛织网。', '蛛丝很细。'] },
        { chinese: '蚕', pinyin: 'cán', english: 'silkworm', emoji: '🐛', sentences: ['蚕吃桑叶。', '蚕会吐丝。'] },
        { chinese: '蛙', pinyin: 'wā', english: 'frog', emoji: '🐸', sentences: ['蛙在叫。', '蛙吃虫子。'] },
        { chinese: '蜗', pinyin: 'wō', english: 'snail', emoji: '🐌', sentences: ['蜗牛很慢。', '蜗牛有壳。'] },
        { chinese: '茧', pinyin: 'jiǎn', english: 'cocoon', emoji: '🧶', sentences: ['蚕吐丝结茧。', '茧是白色的。'] },
        { chinese: '卵', pinyin: 'luǎn', english: 'egg/larva', emoji: '🥚', sentences: ['虫子产了卵。', '卵很小。'] },
        { chinese: '毒', pinyin: 'dú', english: 'venom', emoji: '☠️', sentences: ['蜂有毒。', '有些蛇有毒。'] },
        { chinese: '网', pinyin: 'wǎng', english: 'web', emoji: '🕸️', sentences: ['蜘蛛织了一张网。', '网上有露珠。'] },
      ],
      movers: [
        { chinese: '蟋蟀', pinyin: 'xīshuài', english: 'cricket', emoji: '🦗', sentences: ['蟋蟀在叫。', '蟋蟀会跳。'] },
        { chinese: '蜻蜓', pinyin: 'qīngtíng', english: 'dragonfly', emoji: '🪰', sentences: ['蜻蜓在飞。', '蜻蜓在水边。'] },
        { chinese: '蝎子', pinyin: 'xiēzi', english: 'scorpion', emoji: '🦂', sentences: ['蝎子有毒。', '蝎子的尾巴会蛰人。'] },
        { chinese: '甲虫', pinyin: 'jiǎchóng', english: 'beetle', emoji: '🪲', sentences: ['甲虫有硬壳。', '甲虫在地上爬。'] },
        { chinese: '蚯蚓', pinyin: 'qiūyǐn', english: 'earthworm', emoji: '🪱', sentences: ['蚯蚓在土里。', '蚯蚓帮助土壤。'] },
        { chinese: '萤火虫', pinyin: 'yínghuǒchóng', english: 'firefly', emoji: '✨', sentences: ['萤火虫会发光。', '夏天有萤火虫。'] },
        { chinese: '蜘蛛', pinyin: 'zhīzhū', english: 'spider', emoji: '🕷️', sentences: ['蜘蛛有八条腿。', '蜘蛛在织网。'] },
        { chinese: '苍蝇', pinyin: 'cāngyíng', english: 'fly', emoji: '🪰', sentences: ['苍蝇很脏。', '苍蝇到处飞。'] },
        { chinese: '瓢虫', pinyin: 'piáochóng', english: 'ladybug', emoji: '🐞', sentences: ['瓢虫是红色的。', '瓢虫有黑点。'] },
        { chinese: '螳螂', pinyin: 'tángláng', english: 'mantis', emoji: '🦗', sentences: ['螳螂在捉虫子。', '螳螂很厉害。'] },
        { chinese: '蝉', pinyin: 'chán', english: 'cicada', emoji: '🎵', sentences: ['蝉在树上叫。', '夏天蝉叫得很响。'] },
        { chinese: '跳蚤', pinyin: 'tiàozǎo', english: 'flea', emoji: '🦟', sentences: ['跳蚤很小。', '跳蚤会跳得很高。'] },
      ],
      flyers: [
        { chinese: '蝴蝶', pinyin: 'húdié', english: 'butterfly', emoji: '🦋', sentences: ['蝴蝶在花丛中飞。', '蝴蝶的翅膀很漂亮。'] },
        { chinese: '毛毛虫', pinyin: 'máomaochóng', english: 'caterpillar', emoji: '🐛', sentences: ['毛毛虫在吃叶子。', '毛毛虫会变成蝴蝶。'] },
        { chinese: '蜈蚣', pinyin: 'wúgōng', english: 'centipede', emoji: '🐛', sentences: ['蜈蚣有很多腿。', '蜈蚣跑得很快。'] },
        { chinese: '蜜蜂', pinyin: 'mìfēng', english: 'honeybee', emoji: '🍯', sentences: ['蜜蜂酿蜜。', '蜜蜂去很多花上采蜜。'] },
        { chinese: '蝗虫', pinyin: 'huángchóng', english: 'locust', emoji: '🦗', sentences: ['蝗虫会吃庄稼。', '蝗虫成群飞来。'] },
        { chinese: '独角仙', pinyin: 'dújiǎoxiān', english: 'rhinoceros beetle', emoji: '🪲', sentences: ['独角仙头上有角。', '独角仙力气很大。'] },
        { chinese: '白蚁', pinyin: 'báiyǐ', english: 'termite', emoji: '🪵', sentences: ['白蚁吃木头。', '白蚁住在一起。'] },
        { chinese: '蚱蜢', pinyin: 'zhàměng', english: 'grasshopper', emoji: '🦗', sentences: ['蚱蜢在草丛中跳。', '蚱蜢是绿色的。'] },
        { chinese: '蟑螂', pinyin: 'zhāngláng', english: 'cockroach', emoji: '🪳', sentences: ['蟑螂跑得很快。', '我不喜欢蟑螂。'] },
        { chinese: '蜂巢', pinyin: 'fēngcháo', english: 'beehive', emoji: '🐝', sentences: ['蜂巢里有蜜。', '蜜蜂住在蜂巢里。'] },
        { chinese: '花粉', pinyin: 'huāfěn', english: 'pollen', emoji: '🌼', sentences: ['蜜蜂采集花粉。', '花粉是黄色的。'] },
        { chinese: '蚁穴', pinyin: 'yǐxué', english: 'anthill', emoji: '🏔️', sentences: ['蚂蚁住在蚁穴里。', '蚁穴在地下。'] },
      ],
    },
  },
  // ============================================================
  // 19. Jobs (职业)
  // ============================================================
  {
    id: 'jobs',
    name: '职业',
    emoji: '👷',
    words: {
      starters: [
        { chinese: '王', pinyin: 'wáng', english: 'king', emoji: '🤴', sentences: ['王住在城堡里。', '王很有权力。'] },
        { chinese: '兵', pinyin: 'bīng', english: 'soldier', emoji: '🪖', sentences: ['兵很勇敢。', '兵保护国家。'] },
        { chinese: '官', pinyin: 'guān', english: 'official', emoji: '🏛️', sentences: ['官在开会。', '他是一个大官。'] },
        { chinese: '工', pinyin: 'gōng', english: 'worker', emoji: '👷', sentences: ['工人在工作。', '工人很辛苦。'] },
        { chinese: '商', pinyin: 'shāng', english: 'merchant', emoji: '🏪', sentences: ['商人卖东西。', '商人很聪明。'] },
        { chinese: '匠', pinyin: 'jiàng', english: 'craftsman', emoji: '🔨', sentences: ['木匠做家具。', '匠人很厉害。'] },
        { chinese: '农', pinyin: 'nóng', english: 'farmer', emoji: '🧑‍🌾', sentences: ['农民种地。', '农民种粮食。'] },
        { chinese: '医', pinyin: 'yī', english: 'doctor', emoji: '👨‍⚕️', sentences: ['医生看病。', '我要去看医生。'] },
        { chinese: '师', pinyin: 'shī', english: 'teacher/master', emoji: '🧑‍🏫', sentences: ['老师教我们。', '师傅教手艺。'] },
        { chinese: '厨', pinyin: 'chú', english: 'cook', emoji: '👨‍🍳', sentences: ['厨师做饭。', '厨师的手艺很好。'] },
        { chinese: '警', pinyin: 'jǐng', english: 'police', emoji: '👮', sentences: ['警察抓坏人。', '警察保护我们。'] },
        { chinese: '侠', pinyin: 'xiá', english: 'hero', emoji: '🦸', sentences: ['大侠很厉害。', '侠客帮助别人。'] },
      ],
      movers: [
        { chinese: '老师', pinyin: 'lǎoshī', english: 'teacher', emoji: '🧑‍🏫', sentences: ['老师教我们读书。', '我的老师很好。'] },
        { chinese: '医生', pinyin: 'yīshēng', english: 'doctor', emoji: '🩺', sentences: ['医生帮我看病。', '医生穿白大褂。'] },
        { chinese: '警察', pinyin: 'jǐngchá', english: 'police officer', emoji: '👮', sentences: ['警察指挥交通。', '警察很勇敢。'] },
        { chinese: '厨师', pinyin: 'chúshī', english: 'chef', emoji: '👨‍🍳', sentences: ['厨师做的菜很好吃。', '厨师戴着白帽子。'] },
        { chinese: '护士', pinyin: 'hùshi', english: 'nurse', emoji: '👩‍⚕️', sentences: ['护士照顾病人。', '护士很温柔。'] },
        { chinese: '画家', pinyin: 'huàjiā', english: 'artist', emoji: '🧑‍🎨', sentences: ['画家画画。', '画家的画很美。'] },
        { chinese: '歌手', pinyin: 'gēshǒu', english: 'singer', emoji: '🎤', sentences: ['歌手唱歌很好听。', '歌手在舞台上唱歌。'] },
        { chinese: '司机', pinyin: 'sījī', english: 'driver', emoji: '🚗', sentences: ['司机开车。', '公交车司机很辛苦。'] },
        { chinese: '船长', pinyin: 'chuánzhǎng', english: 'captain', emoji: '🧑‍✈️', sentences: ['船长指挥船。', '船长很有经验。'] },
        { chinese: '裁判', pinyin: 'cáipàn', english: 'referee', emoji: '🏁', sentences: ['裁判吹哨子。', '裁判很公正。'] },
        { chinese: '牧师', pinyin: 'mùshī', english: 'pastor', emoji: '⛪', sentences: ['牧师在教堂。', '牧师讲道。'] },
        { chinese: '法官', pinyin: 'fǎguān', english: 'judge', emoji: '⚖️', sentences: ['法官在法庭上。', '法官很公正。'] },
      ],
      flyers: [
        { chinese: '消防员', pinyin: 'xiāofángyuán', english: 'firefighter', emoji: '🧑‍🚒', sentences: ['消防员灭火。', '消防员很勇敢。'] },
        { chinese: '宇航员', pinyin: 'yǔhángyuán', english: 'astronaut', emoji: '🧑‍🚀', sentences: ['宇航员去太空。', '宇航员穿太空服。'] },
        { chinese: '飞行员', pinyin: 'fēixíngyuán', english: 'pilot', emoji: '👨‍✈️', sentences: ['飞行员开飞机。', '飞行员很酷。'] },
        { chinese: '科学家', pinyin: 'kēxuéjiā', english: 'scientist', emoji: '🧑‍🔬', sentences: ['科学家做实验。', '科学家很聪明。'] },
        { chinese: '建筑师', pinyin: 'jiànzhùshī', english: 'architect', emoji: '📐', sentences: ['建筑师设计房子。', '建筑师画图纸。'] },
        { chinese: '运动员', pinyin: 'yùndòngyuán', english: 'athlete', emoji: '🏅', sentences: ['运动员跑得很快。', '运动员每天训练。'] },
        { chinese: '程序员', pinyin: 'chéngxùyuán', english: 'programmer', emoji: '💻', sentences: ['程序员写代码。', '程序员用电脑工作。'] },
        { chinese: '摄影师', pinyin: 'shèyǐngshī', english: 'photographer', emoji: '📷', sentences: ['摄影师拍照。', '摄影师的照片很美。'] },
        { chinese: '邮递员', pinyin: 'yóudìyuán', english: 'mail carrier', emoji: '📮', sentences: ['邮递员送信。', '邮递员每天送包裹。'] },
        { chinese: '音乐家', pinyin: 'yīnyuèjiā', english: 'musician', emoji: '🎵', sentences: ['音乐家弹钢琴。', '音乐家演奏很好听。'] },
        { chinese: '牙医', pinyin: 'yáyī', english: 'dentist', emoji: '🦷', sentences: ['牙医帮我看牙齿。', '每年要去看牙医。'] },
        { chinese: '兽医', pinyin: 'shòuyī', english: 'veterinarian', emoji: '🩺', sentences: ['兽医给动物看病。', '兽医很有爱心。'] },
      ],
    },
  },
  // ============================================================
  // 20. Fantasy (奇幻)
  // ============================================================
  {
    id: 'fantasy',
    name: '奇幻',
    emoji: '🧙',
    words: {
      starters: [
        { chinese: '仙', pinyin: 'xiān', english: 'fairy/immortal', emoji: '🧚', sentences: ['仙女很美。', '神仙会飞。'] },
        { chinese: '鬼', pinyin: 'guǐ', english: 'ghost', emoji: '👻', sentences: ['鬼很吓人。', '不要怕鬼。'] },
        { chinese: '魔', pinyin: 'mó', english: 'demon/magic', emoji: '😈', sentences: ['魔法很厉害。', '魔鬼很坏。'] },
        { chinese: '剑', pinyin: 'jiàn', english: 'sword', emoji: '⚔️', sentences: ['剑很锋利。', '勇士拿着剑。'] },
        { chinese: '盾', pinyin: 'dùn', english: 'shield', emoji: '🛡️', sentences: ['盾可以挡住攻击。', '战士拿着盾。'] },
        { chinese: '弓', pinyin: 'gōng', english: 'bow', emoji: '🏹', sentences: ['弓箭手射箭。', '弓很有弹力。'] },
        { chinese: '王', pinyin: 'wáng', english: 'king', emoji: '👑', sentences: ['国王很伟大。', '王的城堡很大。'] },
        { chinese: '塔', pinyin: 'tǎ', english: 'tower', emoji: '🗼', sentences: ['塔很高。', '巫师住在塔里。'] },
        { chinese: '宝', pinyin: 'bǎo', english: 'treasure', emoji: '💰', sentences: ['宝藏在哪里？', '这个宝很珍贵。'] },
        { chinese: '妖', pinyin: 'yāo', english: 'monster', emoji: '👹', sentences: ['妖怪很可怕。', '妖精会变身。'] },
        { chinese: '咒', pinyin: 'zhòu', english: 'spell', emoji: '🪄', sentences: ['念一个咒语。', '这个咒很厉害。'] },
        { chinese: '甲', pinyin: 'jiǎ', english: 'armor', emoji: '🛡️', sentences: ['骑士穿着甲。', '铠甲很重。'] },
      ],
      movers: [
        { chinese: '龙', pinyin: 'lóng', english: 'dragon', emoji: '🐉', sentences: ['龙会喷火。', '中国龙是吉祥的。'] },
        { chinese: '巫婆', pinyin: 'wūpó', english: 'witch', emoji: '🧙‍♀️', sentences: ['巫婆会魔法。', '巫婆骑扫帚。'] },
        { chinese: '精灵', pinyin: 'jīnglíng', english: 'elf', emoji: '🧝', sentences: ['精灵住在森林。', '精灵耳朵尖尖的。'] },
        { chinese: '巨人', pinyin: 'jùrén', english: 'giant', emoji: '🗿', sentences: ['巨人很高大。', '巨人力气很大。'] },
        { chinese: '骑士', pinyin: 'qíshì', english: 'knight', emoji: '⚔️', sentences: ['骑士骑着马。', '骑士保护公主。'] },
        { chinese: '公主', pinyin: 'gōngzhǔ', english: 'princess', emoji: '👸', sentences: ['公主住在城堡里。', '公主很漂亮。'] },
        { chinese: '王子', pinyin: 'wángzǐ', english: 'prince', emoji: '🤴', sentences: ['王子很勇敢。', '王子骑白马。'] },
        { chinese: '僵尸', pinyin: 'jiāngshī', english: 'zombie', emoji: '🧟', sentences: ['僵尸走得很慢。', '僵尸在故事里很吓人。'] },
        { chinese: '外星人', pinyin: 'wàixīngrén', english: 'alien', emoji: '👽', sentences: ['外星人从太空来。', '外星人有大眼睛。'] },
        { chinese: '机器人', pinyin: 'jīqìrén', english: 'robot', emoji: '🤖', sentences: ['机器人会说话。', '机器人是金属做的。'] },
        { chinese: '超人', pinyin: 'chāorén', english: 'superhero', emoji: '🦸', sentences: ['超人会飞。', '超人保护城市。'] },
        { chinese: '魔杖', pinyin: 'mózhàng', english: 'magic wand', emoji: '🪄', sentences: ['魔杖可以变魔术。', '挥一挥魔杖。'] },
      ],
      flyers: [
        { chinese: '独角兽', pinyin: 'dújiǎoshòu', english: 'unicorn', emoji: '🦄', sentences: ['独角兽是想象的动物。', '独角兽头上有一个角。'] },
        { chinese: '吸血鬼', pinyin: 'xīxuèguǐ', english: 'vampire', emoji: '🧛', sentences: ['吸血鬼怕阳光。', '吸血鬼在晚上出来。'] },
        { chinese: '水晶球', pinyin: 'shuǐjīngqiú', english: 'crystal ball', emoji: '🔮', sentences: ['水晶球能预言未来。', '水晶球亮闪闪的。'] },
        { chinese: '魔法师', pinyin: 'mófǎshī', english: 'wizard', emoji: '🧙', sentences: ['魔法师念咒语。', '魔法师有长胡子。'] },
        { chinese: '凤凰', pinyin: 'fènghuáng', english: 'phoenix', emoji: '🔥', sentences: ['凤凰从火中重生。', '凤凰是美丽的鸟。'] },
        { chinese: '城堡', pinyin: 'chéngbǎo', english: 'castle', emoji: '🏰', sentences: ['城堡有高高的墙。', '公主住在城堡里。'] },
        { chinese: '宝藏', pinyin: 'bǎozàng', english: 'treasure', emoji: '💰', sentences: ['海盗埋藏了宝藏。', '宝藏里有金币。'] },
        { chinese: '地精', pinyin: 'dìjīng', english: 'goblin', emoji: '👺', sentences: ['地精住在洞穴里。', '地精是绿色的。'] },
        { chinese: '恶魔', pinyin: 'èmó', english: 'demon', emoji: '👹', sentences: ['恶魔在故事里很坏。', '勇士打败了恶魔。'] },
        { chinese: '魔药', pinyin: 'móyào', english: 'potion', emoji: '🧪', sentences: ['魔药是紫色的。', '喝了魔药就能变身。'] },
        { chinese: '半人马', pinyin: 'bànrénmǎ', english: 'centaur', emoji: '🐎', sentences: ['半人马是半人半马。', '半人马在森林里奔跑。'] },
        { chinese: '南瓜灯', pinyin: 'nánguādēng', english: 'jack-o-lantern', emoji: '🎃', sentences: ['万圣节有南瓜灯。', '南瓜灯有一张笑脸。'] },
      ],
    },
  },
  // ============================================================
  // 21. Buildings (建筑)
  // ============================================================
  {
    id: 'buildings',
    name: '建筑',
    emoji: '🏗️',
    words: {
      starters: [
        { chinese: '房', pinyin: 'fáng', english: 'house', emoji: '🏠', sentences: ['房子很大。', '我住在房子里。'] },
        { chinese: '楼', pinyin: 'lóu', english: 'building', emoji: '🏢', sentences: ['楼很高。', '这栋楼有十层。'] },
        { chinese: '门', pinyin: 'mén', english: 'door', emoji: '🚪', sentences: ['门开了。', '请关上门。'] },
        { chinese: '墙', pinyin: 'qiáng', english: 'wall', emoji: '🧱', sentences: ['墙是白色的。', '墙上有画。'] },
        { chinese: '桥', pinyin: 'qiáo', english: 'bridge', emoji: '🌉', sentences: ['桥很长。', '我们过桥。'] },
        { chinese: '塔', pinyin: 'tǎ', english: 'tower', emoji: '🗼', sentences: ['塔很高。', '灯塔很亮。'] },
        { chinese: '庙', pinyin: 'miào', english: 'temple', emoji: '⛩️', sentences: ['庙里很安静。', '我去庙里参观。'] },
        { chinese: '亭', pinyin: 'tíng', english: 'pavilion', emoji: '🏯', sentences: ['亭子很漂亮。', '我们在亭子里休息。'] },
        { chinese: '井', pinyin: 'jǐng', english: 'well', emoji: '🕳️', sentences: ['井里有水。', '古代人用井打水。'] },
        { chinese: '坝', pinyin: 'bà', english: 'dam', emoji: '🏗️', sentences: ['大坝拦住了水。', '坝很坚固。'] },
        { chinese: '窗', pinyin: 'chuāng', english: 'window', emoji: '🪟', sentences: ['窗户开着。', '从窗户看外面。'] },
        { chinese: '顶', pinyin: 'dǐng', english: 'roof', emoji: '🏠', sentences: ['屋顶是红色的。', '猫在屋顶上。'] },
      ],
      movers: [
        { chinese: '学校', pinyin: 'xuéxiào', english: 'school', emoji: '🏫', sentences: ['我每天去学校。', '学校有很多学生。'] },
        { chinese: '医院', pinyin: 'yīyuàn', english: 'hospital', emoji: '🏥', sentences: ['医院有很多医生。', '我去医院看病。'] },
        { chinese: '教堂', pinyin: 'jiàotáng', english: 'church', emoji: '⛪', sentences: ['教堂有钟声。', '教堂很安静。'] },
        { chinese: '城堡', pinyin: 'chéngbǎo', english: 'castle', emoji: '🏰', sentences: ['城堡很古老。', '国王住在城堡里。'] },
        { chinese: '工厂', pinyin: 'gōngchǎng', english: 'factory', emoji: '🏭', sentences: ['工厂生产玩具。', '工厂很大。'] },
        { chinese: '商店', pinyin: 'shāngdiàn', english: 'shop', emoji: '🏪', sentences: ['商店卖很多东西。', '我去商店买零食。'] },
        { chinese: '银行', pinyin: 'yínháng', english: 'bank', emoji: '🏦', sentences: ['银行存钱。', '银行在街上。'] },
        { chinese: '酒店', pinyin: 'jiǔdiàn', english: 'hotel', emoji: '🏨', sentences: ['我们住在酒店。', '酒店有游泳池。'] },
        { chinese: '仓库', pinyin: 'cāngkù', english: 'warehouse', emoji: '🏗️', sentences: ['仓库里有很多箱子。', '仓库很大。'] },
        { chinese: '体育场', pinyin: 'tǐyùchǎng', english: 'stadium', emoji: '🏟️', sentences: ['体育场很大。', '我们在体育场看比赛。'] },
        { chinese: '电影院', pinyin: 'diànyǐngyuàn', english: 'cinema', emoji: '🎬', sentences: ['电影院在放电影。', '我去电影院看电影。'] },
        { chinese: '博物馆', pinyin: 'bówùguǎn', english: 'museum', emoji: '🏛️', sentences: ['博物馆有很多古董。', '我喜欢参观博物馆。'] },
      ],
      flyers: [
        { chinese: '图书馆', pinyin: 'túshūguǎn', english: 'library', emoji: '📚', sentences: ['图书馆很安静。', '我在图书馆借书。'] },
        { chinese: '金字塔', pinyin: 'jīnzìtǎ', english: 'pyramid', emoji: '🔺', sentences: ['金字塔在埃及。', '金字塔是三角形的。'] },
        { chinese: '摩天大楼', pinyin: 'mótiāndàlóu', english: 'skyscraper', emoji: '🏙️', sentences: ['摩天大楼非常高。', '城市里有很多摩天大楼。'] },
        { chinese: '灯塔', pinyin: 'dēngtǎ', english: 'lighthouse', emoji: '🗼', sentences: ['灯塔指引船只。', '灯塔的光很亮。'] },
        { chinese: '风车', pinyin: 'fēngchē', english: 'windmill', emoji: '🌬️', sentences: ['风车在转动。', '荷兰有很多风车。'] },
        { chinese: '游泳池', pinyin: 'yóuyǒngchí', english: 'swimming pool', emoji: '🏊', sentences: ['游泳池的水很蓝。', '我在游泳池游泳。'] },
        { chinese: '大教堂', pinyin: 'dàjiàotáng', english: 'cathedral', emoji: '⛪', sentences: ['大教堂很壮观。', '大教堂有彩色玻璃窗。'] },
        { chinese: '停车场', pinyin: 'tíngchēchǎng', english: 'parking lot', emoji: '🅿️', sentences: ['停车场有很多车。', '我们把车停在停车场。'] },
        { chinese: '幼儿园', pinyin: 'yòu\'éryuán', english: 'kindergarten', emoji: '🎒', sentences: ['弟弟上幼儿园。', '幼儿园有滑梯。'] },
        { chinese: '飞机场', pinyin: 'fēijīchǎng', english: 'airport', emoji: '✈️', sentences: ['飞机场很大。', '我们去飞机场坐飞机。'] },
        { chinese: '消防站', pinyin: 'xiāofángzhàn', english: 'fire station', emoji: '🚒', sentences: ['消防站有消防车。', '消防站里有消防员。'] },
        { chinese: '天文台', pinyin: 'tiānwéntái', english: 'observatory', emoji: '🔭', sentences: ['天文台可以看星星。', '天文台在山上。'] },
      ],
    },
  },
  // ============================================================
  // 22. Garden (花园)
  // ============================================================
  {
    id: 'garden',
    name: '花园',
    emoji: '🌻',
    words: {
      starters: [
        { chinese: '花', pinyin: 'huā', english: 'flower', emoji: '🌸', sentences: ['花很漂亮。', '我喜欢花。'] },
        { chinese: '草', pinyin: 'cǎo', english: 'grass', emoji: '🌿', sentences: ['草是绿色的。', '我在草地上玩。'] },
        { chinese: '叶', pinyin: 'yè', english: 'leaf', emoji: '🍃', sentences: ['叶子掉了。', '叶子是绿色的。'] },
        { chinese: '根', pinyin: 'gēn', english: 'root', emoji: '🌱', sentences: ['树根在地下。', '根很长。'] },
        { chinese: '种', pinyin: 'zhǒng', english: 'seed', emoji: '🌱', sentences: ['种子发芽了。', '我种了一颗种子。'] },
        { chinese: '土', pinyin: 'tǔ', english: 'soil', emoji: '🟤', sentences: ['土是棕色的。', '植物长在土里。'] },
        { chinese: '竹', pinyin: 'zhú', english: 'bamboo', emoji: '🎋', sentences: ['竹子很高。', '熊猫吃竹子。'] },
        { chinese: '松', pinyin: 'sōng', english: 'pine', emoji: '🌲', sentences: ['松树是绿色的。', '松树很高大。'] },
        { chinese: '梅', pinyin: 'méi', english: 'plum blossom', emoji: '🌸', sentences: ['梅花在冬天开。', '梅花很香。'] },
        { chinese: '藤', pinyin: 'téng', english: 'vine', emoji: '🍇', sentences: ['藤爬上了墙。', '藤上有葡萄。'] },
        { chinese: '芽', pinyin: 'yá', english: 'sprout', emoji: '🌱', sentences: ['种子长出了芽。', '小芽是嫩绿色的。'] },
        { chinese: '露', pinyin: 'lù', english: 'dew', emoji: '💧', sentences: ['早晨有露水。', '露珠在叶子上。'] },
      ],
      movers: [
        { chinese: '玫瑰', pinyin: 'méiguī', english: 'rose', emoji: '🌹', sentences: ['玫瑰是红色的。', '玫瑰很香。'] },
        { chinese: '菊花', pinyin: 'júhuā', english: 'chrysanthemum', emoji: '🌼', sentences: ['菊花在秋天开。', '菊花有很多颜色。'] },
        { chinese: '荷花', pinyin: 'héhuā', english: 'lotus', emoji: '🪷', sentences: ['荷花在水上。', '荷花是粉色的。'] },
        { chinese: '向日葵', pinyin: 'xiàngrìkuí', english: 'sunflower', emoji: '🌻', sentences: ['向日葵朝着太阳。', '向日葵很高。'] },
        { chinese: '郁金香', pinyin: 'yùjīnxiāng', english: 'tulip', emoji: '🌷', sentences: ['郁金香很漂亮。', '郁金香有很多颜色。'] },
        { chinese: '仙人掌', pinyin: 'xiānrénzhǎng', english: 'cactus', emoji: '🌵', sentences: ['仙人掌有刺。', '仙人掌生活在沙漠。'] },
        { chinese: '蘑菇', pinyin: 'mógu', english: 'mushroom', emoji: '🍄', sentences: ['蘑菇在树下。', '这个蘑菇很大。'] },
        { chinese: '枫叶', pinyin: 'fēngyè', english: 'maple leaf', emoji: '🍁', sentences: ['枫叶变红了。', '秋天枫叶很美。'] },
        { chinese: '花盆', pinyin: 'huāpén', english: 'flower pot', emoji: '🪴', sentences: ['花盆里种着花。', '花盆在阳台上。'] },
        { chinese: '松果', pinyin: 'sōngguǒ', english: 'pinecone', emoji: '🌲', sentences: ['松果从树上掉下来。', '松鼠喜欢松果。'] },
        { chinese: '三叶草', pinyin: 'sānyècǎo', english: 'clover', emoji: '🍀', sentences: ['四叶草很幸运。', '三叶草在草地上。'] },
        { chinese: '花束', pinyin: 'huāshù', english: 'bouquet', emoji: '💐', sentences: ['这束花束很美。', '我送妈妈一束花。'] },
      ],
      flyers: [
        { chinese: '薰衣草', pinyin: 'xūnyīcǎo', english: 'lavender', emoji: '💜', sentences: ['薰衣草是紫色的。', '薰衣草的味道很香。'] },
        { chinese: '含羞草', pinyin: 'hánxiūcǎo', english: 'mimosa', emoji: '🌿', sentences: ['含羞草一碰就合上。', '含羞草很有趣。'] },
        { chinese: '牵牛花', pinyin: 'qiānniúhuā', english: 'morning glory', emoji: '🌸', sentences: ['牵牛花早上开。', '牵牛花是蓝色的。'] },
        { chinese: '蒲公英', pinyin: 'púgōngyīng', english: 'dandelion', emoji: '🌼', sentences: ['蒲公英会飞。', '吹一口气蒲公英就散了。'] },
        { chinese: '椰子树', pinyin: 'yēzishù', english: 'coconut tree', emoji: '🌴', sentences: ['椰子树在海边。', '椰子树上有椰子。'] },
        { chinese: '水仙花', pinyin: 'shuǐxiānhuā', english: 'daffodil', emoji: '🌼', sentences: ['水仙花在春天开。', '水仙花很清香。'] },
        { chinese: '迷迭香', pinyin: 'mídiéxiāng', english: 'rosemary', emoji: '🌿', sentences: ['迷迭香是一种香料。', '做饭可以用迷迭香。'] },
        { chinese: '橡树', pinyin: 'xiàngshù', english: 'oak tree', emoji: '🌳', sentences: ['橡树很高大。', '橡树上有松鼠。'] },
        { chinese: '樱花', pinyin: 'yīnghuā', english: 'cherry blossom', emoji: '🌸', sentences: ['樱花在春天开放。', '樱花是粉色的。'] },
        { chinese: '盆栽', pinyin: 'pénzāi', english: 'bonsai', emoji: '🪴', sentences: ['盆栽是小树。', '爷爷喜欢养盆栽。'] },
        { chinese: '稻草人', pinyin: 'dàocǎorén', english: 'scarecrow', emoji: '🎃', sentences: ['稻草人在田里。', '稻草人吓走小鸟。'] },
        { chinese: '栅栏', pinyin: 'zhàlan', english: 'fence', emoji: '🏡', sentences: ['花园有栅栏。', '栅栏是白色的。'] },
      ],
    },
  },
  // ============================================================
  // 23. Kitchen (厨房)
  // ============================================================
  {
    id: 'kitchen',
    name: '厨房',
    emoji: '🍳',
    words: {
      starters: [
        { chinese: '锅', pinyin: 'guō', english: 'pot/pan', emoji: '🍳', sentences: ['锅在炉子上。', '用锅炒菜。'] },
        { chinese: '碗', pinyin: 'wǎn', english: 'bowl', emoji: '🥣', sentences: ['碗里有饭。', '我用碗吃饭。'] },
        { chinese: '杯', pinyin: 'bēi', english: 'cup', emoji: '☕', sentences: ['杯子里有水。', '我用杯子喝水。'] },
        { chinese: '盘', pinyin: 'pán', english: 'plate', emoji: '🍽️', sentences: ['盘子是圆的。', '菜放在盘子里。'] },
        { chinese: '刀', pinyin: 'dāo', english: 'knife', emoji: '🔪', sentences: ['用刀切菜。', '刀很锋利。'] },
        { chinese: '勺', pinyin: 'sháo', english: 'spoon', emoji: '🥄', sentences: ['用勺子喝汤。', '勺子是银色的。'] },
        { chinese: '筷', pinyin: 'kuài', english: 'chopsticks', emoji: '🥢', sentences: ['用筷子吃饭。', '筷子是木头做的。'] },
        { chinese: '炉', pinyin: 'lú', english: 'stove', emoji: '🔥', sentences: ['炉子上有锅。', '打开炉子做饭。'] },
        { chinese: '油', pinyin: 'yóu', english: 'oil', emoji: '🫗', sentences: ['锅里倒油。', '油在锅里热了。'] },
        { chinese: '盐', pinyin: 'yán', english: 'salt', emoji: '🧂', sentences: ['放一点盐。', '盐让菜更好吃。'] },
        { chinese: '糖', pinyin: 'táng', english: 'sugar', emoji: '🍬', sentences: ['糖是甜的。', '我加了一勺糖。'] },
        { chinese: '汤', pinyin: 'tāng', english: 'soup', emoji: '🍜', sentences: ['汤很热。', '妈妈做了鸡汤。'] },
      ],
      movers: [
        { chinese: '冰箱', pinyin: 'bīngxiāng', english: 'refrigerator', emoji: '🧊', sentences: ['冰箱里有牛奶。', '把食物放进冰箱。'] },
        { chinese: '烤箱', pinyin: 'kǎoxiāng', english: 'oven', emoji: '🔥', sentences: ['烤箱在烤蛋糕。', '烤箱很热。'] },
        { chinese: '茶壶', pinyin: 'cháhú', english: 'teapot', emoji: '🫖', sentences: ['茶壶里有热茶。', '茶壶是陶瓷的。'] },
        { chinese: '酱油', pinyin: 'jiàngyóu', english: 'soy sauce', emoji: '🫙', sentences: ['加一点酱油。', '酱油是黑色的。'] },
        { chinese: '面粉', pinyin: 'miànfěn', english: 'flour', emoji: '🌾', sentences: ['面粉是白色的。', '用面粉做面包。'] },
        { chinese: '菜板', pinyin: 'càibǎn', english: 'cutting board', emoji: '🪵', sentences: ['在菜板上切菜。', '菜板是木头做的。'] },
        { chinese: '饭锅', pinyin: 'fànguō', english: 'rice cooker', emoji: '🍚', sentences: ['饭锅在煮饭。', '饭锅很方便。'] },
        { chinese: '围裙', pinyin: 'wéiqún', english: 'apron', emoji: '🧑‍🍳', sentences: ['妈妈穿着围裙。', '围裙保护衣服。'] },
        { chinese: '蒸笼', pinyin: 'zhēnglóng', english: 'steamer', emoji: '♨️', sentences: ['蒸笼在冒蒸气。', '用蒸笼蒸包子。'] },
        { chinese: '平底锅', pinyin: 'píngdǐguō', english: 'frying pan', emoji: '🍳', sentences: ['平底锅煎鸡蛋。', '平底锅在炉子上。'] },
        { chinese: '抹布', pinyin: 'mābù', english: 'dishcloth', emoji: '🧹', sentences: ['用抹布擦桌子。', '抹布是湿的。'] },
        { chinese: '味精', pinyin: 'wèijīng', english: 'MSG', emoji: '🧂', sentences: ['加一点味精。', '味精让菜更鲜。'] },
      ],
      flyers: [
        { chinese: '微波炉', pinyin: 'wēibōlú', english: 'microwave', emoji: '📦', sentences: ['微波炉加热食物。', '微波炉在厨房里。'] },
        { chinese: '洗碗机', pinyin: 'xǐwǎnjī', english: 'dishwasher', emoji: '🍽️', sentences: ['洗碗机洗碗。', '洗碗机很方便。'] },
        { chinese: '搅拌机', pinyin: 'jiǎobànjī', english: 'blender', emoji: '🧃', sentences: ['搅拌机打果汁。', '搅拌机很响。'] },
        { chinese: '保鲜膜', pinyin: 'bǎoxiānmó', english: 'plastic wrap', emoji: '🫙', sentences: ['用保鲜膜包食物。', '保鲜膜是透明的。'] },
        { chinese: '电饭煲', pinyin: 'diànfànbāo', english: 'rice cooker', emoji: '🍚', sentences: ['电饭煲在煮饭。', '电饭煲很方便。'] },
        { chinese: '不粘锅', pinyin: 'búzhānguō', english: 'non-stick pan', emoji: '🍳', sentences: ['不粘锅煎东西不会糊。', '不粘锅很好用。'] },
        { chinese: '压力锅', pinyin: 'yālìguō', english: 'pressure cooker', emoji: '♨️', sentences: ['压力锅煮得很快。', '压力锅炖肉很软。'] },
        { chinese: '调味料', pinyin: 'tiáowèiliào', english: 'seasoning', emoji: '🧂', sentences: ['加一些调味料。', '调味料让菜更好吃。'] },
        { chinese: '榨汁机', pinyin: 'zhàzhījī', english: 'juicer', emoji: '🧃', sentences: ['榨汁机榨橙汁。', '我用榨汁机做果汁。'] },
        { chinese: '烘焙', pinyin: 'hōngbèi', english: 'baking', emoji: '🧁', sentences: ['我喜欢烘焙蛋糕。', '烘焙需要面粉和糖。'] },
        { chinese: '砧板', pinyin: 'zhēnbǎn', english: 'chopping board', emoji: '🪵', sentences: ['在砧板上切菜。', '砧板是竹子做的。'] },
        { chinese: '开瓶器', pinyin: 'kāipíngqì', english: 'bottle opener', emoji: '🍾', sentences: ['用开瓶器开瓶子。', '开瓶器在抽屉里。'] },
      ],
    },
  },
  // ============================================================
  // 24. Shapes (形状)
  // ============================================================
  {
    id: 'shapes',
    name: '形状',
    emoji: '🔷',
    words: {
      starters: [
        { chinese: '圆', pinyin: 'yuán', english: 'circle', emoji: '🔵', sentences: ['圆是圆形的。', '球是圆的。'] },
        { chinese: '方', pinyin: 'fāng', english: 'square', emoji: '🟧', sentences: ['方是四方形。', '这个盒子是方的。'] },
        { chinese: '线', pinyin: 'xiàn', english: 'line', emoji: '📏', sentences: ['画一条线。', '线是直的。'] },
        { chinese: '点', pinyin: 'diǎn', english: 'dot', emoji: '⚫', sentences: ['画一个点。', '点很小。'] },
        { chinese: '角', pinyin: 'jiǎo', english: 'angle/corner', emoji: '📐', sentences: ['三角形有三个角。', '角是尖的。'] },
        { chinese: '边', pinyin: 'biān', english: 'side/edge', emoji: '▶️', sentences: ['正方形有四条边。', '每条边一样长。'] },
        { chinese: '面', pinyin: 'miàn', english: 'surface/face', emoji: '🔲', sentences: ['正方体有六个面。', '每个面都是平的。'] },
        { chinese: '球', pinyin: 'qiú', english: 'sphere/ball', emoji: '🟡', sentences: ['球是圆的。', '地球是一个球。'] },
        { chinese: '弧', pinyin: 'hú', english: 'arc', emoji: '🌈', sentences: ['彩虹是一个弧。', '弧是弯的。'] },
        { chinese: '环', pinyin: 'huán', english: 'ring/loop', emoji: '💍', sentences: ['环是圆形的。', '他戴着一个环。'] },
        { chinese: '尖', pinyin: 'jiān', english: 'point/sharp', emoji: '🔺', sentences: ['三角形有尖。', '铅笔头很尖。'] },
        { chinese: '平', pinyin: 'píng', english: 'flat', emoji: '📋', sentences: ['桌面是平的。', '平面很光滑。'] },
      ],
      movers: [
        { chinese: '三角形', pinyin: 'sānjiǎoxíng', english: 'triangle', emoji: '🔺', sentences: ['三角形有三条边。', '三角形有三个角。'] },
        { chinese: '正方形', pinyin: 'zhèngfāngxíng', english: 'square', emoji: '🟦', sentences: ['正方形四条边一样长。', '正方形有四个角。'] },
        { chinese: '长方形', pinyin: 'chángfāngxíng', english: 'rectangle', emoji: '🟩', sentences: ['长方形有两条长边。', '门是长方形的。'] },
        { chinese: '圆形', pinyin: 'yuánxíng', english: 'circle', emoji: '⭕', sentences: ['圆形没有角。', '硬币是圆形的。'] },
        { chinese: '星形', pinyin: 'xīngxíng', english: 'star shape', emoji: '⭐', sentences: ['星形有五个角。', '我画了一个星形。'] },
        { chinese: '心形', pinyin: 'xīnxíng', english: 'heart shape', emoji: '❤️', sentences: ['心形代表爱。', '我画了一个心形。'] },
        { chinese: '菱形', pinyin: 'língxíng', english: 'diamond', emoji: '💎', sentences: ['菱形有四条边。', '菱形是斜的正方形。'] },
        { chinese: '椭圆', pinyin: 'tuǒyuán', english: 'oval', emoji: '🥚', sentences: ['鸡蛋是椭圆形的。', '椭圆像扁了的圆。'] },
        { chinese: '箭头', pinyin: 'jiàntóu', english: 'arrow', emoji: '➡️', sentences: ['箭头指向右边。', '跟着箭头走。'] },
        { chinese: '螺旋', pinyin: 'luóxuán', english: 'spiral', emoji: '🌀', sentences: ['螺旋转圈圈。', '蜗牛壳是螺旋形的。'] },
        { chinese: '波浪', pinyin: 'bōlàng', english: 'wave shape', emoji: '〰️', sentences: ['波浪线弯弯曲曲。', '海上有波浪。'] },
        { chinese: '月牙', pinyin: 'yuèyá', english: 'crescent', emoji: '🌙', sentences: ['月牙是弯的。', '今天的月亮是月牙形。'] },
      ],
      flyers: [
        { chinese: '五角星', pinyin: 'wǔjiǎoxīng', english: 'five-pointed star', emoji: '⭐', sentences: ['五角星有五个角。', '国旗上有五角星。'] },
        { chinese: '六边形', pinyin: 'liùbiānxíng', english: 'hexagon', emoji: '⬡', sentences: ['六边形有六条边。', '蜂巢是六边形的。'] },
        { chinese: '圆柱体', pinyin: 'yuánzhùtǐ', english: 'cylinder', emoji: '🥫', sentences: ['罐头是圆柱体。', '圆柱体两头是圆的。'] },
        { chinese: '正方体', pinyin: 'zhèngfāngtǐ', english: 'cube', emoji: '🧊', sentences: ['骰子是正方体。', '正方体有六个面。'] },
        { chinese: '平行线', pinyin: 'píngxíngxiàn', english: 'parallel lines', emoji: '➿', sentences: ['平行线不会相交。', '铁轨是平行线。'] },
        { chinese: '对角线', pinyin: 'duìjiǎoxiàn', english: 'diagonal', emoji: '↗️', sentences: ['对角线从角到角。', '正方形有两条对角线。'] },
        { chinese: '金字塔形', pinyin: 'jīnzìtǎxíng', english: 'pyramid shape', emoji: '🔺', sentences: ['金字塔形是三角的。', '这个积木是金字塔形。'] },
        { chinese: '半圆形', pinyin: 'bànyuánxíng', english: 'semicircle', emoji: '🌗', sentences: ['半圆形是圆的一半。', '彩虹像半圆形。'] },
        { chinese: '十字形', pinyin: 'shízìxíng', english: 'cross shape', emoji: '✝️', sentences: ['十字形有四个方向。', '红十字是十字形。'] },
        { chinese: '对称', pinyin: 'duìchèn', english: 'symmetry', emoji: '🦋', sentences: ['蝴蝶是对称的。', '对称就是两边一样。'] },
        { chinese: '梯形', pinyin: 'tīxíng', english: 'trapezoid', emoji: '🔶', sentences: ['梯形有四条边。', '梯形上面短下面长。'] },
        { chinese: '棱锥', pinyin: 'léngzhuī', english: 'pyramid', emoji: '🔺', sentences: ['棱锥有一个尖顶。', '棱锥的底面是多边形。'] },
      ],
    },
  },
  // ============================================================
  // 25. Holidays (节日)
  // ============================================================
  {
    id: 'holidays',
    name: '节日',
    emoji: '🎉',
    words: {
      starters: [
        { chinese: '红', pinyin: 'hóng', english: 'red', emoji: '🔴', sentences: ['过年要穿红色。', '红色代表吉祥。'] },
        { chinese: '灯', pinyin: 'dēng', english: 'lantern/light', emoji: '🏮', sentences: ['灯笼很漂亮。', '挂上红灯。'] },
        { chinese: '鞭', pinyin: 'biān', english: 'firecracker', emoji: '🧨', sentences: ['过年放鞭炮。', '鞭炮很响。'] },
        { chinese: '饺', pinyin: 'jiǎo', english: 'dumpling', emoji: '🥟', sentences: ['过年吃饺子。', '饺子很好吃。'] },
        { chinese: '福', pinyin: 'fú', english: 'fortune/luck', emoji: '🧧', sentences: ['贴福字。', '福代表幸福。'] },
        { chinese: '歌', pinyin: 'gē', english: 'song', emoji: '🎵', sentences: ['唱节日歌。', '歌声很好听。'] },
        { chinese: '舞', pinyin: 'wǔ', english: 'dance', emoji: '💃', sentences: ['跳舞庆祝。', '舞很好看。'] },
        { chinese: '礼', pinyin: 'lǐ', english: 'gift', emoji: '🎁', sentences: ['送礼物给朋友。', '收到一个礼物。'] },
        { chinese: '糕', pinyin: 'gāo', english: 'cake', emoji: '🎂', sentences: ['生日吃蛋糕。', '糕点很甜。'] },
        { chinese: '旗', pinyin: 'qí', english: 'flag', emoji: '🏳️', sentences: ['国庆节挂旗。', '旗在风中飘。'] },
        { chinese: '月', pinyin: 'yuè', english: 'moon', emoji: '🌕', sentences: ['中秋看月亮。', '月亮很圆。'] },
        { chinese: '龙', pinyin: 'lóng', english: 'dragon', emoji: '🐉', sentences: ['舞龙很热闹。', '龙是中国的象征。'] },
      ],
      movers: [
        { chinese: '春节', pinyin: 'chūnjié', english: 'Spring Festival', emoji: '🧧', sentences: ['春节是中国的新年。', '春节很热闹。'] },
        { chinese: '月饼', pinyin: 'yuèbing', english: 'mooncake', emoji: '🥮', sentences: ['中秋节吃月饼。', '月饼是圆的。'] },
        { chinese: '粽子', pinyin: 'zòngzi', english: 'rice dumpling', emoji: '🍙', sentences: ['端午节吃粽子。', '粽子很好吃。'] },
        { chinese: '灯笼', pinyin: 'dēnglóng', english: 'lantern', emoji: '🏮', sentences: ['灯笼是红色的。', '元宵节挂灯笼。'] },
        { chinese: '烟花', pinyin: 'yānhuā', english: 'firework', emoji: '🎆', sentences: ['烟花很漂亮。', '过年放烟花。'] },
        { chinese: '气球', pinyin: 'qìqiú', english: 'balloon', emoji: '🎈', sentences: ['气球飞上天。', '气球有很多颜色。'] },
        { chinese: '彩带', pinyin: 'cǎidài', english: 'ribbon', emoji: '🎀', sentences: ['彩带很漂亮。', '用彩带装饰。'] },
        { chinese: '红包', pinyin: 'hóngbāo', english: 'red envelope', emoji: '🧧', sentences: ['过年收红包。', '红包里有钱。'] },
        { chinese: '对联', pinyin: 'duìlián', english: 'couplet', emoji: '📜', sentences: ['门上贴对联。', '对联是红色的。'] },
        { chinese: '蛋糕', pinyin: 'dàngāo', english: 'cake', emoji: '🎂', sentences: ['生日吃蛋糕。', '蛋糕上有蜡烛。'] },
        { chinese: '糖果', pinyin: 'tángguǒ', english: 'candy', emoji: '🍬', sentences: ['节日吃糖果。', '糖果是甜的。'] },
        { chinese: '鞭炮', pinyin: 'biānpào', english: 'firecracker', emoji: '🧨', sentences: ['过年放鞭炮。', '鞭炮噼里啪啦响。'] },
      ],
      flyers: [
        { chinese: '中秋节', pinyin: 'zhōngqiūjié', english: 'Mid-Autumn Festival', emoji: '🌕', sentences: ['中秋节赏月。', '中秋节一家人团聚。'] },
        { chinese: '端午节', pinyin: 'duānwǔjié', english: 'Dragon Boat Festival', emoji: '🐉', sentences: ['端午节赛龙舟。', '端午节吃粽子。'] },
        { chinese: '元宵节', pinyin: 'yuánxiāojié', english: 'Lantern Festival', emoji: '🏮', sentences: ['元宵节看花灯。', '元宵节吃元宵。'] },
        { chinese: '圣诞节', pinyin: 'shèngdànjié', english: 'Christmas', emoji: '🎄', sentences: ['圣诞节有圣诞树。', '圣诞老人送礼物。'] },
        { chinese: '万圣节', pinyin: 'wànshèngjié', english: 'Halloween', emoji: '🎃', sentences: ['万圣节穿化装。', '万圣节有南瓜灯。'] },
        { chinese: '感恩节', pinyin: 'gǎn\'ēnjié', english: 'Thanksgiving', emoji: '🦃', sentences: ['感恩节吃火鸡。', '感恩节要感恩。'] },
        { chinese: '国庆节', pinyin: 'guóqìngjié', english: 'National Day', emoji: '🏳️', sentences: ['国庆节放假。', '国庆节有烟花。'] },
        { chinese: '儿童节', pinyin: 'értóngjié', english: "Children's Day", emoji: '🧒', sentences: ['儿童节是小朋友的节日。', '儿童节可以收到礼物。'] },
        { chinese: '情人节', pinyin: 'qíngrenjié', english: "Valentine's Day", emoji: '❤️', sentences: ['情人节送玫瑰花。', '情人节代表爱。'] },
        { chinese: '清明节', pinyin: 'qīngmíngjié', english: 'Tomb Sweeping Day', emoji: '🌿', sentences: ['清明节扫墓。', '清明节在春天。'] },
        { chinese: '除夕', pinyin: 'chúxī', english: "New Year's Eve", emoji: '🎆', sentences: ['除夕夜看春晚。', '除夕一家人吃年夜饭。'] },
        { chinese: '舞龙舞狮', pinyin: 'wǔlóngwǔshī', english: 'dragon and lion dance', emoji: '🐉', sentences: ['春节有舞龙舞狮。', '舞龙舞狮很热闹。'] },
      ],
    },
  },
  // ============================================================
  // 26. Technology (科技)
  // ============================================================
  {
    id: 'technology',
    name: '科技',
    emoji: '📱',
    words: {
      starters: [
        { chinese: '灯', pinyin: 'dēng', english: 'light', emoji: '💡', sentences: ['灯亮了。', '打开灯。'] },
        { chinese: '钟', pinyin: 'zhōng', english: 'clock', emoji: '🕐', sentences: ['钟在响。', '看钟几点了。'] },
        { chinese: '键', pinyin: 'jiàn', english: 'key/button', emoji: '⌨️', sentences: ['按一下键。', '键盘上有很多键。'] },
        { chinese: '屏', pinyin: 'píng', english: 'screen', emoji: '🖥️', sentences: ['屏幕很亮。', '看屏幕上的字。'] },
        { chinese: '线', pinyin: 'xiàn', english: 'wire/cable', emoji: '🔌', sentences: ['线插上了。', '电线很长。'] },
        { chinese: '网', pinyin: 'wǎng', english: 'internet/net', emoji: '🌐', sentences: ['上网查资料。', '网络很快。'] },
        { chinese: '码', pinyin: 'mǎ', english: 'code', emoji: '💻', sentences: ['扫二维码。', '密码是什么？'] },
        { chinese: '芯', pinyin: 'xīn', english: 'chip', emoji: '🔲', sentences: ['芯片很小。', '电脑里有芯片。'] },
        { chinese: '磁', pinyin: 'cí', english: 'magnetic', emoji: '🧲', sentences: ['磁铁吸住了铁。', '磁力很大。'] },
        { chinese: '片', pinyin: 'piàn', english: 'disc/chip', emoji: '💿', sentences: ['光片在转。', '这个芯片很小。'] },
        { chinese: '机', pinyin: 'jī', english: 'machine', emoji: '⚙️', sentences: ['机器在工作。', '这台机很先进。'] },
        { chinese: '电', pinyin: 'diàn', english: 'electricity', emoji: '⚡', sentences: ['电灯亮了。', '没有电了。'] },
      ],
      movers: [
        { chinese: '手机', pinyin: 'shǒujī', english: 'phone', emoji: '📱', sentences: ['手机响了。', '我用手机打电话。'] },
        { chinese: '电脑', pinyin: 'diànnǎo', english: 'computer', emoji: '💻', sentences: ['电脑在桌上。', '我用电脑写作业。'] },
        { chinese: '电池', pinyin: 'diànchí', english: 'battery', emoji: '🔋', sentences: ['电池没电了。', '换一个新电池。'] },
        { chinese: '相机', pinyin: 'xiàngjī', english: 'camera', emoji: '📷', sentences: ['相机拍照。', '我有一个新相机。'] },
        { chinese: '耳机', pinyin: 'ěrjī', english: 'headphones', emoji: '🎧', sentences: ['戴上耳机听音乐。', '耳机是白色的。'] },
        { chinese: '鼠标', pinyin: 'shǔbiāo', english: 'mouse', emoji: '🖱️', sentences: ['点击鼠标。', '鼠标在桌上。'] },
        { chinese: '音箱', pinyin: 'yīnxiāng', english: 'speaker', emoji: '🔊', sentences: ['音箱在放音乐。', '音箱声音很大。'] },
        { chinese: '天线', pinyin: 'tiānxiàn', english: 'antenna', emoji: '📡', sentences: ['天线接收信号。', '屋顶上有天线。'] },
        { chinese: '激光', pinyin: 'jīguāng', english: 'laser', emoji: '🔴', sentences: ['激光是一束光。', '激光很亮。'] },
        { chinese: '信号', pinyin: 'xìnhào', english: 'signal', emoji: '📶', sentences: ['信号很好。', '手机没信号了。'] },
        { chinese: '密码', pinyin: 'mìmǎ', english: 'password', emoji: '🔑', sentences: ['输入密码。', '不要告诉别人密码。'] },
        { chinese: '光盘', pinyin: 'guāngpán', english: 'disc', emoji: '💿', sentences: ['光盘上有歌。', '把光盘放进去。'] },
      ],
      flyers: [
        { chinese: '打印机', pinyin: 'dǎyìnjī', english: 'printer', emoji: '🖨️', sentences: ['打印机在打印。', '打印机需要墨水。'] },
        { chinese: '机器人', pinyin: 'jīqìrén', english: 'robot', emoji: '🤖', sentences: ['机器人会走路。', '机器人很聪明。'] },
        { chinese: '卫星', pinyin: 'wèixīng', english: 'satellite', emoji: '🛰️', sentences: ['卫星在太空。', '卫星绕地球转。'] },
        { chinese: '键盘', pinyin: 'jiànpán', english: 'keyboard', emoji: '⌨️', sentences: ['在键盘上打字。', '键盘有很多按键。'] },
        { chinese: '充电器', pinyin: 'chōngdiànqì', english: 'charger', emoji: '🔌', sentences: ['手机要充电器。', '充电器插在墙上。'] },
        { chinese: '太阳能', pinyin: 'tàiyángnéng', english: 'solar energy', emoji: '☀️', sentences: ['太阳能很环保。', '太阳能板在屋顶。'] },
        { chinese: '平板电脑', pinyin: 'píngbǎndiànnǎo', english: 'tablet', emoji: '📱', sentences: ['平板电脑很轻。', '我在平板电脑上画画。'] },
        { chinese: '投影仪', pinyin: 'tóuyǐngyí', english: 'projector', emoji: '📽️', sentences: ['投影仪放大画面。', '教室里有投影仪。'] },
        { chinese: '蓝牙', pinyin: 'lányá', english: 'bluetooth', emoji: '🔵', sentences: ['蓝牙连接耳机。', '蓝牙不用线。'] },
        { chinese: '无人机', pinyin: 'wúrénjī', english: 'drone', emoji: '🛸', sentences: ['无人机在天上飞。', '无人机可以拍照。'] },
        { chinese: '虚拟现实', pinyin: 'xūnǐxiànshí', english: 'virtual reality', emoji: '🥽', sentences: ['虚拟现实很好玩。', '戴上眼镜进入虚拟现实。'] },
        { chinese: '互联网', pinyin: 'hùliánwǎng', english: 'internet', emoji: '🌐', sentences: ['互联网连接世界。', '在互联网上查资料。'] },
      ],
    },
  },
]

// ============================================================
// Utility functions
// ============================================================

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function getWords(category: ChineseCategory, level: Level): ChineseWord[] {
  return category.words[level]
}
