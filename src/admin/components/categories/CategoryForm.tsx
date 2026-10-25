import React, { useEffect, useRef, useState } from "react";
import { useCreateCategory } from "../../../hooks/categories/useCreateCategory";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

type FormErrors = Partial<{
    type: string;
    image: string;
}>;

const CategoryForm: React.FC = () => {
    const [type, setType] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { mutate: createCategory, isPending } = useCreateCategory();

    useEffect(() => {
        if (!image) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(image);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);

    function validateImageFile(file: File): string | null {
        if (!file.type.startsWith("image/")) {
            return "O arquivo selecionado não é uma imagem válida.";
        }
        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            return "A imagem deve ter no máximo 5MB.";
        }
        return null;
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;

        if (!file) {
            setImage(null);
            return;
        }

        const validationError = validateImageFile(file);
        if (validationError) {
            setErrors((prev) => ({ ...prev, image: validationError }));
            setImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setErrors((prev) => ({ ...prev, image: undefined }));
        setImage(file);
    }

    function resetForm() {
        setType("");
        setImage(null);
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const trimmed = type.trim();
        const nextErrors: FormErrors = {};

        if (!trimmed) {
            nextErrors.type = "Informe o nome da categoria.";
        }
        if (!image) {
            nextErrors.image = "Selecione uma imagem para a categoria.";
        }

        if (nextErrors.type || nextErrors.image) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        createCategory(
            { type: trimmed, image: image as File },
            { onSuccess: () => resetForm() }
        );
    }

    const canSubmit = !isPending;

    return (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex-1">
                <input
                    type="text"
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        if (errors.type) setErrors((prev) => ({ ...prev, type: undefined }));
                    }}
                    placeholder="Nome da categoria"
                    disabled={isPending}
                    aria-invalid={!!errors.type}
                    className={`w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60 ${errors.type ? "border-red-400" : "border-slate-300"
                        }`}
                />
                {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isPending}
                        aria-invalid={!!errors.image}
                        className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none file:mr-2 file:rounded file:border-0 file:bg-sky-100 file:px-2 file:py-1 file:text-xs file:text-sky-700 focus:ring-2 focus:ring-sky-500 disabled:opacity-60"
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="Pré-visualização da categoria"
                            className="h-10 w-10 shrink-0 rounded object-cover"
                        />
                    )}
                </div>
                {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
            </div>

            <button
                type="submit"
                disabled={!canSubmit}
                className="rounded bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending ? "Enviando..." : "Adicionar categoria"}
            </button>
        </form>
    );
};

export default CategoryForm;
