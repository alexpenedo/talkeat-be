import {Entity} from "../domain/entity";
import {Assembler} from "./abstract.assembler";
import {ObjectId} from "bson";

export class GenericAssembler<E extends Entity> extends Assembler<E> {

    toEntity(document): E {
        const _id: string = document._id.toString();
        const entity = document as E;
        entity._id = _id;
        return entity;
    }

    toDocument(entity) {
        const document = entity as any;
        document._id = new ObjectId(entity._id);
        return document;
    }

}