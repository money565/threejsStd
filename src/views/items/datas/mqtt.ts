/* eslint-disable no-fallthrough */

/* eslint-disable no-async-promise-executor */

import type { MqttClient } from 'mqtt'
import { useAppCacheStore } from '@/stores/appCache'
import { useUserStore } from '@/stores/user'
import mqtt from 'mqtt'

const user = useUserStore()
const acs = useAppCacheStore()
export function connMqtt() {
  return new Promise(async (reactive, reject) => {
    const options = {
      clientId: `spot_client${String(user.userInfo.userInfo.clientID)}`,
      username: `spot_client${String(user.userInfo.userInfo.clientName)}`,
    }
    try {
      const mqttValue: MqttClient = mqtt.connect('ws://124.71.148.182:8083/mqtt', options)
      mqttValue.on('connect', () => {
        reactive(mqttValue)
      })
      mqttValue.on('message', (topic, message) => {
        const msg = JSON.parse(message.toString())
        if (msg.target === 'allInit') {
          const vol = []
          const amt_m = []
          const amt_c = []
          const amt_d = []
          const pw = []// 额定功率
          if (msg.data.length > 0) {
            for (const i in msg.data) {
              vol.push(Number(msg.data[i].data.vol))
              amt_m.push(Number(msg.data[i].data.max))
              amt_c.push(Number(msg.data[i].data.amt))
              amt_d.push(Number(msg.data[i].data.max) - Number(msg.data[i].data.amt))
              pw.push({
                currentLoad: Number(msg.data[i].data.pw),
                maxLoad: acs.itemPower[Number(i)] * Number(msg.data[i].data.pf),
                pf: Number(msg.data[i].data.pf),
              })
              // todo
            }
            acs.allItemDatas.vol = vol
            acs.allItemDatas.amt.cur = amt_c
            acs.allItemDatas.amt.max = amt_m
            acs.allItemDatas.amt.dif = amt_d
            acs.allItemDatas.power = pw
            acs.allItemDatas.refresh = new Date().getTime()
          }
        }
        if (msg.target === 'rd') {
          acs.readData.item = msg.item
          acs.readData.refresh = new Date().getTime()
        }
        if (msg.target === 'online') {
          acs.ItemOnline = msg.data
        }
        if (msg.target === 'volLine') {
          console.log(msg.data)
          acs.volteLine[0] = msg.data[0]
          acs.volteLine[1] = msg.data[1]
          acs.volteLine[2] = msg.data[2]
          acs.volteLine[3] = msg.data[3]
          const temp = []
          const dn = msg.data[0].length
          const TimeRange = Number(msg.TR[1]) - Number(msg.TR[0])
          for (let i = 0; i <= dn; i++) {
            const d = new Date(Math.ceil(Number(msg.TR[0]) + i * (TimeRange / dn)) * 1000)
            const hour = d.getHours()
            const min = d.getMinutes()
            temp.push(`${hour}:${min}`)
          }
          acs.volteLine[4] = temp
          acs.refreshKey = new Date().getTime()
        }
        if (msg.target === 'amtLine') {
          console.log(msg.data)
          acs.amterLine[0] = msg.data[0]
          acs.amterLine[1] = msg.data[1]
          acs.amterLine[2] = msg.data[2]
          acs.amterLine[3] = msg.data[3]
          const temp = []
          const dn = msg.data[0].length
          const TimeRange = Number(msg.TR[1]) - Number(msg.TR[0])
          for (let i = 0; i <= dn; i++) {
            const d = new Date(Math.ceil(Number(msg.TR[0]) + i * (TimeRange / dn)) * 1000)
            const hour = d.getHours()
            const min = d.getMinutes()
            temp.push(`${hour}:${min}`)
          }
          acs.amterLine[4] = temp
          acs.refreshAmterLineKey = new Date().getTime()
        }
        if (msg.target === 'powerLine') {
          console.log(msg.data)
          const temp = []
          const dn = msg.data[0].length
          const TimeRange = Number(msg.TR[1]) - Number(msg.TR[0])
          acs.powerLine = msg.data
          for (let i = 0; i <= dn; i++) {
            const d = new Date(Math.ceil(Number(msg.TR[0]) + i * (TimeRange / dn)) * 1000)
            const hour = d.getHours()
            const min = d.getMinutes()
            temp.push(`${hour}:${min}`)
          }
          acs.powerLine[2] = temp
          acs.refreshPowerLineKey = new Date().getTime()
        }
        if (msg.target === 'init') {
          const res = String(msg.data).split('_')
          acs.voltmeter[0].volValue = Number(res[0])
          acs.voltmeter[1].volValue = Number(res[1])
          acs.voltmeter[2].volValue = Number(res[2])
          acs.voltmeter[3].volValue = Number(res[3])
          acs.ammeter[0].ammValue = Number(res[4])
          acs.ammeter[1].ammValue = Number(res[5])
          acs.ammeter[2].ammValue = Number(res[6])
          acs.ammeter[3].ammValue = Number(res[7])
          acs.power.ap = Number(res[8])
          acs.power.rp = Number(res[9])
          acs.power.pf = Number(res[10])
          for (const i in acs.canBeClickedItem) {
            if (acs.currentItem === acs.canBeClickedItem[i]) {
              acs.power.max = acs.power.pf * acs.itemPower[i]
              break
            }
          }
          acs.power.refreshKey = new Date().getTime()
        }

        if (msg.target === 'data') {
          const datas = String(msg.data)
          acs.readData.item = msg.item
          acs.readData.refresh = new Date().getTime()
          if (datas.includes('&')) {
            acs.temperature = Number(datas.split('&')[1].split('_')[0])
            acs.humidity = Number(datas.split('&')[1].split('_')[1])
          }
          const dataList = datas.split(',')
          for (const i in dataList) {
            setTimeout(() => {
              for (const d in dataList[i].split('_')) {
                const ttt = new Date()
                const hour = ttt.getHours()
                const min = ttt.getMinutes()
                switch (d) {
                  case '0':
                    acs.voltmeter[0].volValue = Number(dataList[i].split('_')[d])
                    acs.volteLine[0].push(Number(dataList[i].split('_')[d]))
                    break
                  case '1':
                    acs.voltmeter[1].volValue = Number(dataList[i].split('_')[d])
                    acs.volteLine[1].push(Number(dataList[i].split('_')[d]))
                    break
                  case '2':
                    acs.voltmeter[2].volValue = Number(dataList[i].split('_')[d])
                    acs.volteLine[2].push(Number(dataList[i].split('_')[d]))
                    break
                  case '3':
                    acs.voltmeter[3].volValue = Number(dataList[i].split('_')[d])
                    acs.volteLine[3].push(Number(dataList[i].split('_')[d]))
                    acs.volteLine[4].push(`${hour}:${min}`)
                    acs.refreshKey = ttt.getTime()
                    break
                  case '4':
                    acs.ammeter[0].ammValue = Number(dataList[i].split('_')[d])
                    acs.amterLine[0].push(Number(dataList[i].split('_')[d]))
                    break
                  case '5':
                    acs.ammeter[1].ammValue = Number(dataList[i].split('_')[d])
                    acs.amterLine[1].push(Number(dataList[i].split('_')[d]))
                    break
                  case '6':
                    acs.ammeter[2].ammValue = Number(dataList[i].split('_')[d])
                    acs.amterLine[2].push(Number(dataList[i].split('_')[d]))
                    break
                  case '7':
                    acs.ammeter[3].ammValue = Number(dataList[i].split('_')[d])
                    acs.amterLine[3].push(Number(dataList[i].split('_')[d]))
                    acs.amterLine[4].push(`${hour}:${min}`)
                    acs.refreshAmterLineKey = ttt.getTime()
                    break
                  case '8':
                    acs.power.ap = Number(dataList[i].split('_')[d])
                  case '9':
                    acs.power.rp = Number(dataList[i].split('_')[d])
                  case '10':
                    acs.power.pf = Number(dataList[i].split('_')[d])
                    for (const i in acs.canBeClickedItem) {
                      if (acs.currentItem === acs.canBeClickedItem[i]) {
                        acs.power.max = acs.power.pf * acs.itemPower[i]
                        break
                      }
                    }
                    acs.power.refreshKey = new Date().getTime()
                  case '11':
                    acs.EC = Number(dataList[i].split('_')[d])
                  default:
                }
              }
            }, 2000)
          }
        }
      })
      mqttValue.on('disconnect', () => {
        console.log('Disconnected from MQTT broker')
      })
    }
    catch (error) {
      reject(error)
    }
  })
}

export function subscribe(connMqtt: MqttClient, topic: string) {
  connMqtt.subscribe(topic, { qos: 0 }, (err: any) => {
    if (err) {
      console.error(`Failed to subscribe: ${err}`)
    }
    else {
      console.log(`Subscribed to topic: ${topic}`)
    }
  })
}

export function publish(connMqtt: MqttClient, topic: string, message: string) {
  connMqtt.publish(topic, message, { qos: 0 })
}
