import { useState } from "react";
import SecurityLevelPicker from "../components/SecurityLevelPicker";
import { PrimaryButton } from "../components/Button";
import { useToast } from "../context/ToastContext";

export default function SecurityConfig() {
  const [level, setLevel] = useState("QAES");
  const { showToast } = useToast();

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <h1 className="font-display text-xl font-semibold text-slate-800">Security Configuration</h1>
      <p className="mb-5 text-sm text-slate-400">
        Set the encryption level QuMail should use by default. You can still override it per-message from Compose.
      </p>
      <SecurityLevelPicker value={level} onChange={setLevel} />
      <PrimaryButton className="mt-6" onClick={() => showToast(`Default security level set to ${level}`, "success")}>
        Save as default
      </PrimaryButton>
    </div>
  );
}
