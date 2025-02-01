'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const columnExists = async (tableName, columnName) => {
      try {
        const tableDescription = await queryInterface.describeTable(tableName);
        return columnName in tableDescription;
      } catch (error) {
        console.error(`Error checking column ${columnName} in table ${tableName}:`, error);
        return false;
      }
    };

    try {
      // Check and add phone column
      const hasPhoneColumn = await columnExists('orders', 'phone');
      if (!hasPhoneColumn) {
        console.log('Adding phone column to orders table...');
        await queryInterface.addColumn('orders', 'phone', {
          type: Sequelize.STRING,
          allowNull: true
        });
      }

      // Check and add notes column
      const hasNotesColumn = await columnExists('orders', 'notes');
      if (!hasNotesColumn) {
        console.log('Adding notes column to orders table...');
        await queryInterface.addColumn('orders', 'notes', {
          type: Sequelize.TEXT,
          allowNull: true
        });
      }
    } catch (error) {
      console.error('Error in migration:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const columnExists = async (tableName, columnName) => {
      try {
        const tableDescription = await queryInterface.describeTable(tableName);
        return columnName in tableDescription;
      } catch (error) {
        return false;
      }
    };

    try {
      // Check and remove phone column
      const hasPhoneColumn = await columnExists('orders', 'phone');
      if (hasPhoneColumn) {
        await queryInterface.removeColumn('orders', 'phone');
      }

      // Check and remove notes column
      const hasNotesColumn = await columnExists('orders', 'notes');
      if (hasNotesColumn) {
        await queryInterface.removeColumn('orders', 'notes');
      }
    } catch (error) {
      console.error('Error in migration rollback:', error);
      throw error;
    }
  }
};
