import { request } from './request'

export function getSpotObjectByIntelName(t_name: string) {
  return request({
    url: `/getEngSportObjects/${t_name}`,
    method: 'get',
  })
}

export function getEngSpotChecks() {
  return request({
    url: `/getEngSpotChecks`,
    method: 'get',
  })
}
