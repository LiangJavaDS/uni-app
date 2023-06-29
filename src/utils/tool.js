const host = process.env.NODE_ENV === "development" ? "http://127.0.0.1:8087" : "xxx"

export function uniRequest(url, method, data) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: host + '/wx/' + url,
            method: method ?? 'GET',
            data: data ?? {},
            success: (res) => {
                resolve(res.data)
            },
            fail: (error) => {
                reject(error)
            }
        })
    })
}