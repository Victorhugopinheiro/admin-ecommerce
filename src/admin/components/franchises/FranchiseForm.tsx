import React, { useState } from "react";
import { useCreateFranchise } from "../../../hooks/franchise/useCreateFranchise";

type FormErrors = Partial<{
  type: string;
}>;

const FranchiseForm: React.FC = () => {
  const [type, setType] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const { mutate: createFranchise, isPending } = useCreateFranchise();

  function resetForm() {
    setType("");
    setErrors({});
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = type.trim();
    if (!trimmed) {
      setErrors({ type: "Informe o nome da franquia." });
      return;
    }

    setErrors({});
    createFranchise({ type: trimmed }, { onSuccess: () => resetForm() });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start"
    >
      <div className="flex-1">
        <input
          type="text"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            if (errors.type) setErrors({});
          }}
          placeholder="Nome da franquia"
          disabled={isPending}
          aria-invalid={!!errors.type}
          className={`w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60 ${
            errors.type ? "border-red-400" : "border-slate-300"
          }`}
        />
        {errors.type && (
          <p className="mt-1 text-xs text-red-600">{errors.type}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Enviando..." : "Adicionar franquia"}
      </button>
    </form>
  );
};

export default FranchiseForm;
