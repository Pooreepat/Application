export interface HttpRespons {
  message: string;
}

export interface HttpResponsePagination {
  data: any[];
  total: number;
  page: number;
  perPage: number;
}