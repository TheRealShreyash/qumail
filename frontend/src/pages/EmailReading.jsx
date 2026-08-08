import { useParams, useNavigate, Link } from "react-router-dom";
import { Reply, ReplyAll, Forward, Trash2, ShieldCheck, KeyRound, Clock } from "lucide-react";
import { mockEmails, securityLevels } from "../data/mockEmails";
import SecurityBadge from "../components/SecurityBadge";
import AttachmentCard from "../components/AttachmentCard";
import { SecondaryButton, DangerButton } from "../components/Button";
import EmptyState from "../components/EmptyState";
import { useToast } from "../context/ToastContext";
import { keyManagerStatus } from "../data/mockKeys";

export default function EmailReading() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const email = mockEmails.find((e) => e.id === id);

  if (!email) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="Message not found"
        description="It may have been moved or deleted."
        action={<SecondaryButton onClick={() => navigate("/inbox")}>Back to inbox</SecondaryButton>}
      />
    );
  }

  const level = securityLevels[email.security];

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <Link to="/inbox" className="text-sm text-slate-400 hover:text-slate-600">← Back to Inbox</Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold text-slate-800">{email.subject}</h1>
          <p className="mt-1 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{email.sender}</span> &lt;{email.senderEmail}&gt;
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
            <Clock size={12} /> {email.date} · {email.time}
          </p>
        </div>
        <SecurityBadge level={email.security} size="md" />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{email.body}</p>

        {email.attachments.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Attachments ({email.attachments.length})
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {email.attachments.map((a) => (
                <AttachmentCard key={a.name} name={a.name} size={a.size} onDownload={() => showToast(`Downloading ${a.name}`, "info")} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <SecondaryButton onClick={() => navigate(`/compose?reply=${email.id}`)}><Reply size={15} /> Reply</SecondaryButton>
        <SecondaryButton onClick={() => navigate(`/compose?replyAll=${email.id}`)}><ReplyAll size={15} /> Reply All</SecondaryButton>
        <SecondaryButton onClick={() => navigate(`/compose?forward=${email.id}`)}><Forward size={15} /> Forward</SecondaryButton>
        <DangerButton onClick={() => { showToast("Message moved to Trash", "success"); navigate("/inbox"); }}>
          <Trash2 size={15} /> Delete
        </DangerButton>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Message Security</p>
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <Info label="Encryption type" value={level.label} />
          <Info label="Key ID" value={keyManagerStatus.currentKeyId} mono />
          <Info label="Security level" value={email.security} />
          <Info label="Status" value="Verified" valueClass="text-green-600" />
        </dl>
        <div className="mt-4 flex items-center gap-2 text-xs text-green-600">
          <KeyRound size={13} /> Signature verified against sender's quantum-derived key
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, mono, valueClass = "text-slate-700" }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className={`mt-0.5 font-medium ${valueClass} ${mono ? "font-mono text-xs" : "text-sm"}`}>{value}</dd>
    </div>
  );
}
