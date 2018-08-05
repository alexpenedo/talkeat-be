import {Status} from "../../../common/enums/status.enum";

export interface FindParams {
    longitude?:number;
    latitude?:number;
    persons?:number;
    date?:string;
    type?:string;
    host?:string;
    status?: Status;
    userId?:string;
}