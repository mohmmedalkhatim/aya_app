// src/screens/medicine_scan/index.tsx
import { useState, useRef } from "react";
import { fetch } from "@tauri-apps/plugin-http";
import { useStore } from "../../context";
import { detectROIs } from "../../lib/detector";
import { extractMedicineInfo } from "../../lib/ocr";
import { MedicineExtract } from "../../lib/types";

// ── Types matching the server response ───────────────────────────
interface MedicineMatch {
  id: number;
  name: string;
  Type: string;
  Dosage: string;
  ActiveIngredients: string;
  SideEffects: string;
  Manfacturer: string;
  confidence: number;
}

// ── Scan states (drives UI rendering) ────────────────────────────
type ScanState =
  | { phase: "idle" }
  | { phase: "detecting" }
  | { phase: "matching" }
  | { phase: "results"; matches: MedicineMatch[]; extract: MedicineExtract }
  | { phase: "confirm"; match: MedicineMatch; extract: MedicineExtract }
  | { phase: "reminder"; match: MedicineMatch }
  | { phase: "done" }
  | { phase: "error"; message: string }

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function MedicineScan() {
  const token = useStore(s => s.keys.access_token);
  const add_med = useStore(s => s.add_med);
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scan, setScan] = useState<ScanState>({ phase: "idle" });
  const [time, setTime] = useState("08:00");

  // ── Step 1: Patient captures image ──────────────────────────────
  async function handleCapture(file: File) {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setScan({ phase: "detecting" });

    // Let the preview img element render before accessing it
    await new Promise(r => setTimeout(r, 80));
    const imgEl = imgRef.current!;

    try {
      // ── Step 2: On-device — detect ROIs ──────────────────────
      const rois = await detectROIs(imgEl);
      if (!rois.length) {
        setScan({ phase: "error", message: "No medicine box detected. Try again with better lighting." });
        return;
      }

      // ── Step 3: On-device — OCR each ROI ─────────────────────
      const extract = await extractMedicineInfo(imgEl, rois);

      // ── Image is no longer needed — revoke the object URL ─────
      // (image bytes stay in memory only until this point)
      URL.revokeObjectURL(url);

      // ── Step 4: Send TEXT ONLY to server ─────────────────────
      setScan({ phase: "matching" });
      const res = await fetch(`${API}/medicine/identify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(extract),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const { matches } = await res.json() as { matches: MedicineMatch[] };

      if (!matches.length) {
        setScan({ phase: "error", message: "Medicine not found in catalogue. Try searching manually." });
        return;
      }

      // ── Step 5: Show results to patient for verification ──────
      setScan({ phase: "results", matches, extract });

    } catch (err: any) {
      setScan({ phase: "error", message: err.message ?? "Identification failed" });
    }
  }

  // ── Step 6: Patient selects a match ──────────────────────────
  function selectMatch(match: MedicineMatch) {
    const extract = (scan as any).extract as MedicineExtract;
    setScan({ phase: "confirm", match, extract });
  }

  // ── Step 7: Patient confirms and sets reminder ────────────────
  async function confirmAndSchedule() {
    const { match } = scan as { phase: "confirm"; match: MedicineMatch; extract: MedicineExtract };
    const reminderTime = new Date();
    const [h, m] = time.split(":").map(Number);
    reminderTime.setHours(h, m, 0, 0);

    // Save to UserMedicine via existing API + store
    await add_med({
      name: match.name,
      dosage: match.Dosage,
      times: [reminderTime.toISOString()],
    }, token);

    // Schedule local notification via Tauri

    setScan({ phase: "done" });
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <main className="container p-4 space-y-4 pb-24">

      {/* Camera trigger */}
      {(scan.phase === "idle" || scan.phase === "error") && (
        <>
          <h2 className="text-xl font-semibold">Scan Medicine Box</h2>
          {scan.phase === "error" && (
            <p className="text-red-600 text-sm">{scan.message}</p>
          )}
          <button className="btn-primary w-full"
            onClick={() => inputRef.current?.click()}>
            📷  Take Photo
          </button>
          <input ref={inputRef} type="file" accept="image/*"
            capture="environment" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleCapture(f); }} />
        </>
      )}

      {/* Hidden img — used as detection source only */}
      {preview && (
        <img ref={imgRef} src={preview}
          className="rounded-xl w-full max-h-52 object-cover"
          alt="Medicine scan preview" />
      )}

      {/* Detecting */}
      {scan.phase === "detecting" && (
        <p className="text-center animate-pulse text-teal-700">
          Analysing image on your device...
        </p>
      )}

      {/* Matching */}
      {scan.phase === "matching" && (
        <p className="text-center animate-pulse text-teal-700">
          Looking up medicine catalogue...
        </p>
      )}

      {/* Results — patient chooses */}
      {scan.phase === "results" && (
        <div className="space-y-3">
          <h3 className="font-semibold">Select your medicine:</h3>
          <p className="text-xs text-gray-500">
            Detected: {scan.extract.brandName} {scan.extract.dosage}
          </p>
          {scan.matches.map(m => (
            <button key={m.id}
              onClick={() => selectMatch(m)}
              className="w-full text-left border rounded-xl p-3 hover:bg-teal-50 space-y-1">
              <p className="font-semibold">{m.name}</p>
              <p className="text-sm text-gray-500">{m.Type} · {m.Dosage}</p>
              <p className="text-xs text-teal-700">
                {Math.round(m.confidence * 100)}% match
              </p>
            </button>
          ))}
          <button className="text-sm text-gray-500 underline w-full text-center"
            onClick={() => setScan({ phase: "idle" })}>
            None of these — scan again
          </button>
        </div>
      )}

      {/* Confirm + set reminder time */}
      {scan.phase === "confirm" && (
        <div className="space-y-4 border rounded-xl p-4">
          <h3 className="font-semibold text-lg">{scan.match.name}</h3>
          <p className="text-sm">{scan.match.ActiveIngredients}</p>
          <p className="text-xs text-amber-700">
            ⚠ Always verify this matches your physical medicine box.
          </p>
          <div className="space-y-1">
            <label className="text-sm font-medium">Reminder time</label>
            <input type="time" value={time}
              onChange={e => setTime(e.target.value)}
              className="border rounded p-2 w-full" />
          </div>
          <button className="btn-primary w-full"
            onClick={confirmAndSchedule}>
            Confirm & Set Reminder
          </button>
          <button className="text-sm text-gray-500 underline w-full text-center"
            onClick={() => setScan({
              phase: "results",
              matches: [(scan as any).match], extract: (scan as any).extract
            })}>
            ← Back
          </button>
        </div>
      )}

      {/* Done */}
      {scan.phase === "done" && (
        <div className="text-center space-y-4">
          <p className="text-4xl">✓</p>
          <p className="font-semibold">Reminder set!</p>
          <button className="btn-primary w-full"
            onClick={() => { setScan({ phase: "idle" }); setPreview(null); }}>
            Scan Another
          </button>
        </div>
      )}

    </main>
  );
}

