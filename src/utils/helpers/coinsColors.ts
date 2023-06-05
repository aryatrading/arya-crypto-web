import { chartDefaultColorsHex, coinsColors } from "../constants/customColors";

export function getCoinColor(symbol: string, defaultColorIndex: number) {
    const defaultColor = chartDefaultColorsHex[defaultColorIndex % chartDefaultColorsHex.length];
    if (symbol) {
        return coinsColors[symbol?.toLowerCase()] ?? defaultColor;
    } else {
        return defaultColor;
    }
}