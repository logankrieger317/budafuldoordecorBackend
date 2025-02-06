'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ribbon Products
    await queryInterface.bulkInsert('ribbon_products', [
      {
        id: uuidv4(),
        name: 'Classic Red Ribbon',
        description: 'Beautiful classic red ribbon perfect for any occasion',
        price: 12.99,
        imageUrl: '/images/ribbons/classic-red.jpg',
        isAvailable: true,
        ribbonLength: '3 feet',
        ribbonWidth: '2 inches',
        ribbonColors: ['red'],
        ribbonPattern: 'solid',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Holiday Plaid Ribbon',
        description: 'Festive plaid ribbon with red and green pattern',
        price: 15.99,
        imageUrl: '/images/ribbons/holiday-plaid.jpg',
        isAvailable: true,
        ribbonLength: '5 feet',
        ribbonWidth: '3 inches',
        ribbonColors: ['red', 'green'],
        ribbonPattern: 'plaid',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Mum Products
    await queryInterface.bulkInsert('mum_products', [
      {
        id: uuidv4(),
        name: 'Homecoming Special Mum',
        description: 'Large homecoming mum with LED lights',
        price: 89.99,
        imageUrl: '/images/mums/homecoming-special.jpg',
        isAvailable: true,
        size: 'large',
        baseColors: ['white', 'gold'],
        accentColors: ['red', 'blue'],
        hasLights: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Traditional Mum',
        description: 'Classic medium-sized mum in school colors',
        price: 59.99,
        imageUrl: '/images/mums/traditional.jpg',
        isAvailable: true,
        size: 'medium',
        baseColors: ['maroon', 'white'],
        accentColors: ['silver'],
        hasLights: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Braid Products
    await queryInterface.bulkInsert('braid_products', [
      {
        id: uuidv4(),
        name: 'Triple Twist Braid',
        description: 'Elegant triple-twisted braid in metallic colors',
        price: 24.99,
        imageUrl: '/images/braids/triple-twist.jpg',
        isAvailable: true,
        braidLength: '2 feet',
        braidColors: ['gold', 'silver', 'bronze'],
        braidPattern: 'triple-twist',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'School Spirit Braid',
        description: 'Double braid in your school colors',
        price: 19.99,
        imageUrl: '/images/braids/school-spirit.jpg',
        isAvailable: true,
        braidLength: '18 inches',
        braidColors: ['purple', 'gold'],
        braidPattern: 'double-twist',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Wreath Products
    await queryInterface.bulkInsert('wreath_products', [
      {
        id: uuidv4(),
        name: 'Autumn Harvest Wreath',
        description: 'Beautiful fall-themed wreath with autumn colors',
        price: 79.99,
        imageUrl: '/images/wreaths/autumn-harvest.jpg',
        isAvailable: true,
        diameter: '24 inches',
        baseType: 'grapevine',
        season: 'fall',
        decorations: ['autumn leaves', 'pine cones', 'berries'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Spring Blossoms Wreath',
        description: 'Fresh spring wreath with colorful flowers',
        price: 69.99,
        imageUrl: '/images/wreaths/spring-blossoms.jpg',
        isAvailable: true,
        diameter: '20 inches',
        baseType: 'wire',
        season: 'spring',
        decorations: ['tulips', 'daisies', 'greenery'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Seasonal Products
    await queryInterface.bulkInsert('seasonal_products', [
      {
        id: uuidv4(),
        name: 'Christmas Joy Decoration',
        description: 'Festive Christmas decoration with lights',
        price: 49.99,
        imageUrl: '/images/seasonal/christmas-joy.jpg',
        isAvailable: true,
        season: 'holiday',
        type: 'wall-hanging',
        theme: 'christmas',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Summer Beach Decor',
        description: 'Bright and cheerful summer-themed decoration',
        price: 39.99,
        imageUrl: '/images/seasonal/summer-beach.jpg',
        isAvailable: true,
        season: 'summer',
        type: 'table-piece',
        theme: 'beach',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('seasonal_products', null, {});
    await queryInterface.bulkDelete('wreath_products', null, {});
    await queryInterface.bulkDelete('braid_products', null, {});
    await queryInterface.bulkDelete('mum_products', null, {});
    await queryInterface.bulkDelete('ribbon_products', null, {});
  },
};
