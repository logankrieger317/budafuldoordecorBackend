'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if we already have ribbon products
    const existingProducts = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM ribbon_products;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (existingProducts[0].count > 0) {
      console.log('Ribbon products already seeded, skipping...');
      return;
    }

    // Seed the products
    await queryInterface.bulkInsert('ribbon_products', [
      {
        id: Sequelize.UUIDV4,
        name: 'Classic Holiday Ribbon',
        description: 'Beautiful red and green plaid ribbon perfect for holiday wreaths and decorations.',
        price: 12.99,
        imageUrl: 'https://budafuldoordecor.com/images/ribbons/holiday-plaid.jpg',
        isAvailable: true,
        ribbonLength: '3 yards',
        ribbonWidth: '2.5 inches',
        ribbonColors: '{red,green,gold}',
        ribbonPattern: 'plaid',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: Sequelize.UUIDV4,
        name: 'Spring Floral Ribbon',
        description: 'Delicate floral pattern ribbon in pastel colors, perfect for spring and summer wreaths.',
        price: 14.99,
        imageUrl: 'https://budafuldoordecor.com/images/ribbons/spring-floral.jpg',
        isAvailable: true,
        ribbonLength: '3 yards',
        ribbonWidth: '2 inches',
        ribbonColors: '{pink,lavender,sage}',
        ribbonPattern: 'floral',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: Sequelize.UUIDV4,
        name: 'Rustic Burlap Ribbon',
        description: 'Natural burlap ribbon with delicate lace trim, perfect for rustic and farmhouse style decorations.',
        price: 16.99,
        imageUrl: 'https://budafuldoordecor.com/images/ribbons/rustic-burlap.jpg',
        isAvailable: true,
        ribbonLength: '5 yards',
        ribbonWidth: '3 inches',
        ribbonColors: '{natural,cream}',
        ribbonPattern: 'burlap',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    console.log('Ribbon products seeded successfully!');
  },

  async down(queryInterface, Sequelize) {
    // Remove all seeded ribbon products
    await queryInterface.bulkDelete('ribbon_products', null, {});
  }
};
