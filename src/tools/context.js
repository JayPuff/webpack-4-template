const context = {}

// Are we running in the context of Electron, as a desktop app?
context.isElectron = () => {
    if ((navigator && navigator.userAgent && navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) && window.electronAPIs) {
        return true
    }
    return false
}

// Get size of the screen. This should work cross-browser and device perfectly.
context.clientSize = () => {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height:  window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    }
}

// Get current break point
// Ex: XS up to < 600
const defaultBreakpoints = [
    { name: 'xs', max: 600 },
    { name: 's', max: 900 },
    { name: 'm', max: 1200 },
    { name: 'l', max: 1800 },
    { name: 'xl', max: Infinity },
]

context.getBreakpoint = (overrideBreakpoints) => {
    let size = context.clientSize()
    let breakpoints = defaultBreakpoints || overrideBreakpoints
    for(let b = 0; b < breakpoints.length; b++) {
        if(size.width < breakpoints[b].max) {
            return breakpoints[b].name
        }
    }
    return '?'
}


export default context











