import {Controller, Get} from "@nestjs/common";

@Controller('status')
export class HealthcheckController {
    @Get()
    async get() {
        return "OK";
    }
}