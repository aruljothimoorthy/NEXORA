const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'project_created',
        'project_updated',
        'task_created',
        'task_updated',
        'task_completed',
        'member_added',
        'comment_added',
        'system',
      ],
      default: 'system',
    },
    message: {
      type: String,
      required: true,
      maxlength: [300, 'Activity message cannot exceed 300 characters'],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
  },
  { timestamps: true },
)

activitySchema.index({ user: 1, createdAt: -1 })
activitySchema.index({ project: 1, createdAt: -1 })

module.exports = mongoose.model('Activity', activitySchema)
