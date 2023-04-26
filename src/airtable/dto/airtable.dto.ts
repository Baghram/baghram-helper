import { SortParameter } from "airtable/lib/query_params";

export class AirtableOptionsDto {
  tables: AirtableOptions[];
}
export class AirtableOptions {
  name: string;
  key: string | any;
  base: string;
  table: string;
  options: OptionsDto;
}

export class OptionsDto {
  filterByFormula: string;
  cellFormat: "string" | "json";
  pageSize: number;
  fields: string[];
  sort: SortDto[];
}

export class CustomOptionsDto {
  filterByFormula?: string;
  pageSize?: number;
  sort?: SortDto[];
}

class SortDto {
  field: string;
  direction: "asc" | "desc";
}

export class UpdateRow {
  id: string;
  fields: any;
}
