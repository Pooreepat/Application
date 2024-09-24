import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PreferenceService } from "../preference.service";

@Injectable()
export class RegisterUsecase {
  constructor(
    private readonly preferenceService: PreferenceService,
    readonly configService: ConfigService,
  ) {}
}