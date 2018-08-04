import {Document, Model, model, Schema} from 'mongoose';

export class BaseRepository<T extends Document> {

    private model: Model<Document>;

    constructor(schemaModel: Model<Document>) {
        this.model = schemaModel;
    }

    findById(id: string): Promise<T> {
        return this.model.findById(id).exec() as Promise<T>;
    }

    save(item: T): Promise<T> {
        const itemToSave = new this.model(item);
        return itemToSave.save() as Promise<T>;
    }

    findAll(): Promise<T[]> {
        return this.model.find({}).exec() as Promise<T[]>;
    }

    update(id: string, newDocument: T): Promise<T> {
        return this.model.findByIdAndUpdate(id, newDocument).exec() as Promise<T>;
    }

    delete(id: string): Promise<T> {
        return this.model.findByIdAndRemove(id).exec() as Promise<T>;
    }
}