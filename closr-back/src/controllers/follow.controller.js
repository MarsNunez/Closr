import { prisma } from "../lib/prisma.js";

export const followUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.userId) {
      return res.status(400).json({
        message: "No puedes seguirte a ti mismo",
      });
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: req.user.userId,
        followingId: userId,
      },
    });

    res.status(201).json(follow);
  } catch (error) {
    res.status(500).json({
      message: "Error siguiendo usuario",
    });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: req.user.userId,
          followingId: userId,
        },
      },
    });

    res.json({
      message: "Dejaste de seguir al usuario",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error dejando de seguir",
    });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const followers = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.json(followers);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo followers",
    });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.json(following);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo following",
    });
  }
};
