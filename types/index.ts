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

type FriendlyShipType =
  | '艦'
  | '駆逐'
  | '軽巡'
  | '重巡'
  | '航巡'
  | '水母'
  | '空母'
  | '軽母'
  | '装母'
  | '戦艦'
  | '低速戦艦'
  | '航戦'
  | '高速艦'
  | '潜水艦'
  | '潜水空母'
  | '潜水母艦'
  | '海防艦'
type EnemyType = '敵補給艦' | '敵潜水艦' | '敵空母' | '敵軽母'
type OtherShipType = '他の艦'
type ShipType = FriendlyShipType | EnemyType | OtherShipType

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

interface AGouRequirement {
  /**
   * あ 号
   */
  category: 'a-gou'
}

interface SimpleRequirement {
  /**
   * 简单任务
   */
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

interface FleetRequirement {
  /**
   * 编成任务
   */
  category: 'fleet'
  /**
   * 编成要求
   */
  groups: Group[]
  disallowed?: ShipType
  /**
   * 第几舰队
   */
  fleetid?: number
}

interface EquipexchangeRequirement {
  /**
   * 装备准备
   */
  category: 'equipexchange'
  // TODO limit anyOf
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
 * May be can alternative with EquipexchangeRequirement
 *
 * @deprecated
 */
interface ScrapequipmentRequirement {
  /**
   * 废弃装备
   */
  category: 'scrapequipment'
  list: Item[]
}

interface ExcerciseRequirement {
  /**
   * 演习任务
   */
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
  groups?: Group[]
}

interface ExpeditionRequirement {
  /**
   * 远征任务
   */
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
  disallowed?: ShipType
}

interface ModelconversionRequirement {
  /**
   * 机种转换
   */
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

interface ModernizationRequirement {
  /**
   * 近代化改修/舰装合成
   *
   * 准备资源 resources，对 ship 近代化改造成功 times 次，每次消耗 consumptions
   */
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

interface SinkRequirement {
  /**
   * 击沉
   */
  category: 'sink'
  amount: number
  ship: string // TODO
}

type Result = 'A' | 'B' | 'C' | 'S' | 'クリア'

interface SortieRequirement {
  /**
   * 出击任务
   */
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
  disallowed?: ShipType
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
   *
   * 1. Composition
   * 1. Sortie
   * 1. Exercise
   * 1. Expedition
   * 1. Supply/Docking
   * 1. Arsenal
   * 1. Modernization
   *
   * @see https://github.com/poooi/plugin-quest/blob/master/index.es#L49-L57
   */
  category: 1 | 2 | 3 | 4 | 5 | 6 | 7 // | 8 | 9
  /**
   * 任务类型
   *
   * 1. One-time
   * 1. Daily
   * 1. Weekly
   * 1. -3rd/-7th/-0th
   * 1. -2nd/-8th
   * 1. Monthly
   * 1. Quarterly
   *
   * @see https://github.com/poooi/plugin-quest/blob/master/index.es#L69-L77
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
  reward_fuel: Resources[0]
  /**
   * 任务奖励 弹
   */
  reward_ammo: Resources[1]
  /**
   * 任务奖励 钢
   */
  reward_steel: Resources[2]
  /**
   * 任务奖励 铝
   */
  reward_bauxite: Resources[3]
  /**
   * 任务奖励 其他奖励
   */
  reward_other: RewardOther
  /**
   * 前置任务
   */
  prerequisite: number[]
  /**
   * 任务要求
   */
  requirements: Requirements
}
