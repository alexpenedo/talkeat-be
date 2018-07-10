import mongoose, {MongooseDocument, Schema} from 'mongoose';

const RateSchema = new mongoose.Schema({
    date: {
        type: Date,
    },
    guest: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    booking: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    comment: {
        type: String
    },
    rate: {
        type: Number,
        required: true
    }
});


RateSchema.method({
});

RateSchema.pre('save', function (next) {
    this.date = new Date();
    next();
});

/**
 * @typedef Rate
 */
export default mongoose.model('Rate', RateSchema);