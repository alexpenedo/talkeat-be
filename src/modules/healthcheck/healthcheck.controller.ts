import {Controller, Get} from "@nestjs/common";
import {ApiUseTags} from "@nestjs/swagger";

@ApiUseTags('Healthcheck')
@Controller('status')
export class HealthcheckController {
    @Get()
    async get() {
        return "OK";
    }
}