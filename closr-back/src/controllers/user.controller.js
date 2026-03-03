import { prisma } from "../lib/prisma.js";

export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fehler beim Erstellen des Benutzers" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
};
