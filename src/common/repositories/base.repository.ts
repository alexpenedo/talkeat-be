import {Document, Model} from 'mongoose';
import {Entity} from "../domain/entity";
import {Assembler} from "../assemblers/abstract.assembler";

export class BaseRepository<E extends Entity> {

    private readonly model: Model<Document>;
    private assembler: Assembler<E>;

    constructor(model: Model<Document>, assembler: Assembler<E>) {
        this.model = model;
        this.assembler = assembler;
    }

    async findById(_id: string): Promise<E> {
        return this.assembler.toEntity(await this.model.findById(_id).lean().exec());
    }

    async save(item: E): Promise<E> {
        const itemToSave = new this.model(this.assembler.toDocument(item));
        const itemSaved = await itemToSave.save();
        return this.findById(itemSaved._id);
    }

    async findAll(): Promise<E[]> {
        return this.assembler.toEntities(await this.model.find({}).lean().exec());
    }

    async update(_id: string, newDocument: E): Promise<E> {
        await this.model.findByIdAndUpdate(_id, newDocument).lean().exec();
        return await this.findById(_id);
    }

    async delete(_id: string): Promise<E> {
        return this.model.findByIdAndRemove(_id).lean().exec() as Promise<E>;
    }
}