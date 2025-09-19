// ...existing code...
import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../../service/api";

type Size = "S" | "M" | "L" | "XL" | "XXL";
type Category = "Men" | "Women" | "Kids";
type SubCategory = "Topwear" | "Bottomwear" | "Winterwear";

const CATEGORIES: Category[] = ["Men", "Women", "Kids"];
const SUB_CATEGORIES: SubCategory[] = ["Topwear", "Bottomwear", "Winterwear"];
const SIZES: Size[] = ["S", "M", "L", "XL", "XXL"];

type Errors = Partial<{
  name: string;
  price: string;
  category: string;
  subCategory: string;
  images: string;
}>;

const AdminAddProduct: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [subCategory, setSubCategory] = useState<SubCategory | "">("");
  const [price, setPrice] = useState<string>("");
  const [sizes, setSizes] = useState<Size[]>([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [apiMessage, setApiMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  const canSubmit = useMemo(() => !loading, [loading]);

  function toggleSize(sz: Size) {
    setSizes((curr) => (curr.includes(sz) ? curr.filter((s) => s !== sz) : [...curr, sz]));
  }

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const limited = [...images, ...files].slice(0, 4); // até 4
    setImages(limited);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function validate(): boolean {
    const next: Errors = {};
    if (!images.length) next.images = "Envie ao menos 1 imagem.";
    if (!name.trim()) next.name = "Informe o nome.";
    const value = Number(price);
    if (!price || Number.isNaN(value) || value <= 0) next.price = "Preço inválido.";
    if (!category) next.category = "Selecione a categoria.";
    if (!subCategory) next.subCategory = "Selecione a subcategoria.";
    setErrors(next);
    return Object.keys(next).length === 0;
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
      form.append("subCategory", String(subCategory));
      form.append("price", String(Number(price)));
      form.append("sizes", JSON.stringify(sizes));
      form.append("bestSeller", String(bestSeller));
      images[0] && form.append("image1", images[0]);
      images[1] && form.append("image2", images[1]);
      images[2] && form.append("image3", images[2]);
      images[3] && form.append("image4", images[3]);

      const response = await api.post("/api/products/add", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setApiMessage({ type: "success", text: "Produto criado com sucesso." });
      console.log("Produto criado:", response.data);

    } catch (err: any) {
      const msg = err?.response?.data?.message || "Falha ao criar produto.";
      setApiMessage({ type: "error", text: msg });
    } finally {

      setImages([]);
      setName("");
      setDescription("");
      setCategory("");
      setSubCategory("");
      setPrice("");
      setSizes([]);
      setBestSeller(false);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-97px)] w-full bg-slate-50">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Adicionar Produto</h1>

        {apiMessage && (
          <div
            className={`mb-4 rounded-lg border px-3 py-2 text-sm ${apiMessage.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
              }`}
          >
            {apiMessage.text}
          </div>
        )}


        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Upload Image</label>

          <div className="flex flex-wrap gap-3">
            {previews.map((src, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border">
                <img src={src} alt={`preview-${i}`} className="h-full w-full object-cover" />
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
          {errors.images && <p className="mt-1 text-xs text-red-600">{errors.images}</p>}
        </div>


        <div className="mb-4">
          <label className="mb-1 block text-sm font-semibold text-slate-700">Nome do Produto</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Camiseta básica"
            className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:ring-4 ${errors.name ? "border-red-500 focus:ring-red-100" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>


        <div className="mb-4">
          <label className="mb-1 block text-sm font-semibold text-slate-700">Descrição do produto</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escreva aqui a descrição do produto"
            rows={4}
            className="w-full max-w-[400px] max-h-[400px] rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>


        <div className="mb-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Categoria do produto</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:ring-4 ${errors.category ? "border-red-500 focus:ring-red-100" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                }`}
            >
              <option value="">Selecione</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Sub Categoria</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value as SubCategory)}
              className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:ring-4 ${errors.subCategory ? "border-red-500 focus:ring-red-100" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                }`}
            >
              <option value="">Selecione</option>
              {SUB_CATEGORIES.map((subCategory) => (
                <option key={subCategory} value={subCategory}>
                  {subCategory}
                </option>
              ))}
            </select>
            {errors.subCategory && <p className="mt-1 text-xs text-red-600">{errors.subCategory}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Preço do produto</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="25"
              className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:ring-4 ${errors.price ? "border-red-500 focus:ring-red-100" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                }`}
            />
            {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
          </div>
        </div>


        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Tamanho do produto</label>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((sz) => {
              const selected = sizes.includes(sz);
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => toggleSize(sz)}
                  className={`rounded-md px-4 py-2 text-sm ${selected ? "bg-pink-500 text-white" : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                    }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* Best Seller */}
        <div className="mb-6 flex items-center gap-2">
          <input id="bestSeller" type="checkbox" checked={bestSeller} onChange={(e) => setBestSeller(e.target.checked)} />
          <label htmlFor="bestSeller" className="text-sm text-slate-700">
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
              setImages([]); setName(""); setDescription(""); setCategory(""); setSubCategory(""); setPrice(""); setSizes([]); setBestSeller(false); setErrors({});
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
