import {Document, Model, model, Schema} from 'mongoose';

export class BaseRepository<T extends Document> {

    private model: Model<Document>;

    constructor(schemaModel: Model<Document>) {
        this.model = schemaModel;
    }

    findById(id: string): Promise<T> {
        return this.model.findById(id).exec() as Promise<T>;
    }

    async save(item: T): Promise<T> {
        const itemToSave = new this.model(item);
        const itemSaved = await itemToSave.save();
        return this.findById(itemSaved._id);
    }

    findAll(): Promise<T[]> {
        return this.model.find({}).exec() as Promise<T[]>;
    }

    async update(id: string, newDocument: T): Promise<T> {
        await this.model.findByIdAndUpdate(id, newDocument).exec();
        return this.findById(id);
    }

    delete(id: string): Promise<T> {
        return this.model.findByIdAndRemove(id).exec() as Promise<T>;
    }
}