import {Controller, Get} from '@nestjs/common';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {DemoService} from "./demo.service";

@Controller('demo')
export class DemoController {
    constructor(private demoService: DemoService) {
    }

    @Get()
    @ApiOperation({title: 'DEMO DATA'})
    @ApiResponse({
        status: 200,
        description: 'Demo data created'
    })
    async demo() {
        await this.demoService.createDemoData();
    }

}
