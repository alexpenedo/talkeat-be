import mongoose from 'mongoose';
import User from '../models/user';
import bcrypt from 'bcrypt-nodejs';
import faker from 'faker';
import Menu from '../models/menu/menu';
import Booking from '../models/booking';

const addresses = [
    {
        address: "Payo Gómez, 13",
        postalCode: "15004",
        location: [-8.407447, 43.367325]
    },
    {
        address: "Av. Linares Rivas, 18",
        postalCode: "15005",
        location: [-8.405712, 43.363213]
    },
    {
        address: "Plaza Mestre Mateo, 8",
        postalCode: "15004",
        location: [-8.411997, 43.366624]
    },
    {
        address: "Ronda Nelle, 93",
        postalCode: "15010",
        location: [-8.419139, 43.363164]
    },
    {
        address: "Calle Agra del Orzan, 17",
        postalCode: "15010",
        location: [-8.406837, 43.369339]
    },
    {
        address: "Calle Sta. Catalina, 16",
        postalCode: "15003",
        location: [-8.404095, 43.368514]
    },
    {
        address: "Calle Cordelería, 6",
        postalCode: "15003",
        ocation: [-8.403421, 43.370713]
    },
    {
        address: "Av. de Pedro Barrié de la Maza, 23",
        postalCode: "15003",
        location: [-8.406837, 43.369339]
    }, {
        address: "Calle María Luisa Durán Marquina, 2",
        postalCode: "15011",
        location: [-8.417417, 43.369873]
    },
    {
        address: "Calle San Roque Afuera, 57",
        postalCode: "15011",
        location: [-8.419421, 43.370642]
    }
]

function createTestData() {

    for (var i = 0; i < 10; i++) {
        const address = addresses[i];
        let host = new User({
            "name": faker.name.findName(),
            "surname": faker.name.lastName(),
            "email": faker.internet.email(),
            "mobileNumber": 600000000 + i,
            "postalCode": address.postalCode,
            "address": address.address,
            "country": "España",
            "password": "000000"
        });
        host.password = bcrypt.hashSync(host.password);
        host.save().then(
            hostStored => {
                const guests = getRandomInt(1, 7);
                let date = new Date();
                date.setHours(date.getHours() + getRandomInt(1, 48));
                if (i % 2 == 0)
                    date.setMinutes(0)
                else
                    date.setMinutes(30)
                date.setSeconds(0);
                date.setMilliseconds(0);
                let menu = new Menu({
                    name: faker.lorem.words(2),
                    description: faker.lorem.words(10),
                    starters: [{ name: faker.lorem.words(2) }],
                    mains: [{ name: faker.lorem.words(2) }, { name: faker.lorem.words(1) }],
                    desserts: [{ name: faker.lorem.words(2) }],
                    guests,
                    available: guests - 1,
                    price: parseFloat(getRandomArbitrary(5, 15).toFixed(1)),
                    host: hostStored,
                    date,
                    postalCode: address.postalCode,
                    address: address.address,
                    country: "España",
                    createdAt: new Date(),
                    location: address.location
                });
                menu.save().then(menuStored => {
                    //usuario invitado
                    let guest = new User({
                        "name": faker.name.findName(),
                        "surname": faker.name.lastName(),
                        "email": faker.internet.email(),
                        "mobileNumber": 601000000 + i,
                        "postalCode": address.postalCode,
                        "address": address.address,
                        "country": "España",
                        "password": "000000"
                    });
                    guest.password = bcrypt.hashSync(guest.password);
                    guest.save().then(
                        guestStored => {
                            let booking = new Booking({
                                date: new Date(),
                                guest: guestStored,
                                host: hostStored,
                                menuDate: menuStored.date,
                                menu: menuStored,
                                confirmed: false
                            });
                            booking.save();
                        });
                });
            });
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export default { createTestData }
