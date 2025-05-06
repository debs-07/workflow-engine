interface ModelToFieldList {
  readonly project: readonly string[];
  readonly task: readonly string[];
}

interface ModelSearchableFieldsByType {
  readonly [key: string]: {
    readonly textFields: readonly string[];
    readonly dateFields: readonly string[];
    readonly mongoIdFields: readonly string[];
  };
}

export const sortOrders = ["asc", "desc"] as const;

export const sortableFields: ModelToFieldList = {
  project: ["name", "description", "createdAt", "updatedAt"],
  task: ["title", "description", "status", "priority", "dueDate", "createdAt", "updatedAt"],
};

export const searchableFields: ModelSearchableFieldsByType = {
  project: { textFields: ["name", "description"], dateFields: ["createdAt", "updatedAt"], mongoIdFields: [] },
  task: {
    textFields: ["title", "description", "status", "priority"],
    dateFields: ["dueDate", "createdAt", "updatedAt"],
    mongoIdFields: ["projectId"],
  },
};

export const editableModelFields: ModelToFieldList = {
  project: ["name", "description"],
  task: ["title", "description", "status", "priority", "dueDate", "projectId"],
};
