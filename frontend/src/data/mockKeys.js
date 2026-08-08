export const keyManagerStatus = {
  connected: true,
  kmEndpoint: "https://km-local.qumail.io/api/v1/keys",
  protocol: "ETSI GS QKD 014",
  currentKeyId: "QK-88A2-F91C-4D3E",
  keyLengthBits: 256,
  remainingKeys: 142,
  totalKeysToday: 512,
  expiryTime: "2026-08-04T18:30:00",
  lastRefreshed: "2 minutes ago",
};

export const keyManagerLogs = [
  { id: "kl1", time: "09:41:02", event: "Key block QK-88A2-F91C-4D3E delivered", status: "success" },
  { id: "kl2", time: "09:38:55", event: "Key request sent to KM (ETSI GS QKD 014)", status: "info" },
  { id: "kl3", time: "08:15:10", event: "Key block QK-71B0-C442-9AAF delivered", status: "success" },
  { id: "kl4", time: "07:02:41", event: "KM heartbeat check — OK", status: "success" },
  { id: "kl5", time: "02:00:00", event: "Scheduled KM maintenance started", status: "warning" },
];

export const keyHistory = [
  { id: "QK-88A2-F91C-4D3E", issued: "09:41 AM", consumedBy: "e1 — Trident Phase 2", bits: 256 },
  { id: "QK-71B0-C442-9AAF", issued: "08:15 AM", consumedBy: "s2 — Q3 budget reply", bits: 256 },
  { id: "QK-5C09-11EE-77B3", issued: "Yesterday", consumedBy: "e6 — Field test report", bits: 256 },
  { id: "QK-3A4D-88F0-002C", issued: "Yesterday", consumedBy: "s1 — Trident confirmation", bits: 256 },
];
