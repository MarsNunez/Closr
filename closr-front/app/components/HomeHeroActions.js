"use client";

import { Button, LinkButton } from "./Button";
import { useAuth } from "../providers/AuthProvider";
import { useAuthModal } from "../providers/AuthModalProvider";

export function HomeHeroActions() {
  const { status } = useAuth();
  const { open: openAuthModal } = useAuthModal();

  return (
    <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
      <LinkButton href="/explore" size="lg">
        Explorar creadores
      </LinkButton>
      {status === "authenticated" ? (
        <LinkButton href="/feed" variant="outline" size="lg">
          Ir al feed
        </LinkButton>
      ) : status === "unauthenticated" ? (
        <Button
          variant="outline"
          size="lg"
          onClick={() => openAuthModal("register")}
        >
          Crear cuenta
        </Button>
      ) : null}
    </div>
  );
}
