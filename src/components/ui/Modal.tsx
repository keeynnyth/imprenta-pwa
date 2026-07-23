
import { ReactNode } from "react";

interface ModalProps {
  abierto: boolean;
  titulo: string;
  children: ReactNode;
  onCerrar: () => void;
}

export default function Modal({
  abierto,
  titulo,
  children,
  onCerrar,
}: ModalProps) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">{titulo}</h2>

          <button
            onClick={onCerrar}
            className="text-2xl leading-none text-slate-500 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>

      </div>
    </div>
  );
}