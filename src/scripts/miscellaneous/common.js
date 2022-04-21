export function lerp(min, max, percentage) {
    return min + (max-min)*percentage;
}

export function mapRange(x, min1, max1, min2, max2) {
    return (x - min1) / (max1 - min1) * (max2 - min2) + min2;
}

export function nonPeriodicSine(x, max) {
    return ((Math.sin(2 * 0.15 * x) + Math.sin(Math.PI * 0.15 * x)) / 2 + 1) * max + 2 * max;
}

export function rgbToHex([r, g, b]) {
    const componentToHex = (c) => {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
export function hexToRgb(color) {
    return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color).map(x => parseInt('0x' + x)).slice(1, 4)
}
export function mixColors(color1, color2, percent) {
    let [c1, c2] = [color1, color2].map(x => hexToRgb(x));
    let cm = [];
    c1.forEach((c, i) => cm.push(parseInt(lerp(c1[i], c2[i], percent))));
    return rgbToHex(cm);
}