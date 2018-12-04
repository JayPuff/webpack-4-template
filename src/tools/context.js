const context = {}

context.isElectron = () => {
    if ((navigator && navigator.userAgent && navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) && window.electronAPIs) {
        return true
    }
    return false
}

context.clientSize = () => {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height:  window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    }
}

context.isMobile = (threshold) => {
    let size = context.clientSize()
    if(size.width <= (threshold || 519)) return true;
    return false
}


export default context











