import type { CategoryNode } from "../types/createTicket.type";

import flattenActions from "./flattenActions";

import mockActionsNested from "../../mockActionsNested.json";

export const allActions = flattenActions(mockActionsNested as CategoryNode[]);
