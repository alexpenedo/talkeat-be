import * as _ from 'lodash';
import {Entity} from "../domain/entity";

export abstract class Assembler<E extends Entity> {

    abstract toEntity(document): E;

    abstract toDocument(entity);

    toEntities(documents): E[] {
        return _.map(documents, (doc) => {
            return this.toEntity(doc);
        });
    }


}