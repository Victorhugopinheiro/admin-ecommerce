import React, { useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { useCategories } from "../../../hooks/categories/useCategories";
import { useDeleteCategory } from "../../../hooks/categories/useDeleteCategory";

const CategoryList: React.FC = () => {
    const { data: categories, isLoading, isError } = useCategories();
    const { mutate: deleteCategory, isPending, variables: pendingId } = useDeleteCategory();
    const [confirmingId, setConfirmingId] = useState<string | null>(null);

    function handleDeleteClick(id: string) {
        if (confirmingId !== id) {
            setConfirmingId(id);
            return;
        }
        deleteCategory(id, {
            onSettled: () => setConfirmingId(null),
        });
    }

    if (isLoading) {
        return <p className="text-sm text-slate-500">Carregando categorias...</p>;
    }

    if (isError) {
        return <p className="text-sm text-red-600">Erro ao carregar categorias.</p>;
    }

    if (!categories || categories.length === 0) {
        return <p className="text-sm text-slate-500">Nenhuma categoria cadastrada.</p>;
    }

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-[auto_2fr_1fr] items-center gap-4 rounded border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                <b>Imagem</b>
                <b>Categoria</b>
                <b className="text-right">Ações</b>
            </div>

            {categories.map((category) => {
                const isRowDeleting = isPending && pendingId === category._id;
                const isConfirming = confirmingId === category._id;

                return (
                    <div
                        key={category._id}
                        className="grid grid-cols-[auto_2fr_1fr] items-center gap-4 rounded border bg-white px-3 py-2 text-sm text-slate-700"
                    >
                        <div>
                            {category.image ? (
                                <img
                                    src={category.image}
                                    alt={category.type}
                                    className="h-10 w-10 shrink-0 rounded object-cover"
                                />
                            ) : (
                                <div className="h-10 w-10 shrink-0 rounded bg-slate-100" />
                            )}
                        </div>
                        <div className="font-medium">{category.type}</div>
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
                                onClick={() => handleDeleteClick(category._id)}
                                disabled={isRowDeleting}
                                title={isConfirming ? "Confirmar exclusão" : "Excluir categoria"}
                                className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${isConfirming
                                        ? "bg-red-600 text-white hover:bg-red-700"
                                        : "text-red-600 hover:bg-red-50"
                                    }`}
                            >
                                <LuTrash2 size={14} aria-hidden="true" />
                                {isRowDeleting ? "Excluindo..." : isConfirming ? "Confirmar" : "Excluir"}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CategoryList;
