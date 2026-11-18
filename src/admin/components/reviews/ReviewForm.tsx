import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { clsx } from "clsx";
import { UserProducts } from "../../../hooks/gettingUserHook";
import { useCreateReview } from "../../../hooks/review/useCreateReview";
import type { CreateReviewInput, MediaType } from "../../../types/reviewType";

const PLATFORMS = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Google",
  "Facebook",
  "WhatsApp",
] as const;

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = 30 * 1024 * 1024;

type ReviewTextState = {
  productId: string;
  platform: string;
  message: string;
  date: string;
  userName: string;
};

type FormErrors = Partial<
  Record<keyof ReviewTextState | "media" | "userImage", string>
>;

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const controlClass =
  "w-full rounded-xl border px-3 text-sm outline-none transition focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60";

const fileClass =
  "w-full rounded-xl border px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-sky-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-sky-800 disabled:cursor-not-allowed disabled:opacity-60";

function controlClassName(invalid: boolean, extra?: string) {
  return clsx(
    controlClass,
    extra,
    invalid
      ? "border-red-500 focus:ring-red-100"
      : "border-slate-300 focus:border-sky-500 focus:ring-sky-100"
  );
}

function fileClassName(invalid: boolean) {
  return clsx(
    fileClass,
    invalid ? "border-red-500" : "border-slate-300 focus:border-sky-500"
  );
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toDateTimeLocal(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function createInitialText(): ReviewTextState {
  return {
    productId: "",
    platform: "",
    message: "",
    date: toDateTimeLocal(new Date()),
    userName: "",
  };
}

function mediaTypeFromFile(file: File): MediaType | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return null;
}

function validateImageFile(file: File) {
  if (!file.type.startsWith("image/")) return "Selecione um arquivo de imagem.";
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "A imagem deve ter no máximo 5MB.";
  }
  return null;
}

function validateMediaFile(file: File) {
  const mediaType = mediaTypeFromFile(file);
  if (!mediaType) return "Selecione uma imagem ou um vídeo.";
  const limit =
    mediaType === "video" ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
  if (file.size > limit) {
    return mediaType === "video"
      ? "O vídeo deve ter no máximo 30MB."
      : "A imagem deve ter no máximo 5MB.";
  }
  return null;
}

function validate(form: ReviewTextState): FormErrors {
  const errors: FormErrors = {};

  if (!form.productId) errors.productId = "Selecione um produto.";
  if (!form.platform.trim()) errors.platform = "Informe a plataforma.";
  if (!form.userName.trim()) errors.userName = "Informe o nome do usuário.";
  if (!form.message.trim()) errors.message = "Informe a mensagem da avaliação.";

  if (!form.date) {
    errors.date = "Informe a data.";
  } else if (Number.isNaN(new Date(form.date).getTime())) {
    errors.date = "Data inválida.";
  }

  return errors;
}

function toPayload(
  form: ReviewTextState,
  media: File | null,
  userImage: File | null
): CreateReviewInput {
  const payload: CreateReviewInput = {
    productId: form.productId,
    platform: form.platform.trim(),
    message: form.message.trim(),
    date: new Date(form.date).getTime(),
    userName: form.userName.trim(),
  };

  const mediaType = media ? mediaTypeFromFile(media) : null;
  if (media && mediaType) {
    payload.media = media;
    payload.mediaType = mediaType;
  }

  if (userImage) payload.userImage = userImage;

  return payload;
}

function useObjectUrl(file: File) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}

