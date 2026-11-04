const formatUser = (user) => {
  const doc = user.toObject ? user.toObject() : user
  return {
    id: doc._id,
    name: doc.name,
    email: doc.email,
    avatar: doc.avatar || '',
    bio: doc.bio || '',
    role: doc.role,
    settings: {
      theme: doc.settings?.theme || 'dark',
      emailNotifications: doc.settings?.emailNotifications !== false,
      pushNotifications: doc.settings?.pushNotifications !== false,
      deadlineReminders: doc.settings?.deadlineReminders !== false,
    },
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

module.exports = formatUser
