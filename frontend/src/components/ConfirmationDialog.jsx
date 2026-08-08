import Modal from "./Modal";
import { PrimaryButton, SecondaryButton, DangerButton } from "./Button";

export default function ConfirmationDialog({
  open, onClose, onConfirm, title = "Are you sure?", description, danger = false, confirmLabel = "Confirm",
}) {
  const ConfirmBtn = danger ? DangerButton : PrimaryButton;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <ConfirmBtn onClick={onConfirm}>{confirmLabel}</ConfirmBtn>
        </>
      }
    >
      {description}
    </Modal>
  );
}
