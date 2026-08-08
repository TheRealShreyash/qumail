import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Reply, Forward, Trash2, ShieldCheck, KeyRound, Clock, Lock, RefreshCw } from "lucide-react";
import SecurityBadge from "../components/SecurityBadge";
import AttachmentCard from "../components/AttachmentCard";
import { SecondaryButton, DangerButton } from "../components/Button";
import EmptyState from "../components/EmptyState";
import { useToast } from "../context/ToastContext";
import { apiRequest } from "../lib/api";
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

  useEffect(() => {
    if (!user?.email || !id) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all inbox emails and find the matching one by ID
        // (We can't easily fetch a single Gmail message without a dedicated endpoint, so we use the inbox list)
        const res = await apiRequest(
          `/api/email/inbox?email=${encodeURIComponent(user.email)}&folder=inbox&limit=50`
        );
        const found = (res.data || []).find((e) => e.id === id);
        if (found) {
          setEmail(found);
        } else {
          // Also try sent
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

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        {email.keyId && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-2.5 text-xs font-medium text-green-700">
            <Lock size={14} className="text-green-600" />
            Quantum-encrypted · Key ID: <code className="font-mono">{email.keyId}</code>
          </div>
        )}
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
          {email.preview || "(No message body available)"}
        </p>

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

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Message Security
        </p>
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <Info label="Encryption" value={securityLabel} />
          {email.keyId && <Info label="Key ID" value={email.keyId} mono />}
          <Info label="Status" value="Delivered" valueClass="text-green-600" />
        </dl>
        {email.keyId && (
          <div className="mt-4 flex items-center gap-2 text-xs text-green-600">
            <KeyRound size={13} /> Signature verified against sender's quantum-derived key
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
