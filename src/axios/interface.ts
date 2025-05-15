import { request } from './request'

export function getProject() {
  return request({
    url: '/getProject',
    method: 'get',
  })
}

export function getProjectByID(id: string) {
  return request({
    url: `/getProjectbyid/${id}`,
    method: 'get',
  })
}

export function getSpotObjectByProject(id: string) {
  return request({
    url: `/getSpotObjectByProject/${id}`,
    method: 'get',
  })
}

export function getProjectByDepDdID(ddingID: string) {
  return request({
    url: `/getProjectByDepDdID/${ddingID}`,
    method: 'get',
  })
}

export function findEmpByKw(config: any) {
  return request({
    url: `/searchemp`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function isDuplicate(config: any) {
  return request({
    url: `/queryDuplicate`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function getRank(ddingID: string) {
  return request({
    url: `/getRank/${ddingID}`,
    method: 'get',
  })
}

export function createWorkGroup(config: any) {
  return request({
    url: `/createWorkGroup`,
    method: 'post',
    data: {
      ...config,
    },
  })
}
