import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    brand: string;
    price: number;
    model: string;
    variants: mongoose.Types.DocumentArray<{
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }, {}, {}> & {
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }>;
    features: string[];
    images: string[];
    createdAt: NativeDate;
    transmission?: string | null;
    bodyType?: string | null;
    fuelType?: string | null;
    rating?: number | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    brand: string;
    price: number;
    model: string;
    variants: mongoose.Types.DocumentArray<{
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }, {}, {}> & {
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }>;
    features: string[];
    images: string[];
    createdAt: NativeDate;
    transmission?: string | null;
    bodyType?: string | null;
    fuelType?: string | null;
    rating?: number | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    brand: string;
    price: number;
    model: string;
    variants: mongoose.Types.DocumentArray<{
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }, {}, {}> & {
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }>;
    features: string[];
    images: string[];
    createdAt: NativeDate;
    transmission?: string | null;
    bodyType?: string | null;
    fuelType?: string | null;
    rating?: number | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    brand: string;
    price: number;
    model: string;
    variants: mongoose.Types.DocumentArray<{
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }, {}, {}> & {
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }>;
    features: string[];
    images: string[];
    createdAt: NativeDate;
    transmission?: string | null;
    bodyType?: string | null;
    fuelType?: string | null;
    rating?: number | null;
}, mongoose.Document<unknown, {}, {
    brand: string;
    price: number;
    model: string;
    variants: mongoose.Types.DocumentArray<{
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }, {}, {}> & {
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }>;
    features: string[];
    images: string[];
    createdAt: NativeDate;
    transmission?: string | null;
    bodyType?: string | null;
    fuelType?: string | null;
    rating?: number | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    brand: string;
    price: number;
    model: string;
    variants: mongoose.Types.DocumentArray<{
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }, {}, {}> & {
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }>;
    features: string[];
    images: string[];
    createdAt: NativeDate;
    transmission?: string | null;
    bodyType?: string | null;
    fuelType?: string | null;
    rating?: number | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    brand: string;
    price: number;
    model: string;
    variants: mongoose.Types.DocumentArray<{
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }, {}, {}> & {
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }>;
    features: string[];
    images: string[];
    createdAt: NativeDate;
    transmission?: string | null;
    bodyType?: string | null;
    fuelType?: string | null;
    rating?: number | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    brand: string;
    price: number;
    model: string;
    variants: mongoose.Types.DocumentArray<{
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }, {}, {}> & {
        price?: number | null;
        name?: string | null;
        engine?: string | null;
        fuel?: string | null;
        mileage?: number | null;
        transmission?: string | null;
    }>;
    features: string[];
    images: string[];
    createdAt: NativeDate;
    transmission?: string | null;
    bodyType?: string | null;
    fuelType?: string | null;
    rating?: number | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default _default;
//# sourceMappingURL=Car.d.ts.map