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

    // Drop tables in correct order to handle foreign key constraints
    const tables = ['favorites', 'order_items', 'products', 'product_categories'];
    
    for (const table of tables) {
      if (await tableExists(table)) {
        console.log(`Dropping table ${table}...`);
        await queryInterface.dropTable(table, { cascade: true });
      } else {
        console.log(`Table ${table} does not exist, skipping...`);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // This is a destructive migration, no down migration provided
    console.log('This migration cannot be undone');
  },
};
