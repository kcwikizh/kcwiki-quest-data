/**
 * 物品
 */
interface Item {
  /**
   * 名称
   */
  name: string // TODO
  /**
   * 类型
   */
  category?: '家具' | '艦娘' | '装備'
  /**
   * 数量
   */
  amount?: number
}

/**
 * 资源（油弹钢铝）
 */
type Resources = [number, number, number, number]

/**
 * 选择奖励
 */
interface RewardChoices {
  choices?: Item[]
}

type RewardOther = (Item | RewardChoices)[]

////////////////////////////////////////////////
// Requirements

/**
 * 编成要求
 */
interface Group {
  ship?: string[] | string // TODO
  amount?: number[] | number
  /**
   * 是否要求旗舰
   */
  flagship?: boolean
  lv?: number[]
  shipclass?: string[] | string // TODO
  select?: number
  place?: number
  note?: string
}

interface AndRequirement {
  category: 'and'
  list: NormalRequirement[]
}

interface ThenRequirement {
  category: 'then'
  list: NormalRequirement[]
}

interface OrRequirement {
  category: 'or'
  list: NormalRequirement[]
}

type ConjunctionRequirement = AndRequirement | ThenRequirement // | OrRequirement

/**
 * あ 号
 */
interface AGouRequirement {
  category: 'a-gou'
}

/**
 * 简单任务
 */
interface SimpleRequirement {
  category: 'simple'
  subcategory:
    | 'equipment'
    | 'ship'
    | 'scrapequipment'
    | 'scrapship'
    | 'modernization'
    | 'improvement'
    | 'resupply'
    | 'repair'
    | 'battle'
  times: number
  /**
   * for scrapequipment
   * scrapping together is ok
   */
  batch?: boolean // TODO
}

/**
 * 编成任务
 */
interface FleetRequirement {
  category: 'fleet'
  /**
   * 编成要求
   */
  groups: Group[]
  disallowed?: string
}

/**
 * 装备准备
 */
interface EquipexchangeRequirement {
  category: 'equipexchange'
  /**
   * 准备
   */
  equipments?: Item[]
  /**
   * 废弃
   */
  scraps?: Item[]
  /**
   * 消耗资源
   */
  resources?: Resources
  /**
   * 消耗物品
   */
  consumptions?: Item[]
}

/**
 * 演习任务
 */
interface ExcerciseRequirement {
  category: 'excercise'
  /**
   * 次数
   */
  times: number
  /**
   * 是否需要胜利
   */
  victory?: boolean
  /**
   * 是否要求同一天
   */
  daily?: boolean
}

/**
 * 远征任务
 */
interface ExpeditionRequirement {
  category: 'expedition'
  objects: {
    /**
     * 远征 id
     */
    id?: number | string | (number | string)[]
    times: number
  }[]
  /**
   * 消耗资源
   */
  resources?: Resources
  groups?: Group[]
  disallowed?: string
}

/**
 * 机种转换
 */
interface ModelconversionRequirement {
  category: 'modelconversion'
  slots?: {
    /**
     * 0 任意格
     */
    slot: 0 | 1 | 2 | 3 | 4
    equipment: string // TODO
    fullyskilled?: true
    maxmodified?: true
    count?: number
  }[]
  /**
   * 搭载未上锁的
   */
  equipment?: string | string[] // TODO
  /**
   * 满熟练度
   */
  fullyskilled?: true
  /**
   * 改修Max的
   */
  maxmodified?: true
  /**
   * 废弃
   */
  scraps?: Item[]
  /**
   * 消耗
   */
  consumptions?: Item[]
  resources?: Resources
  /**
   * 秘书舰 默认为空母
   */
  secretary?: string | string[] // TODO
  /**
   * 消耗一个熟练搭乘员
   */
  use_skilled_crew?: true
}

/**
 * 近代化改修/舰装合成
 * 准备资源 resources，对 ship 近代化改造成功 times 次，每次消耗 consumptions
 */
interface ModernizationRequirement {
  category: 'modernization'
  times: number
  /**
   * 对空母
   */
  ship: string
  /**
   * 每次消耗
   */
  consumptions?: [{ ship: string[]; amount: number }]
  /**
   * 准备/消耗资源
   */
  resources: Resources
}

/**
 * 废弃装备
 */
interface ScrapequipmentRequirement {
  category: 'scrapequipment'
  list: Item[]
}

/**
 * 击沉
 */
interface SinkRequirement {
  category: 'sink'
  amount: number
  ship: string // TODO
}

type Result = 'A' | 'B' | 'C' | 'S' | 'クリア'

/**
 * 出击任务
 */
interface SortieRequirement {
  category: 'sortie'
  times: number
  map?: string | string[]
  result?: Result
  boss?: true
  groups?: Group[]
  /**
   * 第几舰队
   */
  fleetid?: number
  disallowed?: string
}

type NormalRequirement =
  | AGouRequirement
  | SimpleRequirement
  | FleetRequirement
  | EquipexchangeRequirement
  | ExcerciseRequirement
  | ExpeditionRequirement
  | ModelconversionRequirement
  | ModernizationRequirement
  | ScrapequipmentRequirement
  | SinkRequirement
  | SortieRequirement

type Requirements = ConjunctionRequirement | NormalRequirement

/**
 * Kancolle Quest Data
 */
export interface Quest {
  /**
   * api上使用的任务识别号
   */
  game_id: number
  /**
   * 任务在wiki的编号
   */
  wiki_id: string
  /**
   * 任务类别
   * - `1`编成
   * - `2`出击
   * - `3`演习
   * - `4`远征
   * - `5`补给/入渠
   * - `6`工厂
   * - `7`改装
   * - `8`出击(2)
   * - `9`其他？
   */
  category: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  /**
   * 任务类型
   * - `1`单次
   * - `2`日常
   * - `3`周常
   * - `4`-3rd/-7th/-0th(在日期末尾为3, 7, 0的日子里出现的任务)(仅Bd4 截止20180113)
   * - `5`-2nd/-8th(在日期末尾是2, 8的日子出现的任务)(仅Bd6 截止20180113)
   * - `6`月常
   * - `7`季常
   */
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7
  /**
   * 任务名
   */
  name: string
  /**
   * 任务详情
   */
  detail: string
  /**
   * 任务奖励 油
   */
  reward_fuel: number
  /**
   * 任务奖励 弹
   */
  reward_ammo: number
  /**
   * 任务奖励 钢
   */
  reward_steel: number
  /**
   * 任务奖励 铝
   */
  reward_bauxite: number
  /**
   * 任务奖励 其他奖励
   */
  reward_other: RewardOther
  /**
   * 前置任务
   */
  prerequisite: number[] // TODO validation
  /**
   * 任务要求
   */
  requirements: Requirements
}
