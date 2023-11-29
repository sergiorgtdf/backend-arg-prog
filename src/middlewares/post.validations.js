import { body, validationResult } from "express-validator";

export const postValidationRules = [
    body(`title`)
        .notEmpty()
        .withMessage(`El titulo es requerido`)
        .isLength({ min: 6 })
        .withMessage(`El titulo debe tener un minimo de 6 caracteres`),

    body(`description`)
        .notEmpty()
        .withMessage(`La descripcion es requerida`)
        .isLength({ min: 10 }),
];

export const errorHandle = (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        // return res.status(400).send({ message: "Validation error", errors });
        return res.status(400).send([err.errors[0].msg]);
    }

    next();
};
