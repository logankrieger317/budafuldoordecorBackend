'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        sku: 'WRE-0001-001',
        name: 'Spring Wreath',
        description: 'Beautiful spring wreath with mixed flowers',
        price: 89.99,
        category: 'Wreaths',
        width: 24,
        length: 24,
        isWired: false,
        quantity: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        sku: 'RIB-0001-001',
        name: 'Deluxe Ribbon',
        description: 'Premium quality decorative ribbon',
        price: 29.99,
        category: 'Ribbons',
        width: 3,
        length: 36,
        isWired: true,
        quantity: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        sku: 'SEA-0001-001',
        name: 'Holiday Door Hanger',
        description: 'Festive door hanger for any season',
        price: 49.99,
        category: 'Seasonal',
        width: 12,
        length: 30,
        isWired: false,
        quantity: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
