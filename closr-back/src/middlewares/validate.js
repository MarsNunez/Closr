export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation error :c",
      errors: result.error.format(),
    });
  }

  req.body = result.data; // Datos ya validados y tipados
  next();
};
