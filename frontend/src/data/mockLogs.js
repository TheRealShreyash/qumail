export const securityLogs = [
  { id: "l1", time: "2026-08-04 09:41", event: "Connected to Key Manager", level: "OTP", status: "success" },
  { id: "l2", time: "2026-08-04 09:41", event: "Quantum key QK-88A2-F91C-4D3E received", level: "OTP", status: "success" },
  { id: "l3", time: "2026-08-04 09:42", event: "Email encrypted with One-Time Pad", level: "OTP", status: "success" },
  { id: "l4", time: "2026-08-04 09:42", event: "Email sent to ops@navalcommand.gov.in", level: "OTP", status: "success" },
  { id: "l5", time: "2026-08-04 08:15", event: "Quantum key seeded into AES-256-GCM", level: "QAES", status: "success" },
  { id: "l6", time: "2026-08-04 08:16", event: "Email sent to rohan.mehta@qumail.io", level: "QAES", status: "success" },
  { id: "l7", time: "2026-08-03 14:02", event: "KM unreachable — falling back to PQC", level: "PQC", status: "warning" },
  { id: "l8", time: "2026-08-03 14:03", event: "Email encrypted with CRYSTALS-Kyber", level: "PQC", status: "success" },
  { id: "l9", time: "2026-08-02 20:10", event: "Signature verification failed on inbound message", level: "PQC", status: "error" },
  { id: "l10", time: "2026-08-01 11:00", event: "Message decrypted and signature verified", level: "OTP", status: "success" },
];
