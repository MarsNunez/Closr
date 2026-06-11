export function formatRelativeDate(date) {
  if (!date) return "";

  const target = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - target.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 60) return "ahora";
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffHour < 24) return `hace ${diffHour} h`;
  if (diffDay < 7) return `hace ${diffDay} d`;

  return target.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: target.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
}

export function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getInitials(name) {
  if (!name) return "?";
  return name.trim().slice(0, 2).toUpperCase();
}
