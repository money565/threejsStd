import { defineStore } from 'pinia'

interface projectListOpt {
  label: string
  value: string
}

interface voltmeterOpt {
  volName: string
  volValue: number
}

interface ammeterOpt {
  ammName: string
  ammValue: number
}

interface powerOpt {
  powerOptName: string
  powerOptValue: number[]
  recordTime: string[]
  currentTime: number
}

interface optionsOpt {
  music: boolean
  volume: number
  brightness: number
}

interface allItemDatasOpt {
  refresh: number
  vol: number[]
  amt: {
    max: number[]
    cur: number[]
    dif: number[]
  }
  power: {
    currentLoad: number
    maxLoad: number
    pf: number
  }[]
}

export const useAppCacheStore = defineStore('appCache', () => {
  const refreshKey = ref(0)
  const refreshAmterLineKey = ref(0)
  const mqttClient = ref()
  const currentProject = ref<number>()
  const currentItem = ref<string>('-')
  const canBeClickedItem = ['1t', '2t', '3t', '4t', '5t', '6t', '7t', '8t']
  const itemPower = [1600, 1600, 2000, 2000, 1600, 1600, 800, 800]
  const ItemOnline = ref()
  const projectList = ref<projectListOpt[]>([])
  const itemPF = ref(0)
  const readData = ref({
    item: '',
    refresh: 0,
  })
  const temperature = ref<number | string>('-')
  const humidity = ref<number | string>('-')
  const volteLine = ref<[number[], number[], number[], number[], string[]]>([[], [], [], [], []])
  const amterLine = ref<[number[], number[], number[], number[], string[]]>([[], [], [], [], []])
  const allOverView = ref(true) // 总览所有数据

  const allItemDatas = ref<allItemDatasOpt>({
    refresh: 0,
    vol: [0, 0, 0, 0, 0, 0, 0, 200],
    amt: {
      max: [0, 0, 0, 0, 0, 0, 0, 0],
      cur: [0, 0, 0, 0, 0, 0, 0, 0],
      dif: [0, 0, 0, 0, 0, 0, 0, 0],
    },
    power: [{
      currentLoad: 0,
      maxLoad: 100,
      pf: 0,
    }],
  })

  const voltmeter = ref<voltmeterOpt[]>([{
    volName: 'A项电压',
    volValue: 0,
  }, {
    volName: 'B项电压',
    volValue: 0,
  }, {
    volName: 'C项电压',
    volValue: 0,
  }, {
    volName: '总电压',
    volValue: 0,
  }])
  const ammeter = ref<ammeterOpt[]>([{
    ammName: 'A项电流',
    ammValue: 0,
  }, {
    ammName: 'B项电流',
    ammValue: 0,
  }, {
    ammName: 'C项电流',
    ammValue: 0,
  }, {
    ammName: '总电流',
    ammValue: 0,
  }])
  const power = ref<powerOpt>({
    powerOptName: '功率表',
    powerOptValue: [],
    recordTime: [],
    currentTime: 0,
  })

  function resetData() {
    voltmeter.value = [{
      volName: 'A项电压',
      volValue: 0,
    }, {
      volName: 'B项电压',
      volValue: 0,
    }, {
      volName: 'C项电压',
      volValue: 0,
    }, {
      volName: '总电压',
      volValue: 0,
    }]
    ammeter.value = [{
      ammName: 'A项电流',
      ammValue: 0,
    }, {
      ammName: 'B项电流',
      ammValue: 0,
    }, {
      ammName: 'C项电流',
      ammValue: 0,
    }, {
      ammName: 'C项电流',
      ammValue: 0,
    }]
    power.value = {
      powerOptName: '功率表',
      powerOptValue: [],
      recordTime: [],
      currentTime: 0,
    }
    temperature.value = '-'
    humidity.value = '-'
    volteLine.value = [[], [], [], [], []]
    amterLine.value = [[], [], [], [], []]
    refreshKey.value = 0
    refreshAmterLineKey.value = 0
  }

  const options = ref<optionsOpt>({
    music: true,
    volume: 50,
    brightness: 10,
  })
  return { currentProject, projectList, voltmeter, ammeter, power, options, mqttClient, resetData, temperature, humidity, currentItem, volteLine, ItemOnline, canBeClickedItem, readData, refreshKey, refreshAmterLineKey, amterLine, itemPF, allOverView, allItemDatas, itemPower }
})
