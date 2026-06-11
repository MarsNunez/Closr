"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalBody, ModalHeader } from "./Modal";
import { Button } from "./Button";
import { Field, Input } from "./Input";
import { useAuth } from "../providers/AuthProvider";
import { cn } from "../lib/cn";

export function AuthModal({ open, mode = "login", onClose, onMode }) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setError("");
      setPassword("");
      setLoading(false);
    }
  }, [open, mode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        await login({ email, password });
      } else {
        await register({ username, email, password });
      }
      onClose?.();
      router.refresh();
    } catch (err) {
      setError(err?.message || "Algo salió mal");
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalHeader
        title={isLogin ? "Entrar a Closr" : "Crear cuenta"}
        description={
          isLogin
            ? "Sigue creadores y reserva tus cupos."
            : "Únete para conectar con tus creadores favoritos."
        }
        onClose={onClose}
      />

      <div className="border-b border-[color:var(--border)] px-5">
        <div className="flex gap-1">
          <TabButton active={isLogin} onClick={() => onMode?.("login")}>
            Entrar
          </TabButton>
          <TabButton active={!isLogin} onClick={() => onMode?.("register")}>
            Crear cuenta
          </TabButton>
        </div>
      </div>

      <ModalBody>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin ? (
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
          ) : null}

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

          <Field
            label="Contraseña"
            hint={!isLogin ? "Mínimo 6 caracteres" : undefined}
          >
            <Input
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              minLength={isLogin ? undefined : 6}
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
            {loading
              ? isLogin
                ? "Entrando…"
                : "Creando…"
              : isLogin
                ? "Entrar"
                : "Crear cuenta"}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative px-3 py-3 text-sm font-medium transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
      {active ? (
        <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-foreground" />
      ) : null}
    </button>
  );
}
