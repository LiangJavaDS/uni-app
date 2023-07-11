export const address = process.env.NODE_ENV === "development" ? "http://127.0.0.1:8087" : "xxx"

export function uniRequest(url, method, data) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: address + '/wx/' + url,
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

export function getRandomOrderId() {
    return (Math.random() * 10000000).toString(16).substr(0, 4) + (new Date()).getTime()
}

export function getRandomId() {
    return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + (Math.random() * 1000000000).toString().substr(0, 8)
}

export function getFileName(suffix) {
    if (suffix) {
        return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + (Math.random() * 1000000000).toString().substr(0, 8) + '.' + suffix
    } else {
        return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + (Math.random() * 1000000000).toString().substr(0, 8) + '.png'
    }
}
/** 初始化环境信息 */
export function setUpMenuInfo() {
    uni.getSystemInfo({
        success: (result) => {
            // 手机状态栏高度
            const statusBarHeight = result.statusBarHeight + 'px'
            // 右侧胶囊信息
            const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
            const menuInfo = {
                statusBarHeight: statusBarHeight, //状态栏高度----用来给自定义导航条页面的顶部导航条设计padding-top使用：目的留出系统的状态栏区域
                menuWidth: menuButtonInfo.width + 'px', //右侧的胶囊宽度--用来给自定义导航条页面的左侧胶囊设置使用
                menuHeight: menuButtonInfo.height + 'px', //右侧的胶囊高度--用来给自定义导航条页面的左侧胶囊设置使用
                menuBorderRadius: menuButtonInfo.height / 2 + 'px', //一半的圆角--用来给自定义导航条页面的左侧胶囊设置使用
                menuRight: result.screenWidth - menuButtonInfo.right + 'px', //右侧的胶囊距离右侧屏幕距离--用来给自定义导航条页面的左侧胶囊设置使用
                menuTop: menuButtonInfo.top + 'px', //右侧的胶囊顶部距离屏幕顶部的距离--用来给自定义导航条页面的左侧胶囊设置使用
                contentTop: result.statusBarHeight + 44 + 'px', //内容区距离页面最上方的高度--用来给自定义导航条页面的内容区定位距离使用
                allHeight: result.statusBarHeight + 44 + 'px'
            }
            uni.setStorageSync('menuInfo', menuInfo)
            uni.setStorageSync('systemInfo', result)
        },
        fail: (error) => {
            console.log('setMenuInfoError', error)
        }
    })
}

/** 页面跳转 */
export function jumpTo(url, param) {
    console.log('7878jumpTo', [url, param])
    if (param) {
        let arr = []
        for (const key in param) {
            arr.push(key + "=" + param[key])
        }
        let newUrl = url + "?" + arr.join("&")
        uni.navigateTo({
            url: newUrl,
        });
    } else {
        uni.navigateTo({
            url
        });
    }
}

/** 上传文件 */
export function uploadFile(data) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: address + '/wx/txCos/upload',
            filePath: data.filePath,
            name: "file",
            formData: {
                folder: data.folder ? data.folder : ""
            },
            success(res) {
                console.log('7878res', res)
                // todo真实域名
                // resolve(JSON.parse(res.data).data.Location.replace(
                //     "runnerw-1312379953.cos.ap-shanghai.myqcloud.com",
                //     "https://static.runners.ink"
                // ))
                resolve(JSON.parse(res.data).data.Location)
            },
            fail(err) {
                resolve("https://static.runners.ink/project/runnerLogo.png")
            }
        })
    })
}