import {Controller, Get} from "@nestjs/common";
import {ApiUseTags} from "@nestjs/swagger";
import * as os from "os";

@ApiUseTags('Healthcheck')
@Controller('status')
export class HealthcheckController {
    @Get()
    async get() {
        return "OK from " + os.hostname();
    }
}