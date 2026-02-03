import { toPng, toJpeg, toSvg } from 'html-to-image';
import { saveAs } from 'file-saver';
import type { ExportOptions } from '../types';

/**
 * Export the map as PNG
 */
export async function exportAsPng(
  element: HTMLElement,
  filename: string = 'balkan-tour-map',
  scale: number = 2
): Promise<void> {
  try {
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: scale,
      backgroundColor: '#ffffff',
    });

    saveAs(dataUrl, `${filename}.png`);
  } catch (error) {
    console.error('Error exporting PNG:', error);
    throw error;
  }
}

/**
 * Export the map as JPEG
 */
export async function exportAsJpeg(
  element: HTMLElement,
  filename: string = 'balkan-tour-map',
  quality: number = 0.95,
  scale: number = 2
): Promise<void> {
  try {
    const dataUrl = await toJpeg(element, {
      quality,
      pixelRatio: scale,
      backgroundColor: '#ffffff',
    });

    saveAs(dataUrl, `${filename}.jpg`);
  } catch (error) {
    console.error('Error exporting JPEG:', error);
    throw error;
  }
}

/**
 * Export the map as SVG
 */
export async function exportAsSvg(
  element: HTMLElement,
  filename: string = 'balkan-tour-map'
): Promise<void> {
  try {
    const dataUrl = await toSvg(element, {
      backgroundColor: '#ffffff',
    });

    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    saveAs(blob, `${filename}.svg`);
  } catch (error) {
    console.error('Error exporting SVG:', error);
    throw error;
  }
}

/**
 * Export with options
 */
export async function exportMap(
  element: HTMLElement,
  options: ExportOptions,
  filename: string = 'balkan-tour-map'
): Promise<void> {
  switch (options.format) {
    case 'png':
      await exportAsPng(element, filename, options.scale);
      break;
    case 'jpg':
      await exportAsJpeg(element, filename, options.quality || 0.95, options.scale);
      break;
    case 'svg':
      await exportAsSvg(element, filename);
      break;
  }
}

/**
 * Clone SVG element and inline all styles for export
 */
export function inlineStylesForExport(svgElement: SVGElement): SVGElement {
  const clone = svgElement.cloneNode(true) as SVGElement;

  const walkElements = (element: Element) => {
    const computedStyle = window.getComputedStyle(element);
    const relevantProperties = [
      'fill',
      'stroke',
      'stroke-width',
      'stroke-dasharray',
      'stroke-dashoffset',
      'opacity',
      'font-family',
      'font-size',
      'font-weight',
      'font-style',
      'text-anchor',
      'dominant-baseline',
    ];

    for (const prop of relevantProperties) {
      const value = computedStyle.getPropertyValue(prop);
      if (value) {
        (element as SVGElement).style.setProperty(prop, value);
      }
    }

    for (const child of element.children) {
      walkElements(child);
    }
  };

  walkElements(clone);
  return clone;
}

/**
 * Get SVG as string for download
 */
export function getSvgString(svgElement: SVGElement): string {
  const clone = inlineStylesForExport(svgElement);
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(clone);

  // Add XML declaration and DOCTYPE
  svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;

  return svgString;
}

/**
 * Download raw SVG string as file
 */
export function downloadSvgString(
  svgElement: SVGElement,
  filename: string = 'balkan-tour-map'
): void {
  const svgString = getSvgString(svgElement);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  saveAs(blob, `${filename}.svg`);
}
