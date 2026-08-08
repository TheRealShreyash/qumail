import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Paperclip, Send, Save, X, ChevronDown, ChevronUp } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "../components/Button";
import SecurityLevelPicker, { LEVELS } from "../components/SecurityLevelPicker";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../hooks/useAuth";
import { apiRequest } from "../lib/api";
import { encryptMessage } from "../lib/crypto";

const MAX_CHARS = 2000;

export default function Compose() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [params] = useSearchParams();

  const isReply = params.has("reply");
  const isForward = params.has("forward");

  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("normal");
  const [level, setLevel] = useState("QAES");
  const [files, setFiles] = useState([]);
  const [sending, setSending] = useState(false);

  const levelMeta = LEVELS.find((l) => l.id === level);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []).map((f) => ({ name: f.name, size: `${Math.ceil(f.size / 1024)} KB` }));
    setFiles((prev) => [...prev, ...selected]);
  };

  const handleSend = async () => {
    if (!to || !subject) {
      showToast("Add a recipient and subject before sending", "error");
      return;
    }
    setSending(true);
    try {
      const senderEmail = user?.email || "alice.demo@gmail.com";
      
      // 1. Get Quantum Key from Backend Key Manager
      const kmRes = await apiRequest("/api/km/enc_keys", {
        method: "POST",
        body: JSON.stringify({
          senderEmail,
          recipientEmail: to,
          algorithm: levelMeta?.title || "QAES-Kyber1024",
        }),
      });

      const { key_ID, key } = kmRes.data;

      // 2. Encrypt Email Payload Client-Side with Quantum Key
      const encryptedPayload = await encryptMessage(body, key);

      // 3. Relay Email via Gmail API
      await apiRequest("/api/email/send", {
        method: "POST",
        body: JSON.stringify({
          senderEmail,
          recipientEmail: to,
          subject,
          body: encryptedPayload,
          level: levelMeta?.title || "QAES-Kyber1024",
          keyId: key_ID,
        }),
      });

      showToast(`Encrypted with ${levelMeta?.title || "QAES"} & key (${key_ID}) sent!`, "success");
      navigate("/inbox");
    } catch (err) {
      console.error("Failed to send email:", err);
      showToast(`Sending failed: ${err.message}`, "error");
    } finally {
      setSending(false);
    }
  };


  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold text-slate-800">
          {isReply ? "Reply" : isForward ? "Forward message" : "New message"}
        </h1>
        <button onClick={() => navigate(-1)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="space-y-3 border-b border-slate-100 pb-4">
          <Row label="To">
            <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@example.com" className="input" />
          </Row>
          <button onClick={() => setShowCcBcc((s) => !s)} className="flex items-center gap-1 text-xs font-medium text-blue-600">
            Cc / Bcc {showCcBcc ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          {showCcBcc && (
            <>
              <Row label="Cc"><input value={cc} onChange={(e) => setCc(e.target.value)} className="input" /></Row>
              <Row label="Bcc"><input value={bcc} onChange={(e) => setBcc(e.target.value)} className="input" /></Row>
            </>
          )}
          <Row label="Subject">
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="input" />
          </Row>
          <Row label="Priority">
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input">
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </Row>
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, MAX_CHARS))}
          rows={9}
          placeholder="Write your message…"
          className="mt-4 w-full resize-none text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
        <div className="mt-1 text-right text-xs text-slate-400">{body.length} / {MAX_CHARS}</div>

        <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 py-6 text-center hover:border-blue-300 hover:bg-blue-50/30">
          <Paperclip size={18} className="text-slate-400" />
          <span className="text-xs text-slate-500">Drag files here, or click to browse</span>
          <input type="file" multiple onChange={handleFiles} className="hidden" />
        </label>
        {files.length > 0 && (
          <ul className="mt-2 space-y-1">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                {f.name} <span className="text-slate-400">{f.size}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-slate-700">Security level for this message</p>
        <p className="mb-4 mt-0.5 text-xs text-slate-400">Choose how this email — and its attachments — will be encrypted before it leaves your device.</p>
        <SecurityLevelPicker value={level} onChange={setLevel} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <PrimaryButton onClick={handleSend} disabled={sending}>
          <Send size={15} /> {sending ? "Encrypting & sending…" : "Send"}
        </PrimaryButton>
        <SecondaryButton onClick={() => showToast("Draft saved", "info")}><Save size={15} /> Save Draft</SecondaryButton>
        <SecondaryButton onClick={() => navigate("/inbox")}>Discard</SecondaryButton>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 text-xs font-medium text-slate-400">{label}</span>
      {children}
    </div>
  );
}
