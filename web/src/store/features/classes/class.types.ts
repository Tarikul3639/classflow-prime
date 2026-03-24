export type UpdateErrorField =
    | "title"
    | "type"
    | "description"
    | "date"
    | "time"
    | null;

export interface ApiError {
    field: UpdateErrorField;
    message: string | null;
}