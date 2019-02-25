connection = new Mongo();
db = connection.getDB('fc-dev');
db.createCollection('users', {
	validationLevel: "strict",
	validator: {
		$jsonSchema: {
			bsonType: "object",
			required: ["username", "password_digest"],
			properties: {
				_id: {
					bsonType: "objectId"
				},
				username: {
					bsonType: "string"
				},
				password_digest: {
					bsonType: "string"
				}
			}
		}
	}
});
