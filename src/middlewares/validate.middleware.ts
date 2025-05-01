import { Request, Response, NextFunction } from "express";
import { param, body, validationResult } from "express-validator";

import { ValidationError } from "../utils/errors.util.ts";
import { taskPriority, taskStatus } from "../models/core/task.model.ts";

const HandleValidationResult = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ");
    throw new ValidationError(`Validation Failed : ${errorMessages}`);
  }
  next();
};

const verifyFields = (data: object, allowedFields: Array<string>) => {
  const receivedFields = Object.keys(data);
  const extraFields = receivedFields.filter((field) => !allowedFields.includes(field));

  if (extraFields.length > 0) throw new ValidationError(`Unexpected fields found: ${extraFields.join(", ")}`);
  return true;
};

// --------------------- Auth validators ------------------------

const emailValidator = body("email").trim().isEmail().normalizeEmail().withMessage("Email format is invalid");

const passwordValidatorSignUp = body("password")
  .isLength({ min: 6 })
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]+$/)
  .withMessage("Password must be at least 6 characters, with 1 uppercase, 1 lowercase, and 1 number");

const nameValidatorSignUp = body("name")
  .trim()
  .isLength({ min: 3 })
  .withMessage("Name must be at least 3 characters long");

const passwordValidatorSignIn = body("password").notEmpty().withMessage("Password is required");

export const validateSignUp = [emailValidator, passwordValidatorSignUp, nameValidatorSignUp, HandleValidationResult];

export const validateSignIn = [emailValidator, passwordValidatorSignIn, HandleValidationResult];

// --------------------- Project validators ---------------------

export const validateProjectId = [param("id").isMongoId().withMessage("Invalid project ID"), HandleValidationResult];

export const validateProjectInput = [
  // Restrict project object to allowed fields
  body("project")
    .isObject()
    .withMessage("The 'project' property must be an object")
    .custom((project) => verifyFields(project, ["name", "description"])),

  // name
  body("project.name").trim().isLength({ min: 4, max: 100 }).withMessage("Name must be between 4 and 100 characters"),

  // description
  body("project.description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description can be at most 500 characters long"),

  HandleValidationResult,
];

// --------------------- Task validators ------------------------

export const validateTaskId = [param("id").isMongoId().withMessage("Invalid task ID"), HandleValidationResult];

export const validateTaskInput = [
  // Restrict task object to allowed fields
  body("task")
    .isObject()
    .withMessage("The 'task' property must be an object")
    .custom((task) => verifyFields(task, ["title", "description", "status", "priority", "dueDate", "projectId"])),

  // title
  body("task.title").trim().isLength({ min: 4, max: 100 }).withMessage("Title must be between 4 and 100 characters"),

  // description
  body("task.description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description can be at most 500 characters long"),

  // status
  body("task.status")
    .optional()
    .isIn(Object.values(taskStatus))
    .withMessage(`Status must be one of: ${Object.values(taskStatus).join(",")}`),

  // priority
  body("task.priority")
    .optional()
    .isIn(Object.values(taskPriority))
    .withMessage(`Priority must be one of: ${Object.values(taskPriority).join(",")}`),

  // dueDate
  body("task.dueDate")
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage("Due Date must be a valid date in YYYY-MM-DD format")
    .custom((dueDate) => {
      if (dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);

        if (due < today) throw new ValidationError("Due Date cannot be earlier than today");
      }
      return true;
    }),

  // projectId
  body("task.projectId").optional({ checkFalsy: true }).isMongoId().withMessage("Invalid project ID"),

  HandleValidationResult,
];
