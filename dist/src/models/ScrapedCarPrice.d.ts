import mongoose, { Document } from "mongoose";
export interface IScrapedCarPrice extends Document {
    brand: string;
    carModel: string;
    variant: string;
    price: number;
    currency: string;
    url: string;
    scrapedAt: Date;
    expiresAt?: Date;
    staticData?: boolean;
}
declare const _default: mongoose.Model<IScrapedCarPrice, {}, {}, {}, mongoose.Document<unknown, {}, IScrapedCarPrice, {}, mongoose.DefaultSchemaOptions> & IScrapedCarPrice & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IScrapedCarPrice>;
export default _default;
//# sourceMappingURL=ScrapedCarPrice.d.ts.map