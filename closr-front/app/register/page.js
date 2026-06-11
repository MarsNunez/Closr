"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { Field, Input } from "../components/Input";
import { useAuth } from "../providers/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register({ username, email, password });
      router.push("/feed");
      router.refresh();
    } catch (err) {
      setError(err?.message || "No pudimos crear tu cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" className="py-16 sm:py-24">
      <div className="mx-auto max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Crea tu cuenta</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Únete para reservar tu cupo en reuniones con creadores.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label="Nombre de usuario" hint="Máximo 20 caracteres">
            <Input
              type="text"
              autoComplete="username"
              required
              maxLength={20}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="tu_usuario"
            />
          </Field>

          <Field label="Email">
            <Input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@email.com"
            />
          </Field>

          <Field label="Contraseña" hint="Mínimo 6 caracteres">
            <Input
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </Field>

          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </p>
          ) : null}

          <Button type="submit" size="lg" full disabled={loading}>
            {loading ? "Creando…" : "Crear cuenta"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </Container>
  );
}
