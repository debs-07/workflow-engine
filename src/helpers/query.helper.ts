import { FilterQuery } from "mongoose";

import { searchableFields } from "../config/crud.config.ts";

export const applySearchFilters = <T>(
  filterQuery: FilterQuery<T>,
  search: Record<string, string>,
  model: "task" | "project",
) => {
  Object.entries(search).forEach(([key, value]) => {
    const { mongoIdFields, textFields, dateFields } = searchableFields[model];

    if (mongoIdFields.includes(key)) {
      Object.assign(filterQuery, { [key]: value });
      return;
    }

    if (textFields.includes(key)) {
      Object.assign(filterQuery, { [key]: { $regex: value, $options: "i" } });
      return;
    }

    if (dateFields.includes(key) && !isNaN(new Date(value).getTime())) {
      const startDate = new Date(value);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
      Object.assign(filterQuery, { [key]: { $gte: startDate, $lt: endDate } });
      return;
    }
  });
};
