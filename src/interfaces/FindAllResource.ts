export interface FindAllResource<Resource> {
  data: Resource[];
  totalPages: number;
  limit: number;
  currPage: number;
  nextPage: number | null;
  prevPage: number | null;
}
