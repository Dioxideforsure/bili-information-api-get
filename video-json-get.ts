/**
 * get_api_string
 */


interface video_access{
    // identify
    readonly bvid:string
    // status
    readonly status:number
    // get address
    
}

class video_information implements video_access{
    // basic video information 
    readonly bvid: string;
    readonly status: number;
    videos!: number;
    tname!: string;
    pic!: string;
    title!: string;
    time!: number;
    duration!: number;
    desc!: string;
    // author information
    name!: string;
    // viewer interaction information
    viewer!: number;
    danmuku!: number;
    reply!: number;
    like!: number;
    coin!: number;
    share!: number;
    favorite!: number;
    constructor(bvid:string, status:number){
        this.bvid = bvid
        this.status = status
    }
}







