import session from "express-session";

export interface SessionData extends session.SessionData {
	user_id?: number;
}
export interface Request {
	session: SessionData;
}

