import { Module, DynamicModule } from "@nestjs/common";
import { AirtableOptionsDto } from "./dto/airtable.dto";
import { AirtableService } from "./airtable.service";

@Module({})
export class AirtableModule {
  static register(options: AirtableOptionsDto): DynamicModule | any {
    return {
      module: AirtableModule,
      imports: [],
      providers: [
        {
          provide: "AIRTABLE_OPTIONS",
          useValue: options,
        },
        AirtableService,
      ],
      exports: [AirtableService],
    };
  }
}
