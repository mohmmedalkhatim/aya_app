// src/lib/ocr.ts
import Tesseract from "tesseract.js";
import { resolveResource } from "@tauri-apps/api/path";
import { DetectedROI } from "./detector";
import { MedicineExtract } from "./types";

let worker: Tesseract.Worker | null = null;

export async function initOcr(): Promise<void> {
    const tessdata = await resolveResource("resources/tessdata");
    worker = await Tesseract.createWorker("eng", 1, {
        langPath: tessdata,
        logger: () => {},
    });
}

// Crop a single ROI from the original image into an off-screen canvas
function cropROI(img: HTMLImageElement, roi: DetectedROI): HTMLCanvasElement {
    const canvas = document.createElement("canvas"); 
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const x = roi.x * iw, y =roi.y * ih;
    const w = roi.w * iw, h= roi.h * ih;
    canvas.width = Math.max(1, w);
    canvas.height =Math.max(1, h);
    canvas.getContext("2d")!.drawImage(img, x, y, w, h, 0, 0, w, h);
    return canvas;
}

const PSM: Record<string, Tesseract.PSM> = {
    brand_panel: Tesseract.PSM.SINGLE_WORD,
    generic_strip: Tesseract.PSM.SINGLE_LINE,
    dosage_line: Tesseract.PSM.RAW_LINE,
};

const WHITELIST: Record<string, string> = {
    dosage_line: "0123456789mgMcGlLu. /", 
};

async function ocrROI(img: HTMLImageElement, roi: DetectedROI): Promise<string> {
    const canvas = cropROI(img, roi);
    await worker!.setParameters({
        tessedit_pageseg_mode: PSM[roi.class],
        tessedit_char_whitelist: WHITELIST[roi.class] ?? "",
    });
    const { data } = await worker!.recognize(canvas);
    return data.text.trim().replace(/\n/g, " ");
}

export async function extractMedicineInfo(
    img: HTMLImageElement,
    rois: DetectedROI[],
): Promise<MedicineExtract> {
    const byClass = Object.fromEntries(rois.map(r => [r.class, r]));

    // Run OCR on each detected region in parallel
    const [brand, generic, dosage] = await Promise.all([
        byClass.brand_panel ? ocrROI(img, byClass.brand_panel) : Promise.resolve(""),
        byClass.generic_strip ? ocrROI(img, byClass.generic_strip) : Promise.resolve(""),
        byClass.dosage_line ? ocrROI(img, byClass.dosage_line) : Promise.resolve(""),
    ]);

    // Full image OCR as raw fallback for the server fuzzy matcher
    const { data: full } = await worker!.recognize(img);

    return {
        brandName: brand,
        genericName: generic,
        dosage,
        rawOCRText: full.text.trim(),
    };
}