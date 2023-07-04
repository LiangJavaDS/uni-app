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

export function getFileName(suffix) {
    if (suffix) {
        return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + (Math.random() * 1000000000).toString().substr(0, 8) + '.' + suffix
    } else {
        return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + (Math.random() * 1000000000).toString().substr(0, 8) + '.png'
    }
}