'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = async (tableName) => {
      try {
        await queryInterface.describeTable(tableName);
        return true;
      } catch (error) {
        return false;
      }
    };

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
      // Check and add color column
      const hasColorColumn = await columnExists('products', 'color');
      if (!hasColorColumn) {
        console.log('Adding color column to products table...');
        await queryInterface.addColumn('products', 'color', {
          type: Sequelize.STRING,
          allowNull: true
        });
      }

      // Check and add brand column
      const hasBrandColumn = await columnExists('products', 'brand');
      if (!hasBrandColumn) {
        console.log('Adding brand column to products table...');
        await queryInterface.addColumn('products', 'brand', {
          type: Sequelize.STRING,
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
      // Check and remove color column
      const hasColorColumn = await columnExists('products', 'color');
      if (hasColorColumn) {
        await queryInterface.removeColumn('products', 'color');
      }

      // Check and remove brand column
      const hasBrandColumn = await columnExists('products', 'brand');
      if (hasBrandColumn) {
        await queryInterface.removeColumn('products', 'brand');
      }
    } catch (error) {
      console.error('Error in migration rollback:', error);
      throw error;
    }
  }
};
