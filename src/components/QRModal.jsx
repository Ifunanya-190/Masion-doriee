import { QRCodeSVG } from "qrcode.react";
import { BASE_URL } from "../App";

export default function QRModal({ type, setType, onClose }) {
  const url = type === "reservation" ? `${BASE_URL}/reserve.html` : `${BASE_URL}/order.html`;
  const steps = type === "reservation"
    ? ["Scan the QR code with your camera", "Fill in your date and party size", "Confirm your booking instantly"]
    : ["Scan the QR code with your camera", "Browse the menu and add items", "Choose your collection time"];

  return (
    <div className="overlay active" onClick={onClose}>
      <div className="qr-modal" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-5 bg-transparent border-none text-tan text-xl cursor-pointer hover:text-cream">✕</button>

        <div className="section-tag mb-2.5">{type === "reservation" ? "Table Reservation" : "Quick Order"}</div>
        <h3 className="font-heading text-[26px] font-bold text-cream-light mb-2">
          {type === "reservation" ? "Reserve Your Spot" : "Order & Collect"}
        </h3>
        <p className="font-ui text-xs text-tan-dark leading-relaxed mb-6">
          {type === "reservation"
            ? "Scan with your phone camera to instantly reserve a table. No account or app needed."
            : "Scan to open our full menu, add items to your order, and select a pickup time."}
        </p>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute -inset-4 border border-gold/15 rounded-2xl" style={{ animation: "scan-ring 2s ease-in-out infinite" }} />
            <div className="p-5 bg-white rounded-2xl" style={{ boxShadow: "0 0 40px rgba(212,138,44,0.15)" }}>
              <QRCodeSVG value={url} size={180} bgColor="#ffffff" fgColor="#1a1008" level="H" includeMargin />
            </div>
            <div className="absolute top-1/2 -left-5 -right-5 h-0.5" style={{ background: "linear-gradient(90deg,transparent,rgba(212,138,44,.5),transparent)", animation: "scan-line 2s ease-in-out infinite" }} />
          </div>
        </div>

        <div className="bg-bg-warm-light border border-gold/10 mb-6" style={{ padding: "18px 22px" }}>
          <div className="font-ui text-[10px] text-gold font-semibold tracking-[.15em] uppercase mb-2.5">How it works</div>
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <div className="w-[22px] h-[22px] bg-gold text-bg rounded-full flex items-center justify-center font-ui text-[10px] font-bold shrink-0">{i + 1}</div>
              <span className="font-ui text-xs text-tan">{step}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2.5">
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 text-center no-underline block" style={{ padding: "14px 0" }}>
            {type === "reservation" ? "Open Reservation" : "Open Menu"}
          </a>
          <button className="btn-outline flex-1" onClick={() => setType(type === "reservation" ? "order" : "reservation")}>
            Switch to {type === "reservation" ? "Order" : "Reserve"}
          </button>
        </div>
        <div className="text-center mt-5 font-ui text-[10px] text-brown-darker">No app required · Works with any smartphone camera</div>
      </div>
    </div>
  );
}