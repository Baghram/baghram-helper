import {
  Injectable,
  Inject,
  HttpException,
  BadRequestException,
} from "@nestjs/common";
import Airtable from "airtable";
import {
  AirtableOptions,
  AirtableOptionsDto,
  CustomOptionsDto,
  UpdateRow,
} from "./dto/airtable.dto";

@Injectable()
export class AirtableService {
  constructor(
    @Inject("AIRTABLE_OPTIONS")
    private airtableOptions: AirtableOptionsDto
  ) {}

  async getData(airtableName: string, customOptions?: CustomOptionsDto) {
    let dataUsed: AirtableOptions;
    for (const data of this.airtableOptions.tables) {
      if (airtableName === data.name) dataUsed = data;
    }
    if (customOptions) {
      for (let key in dataUsed.options) {
        if (dataUsed.options.hasOwnProperty(key) && customOptions[key])
          dataUsed.options[key] = customOptions[key];
      }
    }
    Airtable.configure({ apiKey: dataUsed.key });
    const base = Airtable.base(dataUsed.base);
    const table = base.table(dataUsed.table);
    let tableArrayData = [];
    await table.select(dataUsed.options).eachPage((records, fetchNextPage) => {
      for (const record of records) {
        tableArrayData.push(record["fields"]);
      }
      fetchNextPage();
    });
    return tableArrayData;
  }

  async writeData(airtableName: string, fields: any | any[]) {
    let dataUsed: AirtableOptions;
    for (const data of this.airtableOptions.tables) {
      if (airtableName === data.name) dataUsed = data;
    }
    Airtable.configure({ apiKey: dataUsed.key });
    const base = Airtable.base(dataUsed.base);
    const table = base.table(dataUsed.table);
    if (Array.isArray(fields) && fields !== null) {
      let objectToBeCreated = [];
      for (const data of fields) {
        objectToBeCreated.push({ fields: data });
      }
      const createData = new Promise((resolve, reject) => {
        table
          .create(objectToBeCreated)
          .then((result) => {
            return resolve(result);
          })
          .catch((err) => {
            return reject(err);
          });
      });
      return createData;
    }
  }

  async deleteData(airtableName: string, recordIds: string[]) {
    let dataUsed: AirtableOptions;
    for (const data of this.airtableOptions.tables) {
      if (airtableName === data.name) dataUsed = data;
    }
    Airtable.configure({ apiKey: dataUsed.key });
    const base = Airtable.base(dataUsed.base);
    const table = base.table(dataUsed.table);
    table.destroy(recordIds);
  }

  async updateData(airtableName: string, datas: UpdateRow[]) {
    let dataUsed: AirtableOptions;
    for (const data of this.airtableOptions.tables) {
      if (airtableName === data.name) dataUsed = data;
    }
    Airtable.configure({ apiKey: dataUsed.key });
    const base = Airtable.base(dataUsed.base);
    const table = base.table(dataUsed.table);
    table.update(datas);
  }
}
