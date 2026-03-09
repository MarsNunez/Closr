import prisma from "../lib/prisma.js";

export const getFeed = async (req, res) => {
  try {
    // 👤 Usuario autenticado
    if (req.user) {
      const currentUserId = req.user.id;

      const following = await prisma.follow.findMany({
        where: {
          followerId: currentUserId,
        },
        select: {
          followingId: true,
        },
      });

      const followingIds = following.map((f) => f.followingId);

      const posts = await prisma.post.findMany({
        where: {
          OR: [{ userId: currentUserId }, { userId: { in: followingIds } }],
        },

        include: {
          user: {
            select: {
              id: true,
              username: true,
              // avatarUrl: true,
            },
          },

          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },

          likes: {
            where: {
              userId: currentUserId,
            },
            select: {
              id: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 30,
      });

      const formattedPosts = posts.map((post) => ({
        id: post.id,
        content: post.content,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,

        user: post.user,

        likesCount: post._count.likes,
        commentsCount: post._count.comments,

        likedByMe: post.likes.length > 0,
      }));

      return res.json(formattedPosts);
    }

    // 🌍 Usuario no autenticado → feed global

    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },

        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 30,
    });

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,

      user: post.user,

      likesCount: post._count.likes,
      commentsCount: post._count.comments,
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error loading feed" });
  }
};
