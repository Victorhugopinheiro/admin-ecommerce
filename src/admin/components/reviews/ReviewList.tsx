import { memo, useCallback, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { useDeleteReview } from "../../../hooks/review/useDeleteReview";
import { useReviews } from "../../../hooks/review/useReviews";
import type { MediaType, Review } from "../../../types/reviewType";

const reviewDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function reviewDate(timestamp?: number) {
  if (timestamp == null || !Number.isFinite(timestamp)) return null;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function displayDate(review: Review) {
  return (
    reviewDate(review.date) ??
    reviewDate(review.createdAt ? Date.parse(review.createdAt) : undefined)
  );
}

function productOf(review: Review) {
  const product = review.productId;
  if (!product || typeof product === "string") return null;
  return product;
}

function ReviewMedia({
  url,
  type,
  userName,
}: {
  url?: string;
  type?: MediaType;
  userName: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (!url || !type) return null;

  if (type === "video") {
    if (!playing) {
      return (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
        >
          Reproduzir vídeo
        </button>
      );
    }

    return (
      <video
        src={url}
        controls
        playsInline
        preload="metadata"
        className="mt-3 aspect-video w-full rounded-xl bg-black"
      >
        Vídeo enviado por {userName}
      </video>
    );
  }

  return (
    <img
      src={url}
      alt={`Mídia enviada por ${userName}`}
      loading="lazy"
      decoding="async"
      className="mt-3 max-h-64 w-full rounded-xl object-cover sm:max-w-sm"
    />
  );
}

const ReviewCard = memo(function ReviewCard({
  review,
  isDeleting,
  onDelete,
}: {
  review: Review;
  isDeleting: boolean;
  onDelete: (reviewId: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const product = productOf(review);
  const productImage = product?.image?.[0];
  const userName = review.userName?.trim() || "Usuário";
  const platform = review.platform?.trim() || "Plataforma não informada";
  const initial = userName.charAt(0).toUpperCase() || "?";
  const date = displayDate(review);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm [content-visibility:auto] [contain-intrinsic-size:auto_220px]">
      <div className="flex items-start gap-3">
        {review.userImage ? (
          <img
            src={review.userImage}
            alt=""
            width={44}
            height={44}
            loading="lazy"
            decoding="async"
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-800"
          >
            {initial}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="truncate font-semibold text-slate-900">{userName}</p>
            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-800">
              {platform}
            </span>
          </div>
          <time
            dateTime={date?.toISOString()}
            className="mt-0.5 block text-xs text-slate-500"
          >
            {date ? reviewDateFormatter.format(date) : "—"}
          </time>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {productImage ? (
          <img
            src={productImage}
            alt=""
            width={32}
            height={32}
            loading="lazy"
            decoding="async"
            className="h-8 w-8 shrink-0 rounded-lg object-cover"
          />
        ) : null}
        <p className="truncate text-sm text-slate-600">
          {product?.name ?? "Produto indisponível"}
        </p>
      </div>

      <p className="mt-3 text-sm leading-relaxed break-words whitespace-pre-wrap text-slate-800">
        {review.message?.trim() || "Sem mensagem."}
      </p>

      <ReviewMedia
        url={review.mediaUrl}
        type={review.mediaType}
        userName={userName}
      />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        {confirming ? (
          <>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={isDeleting}
              className="h-11 rounded-xl px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => onDelete(review._id)}
              disabled={isDeleting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LuTrash2 size={16} aria-hidden="true" />
              {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 sm:w-auto sm:px-4"
          >
            <LuTrash2 size={16} aria-hidden="true" />
            Excluir
          </button>
        )}
      </div>
    </article>
  );
});

function ReviewList() {
  const {
    data: reviews,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useReviews();
  const { mutate, isPending, variables: pendingId } = useDeleteReview();

  const handleDelete = useCallback(
    (reviewId: string) => {
      mutate(reviewId);
    },
    [mutate]
  );

  if (isLoading) {
    return (
      <div aria-busy="true" aria-live="polite">
        <p className="sr-only">Carregando avaliações...</p>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-700">
          Não foi possível carregar as avaliações.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-3 h-11 rounded-xl bg-white px-4 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
        >
          {isFetching ? "Carregando..." : "Tentar novamente"}
        </button>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
        Nenhuma avaliação registrada.
      </p>
    );
  }

  const countLabel =
    reviews.length === 1 ? "1 avaliação" : `${reviews.length} avaliações`;

  return (
    <div>
      <p className="mb-3 text-sm text-slate-500">{countLabel}</p>
      <ul className="flex flex-col gap-3">
        {reviews.map((review) => (
          <li key={review._id}>
            <ReviewCard
              review={review}
              isDeleting={isPending && pendingId === review._id}
              onDelete={handleDelete}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReviewList;
