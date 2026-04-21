// src/lib/detector.ts
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
// loaded dynamically — tfjs-tflite is excluded from the Vite bundle
type TFLite = typeof import("@tensorflow/tfjs-tflite");
let tflite: TFLite;
import { resolveResource } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";

export type ROIClass = "brand_panel" | "generic_strip" | "dosage_line"; 

export interface DetectedROI {
    class: ROIClass;
    confidence: number; 
    // Normalised coords (0-1) relative to original image
    x: number; y: number; w: number; h: number;
}
let model: tflite.TFLiteModel | null = null; 
const CLASS_NAMES: ROIClass[] = ["brand_panel", "generic_strip", "dosage_line"];

export async function initDetector(): Promise<void> {
    tflite = await import("@tensorflow/tfjs-tflite");
    const path = await resolveResource("resources/medicine_roi_int8.tflite");
    await tf.setBackend("webgl");
    await tf.ready();
    model = await tflite.loadTFLiteModel(convertFileSrc(path));
}

export async function detectROIs(
    imgEl: HTMLImageElement,
): Promise<DetectedROI[]> {
    if (!model) throw new Error("Detector not initialised");

    const input = tf.tidy(() => {
        const pixels = tf.browser.fromPixels(imgEl);
        const resized = tf.image.resizeBilinear(pixels, [640, 640]);
        return tf.expandDims(resized, 0); // uint8, NHWC
    }) as tf.Tensor4D;

    const rawOutput = model.predict(input) as tf.Tensor;
    // Shape: [1, num_detections, 7]
    // Each row: [y1, x1, y2, x2, score, class_id, _]
    const data = await rawOutput.data() as Float32Array;
    input.dispose(); rawOutput.dispose();

    const results: DetectedROI[] = [];
    const numDet = data.length / 7;
    for (let i = 0; i < numDet; i++) {
        const base = i * 7;
        const score = data[base + 4];
        if (score < 0.45) continue; //confidence threshold
        const classId = Math.round(data[base + 5]); 
        results.push({
            class: CLASS_NAMES[classId] ?? "brand_panel",
            confidence: score,
            y: data[base], x: data[base+1],
            w: data[base+3] - data[base+1],
            h: data[base+2] - data[base],
        });
    
    }
    // Keep best detection per class
    const best: Record<string, DetectedROI> = {};
    for (const r of results) {
        if (!best[r.class] || r.confidence > best[r.class].confidence)
            best[r.class] = r; 
    }
    return Object.values(best);
}