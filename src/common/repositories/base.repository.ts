import {Document, Model} from 'mongoose';
import {Entity} from "../domain/entity";
import {ObjectId} from "bson";
import {GenericAssembler} from "../assemblers/generic-assembler";

export class BaseRepository<E extends Entity> {

    private model: Model<Document>;
    private assembler: GenericAssembler<E>;

    constructor(schemaModel: Model<Document>) {
        this.model = schemaModel;
        this.assembler = new GenericAssembler<E>();
    }

    async findById(_id: string): Promise<E> {
        return this.assembler.toEntity(await this.model.findById(_id).lean().exec());
    }

    async save(item: E): Promise<E> {
        const itemToSave = new this.model(item);
        const itemSaved = await itemToSave.save();
        return this.findById(itemSaved._id);
    }

    async findAll(): Promise<E[]> {
        return await this.model.find({}).lean().exec();
    }

    async update(_id: string, newDocument: E): Promise<E> {
        await this.model.findByIdAndUpdate(_id, newDocument).lean().exec();
        return await this.findById(_id);
    }

    delete(_id: string): Promise<E> {
        return this.model.findByIdAndRemove(_id).lean().exec() as Promise<E>;
    }

    private toObjectId(_id: string): ObjectId {
        return ObjectId.createFromHexString(_id)
    }

}