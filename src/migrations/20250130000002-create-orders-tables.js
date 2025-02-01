'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Helper function to check if table exists
    const tableExists = async (tableName) => {
      try {
        await queryInterface.describeTable(tableName);
        return true;
      } catch (error) {
        return false;
      }
    };

    // Helper function to check if index exists
    const indexExists = async (tableName, indexName) => {
      try {
        const query = `
          SELECT 1
          FROM pg_indexes
          WHERE tablename = '${tableName}'
          AND indexname = '${indexName}';
        `;
        const [results] = await queryInterface.sequelize.query(query);
        return results.length > 0;
      } catch (error) {
        console.error(`Error checking index ${indexName}:`, error);
        return false;
      }
    };

    // Create orders table if it doesn't exist
    const hasOrdersTable = await tableExists('orders');
    if (!hasOrdersTable) {
      console.log('Creating orders table...');
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
      console.log('Creating order_items table...');
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

    // Add indexes if they don't exist
    const hasCustomerEmailIndex = await indexExists('orders', 'orders_customer_email');
    if (!hasCustomerEmailIndex) {
      console.log('Adding customer email index...');
      await queryInterface.addIndex('orders', ['customerEmail'], {
        name: 'orders_customer_email'
      });
    }

    const hasOrderStatusIndex = await indexExists('orders', 'orders_status');
    if (!hasOrderStatusIndex) {
      console.log('Adding order status index...');
      await queryInterface.addIndex('orders', ['status'], {
        name: 'orders_status'
      });
    }

    const hasOrderPaymentStatusIndex = await indexExists('orders', 'orders_payment_status');
    if (!hasOrderPaymentStatusIndex) {
      console.log('Adding order payment status index...');
      await queryInterface.addIndex('orders', ['paymentStatus'], {
        name: 'orders_payment_status'
      });
    }

    const hasOrderItemsOrderIdIndex = await indexExists('order_items', 'order_items_order_id');
    if (!hasOrderItemsOrderIdIndex) {
      console.log('Adding order items order id index...');
      await queryInterface.addIndex('order_items', ['orderId'], {
        name: 'order_items_order_id'
      });
    }

    const hasOrderItemsProductSkuIndex = await indexExists('order_items', 'order_items_product_sku');
    if (!hasOrderItemsProductSkuIndex) {
      console.log('Adding order items product sku index...');
      await queryInterface.addIndex('order_items', ['productSku'], {
        name: 'order_items_product_sku'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Helper function to check if index exists
    const indexExists = async (tableName, indexName) => {
      try {
        const query = `
          SELECT 1
          FROM pg_indexes
          WHERE tablename = '${tableName}'
          AND indexname = '${indexName}';
        `;
        const [results] = await queryInterface.sequelize.query(query);
        return results.length > 0;
      } catch (error) {
        return false;
      }
    };

    // Remove indexes if they exist
    const hasCustomerEmailIndex = await indexExists('orders', 'orders_customer_email');
    if (hasCustomerEmailIndex) {
      await queryInterface.removeIndex('orders', 'orders_customer_email');
    }

    const hasOrderStatusIndex = await indexExists('orders', 'orders_status');
    if (hasOrderStatusIndex) {
      await queryInterface.removeIndex('orders', 'orders_status');
    }

    const hasOrderPaymentStatusIndex = await indexExists('orders', 'orders_payment_status');
    if (hasOrderPaymentStatusIndex) {
      await queryInterface.removeIndex('orders', 'orders_payment_status');
    }

    const hasOrderItemsOrderIdIndex = await indexExists('order_items', 'order_items_order_id');
    if (hasOrderItemsOrderIdIndex) {
      await queryInterface.removeIndex('order_items', 'order_items_order_id');
    }

    const hasOrderItemsProductSkuIndex = await indexExists('order_items', 'order_items_product_sku');
    if (hasOrderItemsProductSkuIndex) {
      await queryInterface.removeIndex('order_items', 'order_items_product_sku');
    }

    // Drop tables in reverse order
    await queryInterface.dropTable('order_items', { force: true });
    await queryInterface.dropTable('orders', { force: true });
  }
};
