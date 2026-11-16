import React, { useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { useFranchise } from "../../../hooks/franchise/useFranchise";
import { useDeleteFranchise } from "../../../hooks/franchise/useDeleteFranchise";

const FranchiseList: React.FC = () => {
  const { data: franchises, isLoading, isError } = useFranchise();
  const {
    mutate: deleteFranchise,
    isPending,
    variables: pendingId,
  } = useDeleteFranchise();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  function handleDeleteClick(id: string) {
    if (confirmingId !== id) {
      setConfirmingId(id);
      return;
    }
    deleteFranchise(id, {
      onSettled: () => setConfirmingId(null),
    });
  }

  if (isLoading) {
    return <p className="text-sm text-slate-500">Carregando franquias...</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-600">Erro ao carregar franquias.</p>;
  }

  if (!franchises || franchises.length === 0) {
    return (
      <p className="text-sm text-slate-500">Nenhuma franquia cadastrada.</p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[2fr_1fr] items-center gap-4 rounded border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
        <b>Franquia</b>
        <b className="text-right">Ações</b>
      </div>

      {franchises.map((franchise) => {
        const isRowDeleting = isPending && pendingId === franchise._id;
        const isConfirming = confirmingId === franchise._id;

        return (
          <div
            key={franchise._id}
            className="grid grid-cols-[2fr_1fr] items-center gap-4 rounded border bg-white px-3 py-2 text-sm text-slate-700"
          >
            <div className="font-medium">{franchise.type}</div>
            <div className="flex justify-end gap-2">
              {isConfirming && (
                <button
                  type="button"
                  onClick={() => setConfirmingId(null)}
                  disabled={isRowDeleting}
                  className="rounded px-2 py-1 text-xs text-slate-600 hover:underline disabled:opacity-60"
                >
                  Cancelar
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDeleteClick(franchise._id)}
                disabled={isRowDeleting}
                title={isConfirming ? "Confirmar exclusão" : "Excluir franquia"}
                className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isConfirming
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "text-red-600 hover:bg-red-50"
                }`}
              >
                <LuTrash2 size={14} aria-hidden="true" />
                {isRowDeleting
                  ? "Excluindo..."
                  : isConfirming
                    ? "Confirmar"
                    : "Excluir"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FranchiseList;
