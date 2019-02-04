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
const defaultBreakpoints = {
    'xs' : { name: 'xs', max: 600, value: 1 },
    's': { name: 's', max: 900, value: 2 },
    'm': { name: 'm', max: 1200, value: 3 },
    'l': { name: 'l', max: 1800, value: 4 },
    'xl': { name: 'xl', max: Infinity, value: 5 },
}

context.getDefaultBreakpoints = () => {
    return defaultBreakpoints
}


context.getCurrentBreakpoint = (targetBreakpoints) => {
    let size = context.clientSize()
    let breakpoints = targetBreakpoints || defaultBreakpoints
    for(let b in breakpoints) {
        if(size.width < breakpoints[b].max) {
            return { name: b, value: breakpoints[b].value, max:  breakpoints[b].max}
        }
    }
    return '?'
}


export default context











