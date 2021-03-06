import {MongooseModule} from '@nestjs/mongoose';
import {forwardRef, Module} from "@nestjs/common";
import {MenuRepository} from "./repositories/menu.repository";
import MenuSchema from "./schemas/menu.schema";
import {MenusController} from "./menus.controller";
import {MenuService} from "./menu.service";
import {BookingsModule} from "../bookings/bookings.module";
import {AssemblersModule} from "../../common/assemblers/assemblers.module";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Menu', schema: MenuSchema}]),
        forwardRef(() => BookingsModule), AssemblersModule],
    controllers: [MenusController],
    providers: [MenuRepository, MenuService],
    exports: [MenuService]
})

export class MenusModule {
}
