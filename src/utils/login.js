import wxKeys from '@/pwConfig/wxKeysConfig.json'
import { address } from './tool.js'

const host = address + '/wx/wxApi/getUeserInfoFromWx'

export function getOpenid() {
    return new Promise((resolve, reject) => {
        uni.login({
            onlyAuthorize: true,
            success: (res) => {
                console.log('7878res', res)
                const data = {
                    appid: wxKeys.appid,
                    secret: wxKeys.appsecret,
                    js_code: res.code
                }
                uni.request({
                    url: host,
                    data: data,
                    method: 'POST',
                    success: (res1) => {
                        console.log('7878res2', res1)
                        resolve(res1.data.data)
                    },
                    fail: (error) => {
                        console.log('7878res2err', error)
                        reject(error)
                    }
                })
            }
        })
    })
}