// ...existing code...
import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../../service/api";
import { useGettingCategories } from "../../hooks/gettingCategories";
import { useFranchise } from "../../hooks/franchise/useFranchise";

type Size = "S" | "M" | "L" | "XL" | "XXL";
type Category = "Men" | "Women" | "Kids";
type Characteristic = { title: string; description: string };
type ModelDraft = {
  name: string;
  price: string;
  file: File | null;
  preview: string;
};

const SIZES: Size[] = ["S", "M", "L", "XL", "XXL"];
const MAX_MODELS = 30;

type Errors = Partial<{
  name: string;
  price: string;
  category: string;
  images: string;
  characteristics: string;
  sizes: string;
  models: string;
}>;

function emptyModel(): ModelDraft {
  return { name: "", price: "", file: null, preview: "" };
}

const AdminAddProduct: React.FC = () => {
  const { data: categories } = useGettingCategories();
  const { data: franchises } = useFranchise();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [franchise, setFranchise] = useState("");
  const [price, setPrice] = useState<string>("");
  const [sizes, setSizes] = useState<Size[]>([]);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [models, setModels] = useState<ModelDraft[]>([]);
  const [bestseller, setbestseller] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [apiMessage, setApiMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hasModels = models.length > 0;

  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  const canSubmit = useMemo(() => !loading, [loading]);

  function toggleSize(sz: Size) {
    setSizes((curr) =>
      curr.includes(sz) ? curr.filter((s) => s !== sz) : [...curr, sz]
    );
  }

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const limited = [...images, ...files].slice(0, 4);
    setImages(limited);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function addCharacteristic() {
    setCharacteristics((prev) => [...prev, { title: "", description: "" }]);
  }

  function updateCharacteristic(
    index: number,
    field: keyof Characteristic,
    value: string
  ) {
    setCharacteristics((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function removeCharacteristic(index: number) {
    setCharacteristics((prev) => prev.filter((_, i) => i !== index));
  }

  function revokeModelPreview(model: ModelDraft) {
    if (model.preview) URL.revokeObjectURL(model.preview);
  }

  function addModel() {
    setModels((prev) =>
      prev.length >= MAX_MODELS ? prev : [...prev, emptyModel()]
    );
  }

  function updateModel(index: number, field: "name" | "price", value: string) {
    setModels((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function updateModelFile(index: number, file: File | null) {
    setModels((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        revokeModelPreview(item);
        return {
          ...item,
          file,
          preview: file ? URL.createObjectURL(file) : "",
        };
      })
    );
  }

  function removeModel(index: number) {
    setModels((prev) => {
      const removed = prev[index];
      if (removed) revokeModelPreview(removed);
      return prev.filter((_, i) => i !== index);
    });
  }

  function clearModels(rows: ModelDraft[]) {
    rows.forEach(revokeModelPreview);
    setModels([]);
  }

  function collectCharacteristics(): {
    rows: Characteristic[];
    error?: string;
  } {
    const rows: Characteristic[] = [];
    for (const item of characteristics) {
      const title = item.title.trim();
      const description = item.description.trim();
      if (!title && !description) continue;
      if (!title || !description) {
        return {
          rows: [],
          error: "Preencha o título e a descrição de cada característica.",
        };
      }
      rows.push({ title, description });
    }
    return { rows };
  }

  function validate(): boolean {
    const next: Errors = {};
    if (!name.trim()) next.name = "Informe o nome.";
    if (!category) next.category = "Selecione a categoria.";
    const collected = collectCharacteristics();
    if (collected.error) next.characteristics = collected.error;

    if (models.length === 0) {
      if (!images.length) next.images = "Envie ao menos 1 imagem.";
      const value = Number(price);
      if (!price || Number.isNaN(value) || value <= 0)
        next.price = "Preço inválido.";
      if (sizes.length === 0) next.sizes = "Selecione ao menos um tamanho.";
    } else if (models.length > MAX_MODELS) {
      next.models = "No máximo 30 modelos.";
    } else {
      const names = new Set<string>();
      for (const model of models) {
        const modelName = model.name.trim();
        const value = Number(model.price);
        if (
          !modelName ||
          !model.price ||
          Number.isNaN(value) ||
          value <= 0 ||
          !model.file
        ) {
          next.models =
            "Cada modelo precisa de nome, preço maior que zero e uma foto.";
          break;
        }
        if (names.has(modelName)) {
          next.models = "Nome de modelo repetido.";
          break;
        }
        names.add(modelName);
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function resetForm() {
    setImages([]);
    setName("");
    setDescription("");
    setCategory("");
    setFranchise("");
    setPrice("");
    setSizes([]);
    setCharacteristics([]);
    clearModels(models);
    setbestseller(false);
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setApiMessage(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("description", description);
      form.append("category", String(category));
      if (franchise) form.append("franchise", franchise);
      if (!franchise) form.append("franchise", "");
      form.append("sizes", JSON.stringify(sizes));
      form.append(
        "characteristics",
        JSON.stringify(collectCharacteristics().rows)
      );
      form.append("bestseller", bestseller ? "true" : "false");

      if (hasModels) {
        form.append(
          "models",
          JSON.stringify(
            models.map((model) => ({
              name: model.name.trim(),
              price: Number(model.price),
            }))
          )
        );
        models.forEach((model) => {
          if (model.file) form.append("modelImages", model.file);
        });
      } else {
        form.append("price", String(Number(price)));
        images[0] && form.append("image1", images[0]);
        images[1] && form.append("image2", images[1]);
        images[2] && form.append("image3", images[2]);
        images[3] && form.append("image4", images[3]);
      }

      const response = await api.post("/api/products/add", form);

      setApiMessage({
        type: "success",
        text: response.data.message || "Produto criado com sucesso!",
      });
      resetForm();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Falha ao criar produto.";
      setApiMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-97px)] w-full bg-slate-50">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">
          Adicionar Produto
        </h1>

        {apiMessage && (
          <div
            className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
              apiMessage.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {apiMessage.text}
          </div>
        )}

        {!hasModels && (
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Upload Image
            </label>

            <div className="flex flex-wrap gap-3">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="relative h-20 w-20 overflow-hidden rounded-lg border"
                >
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 rounded bg-black/60 px-1.5 text-xs text-white"
                  >
                    x
                  </button>
                </div>
              ))}

              {images.length < 4 && (
                <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border border-dashed text-slate-500 hover:border-slate-400">
                  <span className="text-xs">Adicionar</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={onFilesChange}
                  />
                </label>
              )}
            </div>
            {errors.images && (
              <p className="mt-1 text-xs text-red-600">{errors.images}</p>
            )}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Nome do Produto
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Camiseta básica"
            className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:ring-4 ${
              errors.name
                ? "border-red-500 focus:ring-red-100"
                : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Descrição do produto
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escreva aqui a descrição do produto"
            rows={4}
            className="w-full max-w-[400px] max-h-[400px] rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Características
          </label>
          <div className="space-y-3">
            {characteristics.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-3"
              >
                <div className="mb-2 flex items-start gap-2">
                  <input
                    value={item.title}
                    onChange={(e) =>
                      updateCharacteristic(index, "title", e.target.value)
                    }
                    placeholder="Título"
                    className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                  <button
                    type="button"
                    onClick={() => removeCharacteristic(index)}
                    className="h-11 shrink-0 rounded-xl border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Remover
                  </button>
                </div>
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    updateCharacteristic(index, "description", e.target.value)
                  }
                  placeholder="Descrição da característica"
                  rows={2}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            ))}
          </div>
          {errors.characteristics && (
            <p className="mt-1 text-xs text-red-600">
              {errors.characteristics}
            </p>
          )}
          <button
            type="button"
            onClick={addCharacteristic}
            className="mt-3 h-10 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Adicionar característica
          </button>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Modelos
          </label>
          <p className="mb-3 text-xs text-slate-500">
            {hasModels
              ? "A primeira linha é a capa. Cada modelo tem o próprio preço e a própria foto."
              : "Sem modelos, o produto usa o preço e a galeria de cima."}
          </p>
          <div className="space-y-3">
            {models.map((model, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-3"
              >
                <div className="mb-2 flex flex-wrap items-start gap-2">
                  <input
                    value={model.name}
                    onChange={(e) => updateModel(index, "name", e.target.value)}
                    placeholder={
                      index === 0 ? "Nome da capa" : "Nome do modelo"
                    }
                    className="h-11 min-w-[160px] flex-1 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={model.price}
                    onChange={(e) =>
                      updateModel(index, "price", e.target.value)
                    }
                    placeholder="Preço"
                    className="h-11 w-32 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                  <button
                    type="button"
                    onClick={() => removeModel(index)}
                    className="h-11 shrink-0 rounded-xl border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Remover
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  {model.preview ? (
                    <img
                      src={model.preview}
                      alt={model.name || `modelo-${index}`}
                      className="h-20 w-20 rounded-lg border object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed text-xs text-slate-400">
                      Foto
                    </div>
                  )}
                  <label className="cursor-pointer rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    {model.file ? "Trocar foto" : "Enviar foto"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        updateModelFile(index, file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
          {errors.models && (
            <p className="mt-1 text-xs text-red-600">{errors.models}</p>
          )}
          {models.length < MAX_MODELS && (
            <button
              type="button"
              onClick={addModel}
              className="mt-3 h-10 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Adicionar modelo
            </button>
          )}
        </div>

        <div className="mb-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Categoria do produto
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:ring-4 ${
                errors.category
                  ? "border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            >
              <option value="">Selecione</option>
              {categories?.map((category, index) => (
                <option key={index} value={category.type}>
                  {category.type}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Franquia
            </label>
            <select
              value={franchise}
              onChange={(e) => setFranchise(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">Selecione</option>
              {franchises?.map((item) => (
                <option key={item._id} value={item.type}>
                  {item.type}
                </option>
              ))}
            </select>
          </div>

          {!hasModels && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Preço do produto
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25"
                className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:ring-4 ${
                  errors.price
                    ? "border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-red-600">{errors.price}</p>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Tamanho do produto
          </label>
          {hasModels && (
            <p className="mb-2 text-xs text-slate-500">
              Opcional. A miniatura pode ficar sem tamanho.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {SIZES.map((sz) => {
              const selected = sizes.includes(sz);
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => toggleSize(sz)}
                  className={`rounded-md px-4 py-2 text-sm ${
                    selected
                      ? "bg-pink-500 text-white"
                      : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
          {errors.sizes && (
            <p className="mt-1 text-xs text-red-600">{errors.sizes}</p>
          )}
        </div>

        <div className="mb-6 flex items-center gap-2">
          <input
            id="bestseller"
            type="checkbox"
            checked={bestseller}
            onChange={(e) => setbestseller(e.target.checked)}
          />
          <label htmlFor="bestseller" className="text-sm text-slate-700">
            Adicionar em mais vendidos (best seller)
          </label>
        </div>

        <div className="flex gap-3">
          <button
            disabled={!canSubmit}
            type="submit"
            className="h-11 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Salvando..." : "Salvar produto"}
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setApiMessage(null);
            }}
            className="h-11 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Limpar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProduct;
