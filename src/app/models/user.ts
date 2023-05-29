import {UserMetaDate} from "./userMetaDate";

export  interface User{
    id:string,
    role:string,
    email:string,
    metaDate: UserMetaDate,
    basket: string[]|[]
}