
import DB from 'better-sqlite3';


const db = (fn: (db:  DB.Database) => unknown) => {
    const dbClient = new DB("db.sqlite");
    // dbClient.exec('create table sessions (id text primery key, expires datetie, count int, comment text);')
    const r = fn(dbClient);
    dbClient.close();

    return r;
}


export const getCollages = (sessionId: string) => db(db =>
    db
        .prepare('select id, name, filename, updated from collages where sessionId = ? order by updated desc')
        .all(sessionId)
)


export const checkSession = (sessionId: string) => db(db =>
        !!db
            .prepare("select count(*) from sessions where id = ? and (expires is not null and expires > datetime('now') or count is not null and count > 0)")
            .pluck()
            .get(sessionId)
)

interface CreateCollageParams {
    name: string;
    sessionId: string;
    people: {
        name: string;
    }[];
    preview: string;
}

export const createCollage = (data: CreateCollageParams) => db(db =>
        db
            .prepare("insert into collages (sessionId, name, data, filename) values (?, ?, ?, ?)")
            .run(data.sessionId, data.name, JSON.stringify(data.people), data.preview)
)