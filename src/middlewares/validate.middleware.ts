import { Request, Response, NextFunction } from "express";
import { query, param, body, validationResult } from "express-validator";

import { ValidationError } from "../utils/errors.util.ts";
import { taskPriority, taskStatus } from "../models/core/task.model.ts";
import { sortOrders, sortableFields, searchableFields, editableModelFields } from "../config/crud.config.ts";

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

const verifyFields = (data: object, allowedFields: readonly string[]) => {
  const receivedFields = Object.keys(data);
  const extraFields = receivedFields.filter((field) => !allowedFields.includes(field));

  if (extraFields.length > 0) throw new ValidationError(`Unexpected fields found: ${extraFields.join(", ")}`);
  return true;
};

// --------------------- Common validators ------------------------

export const verifyFetchFilter = (model: "project" | "task") => {
  const { mongoIdFields, textFields, dateFields } = searchableFields[model];
  const allowedQueryFields = ["page", "limit", "sortBy", "sortOrder", ...Object.values(searchableFields[model]).flat()];

  return [
    // page
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),

    // limit
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be a positive integer between 1 and 100"),

    // sort by
    query("sortBy")
      .optional()
      .isIn(sortableFields[model])
      .withMessage(`sortBy must be one of: ${sortableFields[model].join(", ")}`),

    // sort order
    query("sortOrder")
      .optional()
      .isIn(sortOrders)
      .withMessage(`sortOrder must be one of: ${sortOrders.join(", ")}`),

    /**
     * Validates MongoDB ID fields in the query.
     * Ensures each specified MongoDB ID field is a valid MongoDB ObjectId if provided.
     */
    ...mongoIdFields.map((field) => query(field).optional().isMongoId().withMessage(`Invalid ${field} ID`)),

    /**
     * Validates string fields in the query.
     * Ensures each specified text field is a non-empty string if provided.
     */
    ...textFields.map((field) =>
      query(field).optional().isString().notEmpty().withMessage(`${field} must be a non-empty string`),
    ),

    /**
     * Validates date fields in the query.
     * Ensures each specified date field is a valid date in YYYY-MM-DD format if provided.
     */
    ...dateFields.map((field) =>
      query(field)
        .optional()
        .isDate({ format: "YYYY-MM-DD" })
        .withMessage(`${field} must be a valid date in YYYY-MM-DD format`),
    ),

    /**
     * Validates the query for unknown fields and multiple values per field.
     * - Throws an error if the query contains fields not listed in `allowedQueryFields`.
     * - Throws an error if any field in the query has an array of values.
     */
    query().custom((fields) => {
      const notAllowedQueryFields = Object.keys(fields).filter((key) => !allowedQueryFields.includes(key));

      if (notAllowedQueryFields.length > 0)
        throw new ValidationError(`Unknow fields in query : ${notAllowedQueryFields.join(", ")}`);

      const arrayOfValuesFields = Object.keys(fields).filter((key) => Array.isArray(fields[key]));

      if (arrayOfValuesFields.length > 0)
        throw new ValidationError(`Fields must have a single value : ${arrayOfValuesFields.join(", ")}`);

      return true;
    }),

    HandleValidationResult,
  ];
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
    .custom((project) => verifyFields(project, editableModelFields.project)),

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
    .custom((task) => verifyFields(task, editableModelFields.task)),

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
