const mongoose = require('mongoose')


module.exports = mongoose.model('AdminUser',
    mongoose.Schema({
        email: { type: String, component: 'input-text', show: true, link: true },
        name: { type: String, component: 'input-text', show: true },
        password: { type: String, component: 'input-password', crypto: 'sha256' },
        role: { type: String, component: 'select', values: ['superadmin', 'admin', 'moderator', 'view'] },
        token: { type: String, component: 'input-text', crypto: 'sha256' },
        created_at: { type: Date, default: Date.now, show: true, verb_name: 'Дата' },
        updated_at: { type: Date, default: Date.now }
    })
)