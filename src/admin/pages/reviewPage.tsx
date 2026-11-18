import ReviewForm from "../components/reviews/ReviewForm";
import ReviewList from "../components/reviews/ReviewList";

const ReviewPage = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Avaliações</h1>
        <p className="mt-1 text-sm text-slate-500">
          Registre uma avaliação e gerencie as que já foram enviadas.
        </p>
      </header>

      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start">
        <section
          aria-labelledby="create-review-heading"
          className="w-full min-w-0 lg:flex-1"
        >
          <h2
            id="create-review-heading"
            className="mb-3 text-lg font-semibold text-slate-900"
          >
            Registrar avaliação
          </h2>
          <ReviewForm />
        </section>

        <section
          aria-labelledby="review-list-heading"
          className="w-full min-w-0 lg:flex-1"
        >
          <h2
            id="review-list-heading"
            className="mb-3 text-lg font-semibold text-slate-900"
          >
            Avaliações registradas
          </h2>
          <ReviewList />
        </section>
      </div>
    </div>
  );
};

export default ReviewPage;
