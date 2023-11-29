import { body, validationResult } from "express-validator";
export const taskValidationRules = [
    body(`title`)
        .notEmpty()
        .withMessage(`Title is required`)
        .isLength({ min: 6 })
        .withMessage(`Title must be at least 6 characters long`),

    body(`description`)
        .notEmpty()
        .withMessage(`Description is required`)
        .isLength({ min: 6 })
        .withMessage(`Description must be at least 6 characters long`),
];

export const errorHandle = (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        // return res.status(400).send({ message: "Validation error", errors });
        return res.status(400).send([err.errors[0].msg]);
    }

    next();
};
