import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const SEED_PASSWORD = "password123";

async function reset() {
  console.log("🧹 Limpiando base de datos…");
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.work.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
}

async function createUsers() {
  console.log("👥 Creando usuarios…");
  const password = await bcrypt.hash(SEED_PASSWORD, 10);

  const data = [
    { username: "admin", email: "admin@closr.app", password, role: "ADMIN" },
    { username: "ana.studio", email: "ana@closr.app", password },
    { username: "milo.frames", email: "milo@closr.app", password },
    { username: "luna.color", email: "luna@closr.app", password },
    { username: "diego.beats", email: "diego@closr.app", password },
    { username: "sofia.lens", email: "sofia@closr.app", password },
  ];

  const users = {};
  for (const user of data) {
    const created = await prisma.user.create({ data: user });
    users[created.username] = created;
  }
  return users;
}

async function createWorks(users) {
  console.log("🖼️  Creando trabajos…");

  const items = [
    {
      username: "ana.studio",
      title: "Aurora quieta",
      description: "Estudio de color con luz suave y composición limpia.",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=82",
    },
    {
      username: "ana.studio",
      title: "Marea lenta",
      description: "Fotografía tranquila con líneas amplias.",
      imageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=82",
    },
    {
      username: "milo.frames",
      title: "Habitación al sol",
      description: "Escena minimalista para probar tonos cálidos.",
      imageUrl:
        "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=82",
    },
    {
      username: "milo.frames",
      title: "Still life 03",
      description: "Objetos cotidianos como pequeña galería.",
      imageUrl:
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=82",
    },
    {
      username: "luna.color",
      title: "Bloom studies",
      description: "Serie de texturas naturales y contraste bajo.",
      imageUrl:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=82",
    },
    {
      username: "luna.color",
      title: "Niebla rosa",
      description: "Paisaje suave para una portada editorial.",
      imageUrl:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=82",
    },
    {
      username: "diego.beats",
      title: "Sesión 04 — Nocturno",
      description: "Captura del set en vivo en la sesión de noviembre.",
      imageUrl:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=82",
    },
    {
      username: "sofia.lens",
      title: "Retratos de calle",
      description: "Serie documental tomada en blanco y negro.",
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=82",
    },
    {
      username: "sofia.lens",
      title: "Ciudad despierta",
      description: "Líneas urbanas al amanecer.",
      imageUrl:
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=82",
    },
  ];

  for (const item of items) {
    await prisma.work.create({
      data: {
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        likes: Math.floor(Math.random() * 120),
        authorId: users[item.username].id,
      },
    });
  }
}

async function createPosts(users) {
  console.log("📝 Creando posts…");

  const items = [
    {
      username: "ana.studio",
      content:
        "Subí tres referencias nuevas para explorar composición, luz lateral y espacios blancos. Esta semana abrimos sesión privada el viernes 🙌",
    },
    {
      username: "ana.studio",
      content:
        "Probando una serie de piezas más pequeñas. Me interesa que el grid respire mejor antes de la exhibición.",
    },
    {
      username: "milo.frames",
      content:
        "Estoy preparando un meet abierto para hablar de cámara analógica y revelado en casa. Si te interesa, déjame un comentario.",
    },
    {
      username: "milo.frames",
      content:
        "Detalle de la última serie. Me gusta cuando el color se vuelve protagonista sin necesidad de saturarlo.",
    },
    {
      username: "luna.color",
      content:
        "Quiero que la página de creador se sienta como un portafolio pequeño, no como una red social pesada.",
    },
    {
      username: "diego.beats",
      content:
        "Cerrando el EP. Voy a abrir un private listening para los primeros 10 que reserven cupo.",
    },
    {
      username: "sofia.lens",
      content:
        "Tres consejos rápidos para retrato en exteriores: 1) busca sombra abierta, 2) confía en la luz lateral, 3) menos zoom, más caminata.",
    },
  ];

  const created = [];
  for (const item of items) {
    const post = await prisma.post.create({
      data: {
        content: item.content,
        authorId: users[item.username].id,
      },
    });
    created.push(post);
  }
  return created;
}

async function createFollows(users) {
  console.log("🤝 Creando follows…");

  const pairs = [
    ["ana.studio", "milo.frames"],
    ["ana.studio", "luna.color"],
    ["ana.studio", "sofia.lens"],
    ["milo.frames", "ana.studio"],
    ["milo.frames", "diego.beats"],
    ["luna.color", "ana.studio"],
    ["luna.color", "sofia.lens"],
    ["diego.beats", "milo.frames"],
    ["diego.beats", "ana.studio"],
    ["sofia.lens", "luna.color"],
    ["sofia.lens", "ana.studio"],
    ["admin", "ana.studio"],
    ["admin", "milo.frames"],
  ];

  for (const [follower, following] of pairs) {
    await prisma.follow.create({
      data: {
        followerId: users[follower].id,
        followingId: users[following].id,
      },
    });
  }
}

async function createLikesAndComments(users, posts) {
  console.log("❤️  Creando likes y comentarios…");

  const usernames = Object.keys(users);

  for (const post of posts) {
    const likers = usernames
      .filter((u) => users[u].id !== post.authorId)
      .slice(0, 2 + Math.floor(Math.random() * 3));

    for (const username of likers) {
      await prisma.$transaction(async (tx) => {
        await tx.like.create({
          data: {
            userId: users[username].id,
            postId: post.id,
          },
        });
        await tx.post.update({
          where: { id: post.id },
          data: { likeCount: { increment: 1 } },
        });
      });
    }

    const commenters = usernames
      .filter((u) => users[u].id !== post.authorId)
      .slice(0, 1 + Math.floor(Math.random() * 2));

    const samples = [
      "Esto me encanta, ¿abrirás cupos pronto?",
      "Qué buena composición 👏",
      "Me anoto al próximo meet.",
      "Pasa tu Telegram si haces sesión privada.",
      "El color final quedó increíble.",
    ];

    for (const username of commenters) {
      const content = samples[Math.floor(Math.random() * samples.length)];
      await prisma.$transaction(async (tx) => {
        await tx.comment.create({
          data: {
            content,
            userId: users[username].id,
            postId: post.id,
          },
        });
        await tx.post.update({
          where: { id: post.id },
          data: { commentCount: { increment: 1 } },
        });
      });
    }
  }
}

async function main() {
  console.log("🌱 Seed Closr — iniciando\n");

  await reset();
  const users = await createUsers();
  await createWorks(users);
  const posts = await createPosts(users);
  await createFollows(users);
  await createLikesAndComments(users, posts);

  console.log("\n✅ Seed completado!\n");
  console.log("👤 Cuentas de prueba (contraseña: password123):");
  for (const username of Object.keys(users)) {
    console.log(`   • ${users[username].email}  (@${username})`);
  }
  console.log("\nEntra a http://localhost:3000/login y prueba la app 🚀\n");
}

main()
  .catch((error) => {
    console.error("❌ Error en seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
