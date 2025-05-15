import { requestLogin } from './request'

export function getUserMessage() {
  return requestLogin({
    url: '/getUserMessage',
    method: 'get',
  })
}

export function getUserBycode(code: string) {
  return requestLogin({
    url: `/getUserByCode/${code}`,
    method: 'get',
  })
}
