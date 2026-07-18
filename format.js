function commaFormat(num, precision) {
    // adding decimal part later... i guess

    if (num === null || num === undefined) return "NaN"
    //let zeroCheck = num.array ? num.array[0][1] : num
    //if (zeroCheck < 0.001) return (0).toFixed(precision)
    
    let init = num.toString()
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    return portions[0]
}
function regularFormat(num, precision) {
    if (isNaN(num)) return "NaN"
    //let zeroCheck = num.array ? num.array[0][1] : num
    //if (zeroCheck < 0.0001) return (0).toFixed(precision)

    /*let f = num.toFixed(precision).split('').reverse().join('')
    let p = 0
    for (const g of f) {
        if (g == ".") {
            p += 1
            break
        }
        if (g == "0") p += 1
        else break
    }
    f = f.substring(p)
    return f.split('').reverse().join('')*/

    let fmt = num.toString()
    let f = fmt.split(".")
    if (precision == 0) return commaFormat(num.floor ? num.floor() : Math.floor(num))
    else if (f.length == 1) return fmt// + "." + "0".repeat(precision)
    else if (f[1].length < precision) return fmt + "0".repeat(precision - f[1].length)
    else return f[0] + "." + f[1].substring(0, precision)
}
// get 2 hyperops -> finds the "10^^"/F part
// get 3 hyperops -> finds the "10^^^"/G part
// not have time to clarify
function findHyperOps(arr, hypOps) {
    return arr[0][hypOps]
}

function format(n, precision=2) {
    if (MetaNum.isNaN(n)) return "NaN"
    let p2 = Math.max(3, precision) // for e
    let p3 = Math.max(4, precision) // for F, G, H
    let p4 = Math.max(6, precision) // for J, K
    n = new MetaNum(n)
    let arr = n.array

    if (n.abs().lt(1e-308)) return "0"
    if (n.sign < 0) return "-" + format(n.neg(), precision)
    if (n.isInfinite()) return "∞"

    if (n.lt(10**-precision)) return "1/" + format(n.rec(), precision)
    else if (n.lt(1000)) return regularFormat(n, precision)
    else if (n.lt(1e9)) return commaFormat(n, precision)
    else if (n.lt("F5")) { // 1e9 ~ 1F5
        let bottom = findHyperOps(arr, 0)
        let rep = findHyperOps(arr, 1)-1
        if (bottom >= 1e9) {
            bottom = Math.log10(bottom)
            rep += 1
        }
        let m = 10**(bottom-Math.floor(bottom))
        let e = Math.floor(bottom)
        let p = bottom < 1000 ? p2 : 0
        return "e".repeat(rep) + regularFormat(m, p) + "e" + commaFormat(e)
    }
    else if (n.lt("F1000000")) { // 1F5 ~ F1,000,000
        // gotta continue when I remake polarize() function
        return n
    }
    return n
}







function formatWhole(num) {
    return format(num, 0)
}
function formatTime(s) {
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "yr " + formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}