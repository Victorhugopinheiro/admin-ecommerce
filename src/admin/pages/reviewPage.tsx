import ReviewForm from "../components/reviews/ReviewForm";

const ReviewPage = () => {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">
        Registrar avaliação
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        Escolha o produto e preencha os dados da avaliação.
      </p>
      <ReviewForm />
    </div>
  );
};

export default ReviewPage;
