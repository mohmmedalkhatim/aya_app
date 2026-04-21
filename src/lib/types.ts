// src/lib/types.ts

/**
 * The final structured data extracted from the on-device OCR pipeline.
 * This the extract payloud that will be sent to the NestJS server's
 * /medicine/identify endpoint.
 */

export interface MedicineExtract {
    brandName: string;
    genericName: string;
    dosage: string;
    rawOCRText: string; //The full text fallback for server-side fuzzy matching if the above fields are not accurate enough.
}