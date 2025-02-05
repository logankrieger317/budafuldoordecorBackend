'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the column exists first
    const table = await queryInterface.describeTable('orders');
    if (!table.userId) {
      await queryInterface.addColumn('orders', 'userId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Check if the column exists before removing it
    const table = await queryInterface.describeTable('orders');
    if (table.userId) {
      await queryInterface.removeColumn('orders', 'userId');
    }
  }
};
