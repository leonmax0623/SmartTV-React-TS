export interface IVimeoCreateVideo {
    size: number;
    name: string;
}

interface IVimeoCreateVideoResponseUpload {
    upload_link: string;
}
export interface IVimeoCreateVideoResponse {
    upload: IVimeoCreateVideoResponseUpload
}
