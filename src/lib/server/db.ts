import DB from 'better-sqlite3';

const db = (fn: (db: DB.Database) => unknown) => {
	const dbClient = new DB('db.sqlite');

	const r = fn(dbClient);
	dbClient.close();

	return r;
};

export const getCollage = (collageId: string, sessionId: string) =>
	db((db) => {
		const collage = db
			.prepare('select * from collages where sessionId = ? and id = ? limit 1')
			.get(sessionId, collageId);

		if (collage) {
			collage.data = JSON.parse(collage.data);
		}

		return collage;
	});

export const deleteCollage = (id: number) =>
	db((db) => db.prepare('delete from collages where id=?').run(id));

export const getCollages = (sessionId: string) =>
	db((db) =>
		db
			.prepare(
				'select id, name, filename, updated from collages where sessionId = ? order by updated desc'
			)
			.all(sessionId)
	);

export const checkSession = (sessionId: string) =>
	db(
		(db) =>
			!!db
				.prepare(
					"select count(*) from sessions where id = ? and (expires is not null and expires > datetime('now') or count is not null and count > 0)"
				)
				.pluck()
				.get(sessionId)
	);

interface CreateCollageParams {
	name: string;
	sessionId: string;
	people: {
		name: string;
	}[];
	preview: string;
}

export const createCollage = (data: CreateCollageParams) =>
	db((db) =>
		db
			.prepare('insert into collages (sessionId, name, data, filename) values (?, ?, ?, ?)')
			.run(data.sessionId, data.name, JSON.stringify(data.people), data.preview)
	);

export const updateCollage = (id: number, data) =>
	db((db) =>
		db
			.prepare('update collages set name = ?,filename = ?, data = ? where id = ?')
			.run(data.name, data.preview, JSON.stringify(data.people), id)
	);
