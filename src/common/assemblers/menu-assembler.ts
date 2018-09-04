import {Assembler} from "./abstract.assembler";
import {Injectable} from "@nestjs/common";
import {Menu} from "../../modules/menus/domain/menu";
import {UserAssembler} from "./user-assembler";

@Injectable()
export class MenuAssembler extends Assembler<Menu> {
    constructor(private readonly userAssembler: UserAssembler) {
        super();
    }

    toDocument(menu: Menu) {
        return {
            _id: menu._id ? menu._id : undefined,
            name: menu.name,
            description: menu.description,
            starters: menu.starters,
            mains: menu.mains,
            desserts: menu.desserts,
            guests: menu.guests,
            available: menu.available,
            price: menu.price,
            host: this.userAssembler.toDocument(menu.host),
            date: menu.date,
            postalCode: menu.postalCode,
            address: menu.address,
            country: menu.country,
            location: menu.location,
            canceled: menu.canceled ? menu.canceled : false
        }
    }

    toEntity(document): Menu {
        const menu: Menu = new Menu();
        menu._id = document._id ? document._id.toString() : undefined;
        menu.name = document.name;
        menu.description = document.description;
        menu.starters = document.starters;
        menu.mains = document.mains;
        menu.desserts = document.desserts;
        menu.guests = document.guests;
        menu.available = document.available;
        menu.price = document.price;
        menu.host = this.userAssembler.toEntity(document.host);
        menu.date = document.date;
        menu.postalCode = document.postalCode;
        menu.address = document.address;
        menu.country = document.country;
        menu.location = document.location;
        menu.canceled = document.canceled;
        menu.average = document.average;
        menu.distance = document.distance;
        return menu;
    }
}