const FilePreview = memo(function FilePreview({
  file,
  alt,
}: {
  file: File;
  alt: string;
}) {
  const url = useObjectUrl(file);
  if (!url) return null;

  if (file.type.startsWith("video/")) {
    return (
      <video
        src={url}
        controls
        preload="metadata"
        className="mt-2 max-h-48 w-full rounded-xl bg-black"
      />
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className="mt-2 h-16 w-16 rounded-lg object-cover"
    />
  );
});

function Field({
  id,
  label,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}

const optionalFileHint =
  "Opcional. O arquivo só é enviado se você selecionar. O backend gera o link no Cloudinary.";

const ReviewForm = () => {
  const [form, setForm] = useState(createInitialText);
  const [media, setMedia] = useState<File | null>(null);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  const userImageInputRef = useRef<HTMLInputElement | null>(null);
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = UserProducts();
  const { mutate, isPending } = useCreateReview();

  const productOptions = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    [products]
  );

  const clearFileInput = useCallback(
    (input: HTMLInputElement | null, field: "media" | "userImage") => {
      if (input) input.value = "";
      if (field === "media") setMedia(null);
      else setUserImage(null);
      setErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
    },
    []
  );

  const handleChange = useCallback((event: ChangeEvent<FieldElement>) => {
    const field = event.target.name as keyof ReviewTextState;
    const { value } = event.target;

    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  function handleMediaChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setMedia(null);
      return;
    }

    const validationError = validateMediaFile(file);
    if (validationError) {
      setMedia(null);
      event.target.value = "";
      setErrors((current) => ({ ...current, media: validationError }));
      return;
    }

    setMedia(file);
    setErrors((current) => {
      if (!current.media) return current;
      const next = { ...current };
      delete next.media;
      return next;
    });
  }

  function handleUserImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setUserImage(null);
      return;
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      setUserImage(null);
      event.target.value = "";
      setErrors((current) => ({ ...current, userImage: validationError }));
      return;
    }

    setUserImage(file);
    setErrors((current) => {
      if (!current.userImage) return current;
      const next = { ...current };
      delete next.userImage;
      return next;
    });
  }

  function handleReset() {
    setForm(createInitialText());
    setErrors({});
    clearFileInput(mediaInputRef.current, "media");
    clearFileInput(userImageInputRef.current, "userImage");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;

    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    mutate(toPayload(form, media, userImage), {
      onSuccess: () => handleReset(),
    });
  }

  const productPlaceholder = isLoading
    ? "Carregando produtos..."
    : productOptions.length === 0
      ? "Nenhum produto disponível"
      : "Selecione um produto";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          id="review-product"
          label="Produto"
          error={errors.productId}
          className="md:col-span-2"
        >
          <select
            id="review-product"
            name="productId"
            value={form.productId}
            onChange={handleChange}
            disabled={isPending || isLoading || productOptions.length === 0}
            aria-invalid={!!errors.productId}
            className={controlClassName(!!errors.productId, "h-11")}
          >
            <option value="">{productPlaceholder}</option>
            {productOptions.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
          {isError && (
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-1 text-xs font-medium text-sky-700 hover:underline disabled:opacity-60"
            >
              {isFetching
                ? "Carregando..."
                : "Não foi possível carregar os produtos. Tentar novamente"}
            </button>
          )}
        </Field>

        <Field id="review-platform" label="Plataforma" error={errors.platform}>
          <input
            id="review-platform"
            name="platform"
            list="review-platforms"
            value={form.platform}
            onChange={handleChange}
            disabled={isPending}
            placeholder="Instagram, Google, TikTok..."
            aria-invalid={!!errors.platform}
            autoComplete="off"
            className={controlClassName(!!errors.platform, "h-11")}
          />
          <datalist id="review-platforms">
            {PLATFORMS.map((platform) => (
              <option key={platform} value={platform} />
            ))}
          </datalist>
        </Field>

        <Field id="review-date" label="Data da avaliação" error={errors.date}>
          <input
            id="review-date"
            name="date"
            type="datetime-local"
            value={form.date}
            onChange={handleChange}
            disabled={isPending}
            aria-invalid={!!errors.date}
            className={controlClassName(!!errors.date, "h-11")}
          />
        </Field>

        <Field
          id="review-user-name"
          label="Nome do usuário"
          error={errors.userName}
        >
          <input
            id="review-user-name"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            disabled={isPending}
            placeholder="Nome exibido na avaliação"
            aria-invalid={!!errors.userName}
            autoComplete="off"
            className={controlClassName(!!errors.userName, "h-11")}
          />
        </Field>

        <Field
          id="review-user-image"
          label="Foto do usuário (opcional)"
          error={errors.userImage}
          hint={optionalFileHint}
        >
          <input
            ref={userImageInputRef}
            id="review-user-image"
            type="file"
            accept="image/*"
            onChange={handleUserImageChange}
            disabled={isPending}
            aria-invalid={!!errors.userImage}
            className={fileClassName(!!errors.userImage)}
          />
          {userImage && (
            <div className="mt-2 flex items-start gap-3">
              <FilePreview file={userImage} alt="Prévia da foto do usuário" />
              <button
                type="button"
                onClick={() =>
                  clearFileInput(userImageInputRef.current, "userImage")
                }
                disabled={isPending}
                className="text-xs font-medium text-slate-600 hover:underline disabled:opacity-60"
              >
                Remover
              </button>
            </div>
          )}
        </Field>

        <Field
          id="review-message"
          label="Mensagem"
          error={errors.message}
          className="md:col-span-2"
        >
          <textarea
            id="review-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            disabled={isPending}
            rows={4}
            placeholder="Texto da avaliação"
            aria-invalid={!!errors.message}
            className={controlClassName(!!errors.message, "min-h-28 py-2")}
          />
        </Field>

        <Field
          id="review-media"
          label="Mídia (opcional)"
          error={errors.media}
          hint={optionalFileHint}
          className="md:col-span-2"
        >
          <input
            ref={mediaInputRef}
            id="review-media"
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaChange}
            disabled={isPending}
            aria-invalid={!!errors.media}
            className={fileClassName(!!errors.media)}
          />
          {media && (
            <div className="mt-2">
              <FilePreview file={media} alt="Prévia da mídia da avaliação" />
              <button
                type="button"
                onClick={() => clearFileInput(mediaInputRef.current, "media")}
                disabled={isPending}
                className="mt-2 text-xs font-medium text-slate-600 hover:underline disabled:opacity-60"
              >
                Remover
              </button>
            </div>
          )}
        </Field>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="h-11 rounded-xl bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Salvando..." : "Registrar avaliação"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isPending}
          className="h-11 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Limpar
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
