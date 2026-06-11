"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { AuthGuard } from "../../components/AuthGuard";
import { Button } from "../../components/Button";
import { Container } from "../../components/Container";
import { Field, Input, Textarea } from "../../components/Input";
import { apiRequest } from "../../lib/api";

function NewWorkForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFile = (event) => {
    const next = event.target.files?.[0];
    event.target.value = "";
    if (!next) return;
    setFile(next);
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(next);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !file || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      if (description.trim()) formData.append("description", description.trim());
      formData.append("image", file);

      const work = await apiRequest("/works", {
        method: "POST",
        body: formData,
        isFormData: true,
      });
      router.push(`/works/${work.id}`);
    } catch (err) {
      setError(err?.message || "No pudimos subir el trabajo");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container size="md" className="py-12 sm:py-16">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Subir trabajo
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Muestra tu trabajo a la comunidad. Tu foto se aloja en Cloudinary.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-5">
          <Field label="Título">
            <Input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Una serie de fotografías en blanco y negro"
              required
            />
          </Field>

          <Field label="Descripción" hint="Opcional">
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              placeholder="Cuenta el contexto detrás del trabajo"
            />
          </Field>

          <Field label="Imagen" error={error || undefined}>
            <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[color:var(--border)] text-sm text-muted-foreground transition-colors hover:bg-muted">
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
              {file ? (
                <>
                  <span className="font-medium text-foreground">{file.name}</span>
                  <span className="text-xs">Click para cambiar</span>
                </>
              ) : (
                <>
                  <span className="font-medium text-foreground">
                    Selecciona una imagen
                  </span>
                  <span className="text-xs">PNG, JPG o WebP</span>
                </>
              )}
            </label>
          </Field>

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting || !title.trim() || !file}>
              {submitting ? "Subiendo…" : "Publicar"}
            </Button>
          </div>
        </div>

        <aside className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Vista previa
          </p>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[color:var(--border)] bg-muted">
            {preview ? (
              <Image src={preview} alt="Vista previa" fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Sin imagen
              </div>
            )}
          </div>
        </aside>
      </form>
    </Container>
  );
}

export default function NewWorkPage() {
  return (
    <AuthGuard next="/new/work">
      <NewWorkForm />
    </AuthGuard>
  );
}
