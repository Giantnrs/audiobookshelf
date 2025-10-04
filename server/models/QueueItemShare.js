const { DataTypes, Model } = require('sequelize')

/**
 * @typedef MediaItemQueueObject
 * @property {UUIDV4} id
 * @property {UUIDV4} userId
 * @property {Date} expiresAt
 * @property {Array<UUIDV4>} mediaItemIds
 * @property {string} slug
 * @property {Date} createdAt
 * @property {Date} updatedAt
 *
 * @typedef {MediaItemQueueObject & MediaItemQueue} MediaItemQueueModel
 */

/**
 * Model for storing a user-defined queue of media items that can be shared.
 */
class QueueShare extends Model {
  constructor(values, options) {
    super(values, options)

    /** @type {UUIDV4} */
    this.id
    /** @type {UUIDV4} */
    this.userId
    /** @type {Array<UUIDV4>} */
    this.queueItems
    /** @type {string} */
    this.slug
    /** @type {Date} */
    this.expiresAt
    /** @type {Date} */
    this.createdAt
    /** @type {Date} */
    this.updatedAt
  }

  /**

   * @returns {object}
   */
  toJSONForClient() {
    return {
      id: this.id,
      slug: this.slug,
      queueItems: this.queueItems,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  /**
   * Initialize model, including defining attributes and associations.
   *
   * @param {import('../Database').sequelize} sequelize
   */
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false
        },

        // Stores the list of media item IDs as a JSON array
        queueItems: {
          type: DataTypes.STRING,
          defaultValue: [],
          allowNull: false
        },
        slug: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'queueShare'
      }
    )

    // Define Association: A Queue belongs to a User
    const { user } = sequelize.models

    user.hasMany(MediaItemQueue)
    MediaItemQueue.belongsTo(user)
  }
}

module.exports = MediaItemQueue
