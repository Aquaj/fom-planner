/**
 * Shape Rendering Utilities
 *
 * Helper functions for rendering common shapes with PixiJS Graphics.
 */

import * as PIXI from 'pixi.js';
import type { ShapeStyle, Rectangle } from './types';

/**
 * Create a rectangle graphic
 */
export function createRectangle(
  rect: Rectangle,
  style: ShapeStyle = {}
): PIXI.Graphics {
  const graphics = new PIXI.Graphics();

  // Set fill
  if (style.fillColor !== undefined) {
    graphics.rect(rect.x, rect.y, rect.width, rect.height);
    graphics.fill({
      color: style.fillColor,
      alpha: style.fillAlpha ?? 1,
    });
  }

  // Set stroke
  if (style.strokeColor !== undefined) {
    graphics.rect(rect.x, rect.y, rect.width, rect.height);
    graphics.stroke({
      color: style.strokeColor,
      width: style.strokeWidth ?? 1,
      alpha: style.strokeAlpha ?? 1,
    });
  }

  return graphics;
}

/**
 * Update an existing rectangle graphic
 */
export function updateRectangle(
  graphics: PIXI.Graphics,
  rect: Rectangle,
  style: ShapeStyle = {}
): void {
  graphics.clear();

  // Set fill
  if (style.fillColor !== undefined) {
    graphics.rect(rect.x, rect.y, rect.width, rect.height);
    graphics.fill({
      color: style.fillColor,
      alpha: style.fillAlpha ?? 1,
    });
  }

  // Set stroke
  if (style.strokeColor !== undefined) {
    graphics.rect(rect.x, rect.y, rect.width, rect.height);
    graphics.stroke({
      color: style.strokeColor,
      width: style.strokeWidth ?? 1,
      alpha: style.strokeAlpha ?? 1,
    });
  }
}

/**
 * Convert HSL color to hex (PixiJS uses hex, CreateJS used HSL)
 */
export function hslToHex(h: number, s: number, l: number): number {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return (r << 16) | (g << 8) | b;
}

/**
 * Convert CSS color string to hex
 */
export function cssColorToHex(color: string): number {
  // Handle named colors
  const namedColors: Record<string, number> = {
    'black': 0x000000,
    'white': 0xffffff,
    'red': 0xff0000,
    'green': 0x00ff00,
    'blue': 0x0000ff,
    'yellow': 0xffff00,
    'cyan': 0x00ffff,
    'magenta': 0xff00ff,
    'gray': 0x808080,
    'brown': 0x964B00,
    'lightblue': 0xADD8E6,
    'lightgray': 0xD3D3D3,
  };

  const lowerColor = color.toLowerCase();
  if (namedColors[lowerColor] !== undefined) {
    return namedColors[lowerColor];
  }

  // Handle hex colors
  if (color.startsWith('#')) {
    return parseInt(color.substring(1), 16);
  }

  // Handle rgb/rgba
  if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0]);
      const g = parseInt(match[1]);
      const b = parseInt(match[2]);
      return (r << 16) | (g << 8) | b;
    }
  }

  // Default to black
  return 0x000000;
}
