'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if tables exist
    const tableExists = async (tableName) => {
      try {
        await queryInterface.describeTable(tableName);
        return true;
      } catch (error) {
        return false;
      }
    };

    // Create orders table if it doesn't exist
    const hasOrdersTable = await tableExists('orders');
    if (!hasOrdersTable) {
      await queryInterface.createTable('orders', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false
        },
        customerEmail: {
          type: Sequelize.STRING,
          allowNull: false
        },
        customerName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        shippingAddress: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        billingAddress: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        totalAmount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        status: {
          type: Sequelize.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
          allowNull: false,
          defaultValue: 'pending'
        },
        paymentStatus: {
          type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'),
          allowNull: false,
          defaultValue: 'pending'
        },
        paymentIntentId: {
          type: Sequelize.STRING,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });
    }

    // Create order_items table if it doesn't exist
    const hasOrderItemsTable = await tableExists('order_items');
    if (!hasOrderItemsTable) {
      await queryInterface.createTable('order_items', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false
        },
        orderId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'orders',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        productSku: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'products',
            key: 'sku'
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE'
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        priceAtTime: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });
    }

    // Add indexes
    await queryInterface.addIndex('orders', ['customerEmail']);
    await queryInterface.addIndex('orders', ['status']);
    await queryInterface.addIndex('orders', ['paymentStatus']);
    await queryInterface.addIndex('order_items', ['orderId']);
    await queryInterface.addIndex('order_items', ['productSku']);
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order
    await queryInterface.dropTable('order_items');
    await queryInterface.dropTable('orders');
  }
};
