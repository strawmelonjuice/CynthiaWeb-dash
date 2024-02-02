import session from "express-session";

export interface SessionData extends session.SessionData {
    user_id?: number;
}

export interface Request {
    session: SessionData;
}


export type PublishedFileObject = Array<PostPageObject>;

export interface CynthiaCacheIndexObject {
    fileid: string,
    cachepath: string
    timestamp: number,
}

export interface CynthiaPluginRepoItem {
    id: string,
    host: string,
    referrer: string,
}

export interface CynthiaPluginManifestItem {
    id: string,
    version: string,
}

export interface CynthiaUrlDataF {
    fullurl: string,
}

type CynthiaModeObject = [string, ModeConfig];

export interface ModeConfig {
    sitename: string,
    favicon?: string,
    stylefile: string,
    handlebar: Handlebar,
    menulinks: Array<Menulink>,
    menu2links: Array<Menulink>,
    pageinfooverride?: boolean,
}

export interface Handlebar {
    post: string,
    page: string,
}

export interface Menulink {
    name: string,
    href: string,
}

export interface CynthiaPageVars {
    head: string,
    content: string,
    menu1: string,
    menu2: string,
    infoshow: string,
}

export interface Menulist {
    menu1: string,
    menu2: string,
}


export interface CynthiaContentMetaData {
    author?: Author,
    category?: string,
    content
        :
        CynthiaPostDataContentObject,
    dates?: Dates,
    id: string,
    type: string,
    mode?: string,
    pageinfooverride?: boolean,
    postlist?: Postlist,
    short?: string,
    tags: Array<string>,
    thumbnail?: string,
    title: string,
}


export type PostPageObject =
    CynthiaContentMetaData;

export interface Author {
    name: string,
    thumbnail?: string,
}

export interface CynthiaPostDataContentObject {
    markup_type: string,
    location: string,
    data: string,
}

export interface Dates {
    lished: number,
    altered?: number,
}

export interface Postlist {
    filters?: PostListFilter,
}

export interface PostListFilter {
    category?: string,
    tag?: string,
    searchline?: string,
}