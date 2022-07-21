import { colorContrastRatioCalculator } from "@mdhnpm/color-contrast-ratio-calculator";
import * as Canvas from 'canvas';

function adjustColor(color: string, amount: number) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

function testColors(color1: string, color2: string, threshold?: number) {
    if (!threshold) threshold = 4.5;
    try {
        do {
            color1 = adjustColor(color1, 1);
        } while (colorContrastRatioCalculator(color1, color2) < threshold)
        return color1;
    } catch (err) {
        return '';
    }
}

export { adjustColor, testColors }
