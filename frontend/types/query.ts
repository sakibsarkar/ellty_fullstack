export interface IQueryMutationErrorResponse {
  data: {
    message: string;
    errorMessages: { path: string; message: string }[];
    statusCode: number;
    success: boolean;
  };
}
