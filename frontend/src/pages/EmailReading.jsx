import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Reply, Forward, Trash2, ShieldCheck, KeyRound, Clock,
  Lock, Unlock, RefreshCw, ShieldAlert, Eye
} from "lucide-react";
import SecurityBadge from "../components/SecurityBadge";
import AttachmentCard from "../components/AttachmentCard";
import { SecondaryButton, DangerButton } from "../components/Button";
import EmptyState from "../components/EmptyState";
import { useToast } from "../context/ToastContext";
import { apiRequest } from "../lib/api";
import { decryptPayload } from "../lib/crypto";
import { useAuth } from "../hooks/useAuth";

const SECURITY_LABELS = {
  OTP: "One-Time Pad (QKD)",
  QAES: "Quantum-Aided AES-256",
  PQC: "Post-Quantum Crypto (Kyber)",
  NONE: "Standard (No Encryption)",
};

export default function EmailReading() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Decryption state
  const [decryptionState, setDecryptionState] = useState("locked"); // locked | decrypting | decrypted | failed
  const [decryptedBody, setDecryptedBody] = useState("");
  const [decryptedKeyId, setDecryptedKeyId] = useState("");

  useEffect(() => {
    if (!user?.email || !id) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      setDecryptionState("locked");
      setDecryptedBody("");
      try {
        const res = await apiRequest(
          `/api/email/inbox?email=${encodeURIComponent(user.email)}&folder=inbox&limit=50`
        );
        const found = (res.data || []).find((e) => e.id === id);
        if (found) {
          setEmail(found);
        } else {
          const sentRes = await apiRequest(
            `/api/email/inbox?email=${encodeURIComponent(user.email)}&folder=sent&limit=50`
          );
          const foundInSent = (sentRes.data || []).find((e) => e.id === id);
          setEmail(foundInSent || null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, user?.email]);

  const isEncrypted = email?.keyId;

  const handleDecrypt = async () => {
    if (!email?.keyId || !user?.email) return;

    setDecryptionState("decrypting");
    try {
      // 1. Fetch decryption key from Key Manager
      const kmRes = await apiRequest(
        `/api/km/dec_keys?userEmail=${encodeURIComponent(user.email)}&key_ID=${encodeURIComponent(email.keyId)}`
      );

      if (!kmRes.data?.key) {
        throw new Error("Key Manager returned no key for this message");
      }

      // 2. Decrypt client-side using decryptPayload (dispatches to OTP XOR or QAES AES-256)
      const plainText = await decryptPayload(email.preview, kmRes.data.key, email.security);

      setDecryptedBody(plainText);
      setDecryptedKeyId(kmRes.data.key_ID || email.keyId);
      setDecryptionState("decrypted");
      showToast(
        email.security === "OTP"
          ? "Message decrypted with One-Time Pad QKD key!"
          : "Message decrypted with quantum key",
        "success"
      );
    } catch (err) {
      console.error("Decryption failed:", err);
      setDecryptionState("failed");
      showToast(`Decryption failed: ${err.message}`, "error");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center gap-3 text-slate-400">
        <RefreshCw size={18} className="animate-spin" />
        <span className="text-sm">Loading message…</span>
      </div>
    );
  }

  if (error || !email) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="Message not found"
        description={error || "It may have been moved or deleted."}
        action={<SecondaryButton onClick={() => navigate("/inbox")}>Back to inbox</SecondaryButton>}
      />
    );
  }

  const securityLabel = SECURITY_LABELS[email.security] || email.security;
  const displayBody = decryptionState === "decrypted" ? decryptedBody : email.preview;

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <Link to="/inbox" className="text-sm text-slate-400 hover:text-slate-600">
        ← Back to Inbox
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold text-slate-800">{email.subject}</h1>
          <p className="mt-1 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{email.sender}</span>{" "}
            {email.senderEmail && email.senderEmail !== email.sender && (
              <span className="text-slate-400">&lt;{email.senderEmail}&gt;</span>
            )}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
            <Clock size={12} /> {email.date} · {email.time}
          </p>
        </div>
        <SecurityBadge level={email.security} size="md" />
      </div>

      {/* ── Message Body Card ── */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        
        {/* Encrypted banner + decrypt button */}
        {isEncrypted && decryptionState === "locked" && (
          <div className="mb-5 rounded-xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <Lock size={20} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">
                  This message is quantum-encrypted
                </p>
                <p className="mt-0.5 text-xs text-amber-600">
                  Encrypted with {securityLabel} · Key ID: <code className="rounded bg-amber-100 px-1 font-mono">{email.keyId}</code>
                </p>
                <p className="mt-2 text-xs text-amber-500">
                  The message body below is encrypted ciphertext. Click the button to fetch the decryption key from the Quantum Key Manager and decrypt it client-side.
                </p>
                <button
                  onClick={handleDecrypt}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 hover:shadow-md active:scale-[0.98]"
                >
                  <Unlock size={15} />
                  Decrypt with Quantum Key
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Decrypting animation */}
        {decryptionState === "decrypting" && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <KeyRound size={20} className="animate-spin text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800">Decrypting…</p>
              <p className="text-xs text-blue-500">
                Fetching quantum key from Key Manager → {email.security === "OTP" ? "One-Time Pad bitwise XOR stream decrypt" : "AES-256-GCM decrypt"} in browser
              </p>
            </div>
          </div>
        )}

        {/* Decrypted success banner */}
        {decryptionState === "decrypted" && (
          <div className={`mb-5 flex items-center gap-3 rounded-xl border-2 ${email.security === "OTP" ? "border-emerald-300 bg-emerald-50" : "border-green-200 bg-green-50"} p-4`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${email.security === "OTP" ? "bg-emerald-100" : "bg-green-100"}`}>
              <ShieldCheck size={20} className={email.security === "OTP" ? "text-emerald-700" : "text-green-600"} />
            </div>
            <div>
              <p className={`text-sm font-semibold ${email.security === "OTP" ? "text-emerald-900" : "text-green-800"}`}>
                {email.security === "OTP" ? "Information-Theoretically Secure (One-Time Pad)" : "Message decrypted successfully"}
              </p>
              <p className={`text-xs ${email.security === "OTP" ? "text-emerald-700" : "text-green-600"}`}>
                {email.security === "OTP" ? "Decrypted client-side via bitwise XOR with single-use QKD quantum key " : "Decrypted client-side using quantum key "}<code className={`rounded ${email.security === "OTP" ? "bg-emerald-200/60" : "bg-green-100"} px-1 font-mono`}>{decryptedKeyId}</code>
              </p>
            </div>
          </div>
        )}

        {/* Decryption failed banner */}
        {decryptionState === "failed" && (
          <div className="mb-5 rounded-xl border-2 border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
                <ShieldAlert size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-800">Decryption failed</p>
                <p className="mt-0.5 text-xs text-red-500">
                  The Key Manager could not provide a valid key, or the ciphertext was corrupted.
                </p>
                <button
                  onClick={handleDecrypt}
                  className="mt-2 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <RefreshCw size={13} /> Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Standard TLS Notice for unencrypted messages */}
        {!isEncrypted && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200/70 text-slate-500">
              <Lock size={17} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">
                Standard TLS In-Transit Encryption (No End-to-End Quantum Key)
              </p>
              <p className="text-[11px] text-slate-500">
                Encrypted in-transit using standard Gmail TLS 1.3 protocol. Payload is unencrypted at rest.
              </p>
            </div>
          </div>
        )}

        {/* Message body — shows ciphertext when locked, plaintext when decrypted */}
        <div className={`relative rounded-lg ${isEncrypted && decryptionState === "locked" ? "bg-slate-900 p-4" : ""}`}>
          {isEncrypted && decryptionState === "locked" ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Eye size={12} className="text-slate-500" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Encrypted Ciphertext
                </span>
              </div>
              <pre className="whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-green-400/80 select-all">
                {displayBody || "(Empty encrypted payload)"}
              </pre>
            </>
          ) : (
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {displayBody || "(No message body available)"}
            </p>
          )}
        </div>

        {email.attachments?.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Attachments ({email.attachments.length})
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {email.attachments.map((a) => (
                <AttachmentCard
                  key={a.name}
                  name={a.name}
                  size={a.size}
                  onDownload={() => showToast(`Downloading ${a.name}`, "info")}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <SecondaryButton onClick={() => navigate(`/compose?reply=${id}`)}>
          <Reply size={15} /> Reply
        </SecondaryButton>
        <SecondaryButton onClick={() => navigate(`/compose?forward=${id}`)}>
          <Forward size={15} /> Forward
        </SecondaryButton>
        <DangerButton onClick={() => { showToast("Message moved to Trash", "success"); navigate("/inbox"); }}>
          <Trash2 size={15} /> Delete
        </DangerButton>
      </div>

      {/* ── Security Details Panel ── */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Message Security
        </p>
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <Info label="Encryption" value={securityLabel} />
          {email.keyId && <Info label="Key ID" value={email.keyId} mono />}
          <Info
            label="Decryption"
            value={
              decryptionState === "decrypted" ? "Decrypted ✓" :
              decryptionState === "failed" ? "Failed ✗" :
              isEncrypted ? "Locked 🔒" : "N/A"
            }
            valueClass={
              decryptionState === "decrypted" ? "text-green-600" :
              decryptionState === "failed" ? "text-red-500" :
              "text-amber-600"
            }
          />
          <Info label="Status" value="Delivered" valueClass="text-green-600" />
        </dl>
        {decryptionState === "decrypted" && (
          <div className="mt-4 flex items-center gap-2 text-xs text-green-600">
            <KeyRound size={13} /> Decrypted with quantum-derived key from Key Manager
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value, mono, valueClass = "text-slate-700" }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className={`mt-0.5 font-medium ${valueClass} ${mono ? "font-mono text-xs" : "text-sm"}`}>
        {value}
      </dd>
    </div>
  );
}
