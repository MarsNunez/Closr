import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
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

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    // 2️⃣ Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    // 3️⃣ Crear tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    // Guardar refresh token en DB
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en login" });
  }
};

export const refreshAccessToken = async (req, res) => {
  // Lo que hace esta función es verificar el refresh token, y si es válido, generar un
  // nuevo access token cada 15 min (que es el tiempo que el front va a estar llamando
  // a este controller). No se emite un nuevo refresh token, ya que el actual
  // sigue siendo válido hasta su fecha de expiración.
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token" });
    }

    // Verificar JWT
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Verificar que exista en DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      return res.status(403).json({ error: "Refresh token inválido" });
    }

    // Generar nuevo access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ error: "Refresh token inválido o expirado" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const token = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!token) {
      return res.status(404).json({
        message: "Token no encontrado",
      });
    }

    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    res.json({ message: "Logout exitoso" });
  } catch (error) {
    res.status(400).json({ error: "Error en logout" });
  }
};
