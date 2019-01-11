const casual = require('casual');


exports.mocks = {
    Recipe: () => ({
        _id: casual.uuid,
        name: casual.title,
        category: casual.title,
        description: casual.short_description,
        instructions: casual.description,
        createdDate: casual.date(format = 'YYYY-MM-DD'),
        likes: casual.integer(from = 0, to = 15),
        username: casual.username
    })
}